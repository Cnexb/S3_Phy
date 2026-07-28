import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createDiffractionGratingCompareLab(t) {
  return createLabIframe(t, {
    slug: 'diffraction-grating-compare',
    titleKey: 'tools.diffractionGratingCompare.title',
    className: 'tool-diffraction-grating-compare-lab',
    extraParams: () => '&v=20260722_diffraction_compare_v2',
  });
}
