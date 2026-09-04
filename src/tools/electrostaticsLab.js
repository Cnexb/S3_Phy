import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createElectrostaticsLab(t) {
  return createLabIframe(t, {
    slug: 'electrostatics',
    titleKey: 'tools.electrostatics.title',
    className: 'tool-electrostatics-lab',
    extraParams: () => '&v=20260904a',
  });
}
