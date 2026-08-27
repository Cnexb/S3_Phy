const STORAGE_KEY = 's3phy.theme';

/** @type {'light' | 'dark'} */
let current = 'light';

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  return 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.dataset.theme = 'dark';
    root.style.colorScheme = 'dark';
  } else {
    delete root.dataset.theme;
    root.style.colorScheme = 'light';
  }
}

export function initTheme() {
  current = readStored();
  applyTheme(current);
}

/** @returns {'light' | 'dark'} */
export function getTheme() {
  return current;
}

/** @param {'light' | 'dark'} theme */
export function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return;
  if (theme === current) return;
  current = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent('s3phy:theme'));
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark');
}
