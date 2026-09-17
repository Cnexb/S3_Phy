/* Aircraft Turn Lab — Chrome-friendly (no modules). Open index.html in Google Chrome. */
(function () {
  "use strict";

  var G = 10;
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  var cssW = 1280;
  var cssH = 780;
  var lang = "en";
  var running = true;
  var slow = false;
  var showForces = true;
  var showComp = true;
  var t = 0;
  var spinPhi = 0;
  var lastTs = 0;
  var lastW = 0;
  var lastH = 0;
  var lastDpr = 0;
  var toastTimer = 0;
  var planeHeading = 0;
  var planeHeadingReady = false;
  var visualDt = 0;
  var planeImg = new Image();
  planeImg.src = "plane.png";

  var S = {
    av: 250,
    ar: 20000,
    am: 2000
  };

  var COPY = {
    en: {
      play: "Pause",
      pause: "Play",
      slowOn: "Normal speed",
      slowOff: "Slow motion",
      toastReset: "Lab reset",
      airTitle: "Aircraft making a turn",
      airSub: "Lift is perpendicular to the wings. Bank the plane so lift gains a sideways part, and the plane can turn.",
      weight: "weight",
      net: "net inward"
    },
    zh: {
      play: "暫停",
      pause: "播放",
      slowOn: "正常速度",
      slowOff: "慢動作",
      toastReset: "實驗已重設",
      airTitle: "飛機轉彎",
      airSub: "升力垂直於機翼。把飛機傾側，升力才有橫向分量，飛機才能轉彎。",
      weight: "重量",
      net: "淨向內"
    }
  };

  function tr(key) {
    return COPY[lang][key];
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function fmt(n, d) {
    if (!isFinite(n)) return "—";
    return Number(n).toFixed(d);
  }
  function visOmega(omega) {
    var realT = (2 * Math.PI) / Math.max(omega, 0.08);
    var Tvis = clamp(6.2 + realT / 140, 5, 12);
    return (2 * Math.PI) / Tvis;
  }
  function ghostPhis(omega) {
    var vis = visOmega(omega);
    var pace = clamp(vis / 8, 0.1, 1.4);
    var n = Math.round(2 + 14 * pace);
    var gap = 0.05 + 0.22 * pace;
    var out = [];
    var i;
    for (i = n; i >= 1; i--) out.push(spinPhi - i * gap);
    return out;
  }
  function drawVArrow(x, y, tx, ty, v, vRef) {
    var mag = Math.hypot(tx, ty) || 1;
    var len = 16 + 62 * clamp(v / Math.max(vRef, 0.05), 0.1, 1.5);
    drawArrow(x, y, x + (tx / mag) * len, y + (ty / mag) * len, "#e11d48", 3.5);
    labelAt(x + (tx / mag) * len, y + (ty / mag) * len - 12, "v", "#e11d48");
  }
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function physics() {
    var o = {};
    o.v = S.av;
    o.r = S.ar;
    o.m = S.am;
    o.th = Math.atan((S.av * S.av) / (S.ar * G));
    o.U = (S.am * G) / Math.cos(o.th);
    o.omega = S.av / S.ar;
    o.period = (2 * Math.PI) / o.omega;
    o.Fc = S.am * S.av * S.av / S.ar;
    o.acc = S.av * S.av / S.ar;
    return o;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth || 1280;
    var h = canvas.clientHeight || 780;
    if (w === lastW && h === lastH && dpr === lastDpr) return;
    lastW = w;
    lastH = h;
    lastDpr = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cssW = w;
    cssH = h;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
  }

  function drawArrow(x1, y1, x2, y2, color, w) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    if (len < 6) return;
    var ux = dx / len;
    var uy = dy / len;
    var hw = w || 2.6;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = hw;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - ux * 11, y2 - uy * 11);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * 13 - uy * 6.5, y2 - uy * 13 + ux * 6.5);
    ctx.lineTo(x2 - ux * 13 + uy * 6.5, y2 - uy * 13 - ux * 6.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function labelAt(x, y, text, color) {
    ctx.save();
    ctx.font = "700 14px " + getComputedStyle(document.body).fontFamily;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var pad = 6;
    var tw = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(255,253,249,0.88)";
    roundRect(x - tw / 2 - pad, y - 10, tw + pad * 2, 20, 7);
    ctx.fill();
    ctx.fillStyle = color || "#1a2430";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function badge(x, y, text, bg, fg) {
    ctx.save();
    ctx.font = "800 15px " + getComputedStyle(document.body).fontFamily;
    var tw = ctx.measureText(text).width;
    ctx.fillStyle = bg;
    roundRect(x, y, tw + 22, 28, 14);
    ctx.fill();
    ctx.fillStyle = fg || "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 11, y + 15);
    ctx.restore();
  }

  function paintJetSide() {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "#111";
    ctx.fillStyle = "#c8c8c8";

    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.lineTo(-22, -30);
    ctx.quadraticCurveTo(-26, -36, -18, -34);
    ctx.lineTo(10, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-50, 2);
    ctx.quadraticCurveTo(-54, -2, -50, -10);
    ctx.quadraticCurveTo(-44, -14, -36, -13);
    ctx.lineTo(36, -12);
    ctx.quadraticCurveTo(50, -10, 52, -2);
    ctx.quadraticCurveTo(52, 8, 40, 12);
    ctx.lineTo(-36, 13);
    ctx.quadraticCurveTo(-50, 12, -52, 4);
    ctx.quadraticCurveTo(-54, 2, -50, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, 4);
    ctx.lineTo(18, 32);
    ctx.quadraticCurveTo(24, 38, 28, 30);
    ctx.lineTo(14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e11d24";
    ctx.beginPath();
    ctx.moveTo(36, -12);
    ctx.lineTo(38, -36);
    ctx.quadraticCurveTo(42, -40, 46, -36);
    ctx.lineTo(46, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(44, -2);
    ctx.lineTo(62, -2);
    ctx.quadraticCurveTo(66, 0, 62, 3);
    ctx.lineTo(44, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-42, -7);
    ctx.lineTo(-26, -7);
    ctx.quadraticCurveTo(-22, -7, -22, -3);
    ctx.lineTo(-22, 1);
    ctx.quadraticCurveTo(-22, 3, -26, 3);
    ctx.lineTo(-42, 3);
    ctx.quadraticCurveTo(-46, 3, -46, -1);
    ctx.quadraticCurveTo(-46, -7, -42, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    var wi;
    for (wi = 0; wi < 4; wi++) {
      ctx.beginPath();
      ctx.arc(-12 + wi * 11, -1, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function stepPlaneHeading(vx, vy, dt) {
    var target = Math.atan2(vy, vx);
    if (!planeHeadingReady) {
      planeHeading = target;
      planeHeadingReady = true;
      return;
    }
    if (dt <= 0) return;
    var d = target - planeHeading;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    var maxStep = 2.5 * dt;
    if (d > maxStep) d = maxStep;
    if (d < -maxStep) d = -maxStep;
    planeHeading += d;
  }

  function drawJetPath(x, y, vx, vy, scale, headingOpt, bank) {
    var s = scale || 1;
    var heading = headingOpt != null ? headingOpt : Math.atan2(vy, vx);
    var yaw = -Math.cos(heading);
    var pitch = Math.sin(2 * heading) * 0.22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(pitch - (bank || 0));
    ctx.scale(yaw * s, s);
    if (planeImg.complete && planeImg.naturalWidth) {
      var w = 108;
      var h = w * (planeImg.naturalHeight / planeImg.naturalWidth);
      ctx.drawImage(planeImg, -w / 2, -h / 2, w, h);
    } else {
      paintJetSide();
    }
    ctx.restore();
  }

  function drawJetBank(x, y, bank, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-bank);
    ctx.scale(scale, scale);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#111";
    ctx.fillStyle = "#c8c8c8";

    ctx.beginPath();
    ctx.moveTo(-18, -5);
    ctx.lineTo(-32, -3);
    ctx.quadraticCurveTo(-34, -2, -32, 0);
    ctx.lineTo(-8, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18, -5);
    ctx.lineTo(32, -3);
    ctx.quadraticCurveTo(34, -2, 32, 0);
    ctx.lineTo(8, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e11d24";
    ctx.beginPath();
    ctx.moveTo(-3.5, -8);
    ctx.lineTo(-1.5, -36);
    ctx.quadraticCurveTo(0, -42, 3.5, -36);
    ctx.lineTo(3.5, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#c8c8c8";
    ctx.beginPath();
    ctx.moveTo(-12, 3);
    ctx.lineTo(-72, 10);
    ctx.quadraticCurveTo(-80, 11, -78, 5);
    ctx.lineTo(-14, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, 3);
    ctx.lineTo(72, 10);
    ctx.quadraticCurveTo(80, 11, 78, 5);
    ctx.lineTo(14, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 3, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(0, -2, 12, 6.5, 0, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.lineTo(-2, -5);
    ctx.lineTo(2, -5);
    ctx.lineTo(7, -1);
    ctx.stroke();

    ctx.restore();
  }

  function drawAircraft(o) {
    var W = cssW;
    var H = cssH;
    var grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, "#7dd3fc");
    grd.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    var diagramLeft = W * 0.64;
    var rSpan = clamp((o.r - 4000) / 26000, 0, 1);
    var pathY = H * 0.58;
    var pcx = W * 0.32;
    var prx = Math.min(W * (0.16 + 0.24 * rSpan), Math.max(90, diagramLeft - pcx - 28));
    var pry = Math.min(H * (0.12 + 0.18 * rSpan), prx * 0.55);
    ctx.strokeStyle = "rgba(15,23,42,0.25)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.ellipse(pcx, pathY, prx, pry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 2.4;
    ctx.setLineDash([12, 10]);
    ctx.stroke();
    ctx.setLineDash([]);

    var phi = spinPhi;
    var agh = ghostPhis(o.omega);
    var ai;
    for (ai = 0; ai < agh.length; ai++) {
      var ap = agh[ai];
      ctx.globalAlpha = 0.05 + 0.18 * (ai / agh.length);
      drawJetPath(pcx + prx * Math.cos(ap), pathY + pry * Math.sin(ap), -prx * Math.sin(ap), pry * Math.cos(ap), 0.72, null, o.th);
    }
    ctx.globalAlpha = 1;
    var px = pcx + prx * Math.cos(phi);
    var py = pathY + pry * Math.sin(phi);
    var pvx = -prx * Math.sin(phi);
    var pvy = pry * Math.cos(phi);
    stepPlaneHeading(pvx, pvy, visualDt);
    drawJetPath(px, py, pvx, pvy, 0.92, planeHeading, o.th);
    labelAt(px, py - 44, "θ = " + fmt((o.th * 180) / Math.PI, 1) + "°", "#c2410c");
    drawVArrow(px, py, pvx, pvy, o.v, 260);
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      (lang === "zh" ? "水平圓周航徑  r = " : "horizontal circular path  r = ") + fmt(o.r / 1000, 0) + " km",
      pcx,
      pathY + pry + 28
    );

    var ax = Math.min(W * 0.80, W - 200);
    var ay = Math.max(H * 0.34, 220);
    drawJetBank(ax, ay, o.th, 2.05);

    var liftLen = 150;
    var weightLen = 118;
    var ux = -Math.sin(o.th);
    var uy = -Math.cos(o.th);
    var lx = ax + ux * liftLen;
    var ly = ay + uy * liftLen;
    var hLen = Math.max(88, liftLen * Math.sin(o.th));

    ctx.save();
    ctx.strokeStyle = "rgba(15,23,42,0.28)";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax, ay - liftLen - 10);
    ctx.stroke();
    ctx.restore();

    if (showForces) {
      drawArrow(ax, ay, lx, ly, "#0f766e", 3.6);
      labelAt(lx + ux * 28, ly + uy * 28, "N", "#0f766e");
      drawArrow(ax, ay, ax, ay + weightLen, "#334155", 3.6);
      labelAt(ax + 32, ay + weightLen + 4, "W", "#334155");
      if (showComp) {
        drawArrow(ax, ay, ax - hLen, ay, "#6d28d9", 3);
        labelAt(ax - hLen - 16, ay - 18, "Fc", "#6d28d9");
      }
    }

    var rArc = 82;
    ctx.beginPath();
    ctx.arc(ax, ay, rArc, -Math.PI / 2, -Math.PI / 2 - o.th, true);
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 2.8;
    ctx.stroke();
    labelAt(ax + 88, ay - rArc - 6, "θ = " + fmt((o.th * 180) / Math.PI, 1) + "°", "#c2410c");
    badge(16, 16, lang === "zh" ? "升力垂直於機翼" : "Lift is perpendicular to the wings", "#1d4ed8", "#fff");
  }

  function draw() {
    resize();
    ctx.clearRect(0, 0, cssW, cssH);
    drawAircraft(physics());
    if (!running) {
      ctx.fillStyle = "rgba(15,23,42,0.08)";
      ctx.fillRect(0, 0, cssW, cssH);
    }
  }

  function updateUI() {
    var o = physics();
    document.getElementById("stTitle").textContent = tr("airTitle");
    document.getElementById("stSub").textContent = tr("airSub");
    document.getElementById("btnPlay").textContent = running ? tr("play") : tr("pause");
    document.getElementById("btnSlow").textContent = slow ? tr("slowOn") : tr("slowOff");
    document.getElementById("btnSlow").classList.toggle("on", slow);
    document.getElementById("valAV").textContent = Math.round(S.av) + " m/s";
    document.getElementById("valAR").textContent = fmt(S.ar / 1000, 0) + " km";
    document.getElementById("valAM").textContent = Math.round(S.am) + " kg";

    var box = document.getElementById("readouts");
    box.innerHTML = "";
    function add(label, value, cls) {
      var d = document.createElement("div");
      d.className = "stat" + (cls ? " " + cls : "");
      d.innerHTML = "<span>" + label + "</span><b>" + value + "</b>";
      box.appendChild(d);
    }
    add(lang === "zh" ? "升力" : "lifting force", fmt(o.U / 1000, 1) + " kN");
    add(lang === "zh" ? "向心加速度" : "acceleration inward", fmt(o.acc, 2) + " m/s²");

    document.getElementById("legend").innerHTML =
      "<span><i style='background:#0f766e'></i>N</span>" +
      "<span><i style='background:#334155'></i>W</span>" +
      "<span><i style='background:#6d28d9'></i>Fc</span>" +
      "<span><i style='background:#e11d48'></i>v</span>";
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
    updateUI();
  }

  function reset() {
    S.av = 250;
    S.ar = 20000;
    S.am = 2000;
    t = 0;
    spinPhi = 0;
    planeHeadingReady = false;
    document.getElementById("slAV").value = 250;
    document.getElementById("slAR").value = 20;
    document.getElementById("slAM").value = 2000;
    toast(tr("toastReset"));
    updateUI();
  }

  document.getElementById("langEn").addEventListener("click", function () { setLang("en"); });
  document.getElementById("langZh").addEventListener("click", function () { setLang("zh"); });
  document.getElementById("btnPlay").addEventListener("click", function () {
    running = !running;
    updateUI();
  });
  document.getElementById("btnSlow").addEventListener("click", function () {
    slow = !slow;
    updateUI();
  });
  document.getElementById("btnReset").addEventListener("click", reset);
  document.getElementById("chipForces").addEventListener("click", function () {
    showForces = !showForces;
    this.classList.toggle("on", showForces);
  });

  function bindSlider(id, apply) {
    document.getElementById(id).addEventListener("input", function () {
      apply.call(this);
      updateUI();
    });
  }
  bindSlider("slAV", function () { S.av = +this.value; });
  bindSlider("slAR", function () { S.ar = this.value * 1000; });
  bindSlider("slAM", function () { S.am = +this.value; });

  window.addEventListener("keydown", function (e) {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      running = !running;
      updateUI();
    }
  });
  window.addEventListener("resize", function () { resize(); draw(); });

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    var step = dt * (slow ? 0.28 : 1);
    visualDt = running ? step : 0;
    if (running) {
      var pace = visOmega(physics().omega || 1);
      t += step;
      spinPhi += pace * step;
    }
    draw();
    requestAnimationFrame(loop);
  }

  try {
    var qLang = new URLSearchParams(location.search).get("lang");
    if (qLang) applyLangFromHub(qLang);
    else setLang("en");
  } catch (e) { setLang("en"); }
  resize();
  requestAnimationFrame(loop);
})();
