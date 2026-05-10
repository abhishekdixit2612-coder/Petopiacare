'use client'

import { useState } from 'react'
import {
  AlignLeft, Heading2, Heading3, Lightbulb, AlertTriangle,
  Info, CheckSquare, List, ListOrdered, Quote, Minus, Table2,
  ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, BookOpen,
} from 'lucide-react'
import type { ContentBlock, BlockType } from '@/types/blog-blocks'
import { createBlock } from '@/types/blog-blocks'
import BlockRenderer from '@/components/blog/BlockRenderer'

interface Props {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

const BLOCK_PALETTE: { type: BlockType; label: string; icon: React.ComponentType<{ size?: number }>; color: string }[] = [
  { type: 'paragraph',    label: 'Paragraph',   icon: AlignLeft,      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { type: 'heading2',     label: 'H2 Heading',  icon: Heading2,       color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { type: 'heading3',     label: 'H3 Sub',      icon: Heading3,       color: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
  { type: 'tip',          label: 'Tip Box',     icon: Lightbulb,      color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { type: 'warning',      label: 'Warning',     icon: AlertTriangle,  color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { type: 'fact',         label: 'Fact Box',    icon: Info,           color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { type: 'info',         label: 'Info Box',    icon: BookOpen,       color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { type: 'summary',      label: 'Takeaways',   icon: CheckSquare,    color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { type: 'bullet_list',  label: 'Bullets',     icon: List,           color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { type: 'ordered_list', label: 'Numbered',    icon: ListOrdered,    color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { type: 'blockquote',   label: 'Quote',       icon: Quote,          color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { type: 'table',        label: 'Table',       icon: Table2,         color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { type: 'divider',      label: 'Divider',     icon: Minus,          color: 'bg-gray-100 text-gray-500 hover:bg-gray-200' },
]

const BLOCK_BADGE: Record<BlockType, { label: string; color: string }> = {
  paragraph:    { label: 'Paragraph',   color: 'bg-gray-100 text-gray-600' },
  heading2:     { label: 'H2 Heading',  color: 'bg-slate-100 text-slate-700' },
  heading3:     { label: 'H3 Sub',      color: 'bg-slate-100 text-slate-600' },
  tip:          { label: '💡 Tip',      color: 'bg-green-100 text-green-700' },
  warning:      { label: '⚠️ Warning',  color: 'bg-amber-100 text-amber-700' },
  fact:         { label: 'ℹ️ Fact',     color: 'bg-blue-100 text-blue-700' },
  info:         { label: '📖 Info',     color: 'bg-purple-100 text-purple-700' },
  summary:      { label: '✅ Takeaways',color: 'bg-emerald-100 text-emerald-700' },
  bullet_list:  { label: '• Bullets',   color: 'bg-gray-100 text-gray-600' },
  ordered_list: { label: '1. Numbered', color: 'bg-gray-100 text-gray-600' },
  blockquote:   { label: '" Quote',     color: 'bg-gray-100 text-gray-600' },
  table:        { label: '⊞ Table',     color: 'bg-orange-100 text-orange-700' },
  divider:      { label: '— Divider',   color: 'bg-gray-100 text-gray-400' },
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [preview, setPreview] = useState(false)

  const addBlock = (type: BlockType) => onChange([...blocks, createBlock(type)])

  const updateBlock = (id: string, updates: Partial<ContentBlock>) =>
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b))

  const deleteBlock = (id: string) =>
    onChange(blocks.filter(b => b.id !== id))

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === blocks.length - 1) return
    const arr = [...blocks]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[arr[idx], arr[swap]] = [arr[swap], arr[idx]]
    onChange(arr)
  }

  if (preview) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview</p>
          <button
            type="button"
            onClick={() => setPreview(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <EyeOff size={13} /> Exit Preview
          </button>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-white min-h-32">
          {blocks.length === 0
            ? <p className="text-gray-400 text-sm text-center">No blocks yet</p>
            : <BlockRenderer blocks={blocks} />
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Block palette */}
      <div className="flex flex-wrap gap-1.5 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest self-center mr-1 shrink-0">
          + Block:
        </span>
        {BLOCK_PALETTE.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${color}`}
          >
            <Icon size={11} /> {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Eye size={11} /> Preview
        </button>
      </div>

      {/* Blocks list */}
      <div className="space-y-2">
        {blocks.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-400 text-sm mb-1">No content blocks yet</p>
            <p className="text-gray-300 text-xs">Click a block type above to start building your article</p>
          </div>
        )}

        {blocks.map((block, idx) => (
          <BlockCard
            key={block.id}
            block={block}
            isFirst={idx === 0}
            isLast={idx === blocks.length - 1}
            onUpdate={updates => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
          />
        ))}
      </div>

      {blocks.length > 0 && (
        <button
          type="button"
          onClick={() => addBlock('paragraph')}
          className="mt-2 w-full border border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-400 hover:text-primary-600 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={12} /> Add Paragraph
        </button>
      )}
    </div>
  )
}

interface BlockCardProps {
  block: ContentBlock
  isFirst: boolean
  isLast: boolean
  onUpdate: (updates: Partial<ContentBlock>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function BlockCard({ block, isFirst, isLast, onUpdate, onDelete, onMoveUp, onMoveDown }: BlockCardProps) {
  const badge = BLOCK_BADGE[block.type]
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-100">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.color}`}>{badge.label}</span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onMoveUp} disabled={isFirst}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-25 transition-colors">
            <ChevronUp size={13} />
          </button>
          <button type="button" onClick={onMoveDown} disabled={isLast}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-25 transition-colors">
            <ChevronDown size={13} />
          </button>
          <button type="button" onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors ml-1">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <BlockContentEditor block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white'
const textareaCls = `${inputCls} resize-none leading-relaxed`

function BlockContentEditor({ block, onUpdate }: { block: ContentBlock; onUpdate: (u: Partial<ContentBlock>) => void }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <textarea
          value={block.content ?? ''}
          onChange={e => onUpdate({ content: e.target.value })}
          rows={4}
          placeholder="Write your paragraph here..."
          className={textareaCls}
        />
      )

    case 'heading2':
      return (
        <input
          type="text"
          value={block.content ?? ''}
          onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Section heading..."
          className={`${inputCls} text-xl font-bold`}
        />
      )

    case 'heading3':
      return (
        <input
          type="text"
          value={block.content ?? ''}
          onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Sub-section heading..."
          className={`${inputCls} text-base font-semibold`}
        />
      )

    case 'tip':
    case 'warning':
    case 'fact':
    case 'info': {
      const placeholders: Record<string, string> = {
        tip: 'Pro Tip', warning: 'Important', fact: 'Did You Know?', info: 'Note',
      }
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.title ?? ''}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder={placeholders[block.type]}
            className={`${inputCls} font-semibold`}
          />
          <textarea
            value={block.content ?? ''}
            onChange={e => onUpdate({ content: e.target.value })}
            rows={3}
            placeholder="Box content..."
            className={textareaCls}
          />
        </div>
      )
    }

    case 'summary':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.title ?? ''}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder="Key Takeaways"
            className={`${inputCls} font-semibold`}
          />
          {(block.items ?? []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-emerald-500 font-bold shrink-0 text-sm">✓</span>
              <input
                type="text"
                value={item}
                onChange={e => {
                  const items = [...(block.items ?? [])]
                  items[idx] = e.target.value
                  onUpdate({ items })
                }}
                placeholder={`Takeaway ${idx + 1}...`}
                className={inputCls}
              />
              <button type="button" onClick={() => onUpdate({ items: (block.items ?? []).filter((_, i) => i !== idx) })}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ items: [...(block.items ?? []), ''] })}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-1">
            <Plus size={11} /> Add Item
          </button>
        </div>
      )

    case 'bullet_list':
    case 'ordered_list':
      return (
        <div className="space-y-2">
          {(block.items ?? []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-gray-400 text-xs font-mono shrink-0 w-5 text-center">
                {block.type === 'ordered_list' ? `${idx + 1}.` : '•'}
              </span>
              <input
                type="text"
                value={item}
                onChange={e => {
                  const items = [...(block.items ?? [])]
                  items[idx] = e.target.value
                  onUpdate({ items })
                }}
                placeholder={`Item ${idx + 1}...`}
                className={inputCls}
              />
              <button type="button" onClick={() => onUpdate({ items: (block.items ?? []).filter((_, i) => i !== idx) })}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ items: [...(block.items ?? []), ''] })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1">
            <Plus size={11} /> Add Item
          </button>
        </div>
      )

    case 'blockquote':
      return (
        <div className="space-y-2">
          <textarea
            value={block.content ?? ''}
            onChange={e => onUpdate({ content: e.target.value })}
            rows={3}
            placeholder="Quote text..."
            className={`${textareaCls} italic`}
          />
          <input
            type="text"
            value={block.attribution ?? ''}
            onChange={e => onUpdate({ attribution: e.target.value })}
            placeholder="Attribution — optional (e.g. Dr. Smith, 2024)"
            className={inputCls}
          />
        </div>
      )

    case 'table':
      return <TableEditor block={block} onUpdate={onUpdate} />

    case 'divider':
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-400 font-medium">Section Divider</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )

    default:
      return null
  }
}

function TableEditor({ block, onUpdate }: { block: ContentBlock; onUpdate: (u: Partial<ContentBlock>) => void }) {
  const headers = block.headers ?? ['Column 1', 'Column 2']
  const rows = block.rows ?? [headers.map(() => '')]

  const cellCls = 'w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 outline-none bg-white'

  const addColumn = () => {
    onUpdate({
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map(row => [...row, '']),
    })
  }

  const removeColumn = (ci: number) => {
    if (headers.length <= 1) return
    onUpdate({
      headers: headers.filter((_, i) => i !== ci),
      rows: rows.map(row => row.filter((_, i) => i !== ci)),
    })
  }

  const addRow = () => onUpdate({ rows: [...rows, headers.map(() => '')] })

  const removeRow = (ri: number) => {
    if (rows.length <= 1) return
    onUpdate({ rows: rows.filter((_, i) => i !== ri) })
  }

  const updateHeader = (ci: number, val: string) => {
    const h = [...headers]; h[ci] = val; onUpdate({ headers: h })
  }

  const updateCell = (ri: number, ci: number, val: string) => {
    const r = rows.map(row => [...row]); r[ri][ci] = val; onUpdate({ rows: r })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs mb-2 min-w-max">
        <thead>
          <tr>
            {headers.map((h, ci) => (
              <th key={ci} className="border border-gray-200 bg-gray-50 p-1.5 min-w-[120px]">
                <div className="flex gap-1 items-center">
                  <input value={h} onChange={e => updateHeader(ci, e.target.value)}
                    className={`${cellCls} font-semibold`} placeholder={`Header ${ci + 1}`} />
                  <button type="button" onClick={() => removeColumn(ci)}
                    className="text-gray-300 hover:text-red-400 shrink-0 transition-colors">
                    <Trash2 size={10} />
                  </button>
                </div>
              </th>
            ))}
            <th className="border border-gray-200 bg-gray-50 p-1.5 w-8">
              <button type="button" onClick={addColumn}
                className="text-blue-400 hover:text-blue-600 w-full flex justify-center transition-colors">
                <Plus size={13} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-200 p-1.5">
                  <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)}
                    className={cellCls} placeholder="Cell..." />
                </td>
              ))}
              <td className="border border-gray-200 p-1.5 w-8">
                <button type="button" onClick={() => removeRow(ri)}
                  className="text-gray-300 hover:text-red-400 w-full flex justify-center transition-colors">
                  <Trash2 size={10} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow}
        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
        <Plus size={11} /> Add Row
      </button>
    </div>
  )
}
