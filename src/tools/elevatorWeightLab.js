import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createElevatorWeightLab(t) {
  return createLabIframe(t, {
    slug: 'elevator-weight',
    titleKey: 'tools.elevatorWeight.title',
    className: 'tool-elevator-weight-lab',
    extraParams: () => '&v=20260825_elevator_v26',
  });
}
