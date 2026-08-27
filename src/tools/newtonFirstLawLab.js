import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createNewtonFirstLawLab(t) {
  return createLabIframe(t, {
    slug: 'newton-first-law',
    titleKey: 'tools.newtonFirstLaw.title',
    className: 'tool-newton-first-law-lab',
    extraParams: () => '&v=20260827_newton_first_law_v1',
  });
}
