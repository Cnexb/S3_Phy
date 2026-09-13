import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createBungeeEnergyLab(t) {
  return createLabIframe(t, {
    slug: 'bungee-energy',
    titleKey: 'tools.bungeeEnergy.title',
    className: 'tool-bungee-energy-lab',
    extraParams: () => '&v=20260913_zip_labs',
  });
}
