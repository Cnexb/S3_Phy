import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSpectralOverlapLab(t) {
  return createLabIframe(t, {
    slug: 'spectral-overlap',
    titleKey: 'tools.spectralOverlap.title',
    className: 'tool-spectral-overlap-lab',
    extraParams: () => '&v=20260722_spectral_overlap_light_v3',
  });
}
