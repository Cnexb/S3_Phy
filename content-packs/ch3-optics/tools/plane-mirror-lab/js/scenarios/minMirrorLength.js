import { sightRayVertical, minMirrorForBody, formatLength } from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid, drawGround,
  drawVerticalMirror, drawPerson, COLORS,
} from '../canvasView.js';
import { RayAnimator } from '../rayAnimator.js';
import { PLANE_MIRROR_SIGHT_STEPS, drawPlaneMirrorSightRays } from '../planeMirrorSight.js';
import { t, getLang } from '../i18n.js';

export function createMinMirrorLengthScenario() {
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
