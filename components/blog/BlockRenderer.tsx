import type { ContentBlock } from '@/types/blog-blocks'
import { Lightbulb, AlertTriangle, Info, CheckCircle2, BookOpen } from 'lucide-react'

interface Props {
  blocks: ContentBlock[]
}

export default function BlockRenderer({ blocks }: Props) {
  return (
    <div className="space-y-0">
      {blocks.map(block => (
        <BlockItem key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockItem({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-[1.0625rem] leading-[1.85] text-neutral-700 my-5">
          {block.content}
        </p>
      )

    case 'heading2':
      return (
        <h2 className="font-display font-bold text-[1.6rem] leading-tight text-neutral-900 mt-12 mb-5 pb-3 border-b border-neutral-100">
          {block.content}
        </h2>
      )

    case 'heading3':
      return (
        <h3 className="font-display font-bold text-[1.2rem] text-neutral-900 mt-8 mb-3">
          {block.content}
        </h3>
      )

    case 'tip':
      return (
        <div className="flex gap-4 bg-green-50 border border-green-200 rounded-2xl p-5 my-7">
          <div className="shrink-0 w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
            <Lightbulb size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-green-800 text-sm mb-1.5">{block.title || 'Pro Tip'}</p>
            <p className="text-green-900/80 text-[0.9375rem] leading-relaxed">{block.content}</p>
          </div>
        </div>
      )

    case 'warning':
      return (
        <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 my-7">
          <div className="shrink-0 w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <AlertTriangle size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-amber-800 text-sm mb-1.5">{block.title || 'Important'}</p>
            <p className="text-amber-900/80 text-[0.9375rem] leading-relaxed">{block.content}</p>
          </div>
        </div>
      )

    case 'fact':
      return (
        <div className="flex gap-4 bg-blue-50 border border-blue-200 rounded-2xl p-5 my-7">
          <div className="shrink-0 w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Info size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-blue-800 text-sm mb-1.5">{block.title || 'Did You Know?'}</p>
            <p className="text-blue-900/80 text-[0.9375rem] leading-relaxed">{block.content}</p>
          </div>
        </div>
      )

    case 'info':
      return (
        <div className="flex gap-4 bg-purple-50 border border-purple-200 rounded-2xl p-5 my-7">
          <div className="shrink-0 w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-purple-800 text-sm mb-1.5">{block.title || 'Note'}</p>
            <p className="text-purple-900/80 text-[0.9375rem] leading-relaxed">{block.content}</p>
          </div>
        </div>
      )

    case 'summary':
      return (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 my-8">
          <p className="font-bold text-primary-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-primary-600" />
            {block.title || 'Key Takeaways'}
          </p>
          <ul className="space-y-3">
            {(block.items ?? []).filter(Boolean).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-primary-900/80 text-[0.9375rem]">
                <span className="shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle2 size={11} className="text-white" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )

    case 'bullet_list':
      return (
        <ul className="space-y-2.5 my-5 pl-1">
          {(block.items ?? []).filter(Boolean).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-[1.0625rem] leading-relaxed text-neutral-700">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-[0.65rem]" />
              {item}
            </li>
          ))}
        </ul>
      )

    case 'ordered_list':
      return (
        <ol className="space-y-2.5 my-5">
          {(block.items ?? []).filter(Boolean).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-[1.0625rem] leading-relaxed text-neutral-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-neutral-100 text-neutral-500 text-xs font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )

    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-primary-300 pl-6 my-8">
          <p className="text-[1.0625rem] leading-relaxed text-neutral-600 italic">{block.content}</p>
          {block.attribution && (
            <p className="mt-2 text-sm text-neutral-400 font-medium">— {block.attribution}</p>
          )}
        </blockquote>
      )

    case 'table':
      return (
        <div className="overflow-x-auto my-8 rounded-xl border border-neutral-200 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {(block.headers ?? []).map((h, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-sm text-neutral-600 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-neutral-700 text-[0.9375rem] border-t border-neutral-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'divider':
      return <hr className="my-10 border-neutral-200" />

    default:
      return null
  }
}
