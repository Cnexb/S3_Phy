import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createHeatFlowLab(t) {
  return createLabIframe(t, {
    slug: 'heat-flow',
    titleKey: 'tools.heatFlow.title',
    className: 'tool-heat-flow',
    extraParams: () => '&v=41',
  });
}
