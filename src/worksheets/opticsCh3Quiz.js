import { getLang } from '../i18n.js';

const JPWM06_QUIZ_VERSION = '20260910jpwm06';

/** @param {(key: string) => string} t */
export function createOpticsCh3Quiz(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-optics-ch3-quiz';

  const iframe = document.createElement('iframe');
  const base = import.meta.env.BASE_URL || '/';
  const root = base.endsWith('/') ? base : `${base}/`;

  function iframeSrc() {
    return `${root}optics-ch3-quiz/quiz.html?embed=1&v=${JPWM06_QUIZ_VERSION}`;
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.opticsCh3Title');
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
  wrap._opticsCh3QuizCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}