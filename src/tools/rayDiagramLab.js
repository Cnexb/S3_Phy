import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createRayDiagramLab(t) {
  return createLabIframe(t, {
    slug: 'ray-diagram',
    titleKey: 'tools.rayDiagram.title',
    className: 'tool-ray-diagram',
    extraParams: () => '&v=20260911_ray_diagram_notop',
  });
}
