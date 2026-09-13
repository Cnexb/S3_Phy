import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createAircraftTurnLab(t) {
  return createLabIframe(t, {
    slug: 'aircraft-turn',
    titleKey: 'tools.aircraftTurn.title',
    className: 'tool-aircraft-turn-lab',
    extraParams: () => '&v=20260913_zip_labs',
  });
}
