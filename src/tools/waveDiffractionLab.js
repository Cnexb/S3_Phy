import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createWaveDiffractionLab(t) {
  return createLabIframe(t, {
    slug: 'wave-diffraction',
    titleKey: 'tools.waveDiffraction.title',
    className: 'tool-wave-diffraction-lab',
    extraParams: () => '&v=20260723_wave_diffraction_v3',
  });
}
