import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createBoylesLawLab(t) {
  return createLabIframe(t, {
    slug: 'boyles-law',
    titleKey: 'tools.boylesLaw.title',
    className: 'tool-boyles-law-lab',
    extraParams: () => '&v=20260913_n1_skin',
  });
}
