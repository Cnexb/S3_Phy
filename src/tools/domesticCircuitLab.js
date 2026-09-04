import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createDomesticCircuitLab(t) {
  return createLabIframe(t, {
    slug: 'domestic-circuit',
    titleKey: 'tools.domesticCircuit.title',
    className: 'tool-domestic-circuit-lab',
    extraParams: () => '&v=20260904a',
  });
}
