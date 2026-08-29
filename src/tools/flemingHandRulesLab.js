import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createFlemingHandRulesLab(t) {
  return createLabIframe(t, {
    slug: 'fleming-hand-rules',
    titleKey: 'tools.flemingHandRules.title',
    className: 'tool-fleming-hand-rules-lab',
    extraParams: () => '&v=20260829pose',
  });
}
