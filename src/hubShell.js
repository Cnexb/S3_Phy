import { t, getLang, setLang } from './i18n.js';
import { initHubNavResize } from './hubNavResize.js';

export const HUB_SECTIONS = ['notes', 'tools', 'worksheets', 'quiz', 'flashcards', 'summary', 'comics'];

const NAV_LABELS = {
  notes: 'nav.notes',
  tools: 'nav.tools',
  worksheets: 'nav.worksheets',
  quiz: 'nav.quiz',
  flashcards: 'nav.flashcards',
  summary: 'nav.summary',
  comics: 'nav.comics',
};

/**
 * Restore a saved hub section, or fall back when the stored value is missing or retired (e.g. "topics").
 * @param {string | null} stored
 * @param {string} [fallback]
 */
export function resolveHubSection(stored, fallback = 'notes') {
  return HUB_SECTIONS.includes(stored) ? stored : fallback;
}

/**
 * @param {HTMLElement} root
 * @param {{ subtitleKey: string, activeSection: string, onSection: (id: string) => void, onLang: () => void }} opts
 */
export function mountHubShell(root, { subtitleKey, activeSection, onSection, onLang }) {
  root.innerHTML = `
    <header class="site-header site-header--hub">
      <div class="site-header__brand">
        <button type="button" class="brand-logo-wrap" aria-label="${t('strand.back')}">
          <img class="brand-logo-img" src="${import.meta.env.BASE_URL}images/uniplus-logo.png" alt="" width="220" height="52" decoding="async" />
        </button>
        <div class="brand-text-block" style="cursor: pointer;" data-brand-home>
          <h1 class="site-title">${t('app.title')}</h1>
          <p class="site-subtitle" data-hub-subtitle>${t(subtitleKey)}</p>
        </div>
      </div>
      <nav class="main-nav" data-nav aria-label="${t('app.title')}"></nav>
      <div class="site-header__actions">
        <button type="button" class="strand-back-btn" data-strand-back>${t('strand.back')}</button>
        <div class="lang-toggle" data-lang></div>
      </div>
    </header>
    <main data-main></main>
    <footer class="site-footer no-print" data-hub-footer>${t('footer.conventions')}</footer>
  `;

  const main = root.querySelector('[data-main]');
  const nav = root.querySelector('[data-nav]');
  const langEl = root.querySelector('[data-lang]');
  const backBtn = root.querySelector('[data-strand-back]');

  let currentSection = activeSection;
  const header = root.querySelector('.site-header--hub');
  const navResize = initHubNavResize(header);

  function paintNav(sec) {
    currentSection = sec;
    nav.innerHTML = HUB_SECTIONS.map((id, i) => {
      const active = sec === id ? 'active' : '';
      const label = `${i + 1}. ${t(NAV_LABELS[id])}`;
      return `<button type="button" class="${active}" data-sec="${id}">${label}</button>`;
    }).join('');
    nav.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => onSection(btn.getAttribute('data-sec')));
    });
    requestAnimationFrame(() => navResize.check());
  }

  function paintLang() {
    langEl.innerHTML = `
      <button type="button" data-set-lang="en" class="${getLang() === 'en' ? 'active' : ''}">${t('lang.en')}</button>
      <button type="button" data-set-lang="zh-Hant" class="${getLang() === 'zh-Hant' ? 'active' : ''}">${t('lang.zhHant')}</button>
    `;
    langEl.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLang(btn.getAttribute('data-set-lang'));
        onLang();
      });
    });
  }

  function refreshLabels() {
    root.querySelector('[data-hub-subtitle]').textContent = t(subtitleKey);
    backBtn.textContent = t('strand.back');
    root.querySelector('[data-hub-footer]').textContent = t('footer.conventions');
    root.querySelector('.site-title').textContent = t('app.title');
  }

  const onBack = () => {
    window.dispatchEvent(new CustomEvent('s3phy:strand', { detail: null }));
  };
  backBtn.addEventListener('click', onBack);

  const logoBtn = root.querySelector('.brand-logo-wrap');
  if (logoBtn) {
    logoBtn.addEventListener('click', onBack);
  }

  root.querySelector('[data-brand-home]')?.addEventListener('click', onBack);

  paintNav(activeSection);
  paintLang();

  return {
    main,
    updateSection(sec) {
      paintNav(sec);
    },
    refreshLabels() {
      refreshLabels();
      paintNav(currentSection);
      paintLang();
    },
    destroy() {
      backBtn.removeEventListener('click', onBack);
      navResize.cleanup();
    },
  };
}
