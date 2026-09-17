/* Energy in Mechanics — skate-park
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
      title: "Skate park — conservation of energy",
      sub: "Click the track to place the cart. Smooth park: KE + GPE stays constant.",
      play: "Play",
      pause: "Pause"
    },
    zh: {
      title: "滑板公園 — 能量守恆",
      sub: "點擊軌道放置小車。光滑時：KE + GPE 保持不變。",
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


  /* ---------- skate park ---------- */
  var park = {
    mode: "single",
    trackName: "roller",
    m: 2,
    mu: 0,
    paths: [],
    carts: [],
    scaleMaxE: 1
  };

  function catmull(pts, steps) {
    var out = [];
    var n = pts.length;
    for (var i = 0; i < n - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(n - 1, i + 2)];
      for (var s = 0; s < steps; s++) {
        var t = s / steps;
        var t2 = t * t;
        var t3 = t2 * t;
        out.push({
          x:
            0.5 *
            (2 * p1[0] +
              (-p0[0] + p2[0]) * t +
              (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
              (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          y:
            0.5 *
            (2 * p1[1] +
              (-p0[1] + p2[1]) * t +
              (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
              (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        });
      }
    }
    out.push({ x: pts[n - 1][0], y: pts[n - 1][1] });
    return out;
  }

  function buildPath(pts) {
    var s = [0];
    var i;
    for (i = 1; i < pts.length; i++) {
      s.push(s[i - 1] + hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }
    return { pts: pts, s: s, total: s[s.length - 1] };
  }

  function samplePath(path, dist) {
    dist = clamp(dist, 0, path.total);
    var lo = 0;
    var hi = path.s.length - 1;
    while (lo < hi - 1) {
      var mid = (lo + hi) >> 1;
      if (path.s[mid] < dist) lo = mid;
      else hi = mid;
    }
    var ds = path.s[hi] - path.s[lo] || 1e-6;
    var t = (dist - path.s[lo]) / ds;
    var a = path.pts[lo];
    var b = path.pts[hi];
    var x = lerp(a.x, b.x, t);
    var y = lerp(a.y, b.y, t);
    var tx = b.x - a.x;
    var ty = b.y - a.y;
    var len = hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    return { x: x, y: y, tx: tx, ty: ty };
  }

  function makeRoller() {
    return buildPath(
      catmull(
        [
          [0.3, 5.75],
          [1.1, 5.55],
          [4.6, 1.15],
          [7.6, 3.35],
          [10.8, 0.75],
          [14.2, 2.35],
          [16.8, 2.35]
        ],
        18
      )
    );
  }

  function makeValley() {
    /* Extra points on the drop keep Catmull-Rom from overshooting
       upward at the lip — that bump made the cart roll left into s = 0. */
    return buildPath(
      catmull(
        [
          [0.3, 5.4],
          [0.75, 5.1],
          [1.6, 3.6],
          [3.2, 1.2],
          [5.2, 0.6],
          [8.4, 0.5],
          [11.5, 0.75],
          [14.6, 4.2],
          [16.8, 5.0]
        ],
        18
      )
    );
  }

  function makeRaceA() {
    /* Extra points on the drop keep Catmull-Rom from overshooting
       upward at the lip — that bump made cart A roll left into s = 0. */
    return buildPath(
      catmull(
        [
          [0.4, 5.25],
          [0.7, 4.95],
          [1.3, 3.6],
          [2.2, 1.6],
          [3.5, 0.9],
          [8.0, 0.85],
          [16.4, 0.85]
        ],
        16
      )
    );
  }

  function makeRaceB() {
    return buildPath(
      catmull(
        [
          [0.4, 5.25],
          [5.5, 4.0],
          [10.5, 2.4],
          [16.4, 0.85]
        ],
        16
      )
    );
  }

  function newCart(path, s0, color) {
    var p = samplePath(path, s0);
    return {
      path: path,
      s: s0,
      v: 0,
      thermal: 0,
      E0: park.m * G * p.y,
      color: color,
      finished: false,
      trail: []
    };
  }

  function parkRebuild() {
    if (park.mode === "race") {
      park.paths = [makeRaceA(), makeRaceB()];
      /* Same arc length from matching start heights → identical initial GPE. */
      park.carts = [
        newCart(park.paths[0], 0, "sky"),
        newCart(park.paths[1], 0, "green")
      ];
    } else {
      var path = park.trackName === "valley" ? makeValley() : makeRoller();
      park.paths = [path];
      park.carts = [newCart(path, 0.45, "sky")];
    }
    parkRecalcE0();
  }

  function parkRecalcE0() {
    var i;
    var maxE = 1;
    for (i = 0; i < park.carts.length; i++) {
      var c = park.carts[i];
      var p = samplePath(c.path, c.s);
      c.E0 = park.m * G * p.y + 0.5 * park.m * c.v * c.v + c.thermal;
      maxE = Math.max(maxE, c.E0);
    }
    park.scaleMaxE = maxE;
  }

  function parkEnergies(c) {
    var p = samplePath(c.path, c.s);
    var ke = 0.5 * park.m * c.v * c.v;
    var pe = park.m * G * p.y;
    return { p: p, ke: ke, pe: pe, th: c.thermal, tot: ke + pe + c.thermal };
  }

  function parkStepCart(c, dt) {
    if (c.finished) return;
    var p = samplePath(c.path, c.s);
    var a = -G * p.ty;
    var N = park.m * G * Math.abs(p.tx);
    if (park.mu > 0 && Math.abs(c.v) > 0.02) {
      a -= (park.mu * N * Math.sign(c.v)) / park.m;
    } else if (park.mu > 0 && Math.abs(c.v) <= 0.02) {
      var gTang = park.m * G * p.ty;
      if (Math.abs(gTang) < park.mu * N) {
        c.v = 0;
        return;
      }
    }
    var v0 = c.v;
    c.v += a * dt;
    var ds = c.v * dt;
    c.s += ds;
    if (park.mu > 0) {
      c.thermal += park.mu * N * Math.abs(ds);
    }
    if (c.s <= 0) {
      c.s = 0;
      if (c.v < 0) c.v = 0;
    }
    if (c.s >= c.path.total) {
      c.s = c.path.total;
      c.v = 0;
      c.finished = true;
    }
    /* keep energy honest vs numerical drift */
    if (park.mu < 1e-6) {
      var p2 = samplePath(c.path, c.s);
      var pe = park.m * G * p2.y;
      var keWant = c.E0 - pe;
      if (keWant < 0) {
        c.s -= ds;
        c.v = -v0 * 0.15;
        if (Math.abs(c.v) < 0.15) c.v = 0;
      } else {
        var dir = Math.sign(c.v || v0);
        if (dir === 0) dir = p2.ty <= 0 ? 1 : -1;
        c.v = dir * Math.sqrt((2 * keWant) / park.m);
      }
    }
    if (c.trail.length > 80) c.trail.shift();
    var pt = samplePath(c.path, c.s);
    c.trail.push({ x: pt.x, y: pt.y });
  }

  function parkStep(dt) {
    var i;
    var allDone = true;
    for (i = 0; i < park.carts.length; i++) {
      parkStepCart(park.carts[i], dt);
      if (!park.carts[i].finished) allDone = false;
    }
    if (allDone) {
      running = false;
      syncPlayBtn();
    }
  }

  function parkPlaceFromCanvas(mx, my) {
    if (park.mode !== "single" || !park.paths[0]) return;
    var map = worldMap(17.4, 6.4, 36);
    var wx = (mx - map.ox) / map.s;
    var closest = 0;
    var best = 1e9;
    var path = park.paths[0];
    for (var i = 0; i < path.s.length; i++) {
      var d = Math.abs(path.pts[i].x - wx);
      if (d < best) {
        best = d;
        closest = path.s[i];
      }
    }
    park.carts = [newCart(path, closest, "sky")];
    running = false;
    syncPlayBtn();
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

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawTrack(path, map, accent) {
    ctx.beginPath();
    var p0 = path.pts[0];
    ctx.moveTo(map.X(p0.x), map.Y(p0.y));
    for (var i = 1; i < path.pts.length; i++) {
      ctx.lineTo(map.X(path.pts[i].x), map.Y(path.pts[i].y));
    }
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = accent || "#0284c7";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawCartOn(c, map) {
    var art = n1();
    var p = samplePath(c.path, c.s);
    var x = map.X(p.x);
    var y = map.Y(p.y);
    var ang = Math.atan2(-p.ty, p.tx);
    var trailColor = c.color === "green" ? "#059669" : "#0284c7";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    if (art) {
      if (c.color === "green") art.greenBox(ctx, -18, -22, 36, 20);
      else art.skyBox(ctx, -18, -22, 36, 20);
    } else {
      ctx.fillStyle = trailColor;
      roundRect(-18, -22, 36, 20, 6);
      ctx.fill();
    }
    ctx.restore();
    if (c.trail.length > 2) {
      ctx.beginPath();
      ctx.strokeStyle = trailColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.moveTo(map.X(c.trail[0].x), map.Y(c.trail[0].y) - 12);
      for (var i = 1; i < c.trail.length; i++) {
        ctx.lineTo(map.X(c.trail[i].x), map.Y(c.trail[i].y) - 12);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawPark() {
    var art = n1();
    var map = worldMap(17.4, 6.4, 36);
    var zh = lang === "zh-HK";
    if (art) art.drawFloor(ctx, cssW, cssH, map.Y(0), zh ? "GPE = 0" : "GPE = 0");
    else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, map.Y(0), cssW, cssH - map.Y(0));
    }
    park.paths.forEach(function (path, idx) {
      drawTrack(path, map, idx === 1 ? "#059669" : "#0284c7");
    });
    ctx.fillStyle = art ? art.C.muted : "#64748b";
    ctx.font = art ? art.mono(700, 11) : "700 11px JetBrains Mono, monospace";
    ctx.textAlign = "left";
    for (var h = 0; h <= 6; h += 2) {
      ctx.fillText(h + " m", 8, map.Y(h) + 4);
      ctx.strokeStyle = "rgba(148,163,184,0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(48, map.Y(h));
      ctx.lineTo(cssW - 10, map.Y(h));
      ctx.stroke();
    }
    park.carts.forEach(function (c) {
      drawCartOn(c, map);
    });
    if (park.mode === "race") {
      ctx.font = inkFont(13);
      ctx.fillStyle = "#0284c7";
      ctx.fillText(zh ? "A 陡坡" : "A  steep", map.X(4.8), map.Y(0.85) + 18);
      ctx.fillStyle = "#059669";
      ctx.fillText(zh ? "B 緩坡" : "B  gentle", map.X(8.5), map.Y(3.2) - 6);
    }
  }


  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    drawPark();
  }

  /* ---------- HUD ---------- */
  function setBar(el, val, max) {
    el.style.width = clamp((val / (max || 1)) * 100, 0, 100) + "%";
  }


  function syncParkHudMode() {
    var race = park.mode === "race";
    document.getElementById("parkPresets").classList.toggle("hidden", race);
    document.getElementById("parkSingleHud").classList.toggle("hidden", race);
    document.getElementById("parkRaceHud").classList.toggle("hidden", !race);
  }

  function fillParkCartHud(prefix, c, maxE) {
    var e = parkEnergies(c);
    setBar(document.getElementById("bar" + prefix + "PE"), e.pe, maxE);
    setBar(document.getElementById("bar" + prefix + "KE"), e.ke, maxE);
    setBar(document.getElementById("bar" + prefix + "TOT"), e.tot, maxE);
    document.getElementById("bar" + prefix + "PEVal").textContent = fmt(e.pe, 1) + " J";
    document.getElementById("bar" + prefix + "KEVal").textContent = fmt(e.ke, 1) + " J";
    document.getElementById("bar" + prefix + "TOTVal").textContent = fmt(e.tot, 1) + " J";
    document.getElementById("park" + prefix + "H").textContent = fmt(e.p.y, 2) + " m";
    document.getElementById("park" + prefix + "V").textContent = fmt(Math.abs(c.v), 2) + " m/s";
    return e;
  }


  function updateHUD() {
    if (!park.carts[0]) return;

      if (park.mode === "race" && park.carts[1]) {
        var eA = parkEnergies(park.carts[0]);
        var eB = parkEnergies(park.carts[1]);
        var maxRace = Math.max(park.scaleMaxE, eA.tot, eB.tot, 1);
        fillParkCartHud("A", park.carts[0], maxRace);
        fillParkCartHud("B", park.carts[1], maxRace);
      } else {
        var e = parkEnergies(park.carts[0]);
        var maxE = Math.max(park.scaleMaxE, e.tot, 1);
        setBar(document.getElementById("barPE"), e.pe, maxE);
        setBar(document.getElementById("barKE"), e.ke, maxE);
        setBar(document.getElementById("barTOT"), e.tot, maxE);
        document.getElementById("barPEVal").textContent = fmt(e.pe, 1) + " J";
        document.getElementById("barKEVal").textContent = fmt(e.ke, 1) + " J";
        document.getElementById("barTOTVal").textContent = fmt(e.tot, 1) + " J";
        document.getElementById("parkH").textContent = fmt(e.p.y, 2) + " m";
        document.getElementById("parkV").textContent = fmt(Math.abs(park.carts[0].v), 2) + " m/s";
      }
    
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
    syncParkHudMode();
    parkRebuild();
    updateHUD();
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    if (running) {
      var steps = 4;
      var h = dt / steps;
      for (var i = 0; i < steps; i++) parkStep(h);
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

  document.querySelectorAll("#parkMode button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#parkMode button").forEach(function (x) {
        x.classList.remove("on");
      });
      b.classList.add("on");
      park.mode = b.getAttribute("data-mode");
      syncParkHudMode();
      parkRebuild();
      running = false;
      syncPlayBtn();
      updateHUD();
    });
  });
  document.querySelectorAll("[data-park]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-park]").forEach(function (x) {
        x.classList.remove("on");
      });
      b.classList.add("on");
      park.trackName = b.getAttribute("data-park");
      parkRebuild();
    });
  });

  function canvasPos(ev) {
    var r = canvas.getBoundingClientRect();
    var src = ev.touches ? ev.touches[0] : ev;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  canvas.addEventListener("pointerdown", function (ev) {
    pointer.down = true;
    var p = canvasPos(ev);
    parkPlaceFromCanvas(p.x, p.y);
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  canvas.addEventListener("pointerup", function () { pointer.down = false; });
  canvas.addEventListener("pointerleave", function () { pointer.down = false; });

  window.addEventListener("resize", function () {
    resize();
    draw();
  });

  parkRebuild();
  syncParkHudMode();
  applyLang();
  requestAnimationFrame(function () {
    resize();
    draw();
    updateHUD();
  });
  requestAnimationFrame(loop);

})();
