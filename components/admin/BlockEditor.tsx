'use client'

import { useState, useRef, useEffect } from 'react'
import {
  AlignLeft, Heading2, Heading3, Lightbulb, AlertTriangle,
  Info, CheckSquare, List, ListOrdered, Quote, Minus, Table2,
  ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, BookOpen, GripVertical,
} from 'lucide-react'
import type { ContentBlock, BlockType } from '@/types/blog-blocks'
import { createBlock } from '@/types/blog-blocks'
import BlockRenderer from '@/components/blog/BlockRenderer'

interface Props {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

const BLOCK_PALETTE: { type: BlockType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string; color: string }[] = [
  { type: 'paragraph',    label: 'Paragraph',    icon: AlignLeft,     desc: 'Plain text section',         color: 'text-gray-600' },
  { type: 'heading2',     label: 'H2 Heading',   icon: Heading2,      desc: 'Section title',              color: 'text-slate-700' },
  { type: 'heading3',     label: 'H3 Sub',       icon: Heading3,      desc: 'Sub-section title',          color: 'text-slate-600' },
  { type: 'tip',          label: 'Tip Box',       icon: Lightbulb,     desc: 'Green pro tip callout',      color: 'text-green-700' },
  { type: 'warning',      label: 'Warning',       icon: AlertTriangle, desc: 'Amber important callout',    color: 'text-amber-700' },
  { type: 'fact',         label: 'Fact Box',      icon: Info,          desc: 'Blue did-you-know callout',  color: 'text-blue-700' },
  { type: 'info',         label: 'Info Box',      icon: BookOpen,      desc: 'Purple note callout',        color: 'text-purple-700' },
  { type: 'summary',      label: 'Takeaways',     icon: CheckSquare,   desc: 'Checklist summary',          color: 'text-emerald-700' },
  { type: 'bullet_list',  label: 'Bullet List',   icon: List,          desc: 'Unordered list',             color: 'text-gray-600' },
  { type: 'ordered_list', label: 'Numbered List', icon: ListOrdered,   desc: 'Steps / numbered list',      color: 'text-gray-600' },
  { type: 'blockquote',   label: 'Quote',         icon: Quote,         desc: 'Highlighted quote',          color: 'text-gray-600' },
  { type: 'table',        label: 'Table',         icon: Table2,        desc: 'Comparison table',           color: 'text-orange-700' },
  { type: 'divider',      label: 'Divider',       icon: Minus,         desc: 'Section separator',          color: 'text-gray-400' },
]

const BLOCK_BADGE: Record<BlockType, { label: string; color: string }> = {
  paragraph:    { label: 'Text',       color: 'bg-gray-100 text-gray-500' },
  heading2:     { label: 'H2',         color: 'bg-slate-100 text-slate-600' },
  heading3:     { label: 'H3',         color: 'bg-slate-100 text-slate-500' },
  tip:          { label: '💡 Tip',     color: 'bg-green-100 text-green-700' },
  warning:      { label: '⚠️ Warning', color: 'bg-amber-100 text-amber-700' },
  fact:         { label: 'ℹ️ Fact',    color: 'bg-blue-100 text-blue-700' },
  info:         { label: '📖 Info',    color: 'bg-purple-100 text-purple-700' },
  summary:      { label: '✅ Takeaways',color:'bg-emerald-100 text-emerald-700'},
  bullet_list:  { label: '• List',     color: 'bg-gray-100 text-gray-500' },
  ordered_list: { label: '1. List',    color: 'bg-gray-100 text-gray-500' },
  blockquote:   { label: '" Quote',    color: 'bg-gray-100 text-gray-500' },
  table:        { label: '⊞ Table',    color: 'bg-orange-100 text-orange-700' },
  divider:      { label: '─ Divider',  color: 'bg-gray-100 text-gray-400' },
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [preview, setPreview] = useState(false)
  const [insertIdx, setInsertIdx] = useState<number | null>(null)
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setInsertIdx(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const insertBlock = (type: BlockType, afterIdx: number) => {
    const newBlock = createBlock(type)
    const arr = [...blocks]
    arr.splice(afterIdx + 1, 0, newBlock)
    onChange(arr)
    setInsertIdx(null)
  }

  const appendBlock = (type: BlockType) => {
    onChange([...blocks, createBlock(type)])
    setInsertIdx(null)
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) =>
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b))

