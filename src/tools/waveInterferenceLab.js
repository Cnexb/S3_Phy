import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createWaveInterferenceLab(t) {
  return createLabIframe(t, {
    slug: 'wave-interference',
    titleKey: 'tools.waveInterference.title',
    className: 'tool-wave-interference-lab',
    extraParams: () => '&v=20260722_wave_interference_v3',
  });
}
