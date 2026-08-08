import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createOrbitalForcesLab(t) {
  return createLabIframe(t, {
    slug: 'orbital-forces',
    titleKey: 'tools.orbitalForces.title',
    className: 'tool-orbital-forces-lab',
    extraParams: () => '&v=20260724_orbital_forces_v1',
  });
}
