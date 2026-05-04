import { memo } from 'react';
import { Check, X } from 'lucide-react';
import type { ComparisonTableProps } from '@/types/components';

function CellValue({ value }: { value: string | number | boolean | null }) {
  if (value === true)  return <Check size={16} className="text-success-500 mx-auto" aria-label="Yes" />;
  if (value === false) return <X size={16} className="text-error-400 mx-auto" aria-label="No" />;
  if (value === null || value === '') return <span className="text-neutral-300">—</span>;
  return <span>{String(value)}</span>;
}

function ComparisonTable({ items, hideColumns = [], summaryRow }: ComparisonTableProps) {
  if (items.length === 0) return null;

  const allKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.properties)))
  ).filter((k) => !hideColumns.includes(k));

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
      <table className="w-full text-body-sm border-collapse" role="table">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            <th
              scope="col"
              className="sticky left-0 z-10 bg-neutral-50 text-left px-4 py-3 font-display font-semibold text-neutral-700 text-body-sm min-w-[140px] border-r border-neutral-200"
            >
              Feature
            </th>
            {items.map((item) => (
              <th
                key={item.name}
                scope="col"
                className="text-center px-4 py-3 font-display font-semibold text-neutral-900 min-w-[120px] whitespace-nowrap"
              >
                {item.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {allKeys.map((key, rowIdx) => (
            <tr
              key={key}
              className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
            >
              <td className="sticky left-0 z-10 px-4 py-3 font-medium text-neutral-700 border-r border-neutral-200 capitalize"
                style={{ background: 'inherit' }}>
                {key.replace(/_/g, ' ')}
              </td>
              {items.map((item) => (
                <td key={item.name} className="px-4 py-3 text-center text-neutral-700">
                  <CellValue value={item.properties[key] ?? null} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {summaryRow && (
          <tfoot>
            <tr className="bg-primary-50 border-t-2 border-primary-200 font-semibold">
              <td className="sticky left-0 z-10 bg-primary-50 px-4 py-3 text-primary-700 border-r border-primary-200">
                {summaryRow['label'] ?? 'Summary'}
              </td>
              {items.map((item) => (
                <td key={item.name} className="px-4 py-3 text-center text-primary-700">
                  {summaryRow[item.name] ?? '—'}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default memo(ComparisonTable);
