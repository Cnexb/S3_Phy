import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createReflection3dLab(t) {
  return createLabIframe(t, {
    slug: 'reflection-3d',
    titleKey: 'tools.reflection3d.title',
    className: 'tool-reflection-3d-lab',
    extraParams: () => '&v=20261014k',
  });
}
