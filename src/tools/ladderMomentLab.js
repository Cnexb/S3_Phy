import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createLadderMomentLab(t) {
  return createLabIframe(t, {
    slug: 'ladder-moment',
    titleKey: 'tools.ladderMoment.title',
    className: 'tool-ladder-moment-lab',
    extraParams: () => '&v=20260913_n1_art2',
  });
}
