import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createStationaryWaveLab(t) {
  return createLabIframe(t, {
    slug: 'stationary-wave',
    titleKey: 'tools.stationaryWave.title',
    className: 'tool-stationary-wave-lab',
    extraParams: () => '&v=20260915_stationary',
  });
}
