import { reflectPoint, segmentIntersection } from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid,
  drawHorizontalMirror, drawArrow, drawPoint, drawWall, drawLabel, COLORS,
} from '../canvasView.js';
import { RayAnimator } from '../rayAnimator.js';
import { t, getLang } from '../i18n.js';
import { getRayColor } from '../rayColors.js';

const DEFAULT_OBJECTS = [
  { id: 'I', x: 2, y: 2.5, visible: true },
  { id: 'II', x: 4, y: 1.5, visible: true },
  { id: 'III', x: 1, y: 0.8, visible: true, direct: true },
  { id: 'IV', x: 3, y: -0.5, visible: false, behind: true },
];

export function createFieldOfViewScenario() {
  let objects = DEFAULT_OBJECTS.map((o) => ({ ...o }));
  let viewer = { x: 1, y: 1.2 };
  const mirrorY = 0;
  const mirrorX0 = 0;
  const mirrorX1 = 6;
  const wallX = 5.5;
  let view = null;
  let animator = new RayAnimator();
  let dragTarget = null;

  function computeVisibility(obj) {
    if (obj.direct) return { visible: true, reason: 'direct' };
    if (obj.behind) return { visible: false, reason: 'behind' };
    const image = reflectPoint({ x: obj.x, y: obj.y }, { x: mirrorX0, y: mirrorY }, { x: mirrorX1, y: mirrorY });
    const hit = segmentIntersection(viewer, image, { x: mirrorX0, y: mirrorY }, { x: mirrorX1, y: mirrorY });
    if (!hit) return { visible: false, reason: 'miss' };
    const wallHit = segmentIntersection(viewer, image, { x: wallX, y: -1 }, { x: wallX, y: 4 });
    if (wallHit && wallHit.t < hit.t) return { visible: false, reason: 'blocked' };
    return { visible: true, image, hit, reason: 'mirror' };
  }

  function compute() {
    return objects.map((o) => ({ ...o, ...computeVisibility(o) }));
  }

  function getControls() {
    return [];
  }

  function preset() {
    objects = DEFAULT_OBJECTS.map((o) => ({ ...o }));
    viewer = { x: 1, y: 1.2 };
  }

  function updateParams() {}

  function getDescription() {
    return getLang() === 'zh'
      ? '對每個物件作虛像，連線至觀察者 A。經鏡面且未被牆遮擋則可見。'
      : 'Form virtual images and sight lines to observer A. Visible if ray hits mirror and is not blocked.';
  }

  function getStats(c) {
    const vis = c.filter((o) => o.visible).map((o) => o.id).join(', ');
    const hid = c.filter((o) => !o.visible).map((o) => o.id).join(', ');
    return [
      { label: t('visible'), value: vis || '—', ok: true },
      { label: t('hidden'), value: hid || '—', fail: !!hid },
    ];
  }

  function getFormula() {
    return getLang() === 'zh' ? '虛像距離 = 物距（對鏡面）' : 'Image distance = object distance from mirror';
  }

  function bindPointer(canvas) {
    const getWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const txf = computeTransform(view, rect.width, rect.height);
      return { x: (sx - txf.ox) / txf.pxPerM, y: (txf.oy - sy) / txf.pxPerM };
    };

    const onDown = (e) => {
      e.preventDefault();
      const world = getWorld(e.clientX, e.clientY);
      if (Math.hypot(world.x - viewer.x, world.y - viewer.y) < 0.35) dragTarget = 'viewer';
      else {
        const obj = objects.find((o) => Math.hypot(world.x - o.x, world.y - o.y) < 0.35);
        if (obj) dragTarget = obj.id;
      }
      if (dragTarget && canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (!dragTarget) return;
      e.preventDefault();
      const world = getWorld(e.clientX, e.clientY);
      if (dragTarget === 'viewer') viewer = world;
      else {
        const obj = objects.find((o) => o.id === dragTarget);
        if (obj) { obj.x = world.x; obj.y = world.y; }
      }
      draw(canvas);
    };

    const onUp = (e) => {
      dragTarget = null;
      if (canvas.releasePointerCapture) {
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      }
    };

    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
  }

  function init(canvas) {
    view = createWorldView(canvas, { worldBounds: { xMin: -0.5, xMax: 7, yMin: -1, yMax: 3.5 } });
    animator.onUpdate = () => draw(canvas);
    bindPointer(canvas);
  }

  function draw(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const results = compute();
    const txf = computeTransform(view, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, view, txf, w, h);
    drawHorizontalMirror(ctx, view, txf, mirrorY, mirrorX0, mirrorX1);
    drawWall(ctx, view, txf, wallX, -1, 4);

    const progress = animator.progress;
    results.forEach((obj, i) => {
      const col = obj.visible ? COLORS.visible : COLORS.hidden;
      drawPoint(ctx, view, txf, { x: obj.x, y: obj.y }, 7, col, obj.id);
      if (obj.image && progress > 0.2) {
        drawPoint(ctx, view, txf, obj.image, 5, COLORS.image, `${obj.id}'`);
        if (progress > 0.4) {
          drawArrow(ctx, view, txf, viewer, obj.image, {
            dashed: true,
            color: obj.visible ? getRayColor('virtual') : COLORS.mirrorFail,
            progress: Math.min(1, (progress - 0.4) * 2),
          });
        }
      }
    });
    drawPoint(ctx, view, txf, viewer, 7, COLORS.eye, 'A');
  }

  return {
    id: 'fieldOfView', init, draw, compute, getControls, updateParams, preset, getDescription, getStats, getFormula,
    getAnimator: () => animator,
  };
}
