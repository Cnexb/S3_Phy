import { createLabIframe } from './createLabIframe.js';

const TYPE_TITLE_KEYS = {
  liquid: 'tools.thermometerLab.liquid.title',
  resistance: 'tools.thermometerLab.resistance.title',
  thermistor: 'tools.thermometerLab.thermistor.title',
};

/** @param {(key: string) => string} t @param {{ type?: 'liquid' | 'resistance' | 'thermistor' }} [options] */
export function createThermometerLab(t, options = {}) {
  const type = options.type || 'liquid';
  return createLabIframe(t, {
    slug: 'thermometer',
    titleKey: TYPE_TITLE_KEYS[type] || TYPE_TITLE_KEYS.liquid,
    className: 'tool-thermometer-lab',
        extraParams: () => `&mode=${encodeURIComponent(type)}&labv=29`,
  });
}

/** @param {(key: string) => string} t */
export function createFaultyScaleCalibrationLab(t) {
  return createLabIframe(t, {
    slug: 'thermometer',
    titleKey: 'tools.faultyCalibration.title',
    className: 'tool-thermometer-lab',
    extraParams: () => '&mode=faulty&labv=29',
  });
}
