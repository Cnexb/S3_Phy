import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const FOUNDATIONS_WORKSHEET_VERSION = '20260901a';

/** @param {(key: string) => string} t */
export function createFoundationsNotesWorksheet(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-foundations-notes-quiz';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`foundations-notes/quiz.html?embed=1&v=${FOUNDATIONS_WORKSHEET_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('worksheets.foundationsNotesTitle');
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
  wrap._foundationsNotesWorksheetCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
