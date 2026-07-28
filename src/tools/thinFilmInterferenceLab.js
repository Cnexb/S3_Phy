import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createThinFilmInterferenceLab(t) {
  return createLabIframe(t, {
    slug: 'thin-film-interference',
    titleKey: 'tools.thinFilmInterference.title',
    className: 'tool-thin-film-interference-lab',
    extraParams: () => '&v=20260722_thin_film_light_v3',
  });
}
