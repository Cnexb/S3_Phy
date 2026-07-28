import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createRotatingMirrorLab(t) {
  return createLabIframe(t, {
    slug: 'rotating-mirror',
    titleKey: 'tools.rotatingMirror.title',
    className: 'tool-rotating-mirror-lab',
    extraParams: () => '&v=20260722_rotating_mirror_light_v1',
  });
}
