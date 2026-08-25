import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createHeatTransferLab(t) {
  return createLabIframe(t, {
    slug: 'heat-transfer',
    titleKey: 'tools.heatTransfer.title',
    className: 'tool-heat-transfer',
    extraParams: () => '&v=33',
  });
}
