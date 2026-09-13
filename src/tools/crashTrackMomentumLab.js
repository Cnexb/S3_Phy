import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createCrashTrackMomentumLab(t) {
  return createLabIframe(t, {
    slug: 'crash-track-momentum',
    titleKey: 'tools.crashTrackMomentum.title',
    className: 'tool-crash-track-momentum-lab',
    extraParams: () => '&v=20260913_n1_art2',
  });
}
