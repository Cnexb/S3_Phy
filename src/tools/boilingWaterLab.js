import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createBoilingWaterLab(t) {
  return createLabIframe(t, {
    slug: 'boiling-water',
    titleKey: 'tools.boilingWater.title',
    className: 'tool-boiling-water',
    extraParams: () => '&mode=powerTime&v=19',
  });
}
