export type BlockType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'tip'
  | 'warning'
  | 'fact'
  | 'info'
  | 'summary'
  | 'bullet_list'
  | 'ordered_list'
  | 'blockquote'
  | 'table'
  | 'divider'

export interface ContentBlock {
  id: string
  type: BlockType
  content?: string
  title?: string
  items?: string[]
  attribution?: string
  headers?: string[]
  rows?: string[][]
}

export function isBlockContent(content: string): boolean {
  if (!content || !content.trim().startsWith('[')) return false
  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed)
  } catch {
    return false
  }
}

export function parseBlocks(content: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) return parsed as ContentBlock[]
  } catch {}
  return []
}

export function serializeBlocks(blocks: ContentBlock[]): string {
  return JSON.stringify(blocks)
}

export function countWordsInBlocks(blocks: ContentBlock[]): number {
  let text = ''
  for (const block of blocks) {
    if (block.content) text += ' ' + block.content
    if (block.title) text += ' ' + block.title
    if (block.items) text += ' ' + block.items.join(' ')
    if (block.headers) text += ' ' + block.headers.join(' ')
    if (block.rows) text += ' ' + block.rows.flat().join(' ')
    if (block.attribution) text += ' ' + block.attribution
  }
  return text.split(/\s+/).filter(Boolean).length
}

export function createBlock(type: BlockType): ContentBlock {
  const id = crypto.randomUUID()
  switch (type) {
    case 'paragraph':    return { id, type, content: '' }
    case 'heading2':     return { id, type, content: '' }
    case 'heading3':     return { id, type, content: '' }
    case 'tip':          return { id, type, title: 'Pro Tip', content: '' }
    case 'warning':      return { id, type, title: 'Important', content: '' }
    case 'fact':         return { id, type, title: 'Did You Know?', content: '' }
    case 'info':         return { id, type, title: 'Note', content: '' }
    case 'summary':      return { id, type, title: 'Key Takeaways', items: [''] }
    case 'bullet_list':  return { id, type, items: [''] }
    case 'ordered_list': return { id, type, items: [''] }
    case 'blockquote':   return { id, type, content: '', attribution: '' }
    case 'table':        return { id, type, headers: ['Column 1', 'Column 2'], rows: [['', '']] }
    case 'divider':      return { id, type }
    default:             return { id, type: 'paragraph', content: '' }
  }
}
