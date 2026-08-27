(function () {
  'use strict';

  var BTN_ID = 's3phy-fs-exit';

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function isActive() {
    return (
      !!fsElement() ||
      document.body.classList.contains('lab-fs') ||
      document.body.classList.contains('is-fullscreen')
    );
  }

  function getLabel() {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    if (lang.indexOf('zh') >= 0) return '退出全螢幕';
    return 'Exit full screen';
  }

  function mountParent() {
    return fsElement() || document.body;
  }

  function exitFullscreen() {
    var el = fsElement();
    if (el) {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        try {
          exit.call(document);
        } catch (_) {
          /* ignore */
        }
      }
    }
    document.body.classList.remove('lab-fs', 'is-fullscreen');
    window.dispatchEvent(new CustomEvent('s3phy:exit-fullscreen'));
  }

  function ensureButton() {
    var btn = document.getElementById(BTN_ID);
    if (btn) return btn;

    btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.className = 's3phy-fs-exit';
    btn.innerHTML =
      '<span class="s3phy-fs-exit__icon" aria-hidden="true">⛶</span>' +
      '<span class="s3phy-fs-exit__label"></span>';
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      exitFullscreen();
    });
    return btn;
  }

  function sync() {
    var active = isActive();
    var btn = document.getElementById(BTN_ID);

    if (!active) {
      if (btn) btn.remove();
      return;
    }

    btn = ensureButton();
    var label = getLabel();
    btn.setAttribute('aria-label', label);
    var labelEl = btn.querySelector('.s3phy-fs-exit__label');
    if (labelEl) labelEl.textContent = label;

    var parent = mountParent();
    if (btn.parentElement !== parent) parent.appendChild(btn);
  }

  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  document.addEventListener('mozfullscreenchange', sync);

  if (typeof MutationObserver === 'function') {
    new MutationObserver(sync).observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
})();
