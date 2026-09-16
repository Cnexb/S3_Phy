import {
  mirrorHeightForFloorObject, canSeeFullBody, minMirrorForBody, sightRayVertical, formatLength,
} from '../geometry.js';
import {
  createWorldView, resizeCanvasToDisplay, computeTransform, clear, drawGrid, drawGround,
  drawVerticalMirror, drawArrow, drawPerson, drawPoint, drawLabel, COLORS,
} from '../canvasView.js';
import { RayAnimator } from '../rayAnimator.js';
import { t, getLang } from '../i18n.js';

export function createMinMirrorHeightScenario() {
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
