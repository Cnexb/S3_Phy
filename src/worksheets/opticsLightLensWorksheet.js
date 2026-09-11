import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

/** @param {(key: string) => string} t */
export function createOpticsLightLensWorksheet(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-optics-light-lens-quiz';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl('optics-light-lens/quiz.html?embed=1&v=20260911noloop');
  }

  iframe.src = iframeSrc();
  iframe.title = t('worksheets.practiceTitle');
  iframe.setAttribute('loading', 'lazy');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  const onLang = () => {
    try {
      iframe.contentWindow?.postMessage({ type: 's3phy:lang', lang: getLang() }, '*');
    } catch {
      iframe.src = iframeSrc();
    }
  };

  window.addEventListener('s3phy:lang', onLang);
  wrap._opticsLightLensWorksheetCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}