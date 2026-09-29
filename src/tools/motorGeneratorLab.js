import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createMotorGeneratorLab(t) {
  return createLabIframe(t, {
    slug: 'motor-generator',
    titleKey: 'tools.motorGenerator.title',
    className: 'tool-motor-generator-lab',
    extraParams: () => '&v=20260929-mg',
  });
}
