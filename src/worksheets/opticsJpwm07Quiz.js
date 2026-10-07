import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPWM07_QUIZ_VERSION = '20261007jpwm07q1';

/** @param {(key: string) => string} t */
export function createOpticsJpwm07Quiz(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-jpwm07-quiz';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`jpwm07-quiz/quiz.html?embed=1&v=${JPWM07_QUIZ_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.jpwm07Title');
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
  wrap._opticsJpwm07QuizCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
