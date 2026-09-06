import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSeesawMomentLab(t) {
  return createLabIframe(t, {
    slug: 'seesaw-moment',
    titleKey: 'tools.seesawMoment.title',
    className: 'tool-seesaw-moment-lab',
    extraParams: () => '&v=20260906_seesaw_moment',
  });
}
