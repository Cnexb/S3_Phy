(function () {
  'use strict';

  var BTN_ID = 's3phy-fs-btn';
  var isEmbed = document.documentElement.classList.contains('s3phy-embed');

  if (!document.getElementById('s3phy-fs-hide')) {
    var hideStyle = document.createElement('style');
    hideStyle.id = 's3phy-fs-hide';
    hideStyle.textContent =
      '#fullscreen-btn,#fullscreenBtn,.el-fs-btn,[data-fullscreen],.tl-fullscreen-btn{display:none!important}';
    document.head.appendChild(hideStyle);
  }

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function isLocalFullscreen() {
    return (
      !!fsElement() ||
      document.body.classList.contains('lab-fs') ||
      document.body.classList.contains('is-fullscreen')
    );
  }

  function labels() {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    var zh = lang.indexOf('zh') >= 0;
    return {
      enter: zh ? '全螢幕' : 'Fullscreen',
      exit: zh ? '退出全螢幕' : 'Exit fullscreen',
    };
  }

  function enterFullscreen() {
    var root = document.documentElement;
    var req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (req) {
      try {
        req.call(root);
      } catch (_) {
        /* ignore */
      }
    }
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

  function toggle() {
    if (isLocalFullscreen()) exitFullscreen();
    else enterFullscreen();
  }

  function shouldShow() {
    return !isEmbed;
  }

  function sync() {
    if (!shouldShow()) {
      var existing = document.getElementById(BTN_ID);
      if (existing) existing.remove();
      return;
    }

    var active = isLocalFullscreen();
    var L = labels();
    var btn = document.getElementById(BTN_ID);

    if (!btn) {
      btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.type = 'button';
      btn.className = 's3phy-fs-btn';
      btn.innerHTML =
        '<span class="s3phy-fs-btn__icon" aria-hidden="true">⛶</span>' +
        '<span class="s3phy-fs-btn__label"></span>';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      });
      document.body.appendChild(btn);
    }

    var label = active ? L.exit : L.enter;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.classList.toggle('s3phy-fs-btn--active', active);
    var labelEl = btn.querySelector('.s3phy-fs-btn__label');
    if (labelEl) labelEl.textContent = label;
    var iconEl = btn.querySelector('.s3phy-fs-btn__icon');
    if (iconEl) iconEl.textContent = active ? '✕' : '⛶';
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

  window.addEventListener('s3phy:exit-fullscreen', sync);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
})();
