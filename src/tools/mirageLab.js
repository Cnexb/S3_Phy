import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createMirageLab(t) {
  return createLabIframe(t, {
    slug: 'mirage',
    titleKey: 'tools.mirage.title',
    className: 'tool-mirage-lab',
    extraParams: () => '&v=20260723_mirage_v3',
  });
}
