import { getLang, t } from '../i18n.js';

const assetExistsCache = new Map();

export function langKey() {
  return getLang() === 'zh-Hant' ? 'zhHant' : 'en';
}

/** @param {HTMLElement | null | undefined} inst */
export function cleanupLabInstance(inst) {
  if (!inst) return;
  for (const key of Object.keys(inst)) {
    if (key.endsWith('Cleanup') && typeof inst[key] === 'function') {
      inst[key]();
    }
  }
}

/**
 * Restore the last interactive lab for a strand after refresh.
 * @param {string} storageKey
 * @param {string[]} allowedIds
 * @param {string} fallback
 */
export function loadToolId(storageKey, allowedIds, fallback) {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored && allowedIds.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  return fallback;
}

/** @param {string} storageKey @param {string} toolId */
export function saveToolId(storageKey, toolId) {
  try {
    sessionStorage.setItem(storageKey, toolId);
  } catch {
    /* ignore */
  }
}

export async function assetExists(folder, name) {
  if (!name) return false;
  const url = `${import.meta.env.BASE_URL}${folder}/${name}`;
  if (assetExistsCache.has(url)) {
    return assetExistsCache.get(url);
  }
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const ok = res.ok;
    assetExistsCache.set(url, ok);
    return ok;
  } catch {
    assetExistsCache.set(url, false);
    return false;
  }
}

export async function noteExists(name) {
  return assetExists('notes', name);
}

export function pdfPreviewSrc(url) {
  const base = String(url).split('#')[0];
  return `${base}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`;
}

export function renderPdfPreviewBlock(title, pdfUrl, linkLabel) {
  const previewSrc = pdfPreviewSrc(pdfUrl);
  const safeTitle = title.replace(/"/g, '&quot;');
  return `
    <div class="note-preview-wrap">
      <iframe class="note-preview" title="${safeTitle}" src="${previewSrc}" loading="lazy"></iframe>
    </div>
    <p class="note-preview-link"><a href="${pdfUrl}" target="_blank" rel="noopener">${linkLabel}</a></p>`;
}

export async function hydrateNoteCards(root, rows) {
  const lk = langKey();
  await Promise.all(
    rows.map(async (r) => {
      const card = root.querySelector(`[data-note-card="${r.key}"]`);
      if (!card) return;
      const body = card.querySelector('[data-note-body]');
      const file = lk === 'zhHant' ? r.fileZh : r.fileEn;
      const ok = await noteExists(file);
      const url = `${import.meta.env.BASE_URL}notes/${file}`;
      if (ok) {
        body.innerHTML = renderPdfPreviewBlock(
          t(`notes.card.${r.key}`),
          url,
          t('notes.openPdf'),
        );
      } else {
        body.innerHTML = `<p class="lead">${t('notes.missing')}</p>
          <p><a class="btn" href="${import.meta.env.BASE_URL}notes/README.txt" target="_blank" rel="noopener">README</a></p>`;
      }
    }),
  );
}

export async function hydrateSummaryCards(root, rows, { version = '' } = {}) {
  const lk = langKey();
  const versionSuffix = version ? `?v=${version}` : '';
  await Promise.all(
    rows.map(async (r) => {
      const card = root.querySelector(`[data-summary-card="${r.key}"]`);
      if (!card) return;
      const body = card.querySelector('[data-summary-body]');

      if (r.type === 'image') {
        const file = r.fileEn && r.fileZh ? (lk === 'zhHant' ? r.fileZh : r.fileEn) : r.file;
        const ok = await assetExists('summary', file);
        const baseUrl = `${import.meta.env.BASE_URL}summary/${file}`;
        const url = `${baseUrl}${versionSuffix}`;
        if (ok) {
          body.innerHTML = `
          <img class="summary-thumb" src="${url}" alt="${t(`summary.item.${r.key}`)}" loading="lazy" />
          <p style="margin-top:8px"><a href="${url}" target="_blank" rel="noopener">${t('summary.viewImage')}</a></p>`;
        } else {
          body.innerHTML = `<p class="lead">${t('summary.missing')}</p>`;
        }
        return;
      }

      const file = lk === 'zhHant' ? r.fileZh : r.fileEn;
      const ok = await assetExists('summary-pdfs', file);
      const url = `${import.meta.env.BASE_URL}summary-pdfs/${file}`;
      if (ok) {
        body.innerHTML = renderPdfPreviewBlock(
          t(`summary.item.${r.key}`),
          url,
          t('summary.download'),
        );
      } else {
        body.innerHTML = `<p class="lead">${t('summary.missing')}</p>`;
      }
    }),
  );
}
