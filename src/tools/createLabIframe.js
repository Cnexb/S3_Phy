import { getLang } from '../i18n.js';

export function createLabIframe(t, opts) {
  const { slug, titleKey, className, entry = 'index.html', langParam = true, extraParams = () => '' } = opts;
  const wrap = document.createElement('div');
  wrap.className = `${className} tool-lab-embed`;
  const iframe = document.createElement('iframe');
  const base = import.meta.env.BASE_URL || '/';
  const root = base.endsWith('/') ? base : `${base}/`;
  function iframeSrc() {
    const labLang = getLang() === 'zh-Hant' ? 'zh' : 'en';
    const lang = langParam ? `&lang=${encodeURIComponent(labLang)}` : '';
    const extra = extraParams();
    const q = entry.includes('?') ? '&' : '?';
    return `${root}${slug}/${entry}${q}embed=1${lang}${extra}`;
  }
  iframe.src = iframeSrc();
  iframe.title = t(titleKey);
  iframe.setAttribute('loading', 'lazy');
  iframe.allowFullscreen = true;
  iframe.setAttribute('allow', 'fullscreen');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  const onLang = () => {
    try { iframe.contentWindow?.postMessage({ type: 's3phy:lang', lang: getLang() }, '*'); }
    catch { iframe.src = iframeSrc(); }
  };
  window.addEventListener('s3phy:lang', onLang);
  wrap._labIframeCleanup = () => window.removeEventListener('s3phy:lang', onLang);
  wrap.appendChild(iframe);
  return wrap;
}