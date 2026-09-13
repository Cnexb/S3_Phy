/* Energy in Mechanics — pendulum
   Chrome-friendly (no modules). Open index.html in Google Chrome. */
(function () {
  "use strict";

  var G = 9.81;
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  var cssW = 800;
  var cssH = 480;
  var lang = "en";
  var running = false;
  var lastT = 0;
  var pointer = { down: false, x: 0, y: 0 };

  var COPY = {
    en: {
      title: "Pendulum energy swap",
      sub: "Set the release height, then Play. Watch GPE swap with KE.",
      play: "Play",
      pause: "Pause"
    },
    zh: {
      title: "單擺的能量互換",
      sub: "設定釋放高度，再按播放。看重力勢能與動能互換。",
      play: "播放",
      pause: "暫停"
    }
  };

  function tr(key) {
    var pack = COPY[lang] || COPY.zh;
    return pack[key];
  }

  /* ---------- helpers ---------- */
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function fmt(n, d) {
    if (!isFinite(n)) return "—";
    return Number(n).toFixed(d);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function hypot(x, y) {
    return Math.sqrt(x * x + y * y);
  }


  /* ---------- pendulum ---------- */
  var pen = {
    m: 0.2,
    L: 1.2,
    th: -0.96,
    w: 0,
    dragging: false,
    releaseH: 0.5,
    E0: 0
  };

  function penMaxH() {
    return pen.L * (1 - Math.cos(2.4));
  }

  function penThFromH(h) {
    var c = 1 - clamp(h, 0.01, penMaxH()) / pen.L;
    return -Math.acos(clamp(c, -1, 1));
  }

  function penReset() {
    pen.th = penThFromH(pen.releaseH);
    pen.w = 0;
    pen.dragging = false;
    penCaptureE0();
  }

  function penH() {
    return pen.L * (1 - Math.cos(pen.th));
  }

  function penCaptureE0() {
    pen.E0 = pen.m * G * penH() + 0.5 * pen.m * Math.pow(pen.L * pen.w, 2);
  }

  function penLockEnergy() {
    var pe = pen.m * G * penH();
    var keWant = pen.E0 - pe;
    if (keWant <= 0) {
      var hMax = pen.E0 / (pen.m * G);
      var c = 1 - clamp(hMax, 0, 2 * pen.L) / pen.L;
      var thMax = Math.acos(clamp(c, -1, 1));
      if (pen.th > 0) pen.th = Math.min(pen.th, thMax);
      else pen.th = Math.max(pen.th, -thMax);
      pen.w = 0;
      return;
    }
    var wAbs = Math.sqrt((2 * keWant) / (pen.m * pen.L * pen.L));
    pen.w = (pen.w < 0 ? -1 : 1) * wAbs;
  }

  function syncPenReleaseSlider() {
    var el = document.getElementById("penReleaseH");
    var lab = document.getElementById("penReleaseVal");
    if (el) el.value = String(pen.releaseH);
    if (lab) lab.textContent = fmt(pen.releaseH, 2) + " m";
  }

  function penStep(dt) {
    if (pen.dragging) return;
    var a = -(G / pen.L) * Math.sin(pen.th);
    pen.w += a * dt;
    pen.th += pen.w * dt;
    penLockEnergy();
  }


  /* ---------- drawing ---------- */
  function resize() {
    var stage = document.getElementById("stage");
    var r = stage.getBoundingClientRect();
    cssW = Math.max(320, r.width);
    cssH = Math.max(240, r.height);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function worldMap(worldW, worldH, pad) {
    pad = pad || 40;
    var s = Math.min((cssW - 2 * pad) / worldW, (cssH - 2 * pad) / worldH);
    var ox = (cssW - worldW * s) / 2;
    var oy = cssH - pad;
    return {
      s: s,
      ox: ox,
      oy: oy,
      X: function (x) {
        return ox + x * s;
      },
      Y: function (y) {
        return oy - y * s;
      }
    };
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function arrow(x1, y1, x2, y2, color, width) {
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var head = 11;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - 0.4), y2 - head * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - head * Math.cos(ang + 0.4), y2 - head * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
  }


  function drawSkyGround() {
    var g = ctx.createLinearGradient(0, 0, 0, cssH * 0.58);
    g.addColorStop(0, "#b9dcff");
    g.addColorStop(1, "#eef7ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#cfe6c4";
    ctx.fillRect(0, cssH * 0.58, cssW, cssH * 0.42);
    ctx.fillStyle = "#b7d59f";
    ctx.fillRect(0, cssH * 0.58, cssW, 8);
  }


  function drawPendulum() {
    drawSkyGround();
    var pivotX = cssW * 0.5;
    var pivotY = 48;
    var bobR = 26;
    var bottomRoom = 52;
    var pxPerM = Math.min(cssH - pivotY - bobR - bottomRoom, cssW * 0.42) / Math.max(pen.L, 0.8);
    var bobX = pivotX + pen.L * Math.sin(pen.th) * pxPerM;
    var bobY = pivotY + pen.L * Math.cos(pen.th) * pxPerM;
    var botY = pivotY + pen.L * pxPerM + bobR + 1.5;

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(16, botY);
    ctx.lineTo(cssW - 16, botY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,254,251,0.92)";
    roundRect(14, botY - 34, 168, 26, 8);
    ctx.fill();
    ctx.fillStyle = "#334155";
    ctx.font = "700 15px sans-serif";
    ctx.fillText(lang === "zh-HK" ? "GPE = 0（最低點）" : "GPE = 0  (bottom)", 24, botY - 15);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4c1d95";
    ctx.lineWidth = 3;
    ctx.stroke();
  }


  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    drawPendulum();
  }

  /* ---------- HUD ---------- */
  function setBar(el, val, max) {
    el.style.width = clamp((val / (max || 1)) * 100, 0, 100) + "%";
  }


  function updateHUD() {

      var h = penH();
      var v = Math.abs(pen.L * pen.w);
      var pe = pen.m * G * h;
      var tot = pen.E0 || pe;
      var ke = Math.max(0, tot - pe);
      var mx = Math.max(tot, 0.01);
      setBar(document.getElementById("penPE"), pe, mx);
      setBar(document.getElementById("penKE"), ke, mx);
      setBar(document.getElementById("penTOT"), tot, mx);
      document.getElementById("penPEVal").textContent = fmt(pe, 2) + " J";
      document.getElementById("penKEVal").textContent = fmt(ke, 2) + " J";
      document.getElementById("penTOTVal").textContent = fmt(tot, 2) + " J";
      document.getElementById("penH").textContent = fmt(h, 2) + " m";
      document.getElementById("penV").textContent = fmt(v, 2) + " m/s";
      syncPenReleaseSlider();
    
  }

  function syncPlayBtn() {
    var en = document.querySelector("#btnPlay .en");
    var zh = document.querySelector("#btnPlay .zh");
    en.textContent = running ? COPY.en.pause : COPY.en.play;
    zh.textContent = running ? COPY.zh.pause : COPY.zh.play;
  }



  function applyLang() {
    document.getElementById("stationTitle").textContent = tr("title");
    document.getElementById("stationSub").textContent = tr("sub");
  }

  function resetCurrent() {
    running = false;
    syncPlayBtn();
    pen.releaseH = 0.5;
    syncPenReleaseSlider();
    penReset();
    updateHUD();
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    if (running) {
      var steps = 2;
      var h = dt / steps;
      for (var i = 0; i < steps; i++) penStep(h);
    }
    draw();
    updateHUD();
    requestAnimationFrame(loop);
  }

  function setLang(next) {
    var zh = next === "zh" || next === "zh-HK" || next === "zh-Hant" || next === "zhHant";
    lang = zh ? "zh-HK" : "en";
    document.documentElement.lang = lang;
    document.getElementById("btnEn").classList.toggle("active", !zh);
    document.getElementById("btnZh").classList.toggle("active", zh);
    applyLang();
  }
  document.getElementById("btnEn").addEventListener("click", function () { setLang("en"); });
  document.getElementById("btnZh").addEventListener("click", function () { setLang("zh"); });
  try {
    var qLang = new URLSearchParams(location.search).get("lang");
    if (qLang) setLang(qLang);
  } catch (e) {}
  window.addEventListener("message", function (ev) {
    if (ev.data && ev.data.type === "s3phy:lang") setLang(ev.data.lang);
  });
  document.getElementById("btnPlay").addEventListener("click", function () {
    running = !running;
    syncPlayBtn();
  });
  document.getElementById("btnReset").addEventListener("click", resetCurrent);

  function bindRange(id, fn) {
    document.getElementById(id).addEventListener("input", function () {
      fn(parseFloat(this.value));
      updateHUD();
    });
  }
  bindRange("penReleaseH", function (v) {
    pen.releaseH = v;
    running = false;
    syncPlayBtn();
    penReset();
  });

  function canvasPos(ev) {
    var r = canvas.getBoundingClientRect();
    var src = ev.touches ? ev.touches[0] : ev;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }
  function penFromPointer(mx, my) {
    var pivotX = cssW * 0.5;
    var pivotY = 48;
    pen.th = Math.atan2(mx - pivotX, my - pivotY);
    pen.th = clamp(pen.th, -2.4, 2.4);
    pen.w = 0;
    pen.releaseH = Math.round(penH() * 100) / 100;
    penCaptureE0();
    syncPenReleaseSlider();
  }
  canvas.addEventListener("pointerdown", function (ev) {
    pointer.down = true;
    var p = canvasPos(ev);
    pen.dragging = true;
    running = false;
    syncPlayBtn();
    penFromPointer(p.x, p.y);
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  canvas.addEventListener("pointermove", function (ev) {
    if (!pointer.down) return;
    var p = canvasPos(ev);
    if (pen.dragging) penFromPointer(p.x, p.y);
  });
  canvas.addEventListener("pointerup", function () {
    pointer.down = false;
    pen.dragging = false;
  });
  canvas.addEventListener("pointerleave", function () {
    pointer.down = false;
    pen.dragging = false;
  });

  window.addEventListener("resize", function () {
    resize();
    draw();
  });

  penReset();
  applyLang();
  requestAnimationFrame(function () {
    resize();
    draw();
    updateHUD();
  });
  requestAnimationFrame(loop);

})();
