import { initRgbColorMixer } from './app.js';
import { createT, hubLangToLocal, initLangFromUrl, setLang, getLang } from './i18n.js';

const root = document.getElementById('app');

function mount() {
  if (!root) return;
  root.replaceChildren();
  initRgbColorMixer(root, createT(getLang()));
}

function applyLang(lang) {
  setLang(lang);
  mount();
}

initLangFromUrl();
applyLang(getLang());

window.addEventListener('message', (ev) => {
  if (ev.data?.type !== 's3phy:lang') return;
  const next = hubLangToLocal(ev.data.lang);
  if (next === getLang()) return;
  applyLang(next);
});
