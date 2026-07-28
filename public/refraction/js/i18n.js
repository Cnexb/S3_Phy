/** Standalone i18n — flat locale keys for t(key). */
export let currentLang = 'zh';
const STORAGE_KEY = 's3phy.refraction.lang';

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
    'tools.refraction.title': 'Refraction — Snell’s law',
    'tools.refraction.subtitle': 'Choose media, adjust angles, and compare light speeds.',
    'tools.refraction.n1': 'Incident medium',
    'tools.refraction.n2': 'Refracted medium',
    'tools.refraction.angleI': 'Angle of incidence θ₁ (°)',
    'tools.refraction.angleR': 'Angle of refraction θ₂ (°)',
    'tools.refraction.medium.air': 'Air',
    'tools.refraction.medium.water': 'Water',
    'tools.refraction.medium.glass': 'Glass',
    'tools.refraction.medium.custom': 'Custom',
    'tools.refraction.nLabel': 'n',
    'tools.refraction.speedLabel': 'Speed of light v',
    'tools.refraction.speedUnit': '× 10⁸ m s⁻¹',
    'tools.refraction.snell': 'n₁ sin θ₁ = n₂ sin θ₂',
    'tools.refraction.critical': 'Critical angle θc',
    'tools.refraction.tir': 'Total internal reflection — no refracted ray (θ₁ > θc).',
    'tools.refraction.reset': 'Reset',
    'tools.refraction.canvas.incident': 'Incident',
    'tools.refraction.canvas.refracted': 'Refracted',
    'tools.refraction.canvas.reflected': 'Reflected',
    'tools.refraction.canvas.normal': 'Normal',
    'tools.refraction.canvas.interface': 'Interface',
    'tools.refraction.hideControls': 'Hide Controls',
    'tools.refraction.showControls': 'Show Controls',
    'tools.refraction.particleModel.title': 'Microscopic Particle Model',
    'tools.refraction.particleModel.denser': 'Denser (More Particles, Harder & Slower Light)',
    'tools.refraction.particleModel.lessDense': 'Less Dense (Fewer Particles, Easier & Faster Light)',
    'tools.refraction.particleModel.speed': 'Speed',
  },
  zh: {
    'tools.refraction.title': '折射 — 司乃耳定律',
    'tools.refraction.subtitle': '選擇介質、調校角度，並比較不同介質中的光速。',
    'tools.refraction.n1': '入射介質',
    'tools.refraction.n2': '折射介質',
    'tools.refraction.angleI': '入射角 θ₁（°）',
    'tools.refraction.angleR': '折射角 θ₂（°）',
    'tools.refraction.medium.air': '空氣',
    'tools.refraction.medium.water': '水',
    'tools.refraction.medium.glass': '玻璃',
    'tools.refraction.medium.custom': '自訂介質',
    'tools.refraction.nLabel': 'n',
    'tools.refraction.speedLabel': '光速 v',
    'tools.refraction.speedUnit': '× 10⁸ m s⁻¹',
    'tools.refraction.snell': 'n₁ sin θ₁ = n₂ sin θ₂',
    'tools.refraction.critical': '臨界角 θc',
    'tools.refraction.tir': '全內反射 — 沒有折射光線（θ₁ > θc）。',
    'tools.refraction.reset': '重設',
    'tools.refraction.canvas.incident': '入射',
    'tools.refraction.canvas.refracted': '折射',
    'tools.refraction.canvas.reflected': '反射',
    'tools.refraction.canvas.normal': '法線',
    'tools.refraction.canvas.interface': '介面',
    'tools.refraction.hideControls': '收合控制台',
    'tools.refraction.showControls': '展開控制台',
    'tools.refraction.particleModel.title': '折射微觀粒子模型',
    'tools.refraction.particleModel.denser': '較密集 (粒子極多，光線穿透阻力大、傳播慢)',
    'tools.refraction.particleModel.lessDense': '較稀疏 (粒子極少，光線穿透阻力小、傳播快)',
    'tools.refraction.particleModel.speed': '光速',
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}
