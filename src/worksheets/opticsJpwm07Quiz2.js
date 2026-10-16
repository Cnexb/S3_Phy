import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPWM07_QUIZ_2_VERSION = '20261015jpwm07q2';

/** @param {(key: string) => string} t */
export function createOpticsJpwm07Quiz2(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-jpwm07-quiz-2';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`jpwm07-quiz-2/quiz.html?embed=1&v=${JPWM07_QUIZ_2_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.jpwm07Title2');
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
  wrap._opticsJpwm07Quiz2Cleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
