import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPWM06_QUIZ_2_VERSION = '20260917jpwm06q2n4';

/** @param {(key: string) => string} t */
export function createOpticsCh3Quiz2(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-jpwm06-quiz-2';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`jpwm06-quiz-2/quiz.html?embed=1&v=${JPWM06_QUIZ_2_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.opticsCh3Title2');
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
  wrap._opticsCh3Quiz2Cleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
