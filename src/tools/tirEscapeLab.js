import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createTirEscapeLab(t) {
  return createLabIframe(t, {
    slug: 'tir-escape',
    titleKey: 'tools.refractionTir.title',
    className: 'tool-tir-escape',
    extraParams: () => '&v=20260722_tir_light_v1',
  });
}
