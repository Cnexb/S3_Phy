import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createPressureLawLab(t) {
  return createLabIframe(t, {
    slug: 'pressure-law',
    titleKey: 'tools.pressureLaw.title',
    className: 'tool-pressure-law-lab',
    extraParams: () => '&v=20260913_n1_canvas',
  });
}
