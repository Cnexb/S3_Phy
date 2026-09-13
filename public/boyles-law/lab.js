/* Heat & Gases Lab — Boyle / Pressure / Charles.
   Chrome-friendly (no modules). Use boyle.html / pressure.html / charles.html
   or set <body data-lab="boyle|pressure|charles">. */
(function () {
  "use strict";

  var R = 8.31; // J mol^-1 K^-1

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  var gCanvas = document.getElementById("g");
  var gctx = gCanvas.getContext("2d");
  var cssW = 900;
  var cssH = 560;
  var gW = 480;
  var gH = 360;

  var lang = "en";
  var mode = (document.body.getAttribute("data-lab") || "boyle").toLowerCase();
  if (mode !== "boyle" && mode !== "pressure" && mode !== "charles") mode = "boyle";
  var lastTs = 0;

  // Tuned so classroom syringe ~100 kPa at 50 cm³, 300 K
  var nMol = 0.002;
  var Vcm3 = 50;
  var Tc = 27;
  var particles = [];
  var trail = [];
  var MAX_TRAIL = 80;
  var ref = { P: 100, V: 50, T: 300 };

  var COPY = {
    en: {
      boyleTitle: "Boyle's law lab",
      boyleSub: "Fixed mass & temperature · squeeze the syringe and watch P × V stay constant.",
      pressureTitle: "Pressure law lab",
      pressureSub: "Fixed mass & volume · heat the sealed vessel and watch P rise with Kelvin T.",
      charlesTitle: "Charles' law lab",
      charlesSub: "Fixed mass & pressure · warm the gas and watch volume expand with Kelvin T.",
      lockT: "T fixed",
      lockV: "V fixed",
      lockP: "P fixed",
      lockM: "m fixed"
    },
    zh: {
      boyleTitle: "波義耳定律實驗",
      boyleSub: "質量與溫度固定 · 擠壓注射器，看 P × V 保持不變。",
      pressureTitle: "壓强定律實驗",
      pressureSub: "質量與體積固定 · 加熱密閉容器，看 P 隨開氏溫度上升。",
      charlesTitle: "查理定律實驗",
      charlesSub: "質量與壓强固定 · 加熱氣體，看體積隨開氏溫度膨脹。",
      lockT: "T 固定",
      lockV: "V 固定",
      lockP: "P 固定",
      lockM: "m 固定"
    }
  };

  function tr(key) {
    return COPY[lang][key];
  }

  function Tkelvin() {
    return Tc + 273;
  }

  function pressureKPa() {
    return (nMol * R * Tkelvin() * 1000) / Vcm3;
  }

  var TC_LO = -50;
  var TC_HI = 200;
  var V_LO = 20;
  var V_HI = 180;

  function charlesTkRange() {
    var t0 = Math.max(1, ref.T);
    var v0 = Math.max(1e-6, ref.V);
    var tkLo = Math.max(TC_LO + 273, t0 * (V_LO / v0));
    var tkHi = Math.min(TC_HI + 273, t0 * (V_HI / v0));
    if (tkHi < tkLo) tkHi = tkLo;
    return { lo: tkLo, hi: tkHi };
  }

  function applyCharlesTk(tk) {
    var r = charlesTkRange();
    tk = Math.max(r.lo, Math.min(r.hi, tk));
    Tc = Math.round(tk - 273);
    Vcm3 = ref.V * (Tc + 273) / Math.max(1, ref.T);
    document.getElementById("slT").value = String(Math.max(TC_LO, Math.min(TC_HI, Tc)));
    document.getElementById("slV").value = String(Math.round(Math.max(V_LO, Math.min(V_HI, Vcm3))));
  }

  function updateDerived() {
    var P = pressureKPa();
    document.getElementById("valN").textContent = (nMol * 1000).toFixed(2) + " mmol";
    document.getElementById("valV").textContent = Vcm3.toFixed(1) + " cm³";
    document.getElementById("valT").textContent = Tc + " °C  ·  " + Tkelvin() + " K";
    document.getElementById("valPTarget").textContent = P.toFixed(1) + " kPa";
    document.getElementById("outP").textContent = P.toFixed(1) + " kPa";
    document.getElementById("outV").textContent = Vcm3.toFixed(1) + " cm³";
    document.getElementById("outT").textContent = Tkelvin() + " K";
    document.getElementById("outPVT").textContent = ((P * Vcm3) / Tkelvin()).toFixed(2);
    // Keep P slider in sync when V or T drives the change
    var slP = document.getElementById("slP");
    var pClamped = Math.max(50, Math.min(300, Math.round(P)));
    if (document.activeElement !== slP) slP.value = String(pClamped);
    syncParticleCount();
    syncParticleSpeeds();
  }

  function syncParticleCount() {
    var target = Math.round(18 + (nMol / 0.004) * 50);
    target = Math.max(12, Math.min(70, target));
    while (particles.length < target) particles.push(makeParticle());
    while (particles.length > target) particles.pop();
  }

  function makeParticle() {
    var box = chamberBox();
    var s = speedScale();
    var ang = Math.random() * Math.PI * 2;
    var mag = s * (0.75 + Math.random() * 0.5);
    return {
      x: box.x + 8 + Math.random() * (box.w - 16),
      y: box.y + 8 + Math.random() * (box.h - 16),
      vx: Math.cos(ang) * mag,
      vy: Math.sin(ang) * mag,
      r: 3.2 + Math.random() * 1.4,
      hue: 175 + Math.random() * 40,
      kin: 0.75 + Math.random() * 0.5
    };
  }

  function speedScale() {
    // Hotter gas → faster particles. Linear in T so −50 °C vs 200 °C is obvious
    // (√T alone only changes speed by ~25% over that range).
    return 0.55 + 3.8 * (Math.max(Tkelvin(), 1) / 473);
  }

  function syncParticleSpeeds() {
    var s = speedScale();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var sp = Math.hypot(p.vx, p.vy) || 1;
      if (p.kin == null) p.kin = 0.75 + Math.random() * 0.5;
      var target = s * p.kin;
      p.vx = (p.vx / sp) * target;
      p.vy = (p.vy / sp) * target;
    }
  }

  function chamberBox() {
    var marginX = 28;
    // Keep chamber + optional piston fully inside the left canvas
    var marginRight = mode === "pressure" ? 36 : 100;
    var maxW = cssW - marginX - marginRight;
    var minW = Math.max(150, cssW * 0.38);
    if (maxW < minW) maxW = minW;
    var w = minW + (maxW - minW) * Math.max(0, Math.min(1, (Vcm3 - 20) / 80));
    var h = cssH * 0.58;
    var x = marginX;
    // Room above for Bourdon gauge (always drawn over the chamber)
    var topPad = cssH * 0.24;
    var y = Math.max(topPad, (cssH - h) * 0.30);
    return { x: x, y: y, w: w, h: h };
  }

  function recordTrail() {
    var P = pressureKPa();
    var last = trail[trail.length - 1];
    if (last && Math.abs(last.V - Vcm3) < 0.2 && Math.abs(last.P - P) < 0.4 && Math.abs(last.T - Tkelvin()) < 0.5) {
      return;
    }
    trail.push({ V: Vcm3, P: P, T: Tkelvin(), mode: mode });
    if (trail.length > MAX_TRAIL) trail.shift();
  }

  function fitCanvas(el, c, setter) {
    var stage = el.parentElement;
    var rect = stage.getBoundingClientRect();
    var w = Math.max(220, rect.width);
    var h = Math.max(160, rect.height);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    setter(w, h, dpr);
  }

  function resize() {
    fitCanvas(canvas, canvas, function (w, h, dpr) {
      cssW = w;
      cssH = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    fitCanvas(gCanvas, gCanvas, function (w, h, dpr) {
      gW = w;
      gH = h;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
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
    applyModeChrome();
  }

  function applyModeChrome() {
    var titles = {
      boyle: ["boyleTitle", "boyleSub"],
      pressure: ["pressureTitle", "pressureSub"],
      charles: ["charlesTitle", "charlesSub"]
    };
    var keys = titles[mode] || titles.boyle;
    document.getElementById("modeTitle").textContent = tr(keys[0]);
    document.getElementById("modeSub").textContent = tr(keys[1]);

    var showN = false;
    var showV = mode === "boyle" || mode === "charles";
    var showT = mode === "pressure" || mode === "charles";
    var showP = mode === "boyle" || mode === "pressure";

    document.getElementById("wrapN").hidden = !showN;
    document.getElementById("wrapV").hidden = !showV;
    document.getElementById("wrapT").hidden = !showT;
    document.getElementById("wrapP").hidden = !showP;

    var slV = document.getElementById("slV");
    slV.min = String(V_LO);
    slV.max = mode === "charles" ? String(V_HI) : "100";
    slV.step = "1";
    if (mode !== "charles" && Vcm3 > 100) Vcm3 = 100;

    document.getElementById("slN").disabled = !showN;
    slV.disabled = !showV;
    document.getElementById("slT").disabled = !showT;
    document.getElementById("slP").disabled = !showP;
    slV.value = String(Math.round(Vcm3));

    var locks = [{ key: "lockM", on: true }];
    if (mode === "boyle") locks.push({ key: "lockT", on: true });
    if (mode === "pressure") locks.push({ key: "lockV", on: true });
    if (mode === "charles") locks.push({ key: "lockP", on: true });
    document.getElementById("lockBadges").innerHTML = locks
      .map(function (L) {
        return '<span class="lock' + (L.on ? " on" : "") + '">' + tr(L.key) + "</span>";
      })
      .join("");
  }

  function setMode(next) {
    mode = next;
    var tabs = document.getElementById("modeTabs");
    if (tabs) {
      var buttons = tabs.querySelectorAll("button[data-mode]");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("on", buttons[i].getAttribute("data-mode") === next);
      }
    }
    applyModeChrome();
    ref = { P: pressureKPa(), V: Vcm3, T: Tkelvin() };
    trail = [];
    updateDerived();
    recordTrail();
  }

  function stepParticles(dt) {
    var box = chamberBox();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      if (p.x < box.x + p.r) {
        p.x = box.x + p.r;
        p.vx = Math.abs(p.vx);
      }
      if (p.x > box.x + box.w - p.r) {
        p.x = box.x + box.w - p.r;
        p.vx = -Math.abs(p.vx);
      }
      if (p.y < box.y + p.r) {
        p.y = box.y + p.r;
        p.vy = Math.abs(p.vy);
      }
      if (p.y > box.y + box.h - p.r) {
        p.y = box.y + box.h - p.r;
        p.vy = -Math.abs(p.vy);
      }
    }
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var A = particles[a];
        var B = particles[b];
        var dx = B.x - A.x;
        var dy = B.y - A.y;
        var d2 = dx * dx + dy * dy;
        var minD = A.r + B.r;
        if (d2 > 0 && d2 < minD * minD) {
          var d = Math.sqrt(d2);
          var nx = dx / d;
          var ny = dy / d;
          var overlap = (minD - d) * 0.5;
          A.x -= nx * overlap;
          A.y -= ny * overlap;
          B.x += nx * overlap;
          B.y += ny * overlap;
          var dvx = A.vx - B.vx;
          var dvy = A.vy - B.vy;
          var vn = dvx * nx + dvy * ny;
          if (vn > 0) continue;
          A.vx -= vn * nx;
          A.vy -= vn * ny;
          B.vx += vn * nx;
          B.vy += vn * ny;
        }
      }
    }
    syncParticleSpeeds();
  }

  function drawChamber() {
    var box = chamberBox();
    var P = pressureKPa();
    var heat = Math.min(1, Math.max(0, (Tc + 50) / 250));

    ctx.fillStyle = "rgba(26,36,48,0.78)";
    ctx.font = "700 13px " + getComputedStyle(document.body).fontFamily;
    ctx.fillText(modeLabel(), 20, 28);

    var wallColor = "rgba(15, 118, 110, 0.85)";
    ctx.lineWidth = 4;
    ctx.strokeStyle = wallColor;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    roundRect(ctx, box.x, box.y, box.w, box.h, 14);
    ctx.fill();
    ctx.stroke();

    var grd = ctx.createLinearGradient(box.x, box.y, box.x, box.y + box.h);
    grd.addColorStop(0, "rgba(194,65,12," + (0.05 + heat * 0.18) + ")");
    grd.addColorStop(1, "rgba(15,118,110," + (0.08 + (1 - heat) * 0.1) + ")");
    ctx.fillStyle = grd;
    roundRect(ctx, box.x, box.y, box.w, box.h, 14);
    ctx.fill();

    if (mode === "boyle" || mode === "charles") {
      var pistonX = box.x + box.w;
      ctx.fillStyle = "#334155";
      roundRect(ctx, pistonX - 2, box.y - 6, 14, box.h + 12, 4);
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.fillRect(pistonX + 10, box.y + box.h * 0.42, 40, 12);
      ctx.beginPath();
      ctx.arc(pistonX + 56, box.y + box.h * 0.42 + 6, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Always above the chamber — never beside it (avoids clipping into the right panel)
    drawGauge(box.x + box.w * 0.5, box.y - 54, P);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.fillStyle = "hsla(" + p.hue + ", 70%, 42%, 0.9)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#1a2430";
    ctx.font = "700 12px ui-monospace, SF Mono, Menlo, monospace";
    ctx.fillText("V = " + Vcm3.toFixed(0) + " cm³", box.x + 12, box.y + box.h - 14);
    ctx.fillText("T = " + Tkelvin() + " K", box.x + 12, box.y + 22);
  }

  function modeLabel() {
    if (mode === "pressure") return lang === "zh" ? "壓强定律 · 定容加熱" : "Pressure law · isochoric heat";
    if (mode === "charles") return lang === "zh" ? "查理定律 · 定壓膨脹" : "Charles · isobaric expand";
    return lang === "zh" ? "波義耳 · 定溫壓縮" : "Boyle · isothermal squeeze";
  }

  function drawGauge(cx, cy, P) {
    var r = 32;
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 3;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (var i = 0; i <= 6; i++) {
      var ang = Math.PI * 0.75 + (Math.PI * 1.5 * i) / 6;
      var x1 = cx + Math.cos(ang) * (r - 7);
      var y1 = cy + Math.sin(ang) * (r - 7);
      var x2 = cx + Math.cos(ang) * (r - 2);
      var y2 = cy + Math.sin(ang) * (r - 2);
      ctx.beginPath();
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    var frac = Math.min(1, Math.max(0, P / 300));
    var nang = Math.PI * 0.75 + Math.PI * 1.5 * frac;
    ctx.beginPath();
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 2.5;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(nang) * (r - 10), cy + Math.sin(nang) * (r - 10));
    ctx.stroke();

    // Labels above the dial so they never collide with chamber text
    ctx.fillStyle = "#1a2430";
    ctx.font = "700 10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(lang === "zh" ? "Bourdon" : "Bourdon", cx, cy - r - 16);
    ctx.fillText(P.toFixed(0) + " kPa", cx, cy - r - 4);
    ctx.textAlign = "left";
  }

  function drawGraph() {
    // Graph lives on its own canvas under the controls
    var gx = 10;
    var gy = 18;
    var gw = Math.max(120, gW - 20);
    var gh = Math.max(120, gH - 28);

    gctx.clearRect(0, 0, gW, gH);

    gctx.fillStyle = "rgba(255,253,249,0.98)";
    gctx.strokeStyle = "#cfdce6";
    gctx.lineWidth = 1.5;
    roundRect(gctx, gx, gy, gw, gh, 12);
    gctx.fill();
    gctx.stroke();

    var title = graphTitle();
    gctx.fillStyle = "#1a2430";
    gctx.font = "700 12px " + getComputedStyle(document.body).fontFamily;
    gctx.textAlign = "left";
    gctx.fillText(title, gx + 14, gy + 20);

    gctx.strokeStyle = "#e2e8f0";
    gctx.lineWidth = 1;
    gctx.beginPath();
    gctx.moveTo(gx + 10, gy + 28);
    gctx.lineTo(gx + gw - 10, gy + 28);
    gctx.stroke();

    var padL = 54;
    var padT = 44;
    var padR = 14;
    var padB = 32;
    var plot = { x: gx + padL, y: gy + padT, w: gw - padL - padR, h: gh - padT - padB };

    gctx.strokeStyle = "#94a3b8";
    gctx.lineWidth = 1.5;
    gctx.beginPath();
    gctx.moveTo(plot.x, plot.y);
    gctx.lineTo(plot.x, plot.y + plot.h);
    gctx.lineTo(plot.x + plot.w, plot.y + plot.h);
    gctx.stroke();

    var axes = graphAxes();
    var ySpan = Math.max(1e-6, axes.ymax - axes.ymin);
    var xSpan = Math.max(1e-6, axes.xmax - axes.xmin);

    gctx.fillStyle = "#5a6878";
    gctx.font = "600 11px ui-monospace, monospace";
    gctx.textAlign = "right";
    gctx.fillText(axes.xLabel, plot.x + plot.w, plot.y + plot.h + 20);

    gctx.textAlign = "center";
    gctx.save();
    gctx.translate(gx + 16, plot.y + plot.h * 0.5);
    gctx.rotate(-Math.PI / 2);
    gctx.fillText(axes.yLabel, 0, 0);
    gctx.restore();
    gctx.textAlign = "left";

    gctx.save();
    gctx.beginPath();
    gctx.rect(plot.x + 1, plot.y + 1, plot.w - 2, plot.h - 2);
    gctx.clip();

    gctx.strokeStyle = axes.color;
    gctx.lineWidth = 2;
    gctx.beginPath();
    var first = true;
    for (var i = 0; i <= 40; i++) {
      var t = i / 40;
      var pt = axes.theory(t);
      var px = plot.x + ((pt.x - axes.xmin) / xSpan) * plot.w;
      var py = plot.y + plot.h - ((pt.y - axes.ymin) / ySpan) * plot.h;
      if (first) {
        gctx.moveTo(px, py);
        first = false;
      } else gctx.lineTo(px, py);
    }
    gctx.stroke();

    for (var j = 0; j < trail.length; j++) {
      var trp = trail[j];
      var xy = axes.sample(trp);
      var sx = plot.x + ((xy.x - axes.xmin) / xSpan) * plot.w;
      var sy = plot.y + plot.h - ((xy.y - axes.ymin) / ySpan) * plot.h;
      gctx.beginPath();
      gctx.fillStyle = "rgba(15,118,110," + (0.25 + (j / Math.max(1, trail.length)) * 0.6) + ")";
      gctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      gctx.fill();
    }

    var cur = axes.sample({ V: Vcm3, P: pressureKPa(), T: Tkelvin() });
    var cx = plot.x + ((cur.x - axes.xmin) / xSpan) * plot.w;
    var cy = plot.y + plot.h - ((cur.y - axes.ymin) / ySpan) * plot.h;
    gctx.beginPath();
    gctx.fillStyle = "#c2410c";
    gctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    gctx.fill();
    gctx.restore();

    gctx.fillStyle = "#1a2430";
    gctx.font = "700 11px ui-monospace, monospace";
    var nowX = Math.min(cx + 8, gx + gw - 36);
    var nowY = Math.max(cy - 6, gy + padT + 10);
    gctx.fillText("now", nowX, nowY);
  }

  function graphTitle() {
    if (mode === "pressure") return lang === "zh" ? "P–T 圖像（定容）" : "P–T graph (constant V)";
    if (mode === "charles") return lang === "zh" ? "V–T 圖像（定壓）" : "V–T graph (constant P)";
    return lang === "zh" ? "P–V 圖像（定溫）" : "P–V graph (constant T)";
  }

  function graphAxes() {
    var P0 = ref.P || pressureKPa();
    var V0 = ref.V || Vcm3;
    var T0 = Math.max(1, ref.T || Tkelvin());
    var slopePT = P0 / T0;
    if (mode === "pressure") {
      // Keep the P–T scale fixed while heating. Scaling ymax with the live
      // pressure made the whole line drop after P got large (~140 °C).
      return {
        xmin: 200,
        xmax: 500,
        ymin: 0,
        ymax: Math.max(220, slopePT * 500 * 1.2),
        xLabel: "T / K",
        yLabel: "P / kPa",
        color: "#b45309",
        theory: function (t) {
          var T = 200 + t * 300;
          return { x: T, y: slopePT * T };
        },
        sample: function (s) {
          return { x: s.T, y: s.P };
        }
      };
    }
    if (mode === "charles") {
      return {
        xmin: 0,
        xmax: 500,
        ymin: 0,
        ymax: Math.max(120, (V0 / T0) * 500 * 1.15),
        xLabel: "T / K",
        yLabel: "V / cm³",
        color: "#0d9488",
        theory: function (t) {
          var T = t * 500;
          return { x: T, y: (V0 / T0) * T };
        },
        sample: function (s) {
          return { x: s.T, y: s.V };
        }
      };
    }
    return {
      xmin: 15,
      xmax: 105,
      ymin: 0,
      ymax: Math.max(280, (P0 * V0) / 15 * 1.1),
      xLabel: "V / cm³",
      yLabel: "P / kPa",
      color: "#0369a1",
      theory: function (t) {
        var V = 20 + t * 80;
        return { x: V, y: (P0 * V0) / V };
      },
      sample: function (s) {
        return { x: s.V, y: s.P };
      }
    };
  }

  function roundRect(c, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function onV(v) {
    if (mode === "charles") {
      applyCharlesTk(ref.T * (v / Math.max(1e-6, ref.V)));
    } else {
      Vcm3 = v;
    }
    updateDerived();
    recordTrail();
  }

  function onT(v) {
    if (mode === "charles") {
      applyCharlesTk(v + 273);
    } else {
      Tc = v;
    }
    updateDerived();
    recordTrail();
  }

  function onP(pKPa) {
    pKPa = Math.max(50, Math.min(300, pKPa));
    if (mode === "boyle") {
      // Fixed T: raise P → squeeze V
      Vcm3 = (nMol * R * Tkelvin() * 1000) / pKPa;
      Vcm3 = Math.max(20, Math.min(100, Vcm3));
      document.getElementById("slV").value = String(Math.round(Vcm3));
    } else if (mode === "pressure") {
      // Fixed V: raise P → heat the gas
      var Tk = (pKPa * Vcm3) / (nMol * R * 1000);
      Tc = Math.round(Tk - 273);
      Tc = Math.max(-50, Math.min(200, Tc));
      document.getElementById("slT").value = String(Tc);
    }
    updateDerived();
    recordTrail();
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    stepParticles(dt);
    ctx.clearRect(0, 0, cssW, cssH);
    drawChamber();
    drawGraph();
    requestAnimationFrame(frame);
  }

  function bind() {
    document.getElementById("langEn").addEventListener("click", function () {
      setLang("en");
    });
    document.getElementById("langZh").addEventListener("click", function () {
      setLang("zh");
    });
    var tabs = document.getElementById("modeTabs");
    if (tabs) {
      tabs.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-mode]");
        if (!btn) return;
        setMode(btn.getAttribute("data-mode"));
      });
    }
    document.getElementById("slV").addEventListener("input", function (e) {
      onV(+e.target.value);
    });
    document.getElementById("slT").addEventListener("input", function (e) {
      onT(+e.target.value);
    });
    document.getElementById("slP").addEventListener("input", function (e) {
      onP(+e.target.value);
    });
    window.addEventListener("resize", resize);
  }

  bind();
  resize();
  try {
    var qLang = new URLSearchParams(location.search).get("lang");
    if (qLang) applyLangFromHub(qLang);
    else setLang("en");
  } catch (e) { setLang("en"); }
  setMode(mode);
  updateDerived();
  recordTrail();
  requestAnimationFrame(frame);
})();
