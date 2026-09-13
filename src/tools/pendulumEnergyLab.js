import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createPendulumEnergyLab(t) {
  return createLabIframe(t, {
    slug: 'pendulum-energy',
    titleKey: 'tools.pendulumEnergy.title',
    className: 'tool-pendulum-energy-lab',
    extraParams: () => '&v=20260913_n1_skin',
  });
}
