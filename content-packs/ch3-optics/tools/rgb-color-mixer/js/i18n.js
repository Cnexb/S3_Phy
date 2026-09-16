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
  'tools.rgbMixer.title': "RGB colour mixer",
  'tools.rgbMixer.intro': "Additive mixing: red, green and blue light combine on screens. Drag sliders or use presets.",
  'tools.rgbMixer.canvas': "RGB light overlap diagram",
  'tools.rgbMixer.controls': "Colour controls",
  'tools.rgbMixer.red': "Red",
  'tools.rgbMixer.green': "Green",
  'tools.rgbMixer.blue': "Blue",
  'tools.rgbMixer.preview': "Mixed colour preview",
  'tools.rgbMixer.presets': "Presets",
  'tools.rgbMixer.presetRed': "Red",
  'tools.rgbMixer.presetGreen': "Green",
  'tools.rgbMixer.presetBlue': "Blue",
  'tools.rgbMixer.presetYellow': "Yellow",
  'tools.rgbMixer.presetCyan': "Cyan",
  'tools.rgbMixer.presetMagenta': "Magenta",
  'tools.rgbMixer.presetWhite': "White",
  'tools.rgbMixer.presetBlack': "Black"
  },
  zh: {
  'tools.rgbMixer.title': "RGB 顏色混合",
  'tools.rgbMixer.intro': "加法混色：紅、綠、藍光在蟻幕上疊加。拖動滑棒或使用預設。",
  'tools.rgbMixer.canvas': "RGB 光線疊加示意圖",
  'tools.rgbMixer.controls': "顏色控制",
  'tools.rgbMixer.red': "紅",
  'tools.rgbMixer.green': "綠",
  'tools.rgbMixer.blue': "藍",
  'tools.rgbMixer.preview': "混合顏色預覽",
  'tools.rgbMixer.presets': "預設",
  'tools.rgbMixer.presetRed': "紅",
  'tools.rgbMixer.presetGreen': "綠",
  'tools.rgbMixer.presetBlue': "藍",
  'tools.rgbMixer.presetYellow': "黃",
  'tools.rgbMixer.presetCyan': "青",
  'tools.rgbMixer.presetMagenta': "品紅",
  'tools.rgbMixer.presetWhite': "白",
  'tools.rgbMixer.presetBlack': "黑"
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}
