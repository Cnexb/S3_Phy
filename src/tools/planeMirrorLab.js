import { createLabIframe } from './createLabIframe.js';

const CACHE = '20261020_muted2';

/**
 * One plane-mirror activity. `scene` matches a tab key in the lab.
 * @param {(key: string) => string} t
 * @param {string} scene
 * @param {string} titleKey
 */
function createPlaneMirrorScene(t, scene, titleKey) {
  return createLabIframe(t, {
    slug: 'plane-mirror-lab',
    titleKey,
    className: 'tool-plane-mirror-lab',
    extraParams: () => `&scene=${encodeURIComponent(scene)}&v=${CACHE}`,
  });
}

export function createPlaneMirrorImageLab(t) {
  return createPlaneMirrorScene(t, 'imageFormation', 'tools.planeMirror.image.title');
}

export function createPlaneMirrorMinLengthLab(t) {
  return createPlaneMirrorScene(t, 'minLength', 'tools.planeMirror.minLength.title');
}

export function createPlaneMirrorMinHeightLab(t) {
  return createPlaneMirrorScene(t, 'minHeight', 'tools.planeMirror.minHeight.title');
}

export function createPlaneMirrorSeeBackLab(t) {
  return createPlaneMirrorScene(t, 'seeBack', 'tools.planeMirror.seeBack.title');
}

export function createPlaneMirrorAngledLab(t) {
  return createPlaneMirrorScene(t, 'angledMirrors', 'tools.planeMirror.angled.title');
}

export function createPlaneMirrorSketchLab(t) {
  return createPlaneMirrorScene(t, 'raySketch', 'tools.planeMirror.sketch.title');
}
