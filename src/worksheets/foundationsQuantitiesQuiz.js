import { getLang } from '../i18n.js';

const FOUNDATIONS_QUIZ_VERSION = '20260904a';

/** @param {(key: string) => string} t */
export function createFoundationsQuantitiesQuiz(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-foundations-quantities-quiz';

  const iframe = document.createElement('iframe');
  const base = import.meta.env.BASE_URL || '/';
  const root = base.endsWith('/') ? base : `${base}/`;

  function iframeSrc() {
    return `${root}foundations-quantities-quiz/quiz.html?embed=1&v=${FOUNDATIONS_QUIZ_VERSION}`;
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.foundationsTitle');
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
  wrap._foundationsQuantitiesQuizCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
