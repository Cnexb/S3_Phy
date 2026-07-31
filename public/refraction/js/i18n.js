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
    'tools.refraction.n1': 'Medium 1',
    'tools.refraction.n2': 'Medium 2',
    'tools.refraction.angleI': 'Angle θ₁ (°)',
    'tools.refraction.angleR': 'Angle θ₂ (°)',
    'tools.refraction.medium.air': 'Air',
    'tools.refraction.medium.water': 'Water',
    'tools.refraction.medium.glass': 'Glass',
    'tools.refraction.medium.custom': 'Custom',
    'tools.refraction.nLabel': 'n',
    'tools.refraction.speedLabel': 'Speed of light v',
    'tools.refraction.speedUnit': '× 10⁸ m s⁻¹',
    'tools.refraction.snell': 'sin θ₁ / sin θ₂ = constant',
    'tools.refraction.snellConstant': 'constant',
    'tools.refraction.snellTir': 'No refracted ray — this ratio does not apply (TIR).',
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
    'tools.refraction.mode.two': 'Two layers',
    'tools.refraction.mode.three': 'Three layers',
    'tools.refraction.layer.X': 'Medium X',
    'tools.refraction.layer.Y': 'Medium Y',
    'tools.refraction.layer.Z': 'Medium Z',
    'tools.refraction.threeEqual': 'n<sub>X</sub> sin θ<sub>X</sub> = n<sub>Y</sub> sin θ<sub>Y</sub> = n<sub>Z</sub> sin θ<sub>Z</sub>',
    'tools.refraction.tirXY': 'Total internal reflection at X–Y interface — no ray into Y.',
    'tools.refraction.tirYZ': 'Total internal reflection at Y–Z interface — no ray into Z.',
  },
  zh: {
    'tools.refraction.title': '折射 — 司乃耳定律',
    'tools.refraction.subtitle': '選擇介質、調校角度，並比較不同介質中的光速。',
    'tools.refraction.n1': '介質 1',
    'tools.refraction.n2': '介質 2',
    'tools.refraction.angleI': '角度 θ₁（°）',
    'tools.refraction.angleR': '角度 θ₂（°）',
    'tools.refraction.medium.air': '空氣',
    'tools.refraction.medium.water': '水',
    'tools.refraction.medium.glass': '玻璃',
    'tools.refraction.medium.custom': '自訂介質',
    'tools.refraction.nLabel': 'n',
    'tools.refraction.speedLabel': '光速 v',
    'tools.refraction.speedUnit': '× 10⁸ m s⁻¹',
    'tools.refraction.snell': 'sin θ₁ / sin θ₂ = 常數',
    'tools.refraction.snellConstant': '常數',
    'tools.refraction.snellTir': '沒有折射光線 — 此比值不適用（全內反射）。',
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
    'tools.refraction.mode.two': '兩層介質',
    'tools.refraction.mode.three': '三層介質',
    'tools.refraction.layer.X': '介質 X',
    'tools.refraction.layer.Y': '介質 Y',
    'tools.refraction.layer.Z': '介質 Z',
    'tools.refraction.threeEqual': 'n<sub>X</sub> sin θ<sub>X</sub> = n<sub>Y</sub> sin θ<sub>Y</sub> = n<sub>Z</sub> sin θ<sub>Z</sub>',
    'tools.refraction.tirXY': 'X–Y 介面全內反射 — 沒有進入 Y 的光線。',
    'tools.refraction.tirYZ': 'Y–Z 介面全內反射 — 沒有進入 Z 的光線。',
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}

