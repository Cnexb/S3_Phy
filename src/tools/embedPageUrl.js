/**
 * Resolve hub iframe pages against the site root (or GitHub Pages /dist/),
 * not the current document URL. Relative `./slug/index.html` inside a nested
 * iframe becomes `/slug/slug/index.html` and Vite's SPA fallback serves the hub.
 */
export function embedPageUrl(pathWithQuery) {
  const rel = String(pathWithQuery).replace(/^\.\//, '').replace(/^\//, '');
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://127.0.0.1';
  const path = typeof window !== 'undefined' && window.location?.pathname ? window.location.pathname : '/';
  const distMatch = path.match(/^(.*\/dist)(?:\/|$)/);
  const root = distMatch ? `${origin}${distMatch[1]}/` : `${origin}/`;
  return new URL(rel, root).href;
}
