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

/** Convert existing HTML blog content into editable ContentBlocks. Runs client-side only. */
export function parseHtmlToBlocks(html: string): ContentBlock[] {
  if (typeof window === 'undefined' || !html?.trim()) return []

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const blocks: ContentBlock[] = []
  const textOf = (el: Element) => el.textContent?.trim() ?? ''

  const processNode = (node: Element) => {
    const tag = node.tagName?.toLowerCase() ?? ''
    const cls = (node as HTMLElement).className ?? ''

    switch (tag) {
      case 'h2':
        if (textOf(node)) blocks.push({ id: crypto.randomUUID(), type: 'heading2', content: textOf(node) })
        break
      case 'h3':
        if (textOf(node)) blocks.push({ id: crypto.randomUUID(), type: 'heading3', content: textOf(node) })
        break
      case 'p': {
        const t = node.innerHTML?.replace(/<strong>(.*?)<\/strong>/gi, '**$1**').replace(/<em>(.*?)<\/em>/gi, '*$1*').replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)').replace(/<[^>]+>/g, '').trim()
        if (t) blocks.push({ id: crypto.randomUUID(), type: 'paragraph', content: t })
        break
      }
      case 'ul': {
        const items = Array.from(node.querySelectorAll('li')).map(li => textOf(li)).filter(Boolean)
        if (items.length) blocks.push({ id: crypto.randomUUID(), type: 'bullet_list', items })
        break
      }
      case 'ol': {
        const items = Array.from(node.querySelectorAll('li')).map(li => textOf(li)).filter(Boolean)
        if (items.length) blocks.push({ id: crypto.randomUUID(), type: 'ordered_list', items })
        break
      }
      case 'blockquote': {
        const t = textOf(node)
        if (t) blocks.push({ id: crypto.randomUUID(), type: 'blockquote', content: t })
        break
      }
      case 'table': {
        const headers = Array.from(node.querySelectorAll('th')).map(th => textOf(th))
        const rows = Array.from(node.querySelectorAll('tbody tr')).map(tr =>
          Array.from(tr.querySelectorAll('td')).map(td => textOf(td))
        ).filter(r => r.some(Boolean))
        if (headers.length) blocks.push({ id: crypto.randomUUID(), type: 'table', headers, rows })
        break
      }
      case 'hr':
        blocks.push({ id: crypto.randomUUID(), type: 'divider' })
        break
      case 'div': {
        if (cls.includes('blog-tip')) {
          const label = node.querySelector('.blog-callout-label')?.textContent?.trim() ?? 'Pro Tip'
          const content = Array.from(node.querySelectorAll('p')).filter(p => !p.className.includes('blog-callout-label')).map(p => textOf(p)).join(' ')
          blocks.push({ id: crypto.randomUUID(), type: 'tip', title: label, content })
        } else if (cls.includes('blog-warning')) {
          const label = node.querySelector('.blog-callout-label')?.textContent?.trim() ?? 'Important'
          const content = Array.from(node.querySelectorAll('p')).filter(p => !p.className.includes('blog-callout-label')).map(p => textOf(p)).join(' ')
          blocks.push({ id: crypto.randomUUID(), type: 'warning', title: label, content })
        } else if (cls.includes('blog-fact')) {
          const label = node.querySelector('.blog-callout-label')?.textContent?.trim() ?? 'Did You Know?'
          const content = Array.from(node.querySelectorAll('p')).filter(p => !p.className.includes('blog-callout-label')).map(p => textOf(p)).join(' ')
          blocks.push({ id: crypto.randomUUID(), type: 'fact', title: label, content })
        } else if (cls.includes('blog-summary') || cls.includes('blog-takeaway')) {
          const title = node.querySelector('.blog-summary-title')?.textContent?.trim() ?? 'Key Takeaways'
          const items = Array.from(node.querySelectorAll('li')).map(li => textOf(li)).filter(Boolean)
          if (items.length) blocks.push({ id: crypto.randomUUID(), type: 'summary', title, items })
          else {
            const content = textOf(node)
            if (content) blocks.push({ id: crypto.randomUUID(), type: 'info', title, content })
          }
        } else {
          Array.from(node.children).forEach(child => processNode(child as Element))
        }
        break
      }
      default:
        if (node.children.length > 0) Array.from(node.children).forEach(child => processNode(child as Element))
        break
    }
  }

  const root = doc.body.children[0]
  if (root) Array.from(root.children).forEach(node => processNode(node as Element))

  return blocks
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
