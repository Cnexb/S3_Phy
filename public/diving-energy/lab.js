/* Energy in Mechanics — diving
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
      title: "Diving — from platform to water",
      sub: "Jump up from P, fall past the platform into the pool, and stop at Q.",
      play: "Play",
      pause: "Pause"
    },
    zh: {
      title: "跳水 — 從跳台到水中",
      sub: "從 P 向上跳，經過跳台落入泳池，停在 Q。",
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


  /* ---------- diving ---------- */
  var dive = {
    m: 60,
    u: 5,
    H: 8,
    c: 2.6,
    y: 8,
    v: 5,
    t: 0,
    thermal: 0,
    E0: 0,
    inWater: false,
    aWater: 0,
    done: false,
    peakY: 8,
    dist: 0,
    trail: []
  };

  function divePeakRise() {
    return dive.u * dive.u / (2 * G);
  }

  function diveReset() {
    dive.y = dive.H;
    dive.v = dive.u;
    dive.t = 0;
    dive.thermal = 0;
    dive.inWater = false;
    dive.aWater = 0;
    dive.done = false;
    dive.peakY = dive.H;
    dive.dist = 0;
    dive.trail = [{ x: 4.5, y: dive.y }];
    dive.E0 = dive.m * G * dive.y + 0.5 * dive.m * dive.v * dive.v;
  }

  function diveStep(dt) {
    if (dive.done) return;
    var a = dive.inWater ? dive.aWater : -G;
    var v0 = dive.v;
    var y0 = dive.y;
    dive.v += a * dt;
    var yNext = dive.y + dive.v * dt;

    if (!dive.inWater && v0 > 0 && dive.v <= 0) {
      dive.v = 0;
      dive.peakY = Math.max(dive.peakY, dive.y);
    }

    if (!dive.inWater && y0 > 0 && yNext <= 0 && dive.v < 0) {
      var frac = y0 / (y0 - yNext);
      dive.t += dt * frac;
      dive.dist += y0;
      dive.y = 0;
      dive.v = v0 + a * dt * frac;
      dive.inWater = true;
      dive.aWater = (dive.v * dive.v) / (2 * Math.max(dive.c, 0.2));
      dive.trail.push({ x: diveWorldX(), y: dive.y });
      return;
    }

    if (dive.inWater) {
      if (dive.v >= 0) {
        var dyStop = -(v0 * v0) / (2 * Math.max(dive.aWater, 1e-6));
        dive.y = y0 + dyStop;
        dive.thermal += dive.m * dive.aWater * Math.abs(dyStop);
        dive.dist += Math.abs(dyStop);
        dive.v = 0;
        dive.t += dt;
        dive.done = true;
        dive.trail.push({ x: diveWorldX(), y: dive.y });
        running = false;
        syncPlayBtn();
        return;
      }
      dive.thermal += dive.m * dive.aWater * Math.abs(yNext - y0);
      dive.y = yNext;
    } else {
      dive.y = yNext;
      if (dive.y > dive.peakY) dive.peakY = dive.y;
    }

    dive.t += dt;
    dive.dist += Math.abs(dive.y - y0);
    if (dive.trail.length > 120) dive.trail.shift();
    dive.trail.push({ x: diveWorldX(), y: dive.y });
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

  function arrow(x1, y1, x2, y2, color, width) {
    var art = n1();
    if (art) {
      art.drawArrow(ctx, x1, y1, x2, y2, color, width || 3.2);
      return;
    }
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


  function divePathXs() {
    var upX = 4.5;
    var downX = 5.55;
    var midX = (upX + downX) / 2;
    return { upX: upX, downX: downX, midX: midX, turnR: (downX - upX) / 2 };
  }

  /* Follow schematic path: up column → semicircle at peak → down column (no X teleport). */
  function divePersonPos() {
    var xs = divePathXs();
    var peak = dive.H + divePeakRise();
    var R = xs.turnR;
    var yArc = peak - R;

    if (dive.inWater || dive.done) {
      return { x: xs.downX, y: dive.y };
    }
    if (dive.v >= 0 && dive.y <= yArc + 1e-6) {
      return { x: xs.upX, y: dive.y };
    }
    if (dive.v < 0 && dive.y <= yArc + 1e-6) {
      return { x: xs.downX, y: dive.y };
    }

    var frac = clamp((dive.y - yArc) / Math.max(R, 0.01), 0, 1);
    /* Rising: π → π/2; falling: π/2 → 0 (matches dashed arc). */
    var ang = dive.v >= 0
      ? Math.PI - frac * (Math.PI / 2)
      : frac * (Math.PI / 2);
    return {
      x: xs.midX + R * Math.cos(ang),
      y: yArc + R * Math.sin(ang)
    };
  }

  function diveWorldX() {
    return divePersonPos().x;
  }

  function drawDivePerson(px, py) {
    var art = n1();
    var boxW = 44;
    var boxH = 30;
    var x = px - boxW / 2;
    var y = py - boxH / 2;
    if (art) art.skyBox(ctx, x, y, boxW, boxH);
    else {
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(x, y, boxW, boxH);
    }
  }

  function drawDiveTower(X, Y) {
    var art = n1();
    var top = Y(dive.H);
    var waterY = Y(0);
    var towerW = 34;
    var boardX = X(1.55);
    var boardW = Math.max(48, X(4.35) - boardX);
    var towerH = Math.max(16, waterY - top);
    if (art) {
      art.slateBar(ctx, X(0.2), top, towerW, towerH);
      art.slateBar(ctx, boardX, top - 10, boardW, 10);
    } else {
      ctx.fillStyle = "#475569";
      ctx.fillRect(X(0.2), top, towerW, towerH);
      ctx.fillRect(boardX, top - 10, boardW, 10);
    }
  }

  function drawDive() {
    var peak = dive.H + divePeakRise();
    var qY = -dive.c;
    var worldTop = peak + 1.2;
    var worldBot = dive.c + 1.4;
    var worldH = worldTop + worldBot;
    var pad = 28;
    var s = Math.min((cssW - 2 * pad) / 10, (cssH - 2 * pad) / worldH);
    var ox = pad + 16;
    var oy = pad + worldTop * s;
    function X(x) {
      return ox + x * s;
    }
    function Y(y) {
      return oy - y * s;
    }

    var art = n1();
    var zh = lang === "zh-HK";
    if (art) art.drawWater(ctx, cssW, cssH, Y(0), zh ? "水面  GPE = 0" : "water  GPE = 0");
    else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#e0f2fe";
      ctx.fillRect(0, Y(0), cssW, cssH - Y(0));
    }

    drawDiveTower(X, Y);

    var xs = divePathXs();

    /* Photo path: up vertically, U-turn at peak, straight down to Q */
    var upX = X(xs.upX);
    var downX = X(xs.downX);
    var midX = X(xs.midX);
    var yP = Y(dive.H);
    var yPeak = Y(peak);
    var yQ = Y(qY);
    var turnR = (downX - upX) / 2;

    ctx.setLineDash([8, 7]);
    ctx.strokeStyle = art ? art.C.floorLine : "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(upX, yP);
    ctx.lineTo(upX, yPeak + turnR);
    /* semicircle to the right at the apex (screen coords: y increases downward) */
    ctx.arc(midX, yPeak + turnR, turnR, Math.PI, 0, false);
    ctx.lineTo(downX, yQ);
    ctx.stroke();
    ctx.setLineDash([]);

    var midUp = (dive.H + peak) / 2;
    arrow(upX, Y(midUp + 0.2), upX, Y(midUp - 0.35), art ? art.C.orange : "#f97316", 3.2);
    var midDown = Math.max(peak * 0.35, 1.2);
    arrow(downX, Y(midDown + 0.45), downX, Y(midDown - 0.35), art ? art.C.orange : "#f97316", 3.2);

    ctx.fillStyle = art ? art.C.ink : "#0f172a";
    ctx.font = inkFont(13);
    ctx.fillText(zh ? "跳台" : "platform", X(0.35), Y(dive.H) - 18);
    ctx.font = inkFont(16);
    ctx.fillText("P", X(3.55), yP - 18);
    ctx.fillText("Q", downX + 12, yQ + 5);

    var pos = divePersonPos();
    var px = X(pos.x);
    var py = Y(pos.y);
    if (!running && !dive.done && dive.dist < 0.05) {
      py = Y(dive.H) - 15;
      px = upX;
    }
    drawDivePerson(px, py);
  }


  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    drawDive();
  }

  /* ---------- HUD ---------- */
  function setBar(el, val, max) {
    el.style.width = clamp((val / (max || 1)) * 100, 0, 100) + "%";
  }


  function updateHUD() {

      var peD = dive.m * G * dive.y;
      var keD = 0.5 * dive.m * dive.v * dive.v;
      var thD = dive.thermal;
      var totD = peD + keD + thD;
      var mxD = Math.max(dive.E0, totD, 1);
      setBar(document.getElementById("divePE"), Math.max(0, peD), mxD);
      setBar(document.getElementById("diveKE"), keD, mxD);
      setBar(document.getElementById("diveTH"), thD, mxD);
      setBar(document.getElementById("diveTOT"), totD, mxD);
      document.getElementById("divePEVal").textContent = fmt(peD, 0) + " J";
      document.getElementById("diveKEVal").textContent = fmt(keD, 0) + " J";
      document.getElementById("diveTHVal").textContent = fmt(thD, 0) + " J";
      document.getElementById("diveTOTVal").textContent = fmt(totD, 0) + " J";
      document.getElementById("diveV").textContent = fmt(dive.v, 2) + " m/s";
    
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
    dive.u = 5;
    dive.H = 8;
    dive.c = 2.6;
    diveReset();
    updateHUD();
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    if (running) {
      var steps = 4;
      var h = dt / steps;
      for (var i = 0; i < steps; i++) diveStep(h);
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
    if (running && (dive.done || dive.t > 0 || dive.y !== dive.H)) diveReset();
    syncPlayBtn();
  });
  document.getElementById("btnReset").addEventListener("click", resetCurrent);

  window.addEventListener("resize", function () {
    resize();
    draw();
  });

  diveReset();
  applyLang();
  requestAnimationFrame(function () {
    resize();
    draw();
    updateHUD();
  });
  requestAnimationFrame(loop);

})();
