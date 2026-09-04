import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createMagneticEffectLab(t) {
  return createLabIframe(t, {
    slug: 'magnetic-effect',
    titleKey: 'tools.magneticEffect.title',
    className: 'tool-magnetic-effect-lab',
    extraParams: () => '&v=20260904a',
  });
}
