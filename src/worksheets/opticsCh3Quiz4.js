import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPWM06_QUIZ_4_VERSION = '20260930jpwm06q4';

/** @param {(key: string) => string} t */
export function createOpticsCh3Quiz4(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-jpwm06-quiz-4';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`jpwm06-quiz-4/quiz.html?embed=1&v=${JPWM06_QUIZ_4_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.opticsCh3Title4');
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
  wrap._opticsCh3Quiz4Cleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
