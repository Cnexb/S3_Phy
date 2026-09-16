import { imagesInWedge, Vec2, deg2rad, clamp } from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawPolarWedgeGrid,
  drawArrow, drawPoint, drawLabel, COLORS,
} from '../canvasView.js';
import { RayAnimator } from '../rayAnimator.js';
import { t, getLang, applyI18n } from '../i18n.js';
import { getRayColor, resolveRayColor } from '../rayColors.js';

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

export function createAngledMirrorsScenario() {
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
