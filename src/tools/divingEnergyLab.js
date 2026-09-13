import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createDivingEnergyLab(t) {
  return createLabIframe(t, {
    slug: 'diving-energy',
    titleKey: 'tools.divingEnergy.title',
    className: 'tool-diving-energy-lab',
    extraParams: () => '&v=20260913_zip_labs',
  });
}
