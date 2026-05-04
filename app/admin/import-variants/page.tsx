'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Upload, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface ParsedVariant {
  productName: string;
  productDescription: string;
  category: string;
  productImage: string;
  variants: Array<{
    sku: string;
    variantName: string;
    option1Name: string;
    option1Value: string;
    price: number;
    cost: number | null;
    stockQuantity: number;
  }>;
}

interface ImportResult {
  productsCreated: number;
  variantsCreated: number;
  failed: number;
  errors: string[];
}

function parseCsvText(csv: string) {
  const normalized = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(current);
      rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.map((r) => r.map((cell) => cell.trim()));
}

const findColumnIndex = (headers: string[], keywords: string[]) => {
  const lowerHeaders = headers.map((h) => h.toLowerCase());
  return lowerHeaders.findIndex((h) =>
    keywords.some((kw) => h.includes(kw.toLowerCase()))
  );
};

const cleanHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeNumber = (value?: string) => {
  if (!value) return null;
  const cleaned = value.replace(/[₹,\s]/g, '').trim();
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const sanitizeInteger = (value?: string) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9-]/g, '').trim();
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildSku = (handle: string, option1Value: string) => {
  const base = handle
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toUpperCase();

  if (!base) return option1Value.trim().toUpperCase() || 'SKU';
  if (option1Value) {
    const variant = option1Value
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^A-Za-z0-9\-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
      .toUpperCase();
    return `${base}-${variant}`;
  }
  return base;
};

// Convert any Google Drive URL format to an embeddable thumbnail URL
const convertGDriveUrl = (url: string): string => {
  if (!url) return '';
  // file/d/FILE_ID format
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  // uc?id= format (already converted from a prior import attempt)
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  return url;
};

// Extract the last segment of a category breadcrumb
const extractCategory = (category: string): string => {
  const parts = category.split('>');
  return parts[parts.length - 1].trim();
};

// Detect which CSV format: Petopia custom vs Shopify
const detectFormat = (headers: string[]): 'petopia' | 'shopify' => {
  const lower = headers.map((h) => h.toLowerCase());
  if (lower.includes('product name') || lower.some((h) => h.includes('variant option'))) {
    return 'petopia';
  }
  return 'shopify';
};

function parsePetopiaFormat(rows: string[][]): ParsedVariant[] {
  const headers = rows[0].map((h) => h.trim().toLowerCase());

  const nameIdx = findColumnIndex(headers, ['product name']);
  const categoryIdx = findColumnIndex(headers, ['category']);
  const descIdx = findColumnIndex(headers, ['description']);
  const imageIdx = findColumnIndex(headers, ['image url', 'image']);
  const variantOptionIdx = findColumnIndex(headers, ['variant option']);
  const priceIdx = findColumnIndex(headers, ['price']);
  const stockIdx = findColumnIndex(headers, ['stock qty', 'stock', 'inventory']);

  if (nameIdx === -1 || priceIdx === -1) {
    throw new Error('CSV missing required columns: "Product Name" or "Price".');
  }

  const productMap = new Map<string, ParsedVariant>();

  for (let i = 1; i < rows.length; i += 1) {
    const cells = rows[i];
    const productName = cells[nameIdx]?.trim();
    if (!productName) continue;

    const rawCategory = categoryIdx !== -1 ? cells[categoryIdx]?.trim() || '' : '';
    const category = extractCategory(rawCategory) || 'Uncategorized';
    const description = descIdx !== -1 ? cleanHtml(cells[descIdx] || '').slice(0, 1000) : '';
    const rawImage = imageIdx !== -1 ? cells[imageIdx]?.trim() || '' : '';
    const image = convertGDriveUrl(rawImage);
    const variantOption = variantOptionIdx !== -1 ? cells[variantOptionIdx]?.trim() || 'Default' : 'Default';
    const priceRaw = sanitizeNumber(cells[priceIdx]);
    const price = priceRaw ?? 0;
    const stockQuantity = stockIdx !== -1 ? sanitizeInteger(cells[stockIdx]) : 0;

    // Parse option name and value from "Size - S" or "Belt Width - 0.75 Inch"
    const dashIdx = variantOption.indexOf(' - ');
    const option1Name = dashIdx !== -1 ? variantOption.slice(0, dashIdx).trim() : 'Size';
    const option1Value = dashIdx !== -1 ? variantOption.slice(dashIdx + 3).trim() : variantOption;

    const sku = buildSku(productName, option1Value);

    const variant = {
      sku,
      variantName: variantOption,
      option1Name,
      option1Value,
      price,
      cost: null,
      stockQuantity,
    };

    if (productMap.has(productName)) {
      const existing = productMap.get(productName)!;
      existing.variants.push(variant);
      if (!existing.productImage && image) {
        existing.productImage = image;
      }
    } else {
      productMap.set(productName, {
        productName,
        productDescription: description,
        category,
        productImage: image,
        variants: [variant],
      });
    }
  }

  return Array.from(productMap.values());
}

