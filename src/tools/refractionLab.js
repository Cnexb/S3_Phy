import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createRefractionLab(t) {
  return createLabIframe(t, {
    slug: 'refraction',
    titleKey: 'tools.refraction.title',
    className: 'tool-refraction-lab',
    extraParams: () => '&v=20260731_three_layer_v1',
  });
}
