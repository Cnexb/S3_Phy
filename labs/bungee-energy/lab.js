/* Energy in Mechanics — bungee
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
      title: "Bungee — three kinds of energy",
      sub: "Free fall, then the cord stretches.",
      play: "Play",
      pause: "Pause"
    },
    zh: {
      title: "笨豬跳 — 三種能量",
      sub: "先自由落體，繩開始伸長。",
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


  /* ---------- bungee ---------- */
  var bun = {
    H: 40,
    m: 50,
    L: 15,
    k: 80,
    y: 40,
    v: 0,
    low: 40,
    splash: false,
    landed: false,
    heldAtTaut: false,
    tautHoldT: 0
  };

  function bunTautY() {
    return bun.H - bun.L;
  }

  function bunAtTautHold() {
    return bun.tautHoldT > 0;
  }

  function bunReset() {
    bun.y = bun.H;
    bun.v = 0;
    bun.low = bun.H;
    bun.splash = false;
    bun.landed = false;
    bun.heldAtTaut = false;
    bun.tautHoldT = 0;
  }

  function bunExt() {
    var stretched = bun.H - bun.y - bun.L;
    return Math.max(0, stretched);
  }

  function bunStep(dt) {
    if (bun.splash || bun.landed) return;
    if (bun.tautHoldT > 0) {
      bun.tautHoldT -= dt;
      if (bun.tautHoldT > 0) return;
      bun.tautHoldT = 0;
    }
    var yTaut = bunTautY();
    var ext = bunExt();
    var a = -G + (bun.k * ext) / bun.m;
    bun.v += a * dt;
    var yNext = bun.y + bun.v * dt;
    if (!bun.heldAtTaut && bun.v < 0 && bun.y > yTaut && yNext <= yTaut) {
      bun.y = yTaut;
      bun.heldAtTaut = true;
      bun.tautHoldT = 1;
      return;
    }
    bun.y = yNext;
    if (bun.y < bun.low) bun.low = bun.y;
    if (bun.y <= 0) {
      bun.y = 0;
      bun.v = 0;
      bun.splash = true;
      bun.low = 0;
      running = false;
      syncPlayBtn();
    }
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


  function drawBungee() {
    var map = worldMap(15.5, 42, 22);
    var riverY = map.Y(0);
    var g = ctx.createLinearGradient(0, 0, 0, riverY);
    g.addColorStop(0, "#9fd0ff");
    g.addColorStop(1, "#e8f4ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cssW, cssH);

    /* cliff */
    ctx.fillStyle = "#6b7280";
    ctx.beginPath();
    ctx.moveTo(0, cssH);
    ctx.lineTo(0, map.Y(bun.H) - 10);
    ctx.lineTo(map.X(4.2), map.Y(bun.H) - 10);
    ctx.lineTo(map.X(5.4), map.Y(18));
    ctx.lineTo(map.X(5.8), cssH);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, map.Y(bun.H) - 18, map.X(4.2), 12);

    /* water line */
    ctx.fillStyle = "rgba(14,116,144,0.45)";
    ctx.fillRect(0, riverY, cssW, cssH - riverY);
    ctx.strokeStyle = "#155e75";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, riverY);
    ctx.lineTo(cssW, riverY);
    ctx.stroke();
    ctx.fillStyle = "#0e7490";
    ctx.font = "700 15px sans-serif";
    ctx.fillText(lang === "zh-HK" ? "河面  GPE = 0" : "river  GPE = 0", map.X(10.2), riverY + 22);

    var attachX = map.X(3.4);
    var attachY = map.Y(bun.H);
    var personX = map.X(8.2);
    var personY = map.Y(bun.y);
    var taut = bunExt() > 0 || bunAtTautHold();
    var yTaut = bunTautY();

    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(map.X(5.6), map.Y(yTaut));
    ctx.lineTo(cssW - 16, map.Y(yTaut));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#b91c1c";
    ctx.font = "700 15px sans-serif";
    ctx.fillText(
      lang === "zh-HK" ? "繩開始伸長" : "cord starts stretching",
      map.X(8.6),
      map.Y(yTaut) - 8
    );

    ctx.strokeStyle = taut ? "#dc2626" : "#64748b";
    ctx.lineWidth = taut ? 6 : 3;
    ctx.beginPath();
    ctx.moveTo(attachX, attachY);
    if (!taut) {
      ctx.quadraticCurveTo(attachX + 36, (attachY + personY) / 2 + 24, personX, personY - 16);
    } else {
      ctx.lineTo(personX, personY - 16);
    }
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(personX, personY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1d4ed8";
    roundRect(personX - 11, personY + 12, 22, 32, 6);
    ctx.fill();

    if (bun.splash) {
      ctx.fillStyle = "#fff";
      ctx.font = "800 28px Trebuchet MS, sans-serif";
      ctx.fillText(lang === "zh-HK" ? "濺水！" : "Splash!", cssW * 0.42, map.Y(8));
    }

    ctx.fillStyle = "#334155";
    ctx.font = "700 14px ui-monospace, monospace";
    ctx.fillText("40 m", 10, map.Y(40) + 4);
    ctx.fillText("0", 18, map.Y(0) - 6);
  }


  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    drawBungee();
  }

  /* ---------- HUD ---------- */
  function setBar(el, val, max) {
    el.style.width = clamp((val / (max || 1)) * 100, 0, 100) + "%";
  }


  function updateHUD() {

      var peB = bun.m * G * bun.y;
      var keB = 0.5 * bun.m * bun.v * bun.v;
      var epe = 0.5 * bun.k * bunExt() * bunExt();
      var totB = peB + keB + epe;
      var mxB = bun.m * G * bun.H;
      setBar(document.getElementById("bunPE"), peB, mxB);
      setBar(document.getElementById("bunKE"), keB, mxB);
      setBar(document.getElementById("bunEPE"), epe, mxB);
      setBar(document.getElementById("bunTOT"), totB, mxB);
      document.getElementById("bunPEVal").textContent = fmt(peB, 0) + " J";
      document.getElementById("bunKEVal").textContent = fmt(keB, 0) + " J";
      document.getElementById("bunEPEVal").textContent = fmt(epe, 0) + " J";
      document.getElementById("bunTOTVal").textContent = fmt(totB, 0) + " J";
    
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
    bun.m = 50;
    bun.L = 15;
    bun.k = 80;
    bunReset();
    updateHUD();
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    if (running) {
      var steps = 4;
      var h = dt / steps;
      for (var i = 0; i < steps; i++) bunStep(h);
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
    if (running && (bun.splash || bun.y !== bun.H)) bunReset();
    syncPlayBtn();
  });
  document.getElementById("btnReset").addEventListener("click", resetCurrent);

  window.addEventListener("resize", function () {
    resize();
    draw();
  });

  bunReset();
  applyLang();
  requestAnimationFrame(function () {
    resize();
    draw();
    updateHUD();
  });
  requestAnimationFrame(loop);

})();
