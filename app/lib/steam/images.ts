/**
 * Steam header-image quirks.
 *
 * Steam's CDN answers a request for a game that has no art at the requested
 * path with HTTP 200 and a ~1.4KB blank grayscale JPEG, rather than a 404.
 * Recent releases (Battlefield 6, app 2807960) hit this: their real art
 * lives under a content-hashed path that only the store API knows, while
 * the plain `/steam/apps/<id>/header.jpg` path serves the blank.
 *
 * Crucially this is NOT decidable from the URL's shape — the store API
 * itself returns unhashed URLs for the large majority of games, and those
 * are genuine. The only reliable signal is the response body size, so
 * detection has to happen server-side where Content-Length is visible.
 */

/**
 * The blank placeholder is ~1.4KB. Most real headers are 30KB+, but
 * minimalist art compresses far below that — Undertale's is 4,992 bytes —
 * so the cut-off sits just above the placeholder, not near typical art.
 */
const BLANK_PLACEHOLDER_MAX_BYTES = 2500;

/**
 * Checks whether a header URL actually serves art. Server-side only —
 * needs response headers the browser won't expose to an <img> tag.
 */
export async function servesRealImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) return false;
    const length = Number(res.headers.get('content-length'));
    if (!Number.isFinite(length) || length === 0) return true; // unknown: assume fine
    return length > BLANK_PLACEHOLDER_MAX_BYTES;
  } catch {
    return false;
  }
}

export { BLANK_PLACEHOLDER_MAX_BYTES };
