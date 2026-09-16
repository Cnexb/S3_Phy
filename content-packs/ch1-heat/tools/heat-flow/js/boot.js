import { createHeatFlowLab } from './lab.js?v=44';
import { createT, getLang, hubLangToLocal, initLangFromUrl, setLang } from './i18n.js';

const root = document.getElementById('app');
let cleanup = null;

function mount() {
  cleanup?.();
  root.replaceChildren();
  const lab = createHeatFlowLab(createT(getLang()), {
    lang: getLang(),
    onLanguageToggle: () => {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
      mount();
    },
  });
  root.appendChild(lab);
  cleanup = lab.destroy;
}

initLangFromUrl();
setLang(getLang());
mount();

window.addEventListener('message', (event) => {
  if (event.data?.type !== 's3phy:lang') return;
  const next = hubLangToLocal(event.data.lang);
  if (next === getLang()) return;
  setLang(next);
  mount();
});
