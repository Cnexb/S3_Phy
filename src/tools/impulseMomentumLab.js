import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createImpulseMomentumLab(t) {
  return createLabIframe(t, {
    slug: 'impulse-momentum',
    titleKey: 'tools.impulseMomentum.title',
    className: 'tool-impulse-momentum-lab',
    extraParams: () => '&v=20260913_n1_art2',
  });
}
