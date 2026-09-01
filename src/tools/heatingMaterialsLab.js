import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createHeatingMaterialsLab(t) {
  return createLabIframe(t, {
    slug: 'boiling-water',
    titleKey: 'tools.heatingMaterials.title',
    className: 'tool-heating-materials',
    extraParams: () => '&mode=heatCapacity&v=21',
  });
}
