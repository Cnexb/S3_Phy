import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPHG02_QUIZ_4_VERSION = '20261021jphg02q4';

/** @param {(key: string) => string} t */
export function createHeatJphg02Quiz4(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-jphg02-quiz-4';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`jphg02-quiz-4/quiz.html?embed=1&v=${JPHG02_QUIZ_4_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.jphg02Title4');
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
  wrap._heatJphg02Quiz4Cleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
