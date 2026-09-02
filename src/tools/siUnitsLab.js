import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSiUnitsLab(t) {
  return createLabIframe(t, {
    slug: 'si-units',
    titleKey: 'tools.siUnits.title',
    className: 'tool-si-units-lab',
    extraParams: () => '&v=20260902b',
  });
}
