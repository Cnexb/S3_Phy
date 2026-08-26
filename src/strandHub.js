import { t, getLang, setLang } from './i18n.js';

const STRANDS = [
  { id: 'foundations', titleKey: 'strand.foundations.title', descKey: 'strand.foundations.desc', ready: false },
  { id: 'optics', titleKey: 'strand.optics.title', descKey: 'strand.optics.desc', ready: true },
  { id: 'heat', titleKey: 'strand.heat.title', descKey: 'strand.heat.desc', ready: true },
  { id: 'mechanics', titleKey: 'strand.mechanics.title', descKey: 'strand.mechanics.desc', ready: false },
  { id: 'gas', titleKey: 'strand.gas.title', descKey: 'strand.gas.desc', ready: false },
  { id: 'waves', titleKey: 'strand.waves.title', descKey: 'strand.waves.desc', ready: false },
];

export function mountStrandHub(root) {
  function render() {
    root.innerHTML = `
      <header class="site-header site-header--strand-picker">
        <div class="site-header__brand">
          <button type="button" class="brand-logo-wrap" aria-label="${t('strand.back')}">
            <img class="brand-logo-img" src="${import.meta.env.BASE_URL}images/uniplus-logo.png" alt="" width="220" height="52" decoding="async" />
          </button>
          <div class="brand-text-block" style="cursor: pointer;" data-brand-home>
            <h1 class="site-title">${t('app.title')}</h1>
            <p class="site-subtitle">${t('app.subtitle')}</p>
          </div>
        </div>
        <div class="site-header__actions">
          <div class="lang-toggle" data-lang></div>
        </div>
      </header>
      <section class="panel panel--topic-hub panel--strand-hub">
        <h2>${t('strands.title')}</h2>
        <p class="lead">${t('strands.intro')}</p>
        <div class="grid cols-2 topic-hub-grid strand-hub-grid">
          ${STRANDS.map(({ id, titleKey, descKey, ready }) => {
            const badge = ready ? '' : ` <span class="strand-soon-badge">${t('strand.comingSoon')}</span>`;
            return `
            <div class="card${ready ? '' : ' card--coming-soon'}">
              <h3>${t(titleKey)}${badge}</h3>
              <p>${t(descKey)}</p>
              <button class="btn primary" type="button" data-strand="${id}">${t('strand.open')}</button>
            </div>`;
          }).join('')}
        </div>
      </section>
    `;

    const langEl = root.querySelector('[data-lang]');
    langEl.innerHTML = `
      <button type="button" data-set-lang="en" class="${getLang() === 'en' ? 'active' : ''}">${t('lang.en')}</button>
      <button type="button" data-set-lang="zh-Hant" class="${getLang() === 'zh-Hant' ? 'active' : ''}">${t('lang.zhHant')}</button>
    `;
    langEl.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLang(btn.getAttribute('data-set-lang'));
        render();
      });
    });

    root.querySelectorAll('[data-strand]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-strand');
        try {
          sessionStorage.setItem(`s3phy.${id}.section`, 'notes');
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new CustomEvent('s3phy:strand', { detail: id }));
      });
    });

    root.querySelector('.brand-logo-wrap').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('s3phy:strand', { detail: null }));
    });

    root.querySelector('[data-brand-home]')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('s3phy:strand', { detail: null }));
    });
  }

  const onLang = () => render();
  window.addEventListener('s3phy:lang', onLang);
  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLang);
  };
}
