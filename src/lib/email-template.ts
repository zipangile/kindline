export const FOUNDATION_NAME = 'Kindline Care Foundation';
// Email clients do not inherit the website CSS. Pair foreground/background
// explicitly and keep long transaction IDs and links inside small viewports.
export const EMAIL_PANEL_STYLE = 'font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#1f2937;background-color:#ffffff;color-scheme:light;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:10px;overflow-wrap:anywhere';

export function escapeEmailHtml(text: string): string {
  return text.replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[value]!);
}

function safeLink(value: string): string | null {
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) && !url.username && !url.password ? value : null;
  } catch { return null; }
}

function decodeEntities(value: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name: string) => {
    if (!name.startsWith('#')) return named[name.toLowerCase()];
    const number = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : entity;
  });
}

function linkedText(text: string): string {
  return text.split(/(https?:\/\/[^\s<>]+)/g).map(part => {
    const href = /^https?:\/\//.test(part) ? safeLink(part) : null;
    return href ? `<a href="${escapeEmailHtml(href)}" style="color:#0077b6;text-decoration:underline;overflow-wrap:anywhere">${escapeEmailHtml(part)}</a>` : escapeEmailHtml(part);
  }).join('');
}

const styles: Record<string, string> = {
  p: 'margin:0 0 18px;line-height:1.7',
  h1: 'font-size:28px;line-height:1.25;margin:24px 0 16px;color:#075985',
  h2: 'font-size:23px;line-height:1.3;margin:24px 0 14px;color:#075985',
  h3: 'font-size:19px;line-height:1.4;margin:20px 0 12px;color:#075985',
  ul: 'margin:0 0 18px;padding-left:24px', ol: 'margin:0 0 18px;padding-left:24px',
  li: 'margin:0 0 8px;line-height:1.7',
  blockquote: 'margin:18px 0;padding:12px 20px;border-left:4px solid #0077b6',
  strong: 'font-weight:bold', b: 'font-weight:bold', em: 'font-style:italic', i: 'font-style:italic',
};

/** Rebuild a small email vocabulary; never copy user tags, CSS, images or event attributes. */
export function formatEmailContent(input: string): string {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Email content is required');
  if (input.length > 20000) throw new Error('Email content is too long');
  const text = input.replace(/\r\n?/g, '\n');
  if (!/<\/?(?:p|div|h[1-3]|br|ul|ol|li|strong|b|em|i|a|blockquote)\b/i.test(text)) {
    return text.split(/\n[ \t]*\n/).map(paragraph => `<p style="${styles.p}">${linkedText(paragraph).replace(/\n/g, '<br>')}</p>`).join('');
  }
  const cleaned = text.replace(/<(script|style|iframe|object|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const tokens = cleaned.split(/(<(?:[^>"']|"[^"]*"|'[^']*')*>)/g);
  const stack: string[] = [];
  const html = tokens.map(token => {
    const tag = /^<\s*(\/?)\s*([a-z0-9]+)\b([\s\S]*?)>$/i.exec(token);
    if (!tag) return escapeEmailHtml(decodeEntities(token)).replace(/\n/g, '<br>');
    const closing = !!tag[1];
    const name = tag[2].toLowerCase() === 'div' ? 'p' : tag[2].toLowerCase();
    if (name === 'br') return closing ? '' : '<br>';
    if (!Object.hasOwn(styles, name) && name !== 'a') return '';
    if (closing) {
      const index = stack.lastIndexOf(name);
      if (index < 0) return '';
      return stack.splice(index).reverse().map(open => `</${open}>`).join('');
    }
    if (name === 'a') {
      const attribute = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag[3]);
      const href = attribute ? safeLink(decodeEntities(attribute[1] ?? attribute[2] ?? attribute[3])) : null;
      if (!href) return '';
      stack.push(name);
      return `<a href="${escapeEmailHtml(href)}" style="color:#0077b6;text-decoration:underline">`;
    }
    stack.push(name);
    return `<${name} style="${styles[name]}">`;
  }).join('');
  return html + stack.reverse().map(name => `</${name}>`).join('');
}

export function renderCommunicationEmail(content: string, siteUrl = 'https://kindlinecare.org', logo = '/logo.png'): { html: string; text: string } {
  const origin = new URL(siteUrl);
  if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('Invalid website URL');
  const logoUrl = logo ? new URL(logo, origin).href : '';
  if (logoUrl && !/^https?:\/\//.test(logoUrl)) throw new Error('Invalid logo URL');
  const body = formatEmailContent(content);
  const footer = `${FOUNDATION_NAME} | Lusaka, Zambia`;
  const text = body.replace(/<br>|<\/(?:p|h[1-3]|li|blockquote)>/g, '\n').replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  return {
    html: `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#f3f6f8;color:#1f2937;color-scheme:light"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0"><tr><td style="padding:28px 24px;text-align:center;border-bottom:4px solid #0077b6">${logoUrl ? `<img src="${escapeEmailHtml(logoUrl)}" width="200" alt="${FOUNDATION_NAME}" style="display:block;width:200px;max-width:100%;height:auto;margin:0 auto">` : ''}<p style="font-family:Arial,sans-serif;color:#075985;font-weight:bold">${FOUNDATION_NAME}</p></td></tr><tr><td style="padding:28px 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1f2937;overflow-wrap:anywhere">${body}</td></tr><tr><td style="padding:24px;font-family:Arial,sans-serif;font-size:14px;color:#475569;text-align:center;border-top:1px solid #e2e8f0">${footer}</td></tr></table></td></tr></table></body></html>`,
    text: `${text.trim()}\n\n${footer}`,
  };
}
