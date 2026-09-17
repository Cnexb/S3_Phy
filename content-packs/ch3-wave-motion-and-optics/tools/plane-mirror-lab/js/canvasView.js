/** @file Canvas drawing helpers — colours map 1:1 to styles.css legend & SVG icons. */
import { Vec2 } from './geometry.js';
import { getRayColor } from './rayColors.js';

/**
 * Optical colour semantics (HKDSE ray diagrams):
 * - mirror: plane mirror surface
 * - rayReal: incident/reflected rays (solid)
 * - rayVirtual: extensions behind mirror / virtual images (dashed)
 * - mirrorNeed: minimum required mirror segment (exam highlight)
 */
export const COLORS = {
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

export function createWorldView(canvas, opts = {}) {
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
export function getCanvasLayout(canvas) {
  const rect = canvas.getBoundingClientRect();
  return { w: rect.width, h: rect.height, rect };
}

export function isFullscreen() {
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    if (window.parent && (window.parent.document.fullscreenElement || window.parent.document.webkitFullscreenElement)) return true;
    if (window.parent && window.parent.document.getElementById('app')?.classList.contains('is-lab-fullscreen')) return true;
  } catch (e) {}
  return window.innerHeight > 650 && document.documentElement.classList.contains('s3phy-embed');
}

export function resizeCanvasToDisplay(canvas, opts = {}) {
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
export function clientToWorld(view, layout, clientX, clientY) {
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

export function computeTransform(view, canvasW, canvasH) {
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

export function toScreen(view, t, p) {
  return { x: t.ox + p.x * t.pxPerM, y: t.oy - p.y * t.pxPerM };
}

export function toWorld(view, t, sx, sy) {
  return { x: (sx - t.ox) / t.pxPerM, y: (t.oy - sy) / t.pxPerM };
}

export function clear(ctx, w, h) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);
}

export function drawGrid(ctx, view, t, w, h) {
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
export function drawPolarWedgeGrid(ctx, view, t, opts = {}) {
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

export function drawGround(ctx, view, t, y = 0) {
  const p0 = toScreen(view, t, { x: view.worldBounds.xMin, y });
  const p1 = toScreen(view, t, { x: view.worldBounds.xMax, y });
  ctx.strokeStyle = COLORS.ground;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

export function drawVerticalMirror(ctx, view, t, x, y0, y1, color = COLORS.mirror, width = 4) {
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

export function drawHorizontalMirror(ctx, view, t, y, x0, x1, color = COLORS.mirror) {
  const p0 = toScreen(view, t, { x: x0, y });
  const p1 = toScreen(view, t, { x: x1, y });
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

export function drawWall(ctx, view, t, x, y0, y1) {
  drawVerticalMirror(ctx, view, t, x, y0, y1, COLORS.wall, 3);
}

export function drawEyeSideView(ctx, cx, cy, r = 12, facingRight = true) {
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

export function drawPoint(ctx, view, t, p, r = 5, color = COLORS.accent, label = '', forcePoint = false) {
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

export function drawLabel(ctx, x, y, text, color = COLORS.label, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

export function drawArrow(ctx, view, t, from, to, opts = {}) {
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

export function drawArrowBody(ctx, view, t, y0, y1, x, dashed = false) {
  drawArrow(ctx, view, t, { x, y: y0 }, { x, y: y1 }, {
    color: COLORS.object,
    width: 3,
    dashed,
    head: true,
  });
}

export function drawPerson(ctx, view, t, x, h, hEye, labels = {}) {
  drawGround(ctx, view, t);
  drawArrowBody(ctx, view, t, 0, h, x);
  const eye = { x, y: hEye };
  drawPoint(ctx, view, t, eye, 6, COLORS.eye, labels.E || 'E');
  drawPoint(ctx, view, t, { x, y: h }, 5, COLORS.object, labels.A || 'A');
  drawPoint(ctx, view, t, { x, y: 0 }, 5, COLORS.object, labels.B || 'B');
  return { top: { x, y: h }, eye, foot: { x, y: 0 } };
}

export function drawLegend(ctx, x, y, items) {
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
export function drawMirrorSegment(ctx, view, t, a, b, color = COLORS.mirror, width = 4, selected = false) {
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
export function drawBar(ctx, view, t, a, b, opts = {}) {
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
