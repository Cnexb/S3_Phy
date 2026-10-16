/** Standalone i18n — flat locale keys for t(key). */
export let currentLang = 'zh';
const STORAGE_KEY = 's3phy.tir.lang';

export function hubLangToLocal(hubLang) {
  if (hubLang === 'zh-Hant' || hubLang === 'zh') return 'zh';
  return 'en';
}

export function initLangFromUrl() {
  const lang = new URLSearchParams(location.search).get('lang');
  if (lang) {
    currentLang = hubLangToLocal(lang);
  } else {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'zh') {
        currentLang = stored;
      }
    } catch (e) {
      // ignore
    }
  }
}

export function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh';
  try {
    localStorage.setItem(STORAGE_KEY, currentLang);
  } catch (e) {
    // ignore
  }
  document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
  return currentLang;
}

export function getLang() {
  return currentLang;
}

const STRINGS = {
  en: {
    'tools.tir.title': 'Total internal reflection',
    'tools.tir.subtitle': 'Change the incident angle to find the critical angle for glass to air.',
    'tools.tir.angleI': 'Incident angle θ₁ (°)',
    'tools.tir.critical': 'Critical angle θc',
    'tools.tir.noCritical': 'No critical angle',
    'tools.tir.reset': 'Reset',
    'tools.tir.setCritical': 'Set to θ<sub>c</sub>',
    'tools.tir.dirUp': 'Glass → Air upward',
    'tools.tir.dirDown': 'Air → Glass downward',
    'tools.tir.canvas.incident': 'Incident',
    'tools.tir.canvas.refracted': 'Refracted',
    'tools.tir.canvas.reflected': 'Reflected',
    'tools.tir.canvas.normal': 'Normal',
    'tools.tir.canvas.air': 'Air',
    'tools.tir.canvas.glass': 'Glass',
    'tools.tir.canvas.critical': 'θc',
  },
  zh: {
    'tools.tir.title': '全內反射',
    'tools.tir.subtitle': '調校入射角，找出玻璃對空氣的臨界角。',
    'tools.tir.angleI': '入射角 θ₁（°）',
    'tools.tir.critical': '臨界角 θc',
    'tools.tir.noCritical': '沒有臨界角',
    'tools.tir.reset': '重設',
    'tools.tir.setCritical': '設為 θ<sub>c</sub>',
    'tools.tir.dirUp': '玻璃 → 空氣 由下向上',
    'tools.tir.dirDown': '空氣 → 玻璃 由上向下',
    'tools.tir.canvas.incident': '入射',
    'tools.tir.canvas.refracted': '折射',
    'tools.tir.canvas.reflected': '反射',
    'tools.tir.canvas.normal': '法線',
    'tools.tir.canvas.air': '空氣',
    'tools.tir.canvas.glass': '玻璃',
    'tools.tir.canvas.critical': 'θc',
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}
