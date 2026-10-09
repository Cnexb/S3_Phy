/* Plane Mirror Lab bundle - Chrome file:// compatible */
'use strict';

/* --- geometry.js --- */
/** @file Shared 2D geometry for plane mirror simulations (world units: metres). */
const Vec2 = {
  add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
  sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
  scale(v, s) { return { x: v.x * s, y: v.y * s }; },
  dot(a, b) { return a.x * b.x + a.y * b.y; },
  len(v) { return Math.hypot(v.x, v.y); },
  norm(v) { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; },
  dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); },
  lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; },
  rot(v, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  },
};

function reflectPoint(p, mirrorA, mirrorB) {
  const ab = Vec2.sub(mirrorB, mirrorA);
  const ap = Vec2.sub(p, mirrorA);
  const t = Vec2.dot(ap, ab) / (Vec2.dot(ab, ab) || 1);
  const foot = Vec2.add(mirrorA, Vec2.scale(ab, t));
  return Vec2.add(foot, Vec2.sub(foot, p));
}

function lineIntersection(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-10) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), t, u };
}

function segmentIntersection(p1, p2, p3, p4) {
  return lineIntersection(p1, p2, p3, p4);
}

function lineIntersectInfinite(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-10) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), t };
}

function pointOnSegment(p, a, b, eps = 1e-6) {
  const ab = Vec2.sub(b, a);
  const ap = Vec2.sub(p, a);
  const t = Vec2.dot(ap, ab) / (Vec2.dot(ab, ab) || 1);
  return t >= -eps && t <= 1 + eps;
}

/** Mirror segment vertical at x, from y0 to y1. */
function verticalMirrorSegment(x, y0, y1) {
  return { a: { x, y: Math.min(y0, y1) }, b: { x, y: Math.max(y0, y1) } };
}

/** Horizontal mirror segment at y, from x0 to x1. */
function horizontalMirrorSegment(y, x0, x1) {
  return { a: { x: Math.min(x0, x1), y }, b: { x: Math.max(x0, x1), y } };
}

function virtualSightOnVerticalMirror(imagePt, eye, mirrorX, yMin, yMax) {
  const hit = lineIntersectInfinite(imagePt, eye, { x: mirrorX, y: yMin }, { x: mirrorX, y: yMax });
  if (!hit) return null;
  if (hit.y < yMin - 1e-6 || hit.y > yMax + 1e-6) return null;
  return { x: mirrorX, y: hit.y };
}

function sightRayVertical(objectPt, eye, mirrorX, yMin, yMax) {
  const image = reflectPoint(objectPt, { x: mirrorX, y: yMin }, { x: mirrorX, y: yMax });
  const reflectPt = virtualSightOnVerticalMirror(image, eye, mirrorX, yMin, yMax);
  if (!reflectPt) return { ok: false, image, reflectPt: null };
  return { ok: true, image, reflectPt, objectPt, eye };
}

/** y on mirror for eye to see floor object: y/(hEye-y) = dObj/dEye */
function mirrorHeightForFloorObject(dObj, dEye, hEye, hObj = 0) {
  if (hObj === 0) return (dObj * hEye) / (dObj + dEye);
  const num = dObj * (hEye - hObj) + hObj * dEye;
  const den = dObj + dEye;
  return num / den;
}

/** Ceiling light: mirror height from ground. dLight=dist light to wall, dEye=eye to wall, hLight, hEye */
function mirrorHeightForCeilingLight(dLight, dEye, hLight, hEye) {
  const dh = hLight - hEye;
  const hBelowEye = (dEye * dh) / (dLight + dEye);
  return hEye + hBelowEye;
}

/** Max visible height on back wall through mirror top at mirrorTopY */
function maxHeightOnBackWall(dEyeToMirror, dMirrorToWall, hEye, mirrorTopY) {
  const dy = mirrorTopY - hEye;
  const totalBase = 2 * dEyeToMirror + dMirrorToWall;
  return hEye + dy * totalBase / dEyeToMirror;
}

function minMirrorForBody(H, hEye) {
  const q = hEye / 2;
  const p = H / 2;
  const top = (H + hEye) / 2;
  return { length: p, bottom: q, top, minP: p, minQ: q };
}

function canSeeFullBody(H, hEye, p, q) {
  const req = minMirrorForBody(H, hEye);
  return { ok: p >= req.minP - 1e-6 && q >= req.minQ - 1e-6, required: req };
}

/** Ground mirror: horizontal span visible at height H from eye at hEye over mirror half-width w */
function groundMirrorSpan(hEye, mirrorWidth, objectHeight) {
  const totalH = hEye + objectHeight;
  const x = (mirrorWidth * objectHeight) / hEye;
  return x;
}

function groundMirrorSpeed(hEye, mirrorWidth, cloudHeight, timeSec) {
  const x = groundMirrorSpan(hEye, mirrorWidth, cloudHeight);
  return { distance: x, speed: timeSec > 0 ? x / timeSec : 0 };
}

function reflectAcrossLine(p, a, b) {
  return reflectPoint(p, a, b);
}

/** j-th mirror boundary: evenly divides 360° into 360/θ sectors (j = 0 .. nWedges-1). */
function wedgeMirrorLineAngle(j, half, thetaRad) {
  return -half + j * thetaRad;
}

/** k-th use of M1/M2 maps to sector boundary index j. */
function wedgeMirrorLineIndex(mirrorSide, useCount) {
  const k = useCount;
  return mirrorSide === 1 ? 2 * (k - 1) + 1 : 2 * (k - 1);
}

/** Ray from apex toward the virtual-image sector (opposite side of real segment when k >= 2). */
function wedgeMirrorDrawAngle(mirrorSide, useCount, half) {
  const k = useCount;
  const sign = mirrorSide === 1 ? (-1) ** (k + 1) : (-1) ** k;
  return sign * (2 * k - 1) * half;
}

/** Pick apex→tip direction along sector j that points toward towardPt (for virtual mirror extension). */
function wedgeMirrorDrawAngleToward(j, towardPt, half, thetaRad) {
  const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
  const c1 = Math.cos(lineAngle);
  const s1 = Math.sin(lineAngle);
  const c2 = Math.cos(lineAngle + Math.PI);
  const s2 = Math.sin(lineAngle + Math.PI);
  const dot1 = towardPt.x * c1 + towardPt.y * s1;
  const dot2 = towardPt.x * c2 + towardPt.y * s2;
  return dot1 >= dot2 ? lineAngle : lineAngle + Math.PI;
}

/** Real-sector j for M1 (j=1) or M2 (j=0). */
function realMirrorLineJ(mirrorSide) {
  return mirrorSide === 1 ? 1 : 0;
}

function buildAltMirrorResult(j, imagePt, half, thetaRad) {
  const mirrorSide = j % 2 === 0 ? 2 : 1;
  const mirrorOrder = Math.floor(j / 2) + 1;
  const mirrorAngle = wedgeMirrorDrawAngleToward(j, imagePt, half, thetaRad);
  return {
    mirrorSide,
    mirrorOrder,
    mirrorAngle,
    mirrorLineIndex: j,
    isVirtual: mirrorOrder >= 2,
    mirror: {
      a: { x: 0, y: 0 },
      b: { x: Math.cos(mirrorAngle), y: Math.sin(mirrorAngle) },
    },
  };
}

/** Find mirror j that reflects altParent to imagePt; draw extension toward image. */
function findAltMirror(altParent, imagePt, apex, half, thetaRad, nWedges, altParentMirrorSide) {
  const matches = [];
  for (let j = 0; j < nWedges; j++) {
    const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const reflected = reflectPoint(altParent, apex, tip);
    if (Vec2.dist(reflected, imagePt) < 1e-5) matches.push(j);
  }

  if (!matches.length) {
    const j = realMirrorLineJ(altParentMirrorSide);
    return buildAltMirrorResult(j, imagePt, half, thetaRad);
  }

  const sideMatches = matches.filter((j) => (j % 2 === 0 ? 2 : 1) === altParentMirrorSide);
  const candidates = sideMatches.length ? sideMatches : matches;

  const minOrder = Math.min(...candidates.map((j) => Math.floor(j / 2) + 1));
  let bestJ = candidates[0];
  let bestDot = -Infinity;
  for (const j of candidates) {
    if (Math.floor(j / 2) + 1 !== minOrder) continue;
    const drawAngle = wedgeMirrorDrawAngleToward(j, imagePt, half, thetaRad);
    const towardImage = imagePt.x * Math.cos(drawAngle) + imagePt.y * Math.sin(drawAngle);
    if (towardImage > bestDot) {
      bestDot = towardImage;
      bestJ = j;
    }
  }
  return buildAltMirrorResult(bestJ, imagePt, half, thetaRad);
}

function angleDiff(a, b) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
}

/** Pick sector boundary j whose reflection from parent matches the unfolded target angle. */
function findPrimaryMirrorJ(parent, objectAngle, i, half, thetaRad, nWedges) {
  const k = Math.ceil((i + 1) / 2);
  const sign = i % 2 === 0 ? 1 : -1;
  const targetAngle = objectAngle + sign * k * thetaRad;
  let bestJ = 0;
  let bestErr = Infinity;
  for (let j = 0; j < nWedges; j++) {
    const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const candidate = reflectPoint(parent, { x: 0, y: 0 }, tip);
    const err = angleDiff(Math.atan2(candidate.y, candidate.x), targetAngle);
    if (err < bestErr) {
      bestErr = err;
      bestJ = j;
    }
  }
  return bestJ;
}

/** Generate images in wedge between two mirrors meeting at origin, angle theta (rad). */
function imagesInWedge(thetaRad, object, maxImages = 12) {
  const half = thetaRad / 2;
  const nFormula = Math.round(360 / rad2deg(thetaRad)) - 1;
  const nWedges = Math.round(360 / rad2deg(thetaRad));
  const labels = ['X', 'Z', 'Y', 'W', 'V', 'U', 'T', 'S', 'R', 'Q'];
  const apex = { x: 0, y: 0 };
  const objectAngle = Math.atan2(object.y, object.x);
  const images = [];

  for (let i = 0; i < nFormula && images.length < maxImages; i++) {
    const parentIdx = i < 2 ? -1 : i - 2;
    const parent = parentIdx < 0 ? object : images[parentIdx].pt;
    const mirrorLineIndex = findPrimaryMirrorJ(parent, objectAngle, i, half, thetaRad, nWedges);
    const lineAngle = wedgeMirrorLineAngle(mirrorLineIndex, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const pt = reflectPoint(parent, apex, tip);
    const mirrorSide = mirrorLineIndex % 2 === 0 ? 2 : 1;
    const mirrorOrder = Math.floor(mirrorLineIndex / 2) + 1;
    const mirrorAngle = wedgeMirrorDrawAngleToward(mirrorLineIndex, pt, half, thetaRad);
    const isVirtual = mirrorOrder >= 2;

    const entry = {
      pt: { ...pt },
      label: labels[i] || String(i + 1),
      angle: Math.atan2(pt.y, pt.x),
      parentIdx,
      parentLabel: parentIdx < 0 ? 'O' : images[parentIdx].label,
      mirrorLineIndex,
      mirrorAngle,
      mirrorSide,
      mirrorOrder,
      isVirtual,
      mirror: {
        a: { x: 0, y: 0 },
        b: { x: Math.cos(mirrorAngle), y: Math.sin(mirrorAngle) },
      },
    };
    if (i >= 2) {
      const altParentIdx = i % 2 === 0 ? i - 1 : i - 3;
      if (altParentIdx >= 0) {
        const alt = findAltMirror(
          images[altParentIdx].pt,
          pt,
          apex,
          half,
          thetaRad,
          nWedges,
          images[altParentIdx].mirrorSide,
        );
        if (alt) {
          entry.altConstruction = { ...alt, parentIdx: altParentIdx };
        }
      }
    }
    images.push(entry);
  }

  return { images, count: images.length, formula: nFormula };
}

function deg2rad(d) { return d * Math.PI / 180; }
function rad2deg(r) { return r * 180 / Math.PI; }

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function formatLength(m, lang = 'zh') {
  if (m >= 1) return `${m.toFixed(2)} m`;
  const cm = m * 100;
  return lang === 'zh' ? `${cm.toFixed(1)} cm` : `${cm.toFixed(1)} cm`;
}


/* --- rayColors.js --- */
/** @file Session-wide ray colour preferences and per-ray resolution. */

const RAY_COLOR_PRESETS = [
  '#00e676', '#a78bfa', '#22d3ee', '#ffcc00',
  '#ff5252', '#fb923c', '#e4e4e7', '#f472b6',
];

const prefs = { real: '#00e676', virtual: '#a78bfa' };

function getRayColor(kind) {
  return prefs[kind];
}

function setRayColor(kind, hex) {
  prefs[kind] = hex;
}

function getRayColors() {
  return { ...prefs };
}

function resolveRayColor(ray) {
  return ray.color ?? getRayColor(ray.kind);
}


/* --- canvasView.js --- */
/** @file Canvas drawing helpers — colours map 1:1 to styles.css legend & SVG icons. */


/**
 * Optical colour semantics (HKDSE ray diagrams):
 * - mirror: plane mirror surface
 * - rayReal: incident/reflected rays (solid)
 * - rayVirtual: extensions behind mirror / virtual images (dashed)
 * - mirrorNeed: minimum required mirror segment (exam highlight)
 */
const COLORS = {
  bg: '#f8f9fa',
  grid: '#e8eaed',
  gridMajor: '#d1d5db',
  mirror: '#0891b2',
  mirrorNeed: '#ca8a04',
  mirrorFail: '#dc2626',
  rayReal: '#16a34a',
  rayVirtual: '#7c3aed',
  object: '#374151',
  image: '#4f46e5',
  eye: '#db2777',
  wall: '#9ca3af',
  ground: '#d1d5db',
  label: '#1a1c2c',
  visible: '#16a34a',
  hidden: '#9ca3af',
  accent: '#2563eb',
};

function createWorldView(canvas, opts = {}) {
  const margin = opts.margin ?? { left: 50, right: 30, top: 30, bottom: 50 };
  const gridStep = opts.gridStep ?? 1;
  return {
    canvas,
    margin,
    gridStep,
    worldBounds: opts.worldBounds ?? { xMin: -1, xMax: 5, yMin: 0, yMax: 3 },
    pxPerM: opts.pxPerM ?? null,
    zoomFactor: opts.zoomFactor ?? 1,
    showGrid: opts.showGrid !== false,
    horizontalGridScale: opts.horizontalGridScale ?? 1,
  };
}

/** Actual displayed canvas size after layout (matches pointer coordinates). */
function getCanvasLayout(canvas) {
  const rect = canvas.getBoundingClientRect();
  return { w: rect.width, h: rect.height, rect };
}

function isFullscreen() {
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    if (window.parent && (window.parent.document.fullscreenElement || window.parent.document.webkitFullscreenElement)) return true;
    if (window.parent && window.parent.document.getElementById('app')?.classList.contains('is-lab-fullscreen')) return true;
  } catch (e) {}
  return window.innerHeight > 650 && document.documentElement.classList.contains('s3phy-embed');
}

function resizeCanvasToDisplay(canvas, opts = {}) {
  const maxHeight = opts.maxHeight ?? 520;
  const minHeight = opts.minHeight ?? 400;
  const aspect = opts.aspect ?? 0.62;
  const parent = canvas.parentElement;
  let parentRect;
  if (parent) {
    const prevStyleHeight = canvas.style.height;
    canvas.style.height = '10px';
    parentRect = parent.getBoundingClientRect();
  } else {
    parentRect = { width: canvas.clientWidth || 600, height: canvas.clientHeight || 400 };
  }
  const w = Math.max(600, Math.floor(parentRect.width - 20));
  let h;
  if (document.documentElement.classList.contains('s3phy-embed')) {
    if (isFullscreen()) {
      h = Math.max(minHeight, Math.floor(parentRect.height - 10));
    } else {
      h = Math.max(280, Math.min(maxHeight, Math.floor(parentRect.height - 12)));
    }
  } else {
    if (isFullscreen()) {
      h = Math.max(minHeight, Math.floor(parentRect.height - 10));
    } else {
      h = Math.max(minHeight, Math.min(maxHeight, Math.floor(w * aspect)));
    }
  }
  const dpr = window.devicePixelRatio || 1;
  canvas.style.flex = 'none';
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.maxWidth = '100%';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const layout = getCanvasLayout(canvas);
  return { w: layout.w, h: layout.h, ctx, layout };
}

/** Pointer client coords → world coords using the same layout as draw(). */
function clientToWorld(view, layout, clientX, clientY) {
  const rect = layout?.rect ?? layout;
  const sx = clientX - rect.left;
  const sy = clientY - rect.top;
  const txf = computeTransform(view, layout.w, layout.h);
  return {
    x: (sx - txf.ox) / txf.pxPerM,
    y: (txf.oy - sy) / txf.pxPerM,
    sx,
    sy,
    txf,
    layout,
  };
}

function computeTransform(view, canvasW, canvasH) {
  const { margin, worldBounds } = view;
  const plotW = canvasW - margin.left - margin.right;
  const plotH = canvasH - margin.top - margin.bottom;
  const worldW = worldBounds.xMax - worldBounds.xMin;
  const worldH = worldBounds.yMax - worldBounds.yMin;
  const fitPxPerM = view.pxPerM ?? Math.min(plotW / worldW, plotH / worldH);
  const zoom = view.zoomFactor ?? 1;
  const pxPerM = fitPxPerM * zoom;
  const usedW = worldW * pxPerM;
  const usedH = worldH * pxPerM;
  /* Centre world bounds in plot area when aspect ratios differ */
  const padX = Math.max(0, (plotW - usedW) / 2);
  const padY = Math.max(0, (plotH - usedH) / 2);
  const ox = margin.left + padX - worldBounds.xMin * pxPerM;
  const oy = canvasH - margin.bottom - padY + worldBounds.yMin * pxPerM;
  return { pxPerM, ox, oy, plotW, plotH, padX, padY };
}

function toScreen(view, t, p) {
  return { x: t.ox + p.x * t.pxPerM, y: t.oy - p.y * t.pxPerM };
}

function toWorld(view, t, sx, sy) {
  return { x: (sx - t.ox) / t.pxPerM, y: (t.oy - sy) / t.pxPerM };
}

function clear(ctx, w, h) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);
}

