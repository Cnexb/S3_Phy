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

  function n1() {
    return window.N1Art;
  }

  function inkFont(px) {
    var art = n1();
    return art ? art.font(800, px) : "800 " + px + "px Plus Jakarta Sans, sans-serif";
  }

  function drawBungee() {
    var art = n1();
    var map = worldMap(15.5, 42, 22);
    var riverY = map.Y(0);
    var zh = lang === "zh-HK";
    var boxW = 52;
    var boxH = 36;

    if (art) art.drawWater(ctx, cssW, cssH, riverY, zh ? "河面  GPE = 0" : "river  GPE = 0");
    else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#e0f2fe";
      ctx.fillRect(0, riverY, cssW, cssH - riverY);
    }

    var towerLeft = Math.max(8, map.X(0.35));
    var towerW = 34;
    var platY = map.Y(bun.H);
    var boardX = map.X(1.35);
    var boardW = Math.max(40, map.X(4.15) - boardX);
    var towerH = Math.max(16, riverY - platY);
    if (art) {
      art.slateBar(ctx, towerLeft, platY, towerW, towerH);
      art.slateBar(ctx, boardX, platY - 10, boardW, 10);
    } else {
      ctx.fillStyle = "#475569";
      ctx.fillRect(towerLeft, platY, towerW, towerH);
      ctx.fillRect(boardX, platY - 10, boardW, 10);
    }

    ctx.fillStyle = art ? art.C.ink : "#0f172a";

    var attachX = boardX + boardW - 6;
    var attachY = platY - 6;
    var personX = map.X(8.2);
    var personY = map.Y(bun.y);
    var taut = bunExt() > 0 || bunAtTautHold();
    var yTaut = bunTautY();
    var tautY = map.Y(yTaut);
    var boxX = personX - boxW / 2;
    var boxY = personY - boxH / 2;
    var cordEndX = personX;
    var cordEndY = boxY;

    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = art ? art.C.orange : "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(map.X(5.0), tautY);
    ctx.lineTo(cssW - 16, tautY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = art ? art.C.orange : "#f97316";
    ctx.font = inkFont(13);
    ctx.fillText(zh ? "繩開始伸長" : "cord starts stretching", map.X(5.0), tautY - 8);

    ctx.strokeStyle = taut ? (art ? art.C.orange : "#f97316") : (art ? art.C.floorLine : "#94a3b8");
    ctx.lineWidth = taut ? 4 : 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(attachX, attachY);
    if (!taut) {
      ctx.quadraticCurveTo(attachX + 36, (attachY + cordEndY) / 2 + 24, cordEndX, cordEndY);
    } else {
      ctx.lineTo(cordEndX, cordEndY);
    }
    ctx.stroke();

    if (art) art.skyBox(ctx, boxX, boxY, boxW, boxH);
    else {
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(boxX, boxY, boxW, boxH);
    }

    if (bun.splash) {
      ctx.fillStyle = art ? art.C.orange : "#f97316";
      ctx.font = inkFont(22);
      ctx.textAlign = "center";
      ctx.fillText(zh ? "濺水！" : "Splash!", cssW * 0.52, map.Y(8));
      ctx.textAlign = "left";
    }

    ctx.fillStyle = art ? art.C.muted : "#64748b";
    ctx.font = art ? art.mono(700, 12) : "700 12px JetBrains Mono, monospace";
    ctx.fillText("40 m", towerLeft, platY - 20);
    ctx.fillText("0", 16, riverY - 8);
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
