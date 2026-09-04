import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createMovingChargeForceLab(t) {
  return createLabIframe(t, {
    slug: 'moving-charge-force',
    titleKey: 'tools.movingChargeForce.title',
    className: 'tool-moving-charge-force-lab',
    extraParams: () => '&v=20260904a',
  });
}
