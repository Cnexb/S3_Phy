import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createRippleTankLab(t) {
  return createLabIframe(t, {
    slug: 'ripple-tank',
    titleKey: 'tools.rippleTank.title',
    className: 'tool-ripple-tank-lab',
    extraParams: () => '&v=20260906_ripple_tank',
  });
}
