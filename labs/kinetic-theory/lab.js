/* Kinetic Theory Lab — Chrome-friendly (no modules). */
(function () {
  "use strict";

  var R = 8.31;

  var lang = "en";
  var exploreLaw = "boyle"; // boyle | pressure | charles
  var Ncount = 40;
  var Vcm3 = 50;
  var Tc = 27;
  var Mmol = 28;
  var nMol = 0.002;
  var ref = { V: 50, T: 300, P: 100 };

  var particles = [];
  var hitsWindow = [];
  var highlightHits = false;
  var highlightUntil = 0;
  var wallFlashes = [];
  var dragPiston = false;

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");

  var COPY = {
    en: {
      pressureTitle: "Pressure-temperature relationship · kinetic theory",
      pressureSub: "Fixed mass & volume · heat the sealed vessel and watch P rise with Kelvin T.",
      boyleTitle: "Boyle's law · kinetic theory",
      boyleSub: "Fixed mass & temperature · squeeze the syringe and watch P × V stay constant.",
      charlesTitle: "Volume-temperature relation · kinetic theory",
      charlesSub: "Fixed mass & pressure · warm the gas and watch volume expand with Kelvin T.",
      lockT: "T fixed",
      lockV: "V fixed",
      lockP: "P fixed",
      lockM: "m fixed",
      tipPressure: "As volume is constant, gas separation and gas density remains unchanged.",
      tipBoyle: "As temperature remains constant, kinetic energy, speed and momentum of molecules are unchanged.",
      tipCharles: "Higher T → fiercer hits. Volume grows so hits become less frequent, keeping P the same. Density falls.",
      hintPressure: "Change temperature — volume stays locked",
      hintBoyle: "Drag the piston or use the volume slider — temperature stays locked",
      hintCharles: "Change temperature — volume follows so P stays constant"
    },
    zh: {
      pressureTitle: "壓强–溫度關係 · 分子動力論",
      pressureSub: "質量與體積固定 · 加熱密閉容器，看 P 隨開氏溫度上升。",
      boyleTitle: "波義耳定律 · 分子動力論",
      boyleSub: "質量與溫度固定 · 擠壓注射器，看 P × V 保持不變。",
      charlesTitle: "體積–溫度關係 · 分子動力論",
      charlesSub: "質量與壓强固定 · 加熱氣體，看體積隨開氏溫度膨脹。",
      lockT: "T 固定",
      lockV: "V 固定",
      lockP: "P 固定",
      lockM: "m 固定",
      tipPressure: "由於體積保持不變，氣體分子間距及氣體密度均不變。",
      tipBoyle: "由於溫度保持不變，分子的動能、速率及動量均不變。",
      tipCharles: "T 升高撞擊更猛，體積增大令撞擊變疏，以保持 P 不變。密度下降。",
      hintPressure: "調溫度——體積鎖定",
      hintBoyle: "拖動活塞或用體積滑桿——溫度鎖定",
      hintCharles: "調溫度——體積跟隨，令 P 保持不變"
    }
  };

  function tr(key) {
    return COPY[lang][key];
  }

  function Tkelvin() { return Tc + 273; }
  function pressureKPa() {
    return (nMol * R * Tkelvin() * 1000) / Vcm3;
  }
  function vrms() {
    return Math.sqrt((3 * R * Tkelvin()) / (Mmol / 1000));
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
    applyExploreLawUI();
  }

  function chamberBox(W, H, vol) {
    var v = vol == null ? Vcm3 : vol;
    var margin = 36;
    var maxW = W - margin * 2 - 70;
    var maxH = H - margin * 2;
    // Area tracks V closely; both sides shrink so wall hits rise sharply when V drops.
    // V=20 → ~0.34 linear (~0.12 area); V=50 → ~0.66; V=100 → 1.0
    var lin = Math.pow(Math.max(0.18, v / 100), 0.62);
    lin = Math.max(0.34, Math.min(1, lin));
    var fullH = maxH * 0.92;
    var fullW = Math.min(maxW, fullH / 0.72);
    var boxH = fullH * lin;
    var boxW = fullW * lin;
    var x = margin;
    var y = (H - boxH) / 2;
    return { x: x, y: y, w: boxW, h: boxH, pistonX: x + boxW };
  }

  function speedScale(tK) {
    return 0.55 + 3.8 * (Math.max(tK || Tkelvin(), 1) / 473);
  }

  function makeParticle(box, tK) {
    var s = speedScale(tK);
    var ang = Math.random() * Math.PI * 2;
    var kin = 0.55 + Math.random() * 0.9;
    var mag = s * kin;
    return {
      x: box.x + 10 + Math.random() * (box.w - 20),
      y: box.y + 10 + Math.random() * (box.h - 20),
      vx: Math.cos(ang) * mag,
      vy: Math.sin(ang) * mag,
      r: 3.1 + Math.random() * 1.5,
      hue: 168 + Math.random() * 36,
      kin: kin
    };
  }

  function cssSize(c, fw, fh) {
    return {
      w: c.clientWidth || fw || 900,
      h: c.clientHeight || fh || 560
    };
  }

  function syncParticles() {
    var sz = cssSize(canvas, 900, 560);
    var box = chamberBox(sz.w, sz.h, Vcm3);
    var target = Ncount;
    while (particles.length < target) particles.push(makeParticle(box, Tkelvin()));
    while (particles.length > target) particles.pop();
    var s = speedScale();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var sp = Math.hypot(p.vx, p.vy) || 1;
      var targetSp = s * (p.kin || 1);
      p.vx = (p.vx / sp) * targetSp;
      p.vy = (p.vy / sp) * targetSp;
      p.x = Math.min(box.x + box.w - p.r, Math.max(box.x + p.r, p.x));
      p.y = Math.min(box.y + box.h - p.r, Math.max(box.y + p.r, p.y));
    }
  }

  function applyCharlesFromT() {
    Vcm3 = ref.V * (Tkelvin() / Math.max(1, ref.T));
    Vcm3 = Math.max(20, Math.min(100, Vcm3));
    document.getElementById("slV").value = String(Math.round(Vcm3));
  }

  function applyExploreLawUI() {
    var title = document.getElementById("exploreTitle");
    var sub = document.getElementById("exploreSub");
    var tip = document.getElementById("exploreTip");
    var hint = document.getElementById("stageHint");
    var badges = document.getElementById("lockBadges");

    title.innerHTML = '<span class="en">' + COPY.en[exploreLaw + "Title"] + '</span><span class="zh">' + COPY.zh[exploreLaw + "Title"] + "</span>";
    sub.innerHTML = '<span class="en">' + COPY.en[exploreLaw + "Sub"] + '</span><span class="zh">' + COPY.zh[exploreLaw + "Sub"] + "</span>";
    tip.textContent = tr(
      exploreLaw === "pressure" ? "tipPressure" : exploreLaw === "boyle" ? "tipBoyle" : "tipCharles"
    );
    hint.innerHTML = '<span class="en">' + COPY.en[
      exploreLaw === "pressure" ? "hintPressure" : exploreLaw === "boyle" ? "hintBoyle" : "hintCharles"
    ] + '</span><span class="zh">' + COPY.zh[
      exploreLaw === "pressure" ? "hintPressure" : exploreLaw === "boyle" ? "hintBoyle" : "hintCharles"
    ] + "</span>";

    var locks = [];
    locks.push('<span class="lock on">' + tr("lockM") + "</span>");
    if (exploreLaw === "pressure") {
      locks.push('<span class="lock on">' + tr("lockV") + "</span>");
    } else if (exploreLaw === "boyle") {
      locks.push('<span class="lock on">' + tr("lockT") + "</span>");
    } else {
      locks.push('<span class="lock on">' + tr("lockP") + "</span>");
    }
    badges.innerHTML = locks.join("");

    document.getElementById("wrapV").hidden = exploreLaw !== "boyle";
    document.getElementById("wrapT").hidden = exploreLaw === "boyle";

    var tabs = document.querySelectorAll(".subtabs button");
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-law") === exploreLaw;
      tabs[i].classList.toggle("on", on);
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
    }

    updateReadouts();
  }

  function setExploreLaw(mode) {
    exploreLaw = mode;
    Ncount = 40;
    Vcm3 = 50;
    Tc = 27;
    Mmol = 28;
    document.getElementById("slN").value = "40";
    document.getElementById("slV").value = "50";
    document.getElementById("slT").value = "27";
    ref = { V: 50, T: 300, P: pressureKPa() };
    particles = [];
    syncParticles();
    applyExploreLawUI();
  }

  function gasSeparation() {
    // Relative mean molecule spacing vs reference (V=50 cm³, N=40).
    // Spacing ∝ (V/N)^(1/3); smaller V or larger N → closer molecules.
    var ref = Math.pow(50 / 40, 1 / 3);
    var now = Math.pow(Vcm3 / Math.max(1, Ncount), 1 / 3);
    return now / ref;
  }

  function updateReadouts() {
    var P = pressureKPa();
    document.getElementById("valN").textContent = String(Ncount);
    document.getElementById("valV").textContent = Vcm3.toFixed(0) + " cm³";
    document.getElementById("valT").textContent = Tc + " °C · " + Tkelvin() + " K";
    document.getElementById("outVrms").textContent = Math.round(vrms()) + " m/s";
    document.getElementById("outSep").textContent = gasSeparation().toFixed(2) + "×";
    if (exploreLaw === "charles") {
      document.getElementById("outHotLabel").textContent = "V";
      document.getElementById("outHot").textContent = Vcm3.toFixed(1) + " cm³";
      document.getElementById("outSecLabel").textContent = "P";
      document.getElementById("outSec").textContent = P.toFixed(1) + " kPa";
    } else if (exploreLaw === "boyle") {
      document.getElementById("outHotLabel").textContent = "P";
      document.getElementById("outHot").textContent = P.toFixed(1) + " kPa";
      document.getElementById("outSecLabel").textContent = "T";
      document.getElementById("outSec").textContent = Tkelvin() + " K";
    } else {
      document.getElementById("outHotLabel").textContent = "P";
      document.getElementById("outHot").textContent = P.toFixed(1) + " kPa";
      document.getElementById("outSecLabel").textContent = "V";
      document.getElementById("outSec").textContent = Vcm3.toFixed(1) + " cm³";
    }
  }

  function recordHit() {
    var now = performance.now();
    hitsWindow.push(now);
    while (hitsWindow.length && now - hitsWindow[0] > 1000) hitsWindow.shift();
  }

  // Wall-collision rate ∝ N × speed / size; size shrinks with V → strong 1/V feel for Boyle.
  function collisionFrequency() {
    var measured = hitsWindow.length;
    var sizeBoost = Math.pow(50 / Math.max(18, Vcm3), 1.35);
    return Math.round(measured * sizeBoost);
  }

  function stepParticles(list, box, dt, onHit) {
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      if (p.x - p.r < box.x) {
        p.x = box.x + p.r; p.vx = Math.abs(p.vx);
        if (onHit) onHit(p, "L");
      }
      if (p.x + p.r > box.x + box.w) {
        p.x = box.x + box.w - p.r; p.vx = -Math.abs(p.vx);
        if (onHit) onHit(p, "R");
      }
      if (p.y - p.r < box.y) {
        p.y = box.y + p.r; p.vy = Math.abs(p.vy);
        if (onHit) onHit(p, "T");
      }
      if (p.y + p.r > box.y + box.h) {
        p.y = box.y + box.h - p.r; p.vy = -Math.abs(p.vy);
        if (onHit) onHit(p, "B");
      }
    }
  }

  function drawChamber(c, cx, W, H, box, list, opts) {
    opts = opts || {};
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = "rgba(255,253,249,0.35)";
    cx.fillRect(0, 0, W, H);

    cx.fillStyle = "#d7e6ec";
    cx.strokeStyle = "#5b7280";
    cx.lineWidth = 3;
    roundRect(cx, box.x - 4, box.y - 4, box.w + 8, box.h + 8, 10);
    cx.fill();
    cx.stroke();

    var dens = Math.min(1, (opts.N || list.length) / 70 * (50 / Math.max(20, opts.V || 50)));
    cx.fillStyle = "rgba(15, 118, 110, " + (0.06 + dens * 0.18) + ")";
    cx.fillRect(box.x, box.y, box.w, box.h);

    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      cx.beginPath();
      cx.fillStyle = "hsl(" + p.hue + " 70% 42%)";
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fill();
      if (opts.trails) {
        cx.strokeStyle = "hsla(" + p.hue + " 70% 42% / 0.25)";
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
        cx.stroke();
      }
    }

    if (opts.flashes) {
      for (var f = opts.flashes.length - 1; f >= 0; f--) {
        var fl = opts.flashes[f];
        fl.life -= 0.04;
        if (fl.life <= 0) { opts.flashes.splice(f, 1); continue; }
        cx.beginPath();
        cx.strokeStyle = "rgba(194, 65, 12, " + fl.life + ")";
        cx.lineWidth = 2;
        cx.arc(fl.x, fl.y, 6 + (1 - fl.life) * 14, 0, Math.PI * 2);
        cx.stroke();
      }
    }

    var px = box.x + box.w;
    cx.fillStyle = "#94a3b8";
    cx.fillRect(px, box.y - 6, 14, box.h + 12);
    cx.fillStyle = "#64748b";
    cx.fillRect(px + 14, box.y + box.h * 0.35, 48, box.h * 0.3);
    cx.fillStyle = "#1a2430";
    cx.font = "700 12px sans-serif";
    cx.fillText("V", px + 30, box.y + box.h * 0.52);

    cx.fillStyle = "#5a6878";
    cx.font = "700 11px sans-serif";
    cx.fillText("θ → speed", box.x, box.y - 12);
    if (opts.label) {
      cx.fillStyle = "#1a2430";
      cx.font = "800 13px sans-serif";
      cx.fillText(opts.label, box.x, H - 16);
    }

    cx.beginPath();
    cx.fillStyle = "#c2410c";
    var heat = Math.min(1, ((opts.T || 300) - 223) / 350);
    cx.globalAlpha = 0.25 + heat * 0.55;
    cx.arc(box.x + box.w * 0.5, box.y + box.h + 22, 8 + heat * 6, 0, Math.PI * 2);
    cx.fill();
    cx.globalAlpha = 1;
    cx.fillStyle = "#5a6878";
    cx.font = "600 10px sans-serif";
    cx.fillText("vibrator / heat", box.x + box.w * 0.5 - 36, box.y + box.h + 40);
  }

  function roundRect(cx, x, y, w, h, r) {
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.arcTo(x + w, y, x + w, y + h, r);
    cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r);
    cx.arcTo(x, y, x + w, y, r);
    cx.closePath();
  }

  function fitCanvas(c, cssFallbackW, cssFallbackH) {
    var parent = c.parentElement;
    var rect = parent.getBoundingClientRect();
    var w = Math.max(280, Math.floor(rect.width));
    var h = Math.max(200, Math.floor(rect.height || cssFallbackH));
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }

  function resizeAll() {
    fitCanvas(canvas, 900, 560);
    syncParticles();
  }

  var lastTs = 0;
  function frame(ts) {
    var dt = Math.min(0.033, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;

    var box = chamberBox(canvas.clientWidth || 900, canvas.clientHeight || 560, Vcm3);
    stepParticles(particles, box, dt, function (p) {
      recordHit();
      if (highlightHits || performance.now() < highlightUntil) {
        wallFlashes.push({ x: p.x, y: p.y, life: 1 });
      }
    });

    if (!document.getElementById("panelExplore").hasAttribute("hidden")) {
      drawChamber(canvas, ctx, canvas.clientWidth, canvas.clientHeight, box, particles, {
        N: Ncount, V: Vcm3, T: Tkelvin(), flashes: wallFlashes, trails: true,
        label: exploreLaw === "charles"
          ? ("V ≈ " + Vcm3.toFixed(0) + " cm³")
          : ("P ≈ " + pressureKPa().toFixed(0) + " kPa")
      });
      document.getElementById("outHits").textContent = collisionFrequency() + " / s";
    }

    requestAnimationFrame(frame);
  }

  document.getElementById("langEn").addEventListener("click", function () { setLang("en"); });
  document.getElementById("langZh").addEventListener("click", function () { setLang("zh"); });

  document.querySelectorAll(".subtabs button").forEach(function (btn) {
    btn.addEventListener("click", function () { setExploreLaw(btn.getAttribute("data-law")); });
  });

  document.getElementById("slN").addEventListener("input", function (e) {
    Ncount = +e.target.value; syncParticles(); updateReadouts();
  });
  document.getElementById("slV").addEventListener("input", function (e) {
    if (exploreLaw !== "boyle") return;
    Vcm3 = +e.target.value;
    syncParticles(); updateReadouts();
  });
  document.getElementById("slT").addEventListener("input", function (e) {
    if (exploreLaw === "boyle") return;
    Tc = +e.target.value;
    if (exploreLaw === "charles") applyCharlesFromT();
    syncParticles(); updateReadouts();
  });

  document.getElementById("btnReset").addEventListener("click", function () {
    setExploreLaw(exploreLaw);
  });

  document.getElementById("btnPulse").addEventListener("click", function () {
    highlightHits = !highlightHits;
    highlightUntil = performance.now() + 4000;
    this.classList.toggle("teal", highlightHits);
  });

  canvas.addEventListener("pointerdown", function (e) {
    if (exploreLaw !== "boyle") return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var box = chamberBox(rect.width, rect.height, Vcm3);
    if (x > box.pistonX - 10 && x < box.pistonX + 60) {
      dragPiston = true;
      canvas.setPointerCapture(e.pointerId);
    }
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragPiston || exploreLaw !== "boyle") return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var margin = 36;
    var maxW = rect.width - margin * 2 - 70;
    var frac = (x - margin) / maxW;
    Vcm3 = Math.round(Math.max(20, Math.min(100, 20 + frac * 80)));
    document.getElementById("slV").value = String(Vcm3);
    syncParticles();
    updateReadouts();
  });
  canvas.addEventListener("pointerup", function () { dragPiston = false; });

  window.addEventListener("resize", resizeAll);

  try {
    var qLang = new URLSearchParams(location.search).get("lang");
    if (qLang) applyLangFromHub(qLang);
    else setLang("en");
  } catch (e) { setLang("en"); }
  setExploreLaw("boyle");
  resizeAll();
  requestAnimationFrame(frame);
})();
