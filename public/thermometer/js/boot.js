import { createThermometerLab, createFaultyScaleCalibrationLab } from './lab.js?v=29';
import { createT, hubLangToLocal, initLangFromUrl, setLang, getLang } from './i18n.js';

const root = document.getElementById('app');
const MODES = new Set(['liquid', 'resistance', 'thermistor', 'faulty']);

function modeFromUrl() {
  const mode = new URLSearchParams(location.search).get('mode') || 'liquid';
  return MODES.has(mode) ? mode : 'liquid';
}

function mount() {
  if (!root) return;
  root.replaceChildren();
  const t = createT(getLang());
  const mode = modeFromUrl();
  const lab = mode === 'faulty'
    ? createFaultyScaleCalibrationLab(t)
    : createThermometerLab(t, { type: mode });
  root.appendChild(lab);
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