function drawGrid(ctx, view, t, w, h) {
  if (!view.showGrid) return;
  const step = view.gridStep;
  const hStep = step * (view.horizontalGridScale ?? 1);
  const { worldBounds } = view;
  ctx.lineWidth = 1;
  for (let x = Math.ceil(worldBounds.xMin / hStep) * hStep; x <= worldBounds.xMax; x += hStep) {
    const major = Math.abs((x / hStep) % 2) < 0.01;
    ctx.strokeStyle = major ? COLORS.gridMajor : COLORS.grid;
    const p0 = toScreen(view, t, { x, y: worldBounds.yMin });
    const p1 = toScreen(view, t, { x, y: worldBounds.yMax });
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  for (let y = Math.ceil(worldBounds.yMin / step) * step; y <= worldBounds.yMax; y += step) {
    const major = Math.abs((y / step) % 2) < 0.01;
    ctx.strokeStyle = major ? COLORS.gridMajor : COLORS.grid;
    const p0 = toScreen(view, t, { x: worldBounds.xMin, y });
    const p1 = toScreen(view, t, { x: worldBounds.xMax, y });
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}

/**
 * Polar wedge grid for angled mirrors — radial + arc lines rotate with φ, aligned to apex.
 * Replaces axis-aligned Cartesian grid when mirrors are rotated.
 */
function drawPolarWedgeGrid(ctx, view, t, opts = {}) {
  const apex = opts.apex ?? { x: 0, y: 0 };
  const phi = opts.phi ?? 0;
  const half = opts.halfAngle ?? Math.PI / 4;
  const maxR = opts.maxR ?? 3.5;
  const stepR = opts.stepR ?? 1;
  const angMin = phi - half;
  const angMax = phi + half;

  for (let r = stepR; r <= maxR + 0.01; r += stepR) {
    const major = Math.abs(Math.round(r / stepR) % 2) === 0;
    ctx.strokeStyle = major ? COLORS.gridMajor : COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const segs = Math.max(12, Math.ceil((angMax - angMin) / 0.15));
    for (let i = 0; i <= segs; i++) {
      const a = angMin + ((angMax - angMin) * i) / segs;
      const s = toScreen(view, t, { x: apex.x + r * Math.cos(a), y: apex.y + r * Math.sin(a) });
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    }
    ctx.stroke();
  }

  const nRadials = Math.max(4, Math.ceil((2 * half) / (Math.PI / 12)));
  for (let i = 0; i <= nRadials; i++) {
    const a = angMin + ((angMax - angMin) * i) / nRadials;
    const onBisector = Math.abs(a - phi) < 0.04;
    const onMirror = Math.abs(a - angMin) < 0.04 || Math.abs(a - angMax) < 0.04;
    ctx.strokeStyle = onBisector
      ? 'rgba(255,204,0,0.22)'
      : onMirror
        ? 'rgba(34,211,238,0.18)'
        : COLORS.grid;
    ctx.lineWidth = onBisector ? 1.5 : 1;
    const s0 = toScreen(view, t, apex);
    const s1 = toScreen(view, t, { x: apex.x + maxR * Math.cos(a), y: apex.y + maxR * Math.sin(a) });
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
  }
}

function drawGround(ctx, view, t, y = 0) {
  const p0 = toScreen(view, t, { x: view.worldBounds.xMin, y });
  const p1 = toScreen(view, t, { x: view.worldBounds.xMax, y });
  ctx.strokeStyle = COLORS.ground;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

function drawVerticalMirror(ctx, view, t, x, y0, y1, color = COLORS.mirror, width = 4) {
  const p0 = toScreen(view, t, { x, y: y0 });
  const p1 = toScreen(view, t, { x, y: y1 });
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
  const hash = 8;
  for (let y = y0; y <= y1; y += 0.25) {
    const ps = toScreen(view, t, { x, y });
    ctx.beginPath();
    ctx.moveTo(ps.x - hash, ps.y - hash * 0.5);
    ctx.lineTo(ps.x, ps.y);
    ctx.stroke();
  }
}

function drawHorizontalMirror(ctx, view, t, y, x0, x1, color = COLORS.mirror) {
  const p0 = toScreen(view, t, { x: x0, y });
  const p1 = toScreen(view, t, { x: x1, y });
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

function drawWall(ctx, view, t, x, y0, y1) {
  drawVerticalMirror(ctx, view, t, x, y0, y1, COLORS.wall, 3);
}

function drawEyeSideView(ctx, cx, cy, r = 12, facingRight = true) {
  ctx.save();
  ctx.translate(cx, cy);
  if (!facingRight) {
    ctx.scale(-1, 1);
  }

  const strokeColor = '#f472b6'; // COLORS.eye (pink) for theme consistency
  const eyelashColor = '#f472b6';

  // 1. Draw iris/pupil: black ellipse on the right
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(r * 0.35, 0, r * 0.35, r * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw white crescent highlight inside the iris
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(r * 0.43, 0, r * 0.2, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(r * 0.37, 0, r * 0.2, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Draw eyelids (top and bottom lines of the triangle)
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Top eyelid: from apex to right
  ctx.beginPath();
  ctx.moveTo(-r * 1.2, 0);
  ctx.quadraticCurveTo(0, -r * 0.3, r * 0.8, -r * 0.65);
  ctx.stroke();

  // Bottom eyelid: from apex to right
  ctx.beginPath();
  ctx.moveTo(-r * 1.2, 0);
  ctx.quadraticCurveTo(0, r * 0.3, r * 0.8, r * 0.65);
  ctx.stroke();

  // 4. Draw eyelashes (pointy, filled)
  ctx.fillStyle = eyelashColor;

  // Eyelash 1
  ctx.beginPath();
  ctx.moveTo(r * 0.2, -r * 0.45);
  ctx.quadraticCurveTo(r * 0.25, -r * 0.8, r * 0.35, -r * 1.15);
  ctx.quadraticCurveTo(r * 0.28, -r * 0.75, r * 0.26, -r * 0.47);
  ctx.closePath();
  ctx.fill();

  // Eyelash 2
  ctx.beginPath();
  ctx.moveTo(r * 0.4, -r * 0.5);
  ctx.quadraticCurveTo(r * 0.45, -r * 0.95, r * 0.55, -r * 1.3);
  ctx.quadraticCurveTo(r * 0.48, -r * 0.9, r * 0.46, -r * 0.52);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPoint(ctx, view, t, p, r = 5, color = COLORS.accent, label = '', forcePoint = false) {
  const s = toScreen(view, t, p);

  if (!forcePoint && (color === COLORS.eye || label === 'E' || label === 'E\'' || (label === 'A' && color === COLORS.eye))) {
    const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
    const facingRight = s.x < (canvasW / 2);
    drawEyeSideView(ctx, s.x, s.y, 14, facingRight);
    if (label) {
      drawLabel(ctx, s.x - 5, s.y - 18, label);
    }
    return;
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
  ctx.fill();
  if (label) drawLabel(ctx, s.x + 8, s.y - 8, label);
}

function drawLabel(ctx, x, y, text, color = COLORS.label, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function drawArrow(ctx, view, t, from, to, opts = {}) {
  const {
    width = 2,
    dashed = false,
    progress = 1,
    head = true,
  } = opts;
  const color = opts.color ?? (dashed ? getRayColor('virtual') : getRayColor('real'));
  const end = progress >= 1 ? to : Vec2.lerp(from, to, progress);
  const s0 = toScreen(view, t, from);
  const s1 = toScreen(view, t, end);
  /* Soft glow helps students track ray direction during step animation */
  if (!dashed && progress >= 0.5) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width + 4;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([6, 5]);
  else ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(s0.x, s0.y);
  ctx.lineTo(s1.x, s1.y);
  ctx.stroke();
  ctx.setLineDash([]);
  if (head && progress >= 0.95) {
    const ang = Math.atan2(s1.y - s0.y, s1.x - s0.x);
    const hl = 9;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(s1.x - hl * Math.cos(ang - 0.35), s1.y - hl * Math.sin(ang - 0.35));
    ctx.lineTo(s1.x - hl * Math.cos(ang + 0.35), s1.y - hl * Math.sin(ang + 0.35));
    ctx.closePath();
    ctx.fill();
  }
}

function drawArrowBody(ctx, view, t, y0, y1, x, dashed = false) {
  drawArrow(ctx, view, t, { x, y: y0 }, { x, y: y1 }, {
    color: COLORS.object,
    width: 3,
    dashed,
    head: true,
  });
}

function drawPerson(ctx, view, t, x, h, hEye, labels = {}) {
  drawGround(ctx, view, t);
  drawArrowBody(ctx, view, t, 0, h, x);
  const eye = { x, y: hEye };
  drawPoint(ctx, view, t, eye, 6, COLORS.eye, labels.E || 'E');
  drawPoint(ctx, view, t, { x, y: h }, 5, COLORS.object, labels.A || 'A');
  drawPoint(ctx, view, t, { x, y: 0 }, 5, COLORS.object, labels.B || 'B');
  return { top: { x, y: h }, eye, foot: { x, y: 0 } };
}

function drawLegend(ctx, x, y, items) {
  let cy = y;
  items.forEach((it) => {
    ctx.strokeStyle = it.color;
    ctx.lineWidth = it.width || 2;
    if (it.dashed) ctx.setLineDash([5, 4]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x, cy + 6);
    ctx.lineTo(x + 24, cy + 6);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = COLORS.label;
    ctx.font = '12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(it.text, x + 30, cy + 10);
    cy += 20;
  });
}

/** Arbitrary-angle mirror segment with hatch on the reflective side. */
function drawMirrorSegment(ctx, view, t, a, b, color = COLORS.mirror, width = 4, selected = false) {
  const p0 = toScreen(view, t, a);
  const p1 = toScreen(view, t, b);
  ctx.strokeStyle = selected ? COLORS.mirrorNeed : color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();

  const ab = Vec2.sub(b, a);
  const len = Vec2.len(ab) || 1;
  const tangent = Vec2.scale(ab, 1 / len);
  const n = { x: -tangent.y, y: tangent.x };
  const hashLen = 0.12;
  const steps = Math.max(3, Math.floor(len / 0.25));
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const p = Vec2.lerp(a, b, u);
    const ps = toScreen(view, t, p);
    const off = Vec2.scale(n, hashLen * t.pxPerM);
    ctx.beginPath();
    ctx.moveTo(ps.x - off.x * 0.6, ps.y + off.y * 0.6);
    ctx.lineTo(ps.x, ps.y);
    ctx.stroke();
  }
  drawPoint(ctx, view, t, a, 5, selected ? COLORS.mirrorNeed : color, '');
  drawPoint(ctx, view, t, b, 5, selected ? COLORS.mirrorNeed : color, '');
}

/** Object or image bar (solid or dashed). */
function drawBar(ctx, view, t, a, b, opts = {}) {
  const {
    color = COLORS.object,
    width = 4,
    dashed = false,
    labelA = '',
    labelB = '',
    selected = false,
  } = opts;
  drawArrow(ctx, view, t, a, b, {
    color: selected ? COLORS.mirrorNeed : color,
    width,
    dashed,
    head: true,
  });
  if (labelA) drawPoint(ctx, view, t, a, 5, color, labelA);
  if (labelB) drawPoint(ctx, view, t, b, 5, color, labelB);
}


/* --- rayAnimator.js --- */
/** @file Step-by-step ray diagram animation (HKDSE drawing order). */

const STEPS_PER_RAY = 5;

class RayAnimator {
  constructor() {
    this.stepIndex = 0;
    this.playing = false;
    this.raf = null;
    this.playTimer = null;
    this.stepDelayMs = 550;
    this.onUpdate = null;
    this.rayCount = 2;
    /** Steps per ray/image unit (default 5 for HKDSE sight rays; wedge mirrors use 2). */
    this.stepsPerRay = STEPS_PER_RAY;
    /** Extra animation steps after all rays (e.g. similar-triangle construction). */
    this.extraSteps = 0;
    /** When set, bypasses rayCount/stepsPerRay formula (e.g. Image Formation uses 7). */
    this.overrideTotalSteps = null;
  }

  get totalSteps() {
    if (this.overrideTotalSteps != null) return this.overrideTotalSteps;
    return (this.rayCount || 1) * (this.stepsPerRay || STEPS_PER_RAY) + (this.extraSteps ?? 0);
  }

  get progress() {
    return this.totalSteps > 0 ? this.stepIndex / this.totalSteps : 0;
  }

  reset() {
    this.pause();
    this.stepIndex = 0;
    this.onUpdate?.();
  }

  showAll() {
    this.pause();
    this.stepIndex = this.totalSteps;
    this.onUpdate?.();
  }

  play() {
    if (this.playing) return;
    if (this.stepIndex >= this.totalSteps) this.stepIndex = 0;
    this.playing = true;
    this.playTimer = setInterval(() => {
      if (this.stepIndex < this.totalSteps) {
        this.stepIndex += 1;
        this.onUpdate?.();
      } else {
        this.pause();
      }
    }, this.stepDelayMs);
  }

  pause() {
    this.playing = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  stepNext() {
    this.pause();
    if (this.stepIndex < this.totalSteps) {
      this.stepIndex += 1;
      this.onUpdate?.();
    }
  }

  /**
   * Draw one sight ray with discrete steps (1–5 per ray).
   * stepIndex: global count of completed steps (0 = blank).
   */
  static drawSightRay(ctx, view, t, draw, ray, stepIndex, rayIndex, rayCount, fail = false) {
    const rayStart = rayIndex * STEPS_PER_RAY;
    const localSteps = Math.max(0, Math.min(STEPS_PER_RAY, stepIndex - rayStart));
    if (localSteps <= 0) return;

    const { objectPt, eye, image, reflectPt } = ray;
    const realColor = fail ? '#ff5252' : undefined;

    if (localSteps >= 1) {
      draw.drawPoint?.(objectPt, fail ? '#ff5252' : undefined);
    }

    if (localSteps >= 2 && image) {
      draw.drawImageLine?.(objectPt, image, 1);
    }

    if (localSteps >= 3 && image && reflectPt) {
      draw.drawArrow(image, eye, { dashed: true, progress: 1, color: realColor || undefined });
    }

    if (localSteps >= 4 && reflectPt) {
      draw.drawArrow(objectPt, reflectPt, { progress: 1, color: realColor || undefined });
    }

    if (localSteps >= 5 && reflectPt) {
      draw.drawArrow(reflectPt, eye, { progress: 1, color: realColor || undefined });
    }
  }
}


/* --- planeMirrorSight.js --- */
/** @file Shared 7-step plane-mirror sight-ray animation (Image Formation, Min. Length). */

const PLANE_MIRROR_SIGHT_STEPS = 7;

/** Virtual image line with A' (top), E' (eye), B' (foot) labels on the right. */
function drawVirtualImageWithLabels(ctx, view, txf, imgX, h, hEye) {
  drawArrowBody(ctx, view, txf, 0, h, imgX, true);
  drawPoint(ctx, view, txf, { x: imgX, y: h }, 5, COLORS.image, "A'");
  drawPoint(ctx, view, txf, { x: imgX, y: hEye }, 5, COLORS.image, "E'");
  drawPoint(ctx, view, txf, { x: imgX, y: 0 }, 5, COLORS.image, "B'");
}

/** Cumulative 7-step plane-mirror sight-ray animation (Image Formation, Min. Length). */
function drawPlaneMirrorSightRays(ctx, view, txf, c, imgX, h, hEye, stepIndex) {
  if (stepIndex <= 0) return;

  if (stepIndex >= 1) {
    drawVirtualImageWithLabels(ctx, view, txf, imgX, h, hEye);
  }

  const { eye, top, foot, imgTop, imgFoot, rayTop, rayFoot } = c;

  if (stepIndex >= 2 && rayTop.reflectPt) {
    drawArrow(ctx, view, txf, imgTop, eye, { dashed: true, progress: 1 });
  }
  if (stepIndex >= 3 && rayTop.reflectPt) {
    drawArrow(ctx, view, txf, top, rayTop.reflectPt, { progress: 1 });
  }
  if (stepIndex >= 4 && rayTop.reflectPt) {
    drawArrow(ctx, view, txf, rayTop.reflectPt, eye, { progress: 1 });
  }
  if (stepIndex >= 5 && rayFoot.reflectPt) {
    drawArrow(ctx, view, txf, imgFoot, eye, { dashed: true, progress: 1 });
  }
  if (stepIndex >= 6 && rayFoot.reflectPt) {
    drawArrow(ctx, view, txf, foot, rayFoot.reflectPt, { progress: 1 });
  }
  if (stepIndex >= 7 && rayFoot.reflectPt) {
    drawArrow(ctx, view, txf, rayFoot.reflectPt, eye, { progress: 1 });
  }
}


/* --- i18n.js --- */
/** @file Bilingual strings — one language visible at a time. */

const STRINGS = {
  zh: {
    title: '平面鏡反射實驗室',
    subtitle: 'HKDSE 光學互動模擬',
    langBtn: 'English',
    tabs: {
      imageFormation: '像的形成',
      minLength: '最小鏡長',
      minHeight: '最小鏡高',
      seeBack: '看後方物件',
      groundMirror: '地面鏡',
      fieldOfView: '視野與障礙',
      angledMirrors: '夾角鏡',
      raySketch: '練習作圖',
    },
    concept: {
      imageFormation: '像的形成 · u = v',
      minLength: '最小鏡長 · 相似三角形',
      minHeight: '最小鏡高 · 光路幾何',
      seeBack: '看後方物件 · 虛像延長',
      angledMirrors: '夾角鏡 · n = 360°/θ − 1',
      raySketch: '練習作圖 · 反射定律',
    },
    sub: {
      feet: '看見自己的腳',
      cockroach: '看見地上物件',
      mc: 'MC 驗證',
      ceiling: '天花燈',
      spider: '後牆蜘蛛',
      side: '側視圖',
      top: '俯視圖',
    },
    anim: {
      play: '逐步繪製光線',
      pause: '暫停',
      step: '下一步',
      showAll: '顯示全部',
      replay: '重播',
    },
    preset: '載入原題數值',
    reset: '重設',
    results: '計算結果',
    legend: '圖例',
    legendReal: '實際光線',
    legendVirtual: '虛線／虛像',
    legendNeed: '所需鏡段',
    legendMirror: '平面鏡',
    legendObject: '實物 O',
    legendEye: '觀察者 E',
    formulaLive: '即時公式',
    vizHint: '拖曳元素或調整滑桿，公式會即時更新',
    footerNote: '拖曳畫布元素 · 滑桿調參 · 公式同步更新',
    controls: '參數',
    description: '說明',
    visible: '可見',
    hidden: '不可見',
    uEqualsV: '物距 u = 像距 v',
    virtualImage: '虛像：正立、等大、左右倒轉',
    minLength: '最小鏡長',
    minBottom: '鏡底最低高度',
    minTop: '鏡頂高度',
    canSeeFull: '可以看見全身',
    cannotSeeFull: '無法看見全身',
    mirrorBottom: '鏡底高度 y',
    mirrorLength: '鏡長 p',
    cloudSpeed: '雲的像移動速度',
    cloudDistance: '像橫移距離',
    imageCount: '像的數目',
    formula: '公式',
    moveCloser: '走近鏡子 10 cm',
    objectDistance: '物距 u',
    objectHeight: '物高',
    personHeight: '身高',
    eyeHeight: '眼高',
    distToMirror: '人鏡距離',
    distObjToMirror: '物件距鏡',
    ceilingHeight: '天花高度',
    distLightToWall: '燈距牆',
    mirrorTop: '鏡頂高度',
    distToBackWall: '後牆距人',
    mirrorWidth: '鏡闊',
    cloudHeight: '雲高度',
    time: '時間',
    angle: '夾角 θ',
    wedgeOrientation: '旋轉 φ',
    wedgeHintObject: '拖曳物件移動',
    wedgeClearSketch: '清除作圖',
    zoomIn: '放大',
    zoomOut: '縮小',
    zoomFit: '適配',
    zoomScrollHint: '滾輪縮放',
    showRays: '顯示光線',
    showImages: '顯示虛像',
    addObject: '新增物件',
    removeObject: '移除物件',
    placeObject: '點擊放置',
    toolSelect: '選取',
    toolMirror: '鏡面',
    toolObject: '物件',
    toolImage: '虛像',
    toolObserver: '觀察者',
    toolRealRay: '實線',
    toolVirtualRay: '虛線',
    deleteSelected: '刪除選取',
    gridSnap: '網格對齊',
    sketchTools: '作圖工具',
    sketchGroupPlace: '放置元素',
    sketchGroupNav: '選取與移動',
    sketchGroupRays: '繪製光線',
    sketchGroupActions: '操作',
    sketchHintSelect: '點選線段或端點；拖曳移動；按刪除或 Delete 鍵移除',
    sketchHintMarquee: '拖曳框選多個元素；Shift 加選；Delete 刪除',
    sketchHintMirror: '在畫布上點擊兩點，畫出鏡面線段',
    sketchHintObject: '點擊兩點，畫出物件棒（A、B）',
    sketchHintImage: '點擊兩點，畫出虛像棒（A′、B′）',
    sketchHintObserver: '點擊一下，放置觀察者 E',
    sketchHintRealRay: '點擊兩點，畫一條實線（每段獨立繪製）',
    sketchHintVirtualRay: '點擊兩點，畫一條虛線（每段獨立繪製）',
    sketchSelected: '已選取',
    sketchNothingSelected: '未選取任何元素',
    rayColorTitle: '光線顏色',
    rayColorReal: '實際光線',
    rayColorVirtual: '虛線光線',
    rayColorEditHint: '已選取光線 — 點色板可改顏色',
    presetsTitle: '預設場景',
    presetBasic: '基礎反射作圖',
    presetLetterP: '字母 P 字形練習',
    presetGround: '地面鏡反射練習',
    presetEmpty: '全新畫布',
    observerAsPoint: '以點表示觀察者',
  },
  en: {
    title: 'Plane Mirror Reflection Lab',
    subtitle: 'HKDSE Optics Interactive Simulation',
    langBtn: '中文',
    tabs: {
      imageFormation: 'Image Formation',
      minLength: 'Min. Length',
      minHeight: 'Min. Height',
      seeBack: 'See Back Object',
      groundMirror: 'Ground Mirror',
      fieldOfView: 'Field of View',
      angledMirrors: 'Angled Mirrors',
      raySketch: 'Ray Sketch',
    },
    concept: {
      imageFormation: 'Image formation · u = v',
      minLength: 'Min length · similar triangles',
      minHeight: 'Min height · ray geometry',
      seeBack: 'Behind mirror · virtual sight',
      angledMirrors: 'Wedge mirrors · n = 360°/θ − 1',
      raySketch: 'Ray sketch · reflection law',
    },
    sub: {
      feet: 'See Own Feet',
      cockroach: 'See Floor Object',
      mc: 'MC Check',
      ceiling: 'Ceiling Light',
      spider: 'Spider on Wall',
      side: 'Side View',
      top: 'Top View',
    },
    anim: {
      play: 'Animate Rays',
      pause: 'Pause',
      step: 'Next Step',
      showAll: 'Show All',
      replay: 'Replay',
    },
    preset: 'Load Worksheet Values',
    reset: 'Reset',
    results: 'Results',
    legend: 'Legend',
    legendReal: 'Real ray',
    legendVirtual: 'Virtual / dashed',
    legendNeed: 'Required mirror',
    legendMirror: 'Plane mirror',
    legendObject: 'Object O',
    legendEye: 'Observer E',
    formulaLive: 'Live formula',
    vizHint: 'Drag elements or sliders — formula updates live',
    footerNote: 'Drag canvas · adjust sliders · live formulas',
    controls: 'Controls',
    description: 'Description',
    visible: 'Visible',
    hidden: 'Hidden',
    uEqualsV: 'Object distance u = image distance v',
    virtualImage: 'Virtual image: upright, same size, laterally inverted',
    minLength: 'Minimum mirror length',
    minBottom: 'Minimum bottom height',
    minTop: 'Mirror top height',
    canSeeFull: 'Full body visible',
    cannotSeeFull: 'Full body NOT visible',
    mirrorBottom: 'Mirror bottom y',
    mirrorLength: 'Mirror length p',
    cloudSpeed: 'Image speed of cloud',
    cloudDistance: 'Image travel distance',
    imageCount: 'Number of images',
    formula: 'Formula',
    moveCloser: 'Move 10 cm closer',
    objectDistance: 'Object distance u',
    objectHeight: 'Object height',
    personHeight: 'Person height',
    eyeHeight: 'Eye height',
    distToMirror: 'Distance to mirror',
    distObjToMirror: 'Object distance to mirror',
    ceilingHeight: 'Ceiling height',
    distLightToWall: 'Light to wall',
    mirrorTop: 'Mirror top',
    distToBackWall: 'Back wall distance',
    mirrorWidth: 'Mirror width',
    cloudHeight: 'Cloud height',
    time: 'Time',
    angle: 'Angle θ',
    wedgeOrientation: 'Rotation φ',
    wedgeHintObject: 'Drag object to move',
    wedgeClearSketch: 'Clear sketches',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomFit: 'Fit',
    zoomScrollHint: 'Scroll to zoom',
    showRays: 'Show rays',
    showImages: 'Show virtual images',
    addObject: 'Add object',
    removeObject: 'Remove object',
    placeObject: 'Click to place',
    toolSelect: 'Select',
    toolMirror: 'Mirror',
    toolObject: 'Object',
    toolImage: 'Image',
    toolObserver: 'Observer',
    toolRealRay: 'Real ray',
    toolVirtualRay: 'Virtual ray',
    deleteSelected: 'Delete',
    gridSnap: 'Grid snap',
    sketchTools: 'Drawing tools',
    sketchGroupPlace: 'Place elements',
    sketchGroupNav: 'Select & move',
    sketchGroupRays: 'Draw rays',
    sketchGroupActions: 'Actions',
    sketchHintSelect: 'Click a line or endpoint; drag to move; Delete key or button to remove',
    sketchHintMarquee: 'Drag to box-select; Shift to add; Delete to remove',
    sketchHintMirror: 'Click two points on the canvas to draw the mirror',
    sketchHintObject: 'Click two points for the object bar (A, B)',
    sketchHintImage: 'Click two points for the virtual image bar (A′, B′)',
    sketchHintObserver: 'Click once to place observer E',
    sketchHintRealRay: 'Click two points for one real ray segment',
    sketchHintVirtualRay: 'Click two points for one virtual ray segment',
    sketchSelected: 'Selected',
    sketchNothingSelected: 'Nothing selected',
    rayColorTitle: 'Ray colours',
    rayColorReal: 'Real ray',
    rayColorVirtual: 'Virtual ray',
    rayColorEditHint: 'Ray selected — tap a swatch to change colour',
    presetsTitle: 'Preset Scenario',
    presetBasic: 'Basic Reflection',
    presetLetterP: 'Letter P Practice',
    presetGround: 'Ground Mirror Practice',
    presetEmpty: 'Empty Canvas',
    observerAsPoint: 'Observer as point',
  },
};

let currentLang = 'zh';

function getLang() { return currentLang; }

/** Map S3_PHY hub locale to lab locale. */
function hubLangToLocal(hubLang) {
  if (hubLang === 'zh-Hant' || hubLang === 'zh') return 'zh';
  return 'en';
}

function initLangFromLocation() {
  const lang = new URLSearchParams(location.search).get('lang');
  if (lang) setLang(hubLangToLocal(lang));
}

function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh';
  document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
  return currentLang;
}

function t(key) {
  const parts = key.split('.');
  let node = STRINGS[currentLang];
  for (const p of parts) {
    node = node?.[p];
  }
  return node ?? key;
}

function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const titleEl = root.querySelector('[data-i18n-title]');
  if (titleEl) titleEl.textContent = t('title');
  document.title = t('title');
}

function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
  applyI18n();
  return currentLang;
}


/* --- imageFormation.js --- */






const defaults = () => ({
  u: 2.0,
  H: 1.6,
  hEye: 1.5,
  moved: false,
});

function createImageFormationScenario() {
  let params = defaults();
  let view = null;
  let animator = new RayAnimator();
  animator.overrideTotalSteps = PLANE_MIRROR_SIGHT_STEPS;

  function compute() {
    const u = params.moved ? params.u - 0.1 : params.u;
    const mirrorX = u;
    const objX = 0;
    const top = { x: objX, y: params.H };
    const foot = { x: objX, y: 0 };
    const eye = { x: objX, y: params.hEye };
    const mirrorLine = { a: { x: mirrorX, y: 0 }, b: { x: mirrorX, y: 3 } };
    const imgTop = reflectPoint(top, mirrorLine.a, mirrorLine.b);
    const imgFoot = reflectPoint(foot, mirrorLine.a, mirrorLine.b);
    const v = mirrorX - objX;
    const rayTop = sightRayVertical(top, eye, mirrorX, 0, 3);
    const rayFoot = sightRayVertical(foot, eye, mirrorX, 0, 3);
    return { u, v, mirrorX, objX, top, foot, eye, imgTop, imgFoot, rayTop, rayFoot };
  }

  function getControls() {
    return [
      { id: 'u', labelKey: 'objectDistance', min: 0.3, max: 4, step: 0.1, value: params.u, unit: 'm' },
      { id: 'H', labelKey: 'objectHeight', min: 1, max: 2, step: 0.05, value: params.H, unit: 'm' },
      { id: 'hEye', labelKey: 'eyeHeight', min: 1, max: 1.9, step: 0.05, value: params.hEye, unit: 'm' },
    ];
  }

  function preset() { params = defaults(); }
  function updateParams(id, value) {
    if (id === 'moved') params.moved = value;
    else params[id] = value;
  }

  function getDescription() {
    return getLang() === 'zh'
      ? '平面鏡成虛像：物距等於像距。物體靠近鏡子時，像亦以相同距離靠近。'
      : 'A plane mirror forms a virtual image with u = v. When the object moves toward the mirror, the image moves the same amount.';
  }

  function getStats(c) {
    const lang = getLang();
    return [
      { label: 'u', value: formatLength(c.u, lang) },
      { label: 'v', value: formatLength(c.v, lang) },
      { label: t('uEqualsV'), value: '✓', ok: true },
    ];
  }

  function getFormula(c) {
    return getLang() === 'zh'
      ? `u = ${c.u.toFixed(2)} m\nv = ${c.v.toFixed(2)} m\n物像距離 = ${(c.u + c.v).toFixed(2)} m`
      : `u = ${c.u.toFixed(2)} m\nv = ${c.v.toFixed(2)} m\nObject–image gap = ${(c.u + c.v).toFixed(2)} m`;
  }

  function init(canvas) {
    view = createWorldView(canvas, {
      worldBounds: { xMin: -0.15, xMax: 4.5, yMin: 0, yMax: 2.2 },
      gridStep: 0.5,
    });
    animator.onUpdate = () => draw(canvas);
  }

  function draw(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    view.worldBounds.xMin = -0.15;
    view.worldBounds.xMax = Math.max(c.mirrorX + c.v + 0.45, c.mirrorX + 0.5);
    view.worldBounds.yMax = Math.max(params.H, params.hEye) + 0.35;
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);
    drawGround(ctx, view, txf);
    drawVerticalMirror(ctx, view, txf, c.mirrorX, 0, 3, COLORS.mirror, 3);
    drawPerson(ctx, view, txf, c.objX, params.H, params.hEye);

    const imgX = c.mirrorX + c.v;
    drawPlaneMirrorSightRays(ctx, view, txf, c, imgX, params.H, params.hEye, animator.stepIndex);

    drawLegend(ctx, 12, 12, [
      { color: getRayColor('real'), text: t('legendReal') },
      { color: getRayColor('virtual'), text: t('legendVirtual'), dashed: true },
    ]);
  }

  return {
    id: 'imageFormation',
    init, draw, compute, getControls, updateParams, preset, getDescription, getStats, getFormula,
    getAnimator: () => animator,
    extraButtons: [{ id: 'moved', labelKey: 'moveCloser', toggle: true }],
  };
}


/* --- minMirrorLength.js --- */





function createMinMirrorLengthScenario() {
  let params = { H: 1.6, hEye: 1.5, d: 2.0 };
  let view = null;
  let animator = new RayAnimator();
  animator.overrideTotalSteps = PLANE_MIRROR_SIGHT_STEPS;

  function compute() {
    const mirrorX = params.d;
    const objX = 0;
    const top = { x: objX, y: params.H };
    const foot = { x: objX, y: 0 };
    const eye = { x: objX, y: params.hEye };
    const req = minMirrorForBody(params.H, params.hEye);
    const rayTop = sightRayVertical(top, eye, mirrorX, 0, 3);
    const rayFoot = sightRayVertical(foot, eye, mirrorX, 0, 3);
    const yTop = rayTop.reflectPt?.y ?? req.top;
    const yBot = rayFoot.reflectPt?.y ?? req.bottom;
    const imgTop = rayTop.image;
    const imgFoot = rayFoot.image;
    return { mirrorX, objX, top, foot, eye, req, yTop, yBot, rayTop, rayFoot, imgTop, imgFoot };
  }

  function getControls() {
    return [
      { id: 'H', labelKey: 'personHeight', min: 1.2, max: 2, step: 0.05, value: params.H, unit: 'm' },
      { id: 'hEye', labelKey: 'eyeHeight', min: 1, max: 1.9, step: 0.05, value: params.hEye, unit: 'm' },
      { id: 'd', labelKey: 'distToMirror', min: 1, max: 4, step: 0.1, value: params.d, unit: 'm' },
    ];
  }

  function preset() { params = { H: 1.6, hEye: 1.5, d: 2.0 }; }
  function updateParams(id, v) { params[id] = v; }

  function getDescription() {
    return getLang() === 'zh'
      ? '（Q21）要看見全身，鏡的最小長度為身高的一半；鏡底在眼高的一半。'
      : '(Q21) Minimum mirror length = half body height; bottom edge at half eye height.';
  }

  function getStats(c) {
    const lang = getLang();
    return [
      { label: t('minLength'), value: formatLength(c.req.length, lang) },
      { label: t('minBottom'), value: formatLength(c.req.bottom, lang) },
      { label: t('minTop'), value: formatLength(c.req.top, lang) },
    ];
  }

  function getFormula(c) {
    return getLang() === 'zh'
      ? `p = H/2 = ${c.req.length.toFixed(2)} m\nq = h/2 = ${c.req.bottom.toFixed(2)} m\n鏡頂 = (H+h)/2 = ${c.req.top.toFixed(2)} m`
      : `p = H/2 = ${c.req.length.toFixed(2)} m\nq = h/2 = ${c.req.bottom.toFixed(2)} m\nTop = (H+h)/2 = ${c.req.top.toFixed(2)} m`;
  }

  function init(canvas) {
    view = createWorldView(canvas, {
      worldBounds: { xMin: -0.15, xMax: 3.5, yMin: 0, yMax: 2.2 },
      gridStep: 0.5,
      horizontalGridScale: 1,
    });
    animator.onUpdate = () => draw(canvas);
  }

  function draw(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    const imgX = c.mirrorX + params.d;
    view.worldBounds.xMin = -0.15;
    view.worldBounds.xMax = imgX + 0.45;
    view.worldBounds.yMax = Math.max(params.H, params.hEye) + 0.35;
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);
    drawGround(ctx, view, txf);
    drawPerson(ctx, view, txf, c.objX, params.H, params.hEye);
    drawVerticalMirror(ctx, view, txf, c.mirrorX, 0, 3, '#3f3f46', 2);
    drawVerticalMirror(ctx, view, txf, c.mirrorX, c.yBot, c.yTop, COLORS.mirrorNeed, 5);

    drawPlaneMirrorSightRays(ctx, view, txf, c, imgX, params.H, params.hEye, animator.stepIndex);
  }

  return {
    id: 'minLength', init, draw, compute, getControls, updateParams, preset, getDescription, getStats, getFormula,
    getAnimator: () => animator,
  };
}


/* --- minMirrorHeight.js --- */




function createMinMirrorHeightScenario() {
  let sub = 'feet';
  let params = {
    feet: { H: 1.7, hEye: 1.5, dEye: 0.8 },
    cockroach: { hEye: 1.5, dEye: 0.8, dObj: 0.4, hObj: 0 },
    mc: { H: 1.8, hEye: 1.7, p: 0.9, q: 0.85 },
  };
  let view = null;
  let animator = new RayAnimator();
  animator.rayCount = 1;

  function getSubTabs() {
    return ['feet', 'cockroach', 'mc'];
  }

  function setSub(s) {
    sub = s;
    animator.rayCount = s === 'mc' ? 2 : 1;
  }

  function compute() {
    if (sub === 'feet') {
      const { hEye, dEye, H } = params.feet;
      const mirrorX = dEye;
      const y = mirrorHeightForFloorObject(dEye, dEye, hEye, 0);
      const eye = { x: 0, y: hEye };
      const foot = { x: 0, y: 0 };
      const ray = sightRayVertical(foot, eye, mirrorX, 0, 3);
      return { mirrorX, eye, foot, y, ray, mode: 'feet', hEye, dEye, H };
    }
    if (sub === 'cockroach') {
      const { hEye, dEye, dObj, hObj } = params.cockroach;
      const mirrorX = dEye;
      const objX = dEye - dObj;
      const y = mirrorHeightForFloorObject(dObj, dEye, hEye, hObj);
      const eye = { x: 0, y: hEye };
      const obj = { x: objX, y: hObj };
      const ray = sightRayVertical(obj, eye, mirrorX, 0, 3);
      return { mirrorX, eye, obj, y, ray, mode: 'cockroach', hEye, dEye, dObj, hObj, objX, H: hEye };
    }
    const { H, hEye, p, q } = params.mc;
    const mirrorX2 = 1.5;
    const req = canSeeFullBody(H, hEye, p, q);
    const top = { x: 0, y: H };
    const foot = { x: 0, y: 0 };
    const eye = { x: 0, y: hEye };
    const yTop = q + p;
    const rayTop = sightRayVertical(top, eye, mirrorX2, q, yTop);
    const rayFoot = sightRayVertical(foot, eye, mirrorX2, q, yTop);
    const hitTop = rayTop.ok && rayTop.reflectPt.y <= yTop + 1e-6 && rayTop.reflectPt.y >= q - 1e-6;
    const hitFoot = rayFoot.ok && rayFoot.reflectPt.y >= q - 1e-6 && rayFoot.reflectPt.y <= yTop + 1e-6;
    const ok = req.ok && hitTop && hitFoot;
    return { mirrorX: mirrorX2, eye, top, foot, p, q, yTop, req: { ...req, ok }, rayTop, rayFoot, mode: 'mc', H, hEye, hitTop, hitFoot };
  }

  function getControls() {
    if (sub === 'feet') {
      const p = params.feet;
      return [
        { id: 'H', labelKey: 'personHeight', min: 1.4, max: 2, step: 0.05, value: p.H, unit: 'm' },
        { id: 'hEye', labelKey: 'eyeHeight', min: 1.2, max: 1.9, step: 0.05, value: p.hEye, unit: 'm' },
        { id: 'dEye', labelKey: 'distToMirror', min: 0.4, max: 2, step: 0.05, value: p.dEye, unit: 'm' },
      ];
    }
    if (sub === 'cockroach') {
      const p = params.cockroach;
      return [
        { id: 'hEye', labelKey: 'eyeHeight', min: 1.2, max: 1.8, step: 0.05, value: p.hEye, unit: 'm' },
        { id: 'dEye', labelKey: 'distToMirror', min: 0.4, max: 2, step: 0.05, value: p.dEye, unit: 'm' },
        { id: 'dObj', labelKey: 'distObjToMirror', min: 0.1, max: 1.5, step: 0.05, value: p.dObj, unit: 'm' },
        { id: 'hObj', labelKey: 'objectHeight', min: 0, max: 0.4, step: 0.02, value: p.hObj, unit: 'm' },
      ];
    }
    const p = params.mc;
    return [
      { id: 'H', labelKey: 'personHeight', min: 1.5, max: 2, step: 0.05, value: p.H, unit: 'm' },
      { id: 'hEye', labelKey: 'eyeHeight', min: 1.4, max: 1.9, step: 0.05, value: p.hEye, unit: 'm' },
      { id: 'p', labelKey: 'mirrorLength', min: 0.5, max: 1.2, step: 0.01, value: p.p, unit: 'm' },
      { id: 'q', labelKey: 'mirrorBottom', min: 0.5, max: 1.2, step: 0.01, value: p.q, unit: 'm' },
    ];
  }

  function updateParams(id, v) {
    params[sub][id] = v;
    if (sub === 'feet') {
      if (params.feet.hEye > params.feet.H) params.feet.H = params.feet.hEye;
      if (params.feet.H < params.feet.hEye) params.feet.hEye = params.feet.H;
    }
    if (sub === 'mc' && id === 'hEye' && v > params.mc.H) params.mc.H = v;
    if (sub === 'mc' && id === 'H' && v < params.mc.hEye) params.mc.hEye = v;
  }

  function preset() {
    params = {
      feet: { H: 1.7, hEye: 1.5, dEye: 0.8 },
      cockroach: { hEye: 1.5, dEye: 0.8, dObj: 0.4, hObj: 0 },
      mc: { H: 1.8, hEye: 1.7, p: 0.9, q: 0.85 },
    };
  }

  function getDescription() {
    const c = compute();
    if (sub === 'feet') {
      return getLang() === 'zh'
        ? `（Q22a）全等三角形：鏡底 y = ${c.y.toFixed(2)} m（眼高 ${c.hEye.toFixed(2)} m，身高 ${c.H.toFixed(2)} m）`
        : `(Q22a) Congruent triangles: mirror bottom y = ${c.y.toFixed(2)} m (eye ${c.hEye.toFixed(2)} m, height ${c.H.toFixed(2)} m)`;
    }
    if (sub === 'cockroach') {
      return getLang() === 'zh'
        ? `（Q22b）相似三角形：y = ${c.y.toFixed(2)} m（物件高 ${c.hObj.toFixed(2)} m）`
        : `(Q22b) Similar triangles: y = ${c.y.toFixed(2)} m (object height ${c.hObj.toFixed(2)} m)`;
    }
    return getLang() === 'zh' ? '（Q17）最小要求 p=90 cm, q=85 cm（選 B）' : '(Q17) Minimum p=90 cm, q=85 cm (answer B)';
  }

  function getStats(c) {
    const lang = getLang();
    if (c.mode === 'mc') {
      return [
        { label: t('mirrorLength'), value: formatLength(c.p, lang) },
        { label: t('mirrorBottom'), value: formatLength(c.q, lang) },
        { label: t(c.req.ok ? 'canSeeFull' : 'cannotSeeFull'), value: c.req.ok ? '✓' : '✗', ok: c.req.ok, fail: !c.req.ok },
      ];
    }
    return [{ label: t('mirrorBottom'), value: formatLength(c.y, lang) }];
  }

  function getFormula(c) {
    if (c.mode === 'feet') {
      return getLang() === 'zh'
        ? `2y = h → y = ${c.y.toFixed(2)} m`
        : `2y = h_eye → y = ${c.y.toFixed(2)} m`;
    }
    if (c.mode === 'cockroach') {
      return getLang() === 'zh'
        ? `y/(h−y) = d_obj/d_eye\ny = ${c.y.toFixed(2)} m`
        : `y/(h−y) = d_obj/d_eye\ny = ${c.y.toFixed(2)} m`;
    }
    const req = minMirrorForBody(c.H, c.hEye);
    return getLang() === 'zh'
      ? `需要 p ≥ ${(req.minP * 100).toFixed(0)} cm\n需要 q ≥ ${(req.minQ * 100).toFixed(0)} cm`
      : `Need p ≥ ${(req.minP * 100).toFixed(0)} cm, q ≥ ${(req.minQ * 100).toFixed(0)} cm`;
  }

  function init(canvas) {
    view = createWorldView(canvas, {
      worldBounds: { xMin: -0.15, xMax: 2.2, yMin: 0, yMax: 2 },
      gridStep: 0.5,
    });
    animator.onUpdate = () => draw(canvas);
  }

  function fitViewBounds(c) {
    const topY = c.mode === 'feet' ? c.H : c.mode === 'cockroach' ? c.hEye : c.H;
    view.worldBounds.xMin = -0.15;
    view.worldBounds.xMax = c.mirrorX + 0.55;
    view.worldBounds.yMax = Math.max(topY, c.hEye ?? 0) + 0.35;
  }

  function draw(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    fitViewBounds(c);
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);
    drawGround(ctx, view, txf);

    const stepIndex = animator.stepIndex;
    const helpers = {
      drawArrow: (from, to, opts) => drawArrow(ctx, view, txf, from, to, opts),
      drawImageLine: () => {},
      drawPoint: (p, col) => drawPoint(ctx, view, txf, p, 5, col || COLORS.object),
    };

    if (c.mode === 'feet') {
      drawPerson(ctx, view, txf, 0, c.H, c.hEye);
      drawVerticalMirror(ctx, view, txf, c.mirrorX, c.y, c.y + 1.5, COLORS.mirrorNeed, 5);
      const rp = { x: c.mirrorX, y: c.y };
      const s0 = { x: txf.ox + rp.x * txf.pxPerM, y: txf.oy - rp.y * txf.pxPerM };
      const s1 = { x: txf.ox + (c.mirrorX + 0.4) * txf.pxPerM, y: s0.y };
      ctx.strokeStyle = COLORS.mirrorNeed;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(s0.x, s0.y);
      ctx.lineTo(s1.x, s1.y);
      ctx.stroke();
      ctx.setLineDash([]);
      const ray = { objectPt: c.foot, eye: c.eye, image: c.ray.image, reflectPt: rp };
      RayAnimator.drawSightRay(ctx, view, txf, helpers, ray, stepIndex, 0, 1);
    } else if (c.mode === 'cockroach') {
      drawPerson(ctx, view, txf, 0, c.hEye, c.hEye);
      if (c.hObj > 0.01) {
        drawArrow(ctx, view, txf, { x: c.objX, y: 0 }, { x: c.objX, y: c.hObj }, {
          color: '#fbbf24', width: 3, head: true,
        });
      } else {
        drawPoint(ctx, view, txf, c.obj, 6, '#fbbf24', getLang() === 'zh' ? '蟲' : 'Bug');
      }
      drawVerticalMirror(ctx, view, txf, c.mirrorX, c.y, c.y + 1.5, COLORS.mirrorNeed, 5);
      const rp = { x: c.mirrorX, y: c.y };
      const ray = { objectPt: c.obj, eye: c.eye, image: c.ray.image, reflectPt: rp };
      RayAnimator.drawSightRay(ctx, view, txf, helpers, ray, stepIndex, 0, 1);
    } else {
      animator.rayCount = 2;
      drawPerson(ctx, view, txf, 0, c.H, c.hEye);
      const failTop = !c.hitTop;
      const failFoot = !c.hitFoot;
      drawVerticalMirror(ctx, view, txf, c.mirrorX, c.q, c.yTop, c.req.ok ? COLORS.mirrorNeed : COLORS.mirrorFail, 5);
      const rays = [
        { objectPt: c.top, eye: c.eye, image: c.rayTop.image, reflectPt: c.rayTop.reflectPt || { x: c.mirrorX, y: c.yTop } },
        { objectPt: c.foot, eye: c.eye, image: c.rayFoot.image, reflectPt: c.rayFoot.reflectPt || { x: c.mirrorX, y: c.q } },
      ];
      rays.forEach((ray, i) => RayAnimator.drawSightRay(ctx, view, txf, helpers, ray, stepIndex, i, 2, i === 0 ? !c.hitTop : !c.hitFoot));
    }
  }

  return {
    id: 'minHeight', init, draw, compute, getControls, updateParams, preset, getDescription, getStats, getFormula,
    getAnimator: () => animator, getSubTabs, setSub,
  };
}


/* --- seeBackObject.js --- */





const CONSTRUCTION_STEPS = 2;

function drawRightTriangle(ctx, view, txf, a, b, c, fill, stroke) {
  const toS = (p) => ({ x: txf.ox + p.x * txf.pxPerM, y: txf.oy - p.y * txf.pxPerM });
  const sa = toS(a); const sb = toS(b); const sc = toS(c);
  ctx.beginPath();
  ctx.moveTo(sa.x, sa.y);
  ctx.lineTo(sb.x, sb.y);
  ctx.lineTo(sc.x, sc.y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
}

function drawDimLabel(ctx, txf, from, to, text, offset = { x: 0, y: 0 }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const sx = txf.ox + mx * txf.pxPerM + offset.x;
  const sy = txf.oy - my * txf.pxPerM + offset.y;
  drawLabel(ctx, sx, sy, text, '#fbbf24');
}

/** Small triangle at eye: d_eye (horizontal) and h (vertical below eye level). */
function drawCeilingSmallTriangle(ctx, view, txf, c) {
  const { eye, mirrorY, dEye } = c;
  const hBelow = mirrorY - c.hEye;
  const foot = { x: 0, y: c.hEye };
  const reflect = { x: 0, y: mirrorY };

  drawRightTriangle(ctx, view, txf, eye, foot, reflect, 'rgba(255,204,0,0.14)', 'rgba(255,204,0,0.85)');
  const dash = { dashed: true, color: 'rgba(255,204,0,0.75)', width: 1 };
  drawArrow(ctx, view, txf, eye, foot, dash);
  drawArrow(ctx, view, txf, foot, reflect, dash);

  const lang = getLang();
  drawDimLabel(ctx, txf, eye, foot, lang === 'zh' ? `d眼=${dEye}` : `d=${dEye}`, { x: 0, y: 14 });
  drawDimLabel(ctx, txf, foot, reflect, `h=${hBelow.toFixed(2)}`, { x: 12, y: 0 });
}

/** Large similar triangle from E to image L′: base d_eye+d_light, height Δh. */
function drawCeilingLargeTriangle(ctx, view, txf, c) {
  const { eye, image, dEye, dLight, hEye, hCeiling } = c;
  const dh = hCeiling - hEye;
  const underImage = { x: image.x, y: hEye };

  drawRightTriangle(ctx, view, txf, eye, underImage, image, 'rgba(167,139,250,0.14)', 'rgba(167,139,250,0.7)');
  const dash = { dashed: true, color: 'rgba(167,139,250,0.7)', width: 1 };
  drawArrow(ctx, view, txf, eye, underImage, dash);
  drawArrow(ctx, view, txf, underImage, image, dash);

  const lang = getLang();
  drawDimLabel(ctx, txf, eye, underImage, lang === 'zh' ? `d眼+d燈` : `dₑ+dₗ`, { x: 0, y: 14 });
  drawDimLabel(ctx, txf, underImage, image, `Δh=${dh.toFixed(2)}`, { x: 14, y: 0 });
}

function drawSpiderSmallTriangle(ctx, view, txf, c) {
  const { eye, mirrorTop, hEye, dEye } = c;
  const dy = mirrorTop - hEye;
  const foot = { x: 0, y: hEye };
  const top = { x: 0, y: mirrorTop };

  drawRightTriangle(ctx, view, txf, eye, foot, top, 'rgba(255,204,0,0.14)', 'rgba(255,204,0,0.85)');
  const dash = { dashed: true, color: 'rgba(255,204,0,0.75)', width: 1 };
  drawArrow(ctx, view, txf, eye, foot, dash);
  drawArrow(ctx, view, txf, foot, top, dash);

  const lang = getLang();
  drawDimLabel(ctx, txf, eye, foot, lang === 'zh' ? `d眼=${dEye}` : `d=${dEye}`, { x: 0, y: 14 });
  drawDimLabel(ctx, txf, foot, top, dy.toFixed(2), { x: 12, y: 0 });
}

function drawSpiderLargeTriangle(ctx, view, txf, c) {
  const { eye, image, hEye, dEye, dWall, maxH } = c;
  const totalBase = 2 * dEye + dWall;
  const underImage = { x: image.x, y: hEye };

  drawRightTriangle(ctx, view, txf, eye, underImage, image, 'rgba(167,139,250,0.14)', 'rgba(167,139,250,0.7)');
  const dash = { dashed: true, color: 'rgba(167,139,250,0.7)', width: 1 };
  drawArrow(ctx, view, txf, eye, underImage, dash);
  drawArrow(ctx, view, txf, underImage, image, dash);

  const lang = getLang();
  drawDimLabel(ctx, txf, eye, underImage, lang === 'zh' ? `2d眼+牆距` : `2d+dW`, { x: 0, y: 14 });
  drawDimLabel(ctx, txf, underImage, image, lang === 'zh' ? `h−眼高` : `h−eye`, { x: 14, y: 0 });
}

function createSeeBackObjectScenario() {
  let sub = 'ceiling';
  let params = {
    ceiling: { hEye: 1.5, dEye: 1.5, dLight: 3, hCeiling: 2.5 },
    spider: { hEye: 1.6, dEye: 1.0, mirrorTop: 1.8, dWall: 3.0 },
  };
  let view = null;
  let canvasRef = null;
  let animator = new RayAnimator();
  animator.rayCount = 1;
  animator.extraSteps = CONSTRUCTION_STEPS;

  function getSubTabs() { return ['ceiling', 'spider']; }
  function setSub(s) {
    sub = s;
    if (canvasRef?.isConnected) {
      animator.reset();
    } else {
      animator.pause();
      animator.stepIndex = 0;
    }
  }

  function teardown() {
    canvasRef = null;
  }

  function updateWorldBounds(c) {
    if (c.mode === 'ceiling') {
      view.worldBounds = {
        xMin: -c.dLight - 1,
        xMax: c.dLight + c.dEye + 0.5,
        yMin: 0,
        yMax: Math.max(c.hCeiling, c.mirrorY) + 0.5,
      };
    } else {
      const backX = -(c.dEye + c.dWall);
      view.worldBounds = {
        xMin: backX - 0.5,
        xMax: 2 * c.dEye + c.dWall + 0.5,
        yMin: 0,
        yMax: Math.max(c.maxH, c.mirrorTop) + 0.5,
      };
    }
  }

  function compute() {
    if (sub === 'ceiling') {
      const { hEye, dEye, dLight, hCeiling } = params.ceiling;
      const mirrorX = 0;
      const mirrorY = mirrorHeightForCeilingLight(dLight, dEye, hCeiling, hEye);
      const eye = { x: -dEye, y: hEye };
      const light = { x: -dLight, y: hCeiling };
      const image = { x: dLight, y: hCeiling };
      const reflectPt = virtualSightOnVerticalMirror(image, eye, mirrorX, 0, 3);
      return { mirrorX, eye, light, image, mirrorY, reflectPt, hEye, dEye, dLight, hCeiling, mode: 'ceiling' };
    }
    const { hEye, dEye, mirrorTop, dWall } = params.spider;
    const mirrorX = 0;
    const maxH = maxHeightOnBackWall(dEye, dWall, hEye, mirrorTop);
    const eye = { x: -dEye, y: hEye };
    const backWallX = -(dEye + dWall);
    const spider = { x: backWallX, y: maxH };
    const image = { x: dEye + dWall, y: maxH };
    const reflectPt = { x: mirrorX, y: mirrorTop };
    return { mirrorX, eye, spider, image, mirrorTop, maxH, reflectPt, hEye, dEye, dWall, backWallX, mode: 'spider' };
  }

  function getControls() {
    if (sub === 'ceiling') {
      const p = params.ceiling;
      return [
        { id: 'hEye', labelKey: 'eyeHeight', min: 1, max: 2, step: 0.05, value: p.hEye, unit: 'm' },
        { id: 'dEye', labelKey: 'distToMirror', min: 0.5, max: 3, step: 0.1, value: p.dEye, unit: 'm' },
        { id: 'dLight', labelKey: 'distLightToWall', min: 1, max: 5, step: 0.1, value: p.dLight, unit: 'm' },
        { id: 'hCeiling', labelKey: 'ceilingHeight', min: 2, max: 3.5, step: 0.05, value: p.hCeiling, unit: 'm' },
      ];
    }
    const p = params.spider;
    return [
      { id: 'hEye', labelKey: 'eyeHeight', min: 1.2, max: 2, step: 0.05, value: p.hEye, unit: 'm' },
      { id: 'dEye', labelKey: 'distToMirror', min: 0.5, max: 2, step: 0.1, value: p.dEye, unit: 'm' },
      { id: 'mirrorTop', labelKey: 'mirrorTop', min: 1.4, max: 2.5, step: 0.05, value: p.mirrorTop, unit: 'm' },
      { id: 'dWall', labelKey: 'distToBackWall', min: 1, max: 5, step: 0.1, value: p.dWall, unit: 'm' },
    ];
  }

  function updateParams(id, v) { params[sub][id] = v; }
  function preset() {
    params = {
      ceiling: { hEye: 1.5, dEye: 1.5, dLight: 3, hCeiling: 2.5 },
      spider: { hEye: 1.6, dEye: 1.0, mirrorTop: 1.8, dWall: 3.0 },
    };
    animator.extraSteps = CONSTRUCTION_STEPS;
  }

  function getDescription() {
    if (sub === 'ceiling') return getLang() === 'zh' ? '（Q23）鏡最小高度 ≈ 1.83 m' : '(Q23) Minimum mirror height ≈ 1.83 m';
    return getLang() === 'zh' ? '（Q24）可見蜘蛛最大高度 h = 2.6 m' : '(Q24) Maximum visible height h = 2.6 m';
  }

  function getStats(c) {
    const lang = getLang();
    if (c.mode === 'ceiling') {
      return [{ label: getLang() === 'zh' ? '鏡高度' : 'Mirror height', value: formatLength(c.mirrorY, lang) }];
    }
    return [{ label: getLang() === 'zh' ? '最大可見高度' : 'Max visible h', value: formatLength(c.maxH, lang) }];
  }

  function getFormula(c) {
    if (c.mode === 'ceiling') {
      return getLang() === 'zh'
        ? 'h/d眼 = 1/(d眼+d燈)\nh = 0.33 m\n鏡高 = 1.5+0.33 = 1.83 m'
        : 'h/dₑ = 1/(dₑ+dₗ) → mirror at 1.83 m';
    }
    return getLang() === 'zh'
      ? '0.2/1 = (h−1.6)/5\nh = 2.6 m'
      : '0.2/1 = (h−1.6)/5 → h = 2.6 m';
  }

  function init(canvas) {
    canvasRef = canvas;
    view = createWorldView(canvas, {
      worldBounds: sub === 'ceiling' ? { xMin: -5, xMax: 5, yMin: 0, yMax: 3 } : { xMin: -6, xMax: 6, yMin: 0, yMax: 3.2 },
    });
    animator.onUpdate = () => {
      if (canvasRef) draw(canvasRef);
    };
  }

  function drawConstruction(ctx, view, txf, c, stepIndex) {
    const rayDone = STEPS_PER_RAY;
    const showSmall = stepIndex >= rayDone + 1;
    const showLarge = stepIndex >= rayDone + 2;
    if (!showSmall && !showLarge) return;

    if (c.mode === 'ceiling') {
      if (showSmall) drawCeilingSmallTriangle(ctx, view, txf, c);
      if (showLarge) drawCeilingLargeTriangle(ctx, view, txf, c);
    } else {
      if (showSmall) drawSpiderSmallTriangle(ctx, view, txf, c);
      if (showLarge) drawSpiderLargeTriangle(ctx, view, txf, c);
    }
  }

  function draw(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    updateWorldBounds(c);
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);
    drawGround(ctx, view, txf);

    const stepIndex = animator.stepIndex;
    const helpers = {
      drawArrow: (from, to, opts) => drawArrow(ctx, view, txf, from, to, opts),
      drawImageLine: (from, to) => drawArrow(ctx, view, txf, from, to, { dashed: true, color: getRayColor('virtual'), width: 1 }),
      drawPoint: (p, col) => drawPoint(ctx, view, txf, p, 5, col),
    };

    if (c.mode === 'ceiling') {
      drawWall(ctx, view, txf, c.light.x, 0, c.hCeiling);
      drawVerticalMirror(ctx, view, txf, c.mirrorX, 0, c.mirrorY, COLORS.mirrorNeed, 5);
      drawPoint(ctx, view, txf, c.eye, 6, COLORS.eye, 'E');
      drawPoint(ctx, view, txf, c.light, 7, '#fbbf24', 'L');
      drawPoint(ctx, view, txf, c.image, 6, COLORS.image, "L'");
      if (c.reflectPt) {
        const ray = { objectPt: c.light, eye: c.eye, image: c.image, reflectPt: c.reflectPt };
        RayAnimator.drawSightRay(ctx, view, txf, helpers, ray, stepIndex, 0, 1);
      }
      drawConstruction(ctx, view, txf, c, stepIndex);
    } else {
      drawVerticalMirror(ctx, view, txf, c.mirrorX, 0, c.mirrorTop + 0.3, COLORS.mirror, 3);
      drawWall(ctx, view, txf, c.backWallX, 0, 3);
      drawPoint(ctx, view, txf, c.eye, 6, COLORS.eye, 'E');
      drawPoint(ctx, view, txf, c.spider, 7, '#ef4444', 'S');
      drawPoint(ctx, view, txf, c.image, 6, COLORS.image, "S'");
      const ray = { objectPt: c.spider, eye: c.eye, image: c.image, reflectPt: c.reflectPt };
      RayAnimator.drawSightRay(ctx, view, txf, helpers, ray, stepIndex, 0, 1);
      drawConstruction(ctx, view, txf, c, stepIndex);
    }
  }

  return {
    id: 'seeBack', init, draw, compute, getControls, updateParams, preset, teardown,
    getDescription, getStats, getFormula,
    getAnimator: () => animator, getSubTabs, setSub,
  };
}


/* --- angledMirrors.js --- */





const MIRROR_LEN = 3.5;
const HIT_PX = 18;
const THETA_VALUES = [30, 36, 40, 45, 60, 72, 90];
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3.0;
const ZOOM_STEP = 1.15;

const SKETCH_TOOLS = ['object', 'observer', 'realRay', 'virtualRay'];
const SKETCH_TOOL_META = {
  object: { icon: '▮', hintKey: 'wedgeHintObject', labelKey: 'toolObject' },
  observer: { icon: '◎', hintKey: 'sketchHintObserver', labelKey: 'toolObserver' },
  realRay: { icon: '→', hintKey: 'sketchHintRealRay', labelKey: 'toolRealRay', cls: 'tool-ray' },
  virtualRay: { icon: '⇢', hintKey: 'sketchHintVirtualRay', labelKey: 'toolVirtualRay', cls: 'tool-virtual' },
};

/** Total animation steps: X/Z use 2 each; i≥2 uses 5 (primary 3 + alt 2). */
function wedgeTotalSteps(n) {
  if (n < 2) return 2 * n;
  if (n === 2) return 4;
  return 4 + 5 * (n - 2);
}

function buildWedgeSchedule(n) {
  const steps = [];
  for (let i = 0; i < n; i++) {
    if (i >= 2) steps.push({ type: 'mirror', imageIdx: i, alt: false });
    steps.push({ type: 'image', imageIdx: i });
    steps.push({ type: 'ray', imageIdx: i, alt: false });
    if (i >= 2) {
      steps.push({ type: 'mirror', imageIdx: i, alt: true });
      steps.push({ type: 'ray', imageIdx: i, alt: true });
    }
  }
  return steps;
}

/** Which mirrors / images / rays are visible at a given stepIndex. */
function getVisibility(stepIndex, n, showAll) {
  const mirrors = new Set();
  const altMirrors = new Set();
  const images = new Set();
  const rays = new Set();
  const altRays = new Set();
  const schedule = buildWedgeSchedule(n);
  if (showAll) {
    for (let i = 0; i < n; i++) {
      if (i >= 2) mirrors.add(i);
      if (i >= 2) altMirrors.add(i);
      images.add(i);
      rays.add(i);
      if (i >= 2) altRays.add(i);
    }
    return { mirrors, altMirrors, images, rays, altRays };
  }
  for (let s = 0; s < schedule.length && s < stepIndex; s++) {
    const step = schedule[s];
    const { imageIdx: i, alt } = step;
    if (step.type === 'mirror') {
      if (alt) altMirrors.add(i);
      else mirrors.add(i);
    } else if (step.type === 'image') {
      images.add(i);
    } else if (step.type === 'ray') {
      if (alt) altRays.add(i);
      else rays.add(i);
    }
  }
  return { mirrors, altMirrors, images, rays, altRays };
}

/** Step just revealed at stepIndex (1-based completed count). */
function getActiveStep(stepIndex, n, showAll) {
  if (showAll || stepIndex <= 0) return null;
  const schedule = buildWedgeSchedule(n);
  if (stepIndex > schedule.length) return schedule[schedule.length - 1] ?? null;
  return schedule[stepIndex - 1] ?? null;
}

/** Mirror segment to pulse-highlight for the current animation step. */
function resolveHighlightMirror(step, set, c) {
  if (!step) return null;
  const i = step.imageIdx;
  const img = set.images[i];
  if (!img) return null;

  if (step.alt) {
    if (!img.altConstruction) return null;
    const m = img.altConstruction.mirror;
    return {
      a: m.a,
      b: m.b,
      virtual: true,
      mirrorSide: img.altConstruction.mirrorSide,
    };
  }

  if (i < 2) {
    const side = img.mirrorSide;
    const real = side === 1 ? c.m1 : c.m2;
    return { a: real.a, b: real.b, virtual: false, mirrorSide: side };
  }

  if (step.type === 'mirror' || step.type === 'ray' || step.type === 'image') {
    return {
      a: img.mirror.a,
      b: img.mirror.b,
      virtual: true,
      mirrorSide: img.mirrorSide,
    };
  }
  return null;
}

function drawMirrorHighlight(ctx, txf, a, b, { virtual, pulse }) {
  const s0 = { x: txf.ox + a.x * txf.pxPerM, y: txf.oy - a.y * txf.pxPerM };
  const s1 = { x: txf.ox + b.x * txf.pxPerM, y: txf.oy - b.y * txf.pxPerM };
  const glowW = 8 + 4 * pulse;
  const coreW = 3 + 2 * pulse;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255,220,80,0.55)';
  ctx.shadowBlur = 3 + 5 * pulse;
  ctx.strokeStyle = `rgba(255,255,255,${0.2 + 0.25 * pulse})`;
  ctx.lineWidth = glowW + 3;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(s0.x, s0.y);
  ctx.lineTo(s1.x, s1.y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(255,204,0,${0.35 + 0.35 * pulse})`;
  ctx.lineWidth = glowW;
  if (virtual) ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(s0.x, s0.y);
  ctx.lineTo(s1.x, s1.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = coreW;
  if (virtual) ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(s0.x, s0.y);
  ctx.lineTo(s1.x, s1.y);
  ctx.stroke();
  ctx.setLineDash([]);
  const tipR = 4 + 2 * pulse;
  ctx.fillStyle = `rgba(255,204,0,${0.35 + 0.35 * pulse})`;
  ctx.beginPath();
  ctx.arc(s1.x, s1.y, tipR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/** Short mirror endpoint for fit bounds (avoids zooming out for full MIRROR_LEN). */
function mirrorFitPoint(pt) {
  const dist = Math.hypot(pt.x, pt.y);
  if (dist < 1e-6) return { ...pt };
  const len = Math.min(MIRROR_LEN, dist * 0.6);
  return { x: (pt.x / dist) * len, y: (pt.y / dist) * len };
}

function defaultObjectInWedge(index, orientationDeg) {
  const r = 1.1 + index * 0.2;
  const phi = deg2rad(orientationDeg);
  return { x: r * Math.cos(phi), y: r * Math.sin(phi) };
}

function thetaIndex(theta) {
  const i = THETA_VALUES.indexOf(theta);
  return i >= 0 ? i : THETA_VALUES.indexOf(45);
}

/** Keep object inside the wedge (2D polar clamp in local frame). */
function constrainInWedge(pt, thetaDeg, phiRad, minR = 0.35, maxR = 2.8) {
  const half = deg2rad(thetaDeg) / 2;
  const margin = deg2rad(3);
  const local = Vec2.rot(pt, -phiRad);
  let r = Math.hypot(local.x, local.y);
  let ang = Math.atan2(local.y, local.x);
  ang = clamp(ang, -half + margin, half - margin);
  r = clamp(r, minR, maxR);
  const localClamped = { x: r * Math.cos(ang), y: r * Math.sin(ang) };
  return Vec2.rot(localClamped, phiRad);
}

function isInsideWedge(pt, thetaDeg, phiRad, minR = 0.2) {
  const half = deg2rad(thetaDeg) / 2;
  const local = Vec2.rot(pt, -phiRad);
  if (Math.hypot(local.x, local.y) < minR) return false;
  const ang = Math.atan2(local.y, local.x);
  return Math.abs(ang) < half - deg2rad(2);
}

function createAngledMirrorsScenario() {
  let params = { theta: 45, orientation: 0, showRays: true, showImages: true };
  let view = null;
  let objects = [];
  let nextObjId = 1;
  let dragTarget = null;
  let draggingObjectId = null;
  let canvasRef = null;
  let placeMode = false;
  let sketchTool = 'object';
  let observers = [];
  let sketchRays = [];
  let rayPending = null;
  let nextSketchId = 1;
  let cursorWorld = null;
  let refreshToolbarRef = null;
  let refreshZoomLabelRef = null;
  let highlightRaf = null;
  let zoomFactor = 1;
  let pointerHandlers = null;
  const animator = new RayAnimator();
  animator.rayCount = 1;

  function cancelHighlightRaf() {
    if (highlightRaf !== null) {
      cancelAnimationFrame(highlightRaf);
      highlightRaf = null;
    }
  }

  function scheduleHighlightPulse(canvas) {
    if (highlightRaf !== null) return;
    highlightRaf = requestAnimationFrame(() => {
      highlightRaf = null;
      if (canvasRef === canvas) draw(canvas);
    });
  }

  function nid() { return nextSketchId++; }

  function clearSketch() {
    observers = [];
    sketchRays = [];
    rayPending = null;
  }

  function syncAnimator(c) {
    const n = c.nFormula;
    animator.stepsPerRay = wedgeTotalSteps(n);
    if (animator.stepIndex > animator.totalSteps) {
      animator.stepIndex = animator.totalSteps;
    }
  }

  function resetAnimation() {
    cancelHighlightRaf();
    animator.reset();
  }

  function replayAnimation() {
    cancelHighlightRaf();
    animator.reset();
    animator.play();
  }

  function makeObject(index) {
    const pt = defaultObjectInWedge(index, params.orientation);
    const label = index === 0 ? 'O' : `O${index + 1}`;
    return { id: nextObjId++, label, x: pt.x, y: pt.y };
  }

  function resetObjects() {
    nextObjId = 1;
    objects = [makeObject(0)];
  }

  function compute() {
    const theta = deg2rad(params.theta);
    const half = theta / 2;
    const phi = deg2rad(params.orientation);
    const apex = { x: 0, y: 0 };
    const m1 = {
      a: apex,
      b: Vec2.rot({ x: MIRROR_LEN * Math.cos(half), y: MIRROR_LEN * Math.sin(half) }, phi),
    };
    const m2 = {
      a: apex,
      b: Vec2.rot({ x: MIRROR_LEN * Math.cos(-half), y: MIRROR_LEN * Math.sin(-half) }, phi),
    };
    const objectSets = objects.map((obj) => {
      const localObj = Vec2.rot(obj, -phi);
      const { images } = imagesInWedge(theta, localObj, 12);
      const worldImages = images.map((im) => {
        const parentLocal = im.parentIdx < 0
          ? localObj
          : images[im.parentIdx].pt;
        const world = {
          ...im,
          pt: Vec2.rot(im.pt, phi),
          parentPt: Vec2.rot(parentLocal, phi),
          mirror: {
            a: apex,
            b: Vec2.rot({
              x: MIRROR_LEN * Math.cos(im.mirrorAngle),
              y: MIRROR_LEN * Math.sin(im.mirrorAngle),
            }, phi),
          },
        };
        if (im.altConstruction) {
          const altParentLocal = images[im.altConstruction.parentIdx].pt;
          world.altConstruction = {
            ...im.altConstruction,
            parentPt: Vec2.rot(altParentLocal, phi),
            mirror: {
              a: apex,
              b: Vec2.rot({
                x: MIRROR_LEN * Math.cos(im.altConstruction.mirrorAngle),
                y: MIRROR_LEN * Math.sin(im.altConstruction.mirrorAngle),
              }, phi),
            },
          };
        }
        return world;
      });
      return { object: obj, images: worldImages };
    });
    const nFormula = Math.round(360 / params.theta) - 1;
    return { theta, half, phi, m1, m2, objectSets, nFormula };
  }

  function clampZoom(z) {
    return clamp(z, ZOOM_MIN, ZOOM_MAX);
  }

  function setZoom(next) {
    zoomFactor = clampZoom(next);
    if (view) view.zoomFactor = zoomFactor;
    refreshZoomLabelRef?.();
    canvasRef && draw(canvasRef);
  }

  function resetZoom() {
    zoomFactor = 1;
    if (view) view.zoomFactor = 1;
    refreshZoomLabelRef?.();
  }

  function adjustZoom(direction) {
    setZoom(direction > 0 ? zoomFactor * ZOOM_STEP : zoomFactor / ZOOM_STEP);
  }

  function fitBounds(c) {
    const pad = Math.max(0.45, 1.0 - c.nFormula * 0.08);
    const pts = [{ x: 0, y: 0 }];
    c.objectSets.forEach((set) => {
      pts.push(set.object);
      set.images.forEach((im, idx) => {
        pts.push(im.pt);
        if (idx >= 2) pts.push(mirrorFitPoint(im.pt));
        if (im.altConstruction) pts.push(mirrorFitPoint(im.pt));
      });
    });
    observers.forEach((o) => pts.push(o.pt));
    sketchRays.forEach((r) => { pts.push(r.from, r.to); });
    pts.push(c.m1.b, c.m2.b);
    let xMin = 0; let xMax = 1; let yMin = 0; let yMax = 1;
    pts.forEach((p) => {
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    });
    view.worldBounds = {
      xMin: xMin - pad,
      xMax: xMax + pad,
      yMin: yMin - pad,
      yMax: yMax + pad,
    };
  }

  function getControls() {
    return [
      {
        id: 'theta',
        labelKey: 'angle',
        min: 0,
        max: THETA_VALUES.length - 1,
        step: 1,
        value: thetaIndex(params.theta),
        unit: '°',
        valueMap: THETA_VALUES,
      },
      {
        id: 'orientation',
        labelKey: 'wedgeOrientation',
        min: -180,
        max: 180,
        step: 5,
        value: params.orientation,
        unit: '°',
      },
    ];
  }

  function preset() {
    params = { theta: 45, orientation: 0, showRays: true, showImages: true };
    placeMode = false;
    sketchTool = 'object';
    clearSketch();
    nextSketchId = 1;
    resetZoom();
    resetObjects();
    resetAnimation();
    refreshToolbarRef?.();
  }

  function updateParams(id, v) {
    if (id === 'theta') {
      const idx = clamp(Math.round(Number(v)), 0, THETA_VALUES.length - 1);
      params.theta = THETA_VALUES[idx];
      const phi = deg2rad(params.orientation);
      objects.forEach((obj) => {
        const p = constrainInWedge(obj, params.theta, phi);
        obj.x = p.x;
        obj.y = p.y;
      });
      resetZoom();
      resetAnimation();
      return;
    }
    if (id === 'orientation') {
      params.orientation = v;
      resetAnimation();
      return;
    }
    params[id] = v;
  }

  function handleAction(id) {
    if (id === 'addObject') {
      objects.push(makeObject(objects.length));
      resetAnimation();
      canvasRef && draw(canvasRef);
      return;
    }
    if (id === 'removeObject' && objects.length > 1) {
      objects.pop();
      resetAnimation();
      canvasRef && draw(canvasRef);
      return;
    }
    if (id === 'placeMode') {
      placeMode = !placeMode;
      if (canvasRef) canvasRef.style.cursor = placeMode ? 'crosshair' : 'default';
      return;
    }
    if (id === 'clearSketch') {
      clearSketch();
      canvasRef && draw(canvasRef);
      return;
    }
    if (id === 'zoomIn') {
      adjustZoom(1);
      return;
    }
    if (id === 'zoomOut') {
      adjustZoom(-1);
      return;
    }
    if (id === 'zoomFit') {
      resetZoom();
      canvasRef && draw(canvasRef);
    }
  }

  function getDescription() {
    return getLang() === 'zh'
      ? '拖曳物件；用控制面板調 θ 同 φ；作圖工具可放置觀察者 E 同手繪光線。'
      : 'Drag objects; adjust θ and φ in the panel; use sketch tools for observer E and manual rays.';
  }

  function getStats(c) {
    return [
      { label: t('imageCount'), value: String(c.nFormula) },
      { label: t('formula'), value: `360/${params.theta}−1` },
      { label: getLang() === 'zh' ? '物件數' : 'Objects', value: String(objects.length) },
    ];
  }

  function getFormula(c) {
    return `n = 360°/θ − 1 = ${c.nFormula}`;
  }

  function syncControl(id, value, unit = '°') {
    const el = document.getElementById(`ctrl-${id}`);
    const badge = document.getElementById(`ctrl-${id}-val`);
    if (el) el.value = String(value);
    if (badge) badge.textContent = `${value}${unit}`;
  }

  function getWorld(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const txf = computeTransform(view, rect.width, rect.height);
    return {
      x: (sx - txf.ox) / txf.pxPerM,
      y: (txf.oy - sy) / txf.pxPerM,
      sx, sy, txf, rect,
    };
  }

  function toScreen(txf, p) {
    return { x: txf.ox + p.x * txf.pxPerM, y: txf.oy - p.y * txf.pxPerM };
  }

  function distPx(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function placeSketchClick(world) {
    const p = { x: world.x, y: world.y };
    if (sketchTool === 'observer') {
      observers.push({ id: nid(), pt: p });
      rayPending = null;
      return;
    }
    if (sketchTool === 'realRay' || sketchTool === 'virtualRay') {
      if (!rayPending || rayPending.kind !== sketchTool) {
        rayPending = { kind: sketchTool, clicks: [p] };
        return;
      }
      sketchRays.push({
        id: nid(),
        kind: sketchTool === 'realRay' ? 'real' : 'virtual',
        color: getRayColor(sketchTool === 'realRay' ? 'real' : 'virtual'),
        from: rayPending.clicks[0],
        to: p,
      });
      rayPending = null;
    }
  }

  function pickSketchTarget(world) {
    const { sx, sy, txf } = world;
    let best = null;
    let bestD = Infinity;

    observers.forEach((o) => {
      const s = toScreen(txf, o.pt);
      const d = distPx(sx, sy, s.x, s.y);
      if (d < HIT_PX && d < bestD) { bestD = d; best = { type: 'observer', id: o.id }; }
    });

    sketchRays.forEach((r) => {
      const sf = toScreen(txf, r.from);
      const st = toScreen(txf, r.to);
      const df = distPx(sx, sy, sf.x, sf.y);
      const dt = distPx(sx, sy, st.x, st.y);
      if (df < HIT_PX && df < bestD) { bestD = df; best = { type: 'ray', id: r.id, part: 'from' }; }
      if (dt < HIT_PX && dt < bestD) { bestD = dt; best = { type: 'ray', id: r.id, part: 'to' }; }
    });

    return best;
  }

  function pickObjectTarget(world) {
    const { sx, sy, txf } = world;
    let best = null;
    let bestD = Infinity;
    objects.forEach((o) => {
      const s = toScreen(txf, o);
      const d = distPx(sx, sy, s.x, s.y);
      if (d < HIT_PX && d < bestD) { bestD = d; best = o.id; }
    });
    return best;
  }

  function bindPointer(canvas) {
    const onDown = (e) => {
      e.preventDefault();
      const world = getWorld(canvas, e.clientX, e.clientY);
      cursorWorld = world;

      if (sketchTool === 'observer' || sketchTool === 'realRay' || sketchTool === 'virtualRay') {
        placeSketchClick(world);
        draw(canvas);
        return;
      }

      if (!placeMode) {
        const objHit = pickObjectTarget(world);
        if (objHit !== null) {
          dragTarget = { type: 'object', id: objHit };
          draggingObjectId = objHit;
          canvas.setPointerCapture?.(e.pointerId);
          canvas.style.cursor = 'grabbing';
          return;
        }
        const sketchHit = pickSketchTarget(world);
        if (sketchHit) {
          dragTarget = sketchHit;
          draggingObjectId = null;
          canvas.setPointerCapture?.(e.pointerId);
          canvas.style.cursor = 'grabbing';
          return;
        }
      }

      if (placeMode && isInsideWedge(world, params.theta, deg2rad(params.orientation))) {
        const pt = constrainInWedge(world, params.theta, deg2rad(params.orientation));
        objects.push({ id: nextObjId++, label: `O${objects.length + 1}`, x: pt.x, y: pt.y });
        resetAnimation();
        draw(canvas);
      }
    };

    const onMove = (e) => {
      const world = getWorld(canvas, e.clientX, e.clientY);
      cursorWorld = world;

      if (!dragTarget) {
        if (!placeMode && sketchTool === 'object') {
          const hoverObj = pickObjectTarget(world);
          const hoverSketch = pickSketchTarget(world);
          canvas.style.cursor = (hoverObj !== null || hoverSketch) ? 'grab' : 'default';
        } else if (sketchTool !== 'object') {
          canvas.style.cursor = 'crosshair';
        }
        if (sketchTool === 'realRay' || sketchTool === 'virtualRay') draw(canvas);
        return;
      }

      e.preventDefault();
      const p = { x: world.x, y: world.y };

      if (dragTarget.type === 'object') {
        const obj = objects.find((o) => o.id === dragTarget.id);
        if (obj) {
          const c = constrainInWedge(p, params.theta, deg2rad(params.orientation));
          obj.x = c.x;
          obj.y = c.y;
        }
      } else if (dragTarget.type === 'observer') {
        const o = observers.find((x) => x.id === dragTarget.id);
        if (o) o.pt = p;
      } else if (dragTarget.type === 'ray') {
        const r = sketchRays.find((x) => x.id === dragTarget.id);
        if (r) {
          if (dragTarget.part === 'from') r.from = p;
          else r.to = p;
        }
      }
      draw(canvas);
    };

    const onUp = (e) => {
      const wasObjectDrag = dragTarget?.type === 'object';
      dragTarget = null;
      draggingObjectId = null;
      canvas.style.cursor = placeMode ? 'crosshair' : (sketchTool === 'object' ? 'default' : 'crosshair');
      if (canvas.releasePointerCapture) {
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      }
      if (wasObjectDrag && canvasRef) {
        resetAnimation();
        const c = compute();
        fitBounds(c);
        draw(canvasRef);
      }
    };

    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'default';
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const onWheel = (e) => {
      e.preventDefault();
      adjustZoom(e.deltaY < 0 ? 1 : -1);
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    pointerHandlers = { canvas, onDown, onMove, onUp, onWheel };
  }

  function unbindPointer() {
    if (!pointerHandlers) return;
    const { canvas, onDown, onMove, onUp, onWheel } = pointerHandlers;
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
    canvas.removeEventListener('wheel', onWheel);
    pointerHandlers = null;
  }

  function init(canvas) {
    canvasRef = canvas;
    if (!objects.length) resetObjects();
    view = createWorldView(canvas, {
      worldBounds: { xMin: -1, xMax: 5, yMin: -0.5, yMax: 4.5 },
      gridStep: 1,
      margin: { left: 40, right: 24, top: 24, bottom: 40 },
      zoomFactor: 1,
    });
    zoomFactor = 1;
    animator.onUpdate = () => draw(canvas);
    resetAnimation();
    bindPointer(canvas);
  }

  function teardown() {
    cancelHighlightRaf();
    unbindPointer();
    canvasRef = null;
    dragTarget = null;
    draggingObjectId = null;
    animator.onUpdate = null;
    animator.pause();
  }

  function drawVirtualMirror(ctx, view, txf, a, b, mirrorSide) {
    const s0 = { x: txf.ox + a.x * txf.pxPerM, y: txf.oy - a.y * txf.pxPerM };
    const s1 = { x: txf.ox + b.x * txf.pxPerM, y: txf.oy - b.y * txf.pxPerM };
    ctx.save();
    ctx.strokeStyle = 'rgba(255,204,0,0.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
    ctx.setLineDash([]);
    const prime = getLang() === 'zh' ? '′' : "'";
    const side = mirrorSide === 1 ? '₁' : '₂';
    drawLabel(ctx, s1.x + 6, s1.y - 6, `M${side}${prime}`, COLORS.mirrorNeed);
    ctx.restore();
  }

  function drawMirror(ctx, view, txf, a, b, label) {
    ctx.strokeStyle = COLORS.mirror;
    ctx.lineWidth = 3;
    const s0 = { x: txf.ox + a.x * txf.pxPerM, y: txf.oy - a.y * txf.pxPerM };
    const s1 = { x: txf.ox + b.x * txf.pxPerM, y: txf.oy - b.y * txf.pxPerM };
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
    drawLabel(ctx, s1.x + 6, s1.y - 6, label, COLORS.mirror);
  }

  function drawSketchPreview(ctx, view, txf) {
    if (!cursorWorld || !rayPending) return;
    const p = { x: cursorWorld.x, y: cursorWorld.y };
    const clicks = rayPending.clicks;
    ctx.globalAlpha = 0.45;
    if (rayPending.kind === 'realRay') {
      drawArrow(ctx, view, txf, clicks[0], p, { color: getRayColor('real'), width: 2 });
    } else if (rayPending.kind === 'virtualRay') {
      drawArrow(ctx, view, txf, clicks[0], p, { color: getRayColor('virtual'), width: 2, dashed: true });
    }
    ctx.globalAlpha = 1;
  }

  function buildToolbar(container, onChange) {
    const root = document.createElement('div');
    root.className = 'sketch-toolbar';

    const hintEl = document.createElement('div');
    hintEl.className = 'sketch-hint';
    root.appendChild(hintEl);

    const grid = document.createElement('div');
    grid.className = 'sketch-tool-grid';
    const toolBtns = {};

    SKETCH_TOOLS.forEach((id) => {
      const meta = SKETCH_TOOL_META[id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-sketch-tool' + (meta.cls ? ` ${meta.cls}` : '');
      btn.innerHTML = `<span class="tool-icon">${meta.icon}</span><span data-i18n="${meta.labelKey}"></span>`;
      btn.addEventListener('click', () => {
        sketchTool = id;
        rayPending = null;
        if (canvasRef) {
          canvasRef.style.cursor = id === 'object' ? 'default' : 'crosshair';
        }
        refreshToolbar();
        onChange?.();
      });
      toolBtns[id] = btn;
      grid.appendChild(btn);
    });
    root.appendChild(grid);

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn btn-accent';
    clearBtn.style.marginTop = '8px';
    clearBtn.dataset.i18n = 'wedgeClearSketch';
    clearBtn.addEventListener('click', () => {
      handleAction('clearSketch');
      onChange?.();
    });
    root.appendChild(clearBtn);

    const zoomRow = document.createElement('div');
    zoomRow.className = 'zoom-toolbar';
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.type = 'button';
    zoomOutBtn.className = 'btn btn-compact';
    zoomOutBtn.dataset.i18n = 'zoomOut';
    zoomOutBtn.title = '−';
    zoomOutBtn.textContent = '−';
    zoomOutBtn.addEventListener('click', () => handleAction('zoomOut'));
    const zoomLabel = document.createElement('span');
    zoomLabel.className = 'zoom-label';
    zoomLabel.textContent = '100%';
    const zoomInBtn = document.createElement('button');
    zoomInBtn.type = 'button';
    zoomInBtn.className = 'btn btn-compact';
    zoomInBtn.dataset.i18n = 'zoomIn';
    zoomInBtn.title = '+';
    zoomInBtn.textContent = '+';
    zoomInBtn.addEventListener('click', () => handleAction('zoomIn'));
    const zoomFitBtn = document.createElement('button');
    zoomFitBtn.type = 'button';
    zoomFitBtn.className = 'btn btn-compact';
    zoomFitBtn.dataset.i18n = 'zoomFit';
    zoomFitBtn.addEventListener('click', () => handleAction('zoomFit'));
    zoomRow.appendChild(zoomOutBtn);
    zoomRow.appendChild(zoomLabel);
    zoomRow.appendChild(zoomInBtn);
    zoomRow.appendChild(zoomFitBtn);
    root.appendChild(zoomRow);

    container.appendChild(root);
    applyI18n(root);

    refreshZoomLabelRef = () => {
      zoomLabel.textContent = `${Math.round(zoomFactor * 100)}%`;
    };
    refreshZoomLabelRef();

    function refreshToolbar() {
      const meta = SKETCH_TOOL_META[sketchTool];
      hintEl.textContent = t(meta?.hintKey || 'wedgeHintObject');
      Object.entries(toolBtns).forEach(([id, btn]) => {
        btn.classList.toggle('active', sketchTool === id);
      });
    }
    refreshToolbarRef = refreshToolbar;
    return refreshToolbar;
  }

  function draw(canvas) {
    const c = compute();
    const maxHeight = Math.min(720, 460 + c.nFormula * 36);
    const { w, h, ctx } = resizeCanvasToDisplay(canvas, { maxHeight });
    syncAnimator(c);
    if (dragTarget?.type !== 'object') fitBounds(c);
    if (view) view.zoomFactor = zoomFactor;
    const txf = computeTransform(view, w, h);
    const apexWorld = { x: 0, y: 0 };
    clear(ctx, w, h);
    const gridR = Math.max(
      3.5,
      ...c.objectSets.flatMap((set) => [
        Math.hypot(set.object.x, set.object.y),
        ...set.images.map((im) => Math.hypot(im.pt.x, im.pt.y)),
      ]),
    ) + 0.5;
    drawPolarWedgeGrid(ctx, view, txf, {
      apex: apexWorld,
      phi: c.phi,
      halfAngle: c.half,
      maxR: gridR,
      stepR: 1,
    });

    const bisLen = Math.min(2.5, gridR - 0.3);
    const bisEnd = {
      x: bisLen * Math.cos(c.phi),
      y: bisLen * Math.sin(c.phi),
    };
    const ax0 = toScreen(txf, apexWorld);
    const ax1 = toScreen(txf, bisEnd);
    ctx.strokeStyle = 'rgba(255,204,0,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(ax0.x, ax0.y);
    ctx.lineTo(ax1.x, ax1.y);
    ctx.stroke();
    ctx.setLineDash([]);

    drawMirror(ctx, view, txf, c.m1.a, c.m1.b, 'M₁');
    drawMirror(ctx, view, txf, c.m2.a, c.m2.b, 'M₂');

    ctx.fillStyle = 'rgba(255,204,0,0.12)';
    ctx.beginPath();
    ctx.arc(ax0.x, ax0.y, 5, 0, Math.PI * 2);
    ctx.fill();

    const stepIndex = animator.stepIndex;
    const showAll = stepIndex >= animator.totalSteps;
    const vis = getVisibility(stepIndex, c.nFormula, showAll);

    if (params.showImages) {
      c.objectSets.forEach((set) => {
        set.images.forEach((img, i) => {
          if (vis.mirrors.has(i) && i >= 2) {
            drawVirtualMirror(ctx, view, txf, img.mirror.a, img.mirror.b, img.mirrorSide);
          }
          if (vis.altMirrors.has(i) && img.altConstruction) {
            const alt = img.altConstruction;
            drawVirtualMirror(ctx, view, txf, alt.mirror.a, alt.mirror.b, alt.mirrorSide);
          }
        });
      });
    }

    const activeStep = getActiveStep(stepIndex, c.nFormula, showAll);
    const primarySet = c.objectSets[0];
    const highlight = primarySet
      ? resolveHighlightMirror(activeStep, primarySet, c)
      : null;
    const pulse = highlight ? 0.5 + 0.5 * Math.sin(performance.now() / 260) : 0;

    if (highlight) {
      drawMirrorHighlight(ctx, txf, highlight.a, highlight.b, {
        virtual: highlight.virtual,
        pulse,
      });
    }

    if (params.showImages) {
      c.objectSets.forEach((set) => {
        set.images.forEach((img, i) => {
          if (vis.images.has(i)) {
            const lbl = objects.length > 1 ? `${set.object.label}→${img.label}` : img.label;
            drawPoint(ctx, view, txf, img.pt, 5, COLORS.image, lbl);
          }
          if (params.showRays && vis.rays.has(i)) {
            const from = img.parentIdx < 0 ? set.object : img.parentPt;
            drawArrow(ctx, view, txf, from, img.pt, { dashed: true, color: getRayColor('virtual'), width: 1 });
          }
          if (params.showRays && vis.altRays.has(i) && img.altConstruction) {
            drawArrow(ctx, view, txf, img.altConstruction.parentPt, img.pt, {
              dashed: true, color: getRayColor('virtual'), width: 1,
            });
          }
        });
      });
    }

    c.objectSets.forEach((set) => {
      const active = draggingObjectId === set.object.id
        || (dragTarget?.type === 'object' && dragTarget.id === set.object.id);
      drawPoint(ctx, view, txf, set.object, active ? 10 : 8, active ? COLORS.mirrorNeed : COLORS.object, set.object.label);
    });

    observers.forEach((o) => {
      const active = dragTarget?.type === 'observer' && dragTarget.id === o.id;
      drawPoint(ctx, view, txf, o.pt, 7, active ? COLORS.mirrorNeed : COLORS.eye, 'E');
    });

    sketchRays.forEach((r) => {
      const active = dragTarget?.type === 'ray' && dragTarget.id === r.id;
      const color = resolveRayColor(r);
      drawArrow(ctx, view, txf, r.from, r.to, {
        color: active ? COLORS.mirrorNeed : color,
        width: active ? 3 : 2,
        dashed: r.kind === 'virtual',
      });
    });

    drawSketchPreview(ctx, view, txf);

    const angM1 = Math.atan2(-c.m1.b.y, c.m1.b.x);
    const angM2 = Math.atan2(-c.m2.b.y, c.m2.b.x);
    ctx.strokeStyle = 'rgba(255,204,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ax0.x, ax0.y, 40, angM2, angM1);
    ctx.stroke();
    const midAng = (angM1 + angM2) / 2;
    drawLabel(ctx, ax0.x + 50 * Math.cos(midAng), ax0.y + 50 * Math.sin(midAng), `θ=${params.theta}°`, COLORS.mirrorNeed);

    if (placeMode) {
      drawLabel(ctx, 12, 22, getLang() === 'zh' ? '點擊楔角內放置物件' : 'Click inside wedge to place', COLORS.mirrorNeed);
    } else if (sketchTool !== 'object') {
      const hintKey = SKETCH_TOOL_META[sketchTool]?.hintKey || 'wedgeHintObject';
      drawLabel(ctx, 12, 22, t(hintKey), COLORS.mirrorNeed);
    } else {
      drawLabel(ctx, 12, 22, t('wedgeHintObject'), COLORS.mirrorNeed);
    }
    drawLabel(ctx, 12, h - 12, t('zoomScrollHint'), 'rgba(228,228,231,0.45)');

    if (highlight && !showAll && canvasRef) {
      scheduleHighlightPulse(canvas);
    } else {
      cancelHighlightRaf();
    }
  }

  return {
    id: 'angledMirrors', init, draw, compute, getControls, updateParams, preset, teardown,
    getDescription, getStats, getFormula, buildToolbar,
    handleAction,
    getAnimator: () => animator,
    replayAnimation,
    extraToggles: [
      { id: 'showRays', labelKey: 'showRays' },
      { id: 'showImages', labelKey: 'showImages' },
    ],
    extraButtons: [
      { id: 'addObject', labelKey: 'addObject', action: 'click' },
      { id: 'removeObject', labelKey: 'removeObject', action: 'click' },
      { id: 'placeMode', labelKey: 'placeObject', toggle: true },
    ],
    getSelectedRays: () => [],
    setSelectedRayColors: () => {},
    get params() { return { ...params, placeMode }; },
  };
}


/* --- sketchValidation.js --- */
/** @file Validation for free ray-sketch practice mode. */

const ANGLE_TOL_DEG = 3;
const POS_TOL = 0.15;
const PT_TOL = 0.22;

function angleBetween(v1, v2) {
  const l1 = Vec2.len(v1);
  const l2 = Vec2.len(v2);
  if (l1 < 1e-8 || l2 < 1e-8) return 0;
  const dot = clamp(Vec2.dot(v1, v2) / (l1 * l2), -1, 1);
  return Math.acos(dot);
}

function mirrorNormalTowardReflected(mirrorA, mirrorB, reflectDir) {
  const ab = Vec2.sub(mirrorB, mirrorA);
  const tangent = Vec2.norm(ab);
  let n = { x: -tangent.y, y: tangent.x };
  if (Vec2.dot(reflectDir, n) < 0) n = Vec2.scale(n, -1);
  return n;
}

function checkReflectionAtPoint(from, via, to, mirrorA, mirrorB) {
  if (!pointOnSegment(via, mirrorA, mirrorB, 0.02)) {
    return { ok: false, diffDeg: 90, reason: 'offMirror' };
  }
  const incident = Vec2.sub(from, via);
  const reflected = Vec2.sub(to, via);
  const n = mirrorNormalTowardReflected(mirrorA, mirrorB, reflected);
  const thetaI = angleBetween(incident, n);
  const thetaR = angleBetween(reflected, n);
  const diffDeg = Math.abs(rad2deg(thetaI) - rad2deg(thetaR));
  return { ok: diffDeg <= ANGLE_TOL_DEG, diffDeg };
}

function nearPt(a, b, tol = PT_TOL) {
  return Vec2.dist(a, b) <= tol;
}

function findMirrorAtPoint(pt, mirrors) {
  for (const m of mirrors) {
    if (pointOnSegment(pt, m.a, m.b, 0.03)) return m;
  }
  return null;
}

function rayEndpoints(ray) {
  return [ray.from, ray.to];
}

function sharedMirrorPoint(r1, r2, mirrors) {
  for (const p1 of rayEndpoints(r1)) {
    for (const p2 of rayEndpoints(r2)) {
      if (!nearPt(p1, p2, 0.12)) continue;
      if (findMirrorAtPoint(p1, mirrors)) return p1;
    }
  }
  return null;
}

function otherEndpoint(ray, pt) {
  if (nearPt(ray.from, pt, 0.12)) return ray.to;
  if (nearPt(ray.to, pt, 0.12)) return ray.from;
  return null;
}

function bouncePairs(realRays, mirrors) {
  const pairs = [];
  for (let i = 0; i < realRays.length; i++) {
    for (let j = i + 1; j < realRays.length; j++) {
      const via = sharedMirrorPoint(realRays[i], realRays[j], mirrors);
      if (!via) continue;
      const from = otherEndpoint(realRays[i], via);
      const to = otherEndpoint(realRays[j], via);
      if (!from || !to) continue;
      const mirror = findMirrorAtPoint(via, mirrors);
      if (!mirror) continue;
      pairs.push({ from, via, to, mirror, i, j });
    }
  }
  return pairs;
}

function validateReflections(state) {
  const realRays = state.rays.filter((r) => r.kind === 'real');
  if (!realRays.length) {
    return { ok: null, messageKey: 'noRealRays', issues: [] };
  }
  const pairs = bouncePairs(realRays, state.mirrors);
  if (!pairs.length) {
    return { ok: null, messageKey: 'noBouncePair', issues: [] };
  }
  const issues = [];
  pairs.forEach((bp, idx) => {
    const res = checkReflectionAtPoint(bp.from, bp.via, bp.to, bp.mirror.a, bp.mirror.b);
    if (!res.ok) {
      issues.push({ index: idx + 1, diffDeg: res.diffDeg, reason: res.reason || 'angle' });
    }
  });
  return { ok: issues.length === 0, issues, pairCount: pairs.length };
}

function barEndpointDistance(a1, a2, b1, b2) {
  const d1 = Vec2.dist(a1, b1) + Vec2.dist(a2, b2);
  const d2 = Vec2.dist(a1, b2) + Vec2.dist(a2, b1);
  return Math.min(d1, d2);
}

function validateImagePosition(state) {
  const { objects, images, mirrors } = state;
  if (!objects.length || !images.length || !mirrors.length) {
    return { ok: null, messageKey: 'needObjectMirrorImage' };
  }
  const obj = objects[0];
  const img = images[0];
  const mirror = mirrors[0];
  const expA = reflectPoint(obj.a, mirror.a, mirror.b);
  const expB = reflectPoint(obj.b, mirror.a, mirror.b);
  const err = barEndpointDistance(expA, expB, img.a, img.b);
  return { ok: err <= POS_TOL * 2, err, expA, expB };
}

function findSightPath(objPt, eyePt, imgPt, realRays, virtRays, mirrors) {
  for (const m of mirrors) {
    for (let i = 0; i < realRays.length; i++) {
      for (let j = 0; j < realRays.length; j++) {
        if (i === j) continue;
        const via = sharedMirrorPoint(realRays[i], realRays[j], [m]);
        if (!via) continue;
        const from = otherEndpoint(realRays[i], via);
        const to = otherEndpoint(realRays[j], via);
        if (!from || !to) continue;
        if (!nearPt(from, objPt) || !nearPt(to, eyePt)) continue;
        const refl = checkReflectionAtPoint(from, via, to, m.a, m.b);
        if (!refl.ok) continue;
        const hasVirt = virtRays.some((vr) => {
          const touchesVia = nearPt(vr.from, via) || nearPt(vr.to, via);
          const touchesImg = nearPt(vr.from, imgPt) || nearPt(vr.to, imgPt);
          return touchesVia && touchesImg;
        });
        if (hasVirt) return true;
      }
    }
  }
  return false;
}

function validateWholeImage(state) {
  const { objects, images, observers, rays, mirrors } = state;
  if (!objects.length || !images.length || !observers.length || !mirrors.length) {
    return { ok: null, messageKey: 'needFullSetup' };
  }
  const obj = objects[0];
  const img = images[0];
  const eye = observers[0].pt;
  const realRays = rays.filter((r) => r.kind === 'real');
  const virtRays = rays.filter((r) => r.kind === 'virtual');
  if (realRays.length < 2) return { ok: null, messageKey: 'noRealRays' };

  const endpoints = [
    { objPt: obj.a, imgPt: img.a, label: 'A' },
    { objPt: obj.b, imgPt: img.b, label: 'B' },
  ];

  const failed = [];
  for (const ep of endpoints) {
    if (!findSightPath(ep.objPt, eye, ep.imgPt, realRays, virtRays, mirrors)) {
      failed.push(ep.label);
    }
  }
  return { ok: failed.length === 0, failed };
}

function runAllValidations(state) {
  return {
    reflection: validateReflections(state),
    imagePos: validateImagePosition(state),
    wholeImage: validateWholeImage(state),
  };
}


/* --- raySketch.js --- */
/** @file Free ray-sketch practice mode with validation. */





const SKETCH_HIT_PX = 14;
const SKETCH_LINE_HIT_PX = 10;
const MARQUEE_MIN_PX = 4;
const PLACE_DRAG_MIN = 0.12;
const SNAP = 0.5;
const TOOLS = ['select', 'mirror', 'object', 'image', 'observer', 'realRay', 'virtualRay'];
const BAR_TOOLS = ['mirror', 'object', 'image'];

const TOOL_META = {
  select: { icon: '↖', hintKey: 'sketchHintSelect', group: 'nav', labelKey: 'toolSelect', cls: 'tool-select' },
  mirror: { icon: '╱', hintKey: 'sketchHintMirror', group: 'place', labelKey: 'toolMirror' },
  object: { icon: '▮', hintKey: 'sketchHintObject', group: 'place', labelKey: 'toolObject' },
  image: { icon: '▯', hintKey: 'sketchHintImage', group: 'place', labelKey: 'toolImage' },
  observer: { icon: '◎', hintKey: 'sketchHintObserver', group: 'place', labelKey: 'toolObserver' },
  realRay: { icon: '→', hintKey: 'sketchHintRealRay', group: 'ray', labelKey: 'toolRealRay', cls: 'tool-ray' },
  virtualRay: { icon: '⇢', hintKey: 'sketchHintVirtualRay', group: 'ray', labelKey: 'toolVirtualRay', cls: 'tool-virtual' },
};

function emptyState() {
  return {
    mirrors: [],
    objects: [],
    images: [],
    observers: [],
    rays: [],
    tool: 'select',
    pending: null,
    selected: new Set(),
    gridSnap: false,
    observerAsPoint: false,
    nextId: 1,
  };
}

function snap(p, on) {
  if (!on) return { x: p.x, y: p.y };
  return { x: Math.round(p.x / SNAP) * SNAP, y: Math.round(p.y / SNAP) * SNAP };
}

function clonePt(p) { return { x: p.x, y: p.y }; }

function selKey(type, id) { return `${type}:${id}`; }

function parseSelKey(key) {
  const i = key.indexOf(':');
  return { type: key.slice(0, i), id: Number(key.slice(i + 1)) };
}

function distPx(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function distSegPx(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  if (len2 < 1) return Math.hypot(px - ax, py - ay);
  let u = ((px - ax) * abx + (py - ay) * aby) / len2;
  u = Math.max(0, Math.min(1, u));
  const cx = ax + u * abx;
  const cy = ay + u * aby;
  return Math.hypot(px - cx, py - cy);
}

function toScreenPt(txf, p) {
  return { x: txf.ox + p.x * txf.pxPerM, y: txf.oy - p.y * txf.pxPerM };
}

function rectsOverlap(a, b) {
  return a.x0 <= b.x1 && a.x1 >= b.x0 && a.y0 <= b.y1 && a.y1 >= b.y0;
}

function normalizeScreenRect(x0, y0, x1, y1) {
  return {
    x0: Math.min(x0, x1),
    y0: Math.min(y0, y1),
    x1: Math.max(x0, x1),
    y1: Math.max(y0, y1),
  };
}

function createRaySketchScenario() {
  let state = emptyState();
  let view = null;
  let canvasRef = null;
  let lastLayout = null;
  let dragTarget = null;
  let dragGroup = null;
  let placeDrag = null;
  let pointerStart = null;
  let marquee = null;
  let cursorWorld = null;
  let refreshToolbarRef = null;
  let keyHandler = null;
  let currentPresetName = 'basic';

  function nid() { return state.nextId++; }

  function loadPreset(name) {
    currentPresetName = name;
    state = emptyState();
    if (name === 'basic') {
      state.mirrors.push({ id: nid(), a: { x: 2.0, y: -1.0 }, b: { x: 2.0, y: 3.0 } });
      state.objects.push({ id: nid(), a: { x: 0.5, y: 1.0 }, b: { x: 0.5, y: 2.0 } });
      state.observers.push({ id: nid(), pt: { x: 0.0, y: 0.0 } });
    } else if (name === 'letterP') {
      state.mirrors.push({ id: nid(), a: { x: 2.0, y: -1.0 }, b: { x: 2.0, y: 3.0 } });
      state.objects.push({ id: nid(), a: { x: 0.5, y: 0.5 }, b: { x: 0.5, y: 2.5 } });
      state.objects.push({ id: nid(), a: { x: 0.5, y: 2.5 }, b: { x: 1.1, y: 2.5 } });
      state.objects.push({ id: nid(), a: { x: 1.1, y: 2.5 }, b: { x: 1.1, y: 1.5 } });
      state.objects.push({ id: nid(), a: { x: 1.1, y: 1.5 }, b: { x: 0.5, y: 1.5 } });
      state.observers.push({ id: nid(), pt: { x: 0.0, y: 0.0 } });
    } else if (name === 'ground') {
      state.mirrors.push({ id: nid(), a: { x: -0.5, y: 0.0 }, b: { x: 4.5, y: 0.0 } });
      state.objects.push({ id: nid(), a: { x: 0.0, y: 1.5 }, b: { x: 0.0, y: 2.5 } });
      state.observers.push({ id: nid(), pt: { x: 4.0, y: 1.5 } });
    }
    state.gridSnap = false;
    notifyChange();
  }

  function preset() {
    loadPreset('basic');
  }

  function isSelected(type, id) {
    return state.selected.has(selKey(type, id));
  }

  function updateParams(id, v) {
    if (id === 'gridSnap') state.gridSnap = v;
    else if (TOOLS.includes(id)) state.tool = id;
  }

  function hasSelectedRays() {
    return [...state.selected].some((key) => parseSelKey(key).type === 'ray');
  }

  function getSelectedRays() {
    const rays = [];
    for (const key of state.selected) {
      const { type, id } = parseSelKey(key);
      if (type !== 'ray') continue;
      const r = state.rays.find((x) => x.id === id);
      if (r) rays.push(r);
    }
    return rays;
  }

  function setSelectedRayColors(hex) {
    getSelectedRays().forEach((r) => { r.color = hex; });
  }

  function selectionSummary() {
    const n = state.selected.size;
    if (!n) return null;
    const lang = getLang();
    if (n === 1) {
      const { type, id } = parseSelKey([...state.selected][0]);
      if (type === 'ray') {
        const r = state.rays.find((x) => x.id === id);
        const kind = r?.kind === 'virtual'
          ? (lang === 'zh' ? '虛線' : 'virtual')
          : (lang === 'zh' ? '實線' : 'real');
        return `${kind} #${id}`;
      }
      const names = {
        mirror: lang === 'zh' ? '鏡面' : 'mirror',
        object: lang === 'zh' ? '物件' : 'object',
        image: lang === 'zh' ? '虛像' : 'image',
        observer: lang === 'zh' ? '觀察者' : 'observer',
      };
      return names[type] || type;
    }
    return lang === 'zh' ? `已選 ${n} 項` : `${n} selected`;
  }

  function notifyChange() {
    refreshToolbarRef?.();
    canvasRef && draw(canvasRef);
  }

  function handleAction(id) {
    if (id === 'deleteSelected') {
      deleteSelected();
      notifyChange();
      return;
    }
    if (TOOLS.includes(id)) {
      state.tool = id;
      state.pending = null;
      placeDrag = null;
      if (canvasRef) {
        canvasRef.style.cursor = id === 'select' ? 'default' : 'crosshair';
      }
    }
    if (id === 'gridSnap') state.gridSnap = !state.gridSnap;
    if (id === 'observerAsPoint') state.observerAsPoint = !state.observerAsPoint;
  }

  function deleteSelected() {
    if (!state.selected.size) return;
    for (const key of [...state.selected]) {
      const { type, id } = parseSelKey(key);
      if (type === 'mirror') state.mirrors = state.mirrors.filter((m) => m.id !== id);
      else if (type === 'object') state.objects = state.objects.filter((o) => o.id !== id);
      else if (type === 'image') state.images = state.images.filter((i) => i.id !== id);
      else if (type === 'observer') state.observers = state.observers.filter((o) => o.id !== id);
      else if (type === 'ray') state.rays = state.rays.filter((r) => r.id !== id);
    }
    state.selected.clear();
  }

  function compute() {
    return { state, validation: runAllValidations(state) };
  }

  function getControls() { return []; }

  function getDescription() {
    return getLang() === 'zh'
      ? '放置鏡面、物件、虛像與觀察者，手繪光線。系統會檢查反射定律與能否看見整個像。'
      : 'Place mirror, object, image and observer; sketch rays. Reflection law and whole-image visibility are checked.';
  }

  function getStats(c) {
    const v = c.validation;
    const lang = getLang();
    const rows = [];

    if (v.reflection.ok === null) {
      const msg = v.reflection.messageKey === 'noBouncePair'
        ? (lang === 'zh' ? '—（需兩段實線在鏡面相接）' : '— (join 2 real segments on mirror)')
        : (lang === 'zh' ? '—（未畫實線）' : '— (no real rays)');
      rows.push({ label: lang === 'zh' ? '反射定律' : 'Reflection', value: msg });
    } else if (v.reflection.ok) {
      rows.push({ label: lang === 'zh' ? '反射定律' : 'Reflection', value: '✓', ok: true });
    } else {
      const n = v.reflection.issues.map((i) => `#${i.index}`).join(', ');
      rows.push({ label: lang === 'zh' ? '反射定律' : 'Reflection', value: `✗ ${n}`, fail: true });
    }

    if (v.imagePos.ok === null) {
      rows.push({ label: lang === 'zh' ? '虛像位置' : 'Image pos.', value: '—' });
    } else if (v.imagePos.ok) {
      rows.push({ label: lang === 'zh' ? '虛像位置' : 'Image pos.', value: '✓', ok: true });
    } else {
      rows.push({ label: lang === 'zh' ? '虛像位置' : 'Image pos.', value: '⚠', fail: true });
    }

    if (v.wholeImage.ok === null) {
      rows.push({ label: lang === 'zh' ? '整個像' : 'Whole image', value: '—' });
    } else if (v.wholeImage.ok) {
      rows.push({ label: lang === 'zh' ? '整個像' : 'Whole image', value: '✓', ok: true });
    } else {
      const f = v.wholeImage.failed?.join(', ') || '?';
      rows.push({
        label: lang === 'zh' ? '整個像' : 'Whole image',
        value: lang === 'zh' ? `✗ 端點 ${f}` : `✗ end ${f}`,
        fail: true,
      });
    }
    return rows;
  }

  function getFormula(c) {
    const lang = getLang();
    const v = c.validation;
    const lines = [];
    if (v.reflection.ok === false && v.reflection.issues.length) {
      v.reflection.issues.forEach((iss) => {
        if (iss.reason === 'noMirror') {
          lines.push(lang === 'zh' ? `反射點 #${iss.index}：不在鏡面上` : `Bounce #${iss.index}: not on mirror`);
        } else {
          lines.push(lang === 'zh'
            ? `反射點 #${iss.index}：入射角≠反射角（差 ${iss.diffDeg?.toFixed(1)}°）`
            : `Bounce #${iss.index}: angle error ${iss.diffDeg?.toFixed(1)}°`);
        }
      });
    }
    if (v.imagePos.ok === false) {
      lines.push(lang === 'zh'
        ? `虛像與理論反射位置偏差 ≈ ${v.imagePos.err?.toFixed(2)} m`
        : `Image offset ≈ ${v.imagePos.err?.toFixed(2)} m`);
    }
    if (v.wholeImage.ok === false && v.wholeImage.failed?.length) {
      lines.push(lang === 'zh'
        ? `無法由光線看見端點：${v.wholeImage.failed.join(', ')}`
        : `Cannot see endpoints: ${v.wholeImage.failed.join(', ')}`);
    }
    if (!lines.length) {
      return lang === 'zh' ? '完成作圖後，檢查結果會顯示於此。' : 'Results appear here after sketching.';
    }
    return lines.join('\n');
  }

  function getPointerWorld(canvas, clientX, clientY) {
    const layout = lastLayout || getCanvasLayout(canvas);
    return clientToWorld(view, layout, clientX, clientY);
  }

  function hitTestPixel(sx, sy, txf) {
    const hits = [];

    const add = (type, id, part, dist, priority) => {
      hits.push({ type, id, part, dist, priority });
    };

    for (const r of state.rays) {
      const f = toScreenPt(txf, r.from);
      const tpt = toScreenPt(txf, r.to);
      const df = distPx(sx, sy, f.x, f.y);
      const dt = distPx(sx, sy, tpt.x, tpt.y);
      if (df < SKETCH_HIT_PX) add('ray', r.id, 'from', df, 0);
      if (dt < SKETCH_HIT_PX) add('ray', r.id, 'to', dt, 0);
      const ds = distSegPx(sx, sy, f.x, f.y, tpt.x, tpt.y);
      if (ds < SKETCH_LINE_HIT_PX) add('ray', r.id, undefined, ds, 1);
    }

    for (const o of state.observers) {
      const s = toScreenPt(txf, o.pt);
      const d = distPx(sx, sy, s.x, s.y);
      if (d < SKETCH_HIT_PX + 2) add('observer', o.id, 'pt', d, 0);
    }

    for (const o of state.objects) {
      const sa = toScreenPt(txf, o.a);
      const sb = toScreenPt(txf, o.b);
      const da = distPx(sx, sy, sa.x, sa.y);
      const db = distPx(sx, sy, sb.x, sb.y);
      if (da < SKETCH_HIT_PX) add('object', o.id, 'a', da, 0);
      if (db < SKETCH_HIT_PX) add('object', o.id, 'b', db, 0);
      const ds = distSegPx(sx, sy, sa.x, sa.y, sb.x, sb.y);
      if (ds < SKETCH_LINE_HIT_PX) add('object', o.id, undefined, ds, 2);
    }

    for (const img of state.images) {
      const sa = toScreenPt(txf, img.a);
      const sb = toScreenPt(txf, img.b);
      const da = distPx(sx, sy, sa.x, sa.y);
      const db = distPx(sx, sy, sb.x, sb.y);
      if (da < SKETCH_HIT_PX) add('image', img.id, 'a', da, 0);
      if (db < SKETCH_HIT_PX) add('image', img.id, 'b', db, 0);
      const ds = distSegPx(sx, sy, sa.x, sa.y, sb.x, sb.y);
      if (ds < SKETCH_LINE_HIT_PX) add('image', img.id, undefined, ds, 2);
    }

    for (const m of state.mirrors) {
      const sa = toScreenPt(txf, m.a);
      const sb = toScreenPt(txf, m.b);
      const da = distPx(sx, sy, sa.x, sa.y);
      const db = distPx(sx, sy, sb.x, sb.y);
      if (da < SKETCH_HIT_PX) add('mirror', m.id, 'a', da, 0);
      if (db < SKETCH_HIT_PX) add('mirror', m.id, 'b', db, 0);
      const ds = distSegPx(sx, sy, sa.x, sa.y, sb.x, sb.y);
      if (ds < SKETCH_LINE_HIT_PX) add('mirror', m.id, undefined, ds, 2);
    }

    if (!hits.length) return null;
    hits.sort((a, b) => a.priority - b.priority || a.dist - b.dist);
    const h = hits[0];
    return { type: h.type, id: h.id, part: h.part };
  }

  function screenBoundsForElement(type, id, txf, pad = 6) {
    const pts = [];
    if (type === 'observer') {
      const o = state.observers.find((x) => x.id === id);
      if (!o) return null;
      pts.push(toScreenPt(txf, o.pt));
    } else if (type === 'ray') {
      const r = state.rays.find((x) => x.id === id);
      if (!r) return null;
      pts.push(toScreenPt(txf, r.from), toScreenPt(txf, r.to));
    } else {
      const el = type === 'mirror'
        ? state.mirrors.find((x) => x.id === id)
        : state[`${type}s`]?.find?.((x) => x.id === id);
      if (!el) return null;
      pts.push(toScreenPt(txf, el.a), toScreenPt(txf, el.b));
    }
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    pts.forEach((p) => {
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
    });
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  }

  function hitTestBox(box, txf) {
    const keys = new Set();
    const all = [
      ...state.mirrors.map((m) => ['mirror', m.id]),
      ...state.objects.map((o) => ['object', o.id]),
      ...state.images.map((i) => ['image', i.id]),
      ...state.observers.map((o) => ['observer', o.id]),
      ...state.rays.map((r) => ['ray', r.id]),
    ];
    for (const [type, id] of all) {
      const bounds = screenBoundsForElement(type, id, txf);
      if (bounds && rectsOverlap(box, bounds)) keys.add(selKey(type, id));
    }
    return keys;
  }

  function snapshotElement(type, id) {
    if (type === 'observer') {
      const o = state.observers.find((x) => x.id === id);
      return o ? { type, id, pt: clonePt(o.pt) } : null;
    }
    if (type === 'ray') {
      const r = state.rays.find((x) => x.id === id);
      return r ? { type, id, from: clonePt(r.from), to: clonePt(r.to) } : null;
    }
    const el = type === 'mirror'
      ? state.mirrors.find((x) => x.id === id)
      : state[`${type}s`]?.find?.((x) => x.id === id);
    if (!el) return null;
    return { type, id, a: clonePt(el.a), b: clonePt(el.b) };
  }

  function snapshotSelection() {
    return [...state.selected].map((key) => {
      const { type, id } = parseSelKey(key);
      return snapshotElement(type, id);
    }).filter(Boolean);
  }

  function applySnapshotAtDelta(snapshot, dx, dy) {
    const { type, id } = snapshot;
    if (type === 'observer') {
      const o = state.observers.find((x) => x.id === id);
      if (o) o.pt = snap({ x: snapshot.pt.x + dx, y: snapshot.pt.y + dy }, state.gridSnap);
    } else if (type === 'ray') {
      const r = state.rays.find((x) => x.id === id);
      if (r) {
        r.from = snap({ x: snapshot.from.x + dx, y: snapshot.from.y + dy }, state.gridSnap);
        r.to = snap({ x: snapshot.to.x + dx, y: snapshot.to.y + dy }, state.gridSnap);
      }
    } else if (type === 'mirror') {
      const m = state.mirrors.find((x) => x.id === id);
      if (m) {
        m.a = snap({ x: snapshot.a.x + dx, y: snapshot.a.y + dy }, state.gridSnap);
        m.b = snap({ x: snapshot.b.x + dx, y: snapshot.b.y + dy }, state.gridSnap);
      }
    } else if (type === 'object') {
      const o = state.objects.find((x) => x.id === id);
      if (o) {
        o.a = snap({ x: snapshot.a.x + dx, y: snapshot.a.y + dy }, state.gridSnap);
        o.b = snap({ x: snapshot.b.x + dx, y: snapshot.b.y + dy }, state.gridSnap);
      }
    } else if (type === 'image') {
      const img = state.images.find((x) => x.id === id);
      if (img) {
        img.a = snap({ x: snapshot.a.x + dx, y: snapshot.a.y + dy }, state.gridSnap);
        img.b = snap({ x: snapshot.b.x + dx, y: snapshot.b.y + dy }, state.gridSnap);
      }
    }
  }

  function applyGroupDrag(dx, dy) {
    dragGroup?.orig?.forEach((orig) => applySnapshotAtDelta(orig, dx, dy));
  }

  function applyEndpointDrag(hit, p) {
    const { type, id, part } = hit;
    if (type === 'observer') {
      const o = state.observers.find((x) => x.id === id);
      if (o) o.pt = p;
    } else if (type === 'ray') {
      const r = state.rays.find((x) => x.id === id);
      if (r) {
        if (part === 'from') r.from = p;
        else if (part === 'to') r.to = p;
      }
    } else if (type === 'mirror') {
      const m = state.mirrors.find((x) => x.id === id);
      if (m && part) m[part] = p;
    } else if (type === 'object') {
      const o = state.objects.find((x) => x.id === id);
      if (o && part) o[part] = p;
    } else if (type === 'image') {
      const img = state.images.find((x) => x.id === id);
      if (img && part) img[part] = p;
    }
  }

  function createBar(tool, a, b) {
    const id = nid();
    if (tool === 'mirror') state.mirrors.push({ id, a, b });
    else if (tool === 'object') state.objects.push({ id, a, b });
    else state.images.push({ id, a, b });
  }

  function placeClick(world) {
    const p = snap(world, state.gridSnap);
    const tool = state.tool;

    if (tool === 'observer') {
      state.observers.push({ id: nid(), pt: p });
      state.pending = null;
      return;
    }

    if (tool === 'realRay' || tool === 'virtualRay') {
      if (!state.pending || state.pending.kind !== tool) {
        state.pending = { kind: tool, clicks: [p] };
        return;
      }
      const from = state.pending.clicks[0];
      const kind = tool === 'realRay' ? 'real' : 'virtual';
      state.rays.push({
        id: nid(),
        kind,
        color: getRayColor(kind),
        from,
        to: p,
      });
      state.pending = null;
    }
  }

  function toggleSelection(hit, additive) {
    const key = selKey(hit.type, hit.id);
    if (additive) {
      if (state.selected.has(key)) state.selected.delete(key);
      else state.selected.add(key);
    } else if (state.selected.size === 1 && state.selected.has(key)) {
      state.selected.delete(key);
    } else {
      state.selected.clear();
      state.selected.add(key);
    }
  }

  function bindPointer(canvas) {
    const onDown = (e) => {
      e.preventDefault();
      const ptr = getPointerWorld(canvas, e.clientX, e.clientY);
      cursorWorld = ptr;
      pointerStart = { sx: ptr.sx, sy: ptr.sy, shift: e.shiftKey };
      marquee = null;
      dragTarget = null;
      dragGroup = null;

      if (state.tool === 'select') {
        const hit = hitTestPixel(ptr.sx, ptr.sy, ptr.txf);
        pointerStart.hit = hit;

        if (hit?.part && isSelected(hit.type, hit.id)) {
          dragTarget = hit;
        } else if (hit && isSelected(hit.type, hit.id)) {
          dragGroup = { start: clonePt(ptr), orig: snapshotSelection() };
        } else if (hit?.part) {
          dragTarget = hit;
          if (!e.shiftKey) {
            state.selected.clear();
            state.selected.add(selKey(hit.type, hit.id));
          }
        }

        if ((dragTarget || dragGroup) && canvas.setPointerCapture) {
          canvas.setPointerCapture(e.pointerId);
        }
        return;
      }

      if (BAR_TOOLS.includes(state.tool)) {
        placeDrag = { kind: state.tool, start: snap(ptr, state.gridSnap) };
        if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
        draw(canvas);
        return;
      }

      placeClick(ptr);
      draw(canvas);
    };

    const onMove = (e) => {
      const ptr = getPointerWorld(canvas, e.clientX, e.clientY);
      cursorWorld = ptr;

      if (state.tool === 'select' && pointerStart && !dragTarget && !dragGroup) {
        const dx = ptr.sx - pointerStart.sx;
        const dy = ptr.sy - pointerStart.sy;
        if (Math.hypot(dx, dy) >= MARQUEE_MIN_PX) {
          marquee = normalizeScreenRect(pointerStart.sx, pointerStart.sy, ptr.sx, ptr.sy);
          draw(canvas);
          return;
        }
      }

      if (dragGroup?.orig) {
        e.preventDefault();
        const dx = ptr.x - dragGroup.start.x;
        const dy = ptr.y - dragGroup.start.y;
        applyGroupDrag(dx, dy);
        draw(canvas);
        return;
      }

      if (dragTarget) {
        e.preventDefault();
        applyEndpointDrag(dragTarget, snap(ptr, state.gridSnap));
        draw(canvas);
        return;
      }

      if (placeDrag) {
        draw(canvas);
        return;
      }

      if (state.pending) draw(canvas);
    };

    const onUp = (e) => {
      const ptr = getPointerWorld(canvas, e.clientX, e.clientY);

      if (state.tool === 'select' && pointerStart) {
        if (marquee) {
          const keys = hitTestBox(marquee, ptr.txf);
          if (!pointerStart.shift) state.selected.clear();
          keys.forEach((k) => state.selected.add(k));
          notifyChange();
        } else if (!dragTarget && !dragGroup) {
          const hit = pointerStart.hit;
          if (hit) {
            toggleSelection(hit, pointerStart.shift);
            notifyChange();
          } else if (!pointerStart.shift) {
            state.selected.clear();
            notifyChange();
          }
        } else {
          notifyChange();
        }
      }

      if (placeDrag) {
        const start = placeDrag.start;
        const end = snap(ptr, state.gridSnap);
        const dist = Math.hypot(end.x - start.x, end.y - start.y);
        if (dist >= PLACE_DRAG_MIN) {
          createBar(placeDrag.kind, start, end);
          state.pending = null;
        } else if (!state.pending || state.pending.kind !== placeDrag.kind) {
          state.pending = { kind: placeDrag.kind, clicks: [start] };
        } else {
          createBar(placeDrag.kind, state.pending.clicks[0], start);
          state.pending = null;
        }
        placeDrag = null;
        draw(canvas);
      }

      dragTarget = null;
      dragGroup = null;
      pointerStart = null;
      marquee = null;
    };

    const onKey = (e) => {
      if (state.tool !== 'select') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        notifyChange();
      }
    };

    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    keyHandler = onKey;

    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'default';
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    window.addEventListener('keydown', keyHandler);
  }

  function init(canvas) {
    canvasRef = canvas;
    view = createWorldView(canvas, {
      worldBounds: { xMin: -2.0, xMax: 6.0, yMin: -2.0, yMax: 3.0 },
      gridStep: 1.0,
      margin: { left: 40, right: 40, top: 40, bottom: 40 },
    });
    bindPointer(canvas);
  }

  function drawPreview(ctx, viewRef, txf) {
    if (!cursorWorld) return;
    const p = snap(cursorWorld, state.gridSnap);

    if (placeDrag) {
      ctx.globalAlpha = 0.45;
      drawArrow(ctx, viewRef, txf, placeDrag.start, p, {
        color: COLORS.mirrorNeed,
        dashed: placeDrag.kind !== 'mirror',
        width: 2,
        head: placeDrag.kind !== 'mirror',
      });
      ctx.globalAlpha = 1;
      return;
    }

    if (!state.pending) return;
    const clicks = state.pending.clicks;
    ctx.globalAlpha = 0.45;
    if (BAR_TOOLS.includes(state.pending.kind)) {
      drawArrow(ctx, viewRef, txf, clicks[0], p, {
        color: COLORS.mirrorNeed,
        dashed: state.pending.kind !== 'mirror',
        width: 2,
        head: state.pending.kind !== 'mirror',
      });
    } else if (state.pending.kind === 'realRay') {
      drawArrow(ctx, viewRef, txf, clicks[0], p, { color: getRayColor('real'), width: 2 });
    } else if (state.pending.kind === 'virtualRay') {
      drawArrow(ctx, viewRef, txf, clicks[0], p, { color: getRayColor('virtual'), width: 2, dashed: true });
    }
    ctx.globalAlpha = 1;
  }

  function drawMarquee(ctx) {
    if (!marquee) return;
    ctx.save();
    ctx.strokeStyle = COLORS.mirrorNeed;
    ctx.fillStyle = 'rgba(255,204,0,0.12)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    const w = marquee.x1 - marquee.x0;
    const h = marquee.y1 - marquee.y0;
    ctx.fillRect(marquee.x0, marquee.y0, w, h);
    ctx.strokeRect(marquee.x0, marquee.y0, w, h);
    ctx.restore();
  }

  function draw(canvas) {
    const { w, h, ctx, layout } = resizeCanvasToDisplay(canvas);
    lastLayout = layout;
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);

    state.mirrors.forEach((m) => {
      drawMirrorSegment(ctx, view, txf, m.a, m.b, COLORS.mirror, 4, isSelected('mirror', m.id));
    });

    state.objects.forEach((o, i) => {
      drawBar(ctx, view, txf, o.a, o.b, {
        color: COLORS.object,
        width: 4,
        labelA: i === 0 ? 'A' : '',
        labelB: i === 0 ? 'B' : '',
        selected: isSelected('object', o.id),
      });
    });

    state.images.forEach((img, i) => {
      drawBar(ctx, view, txf, img.a, img.b, {
        color: COLORS.image,
        width: 3,
        dashed: true,
        labelA: i === 0 ? "A'" : '',
        labelB: i === 0 ? "B'" : '',
        selected: isSelected('image', img.id),
      });
    });

    state.observers.forEach((o) => {
      const sel = isSelected('observer', o.id);
      drawPoint(ctx, view, txf, o.pt, 7, sel ? COLORS.mirrorNeed : COLORS.eye, 'E', state.observerAsPoint);
    });

    state.rays.forEach((r) => {
      const sel = isSelected('ray', r.id);
      const color = resolveRayColor(r);
      drawArrow(ctx, view, txf, r.from, r.to, {
        color: sel ? COLORS.mirrorNeed : color,
        width: sel ? 3 : 2,
        dashed: r.kind === 'virtual',
      });
      if (sel) {
        drawPoint(ctx, view, txf, r.from, 5, COLORS.mirrorNeed, '');
        drawPoint(ctx, view, txf, r.to, 5, COLORS.mirrorNeed, '');
      }
    });

    drawPreview(ctx, view, txf);
    drawMarquee(ctx);
  }

  function buildToolbar(container, onChange) {
    container.querySelectorAll('.sketch-toolbar').forEach((el) => el.remove());
    const root = document.createElement('div');
    root.className = 'sketch-toolbar';

    const hintEl = document.createElement('div');
    hintEl.className = 'sketch-hint';
    root.appendChild(hintEl);

    const selBox = document.createElement('div');
    selBox.className = 'sketch-selection-box';
    const selLabel = document.createElement('span');
    selLabel.className = 'sketch-selection-label';
    selLabel.dataset.i18n = 'sketchSelected';
    const selValue = document.createElement('span');
    selValue.className = 'sketch-selection-value';
    selBox.appendChild(selLabel);
    selBox.appendChild(selValue);
    root.appendChild(selBox);

    // Preset dropdown group
    const presetGroup = document.createElement('div');
    presetGroup.className = 'sketch-tool-group';
    const presetTitle = document.createElement('p');
    presetTitle.className = 'sketch-tool-group-title';
    presetTitle.dataset.i18n = 'presetsTitle';
    presetTitle.textContent = t('presetsTitle');
    presetGroup.appendChild(presetTitle);

    const select = document.createElement('select');
    select.className = 'sketch-preset-select';
    select.style.width = '100%';
    select.style.padding = '8px';
    select.style.background = '#1a1f2c';
    select.style.color = '#ffffff';
    select.style.border = '1px solid #3f4a66';
    select.style.borderRadius = '6px';
    select.style.fontSize = '0.8rem';
    select.style.outline = 'none';

    const options = [
      { value: 'basic', labelKey: 'presetBasic' },
      { value: 'letterP', labelKey: 'presetLetterP' },
      { value: 'ground', labelKey: 'presetGround' },
      { value: 'empty', labelKey: 'presetEmpty' },
    ];

    options.forEach((opt) => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.dataset.i18n = opt.labelKey;
      el.textContent = t(opt.labelKey);
      select.appendChild(el);
    });

    select.value = currentPresetName;

    select.addEventListener('change', () => {
      loadPreset(select.value);
      onChange?.();
    });

    presetGroup.appendChild(select);
    root.appendChild(presetGroup);

    const toolBtns = {};

    function makeToolBtn(id) {
      const meta = TOOL_META[id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sketch-tool-btn' + (meta.cls ? ` ${meta.cls}` : '');
      btn.dataset.tool = id;
      btn.innerHTML = `<span class="sketch-tool-icon">${meta.icon}</span><span data-i18n="${meta.labelKey || 'toolSelect'}"></span>`;
      btn.addEventListener('click', () => {
        handleAction(id);
        refreshToolbar();
        onChange?.();
      });
      toolBtns[id] = btn;
      return btn;
    }

    function makeGroup(titleKey, toolIds, cols = 2) {
      const g = document.createElement('div');
      g.className = 'sketch-tool-group';
      const title = document.createElement('p');
      title.className = 'sketch-tool-group-title';
      title.dataset.i18n = titleKey;
      g.appendChild(title);
      const grid = document.createElement('div');
      grid.className = 'sketch-tool-grid' + (cols === 1 ? ' cols-1' : '');
      toolIds.forEach((id) => grid.appendChild(makeToolBtn(id)));
      g.appendChild(grid);
      root.appendChild(g);
    }

    makeGroup('sketchGroupNav', ['select'], 1);
    makeGroup('sketchGroupPlace', ['mirror', 'object', 'image', 'observer']);
    makeGroup('sketchGroupRays', ['realRay', 'virtualRay']);

    const colorGroup = document.createElement('div');
    colorGroup.className = 'sketch-tool-group ray-color-sketch-group';
    const colorTitle = document.createElement('p');
    colorTitle.className = 'sketch-tool-group-title';
    colorTitle.dataset.i18n = 'rayColorTitle';
    colorGroup.appendChild(colorTitle);
    const refreshColors = mountRayColorUI(colorGroup, {
      getSelectedRays,
      setSelectedRayColors,
      onChange,
    }, { wrapPanel: false, showTitle: false });
    root.appendChild(colorGroup);
    setRayColorRefresh(refreshColors);

    const actions = document.createElement('div');
    actions.className = 'sketch-tool-group';
    const actTitle = document.createElement('p');
    actTitle.className = 'sketch-tool-group-title';
    actTitle.dataset.i18n = 'sketchGroupActions';
    actions.appendChild(actTitle);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-sketch-delete';
    delBtn.innerHTML = '<span data-i18n="deleteSelected"></span>';
    delBtn.addEventListener('click', () => {
      if (!state.selected.size) return;
      handleAction('deleteSelected');
      onChange?.();
    });
    actions.appendChild(delBtn);

    const snapRow = document.createElement('div');
    snapRow.className = 'sketch-action-row';
    snapRow.style.marginTop = '8px';
    const snapLabel = document.createElement('label');
    snapLabel.dataset.i18n = 'gridSnap';
    const snapToggle = document.createElement('button');
    snapToggle.type = 'button';
    snapToggle.className = 'sketch-toggle' + (state.gridSnap ? ' on' : '');
    snapToggle.setAttribute('aria-pressed', state.gridSnap ? 'true' : 'false');
    snapToggle.addEventListener('click', () => {
      handleAction('gridSnap');
      snapToggle.classList.toggle('on', state.gridSnap);
      snapToggle.setAttribute('aria-pressed', state.gridSnap ? 'true' : 'false');
      onChange?.();
    });
    snapRow.appendChild(snapLabel);
    snapRow.appendChild(snapToggle);
    actions.appendChild(snapRow);

    const obsAsPointRow = document.createElement('div');
    obsAsPointRow.className = 'sketch-action-row';
    obsAsPointRow.style.marginTop = '8px';
    const obsLabel = document.createElement('label');
    obsLabel.dataset.i18n = 'observerAsPoint';
    obsLabel.textContent = t('observerAsPoint');
    const obsToggle = document.createElement('button');
    obsToggle.type = 'button';
    obsToggle.className = 'sketch-toggle' + (state.observerAsPoint ? ' on' : '');
    obsToggle.setAttribute('aria-pressed', state.observerAsPoint ? 'true' : 'false');
    obsToggle.addEventListener('click', () => {
      handleAction('observerAsPoint');
      obsToggle.classList.toggle('on', state.observerAsPoint);
      obsToggle.setAttribute('aria-pressed', state.observerAsPoint ? 'true' : 'false');
      onChange?.();
    });
    obsAsPointRow.appendChild(obsLabel);
    obsAsPointRow.appendChild(obsToggle);
    actions.appendChild(obsAsPointRow);

    root.appendChild(actions);

    container.appendChild(root);
    applyI18n(root);

    function refreshToolbar() {
      let hintKey = state.tool === 'select' ? 'sketchHintMarquee' : TOOL_META[state.tool]?.hintKey;
      if (hasSelectedRays()) hintKey = 'rayColorEditHint';
      hintEl.textContent = t(hintKey || 'sketchHintSelect');
      Object.entries(toolBtns).forEach(([id, btn]) => {
        btn.classList.toggle('active', state.tool === id);
      });
      snapToggle.classList.toggle('on', state.gridSnap);
      obsToggle.classList.toggle('on', state.observerAsPoint);
      select.value = currentPresetName;

      refreshColors();

      const summary = selectionSummary();
      if (summary) {
        selValue.textContent = summary;
        selBox.classList.add('has-selection');
        delBtn.disabled = false;
        delBtn.classList.remove('disabled');
      } else {
        selValue.textContent = t('sketchNothingSelected');
        selBox.classList.remove('has-selection');
        delBtn.disabled = true;
        delBtn.classList.add('disabled');
      }
    }
    refreshToolbar();
    refreshToolbarRef = refreshToolbar;
    return refreshToolbar;
  }

  function teardown() {
    if (keyHandler) {
      window.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
    canvasRef = null;
    dragTarget = null;
    dragGroup = null;
    placeDrag = null;
    pointerStart = null;
    marquee = null;
    lastLayout = null;
  }

  return {
    id: 'raySketch',
    hideAnimation: true,
    hideResults: true,
    controlsTitleKey: 'sketchTools',
    init,
    draw,
    compute,
    getControls,
    updateParams,
    preset,
    teardown,
    handleAction,
    buildToolbar,
    getDescription,
    getStats,
    getFormula,
    getSelectedRays,
    setSelectedRayColors,
    get params() {
      const p = { gridSnap: state.gridSnap };
      TOOLS.forEach((tid) => { p[tid] = state.tool === tid; });
      return p;
    },
  };
}


