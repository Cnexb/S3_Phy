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

export function initLabFullscreen({ app, stage, button, t, setCollapsed, getCollapsed }) {
  let overlayMode = false;
  let pickerWasCollapsed = false;
  let overlayBackdrop = null;

  const icon = button.querySelector('.material-symbols-outlined');
  const label = button.querySelector('[data-tool-fullscreen-label]');
  let exitBtn = null;

  const syncExitButton = (active) => {
    if (!active) {
      exitBtn?.remove();
      exitBtn = null;
      return;
    }
    if (!exitBtn) {
      exitBtn = document.createElement('button');
      exitBtn.type = 'button';
      exitBtn.className = 's3phy-fs-exit hub-fs-exit';
      exitBtn.innerHTML =
        '<span class="s3phy-fs-exit__icon material-symbols-outlined" aria-hidden="true">fullscreen_exit</span>' +
        '<span class="s3phy-fs-exit__label"></span>';
      exitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        exitFullscreen();
      });
    }
    const exitLabel = t('tools.exitFullscreen');
    exitBtn.setAttribute('aria-label', exitLabel);
    const exitLabelEl = exitBtn.querySelector('.s3phy-fs-exit__label');
    if (exitLabelEl) exitLabelEl.textContent = exitLabel;
    if (exitBtn.parentElement !== stage) stage.appendChild(exitBtn);
  };

  const updateButton = (active) => {
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (icon) icon.textContent = active ? 'fullscreen_exit' : 'fullscreen';
    if (label) label.textContent = active ? t('tools.exitFullscreen') : t('tools.fullscreen');
    button.title = label?.textContent || '';
    syncExitButton(active);
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
      updateButton(false);
      return;
    }

    if (isFullscreenActive(stage)) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch {
        /* ignore */
      }
    }
  };

  const enterOverlay = () => {
    pickerWasCollapsed = getCollapsed();
    setCollapsed(true);
    app?.classList.add('is-lab-fullscreen');

    overlayBackdrop = document.createElement('div');
    overlayBackdrop.className = 'tool-stage-overlay-backdrop';
    overlayBackdrop.style.cssText = 'position:fixed;inset:0;z-index:' + OVERLAY_Z + ';background:rgba(15,23,42,0.45);';
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
    updateButton(true);
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
      updateButton(true);
      requestAnimationFrame(() => notifyLabResize(stage));
    } catch {
      app?.classList.remove('is-lab-fullscreen');
      setCollapsed(pickerWasCollapsed);
      enterOverlay();
    }
  };

  const onFullscreenChange = () => {
    const active = isFullscreenActive(stage) || overlayMode;
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
    updateButton(active);
    if (active) {
      requestAnimationFrame(() => notifyLabResize(stage));
    }
  };

  button.addEventListener('click', () => {
    if (isFullscreenActive(stage) || overlayMode) exitFullscreen();
    else enterFullscreen();
  });

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  updateButton(false);

  return () => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    exitFullscreen();
  };
}
