export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

/** Match Next image/CSP sources. Reject protocol-relative URLs, credentials and active content. */
export function validateImageUrl(value: string, allowEmpty = true): string {
  if (typeof value !== 'string') throw new Error('Invalid image URL');
  const url = value;
  if (!url && allowEmpty) return '';
  let decoded: string;
  try { decoded = decodeURIComponent(url); } catch { throw new Error('Invalid image URL'); }
  if (!url || url.length > 500 || /[\\\s<>"'(),;{}\u0000-\u001f\u007f]/.test(decoded)) throw new Error('Invalid image URL');
  if (url.startsWith('/')) {
    // Public raster assets only, never action/API routes, traversal or encoded separators.
    if (!/^\/(?:[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|gif)|(?:images|uploads|storage)\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|gif))(?:\?v=[a-zA-Z0-9_-]+)?$/i.test(url) || url.includes('..')) {
      throw new Error('Use a public raster image path');
    }
    return url;
  }
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('Invalid image URL'); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port ||
      !['images.unsplash.com', 'ellswjqkvfcgiaqjuvkn.supabase.co'].includes(parsed.hostname)) {
    throw new Error('Use an uploaded image or an approved HTTPS image source');
  }
  if (parsed.hash || (parsed.hostname === 'images.unsplash.com'
    ? !/^\/photo-[a-zA-Z0-9-]+$/.test(parsed.pathname)
    : !/^\/storage\/v1\/object\/public\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|gif)$/i.test(parsed.pathname)) || parsed.pathname.includes('..')) {
    throw new Error('Use a public raster image URL');
  }
  return url;
}

/** Also screen stored values: previously accepted input must not create extra CSS sources. */
export function imageBackgroundStyle(value?: string): string | undefined {
  try {
    const url = validateImageUrl(value ?? '');
    return url ? `url(${JSON.stringify(url)})` : undefined;
  } catch { return undefined; }
}

/** Signature prefilter only; uploads MUST additionally pass full raster decoding. */
export function imageExtension(bytes: Uint8Array, mime: string): string {
  if (!bytes.length || bytes.length > IMAGE_MAX_BYTES) throw new Error('Choose an image up to 5 MB');
  const matches = (values: number[], offset = 0) => values.every((value, i) => bytes[offset + i] === value);
  if (mime === 'image/png' && matches([137, 80, 78, 71, 13, 10, 26, 10])) return 'png';
  if (mime === 'image/jpeg' && matches([255, 216, 255])) return 'jpg';
  if (mime === 'image/gif' && (matches([71, 73, 70, 56, 55, 97]) || matches([71, 73, 70, 56, 57, 97]))) return 'gif';
  if (mime === 'image/webp' && matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8)) return 'webp';
  throw new Error('File contents must match JPG, PNG, WEBP or GIF');
}
