/** Standalone i18n — flat locale keys for t(key). */
export let currentLang = 'zh';

export function hubLangToLocal(hubLang) {
  if (hubLang === 'zh-Hant' || hubLang === 'zh') return 'zh';
  return 'en';
}

export function initLangFromUrl() {
  const lang = new URLSearchParams(location.search).get('lang');
  if (lang) currentLang = hubLangToLocal(lang);
}

export function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh';
  document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
  return currentLang;
}

export function getLang() {
  return currentLang;
}

const STRINGS = {
  en: {
  'tools.rotatingMirror.title': "Rotating plane mirror",
  'tools.rotatingMirror.subtitle': "Ray shift when the mirror turns (?θ_ray = 2θ_mirror).",
  'tools.rotatingMirror.toggle.origNormal': "Orig. normal",
  'tools.rotatingMirror.toggle.origRay': "Orig. reflected",
  'tools.rotatingMirror.toggle.newNormal': "New normal",
  'tools.rotatingMirror.toggle.newRay': "New reflected",
  'tools.rotatingMirror.incidentAngle': "Incident direction (°)",
  'tools.rotatingMirror.mirrorRotation': "Mirror rotation θ (°)",
  'tools.rotatingMirror.statIncidence': "Incidence angle i",
  'tools.rotatingMirror.statReflection': "Reflection angle r",
  'tools.rotatingMirror.rayShift': "Ray shift",
  'tools.rotatingMirror.logicBadge': "Rule: 2 ? θ",
  'tools.rotatingMirror.reset': "Reset rotation",
  'tools.rotatingMirror.canvas.incident': "Incident ray",
  'tools.rotatingMirror.canvas.originalReflected': "Original reflected",
  'tools.rotatingMirror.canvas.newReflected': "New reflected",
  'tools.rotatingMirror.canvas.n': "n",
  'tools.rotatingMirror.canvas.nPrime': "n′",
  'tools.rotatingMirror.canvas.shift': "Shift"
  },
  zh: {
  'tools.rotatingMirror.title': "旋轉平面鏡",
  'tools.rotatingMirror.subtitle': "鏡面轉動時反射光線的偏移（光線偏角 = 2 × 鏡角）。",
  'tools.rotatingMirror.toggle.origNormal': "原法線",
  'tools.rotatingMirror.toggle.origRay': "原反射光",
  'tools.rotatingMirror.toggle.newNormal': "新法線",
  'tools.rotatingMirror.toggle.newRay': "新反射光",
  'tools.rotatingMirror.incidentAngle': "入射方向（°）",
  'tools.rotatingMirror.mirrorRotation': "鏡面轉角 θ（°）",
  'tools.rotatingMirror.statIncidence': "入射觔 i",
  'tools.rotatingMirror.statReflection': "反射觔 r",
  'tools.rotatingMirror.rayShift': "光線偏移",
  'tools.rotatingMirror.logicBadge': "關係：2 × θ",
  'tools.rotatingMirror.reset': "重設轉角",
  'tools.rotatingMirror.canvas.incident': "入射光線",
  'tools.rotatingMirror.canvas.originalReflected': "原反射光線",
  'tools.rotatingMirror.canvas.newReflected': "新反射光線",
  'tools.rotatingMirror.canvas.n': "n",
  'tools.rotatingMirror.canvas.nPrime': "n′",
  'tools.rotatingMirror.canvas.shift': "偏移"
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}
