import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSupportsMomentLab(t) {
  return createLabIframe(t, {
    slug: 'supports-moment',
    titleKey: 'tools.supportsMoment.title',
    className: 'tool-supports-moment-lab',
    extraParams: () => '&v=20260913_n1_art2',
  });
}
