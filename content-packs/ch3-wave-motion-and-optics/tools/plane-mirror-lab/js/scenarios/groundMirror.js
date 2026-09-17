import { groundMirrorSpeed, formatLength } from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid, drawGround,
  drawHorizontalMirror, drawArrow, drawPoint, drawLabel, COLORS,
} from '../canvasView.js';
import { getRayColor } from '../rayColors.js';

export function createGroundMirrorScenario() {
  let params = { hEye: 1.5, mirrorWidth: 0.6, cloudHeight: 3000, time: 20 };
  let viewSide = null;
  let viewTop = null;
  let canvasSideRef = null;
  let canvasTopRef = null;
  let animT = 1;
  let playing = false;
  let raf = null;

  function compute() {
    const { distance, speed } = groundMirrorSpeed(params.hEye, params.mirrorWidth, params.cloudHeight, params.time);
    return { ...params, distance, speed };
  }

  function getControls() {
    return [
      { id: 'hEye', labelKey: 'eyeHeight', min: 1, max: 2, step: 0.05, value: params.hEye, unit: 'm' },
      { id: 'mirrorWidth', labelKey: 'mirrorWidth', min: 0.2, max: 1.5, step: 0.05, value: params.mirrorWidth, unit: 'm' },
      { id: 'cloudHeight', labelKey: 'cloudHeight', min: 500, max: 5000, step: 50, value: params.cloudHeight, unit: 'm' },
      { id: 'time', labelKey: 'time', min: 5, max: 60, step: 1, value: params.time, unit: 's' },
    ];
  }

  function preset() { params = { hEye: 1.5, mirrorWidth: 0.6, cloudHeight: 3000, time: 20 }; }
  function updateParams(id, v) { params[id] = v; }

  function getDescription() {
    return getLang() === 'zh'
      ? '（Q25）地面鏡：0.6/1.5 = x/(3000+1.5) → x ≈ 1200.6 m，速度 ≈ 60 m/s'
      : '(Q25) Ground mirror: span x ≈ 1200.6 m, speed ≈ 60 m/s';
  }

  function getStats(c) {
    const lang = getLang();
    return [
      { label: t('cloudDistance'), value: `${c.distance.toFixed(1)} m` },
      { label: t('cloudSpeed'), value: `${c.speed.toFixed(1)} m/s` },
    ];
  }

  function getFormula(c) {
    return getLang() === 'zh'
      ? `${c.mirrorWidth}/${c.hEye} = x/(${c.cloudHeight}+${c.hEye})\nx = ${c.distance.toFixed(1)} m\nv = x/t = ${c.speed.toFixed(1)} m/s`
      : `${c.mirrorWidth}/${c.hEye} = x/${c.cloudHeight + c.hEye}\nv = ${c.speed.toFixed(1)} m/s`;
  }

  function init(canvasSide, canvasTop) {
    canvasSideRef = canvasSide;
    canvasTopRef = canvasTop;
    viewSide = createWorldView(canvasSide, { worldBounds: { xMin: -1, xMax: 5, yMin: 0, yMax: 3200 }, showGrid: false });
    viewTop = createWorldView(canvasTop, { worldBounds: { xMin: -2, xMax: 8, yMin: -2, yMax: 2 }, showGrid: true });
  }

  function playAnim() {
    if (playing) return;
    playing = true;
    animT = 0;
    const tick = () => {
      animT = Math.min(1, animT + 0.008);
      draw(canvasSideRef, canvasTopRef);
      if (animT < 1) raf = requestAnimationFrame(tick);
      else { playing = false; raf = null; }
    };
    raf = requestAnimationFrame(tick);
  }

  function draw(canvasSide, canvasTop) {
    if (canvasSide) canvasSideRef = canvasSide;
    if (canvasTop) canvasTopRef = canvasTop;
    if (!canvasSideRef || !canvasTopRef) return;
    drawSide(canvasSideRef);
    drawTop(canvasTopRef);
  }

  function drawSide(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    const txf = computeTransform(viewSide, w, h);
    clear(ctx, w, h);
    drawGround(ctx, viewSide, txf);
    const mirrorY = 0;
    const half = c.mirrorWidth / 2;
    drawHorizontalMirror(ctx, viewSide, txf, mirrorY, -half, half);
    const eye = { x: 0, y: c.hEye };
    drawPoint(ctx, viewSide, txf, eye, 6, COLORS.eye, 'E');
    const cloudX = -c.cloudHeight * 0.3;
    const cloud = { x: cloudX, y: c.cloudHeight };
    drawPoint(ctx, viewSide, txf, cloud, 8, '#94a3b8', 'Cloud');

    const span = c.distance * animT;
    drawArrow(ctx, viewSide, txf, { x: -half, y: mirrorY + 0.02 }, { x: -half + span * 0.001, y: c.cloudHeight }, {
      color: getRayColor('virtual'), dashed: true, width: 1.5,
    });
    drawArrow(ctx, viewSide, txf, eye, { x: half, y: mirrorY + 0.02 }, { color: getRayColor('real'), width: 1.5 });
    drawArrow(ctx, viewSide, txf, eye, { x: -half, y: mirrorY + 0.02 }, { color: getRayColor('real'), width: 1.5 });
  }

  function drawTop(canvas) {
    const { w, h, ctx } = resizeCanvasToDisplay(canvas);
    const c = compute();
    const txf = computeTransform(viewTop, w, h);
    clear(ctx, w, h);
    drawGrid(ctx, viewTop, txf, w, h);
    const half = c.mirrorWidth / 2;
    drawHorizontalMirror(ctx, viewTop, txf, 0, -half, half);
    drawPoint(ctx, viewTop, txf, { x: 0, y: 0.5 }, 6, COLORS.eye, 'E');
    const cloudPos = -2 + c.distance * 0.003 * animT;
    drawPoint(ctx, viewTop, txf, { x: cloudPos, y: 0 }, 7, '#94a3b8', 'Image');
    drawLabel(ctx, txf.ox + 4 * txf.pxPerM, txf.oy - 1.5 * txf.pxPerM, `x = ${c.distance.toFixed(0)} m`, COLORS.label);
  }

  return {
    id: 'groundMirror',
    dualCanvas: true,
    init, draw, compute, getControls, updateParams, preset, getDescription, getStats, getFormula,
    playAnim,
    getAnimator: () => ({
      play: playAnim,
      showAll: () => { animT = 1; playing = false; draw(canvasSideRef, canvasTopRef); },
      reset: () => { animT = 0; playing = false; },
      get playing() { return playing; },
      get progress() { return animT; },
    }),
  };
}
