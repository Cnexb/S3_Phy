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

export function initLabFullscreen({ app, stage, t, setCollapsed, getCollapsed }) {
  let overlayMode = false;
  let pickerWasCollapsed = false;
  let overlayBackdrop = null;
  let floatBtn = null;

  const isActive = () =>
    isFullscreenActive(stage) || overlayMode || Boolean(app?.classList.contains('is-lab-fullscreen'));

  const syncFloatButton = () => {
    const active = isActive();
    if (!floatBtn) {
      floatBtn = document.createElement('button');
      floatBtn.type = 'button';
      floatBtn.className = 's3phy-fs-btn hub-fs-btn';
      floatBtn.innerHTML =
        '<span class="s3phy-fs-btn__icon material-symbols-outlined" aria-hidden="true">fullscreen</span>' +
        '<span class="s3phy-fs-btn__label"></span>';
      floatBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isActive()) exitFullscreen();
        else enterFullscreen();
      });
      document.body.appendChild(floatBtn);
    }

    const label = active ? t('tools.exitFullscreen') : t('tools.fullscreen');
    floatBtn.setAttribute('aria-label', label);
    floatBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    floatBtn.classList.toggle('s3phy-fs-btn--active', active);
    const labelEl = floatBtn.querySelector('.s3phy-fs-btn__label');
    if (labelEl) labelEl.textContent = label;
    const icon = floatBtn.querySelector('.s3phy-fs-btn__icon');
    if (icon) icon.textContent = active ? 'fullscreen_exit' : 'fullscreen';
  };

  const clearOverlay = () => {
    if (overlayBackdrop) {
      overlayBackdrop.remove();
      overlayBackdrop = null;
    }
    stage.classList.remove('tool-stage--overlay-fullscreen');
    document.body.style.overflow = '';
    overlayMode = false;
  };

  const exitFullscreen = async () => {
    if (overlayMode) {
      clearOverlay();
      app?.classList.remove('is-lab-fullscreen');
      setCollapsed(pickerWasCollapsed);
      syncFloatButton();
      return;
    }

    if (isFullscreenActive(stage)) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch {
        /* ignore */
      }
    } else {
      app?.classList.remove('is-lab-fullscreen');
      syncFloatButton();
    }
  };

  const enterOverlay = () => {
    pickerWasCollapsed = getCollapsed();
    setCollapsed(true);
    app?.classList.add('is-lab-fullscreen');

    overlayBackdrop = document.createElement('div');
    overlayBackdrop.className = 'tool-stage-overlay-backdrop';
    overlayBackdrop.style.cssText =
      'position:fixed;inset:0;z-index:' + OVERLAY_Z + ';background:rgba(15,23,42,0.45);';
    document.body.appendChild(overlayBackdrop);
    document.body.style.overflow = 'hidden';

    stage.classList.add('tool-stage--overlay-fullscreen');
    stage.style.position = 'fixed';
    stage.style.inset = '0';
    stage.style.zIndex = String(OVERLAY_Z + 1);
    stage.style.width = '100dvw';
    stage.style.height = '100dvh';
    stage.style.margin = '0';

    overlayMode = true;
    syncFloatButton();
    requestAnimationFrame(() => notifyLabResize(stage));

    overlayBackdrop.addEventListener('click', () => {
      exitFullscreen();
    });
  };

  const enterFullscreen = async () => {
    pickerWasCollapsed = getCollapsed();
    setCollapsed(true);
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
      syncFloatButton();
      requestAnimationFrame(() => notifyLabResize(stage));
    } catch {
      app?.classList.remove('is-lab-fullscreen');
      setCollapsed(pickerWasCollapsed);
      enterOverlay();
    }
  };

  const onFullscreenChange = () => {
    const active = isActive();
    if (!active) {
      app?.classList.remove('is-lab-fullscreen');
      if (overlayMode) clearOverlay();
      setCollapsed(pickerWasCollapsed);
      stage.style.position = '';
      stage.style.inset = '';
      stage.style.zIndex = '';
      stage.style.width = '';
      stage.style.height = '';
      stage.style.margin = '';
    }
    syncFloatButton();
    if (active) {
      requestAnimationFrame(() => notifyLabResize(stage));
    }
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  syncFloatButton();

  return () => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    floatBtn?.remove();
    floatBtn = null;
    exitFullscreen();
  };
}
