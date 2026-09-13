import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createCloudChamberLab(t) {
  return createLabIframe(t, {
    slug: 'cloud-chamber',
    titleKey: 'tools.cloudChamber.title',
    className: 'tool-cloud-chamber-lab',
    extraParams: () => '&v=20260913-cloud',
  });
}