function parseShopifyFormat(rows: string[][]): ParsedVariant[] {
  const headers = rows[0].map((h) => h.trim().toLowerCase());

  const handleIdx = findColumnIndex(headers, ['handle']);
  const titleIdx = findColumnIndex(headers, ['title']);
  const bodyIdx = findColumnIndex(headers, ['body (html)', 'body', 'description']);
  const typeIdx = findColumnIndex(headers, ['type', 'product type']);
  const priceIdx = findColumnIndex(headers, ['variant price', 'price']);
  const costIdx = findColumnIndex(headers, ['cost per item', 'cost']);
  const skuIdx = findColumnIndex(headers, ['variant sku', 'sku']);
  const stockIdx = findColumnIndex(headers, ['variant inventory qty', 'inventory qty', 'inventory', 'stock']);
  const imageIdx = findColumnIndex(headers, ['image src', 'image']);
  const option1NameIdx = findColumnIndex(headers, ['option1 name']);
  const option1ValueIdx = findColumnIndex(headers, ['option1 value']);

  if (handleIdx === -1 || titleIdx === -1 || priceIdx === -1) {
    throw new Error('CSV missing required columns: Handle, Title, or Variant Price.');
  }

  const productMap = new Map<string, { product: ParsedVariant; imageUrls: Set<string>; hasTitle: boolean }>();

  for (let i = 1; i < rows.length; i += 1) {
    const cells = rows[i];
    const handle = cells[handleIdx]?.trim() || '';
    const title = cells[titleIdx]?.trim() || '';
    const body = cells[bodyIdx] || '';
    const type = cells[typeIdx]?.trim() || 'Other';
    const priceRaw = sanitizeNumber(cells[priceIdx]);
    const cost = sanitizeNumber(cells[costIdx]);
    const sku = cells[skuIdx]?.trim() || '';
    const stockQuantity = sanitizeInteger(cells[stockIdx]);
    const image = cells[imageIdx]?.trim() || '';
    const option1Name = cells[option1NameIdx]?.trim() || 'Size';
    const option1Value = cells[option1ValueIdx]?.trim() || '';
    const validPrice = priceRaw ?? 0;

    if (!handle || validPrice === 0) continue;

    const cleanDescription = cleanHtml(body).slice(0, 1000);
    const productName = title || handle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    const variantSku = sku || buildSku(handle, option1Value);
    const variantName = option1Value ? `${option1Name} ${option1Value}` : 'Default';

    const variant = {
      sku: variantSku,
      variantName,
      option1Name: option1Name || 'Size',
      option1Value: option1Value || 'Default',
      price: validPrice,
      cost,
      stockQuantity,
    };

    if (productMap.has(handle)) {
      const existing = productMap.get(handle)!;
      existing.product.variants.push(variant);
      if (!existing.product.productImage && image) existing.product.productImage = image;
      if (image) existing.imageUrls.add(image);
      if (title && !existing.hasTitle) {
        existing.product.productName = title;
        existing.product.productDescription = cleanDescription;
        existing.hasTitle = true;
      }
    } else {
      productMap.set(handle, {
        product: {
          productName: productName.trim(),
          productDescription: cleanDescription.trim(),
          category: type,
          productImage: image,
          variants: [variant],
        },
        imageUrls: image ? new Set([image]) : new Set<string>(),
        hasTitle: Boolean(title),
      });
    }
  }

  return Array.from(productMap.values()).map(({ product }) => product);
}