/* --- rayColorControls.js --- */
/** @file Shared ray colour swatch panel for controls sidebar. */


let refreshRayColorPanelRef = null;

function setRayColorRefresh(fn) {
  refreshRayColorPanelRef = fn;
}

function refreshRayColorPanel() {
  refreshRayColorPanelRef?.();
}

/**
 * @param {HTMLElement} parent
 * @param {{ getSelectedRays?: () => object[], setSelectedRayColors?: (hex: string) => void, onChange?: () => void }} handlers
 * @param {{ wrapPanel?: boolean, showTitle?: boolean }} [opts]
 * @returns {() => void} refresh
 */
function mountRayColorUI(parent, handlers, opts = {}) {
  const { wrapPanel = true, showTitle = true } = opts;
  const host = wrapPanel ? document.createElement('div') : parent;
  if (wrapPanel) {
    host.className = 'ray-color-panel control-group';
    parent.appendChild(host);
  }

  if (showTitle) {
    const title = document.createElement('p');
    title.className = wrapPanel ? 'ray-color-title' : 'sketch-tool-group-title';
    title.dataset.i18n = 'rayColorTitle';
    host.appendChild(title);
  }

  const swatchMap = { real: [], virtual: [] };

  function makeRow(kind, labelKey) {
    const row = document.createElement('div');
    row.className = 'ray-color-row';

    const label = document.createElement('span');
    label.className = 'ray-color-label';
    label.dataset.i18n = labelKey;
    row.appendChild(label);

    const swatches = document.createElement('div');
    swatches.className = 'ray-color-swatches';
    swatches.setAttribute('role', 'group');
    swatches.setAttribute('aria-label', t(labelKey));

    RAY_COLOR_PRESETS.forEach((hex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ray-color-swatch';
      btn.style.backgroundColor = hex;
      btn.dataset.color = hex;
      btn.dataset.kind = kind;
      btn.title = hex;
      btn.addEventListener('click', () => {
        const selected = handlers.getSelectedRays?.() || [];
        if (selected.length) {
          handlers.setSelectedRayColors?.(hex);
        } else {
          setRayColor(kind, hex);
        }
        refresh();
        handlers.onChange?.();
      });
      swatches.appendChild(btn);
      swatchMap[kind].push(btn);
    });

    row.appendChild(swatches);
    host.appendChild(row);
  }

  makeRow('real', 'rayColorReal');
  makeRow('virtual', 'rayColorVirtual');

  function refresh() {
    const colors = getRayColors();
    const selected = handlers.getSelectedRays?.() || [];

    ['real', 'virtual'].forEach((kind) => {
      swatchMap[kind].forEach((btn) => {
        const hex = btn.dataset.color;
        let active = false;
        if (selected.length) {
          active = selected.every((r) => (r.color ?? getRayColor(r.kind)) === hex);
        } else {
          active = colors[kind] === hex;
        }
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  }

  if (wrapPanel || showTitle) applyI18n(host);
  refresh();
  return refresh;
}

function buildRayColorControls(container, handlers) {
  const refresh = mountRayColorUI(container, handlers);
  setRayColorRefresh(refresh);
  return refresh;
}


/* --- app.js --- */









const SCENARIOS = [
  createImageFormationScenario(),
  createMinMirrorLengthScenario(),
  createMinMirrorHeightScenario(),
  createSeeBackObjectScenario(),
  createAngledMirrorsScenario(),
  createRaySketchScenario(),
];

const TAB_KEYS = [
  'imageFormation', 'minLength', 'minHeight', 'seeBack', 'angledMirrors', 'raySketch',
];

let currentIdx = 0;
let currentSub = null;

const els = {
  canvas: null,
  canvasTop: null,
  controls: null,
  stats: null,
  formula: null,
  formulaLatex: null,
  desc: null,
  subTabs: null,
  vizPanel: null,
  sceneBadge: null,
};

function getScenario() { return SCENARIOS[currentIdx]; }

/**
 * Build LaTeX from compute() — numbers update when sliders/drag change (teaching feedback loop).
 * Falls back to plain text in #formula if KaTeX CDN unavailable (offline file://).
 */
function buildLatex(sc, c) {
  const id = sc.id;
  switch (id) {
    case 'imageFormation':
      return [
        '\\begin{aligned}',
        `u &= ${c.u.toFixed(2)}\\,\\mathrm{m},\\quad v = ${c.v.toFixed(2)}\\,\\mathrm{m} \\\\[4pt]`,
        'u &= v \\\\[4pt]',
        `u + v &= ${(c.u + c.v).toFixed(2)}\\,\\mathrm{m}`,
        '\\end{aligned}',
      ].join('\n');
    case 'minLength':
      return [
        '\\begin{aligned}',
        `p &= \\tfrac{H}{2} = ${c.req.length.toFixed(2)}\\,\\mathrm{m} \\\\`,
        `q &= \\tfrac{h}{2} = ${c.req.bottom.toFixed(2)}\\,\\mathrm{m} \\\\`,
        `y_{\\mathrm{top}} &= \\tfrac{H+h}{2} = ${c.req.top.toFixed(2)}\\,\\mathrm{m}`,
        '\\end{aligned}',
      ].join('\n');
    case 'minHeight':
      if (c.mode === 'feet') {
        return `\\begin{aligned} 2y &= h_{\\mathrm{eye}} \\\\ y &= ${c.y.toFixed(2)}\\,\\mathrm{m} \\end{aligned}`;
      }
      if (c.mode === 'cockroach') {
        return `\\tfrac{y}{h-y} = \\tfrac{d_{\\mathrm{obj}}}{d_{\\mathrm{eye}}},\\; y = ${c.y.toFixed(2)}\\,\\mathrm{m}`;
      }
      return `p \\geq ${(c.req.minP * 100).toFixed(0)}\\,\\mathrm{cm}`;
    case 'seeBack':
      return c.mode === 'ceiling'
        ? '\\tfrac{h}{d_E} = \\tfrac{1}{d_E + d_L},\\; y_{\\mathrm{mirror}} = 1.83\\,\\mathrm{m}'
        : '\\tfrac{0.2}{1} = \\tfrac{h - 1.6}{5} \\Rightarrow h = 2.6\\,\\mathrm{m}';
    case 'angledMirrors': {
      const th = sc.params ? sc.params.theta : 45;
      return `n = \\dfrac{360^{\\circ}}{\\theta} - 1 = \\dfrac{360^{\\circ}}{${th}} - 1 = ${c.nFormula}`;
    }
    case 'raySketch':
      return '\\theta_i = \\theta_r';
    default:
      return null;
  }
}

function renderFormulaPanel(latexEl, fallbackEl, latex, fallbackText, opts = {}) {
  const katex = typeof window !== 'undefined' ? window.katex : null;
  if (latexEl && latex && katex?.renderToString) {
    try {
      latexEl.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: true });
      latexEl.hidden = false;
      if (fallbackEl) {
        fallbackEl.textContent = fallbackText || '';
        fallbackEl.hidden = !opts.keepFallback;
      }
      return;
    } catch (_) { /* plain text */ }
  }
  if (latexEl) latexEl.hidden = true;
  if (fallbackEl) {
    fallbackEl.textContent = fallbackText || '';
    fallbackEl.hidden = false;
  }
}

function buildTabs() {
  const bar = document.getElementById('tabBar');
  bar.innerHTML = '';
  TAB_KEYS.forEach((key, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn' + (i === currentIdx ? ' active' : '');
    btn.dataset.i18n = `tabs.${key}`;
    btn.addEventListener('click', () => switchScenario(i));
    bar.appendChild(btn);
  });
  applyI18n(bar);
}

function buildSubTabs(scenario) {
  if (!els.subTabs) return;
  els.subTabs.innerHTML = '';
  if (!scenario.getSubTabs) {
    els.subTabs.style.display = 'none';
    currentSub = null;
    return;
  }
  els.subTabs.style.display = 'flex';
  const subs = scenario.getSubTabs();
  if (!currentSub || !subs.includes(currentSub)) currentSub = subs[0];
  subs.forEach((sub) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sub-tab-btn' + (sub === currentSub ? ' active' : '');
    btn.dataset.i18n = `sub.${sub}`;
    btn.addEventListener('click', () => {
      currentSub = sub;
      scenario.setSub(sub);
      buildSubTabs(scenario);
      rebuildControls();
      render();
    });
    els.subTabs.appendChild(btn);
  });
  applyI18n(els.subTabs);
}

function updateAnimPanel() {
  const panel = document.getElementById('animPanel');
  if (panel) panel.style.display = getScenario().hideAnimation ? 'none' : '';
}

function updateResultsPanel() {
  const sc = getScenario();
  const hide = !!sc.hideResults;
  const title = document.getElementById('resultsTitle');
  const stats = document.getElementById('stats');
  if (title) {
    title.style.display = hide ? 'none' : '';
    title.dataset.i18n = hide ? 'formulaLive' : 'results';
    if (!hide) title.textContent = t('results');
  }
  if (stats) stats.style.display = hide ? 'none' : '';
}

function pauseAllAnimators() {
  SCENARIOS.forEach((s) => {
    const anim = s.getAnimator?.();
    if (anim) {
      anim.pause();
      anim.onUpdate = null;
    }
  });
}

/** Clear stale canvas refs / listeners before destroying the canvas element. */
function teardownAllScenarios() {
  pauseAllAnimators();
  SCENARIOS.forEach((s) => s.teardown?.());
}

function switchScenario(i) {
  if (i < 0 || i >= SCENARIOS.length) return;

  teardownAllScenarios();

  currentIdx = i;
  const sc = getScenario();
  const subs = sc.getSubTabs?.();
  currentSub = subs ? subs[0] : null;

  buildTabs();
  setupCanvas();
  sc.preset();

  if (subs) sc.setSub(currentSub);

  buildSubTabs(sc);
  sc.getAnimator?.()?.reset?.();
  rebuildControls();
  updateAnimPanel();
  updateResultsPanel();
  render();
}

function setupCanvas() {
  const sc = getScenario();
  const panel = els.vizPanel;

  /* 保留 viz-chrome（場景徽章 + 操作提示），只替換 canvas 區域 */
  let chrome = panel.querySelector('.viz-chrome');
  if (!chrome) {
    chrome = document.createElement('div');
    chrome.className = 'viz-chrome';
    chrome.innerHTML = '<span class="scene-badge" id="sceneBadge" aria-live="polite"></span>'
      + '<span class="viz-hint" id="vizHint" data-i18n="vizHint"></span>';
    panel.insertBefore(chrome, panel.firstChild);
    applyI18n(chrome);
  }
  els.sceneBadge = document.getElementById('sceneBadge');

  let wrap = document.getElementById('vizCanvasWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'viz-canvas-wrap';
    wrap.id = 'vizCanvasWrap';
    const legend = panel.querySelector('.viz-legend');
    panel.insertBefore(wrap, legend || null);
  }
  wrap.innerHTML = '';

  if (sc.dualCanvas) {
    const dual = document.createElement('div');
    dual.className = 'dual-canvas';
    const c1 = document.createElement('canvas');
    const c2 = document.createElement('canvas');
    c1.id = 'simCanvas';
    c2.id = 'simCanvasTop';
    dual.appendChild(c1);
    dual.appendChild(c2);
    wrap.appendChild(dual);
    els.canvas = c1;
    els.canvasTop = c2;
    sc.init(c1, c2);
  } else {
    const c = document.createElement('canvas');
    c.id = 'simCanvas';
    c.setAttribute('aria-label', 'Optics simulation');
    wrap.appendChild(c);
    els.canvas = c;
    els.canvasTop = null;
    sc.init(c);
  }
}

function syncLegendRayColors() {
  const colors = getRayColors();
  document.getElementById('legendRealStroke')?.setAttribute('stroke', colors.real);
  document.getElementById('legendRealFill')?.setAttribute('fill', colors.real);
  document.getElementById('legendVirtualStroke')?.setAttribute('stroke', colors.virtual);
}

function handleRayColorChange() {
  syncLegendRayColors();
  refreshRayColorPanel();
  getScenario()._refreshToolbar?.();
  updateResults();
  render();
}

function rebuildControls() {
  const sc = getScenario();
  els.controls.innerHTML = '';

  const controlsPanel = els.controls.closest('.panel-section');
  const controlsTitle = controlsPanel?.querySelector('.panel-title');
  if (controlsTitle) {
    const key = sc.controlsTitleKey || 'controls';
    controlsTitle.dataset.i18n = key;
    controlsTitle.textContent = t(key);
  }

  sc._refreshRayColors = sc.id !== 'raySketch'
    ? buildRayColorControls(els.controls, {
      getSelectedRays: () => sc.getSelectedRays?.() || [],
      setSelectedRayColors: (hex) => sc.setSelectedRayColors?.(hex),
      onChange: handleRayColorChange,
    })
    : null;

  sc.getControls().forEach((ctrl) => {
    const g = document.createElement('div');
    g.className = 'control-group';
    const id = `ctrl-${ctrl.id}`;
    const displayValue = ctrl.valueMap
      ? ctrl.valueMap[Math.round(ctrl.value)]
      : ctrl.value;
    g.innerHTML = `
      <div class="label-row">
        <span data-i18n="${ctrl.labelKey}"></span>
        <span class="badge" id="${id}-val">${displayValue}${ctrl.unit || ''}</span>
      </div>
    `;
    if (ctrl.options) {
      const select = document.createElement('select');
      select.id = id;
      select.className = 'control-select';
      ctrl.options.forEach((opt) => {
        const o = document.createElement('option');
        o.value = String(opt);
        o.textContent = `${opt}${ctrl.unit || ''}`;
        if (opt === ctrl.value) o.selected = true;
        select.appendChild(o);
      });
      g.appendChild(select);
      select.addEventListener('change', () => {
        const v = parseFloat(select.value);
        sc.updateParams(ctrl.id, v);
        g.querySelector('.badge').textContent = `${v}${ctrl.unit || ''}`;
        updateResults();
        render();
      });
    } else {
      g.innerHTML += `
        <input type="range" id="${id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${ctrl.value}">
      `;
      const slider = g.querySelector('input');
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        sc.updateParams(ctrl.id, v);
        const shown = ctrl.valueMap ? ctrl.valueMap[Math.round(v)] : v;
        g.querySelector('.badge').textContent = `${shown}${ctrl.unit || ''}`;
        updateResults();
        render();
      });
    }
    els.controls.appendChild(g);
  });

  if (sc.buildToolbar) {
    sc._refreshToolbar = sc.buildToolbar(els.controls, () => {
      refreshRayColorPanel();
      updateResults();
      render();
    });
    const colorPanel = els.controls.querySelector('.ray-color-panel');
    if (colorPanel && colorPanel !== els.controls.firstElementChild) {
      els.controls.insertBefore(colorPanel, els.controls.firstElementChild);
    }
  } else if (sc.extraToggles) {
    const row = document.createElement('div');
    row.className = 'btn-row';
    sc.extraToggles.forEach((tog) => {
      const btn = document.createElement('button');
      const isOn = (p) => p[tog.id] !== false;
      btn.className = 'btn' + (isOn(sc.params || {}) ? ' btn-primary' : '');
      btn.dataset.i18n = tog.labelKey;
      btn.textContent = t(tog.labelKey);
      btn.addEventListener('click', () => {
        const cur = sc.params?.[tog.id] !== false;
        sc.updateParams(tog.id, !cur);
        btn.classList.toggle('btn-primary', !cur);
        render();
      });
      row.appendChild(btn);
    });
    els.controls.appendChild(row);
    applyI18n(row);
  }

  if (!sc.buildToolbar && sc.extraButtons) {
    const row = document.createElement('div');
    row.className = 'btn-row';
    sc.extraButtons.forEach((btnDef) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-accent';
      btn.dataset.i18n = btnDef.labelKey;
      if (btnDef.toggle) {
        let on = sc.params?.[btnDef.id] === true;
        btn.classList.toggle('btn-primary', on);
        btn.addEventListener('click', () => {
          if (sc.handleAction) sc.handleAction(btnDef.id);
          else {
            on = !on;
            sc.updateParams(btnDef.id, on);
          }
          rebuildControls();
          updateResults();
          render();
        });
      } else {
        btn.addEventListener('click', () => {
          if (sc.handleAction) sc.handleAction(btnDef.id);
          else sc.updateParams(btnDef.id, true);
          updateResults();
          render();
        });
      }
      row.appendChild(btn);
    });
    els.controls.appendChild(row);
    applyI18n(row);
  }

  applyI18n(els.controls);
  syncLegendRayColors();
}

