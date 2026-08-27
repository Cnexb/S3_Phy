import { t, getLang, setLang } from './i18n.js';
import { getTheme, toggleTheme } from './theme.js';

const SESSION_KEY = 'uniplus_session';

export function readUniplusSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function displayNameFromSession(session) {
  if (!session) return t('profile.guest');
  const name = session.displayName || session.name || session.studentName || session.epStudentId;
  if (name) return String(name);
  return t('profile.student');
}

export function profileMenuMarkup() {
  return `
    <div class="profile-menu" data-profile-menu>
      <button type="button" class="profile-menu__btn" data-profile-btn aria-haspopup="true" aria-expanded="false" aria-controls="profile-menu-panel" aria-label="${t('profile.open')}">
        <span class="material-symbols-outlined" aria-hidden="true">account_circle</span>
      </button>
      <div class="profile-menu__panel" id="profile-menu-panel" data-profile-panel hidden role="menu">
        <div class="profile-menu__head">
          <span class="material-symbols-outlined profile-menu__avatar" aria-hidden="true">account_circle</span>
          <div class="profile-menu__identity">
            <p class="profile-menu__name" data-profile-name></p>
            <p class="profile-menu__caption">${t('app.title')}</p>
          </div>
        </div>
        <div class="profile-menu__section">
          <p class="profile-menu__label">${t('profile.settings')}</p>
          <p class="profile-menu__hint">${t('profile.language')}</p>
          <div class="lang-toggle" data-lang></div>
        </div>
        <div class="profile-menu__section" data-profile-appearance>
          <p class="profile-menu__hint" data-appearance-hint>${t('profile.appearance')}</p>
          <button type="button" class="theme-toggle-btn" data-theme-toggle aria-label="">
            <span class="material-symbols-outlined" data-theme-icon aria-hidden="true"></span>
          </button>
        </div>
        <button type="button" class="profile-menu__logout" data-profile-logout role="menuitem">${t('profile.logout')}</button>
      </div>
    </div>
  `;
}

function clearAppSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('s3phy_splash_seen');
    sessionStorage.removeItem('quiz-settings-open');
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('s3phy.') || key.startsWith('s3phy:') || key.startsWith('quiz-settings'))) {
        keys.push(key);
      }
    }
    keys.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

export function logoutUniplus() {
  clearAppSession();
  const payload = { type: 'uniplus:logout' };
  try {
    window.parent?.postMessage(payload, '*');
  } catch {
    /* ignore */
  }
  try {
    if (window.top && window.top !== window) window.top.postMessage(payload, '*');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('s3phy:logout'));
}

/**
 * @param {ParentNode} root
 * @param {{ onLang?: () => void }} [opts]
 */
export function mountProfileMenu(root, { onLang } = {}) {
  const menu = root.querySelector('[data-profile-menu]');
  const btn = root.querySelector('[data-profile-btn]');
  const panel = root.querySelector('[data-profile-panel]');
  const langEl = root.querySelector('[data-lang]');
  const themeBtn = root.querySelector('[data-theme-toggle]');
  const themeIcon = root.querySelector('[data-theme-icon]');
  const nameEl = root.querySelector('[data-profile-name]');
  const logoutBtn = root.querySelector('[data-profile-logout]');
  if (!menu || !btn || !panel || !langEl || !themeBtn || !themeIcon || !logoutBtn) {
    return { refreshLabels() {}, destroy() {} };
  }

  const paintTheme = () => {
    const dark = getTheme() === 'dark';
    themeIcon.textContent = dark ? 'light_mode' : 'dark_mode';
    themeBtn.setAttribute('aria-label', t(dark ? 'profile.themeToLight' : 'profile.themeToDark'));
  };

  const paintName = () => {
    if (nameEl) nameEl.textContent = displayNameFromSession(readUniplusSession());
  };

  const paintLang = () => {
    langEl.innerHTML = `
      <button type="button" data-set-lang="en" class="${getLang() === 'en' ? 'active' : ''}">${t('lang.en')}</button>
      <button type="button" data-set-lang="zh-Hant" class="${getLang() === 'zh-Hant' ? 'active' : ''}">${t('lang.zhHant')}</button>
    `;
    langEl.querySelectorAll('button').forEach((langBtn) => {
      langBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        setLang(langBtn.getAttribute('data-set-lang'));
        onLang?.();
      });
    });
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('is-open', open);
  };

  const onBtnClick = (event) => {
    event.stopPropagation();
    setOpen(panel.hidden);
  };

  const onDocClick = (event) => {
    if (!menu.contains(event.target)) setOpen(false);
  };

  const onKey = (event) => {
    if (event.key === 'Escape') setOpen(false);
  };

  const onThemeClick = (event) => {
    event.stopPropagation();
    toggleTheme();
  };

  const onThemeChange = () => {
    paintTheme();
  };

  const onLogout = (event) => {
    event.stopPropagation();
    setOpen(false);
    logoutUniplus();
  };

  const onSessionMessage = (event) => {
    const data = event.data;
    if (!data || data.type !== 'uniplus:session') return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    paintName();
  };

  paintName();
  paintLang();
  paintTheme();
  btn.addEventListener('click', onBtnClick);
  themeBtn.addEventListener('click', onThemeClick);
  logoutBtn.addEventListener('click', onLogout);
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);
  window.addEventListener('message', onSessionMessage);
  window.addEventListener('s3phy:theme', onThemeChange);

  return {
    refreshLabels() {
      btn.setAttribute('aria-label', t('profile.open'));
      const caption = menu.querySelector('.profile-menu__caption');
      const label = menu.querySelector('.profile-menu__label');
      const langHint = menu.querySelector('.profile-menu__section:first-of-type .profile-menu__hint');
      const appearanceHint = menu.querySelector('[data-appearance-hint]');
      if (caption) caption.textContent = t('app.title');
      if (label) label.textContent = t('profile.settings');
      if (langHint) langHint.textContent = t('profile.language');
      if (appearanceHint) appearanceHint.textContent = t('profile.appearance');
      logoutBtn.textContent = t('profile.logout');
      paintName();
      paintLang();
      paintTheme();
    },
    destroy() {
      btn.removeEventListener('click', onBtnClick);
      themeBtn.removeEventListener('click', onThemeClick);
      logoutBtn.removeEventListener('click', onLogout);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onSessionMessage);
      window.removeEventListener('s3phy:theme', onThemeChange);
    },
  };
}
