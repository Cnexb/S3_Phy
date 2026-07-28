import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createVectorToolLab(t) {
  return createLabIframe(t, {
    slug: 'vector-tool',
    titleKey: 'tools.vectorTool.title',
    className: 'tool-vector-tool-lab',
    extraParams: () => '&v=20260724_vector_simple_ui_v2',
  });
}