  const deleteBlock = (id: string) => onChange(blocks.filter(b => b.id !== id))

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
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview</p>
          <button type="button" onClick={() => setPreview(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <EyeOff size={13} /> Edit
          </button>
        </div>
        <div className="border border-gray-200 rounded-2xl p-6 bg-white min-h-20">
          {blocks.length === 0
            ? <p className="text-gray-300 text-sm text-center">No content yet</p>
            : <BlockRenderer blocks={blocks} />}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {blocks.length === 0 ? 'No blocks yet' : `${blocks.length} block${blocks.length !== 1 ? 's' : ''}`}
        </p>
        <button type="button" onClick={() => setPreview(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
          <Eye size={12} /> Preview
        </button>
      </div>

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-2">
          <p className="text-gray-400 text-sm mb-4">Start building your article</p>
          <div className="flex flex-wrap justify-center gap-2">
            {BLOCK_PALETTE.slice(0, 6).map(({ type, label, icon: Icon, color }) => (
              <button key={type} type="button" onClick={() => appendBlock(type)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <Icon size={13} className={color} /> {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blocks with inline insert */}
      <div className="space-y-0">
        {blocks.map((block, idx) => (
          <div key={block.id}>
            <BlockCard
              block={block}
              isFirst={idx === 0}
              isLast={idx === blocks.length - 1}
              onUpdate={updates => updateBlock(block.id, updates)}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, 'up')}
              onMoveDown={() => moveBlock(block.id, 'down')}
            />

            {/* Inline insert zone */}
            <div className="relative h-5 group/insert flex items-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover/insert:bg-primary-100 transition-colors" />
              <button
                type="button"
                onClick={() => setInsertIdx(insertIdx === idx ? null : idx)}
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 group-hover/insert:border-primary-400 group-hover/insert:bg-primary-50 flex items-center justify-center opacity-0 group-hover/insert:opacity-100 transition-all z-10 shadow-sm"
              >
                <Plus size={11} className="text-gray-400 group-hover/insert:text-primary-600" />
              </button>

              {/* Floating palette */}
              {insertIdx === idx && (
                <div ref={paletteRef}
                  className="absolute left-1/2 -translate-x-1/2 top-6 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 w-72">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-1">Add block after</p>
                  <div className="grid grid-cols-2 gap-1">
                    {BLOCK_PALETTE.map(({ type, label, icon: Icon, desc, color }) => (
                      <button key={type} type="button"
                        onClick={() => insertBlock(type, idx)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-gray-50 text-left transition-colors group/btn">
                        <Icon size={14} className={color} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 leading-none">{label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-none truncate">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add block at end */}
      {blocks.length > 0 && (
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setInsertIdx(insertIdx === -1 ? null : -1)}
            className="w-full border border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-300 hover:text-primary-600 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={12} /> Add Block
          </button>

          {insertIdx === -1 && (
            <div ref={paletteRef}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 w-72">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-1">Choose block type</p>
              <div className="grid grid-cols-2 gap-1">
                {BLOCK_PALETTE.map(({ type, label, icon: Icon, desc, color }) => (
                  <button key={type} type="button"
                    onClick={() => appendBlock(type)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-gray-50 text-left transition-colors">
                    <Icon size={14} className={color} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-none">{label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-none truncate">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
    <div className="group/card relative flex gap-2 mb-1">
      {/* Left drag handle + move */}
      <div className="flex flex-col items-center gap-0.5 pt-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0">
        <button type="button" onClick={onMoveUp} disabled={isFirst}
          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors">
          <ChevronUp size={12} />
        </button>
        <GripVertical size={13} className="text-gray-300" />
        <button type="button" onClick={onMoveDown} disabled={isLast}
          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors">
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Block body */}
      <div className="flex-1 border border-gray-200 rounded-xl bg-white overflow-hidden group-hover/card:border-gray-300 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50/80 border-b border-gray-100">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.color}`}>{badge.label}</span>
          <button type="button" onClick={onDelete}
            className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100">
            <Trash2 size={12} />
          </button>
        </div>
        <div className="p-3">
          <BlockContentEditor block={block} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm bg-white placeholder:text-gray-300'
const textareaCls = `${inputCls} resize-none leading-relaxed`

function BlockContentEditor({ block, onUpdate }: { block: ContentBlock; onUpdate: (u: Partial<ContentBlock>) => void }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <div>
          <textarea
            value={block.content ?? ''}
            onChange={e => onUpdate({ content: e.target.value })}
            rows={4}
            placeholder="Write your paragraph here... Use **bold**, *italic*, or [link text](url)"
            className={textareaCls}
          />
          <p className="text-[10px] text-gray-300 mt-1">Tip: **bold**, *italic*, [text](url)</p>
        </div>
      )

    case 'heading2':
      return (
        <input type="text" value={block.content ?? ''} onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Section heading..." className={`${inputCls} text-xl font-bold`} />
      )

    case 'heading3':
      return (
        <input type="text" value={block.content ?? ''} onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Sub-section heading..." className={`${inputCls} text-base font-semibold`} />
      )

    case 'tip':
    case 'warning':
    case 'fact':
    case 'info': {
      const defaults: Record<string, string> = { tip: 'Pro Tip', warning: 'Important', fact: 'Did You Know?', info: 'Note' }
      return (
        <div className="space-y-2">
          <input type="text" value={block.title ?? ''} onChange={e => onUpdate({ title: e.target.value })}
            placeholder={defaults[block.type]} className={`${inputCls} font-semibold`} />
          <textarea value={block.content ?? ''} onChange={e => onUpdate({ content: e.target.value })}
            rows={3} placeholder="Box content..." className={textareaCls} />
        </div>
      )
    }

    case 'summary':
      return (
        <div className="space-y-2">
          <input type="text" value={block.title ?? ''} onChange={e => onUpdate({ title: e.target.value })}
            placeholder="Key Takeaways" className={`${inputCls} font-semibold`} />
          {(block.items ?? []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-emerald-500 font-bold shrink-0 text-sm">✓</span>
              <input type="text" value={item}
                onChange={e => { const items = [...(block.items ?? [])]; items[idx] = e.target.value; onUpdate({ items }) }}
                placeholder={`Takeaway ${idx + 1}...`} className={inputCls} />
              <button type="button" onClick={() => onUpdate({ items: (block.items ?? []).filter((_, i) => i !== idx) })}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={12} /></button>
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ items: [...(block.items ?? []), ''] })}
            className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><Plus size={11} /> Add Item</button>
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
              <input type="text" value={item}
                onChange={e => { const items = [...(block.items ?? [])]; items[idx] = e.target.value; onUpdate({ items }) }}
                placeholder={`Item ${idx + 1}...`} className={inputCls} />
              <button type="button" onClick={() => onUpdate({ items: (block.items ?? []).filter((_, i) => i !== idx) })}
                className="p-1 text-gray-300 hover:text-red-500 shrink-0"><Trash2 size={12} /></button>
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ items: [...(block.items ?? []), ''] })}
            className="text-xs font-semibold text-blue-600 flex items-center gap-1"><Plus size={11} /> Add Item</button>
        </div>
      )

    case 'blockquote':
      return (
        <div className="space-y-2">
          <textarea value={block.content ?? ''} onChange={e => onUpdate({ content: e.target.value })}
            rows={3} placeholder="Quote text..." className={`${textareaCls} italic`} />
          <input type="text" value={block.attribution ?? ''} onChange={e => onUpdate({ attribution: e.target.value })}
            placeholder="Attribution — optional (e.g. Dr. Smith)" className={inputCls} />
        </div>
      )

    case 'table':
      return <TableEditor block={block} onUpdate={onUpdate} />

    case 'divider':
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-300 font-medium">Divider</span>
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
  const cellCls = 'w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-primary-400 outline-none bg-white'

  const addColumn = () => onUpdate({ headers: [...headers, `Col ${headers.length + 1}`], rows: rows.map(r => [...r, '']) })
  const removeColumn = (ci: number) => {
    if (headers.length <= 1) return
    onUpdate({ headers: headers.filter((_, i) => i !== ci), rows: rows.map(r => r.filter((_, i) => i !== ci)) })
  }
  const addRow = () => onUpdate({ rows: [...rows, headers.map(() => '')] })
  const removeRow = (ri: number) => { if (rows.length <= 1) return; onUpdate({ rows: rows.filter((_, i) => i !== ri) }) }
  const updateHeader = (ci: number, v: string) => { const h = [...headers]; h[ci] = v; onUpdate({ headers: h }) }
  const updateCell = (ri: number, ci: number, v: string) => { const r = rows.map(row => [...row]); r[ri][ci] = v; onUpdate({ rows: r }) }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs mb-2 min-w-max">
        <thead>
          <tr>
            {headers.map((h, ci) => (
              <th key={ci} className="border border-gray-200 bg-gray-50 p-1.5 min-w-[100px]">
                <div className="flex gap-1 items-center">
                  <input value={h} onChange={e => updateHeader(ci, e.target.value)} className={`${cellCls} font-semibold`} placeholder={`Header ${ci + 1}`} />
                  <button type="button" onClick={() => removeColumn(ci)} className="text-gray-300 hover:text-red-400 shrink-0"><Trash2 size={10} /></button>
                </div>
              </th>
            ))}
            <th className="border border-gray-200 bg-gray-50 p-1.5 w-8">
              <button type="button" onClick={addColumn} className="text-blue-400 hover:text-blue-600 w-full flex justify-center"><Plus size={13} /></button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-200 p-1.5">
                  <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className={cellCls} placeholder="Cell..." />
                </td>
              ))}
              <td className="border border-gray-200 p-1.5 w-8">
                <button type="button" onClick={() => removeRow(ri)} className="text-gray-300 hover:text-red-400 w-full flex justify-center"><Trash2 size={10} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} className="text-xs font-semibold text-blue-600 flex items-center gap-1"><Plus size={11} /> Add Row</button>
    </div>
  )
}
