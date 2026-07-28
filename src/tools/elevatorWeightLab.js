import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createElevatorWeightLab(t) {
  return createLabIframe(t, {
    slug: 'elevator-weight',
    titleKey: 'tools.elevatorWeight.title',
    className: 'tool-elevator-weight-lab',
    extraParams: () => '&v=20260724_elevator_va_sep_v25',
  });
}
