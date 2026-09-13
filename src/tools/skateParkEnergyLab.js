import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSkateParkEnergyLab(t) {
  return createLabIframe(t, {
    slug: 'skate-park-energy',
    titleKey: 'tools.skateParkEnergy.title',
    className: 'tool-skate-park-energy-lab',
    extraParams: () => '&v=20260913_n1_skin',
  });
}