function updateSceneBadge() {
  const sc = getScenario();
  if (els.sceneBadge) {
    els.sceneBadge.textContent = t(`concept.${TAB_KEYS[currentIdx]}`) || '';
  }
}

function updateResults() {
  const sc = getScenario();
  const c = sc.compute();
  updateResultsPanel();
  els.stats.innerHTML = '';
  if (!sc.hideResults) {
    (sc.getStats(c) || []).forEach((row) => {
    const div = document.createElement('div');
    div.className = 'stat-row';
    const valCls = row.ok ? 'ok' : row.fail ? 'fail' : '';
    div.innerHTML = `<span>${row.label}</span><span class="stat-val ${valCls}">${row.value}</span>`;
    els.stats.appendChild(div);
    });
  }
  const fallback = sc.getFormula(c) || '';
  const latex = buildLatex(sc, c);
  renderFormulaPanel(els.formulaLatex, els.formula, latex, fallback, {
    keepFallback: sc.id === 'raySketch',
  });
  els.desc.textContent = sc.getDescription();
  updateSceneBadge();
}

function render() {
  const sc = getScenario();
  if (sc.dualCanvas) sc.draw(els.canvas, els.canvasTop);
  else sc.draw(els.canvas);
  updateResults();
}

function bindAnim() {
  document.getElementById('btnPlay').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    if (!anim?.play) return;
    anim.play();
  });
  document.getElementById('btnPause').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.pause?.();
    render();
  });
  document.getElementById('btnStep').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.stepNext?.();
    render();
  });
  document.getElementById('btnShowAll').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.showAll?.();
    render();
  });
  document.getElementById('btnReplay').addEventListener('click', () => {
    const sc = getScenario();
    if (sc.replayAnimation) {
      sc.replayAnimation();
    } else {
      const anim = sc.getAnimator?.();
      anim?.reset?.();
      anim?.play?.();
    }
    render();
  });
}

