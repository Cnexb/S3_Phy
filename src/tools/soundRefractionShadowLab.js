import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createSoundRefractionShadowLab(t) {
  return createLabIframe(t, {
    slug: 'sound-refraction-shadow',
    titleKey: 'tools.soundRefractionShadow.title',
    className: 'tool-sound-refraction-shadow-lab',
    extraParams: () => '&v=20260722_sound_refraction_v2',
  });
}
