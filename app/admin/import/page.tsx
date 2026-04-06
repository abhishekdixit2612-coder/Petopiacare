'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Upload, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface ParsedProduct {
  name: string;
  description: string;
  price: number;
  cost: number | null;
  sku: string;
  category: string;
  image_url: string;
  stock_quantity: number;
  variant_info?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

export default function ImportProducts() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [preview, setPreview] = useState<ParsedProduct[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [importStats, setImportStats] = useState({
    totalRows: 0,
    uniqueProducts: 0,
    variantsFound: 0,
    batchesCompleted: 0,
    totalBatches: 0,
  });
  const [progressMessage, setProgressMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError('');
    setResult(null);
    setPreview([]);
    setParsedProducts([]);
    setStep('upload');
    setImportStats({ totalRows: 0, uniqueProducts: 0, variantsFound: 0, batchesCompleted: 0, totalBatches: 0 });
    setProgressMessage('');
  };

  const parseCsvText = (csv: string) => {
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
  };

  const findColumnIndex = (headers: string[], keywords: string[]) => {
    const lowerHeaders = headers.map((h) => h.toLowerCase());
    return lowerHeaders.findIndex((h) => keywords.some((key) => h.includes(key.toLowerCase())));
  };

  const cleanHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' ')
      .trim();
  };

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

    if (!base) return option1Value.toUpperCase() || 'SKU';
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

  const parseCSV = async (file: File): Promise<ParsedProduct[]> => {
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

          const headers = rows[0].map((header) => header.trim());
          const handleIdx = findColumnIndex(headers, ['handle']);
          const titleIdx = findColumnIndex(headers, ['title']);
          const bodyIdx = findColumnIndex(headers, ['body (html)', 'body', 'description']);
          const typeIdx = findColumnIndex(headers, ['type', 'product type']);
          const priceIdx = findColumnIndex(headers, ['variant price', 'price']);
          const costIdx = findColumnIndex(headers, ['cost per item', 'cost']);
          const skuIdx = findColumnIndex(headers, ['variant sku', 'sku']);
          const stockIdx = findColumnIndex(headers, ['variant inventory qty', 'inventory qty', 'inventory', 'stock']);
          const imageIdx = findColumnIndex(headers, ['image src', 'image']);
          const option1ValueIdx = findColumnIndex(headers, ['option1 value']);
          const option1NameIdx = findColumnIndex(headers, ['option1 name']);

          if (handleIdx === -1 || titleIdx === -1 || priceIdx === -1) {
            reject(new Error('CSV missing required columns: Handle, Title, or Variant Price.'));
            return;
          }

          const productMap = new Map<
            string,
            {
              product: ParsedProduct;
              variantSizes: Set<string>;
              imageUrls: Set<string>;
              hasTitleRow: boolean;
            }
          >();

          let variantCount = 0;
          let rowCount = 0;

          for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
            const row = rows[rowIndex];
            if (!row.some((cell) => cell !== '')) continue;

            rowCount += 1;
            const handle = row[handleIdx]?.trim() || '';
            const title = row[titleIdx]?.trim() || '';
            const body = row[bodyIdx] || '';
            const type = row[typeIdx]?.trim() || 'Uncategorized';
            const price = sanitizeNumber(row[priceIdx]) || 0;
            const cost = sanitizeNumber(row[costIdx]);
            const skuValue = row[skuIdx]?.trim() || '';
            const stockQuantity = sanitizeInteger(row[stockIdx]);
            const imageUrl = row[imageIdx]?.trim() || '';
            const option1Value = row[option1ValueIdx]?.trim() || '';
            const option1Name = row[option1NameIdx]?.trim() || '';
            const hasSizeOption = option1Name?.toLowerCase() === 'size' || option1Value !== '';

            if (!handle) continue;

            const canonicalSku = skuValue || buildSku(handle, option1Value);
            const cleanDescription = cleanHtml(body).slice(0, 1000);
            const productName = title || handle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
            
            if (!productMap.has(handle)) {
              const newProduct: ParsedProduct = {
                name: productName,
                description: cleanDescription,
                price,
                cost,
                sku: canonicalSku,
                category: type || 'Uncategorized',
                image_url: imageUrl,
                stock_quantity: stockQuantity,
                variant_info: undefined,
              };

              const variantSizes = new Set<string>();
              if (option1Value) variantSizes.add(option1Value);

              productMap.set(handle, {
                product: newProduct,
                variantSizes,
                imageUrls: imageUrl ? new Set([imageUrl]) : new Set<string>(),
                hasTitleRow: Boolean(title),
              });
            } else {
              const existing = productMap.get(handle)!;
              if (option1Value) {
                existing.variantSizes.add(option1Value);
              }

              if (!existing.product.image_url && imageUrl) {
                existing.product.image_url = imageUrl;
              }

              if (!existing.product.description && cleanDescription) {
                existing.product.description = cleanDescription;
              }

              if (existing.product.price === 0 && price > 0) {
                existing.product.price = price;
              }

              if (!existing.product.sku && canonicalSku) {
                existing.product.sku = canonicalSku;
              }

              if (imageUrl) {
                existing.imageUrls.add(imageUrl);
              }

              if (title && !existing.hasTitleRow) {
                existing.product.name = title;
                existing.hasTitleRow = true;
              }

              variantCount += 1;
            }
          }

          const products = Array.from(productMap.values()).map(({ product, variantSizes, imageUrls }) => {
            const sizes = Array.from(variantSizes).filter(Boolean);
            if (sizes.length > 0) {
              product.variant_info = `Size variants available: ${sizes.join(', ')}.`;
            }
            if (imageUrls.size > 1) {
              const hasMore = imageUrls.size - 1;
              product.variant_info = product.variant_info
                ? `${product.variant_info} ${hasMore} additional image(s) available.`
                : `Additional images available in Shopify export.`;
            }
            return product;
          });

          setImportStats((current) => ({
            ...current,
            totalRows: rowCount,
            uniqueProducts: products.length,
            variantsFound: variantCount,
          }));

          resolve(products);
        } catch (parseError) {
          reject(parseError instanceof Error ? parseError : new Error('Unable to parse CSV file.'));
        }
      };

      reader.onerror = () => reject(new Error('Unable to read CSV file.'));
      reader.readAsText(file);
    });
  };

  const handlePreview = async () => {
    if (!file) {
      setError('Please select a Shopify CSV file to preview.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const products = await parseCSV(file);
      if (products.length === 0) {
        throw new Error('No valid products were found in the uploaded CSV.');
      }
      setParsedProducts(products);
      setPreview(products.slice(0, 10));
      setStep('preview');
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Failed to parse CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0) {
      setError('No products available to import. Please preview your CSV first.');
      return;
    }

    setLoading(true);
    setError('');
    setStep('importing');

    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      warnings: [],
    };

    try {
      const products = parsedProducts;
      const batchSize = 30;
      const totalBatches = Math.ceil(products.length / batchSize);
      setImportStats((current) => ({
        ...current,
        totalBatches,
        batchesCompleted: 0,
      }));

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex += 1) {
        const batchStart = batchIndex * batchSize;
        const batch = products.slice(batchStart, batchStart + batchSize).map((product) => ({
          name: product.name,
          description: product.description,
          price: product.price,
          cost: product.cost,
          sku: product.sku,
          category: product.category,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
        }));

        setProgressMessage(`Importing products ${batchStart + 1} to ${Math.min(batchStart + batchSize, products.length)}...`);

        const { error: insertError } = await supabase.from('products').insert(batch);

        if (insertError) {
          results.failed += batch.length;
          results.errors.push(`Batch ${batchIndex + 1}: ${insertError.message}`);
        } else {
          results.success += batch.length;
        }

        setImportStats((current) => ({
          ...current,
          batchesCompleted: batchIndex + 1,
        }));
      }

      if (importStats.variantsFound > 0) {
        results.warnings.push(
          `Variants were detected and consolidated by handle. Imported ${importStats.uniqueProducts} products from ${importStats.totalRows} rows. First available size was used for pricing.`
        );
      }

      setResult(results);
      setStep('complete');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Import failed while saving products.');
      setStep('preview');
    } finally {
      setLoading(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-teal-600 font-semibold">Admin import</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Import Shopify CSV</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600">
                Upload a Shopify product export, preview the mapped products, and import them into the Supabase products table.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
              <Upload size={18} /> CSV import built for Shopify exports
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Shopify CSV file</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700"
                />
              </div>

              <button
                type="button"
                onClick={handlePreview}
                disabled={!file || loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? 'Analyzing...' : 'Preview Products'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Total rows</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{importStats.totalRows}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Products detected</p>
              <p className="mt-2 text-2xl font-bold text-teal-700">{importStats.uniqueProducts}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Variants found</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">{importStats.variantsFound}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
            <p className="font-semibold">Shopify CSV mapping</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Title → name, Body (HTML) → description, Type → category, Variant Price → price, Cost per item → cost, Variant SKU → sku, Variant Inventory Qty → stock_quantity, Image Src → image_url, Option1 Value → size variant.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} />
              <div>{error}</div>
            </div>
          </div>
        )}

        {step === 'preview' && preview.length > 0 && (
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Preview products</h2>
                <p className="mt-2 text-sm text-gray-600">Review the first 10 mapped products before importing.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-700">
                {preview.length} preview rows shown
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Price</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">SKU</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Stock</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {preview.map((product, idx) => (
                    <tr key={`${product.sku}-${idx}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-teal-700">₹{product.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.stock_quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to upload
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading}
                className="w-full rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:bg-gray-300"
              >
                {loading ? 'Importing...' : 'Import all products'}
              </button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-teal-100 bg-teal-50 mb-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Import in progress</h2>
            <p className="text-sm text-gray-600">{progressMessage || 'Saving products to the database.'}</p>
            <p className="mt-4 text-sm text-gray-500">
              Batch {importStats.batchesCompleted} of {importStats.totalBatches}
            </p>
          </div>
        )}

        {step === 'complete' && result && (
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                <CheckCircle size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Import complete</h2>
                <p className="mt-2 text-sm text-gray-600">Your Shopify CSV has been imported into the products table.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Products imported</p>
                <p className="mt-2 text-3xl font-bold text-green-700">{result.success}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Failed</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">{result.failed}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Variants consolidated</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{importStats.variantsFound}</p>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-6 rounded-3xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
                <p className="font-semibold">Notes</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {result.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="mt-6 rounded-3xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900">
                <p className="font-semibold">Errors</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {result.errors.map((errorText, idx) => (
                    <li key={idx}>{errorText}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="w-full rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                View products
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setParsedProducts([]);
                  setPreview([]);
                  setResult(null);
                  setError('');
                  setStep('upload');
                  setImportStats({ totalRows: 0, uniqueProducts: 0, variantsFound: 0, batchesCompleted: 0, totalBatches: 0 });
                }}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Import another CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
