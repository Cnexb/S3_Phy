import {
  mirrorHeightForCeilingLight, maxHeightOnBackWall, virtualSightOnVerticalMirror, formatLength,
} from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid, drawGround,
  drawVerticalMirror, drawWall, drawArrow, drawPoint, drawLabel, COLORS,
} from '../canvasView.js';
import { RayAnimator, STEPS_PER_RAY } from '../rayAnimator.js';
import { getLang } from '../i18n.js';
import { getRayColor } from '../rayColors.js';

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

export function createSeeBackObjectScenario() {
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
