import { reflectPoint, sightRayVertical, formatLength } from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid, drawGround,
  drawVerticalMirror, drawPerson, drawLegend, COLORS,
} from '../canvasView.js';
import { RayAnimator } from '../rayAnimator.js';
import { PLANE_MIRROR_SIGHT_STEPS, drawPlaneMirrorSightRays } from '../planeMirrorSight.js';
import { t, getLang } from '../i18n.js';
import { getRayColor } from '../rayColors.js';

const defaults = () => ({
  u: 2.0,
  H: 1.6,
  hEye: 1.5,
  moved: false,
});

export function createImageFormationScenario() {
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
