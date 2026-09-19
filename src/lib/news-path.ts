/** Store slugs unchanged; encode them as one URL segment, including reserved characters. */
export function newsPostPath(slug: string): string {
  return `/news/${encodeURIComponent(slug)}`;
}

/** Next 16.2 supplies encoded dynamic values to page code. Decode once, never normalise DB keys. */
export function newsSlugFromParam(value: string): string | null {
  try {
    const slug = decodeURIComponent(value);
    return slug && slug.length <= 200 && !/[\u0000-\u001f\u007f]/.test(slug) ? slug : null;
  } catch {
    return null;
  }
}
