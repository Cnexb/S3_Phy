import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

/** @param {(key: string) => string} t */
export function createFoundationsUsefulMathQuiz(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-foundations-useful-math-quiz';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl('foundations-useful-math-quiz/quiz.html?embed=1');
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.foundationsUsefulMathTitle');
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
  wrap._foundationsUsefulMathQuizCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
