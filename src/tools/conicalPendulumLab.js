import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createConicalPendulumLab(t) {
  return createLabIframe(t, {
    slug: 'conical-pendulum',
    titleKey: 'tools.conicalPendulum.title',
    className: 'tool-conical-pendulum-lab',
    extraParams: () => '&v=20260913_zip_labs',
  });
}
