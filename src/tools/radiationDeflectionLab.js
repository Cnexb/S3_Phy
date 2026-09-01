import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createRadiationDeflectionLab(t) {
  return createLabIframe(t, {
    slug: 'radiation-deflection',
    titleKey: 'tools.radiationDeflection.title',
    className: 'tool-radiation-deflection-lab',
    extraParams: () => '&v=20260829',
  });
}