export default function ImportVariants() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<ParsedVariant[]>([]);
  const [preview, setPreview] = useState<ParsedVariant[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [csvFormat, setCsvFormat] = useState<'petopia' | 'shopify'>('petopia');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError('');
    setAllProducts([]);
    setPreview([]);
    setResult(null);
    setStep('upload');
  };

  const parseCSV = async (fileToParse: File): Promise<{ products: ParsedVariant[]; format: 'petopia' | 'shopify' }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvText = String(event.target?.result || '');
          const rows = parseCsvText(csvText).filter((row) => row.some((cell) => cell !== ''));

          if (rows.length < 2) {
            reject(new Error('CSV file is empty or malformed.'));
            return;
          }

          const headers = rows[0].map((h) => h.trim());
          const format = detectFormat(headers);

          const products =
            format === 'petopia' ? parsePetopiaFormat(rows) : parseShopifyFormat(rows);

          resolve({ products, format });
        } catch (parseError) {
          reject(parseError instanceof Error ? parseError : new Error('Unable to parse CSV file.'));
        }
      };

      reader.onerror = () => reject(new Error('Unable to read CSV file.'));
      reader.readAsText(fileToParse);
    });
  };

  const handlePreview = async () => {
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { products, format } = await parseCSV(file);
      if (products.length === 0) {
        throw new Error('No valid products found in the CSV.');
      }
      setCsvFormat(format);
      setAllProducts(products);
      setPreview(products.slice(0, 5));
      setStep('preview');
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Failed to parse CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!allProducts.length || !file) {
      setError('No products to import. Please run a preview first.');
      return;
    }

    setLoading(true);
    setError('');
    setStep('importing');

    const results: ImportResult = {
      productsCreated: 0,
      variantsCreated: 0,
      failed: 0,
      errors: [],
    };

    try {
      for (const product of allProducts) {
        try {
          const { data: newProduct, error: productError } = await supabase
            .from('products')
            .insert([
              {
                name: product.productName,
                description: product.productDescription,
                category: product.category,
                image_url: product.productImage,
              },
            ])
            .select('id')
            .single();

          if (productError || !newProduct) {
            throw productError || new Error('Failed to insert product row');
          }

          const variantRows = product.variants.map((variant) => ({
            product_id: newProduct.id,
            sku: variant.sku,
            variant_name: variant.variantName,
            option1_name: variant.option1Name,
            option1_value: variant.option1Value,
            price: variant.price,
            cost: variant.cost,
            stock_quantity: variant.stockQuantity,
          }));

          const { error: variantError } = await supabase.from('variants').insert(variantRows);
          if (variantError) throw variantError;

          results.productsCreated += 1;
          results.variantsCreated += product.variants.length;
        } catch (insertError) {
          results.failed += 1;
          let errorMsg = 'Unknown error';
          if (insertError instanceof Error) {
            errorMsg = insertError.message;
          } else if (typeof insertError === 'object' && insertError !== null && 'message' in insertError) {
            errorMsg = String((insertError as any).message);
          }
          results.errors.push(`"${product.productName}": ${errorMsg}`);
        }
      }

      if (results.productsCreated === 0 && results.failed === 0) {
        setError('No products were imported. Check your CSV format and try again.');
        setStep('preview');
        setLoading(false);
        return;
      }

      setResult(results);
      setStep('complete');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Import failed while saving products.');
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] font-semibold">Admin import</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Import Products with Variants</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-teal-100/90">
                Upload your Petopia product CSV or a Shopify export. Google Drive image links are converted automatically.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-3 text-sm font-semibold text-white">
              <Upload size={18} /> Supports Petopia &amp; Shopify CSVs
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          {error && (
            <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <Upload size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">Drag and drop your CSV or select a file from your computer.</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-6 w-full cursor-pointer text-sm text-gray-700"
                />
                {file && <p className="mt-4 text-sm font-semibold text-teal-700">Selected: {file.name}</p>}
              </div>

              <button
                type="button"
                onClick={handlePreview}
                disabled={!file || loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-3xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? 'Analyzing...' : 'Preview CSV'}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Products found</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">{allProducts.length}</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total variants</p>
                  <p className="mt-3 text-3xl font-bold text-teal-600">
                    {allProducts.reduce((sum, p) => sum + p.variants.length, 0)}
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Format detected</p>
                  <p className="mt-3 text-3xl font-bold text-blue-600 capitalize">{csvFormat}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview (first 5 products)</h2>
                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                  {preview.map((product, idx) => (
                    <div key={`preview-${idx}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {product.productImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0 bg-gray-100"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                              <p className="text-xs text-teal-600 font-medium">{product.category}</p>
                              <h3 className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{product.productName}</h3>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">{product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="mt-2 space-y-0.5">
                            {product.variants.slice(0, 3).map((variant) => (
                              <p key={variant.sku} className="text-xs text-gray-600">
                                • {variant.variantName}: ₹{variant.price} | Stock: {variant.stockQuantity}
                              </p>
                            ))}
                            {product.variants.length > 3 && (
                              <p className="text-xs text-gray-400">+{product.variants.length - 3} more</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="rounded-3xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={loading}
                  className="rounded-3xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:bg-gray-300"
                >
                  {loading ? 'Importing...' : `Import all ${allProducts.length} products`}
                </button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 h-14 w-14 rounded-full border-4 border-gray-200 border-t-teal-600 animate-spin" />
              <p className="text-lg font-semibold text-gray-900">Importing products and variants...</p>
              <p className="mt-3 text-sm text-gray-600">This can take a few moments for large catalogs.</p>
            </div>
          )}

          {step === 'complete' && result && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-900">Import finished successfully</h2>
                    <p className="mt-1 text-sm text-green-800">
                      Imported {result.productsCreated} products with {result.variantsCreated} variants.
                      {result.failed > 0 && ` ${result.failed} failed.`}
                    </p>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                  <h3 className="font-semibold mb-3">Errors ({result.errors.length})</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.errors.map((errorMessage, idx) => (
                      <li key={`error-${idx}`}>{errorMessage}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => router.push('/admin/products')}
                className="w-full rounded-3xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                View products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
