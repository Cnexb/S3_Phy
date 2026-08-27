(function () {
  'use strict';
  document.documentElement.setAttribute('translate', 'no');
  document.documentElement.classList.add('notranslate');
  if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
    var noTranslate = document.createElement('meta');
    noTranslate.name = 'google';
    noTranslate.content = 'notranslate';
    document.head.appendChild(noTranslate);
  }
  var params = new URLSearchParams(location.search);
  if (params.get('embed') === '1' || params.get('embed') === 'true') {
    document.documentElement.classList.add('s3phy-embed');
  }
  var cur = document.currentScript;
  if (cur && cur.src) {
    var fsExit = document.createElement('script');
    fsExit.src = cur.src.replace(/[^/]+$/, 'fullscreen-exit.js');
    document.head.appendChild(fsExit);
  }
})();
