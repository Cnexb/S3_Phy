import './style.css';
import { initI18n, t } from './i18n.js';
import { initHubScale } from './hubScale.js';
import { mountStrandHub } from './strandHub.js';
import { SPLASH_PHRASES } from './splashPhrases.js';

initI18n();
const unmountHubScale = initHubScale();

const SPLASH_KEY = 's3phy_splash_seen';
const STRAND_STORAGE_KEY = 's3phy.strand';

const STRAND_LOADERS = {
  foundations: () => import('./strands/foundationsHub.js').then((m) => m.mountFoundationsHub),
  optics: () => import('./strands/opticsHub.js').then((m) => m.mountOpticsHub),
  refraction: () => import('./strands/refractionHub.js').then((m) => m.mountRefractionHub),
  heat: () => import('./strands/heatHub.js').then((m) => m.mountHeatHub),
  mechanics: () => import('./strands/mechanicsHub.js').then((m) => m.mountMechanicsHub),
  gas: () => import('./strands/gasHub.js').then((m) => m.mountGasHub),
  waves: () => import('./strands/wavesHub.js').then((m) => m.mountWavesHub),
  electricity: () => import('./strands/electricityHub.js').then((m) => m.mountElectricityHub),
  radioactivity: () => import('./strands/radioactivityHub.js').then((m) => m.mountRadioactivityHub),
};

let unmountActive = null;
let unmountPicker = null;
let splashTimers = [];

function isKnownStrand(id) {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(STRAND_LOADERS, id);
}

function parseStrandFromHash() {
  const m = location.hash.match(/^#\/(\w+)/);
  const id = m?.[1];
  return isKnownStrand(id) ? id : null;
}

function saveStrand(id) {
  try {
    if (id) sessionStorage.setItem(STRAND_STORAGE_KEY, id);
    else sessionStorage.removeItem(STRAND_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function loadSavedStrand() {
  try {
    const id = sessionStorage.getItem(STRAND_STORAGE_KEY);
    return isKnownStrand(id) ? id : null;
  } catch {
    return null;
  }
}

function clearHash() {
  const base = `${location.pathname}${location.search}`;
  history.replaceState(null, '', base);
}

async function navigateStrand(id) {
  unmountActive?.();
  unmountActive = null;
  unmountPicker?.();
  unmountPicker = null;

  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';

  const strandId = isKnownStrand(id) ? id : null;
  saveStrand(strandId);

  if (!strandId) {
    if (location.hash) clearHash();
    unmountPicker = mountStrandHub(app);
    return;
  }

  const targetHash = `#/${strandId}`;
  if (location.hash !== targetHash && !location.hash.startsWith(`${targetHash}/`)) {
    location.hash = targetHash;
    return;
  }

  const mount = await STRAND_LOADERS[strandId]();
  unmountActive = mount(app) ?? null;
}

function routeStrand() {
  void navigateStrand(parseStrandFromHash() || loadSavedStrand());
}

function logoSrc() {
  return `${import.meta.env.BASE_URL}images/uniplus-logo.png`;
}

function createSplash() {
  const splash = document.createElement('div');
  splash.id = 'splash';
  splash.className = 'splash';
  splash.setAttribute('role', 'dialog');
  splash.setAttribute('aria-modal', 'true');
  splash.setAttribute('aria-label', 'Uni+');
  splash.innerHTML = `
    <div class="splash-danmaku" id="splashDanmaku" aria-hidden="true"></div>
    <div class="splash-stage">
      <div class="splash-logo-wrap" id="splashLogoWrap">
        <img class="splash-logo-img" src="${logoSrc()}" alt="Uni+ logo" decoding="async" width="520" height="120" />
      </div>
      <div class="splash-uni-title" aria-hidden="true">Uni+</div>
      <div class="splash-start-wrap" id="splashStartWrap">
        <button type="button" class="splash-start-btn" id="splashStart">${t('splash.start')}</button>
      </div>
    </div>
  `;
  return splash;
}

function clearSplashTimers() {
  splashTimers.forEach((timerId) => window.clearTimeout(timerId));
  splashTimers = [];
}

const DANMAKU_MAX_ITEMS = 12;

function startDanmaku(splashEl, danmakuField) {
  const pool = [...SPLASH_PHRASES.en, ...SPLASH_PHRASES.zhHant];

  const spawn = () => {
    if (!splashEl.parentElement) return;
    if (danmakuField.childElementCount >= DANMAKU_MAX_ITEMS) {
      splashTimers.push(window.setTimeout(spawn, 800));
      return;
    }
    const item = document.createElement('div');
    item.className = 'splash-danmaku-item';
    item.textContent = pool[Math.floor(Math.random() * pool.length)];

    const top = Math.random() * 85 + 5;
    const size = Math.random() * 0.8 + 0.9;
    const duration = Math.random() * 12 + 10;

    item.style.top = `${top}%`;
    item.style.fontSize = `${size}rem`;
    item.style.animationDuration = `${duration}s`;

    danmakuField.appendChild(item);
    item.addEventListener('animationend', () => item.remove());

    splashTimers.push(window.setTimeout(spawn, 1500 + Math.random() * 1000));
  };

  for (let i = 0; i < 4; i += 1) {
    splashTimers.push(window.setTimeout(spawn, i * 1000));
  }
}

function wireSplashAnimations(splash) {
  const logoWrap = splash.querySelector('#splashLogoWrap');
  const danmaku = splash.querySelector('#splashDanmaku');
  const startWrap = splash.querySelector('#splashStartWrap');

  splashTimers.push(window.setTimeout(() => logoWrap?.classList.add('splash-logo-wrap--in'), 800));
  splashTimers.push(
    window.setTimeout(() => {
      danmaku?.classList.add('splash-danmaku--visible');
      startWrap?.classList.add('splash-start-wrap--in');
      if (danmaku) startDanmaku(splash, danmaku);
    }, 1600),
  );
}

function startApp() {
  routeStrand();
}

function trySplashThenApp() {
  let skip = false;
  try {
    skip = sessionStorage.getItem(SPLASH_KEY) === '1';
  } catch {
    /* ignore */
  }
  if (skip) {
    startApp();
    return;
  }
  const splash = createSplash();
  document.body.insertBefore(splash, document.body.firstChild);
  wireSplashAnimations(splash);

  const btn = splash.querySelector('#splashStart');
  const finish = () => {
    clearSplashTimers();
    splash.remove();
    startApp();
  };
  btn.addEventListener('click', () => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* ignore */
    }
    clearSplashTimers();
    splash.classList.add('splash--hide');
    splash.addEventListener('transitionend', finish, { once: true });
    window.setTimeout(finish, 480);
  });
}

window.addEventListener('hashchange', routeStrand);
window.addEventListener('s3phy:strand', (e) => {
  void navigateStrand(e.detail ?? null);
});
window.addEventListener('s3phy:logout', () => {
  document.getElementById('splash')?.remove();
  clearSplashTimers();
  unmountActive?.();
  unmountActive = null;
  unmountPicker?.();
  unmountPicker = null;
  const app = document.getElementById('app');
  if (app) app.innerHTML = '';
  clearHash();
  trySplashThenApp();
});
window.addEventListener('pagehide', () => {
  unmountHubScale?.();
});

trySplashThenApp();
