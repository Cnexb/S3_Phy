import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createCharlesLawLab(t) {
  return createLabIframe(t, {
    slug: 'charles-law',
    titleKey: 'tools.charlesLaw.title',
    className: 'tool-charles-law-lab',
    extraParams: () => '&v=20260913_n1_canvas',
  });
}
