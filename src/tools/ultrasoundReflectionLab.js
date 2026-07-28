import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createUltrasoundReflectionLab(t) {
  return createLabIframe(t, {
    slug: 'ultrasound-reflection',
    titleKey: 'tools.ultrasoundReflection.title',
    className: 'tool-ultrasound-reflection-lab',
    extraParams: () => '&v=20260722_ultrasound_reflection_light_v3',
  });
}
