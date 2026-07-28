import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createWaveMotionLab(t) {
  return createLabIframe(t, {
    slug: 'wave-motion',
    titleKey: 'tools.waveMotion.title',
    className: 'tool-wave-motion-lab',
    extraParams: () => '&v=20260723_wave_phase_v30',
  });
}
