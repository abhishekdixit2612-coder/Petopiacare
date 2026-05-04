import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { DoAndDontsListProps } from '@/types/components';

function DoAndDontsList({ dos, donts, variant = 'horizontal' }: DoAndDontsListProps) {
  if (variant === 'vertical') {
    return (
      <div className="space-y-2">
        {dos.map((item, i) => (
          <div key={`do-${i}`} className="flex gap-3 p-3 bg-success-50 border border-success-100 rounded-lg">
            <CheckCircle size={16} className="text-success-600 flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-neutral-700">{item}</p>
          </div>
        ))}
        {donts.map((item, i) => (
          <div key={`dont-${i}`} className="flex gap-3 p-3 bg-error-50 border border-error-100 rounded-lg">
            <XCircle size={16} className="text-error-500 flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-neutral-700">{item}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Dos */}
      <div className="rounded-xl border border-success-200 overflow-hidden">
        <div className="bg-success-500 px-4 py-2.5 flex items-center gap-2">
          <CheckCircle size={15} className="text-white" />
          <span className="font-display font-semibold text-white text-body-sm uppercase tracking-wider">Do</span>
        </div>
        <ul className="divide-y divide-success-100">
          {dos.map((item, i) => (
            <li
              key={i}
              className={`flex gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-success-50'}`}
            >
              <CheckCircle size={15} className="text-success-500 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-neutral-700 leading-snug">{item}</p>
            </li>
          ))}
          {dos.length === 0 && (
            <li className="px-4 py-3 text-body-sm text-neutral-400 italic">No items listed.</li>
          )}
        </ul>
      </div>

      {/* Donts */}
      <div className="rounded-xl border border-error-200 overflow-hidden">
        <div className="bg-error-500 px-4 py-2.5 flex items-center gap-2">
          <XCircle size={15} className="text-white" />
          <span className="font-display font-semibold text-white text-body-sm uppercase tracking-wider">Don&apos;t</span>
        </div>
        <ul className="divide-y divide-error-100">
          {donts.map((item, i) => (
            <li
              key={i}
              className={`flex gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-error-50'}`}
            >
              <XCircle size={15} className="text-error-400 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-neutral-700 leading-snug">{item}</p>
            </li>
          ))}
          {donts.length === 0 && (
            <li className="px-4 py-3 text-body-sm text-neutral-400 italic">No items listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default memo(DoAndDontsList);
