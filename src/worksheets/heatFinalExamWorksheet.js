import { getLang } from '../i18n.js';

const HEAT_WORKSHEET_VERSION = '20260826s';

/** @param {(key: string) => string} t */
export function createHeatFinalExamWorksheet(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-heat-final-exam-quiz';

  const iframe = document.createElement('iframe');
  const base = import.meta.env.BASE_URL || '/';
  const root = base.endsWith('/') ? base : `${base}/`;

  function iframeSrc() {
    return `${root}f3-heat-final-exam/quiz.html?embed=1&v=${HEAT_WORKSHEET_VERSION}`;
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
  wrap._heatFinalExamWorksheetCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
