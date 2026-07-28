import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createLongitudinalWaveLab(t) {
  return createLabIframe(t, {
    slug: 'longitudinal-wave',
    titleKey: 'tools.longitudinalWave.title',
    className: 'tool-longitudinal-wave-lab',
    extraParams: () => '&v=20260723_longitudinal_center_cr_v14',
  });
}
