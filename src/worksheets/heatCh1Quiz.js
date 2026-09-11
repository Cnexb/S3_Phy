import { getLang } from '../i18n.js';
import { embedPageUrl } from '../tools/embedPageUrl.js';

const JPHG01_QUIZ_VERSION = '20260910jphg01c';

/** @param {(key: string) => string} t */
export function createHeatCh1Quiz(t) {
  const wrap = document.createElement('div');
  wrap.className = 'tool-heat-ch1-quiz';

  const iframe = document.createElement('iframe');

  function iframeSrc() {
    return embedPageUrl(`heat-ch1-quiz/quiz.html?embed=1&v=${JPHG01_QUIZ_VERSION}`);
  }

  iframe.src = iframeSrc();
  iframe.title = t('quiz.practiceTitle');
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
  wrap._heatCh1QuizCleanup = () => window.removeEventListener('s3phy:lang', onLang);

  wrap.appendChild(iframe);
  return wrap;
}
