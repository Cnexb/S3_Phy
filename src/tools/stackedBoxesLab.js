import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createStackedBoxesLab(t) {
  return createLabIframe(t, {
    slug: 'stacked-boxes',
    titleKey: 'tools.stackedBoxes.title',
    className: 'tool-stacked-boxes-lab',
    extraParams: () => '&v=20260826_stacked_boxes_v1',
  });
}
