import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createProjectileMotionLab(t) {
  return createLabIframe(t, {
    slug: 'projectile-motion',
    titleKey: 'tools.projectileMotion.title',
    className: 'tool-projectile-motion-lab',
    extraParams: () => '&v=20260722_projectile_v2',
  });
}
