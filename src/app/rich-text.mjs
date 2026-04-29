const SAFE_TAGS = new Set(['b', 'strong', 'i', 'em', 'u', 'span', 'div', 'p', 'br', 'ul', 'ol', 'li']);

export function stripUnsafeHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tag) => (SAFE_TAGS.has(tag.toLowerCase()) ? match : ''));
}
