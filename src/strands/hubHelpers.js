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
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) {
      assetExistsCache.set(url, true);
      return true;
    }
    // Some hosts reject HEAD while GET still works.
    if (head.status === 405 || head.status === 501 || head.status === 403) {
      const get = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
      });
      const ok = get.ok || get.status === 206;
      assetExistsCache.set(url, ok);
      return ok;
    }
    assetExistsCache.set(url, false);
    return false;
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
  // Keep fragments minimal — toolbar=0 / navpanes=0 blank the viewer in some browsers.
  return `${base}#page=1&view=FitH`;
}

function pdfFileName(pdfUrl) {
  try {
    const path = String(pdfUrl).split('?')[0].split('#')[0];
    return decodeURIComponent(path.split('/').pop() || 'notes.pdf');
  } catch {
    return 'notes.pdf';
  }
}

/**
 * Browser PDF plugins often render blank inside Uni+ (nested iframe).
 * Blob URLs usually still preview; fall back to the direct URL.
 */
export async function resolvePdfPreviewUrl(pdfUrl) {
  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) return pdfUrl;
    const blob = await res.blob();
    if (!blob || blob.size === 0) return pdfUrl;
    const pdfBlob =
      blob.type === 'application/pdf'
        ? blob
        : new Blob([blob], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob);
  } catch {
    return pdfUrl;
  }
}

export function renderPdfPreviewBlock(title, pdfUrl, linkLabel, previewUrl = pdfUrl) {
  const previewSrc = pdfPreviewSrc(previewUrl);
  const safeTitle = title.replace(/"/g, '&quot;');
  const fileName = pdfFileName(pdfUrl);
  const openLabel = linkLabel || t('notes.openPdf');
  const downloadLabel = t('notes.downloadPdf');
  return `
    <div class="note-preview-wrap">
      <object class="note-preview" type="application/pdf" data="${previewSrc}" title="${safeTitle}">
        <iframe class="note-preview" title="${safeTitle}" src="${previewSrc}"></iframe>
      </object>
    </div>
    <p class="note-preview-link note-preview-actions">
      <a class="btn" href="${pdfUrl}" target="_blank" rel="noopener">${openLabel}</a>
      <a class="btn primary" href="${pdfUrl}" download="${fileName}" rel="noopener">${downloadLabel}</a>
    </p>`;
}

function revokePreviewUrls(body) {
  if (!body) return;
  body.querySelectorAll('object.note-preview, iframe.note-preview').forEach((el) => {
    const src = el.getAttribute('data') || el.getAttribute('src') || '';
    if (src.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(src.split('#')[0]);
      } catch {
        /* ignore */
      }
    }
  });
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
        revokePreviewUrls(body);
        const previewUrl = await resolvePdfPreviewUrl(url);
        body.innerHTML = renderPdfPreviewBlock(
          t(`notes.card.${r.key}`),
          url,
          t('notes.openPdf'),
          previewUrl,
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
        revokePreviewUrls(body);
        const previewUrl = await resolvePdfPreviewUrl(url);
        body.innerHTML = renderPdfPreviewBlock(
          t(`summary.item.${r.key}`),
          url,
          t('summary.download'),
          previewUrl,
        );
      } else {
        body.innerHTML = `<p class="lead">${t('summary.missing')}</p>`;
      }
    }),
  );
}

/**
 * @param {Function} t
 * @param {{ key: string }[]} rows
 * @param {string} [gridClass]
 */
export function renderComicsShell(t, rows, gridClass = 'cols-2') {
  return `
      <section class="panel">
        <h2>${t('comics.title')}</h2>
        <p class="lead">${t('comics.intro')}</p>
        <div class="grid ${gridClass}" data-comics-grid>
          ${rows
            .map(
              (it) => `
            <div class="card" data-comic-card="${it.key}">
              <h3>${t(`summary.item.${it.key}`)}</h3>
              <div data-comic-body></div>
            </div>`,
            )
            .join('')}
        </div>
      </section>`;
}

export async function hydrateComicCards(root, rows, { version = '' } = {}) {
  const lk = langKey();
  const versionSuffix = version ? `?v=${version}` : '';
  await Promise.all(
    rows.map(async (r) => {
      const card = root.querySelector(`[data-comic-card="${r.key}"]`);
      if (!card) return;
      const body = card.querySelector('[data-comic-body]');
      const title = t(`summary.item.${r.key}`);
      const file = r.fileEn && r.fileZh ? (lk === 'zhHant' ? r.fileZh : r.fileEn) : r.file;
      const pages = Array.isArray(r.pages) ? r.pages.filter(Boolean) : [];
      const isPdf = r.type === 'pdf' || (file && String(file).toLowerCase().endsWith('.pdf'));

      if (pages.length) {
        const images = pages
          .map((pageFile, idx) => {
            const src = `${import.meta.env.BASE_URL}comics/${pageFile}${versionSuffix}`;
            const safeTitle = title.replace(/"/g, '&quot;');
            return `<img class="comic-page" src="${src}" alt="${safeTitle} (${idx + 1}/${pages.length})" loading="${idx === 0 ? 'eager' : 'lazy'}" />`;
          })
          .join('');
        const pdfUrl = isPdf ? `${import.meta.env.BASE_URL}comics/${file}${versionSuffix}` : '';
        const pdfLink = pdfUrl
          ? `<p class="note-preview-link"><a href="${pdfUrl}" target="_blank" rel="noopener">${t('comics.openPdf')}</a></p>`
          : '';
        body.innerHTML = `<div class="comic-pages">${images}</div>${pdfLink}`;
        return;
      }

      const ok = await assetExists('comics', file);
      const url = `${import.meta.env.BASE_URL}comics/${file}${versionSuffix}`;
      if (!ok) {
        body.innerHTML = `<p class="lead">${t('comics.missing')}</p>`;
        return;
      }
      if (isPdf) {
        revokePreviewUrls(body);
        const previewUrl = await resolvePdfPreviewUrl(url);
        body.innerHTML = renderPdfPreviewBlock(title, url, t('comics.openPdf'), previewUrl);
      } else {
        body.innerHTML = `
          <img class="summary-thumb" src="${url}" alt="${title}" loading="lazy" />
          <p style="margin-top:8px"><a href="${url}" target="_blank" rel="noopener">${t('comics.viewImage')}</a></p>`;
      }
    }),
  );
}
