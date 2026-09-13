import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createKineticTheoryLab(t) {
  return createLabIframe(t, {
    slug: 'kinetic-theory',
    titleKey: 'tools.kineticTheory.title',
    className: 'tool-kinetic-theory-lab',
    extraParams: () => '&v=20260913_zip_labs',
  });
}
