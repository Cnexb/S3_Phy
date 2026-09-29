import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createHalfLifeLab(t) {
  return createLabIframe(t, {
    slug: 'half-life',
    titleKey: 'tools.halfLife.title',
    className: 'tool-half-life-lab',
    extraParams: () => '&v=20260929-hl',
  });
}
