import { createLabIframe } from './createLabIframe.js';

/** @param {(key: string) => string} t */
export function createConnectedContainersLab(t) {
  return createLabIframe(t, {
    slug: 'connected-containers',
    titleKey: 'tools.connectedContainers.title',
    className: 'tool-connected-containers-lab',
    extraParams: () => '&v=20260913_n1_canvas',
  });
}
