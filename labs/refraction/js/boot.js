import { initRefractionLab } from './app.js?v=20260721_micro_split_v20';
import { createT, hubLangToLocal, initLangFromUrl, setLang, getLang } from './i18n.js?v=20260721_micro_split_v20';

const root = document.getElementById('app');

function updateLangButtons(activeLang) {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const lang = btn.getAttribute('data-set-lang');
    btn.classList.toggle('active', lang === activeLang);
  });
}

function mount() {
  if (!root) return;
  root.replaceChildren();
  const current = getLang();
  initRefractionLab(root, createT(current));
  updateLangButtons(current);
}

function applyLang(lang) {
  setLang(lang);
  mount();
}

initLangFromUrl();
applyLang(getLang());

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-set-lang');
    if (lang) applyLang(lang);
  });
});

window.addEventListener('message', (ev) => {
  if (ev.data?.type !== 's3phy:lang') return;
  const next = hubLangToLocal(ev.data.lang);
  if (next === getLang()) return;
  applyLang(next);
});
