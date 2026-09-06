import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createBulletMomentumLab(t) {
  return createLabIframe(t, {
    slug: 'bullet-momentum',
    titleKey: 'tools.bulletMomentum.title',
    className: 'tool-bullet-momentum-lab',
    extraParams: () => '&v=20260906_bullet_momentum',
  });
}
