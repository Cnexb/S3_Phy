const OVERLAY_Z = 100000;

function supportsFullscreen() {
  const el = document.createElement('div');
  return Boolean(
    el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled,
  );
}

function isFullscreenActive(stage) {
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  return fsEl === stage;
}

function notifyLabResize(stage) {
  window.dispatchEvent(new Event('resize'));
  stage?.querySelectorAll('iframe').forEach((frame) => {
    try {
      frame.contentWindow?.dispatchEvent(new Event('resize'));
    } catch {
      /* cross-origin */
    }
  });
}

/** Hub-wide fullscreen for any strand section (notes, labs, quiz, …). */
export function initHubFullscreen({ app, stage, t }) {
  let overlayMode = false;
  let overlayBackdrop = null;
  let floatBtn = null;
  let destroyed = false;

  const isModeActive = () => isFullscreenActive(stage) || overlayMode;

  const toolbarBtn = () => stage?.querySelector('[data-hub-fullscreen]');

  const paintButton = (btn, active) => {
    if (!btn) return;
    const label = active ? t('tools.exitFullscreen') : t('tools.fullscreen');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.classList.toggle('s3phy-fs-btn--active', active);
    const labelEl = btn.querySelector('[data-hub-fullscreen-label], .s3phy-fs-btn__label');
    if (labelEl) labelEl.textContent = label;
    const icon = btn.querySelector('[data-hub-fullscreen-icon], .s3phy-fs-btn__icon');
    if (icon) icon.textContent = active ? 'fullscreen_exit' : 'fullscreen';
  };

  const ensureFloatButton = () => {
    if (floatBtn) return floatBtn;
    floatBtn = document.createElement('button');
    floatBtn.type = 'button';
    floatBtn.className = 's3phy-fs-btn hub-fs-btn';
    floatBtn.innerHTML =
      '<span class="s3phy-fs-btn__icon material-symbols-outlined" aria-hidden="true">fullscreen</span>' +
      '<span class="s3phy-fs-btn__label"></span>';
    floatBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFullscreen();
    });
    document.body.appendChild(floatBtn);
    return floatBtn;
  };

  const syncButtons = () => {
    if (destroyed) return;
    const active = isModeActive() || Boolean(app?.classList.contains('is-lab-fullscreen'));
    const bar = toolbarBtn();
    if (bar) {
      if (floatBtn) {
        floatBtn.hidden = true;
        floatBtn.setAttribute('aria-hidden', 'true');
      }
      paintButton(bar, active);
      return;
    }
    const btn = ensureFloatButton();
    btn.hidden = false;
    btn.removeAttribute('aria-hidden');
    paintButton(btn, active);
  };

  const clearOverlay = () => {
    if (overlayBackdrop) {
      overlayBackdrop.remove();
      overlayBackdrop = null;
    }
    stage.classList.remove('hub-main--overlay-fullscreen');
    document.body.style.overflow = '';
    overlayMode = false;
  };

  const finishExit = () => {
    clearOverlay();
    app?.classList.remove('is-lab-fullscreen');
    stage.style.position = '';
    stage.style.inset = '';
    stage.style.zIndex = '';
    stage.style.width = '';
    stage.style.height = '';
    stage.style.margin = '';
    syncButtons();
    requestAnimationFrame(() => notifyLabResize(stage));
  };

  const exitFullscreen = async () => {
    if (isFullscreenActive(stage)) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch {
        /* ignore */
      }
    }
    finishExit();
  };

  const enterOverlay = () => {
    app?.classList.add('is-lab-fullscreen');

    overlayBackdrop = document.createElement('div');
    overlayBackdrop.className = 'tool-stage-overlay-backdrop';
    overlayBackdrop.style.cssText =
      'position:fixed;inset:0;z-index:' + OVERLAY_Z + ';background:rgba(15,23,42,0.45);';
    document.body.appendChild(overlayBackdrop);
    document.body.style.overflow = 'hidden';

    stage.classList.add('hub-main--overlay-fullscreen');
    stage.style.position = 'fixed';
    stage.style.inset = '0';
    stage.style.zIndex = String(OVERLAY_Z + 1);
    stage.style.width = '100dvw';
    stage.style.height = '100dvh';
    stage.style.margin = '0';

    overlayMode = true;
    syncButtons();
    requestAnimationFrame(() => notifyLabResize(stage));

    overlayBackdrop.addEventListener('click', () => {
      exitFullscreen();
    });
  };

  const enterFullscreen = async () => {
    app?.classList.add('is-lab-fullscreen');

    if (!supportsFullscreen()) {
      enterOverlay();
      return;
    }

    try {
      if (stage.requestFullscreen) await stage.requestFullscreen();
      else if (stage.webkitRequestFullscreen) await stage.webkitRequestFullscreen();
      else {
        enterOverlay();
        return;
      }
      syncButtons();
      requestAnimationFrame(() => notifyLabResize(stage));
    } catch {
      app?.classList.remove('is-lab-fullscreen');
      enterOverlay();
    }
  };

  const toggleFullscreen = () => {
    if (isModeActive() || app?.classList.contains('is-lab-fullscreen')) exitFullscreen();
    else enterFullscreen();
  };

  const onStageClick = (event) => {
    const btn = event.target.closest('[data-hub-fullscreen]');
    if (!btn || !stage.contains(btn)) return;
    event.preventDefault();
    event.stopPropagation();
    toggleFullscreen();
  };

  const onFullscreenChange = () => {
    if (!isModeActive()) {
      finishExit();
      return;
    }
    syncButtons();
    requestAnimationFrame(() => notifyLabResize(stage));
  };

  stage.addEventListener('click', onStageClick);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  const mo = new MutationObserver(() => syncButtons());
  mo.observe(stage, { childList: true, subtree: true });

  syncButtons();

  return {
    sync: syncButtons,
    destroy() {
      destroyed = true;
      mo.disconnect();
      stage.removeEventListener('click', onStageClick);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      finishExit();
      floatBtn?.remove();
      floatBtn = null;
    },
    exit: finishExit,
  };
}

/** @deprecated Use initHubFullscreen — kept for any external imports */
export const initLabFullscreen = initHubFullscreen;