function bindReset() {
  document.getElementById('btnReset').addEventListener('click', () => {
    getScenario().preset();
    rebuildControls();
    getScenario().getAnimator?.()?.reset?.();
    render();
  });
}

function refreshLangUi() {
  applyI18n();
  buildTabs();
  const sc = getScenario();
  buildSubTabs(sc);
  rebuildControls();
  updateResults();
  applyI18n(document.getElementById('legendPanel'));
  render();
}

function bindLangToggle() {
  const handler = () => {
    toggleLang();
    refreshLangUi();
  };
  document.getElementById('langToggle')?.addEventListener('click', handler);
}

function bindHubLangSync() {
  window.addEventListener('message', (ev) => {
    if (ev.data?.type !== 's3phy:lang') return;
    const next = hubLangToLocal(ev.data.lang);
    if (next === getLang()) return;
    setLang(next);
    refreshLangUi();
  });
}

function init() {
  els.controls = document.getElementById('controls');
  els.stats = document.getElementById('stats');
  els.formula = document.getElementById('formula');
  els.formulaLatex = document.getElementById('formulaLatex');
  els.desc = document.getElementById('desc');
  els.subTabs = document.getElementById('subTabs');
  els.vizPanel = document.getElementById('vizPanel');
  els.sceneBadge = document.getElementById('sceneBadge');

  initLangFromLocation();
  bindLangToggle();
  bindHubLangSync();

  applyI18n();
  buildTabs();
  setupCanvas();
  const sc = getScenario();
  if (sc.getSubTabs) {
    currentSub = sc.getSubTabs()[0];
    sc.setSub(currentSub);
  }
  buildSubTabs(sc);
  rebuildControls();
  updateAnimPanel();
  updateResultsPanel();
  bindAnim();
  bindReset();
  syncLegendRayColors();
  render();

  window.addEventListener('resize', () => render());
}

document.addEventListener('DOMContentLoaded', init);

