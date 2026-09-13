/* Connected Containers Lab — Chrome-friendly (no modules). */
(function () {
  "use strict";

  var R = 8.31;
  var VA = 100e-6;
  var VB = 500e-6;
  var T_ICE = 273.15;
  var T_BOIL = 373.15;
  var P0 = 12e5;
  var N_TOTAL = P0 * VA / (R * T_ICE);
  var VISUAL = 96;
  var TAU = 1.65;
  var VIEW_W = 1100;
  var VIEW_H = 670;

  var lang = "en";
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");

  var A = { x: 250, y: 318, r: 80 };
  var B = { x: 748, y: 318, r: 148 };
  var TUBE = { y: 318, h: 28, x1: A.x + A.r - 6, x2: B.x - B.r + 6 };
  var TAP = { x: (TUBE.x1 + TUBE.x2) / 2, y: TUBE.y, r: 34 };
  var TABLE = { x: 28, y: 530, w: 1044, h: 118 };
  var BATH_A = { x: 145, y: 320, w: 210, h: 214 };
  var BATH_B = { x: 575, y: 340, w: 346, h: 194 };

  var state = {
    tapOpen: false,
    heating: false,
    TA: T_ICE,
    TB: T_ICE,
    nA: N_TOTAL,
    nB: 0,
    time: 0,
    slow: false,
    equalized: false,
    boiled: false
  };

  var particles = [];
  var transit = [];
  var bubbles = [];

  var COPY = {
    en: {
      tapOpen: "Close tap",
      tapClosed: "Open tap",
      heatOn: "Heater on",
      heatOff: "Heat bath A",
      slowOn: "Normal speed",
      slowOff: "Slow motion",
      yes: "Yes",
      no: "No",
      toastReset: "Experiment reset",
      toastTapOn: "Tap open — gas can flow",
      toastTapOff: "Tap closed",
      toastHeatOn: "Heater on under bath A",
      toastHeatOff: "Heater off",
      toastEq: "Pressures have equalized",
      toastBoil: "Water in bath A is boiling",
      vacLabel: "VACUUM",
      bathA: "Ice / water bath A",
      bathB: "Ice bath B stays at 0°C",
      volA: "100 cm³  ·  volume fixed",
      volB: "500 cm³  ·  volume fixed",
      tap: "TAP T"
    },
    zh: {
      tapOpen: "關閉活栓",
      tapClosed: "打開活栓",
      heatOn: "加熱中",
      heatOff: "加熱 A 水浴",
      slowOn: "正常速度",
      slowOff: "慢動作",
      yes: "是",
      no: "否",
      toastReset: "實驗已重設",
      toastTapOn: "活栓已開 — 氣體可流動",
      toastTapOff: "活栓已關",
      toastHeatOn: "A 水浴加熱中",
      toastHeatOff: "加熱已關",
      toastEq: "兩邊壓强已相等",
      toastBoil: "A 水浴正在沸騰",
      vacLabel: "真空",
      bathA: "A 的冰／水浴",
      bathB: "B 的冰浴保持 0°C",
      volA: "100 cm³  ·  體積固定",
      volB: "500 cm³  ·  體積固定",
      tap: "活栓 T"
    }
  };

  function tr(key) {
    return COPY[lang][key];
  }

  function applyLangFromHub(raw) {
    var next = (raw === "zh-Hant" || raw === "zhHant" || raw === "zh" || raw === "zh-HK") ? "zh" : "en";
    setLang(next);
  }
  window.addEventListener("message", function (ev) {
    if (ev.data && ev.data.type === "s3phy:lang") applyLangFromHub(ev.data.lang);
  });
  function setLang(next) {
    lang = next;
    document.documentElement.lang = next === "zh" ? "zh-HK" : "en";
    document.getElementById("langEn").classList.toggle("active", next === "en");
    document.getElementById("langZh").classList.toggle("active", next === "zh");
    syncButtons();
    updateUI();
  }

  function pressure(n, T, V) {
    return n * R * T / V;
  }
  function pA() { return pressure(state.nA, state.TA, VA); }
  function pB() { return pressure(state.nB, state.TB, VB); }
  function nAeq() {
    var a = VA / state.TA;
    var b = VB / state.TB;
    return N_TOTAL * a / (a + b);
  }
  function flaskOf(where) { return where === "A" ? A : B; }
  function speedFor(T) { return 46 * Math.sqrt(T / T_ICE); }

  function hueFor(T) {
    var u = Math.min(1, Math.max(0, (T - T_ICE) / 100));
    return 175 - u * 150;
  }

  function spawnIn(where, count) {
    var f = flaskOf(where);
    var T = where === "A" ? state.TA : state.TB;
    var spd = speedFor(T);
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var rad = Math.random() * (f.r - 14);
      var dir = Math.random() * Math.PI * 2;
      particles.push({
        x: f.x + Math.cos(ang) * rad,
        y: f.y + Math.sin(ang) * rad,
        vx: Math.cos(dir) * spd,
        vy: Math.sin(dir) * spd,
        where: where,
        r: 3.1 + Math.random() * 1.2,
        hue: hueFor(T) + Math.random() * 16 - 8
      });
    }
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 1600);
  }

  function resetSim(silent) {
    state.tapOpen = false;
    state.heating = false;
    state.TA = T_ICE;
    state.TB = T_ICE;
    state.nA = N_TOTAL;
    state.nB = 0;
    state.time = 0;
    state.equalized = false;
    state.boiled = false;
    particles.length = 0;
    transit.length = 0;
    bubbles.length = 0;
    spawnIn("A", VISUAL);
    syncButtons();
    if (!silent) toast(tr("toastReset"));
  }

  function toggleTap() {
    state.tapOpen = !state.tapOpen;
    toast(state.tapOpen ? tr("toastTapOn") : tr("toastTapOff"));
    syncButtons();
  }

  function toggleHeat() {
    state.heating = !state.heating;
    toast(state.heating ? tr("toastHeatOn") : tr("toastHeatOff"));
    syncButtons();
  }

  function syncButtons() {
    var tap = document.getElementById("btnTap");
    var heat = document.getElementById("btnHeat");
    var slow = document.getElementById("btnSlow");
    tap.textContent = state.tapOpen ? tr("tapOpen") : tr("tapClosed");
    tap.classList.toggle("on-tap", state.tapOpen);
    heat.textContent = state.heating ? tr("heatOn") : tr("heatOff");
    heat.classList.toggle("on-heat", state.heating);
    slow.innerHTML = state.slow
      ? '<span class="en">Normal speed</span><span class="zh">正常速度</span>'
      : '<span class="en">Slow motion</span><span class="zh">慢動作</span>';
  }

  function sendParticle(from, to) {
    var list = [];
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].where === from) list.push(i);
    }
    if (!list.length) return;
    var f = flaskOf(from);
    var mouthX = from === "A" ? f.x + f.r - 8 : f.x - f.r + 8;
    var best = list[0], bestD = 1e9;
    for (var k = 0; k < list.length; k++) {
      var p = particles[list[k]];
      var d = Math.abs(p.x - mouthX) + Math.abs(p.y - TUBE.y);
      if (d < bestD) { bestD = d; best = list[k]; }
    }
    var moved = particles.splice(best, 1)[0];
    transit.push({
      x: moved.x,
      y: moved.y,
      from: from,
      to: to,
      t: 0,
      x0: from === "A" ? A.x + A.r - 4 : B.x - B.r + 4,
      y0: TUBE.y + (Math.random() - 0.5) * 10,
      x1: to === "B" ? B.x - B.r + 4 : A.x + A.r - 4,
      y1: TUBE.y + (Math.random() - 0.5) * 10,
      r: moved.r,
      hue: moved.hue,
      T: from === "A" ? state.TA : state.TB
    });
  }

  function finishTransit(trItem) {
    var T = trItem.to === "A" ? state.TA : state.TB;
    var spd = speedFor(T);
    var dir = trItem.to === "A" ? Math.PI : 0;
    var jitter = (Math.random() - 0.5) * 1.2;
    particles.push({
      x: trItem.to === "A" ? A.x + A.r - 16 : B.x - B.r + 16,
      y: flaskOf(trItem.to).y + (Math.random() - 0.5) * 16,
      vx: Math.cos(dir + jitter) * spd,
      vy: Math.sin(dir + jitter) * spd,
      where: trItem.to,
      r: trItem.r,
      hue: hueFor(T)
    });
  }

  function bounce(p, f) {
    var dx = p.x - f.x;
    var dy = p.y - f.y;
    var d = Math.hypot(dx, dy) || 1;
    var max = f.r - 7;
    if (d > max) {
      var nx = dx / d, ny = dy / d;
      p.x = f.x + nx * max;
      p.y = f.y + ny * max;
      var vn = p.vx * nx + p.vy * ny;
      if (vn > 0) {
        p.vx -= 2 * vn * nx;
        p.vy -= 2 * vn * ny;
      }
    }
  }

  function keepSpeed(p) {
    var T = p.where === "A" ? state.TA : state.TB;
    var target = speedFor(T);
    var s = Math.hypot(p.vx, p.vy) || 1;
    p.vx = p.vx / s * target;
    p.vy = p.vy / s * target;
    p.hue = hueFor(T);
  }

  function matchCounts() {
    if (!state.tapOpen) return;
    var targetA = Math.round((state.nA / N_TOTAL) * VISUAL);
    var haveA = 0;
    for (var i = 0; i < particles.length; i++) if (particles[i].where === "A") haveA++;
    var goingA = 0;
    for (var j = 0; j < transit.length; j++) if (transit[j].to === "A") goingA++;
    var wantSend = targetA - (haveA + goingA);
    var maxBurst = state.slow ? 1 : 3;
    if (wantSend < 0 && haveA > 0) {
      var n = Math.min(maxBurst, -wantSend, haveA);
      for (var a = 0; a < n; a++) sendParticle("A", "B");
    } else if (wantSend > 0) {
      var haveB = particles.length - haveA;
      var m = Math.min(maxBurst, wantSend, haveB);
      for (var b = 0; b < m; b++) sendParticle("B", "A");
    }
    if (Math.abs(pA() - pB()) < 800 && Math.random() < (state.slow ? 0.02 : 0.06)) {
      if (haveA > 2 && (particles.length - haveA) > 2 && transit.length < 4) {
        sendParticle("A", "B");
        sendParticle("B", "A");
      }
    }
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function openBath(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x, y + h - r);
    c.arcTo(x, y + h, x + r, y + h, r);
    c.lineTo(x + w - r, y + h);
    c.arcTo(x + w, y + h, x + w, y + h - r, r);
    c.lineTo(x + w, y);
  }

  function seeded(seed) {
    var s = seed;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function makeIcePile(bath, count, seed) {
    var rnd = seeded(seed);
    var pile = [];
    var pad = 14;
    var floor = bath.y + bath.h - 8;
    var cols = Math.ceil(count * 0.62);
    var i, layer, col, w, h;
    for (i = 0; i < count; i++) {
      layer = i < cols ? 0 : 1;
      col = layer === 0 ? i : i - cols;
      w = 22 + rnd() * 12;
      h = 12 + rnd() * 7;
      pile.push({
        x: bath.x + pad + (col + 0.15 + rnd() * 0.7) * ((bath.w - pad * 2) / (layer === 0 ? cols : Math.max(1, count - cols))) - w / 2,
        y: floor - h - layer * (10 + rnd() * 5) - rnd() * 3,
        w: w,
        h: h,
        rot: (rnd() - 0.5) * 0.22,
        order: rnd()
      });
    }
    pile.sort(function (a, b) { return a.y - b.y; });
    return pile;
  }

  var ICE_A = makeIcePile(BATH_A, 12, 42);
  var ICE_B = makeIcePile(BATH_B, 18, 91);

  function drawIcePile(pile, bath, melt) {
    var fade = melt > 0.72 ? Math.max(0, 1 - (melt - 0.72) / 0.28) : 1;
    if (fade <= 0.02) return;
    ctx.save();
    openBath(ctx, bath.x, bath.y, bath.w, bath.h, 14);
    ctx.clip();
    ctx.lineWidth = 1.1;
    for (var i = 0; i < pile.length; i++) {
      var cube = pile[i];
      if (cube.order < melt) continue;
      ctx.save();
      ctx.translate(cube.x + cube.w / 2, cube.y + cube.h / 2 + melt * 6);
      ctx.rotate(cube.rot);
      ctx.globalAlpha = 0.92 * fade;
      roundRect(ctx, -cube.w / 2, -cube.h / 2, cube.w, cube.h, 4);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(3, 105, 161, 0.35)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      roundRect(ctx, -cube.w / 2 + 3, -cube.h / 2 + 2, cube.w * 0.38, cube.h * 0.34, 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function worldScale() {
    var w = canvas.clientWidth || VIEW_W;
    var h = canvas.clientHeight || VIEW_H;
    var s = Math.min(w / VIEW_W, h / VIEW_H) * 0.86;
    return { s: s, ox: (w - VIEW_W * s) / 2, oy: (h - VIEW_H * s) / 2, w: w, h: h };
  }

  function fitCanvas(c, fallbackW, fallbackH) {
    var parent = c.parentElement;
    var rect = parent.getBoundingClientRect();
    var w = Math.max(280, Math.floor(rect.width));
    var h = Math.max(160, Math.floor(rect.height || fallbackH));
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }

  function drawThermo(x, y, T, hot) {
    var h = 78;
    var frac = (T - T_ICE) / 100;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#5b7280";
    ctx.lineWidth = 1.5;
    roundRect(ctx, -6, -h, 12, h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 8, 10, 0, Math.PI * 2);
    ctx.fillStyle = hot ? "#c2410c" : "#0369a1";
    ctx.fill();
    ctx.fillStyle = hot ? "#c2410c" : "#0369a1";
    roundRect(ctx, -3, -h * frac, 6, h * frac + 8, 3);
    ctx.fill();
    ctx.fillStyle = "#1a2430";
    ctx.font = "700 11px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(Math.round(T - 273.15) + "°C", 14, -h + 8);
    ctx.restore();
  }

  function drawChip(x, y, text) {
    ctx.save();
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var w = Math.min(210, ctx.measureText(text).width + 18);
    roundRect(ctx, x - w / 2, y - 11, w, 22, 9);
    ctx.fillStyle = "rgba(255,253,249,0.96)";
    ctx.fill();
    ctx.strokeStyle = "#cfdce6";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#5a6878";
    ctx.fillText(text, x, y + 0.5);
    ctx.restore();
  }

  function drawFlask(f, fill, label) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r - 3, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#5b7280";
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(f.x - f.r * 0.28, f.y - f.r * 0.32, f.r * 0.16, f.r * 0.28, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
    ctx.fillStyle = "#1a2430";
    ctx.font = "800 22px Trebuchet MS, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, f.x, f.y - f.r - 36);
  }

  function drawScene() {
    var ws = worldScale();
    ctx.clearRect(0, 0, ws.w, ws.h);
    ctx.fillStyle = "rgba(255,253,249,0.35)";
    ctx.fillRect(0, 0, ws.w, ws.h);

    ctx.save();
    ctx.translate(ws.ox, ws.oy);
    ctx.scale(ws.s, ws.s);

    ctx.fillStyle = "#d7e6ec";
    roundRect(ctx, TABLE.x, TABLE.y, TABLE.w, TABLE.h, 16);
    ctx.fill();
    ctx.fillStyle = "#c5d4de";
    roundRect(ctx, TABLE.x, TABLE.y, TABLE.w, 18, 8);
    ctx.fill();

    var heat = Math.min(1, Math.max(0, (state.TA - T_ICE) / 100));
    var meltA = Math.min(1, Math.max(0, (state.TA - T_ICE) / 72));
    ctx.fillStyle = "rgba(" +
      Math.round(125 + 70 * heat) + ", " +
      Math.round(211 - 90 * heat) + ", " +
      Math.round(252 - 180 * heat) + ", " +
      (0.2 + 0.08 * heat) + ")";
    ctx.strokeStyle = "#5b7280";
    ctx.lineWidth = 2;
    openBath(ctx, BATH_A.x, BATH_A.y, BATH_A.w, BATH_A.h, 14);
    ctx.fill();

    ctx.fillStyle = "rgba(125, 211, 252, 0.22)";
    openBath(ctx, BATH_B.x, BATH_B.y, BATH_B.w, BATH_B.h, 14);
    ctx.fill();

    drawIcePile(ICE_A, BATH_A, meltA);
    drawIcePile(ICE_B, BATH_B, 0);

    openBath(ctx, BATH_A.x, BATH_A.y, BATH_A.w, BATH_A.h, 14);
    ctx.stroke();
    openBath(ctx, BATH_B.x, BATH_B.y, BATH_B.w, BATH_B.h, 14);
    ctx.stroke();

    if (state.heating || state.TA > T_ICE + 2) {
      ctx.save();
      ctx.globalAlpha = 0.25 + 0.55 * ((state.TA - T_ICE) / 100);
      ctx.fillStyle = "#c2410c";
      roundRect(ctx, A.x - 48, TABLE.y + 10, 96, 12, 4);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = "#d7e6ec";
    roundRect(ctx, TUBE.x1, TUBE.y - TUBE.h / 2, TUBE.x2 - TUBE.x1, TUBE.h, 10);
    ctx.fill();
    ctx.strokeStyle = "#5b7280";
    ctx.lineWidth = 3;
    ctx.stroke();

    if (!state.tapOpen) {
      ctx.fillStyle = "#c2410c";
      roundRect(ctx, TAP.x - 7, TUBE.y - 18, 14, 36, 4);
      ctx.fill();
    } else if (Math.abs(pA() - pB()) > 4000) {
      ctx.fillStyle = "rgba(180, 83, 9, 0.45)";
      var dir = pA() > pB() ? 1 : -1;
      for (var i = 0; i < 5; i++) {
        var x = TAP.x - 40 + ((state.time * 80 * dir + i * 18) % 90);
        ctx.beginPath();
        ctx.moveTo(x, TUBE.y);
        ctx.lineTo(x - 8 * dir, TUBE.y - 5);
        ctx.lineTo(x - 8 * dir, TUBE.y + 5);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.translate(TAP.x, TAP.y - 28);
    ctx.rotate(state.tapOpen ? -0.7 : 0);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#b45309";
    ctx.fill();
    ctx.strokeStyle = "#7c2d12";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-14, 0); ctx.lineTo(14, 0);
    ctx.moveTo(0, -14); ctx.lineTo(0, 14);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#b45309";
    roundRect(ctx, TAP.x - 5, TAP.y - 22, 10, 18, 3);
    ctx.fill();
    ctx.fillStyle = "#1a2430";
    ctx.font = "800 13px Trebuchet MS, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(tr("tap"), TAP.x, TAP.y - 56);

    var densA = Math.min(1, (state.nA / N_TOTAL) * 1.15);
    var densB = Math.min(1, (state.nB / N_TOTAL) * (VA / VB) / 0.2);
    var fillA = "rgba(" + Math.round(15 + 180 * heat) + ", " + Math.round(118 - 50 * heat) + ", " + Math.round(110 - 80 * heat) + ", " + (0.08 + densA * 0.22) + ")";
    var fillB = pB() < 500 ? "rgba(255,253,249,0.4)" : "rgba(15, 118, 110, " + (0.06 + Math.min(0.22, densB * 0.18)) + ")";
    drawFlask(A, fillA, "A");
    drawFlask(B, fillB, "B");

    if (pB() < 800 && !state.tapOpen) {
      ctx.fillStyle = "#0369a1";
      ctx.font = "800 16px Trebuchet MS, Segoe UI, sans-serif";
      ctx.fillText(tr("vacLabel"), B.x, B.y + 6);
    }

    var b, trItem, p;
    for (b = 0; b < bubbles.length; b++) {
      ctx.globalAlpha = Math.max(0, bubbles[b].a);
      ctx.strokeStyle = "rgba(3, 105, 161, 0.65)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bubbles[b].x, bubbles[b].y, bubbles[b].r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    for (var t = 0; t < transit.length; t++) {
      trItem = transit[t];
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + hueFor(trItem.T) + " 70% 42%)";
      ctx.arc(trItem.x, trItem.y, trItem.r || 3.6, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var n = 0; n < particles.length; n++) {
      p = particles[n];
      var T = p.where === "A" ? state.TA : state.TB;
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + hueFor(T) + " 70% 42%)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    drawChip(A.x, A.y - A.r - 16, tr("volA"));
    drawChip(B.x, B.y - B.r - 16, tr("volB"));

    drawThermo(BATH_A.x + BATH_A.w + 22, BATH_A.y + BATH_A.h - 28, state.TA, state.TA > 320);
    drawThermo(BATH_B.x + BATH_B.w + 22, BATH_B.y + BATH_B.h - 28, state.TB, false);

    ctx.fillStyle = "#5a6878";
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(tr("bathA"), BATH_A.x + BATH_A.w / 2, TABLE.y + 38);
    ctx.fillText(tr("bathB"), BATH_B.x + BATH_B.w / 2, TABLE.y + 38);

    ctx.restore();
  }

  function setYesNo(id, yes) {
    var el = document.getElementById(id);
    el.textContent = yes ? tr("yes") : tr("no");
    el.className = yes ? "yes" : "no";
  }

  function updateUI() {
    var pa = pA(), pb = pB();
    document.getElementById("pA").textContent = (pa / 1e5).toFixed(2) + " × 10⁵ Pa";
    document.getElementById("pB").textContent = (pb / 1e5).toFixed(2) + " × 10⁵ Pa";
    document.getElementById("tA").textContent = Math.round(state.TA - 273.15) + " °C";
    document.getElementById("tB").textContent = Math.round(state.TB - 273.15) + " °C";

    var sameP = Math.abs(pa - pb) < 4000;
    var sameT = Math.abs(state.TA - state.TB) < 3;
    var sameN = Math.abs(state.nA - state.nB) < 0.004;
    setYesNo("cmpP", sameP);
    setYesNo("cmpT", sameT);
    setYesNo("cmpN", sameN);
  }

  function step(dt) {
    var scale = state.slow ? 0.28 : 1;
    var h = dt * scale;
    state.time += h;

    var heatRate = 38;
    if (state.heating) state.TA = Math.min(T_BOIL, state.TA + heatRate * h);
    else state.TA = Math.max(T_ICE, state.TA - heatRate * 0.85 * h);

    if (state.tapOpen) {
      var eq = nAeq();
      var k = 1 - Math.exp(-h / TAU);
      var dn = (eq - state.nA) * k;
      state.nA = Math.min(N_TOTAL, Math.max(0, state.nA + dn));
      state.nB = N_TOTAL - state.nA;
    }

    matchCounts();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx * h;
      p.y += p.vy * h;
      bounce(p, flaskOf(p.where));
      keepSpeed(p);
    }

    for (var t = transit.length - 1; t >= 0; t--) {
      var trItem = transit[t];
      trItem.t += h / (state.slow ? 1.15 : 0.42);
      var u = Math.min(1, trItem.t);
      trItem.x = trItem.x0 + (trItem.x1 - trItem.x0) * u;
      trItem.y = trItem.y0 + (trItem.y1 - trItem.y0) * u + Math.sin(u * Math.PI) * 4;
      if (u >= 1) {
        finishTransit(trItem);
        transit.splice(t, 1);
      }
    }

    if (state.TA > T_ICE + 8 && Math.random() < 0.4 * scale) {
      bubbles.push({
        x: A.x + (Math.random() - 0.5) * 70,
        y: BATH_A.y + 90 + Math.random() * 40,
        r: 2 + Math.random() * 3,
        v: 18 + Math.random() * 24,
        a: 1
      });
    }
    for (var b = bubbles.length - 1; b >= 0; b--) {
      bubbles[b].y -= bubbles[b].v * h;
      bubbles[b].a -= 0.35 * h;
      if (bubbles[b].a <= 0 || bubbles[b].y < BATH_A.y + 8) bubbles.splice(b, 1);
    }

    var dp = Math.abs(pA() - pB());
    if (state.tapOpen && dp < 2500 && !state.equalized) {
      state.equalized = true;
      toast(tr("toastEq"));
    }
    if (state.TA > 372 && !state.boiled) {
      state.boiled = true;
      toast(tr("toastBoil"));
    }

    drawScene();
    updateUI();
  }

  function canvasPoint(ev) {
    var rect = canvas.getBoundingClientRect();
    var ws = worldScale();
    return {
      x: (ev.clientX - rect.left - ws.ox) / ws.s,
      y: (ev.clientY - rect.top - ws.oy) / ws.s
    };
  }

  canvas.addEventListener("click", function (ev) {
    var pt = canvasPoint(ev);
    if (Math.hypot(pt.x - TAP.x, pt.y - (TAP.y - 20)) < 40) {
      toggleTap();
    }
  });

  document.getElementById("langEn").addEventListener("click", function () { setLang("en"); });
  document.getElementById("langZh").addEventListener("click", function () { setLang("zh"); });
  document.getElementById("btnTap").addEventListener("click", toggleTap);
  document.getElementById("btnHeat").addEventListener("click", toggleHeat);
  document.getElementById("btnReset").addEventListener("click", function () { resetSim(false); });
  document.getElementById("btnSlow").addEventListener("click", function () {
    state.slow = !state.slow;
    syncButtons();
  });

  window.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea")) return;
    var k = e.key.toLowerCase();
    if (k === "t") toggleTap();
    if (k === "h") toggleHeat();
    if (k === "r") resetSim(false);
    if (k === "s") { state.slow = !state.slow; syncButtons(); }
  });

  function resizeAll() {
    fitCanvas(canvas, 900, 560);
  }
  window.addEventListener("resize", resizeAll);

  var last = 0;
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt);
    requestAnimationFrame(loop);
  }

  try {
    var qLang = new URLSearchParams(location.search).get("lang");
    if (qLang) applyLangFromHub(qLang);
    else setLang("en");
  } catch (e) { setLang("en"); }
  resetSim(true);
  resizeAll();
  requestAnimationFrame(loop);
})();
