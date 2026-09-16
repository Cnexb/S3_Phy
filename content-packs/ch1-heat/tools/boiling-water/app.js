const BOILING_THRESHOLD_J = 150_000;
const ENERGY_METER_MAX_J = 400_000;
const NON_BOIL_POWER_W = 1000;
const JUST_BOIL_POWER_W = 1500;
const PRESET_DURATION_S = 100;
const SIMULATION_SPEED = 30;
const MEDIA = {
  water: { c: 4200, color: '#0ea5e9', symbol: 'H₂O', kind: 'water' },
  aluminium: { c: 900, color: '#94a3b8', symbol: 'Al', kind: 'solid' },
  copper: { c: 390, color: '#d97706', symbol: 'Cu', kind: 'solid' },
  glass: { c: 670, color: '#67e8f9', symbol: 'SiO₂', kind: 'solid' },
};

const STRINGS = {
  en: {
    title: 'Heating Energy Labs',
    titlePowerTime: 'Boiling Water Energy Lab',
    titleHeatCapacity: 'The relationship between specific heat capacity and temperature difference',
    subtitle: 'Explore energy transfer through interactive heating experiments.',
    subtitlePowerTime: 'Change heater power and time to see whether the water boils.',
    subtitleHeatCapacity: 'Give the same energy to different materials and compare the temperature rise.',
    tabPowerTime: 'Boiling water',
    tabHeatCapacity: 'Heating materials',
    switchLanguage: '繁體中文',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    statusReady: 'Ready',
    statusHeating: 'Heating',
    statusBoiling: 'Boiling',
    statusFinished: 'Experiment complete',
    statusBoiled: 'Water boiled',
    temperature: 'Illustrative water temperature',
    energyProgress: 'Energy towards boiling',
    energyRemaining: 'Remaining',
    boilingTarget: 'needed to boil',
    controls: 'Experiment controls',
    showControls: 'Show controls',
    hideControls: 'Hide controls',
    power: 'Heater power, P',
    powerLevel: 'POWER',
    time: 'Heating time, t',
    predictedEnergy: 'Predicted energy',
    willBoil: 'Enough energy: the water will boil.',
    willNotBoil: 'Not enough energy: increase power or time.',
    setNoBoil: 'Default: Does not boil (1000 W × 100 s)',
    setJustEnough: 'Boil water (1500 W × 100 s)',
    heater: 'Heater',
    start: 'Start experiment',
    pause: 'Pause',
    continue: 'Continue',
    replay: 'Run again',
    reset: 'Reset',
    seconds: 's',
    watts: 'W',
    joules: 'J',
    kilojoules: 'kJ',
    heatCapacityControls: 'Material heating controls',
    mass: 'Mass, m',
    medium: 'Material / medium',
    initialTemperature: 'Initial temperature',
    finalTemperature: 'Final temperature, T₂',
    temperatureChange: 'Temperature change, ΔT',
    specificHeat: 'Specific heat capacity, c',
    requiredEnergy: 'Energy required',
    heatCapacityNote: 'The model assumes no change of state and no energy loss.',
    comparisonTitle: 'Compare specific heat capacities',
    comparisonSubtitle: 'Compare all materials under the same conditions. Click a row to inspect its calculation.',
    heatingPreview: 'Heating animation',
    sameEnergyMode: 'Same energy',
    sameTemperatureMode: 'Same temperature rise',
    compareTemperatureRise: 'Same energy → compare temperature rise',
    compareEnergyRequired: 'Same temperature rise → compare energy required',
    sameEnergyInsight: 'Lower c gives a larger temperature rise for the same energy.',
    sameTemperatureInsight: 'Higher c needs more energy for the same temperature rise.',
    inputEnergy: 'Energy supplied, E',
    selectedTemperatureRise: 'Selected temperature rise',
    selectedEnergyRequired: 'Selected energy required',
    temperatureRise: 'Temperature rise, ΔT',
    energySupplied: 'Energy supplied',
    commonConditions: 'Same mass · Same energy supplied',
    coreRelationship: 'Smaller c → larger ΔT',
    heatAll: 'Heat all materials',
    pauseHeating: 'Pause heating',
    replayHeating: 'Heat again',
    resetHeating: 'Reset',
    currentTemperature: 'Temperature',
    kilograms: 'kg',
    mediumWater: 'Water',
    mediumAluminium: 'Aluminium',
    mediumCopper: 'Copper',
    mediumGlass: 'Glass',
    energyDemandLow: 'Lower energy needed',
    energyDemandHigh: 'Higher energy needed',
  },
  zh: {
    title: '加熱能量實驗室',
    titlePowerTime: '煲水能量實驗室',
    titleHeatCapacity: '比熱容量與溫度差之間的關係',
    subtitle: '透過互動加熱實驗探索能量傳送。',
    subtitlePowerTime: '調校發熱器功率與時間，觀察水會否沸騰。',
    subtitleHeatCapacity: '輸入相同能量，比較不同物料的升溫幅度。',
    tabPowerTime: '煲水',
    tabHeatCapacity: '加熱物料',
    switchLanguage: 'English',
    fullscreen: '全螢幕',
    exitFullscreen: '退出全螢幕',
    statusReady: '準備就緒',
    statusHeating: '加熱中',
    statusBoiling: '沸騰中',
    statusFinished: '實驗完成',
    statusBoiled: '水已煲滾',
    temperature: '示意水溫',
    energyProgress: '達至沸騰所需能量',
    energyRemaining: '尚欠',
    boilingTarget: '煮沸所需',
    controls: '實驗控制',
    showControls: '顯示控制',
    hideControls: '收起控制',
    power: '發熱器功率 P',
    powerLevel: '功率',
    time: '加熱時間 t',
    predictedEnergy: '預計總能量',
    willBoil: '能量足夠：水會沸騰。',
    willNotBoil: '能量不足：請增加功率或時間。',
    setNoBoil: '預設：不會煮沸（1000 W × 100 s）',
    setJustEnough: '煮沸水（1500 W × 100 s）',
    heater: '發熱器',
    start: '開始實驗',
    pause: '暫停',
    continue: '繼續',
    replay: '再做一次',
    reset: '重設',
    seconds: 's',
    watts: 'W',
    joules: 'J',
    kilojoules: 'kJ',
    heatCapacityControls: '物料加熱控制',
    mass: '質量 m',
    medium: '物料／介質',
    initialTemperature: '初始溫度',
    finalTemperature: '最終溫度 T₂',
    temperatureChange: '溫度變化 ΔT',
    specificHeat: '比熱容量 c',
    requiredEnergy: '所需能量',
    heatCapacityNote: '模型假設沒有物態變化及沒有能量損失。',
    comparisonTitle: '比較不同物料的比熱容量',
    comparisonSubtitle: '在相同條件下同時比較所有物料；點擊橫列可查看個別計算。',
    heatingPreview: '加熱動畫',
    sameEnergyMode: '相同能量',
    sameTemperatureMode: '相同升溫',
    compareTemperatureRise: '相同能量 → 比較升溫幅度',
    compareEnergyRequired: '相同升溫 → 比較所需能量',
    sameEnergyInsight: '輸入能量相同時，c 愈小，升溫幅度愈大。',
    sameTemperatureInsight: '升溫幅度相同時，c 愈大，所需能量愈多。',
    inputEnergy: '輸入能量 E',
    selectedTemperatureRise: '所選物料的升溫',
    selectedEnergyRequired: '所選物料所需能量',
    temperatureRise: '溫度升幅 ΔT',
    energySupplied: '輸入能量',
    commonConditions: '相同質量 · 輸入相同能量',
    coreRelationship: 'c 愈小 → ΔT 愈大',
    heatAll: '同時加熱',
    pauseHeating: '暫停加熱',
    replayHeating: '再次加熱',
    resetHeating: '重設',
    currentTemperature: '溫度',
    kilograms: 'kg',
    mediumWater: '水',
    mediumAluminium: '鋁',
    mediumCopper: '銅',
    mediumGlass: '玻璃',
    energyDemandLow: '所需能量較低',
    energyDemandHigh: '所需能量較高',
  },
};

const root = document.getElementById('app');
const pageParams = new URLSearchParams(location.search);
const LAB_MODES = new Set(['powerTime', 'heatCapacity']);
function modeFromUrl() {
  const mode = pageParams.get('mode');
  return LAB_MODES.has(mode) ? mode : 'powerTime';
}
let lang = pageParams.get('lang') === 'en' ? 'en' : 'zh';
let power = 0;
let duration = 0;
let elapsed = 0;
let running = false;
let animationFrame = 0;
let lastFrame = 0;
let activeTab = modeFromUrl();
let controlsCollapsed = sessionStorage.getItem('s3phy-boiling-water-controls-collapsed') === 'true';
let mass = 1;
let inputEnergyJ = 20_000;
let shcProgress = 0;
let shcRunning = false;
let shcAnimationFrame = 0;
let shcLastFrame = 0;

function t(key) {
  return STRINGS[lang][key] ?? key;
}

function formatEnergy(joules) {
  if (joules >= 1000) {
    const digits = joules >= 100_000 ? 0 : 1;
    return `${(joules / 1000).toFixed(digits)} ${t('kilojoules')}`;
  }
  return `${Math.round(joules)} ${t('joules')}`;
}

function renderMaterialCard(key, label) {
  const material = MEDIA[key];
  return `
    <article class="bw-material-card" data-material-card="${key}" style="--card-color:${material.color}">
      <div class="bw-material-card-head">
        <strong>${label}</strong>
        <small>${t('specificHeat')}</small>
        <span><b>c = ${material.c}</b><em>J kg⁻¹ °C⁻¹</em></span>
      </div>
      <div class="bw-parallel-stage">
        <div class="bw-parallel-heat" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="bw-demo-sample ${material.kind === 'water' ? 'is-water' : ''}">
          <div class="bw-demo-liquid"></div>
          <b>${material.symbol}</b>
        </div>
        <div class="bw-demo-heater"></div>
        <div class="bw-demo-thermometer">
          <div class="bw-demo-thermometer-fill" data-material-temp-fill="${key}"></div>
        </div>
      </div>
      <div class="bw-material-rise">ΔT = <strong data-material-rise="${key}">0.0°C</strong></div>
    </article>`;
}

function pageTitle() {
  return activeTab === 'heatCapacity' ? t('titleHeatCapacity') : t('titlePowerTime');
}

function pageSubtitle() {
  return activeTab === 'heatCapacity' ? t('subtitleHeatCapacity') : t('subtitlePowerTime');
}

function render() {
  if (!root) return;
  document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
  document.title = pageTitle();
  const showLabFullscreen = !document.documentElement.classList.contains('s3phy-embed');
  root.innerHTML = `
    <main class="bw-wrap">
      <header class="bw-head">
        <h1 class="bw-title">${pageTitle()}</h1>
        <p class="bw-subtitle">${pageSubtitle()}</p>
        <div class="bw-head-actions">
          ${showLabFullscreen ? `<button class="bw-head-btn" type="button" data-fullscreen aria-pressed="false">
            <span class="bw-fullscreen-icon" aria-hidden="true">⛶</span>
            <span data-fullscreen-label>${t('fullscreen')}</span>
          </button>` : ''}
          <button class="bw-head-btn" type="button" data-language>${t('switchLanguage')}</button>
        </div>
      </header>

      ${activeTab === 'heatCapacity' ? '' : `<section class="bw-dashboard ${controlsCollapsed ? 'controls-collapsed' : ''}" data-panel="powerTime">
        <div class="bw-card bw-viz">
          <button class="bw-controls-toggle bw-controls-toggle--overlay" type="button" data-toggle-controls aria-expanded="${String(!controlsCollapsed)}">
            <span aria-hidden="true">⚙</span>
            <strong>${controlsCollapsed ? t('showControls') : t('hideControls')}</strong>
          </button>
          <div class="bw-bottle-stage" data-stage>
            <div class="bw-bottle" data-bottle>
              <div class="bw-steam" aria-hidden="true"><span></span><span></span><span></span></div>
              <div class="bw-splash" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
              <div class="bw-water-clip">
                <div class="bw-water" data-water>
                  <div class="bw-convection" aria-hidden="true"><span></span><span></span><span></span></div>
                  <div class="bw-bubbles" aria-hidden="true">
                    ${Array.from({ length: 18 }, () => '<span></span>').join('')}
                  </div>
                </div>
              </div>
            </div>
            <div class="bw-fire" data-fire aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div class="bw-heater" aria-hidden="true">
              <span class="bw-heater-label">${t('heater')}</span>
            </div>
            <div class="bw-power-hero bw-heater-power-callout">
              <span>${t('powerLevel')}</span>
              <strong data-power-hero>${power} ${t('watts')}</strong>
            </div>
          </div>

          <div class="bw-viz-info">
            <div class="bw-status-row">
              <div class="bw-status" data-status data-state="ready">
                <span class="bw-status-dot"></span>
                <span data-status-label>${t('statusReady')}</span>
              </div>
            </div>
            <div class="bw-energy-meter">
              <div class="bw-meter-label">
                <span>${t('energyProgress')}</span>
                <span class="bw-meter-reading">
                  <strong data-live-energy>0 ${t('kilojoules')}</strong>
                  <i>/</i>
                  <span>${formatEnergy(ENERGY_METER_MAX_J)}</span>
                </span>
              </div>
              <div class="bw-meter-track" role="progressbar" aria-valuemin="0" aria-valuemax="${ENERGY_METER_MAX_J / 1000}" aria-valuenow="0" data-progress>
                <div class="bw-meter-fill" data-progress-fill></div>
                <span class="bw-meter-target-marker" style="--target-position:${(BOILING_THRESHOLD_J / ENERGY_METER_MAX_J) * 100}%">
                  <span>${formatEnergy(BOILING_THRESHOLD_J)} ${t('boilingTarget')}</span>
                </span>
              </div>
              <div class="bw-meter-scale">
                <span>0 ${t('kilojoules')}</span>
                <strong><span>${t('energyRemaining')}</span> <b data-energy-remaining>${formatEnergy(BOILING_THRESHOLD_J)}</b></strong>
                <span>${formatEnergy(ENERGY_METER_MAX_J)}</span>
              </div>
            </div>
          </div>
        </div>

        <aside class="bw-card bw-controls ${controlsCollapsed ? 'is-collapsed' : ''}">
          <h2 class="bw-card-title">${t('controls')}</h2>
          <div class="bw-control-group">
            <label class="bw-control-label" for="power">
              <span>${t('power')}</span>
              <output class="bw-badge" data-power-output>${power} ${t('watts')}</output>
            </label>
            <div class="bw-slider-row">
              <button class="bw-step-btn" type="button" data-step="power" data-delta="-100" aria-label="-100 W">−</button>
              <input id="power" data-power type="range" min="0" max="3000" step="100" value="${power}">
              <button class="bw-step-btn" type="button" data-step="power" data-delta="100" aria-label="+100 W">+</button>
            </div>
          </div>
          <div class="bw-control-group">
            <label class="bw-control-label" for="duration">
              <span>${t('time')}</span>
              <output class="bw-badge" data-duration-output>${duration} ${t('seconds')}</output>
            </label>
            <div class="bw-slider-row">
              <button class="bw-step-btn" type="button" data-step="duration" data-delta="-10" aria-label="-10 s">−</button>
              <input id="duration" data-duration type="range" min="0" max="300" step="10" value="${duration}">
              <button class="bw-step-btn" type="button" data-step="duration" data-delta="10" aria-label="+10 s">+</button>
            </div>
          </div>

          <div class="bw-prediction">
            <span class="bw-prediction-label">${t('predictedEnergy')}</span>
            <strong class="bw-prediction-value" data-predicted-energy></strong>
            <div class="bw-prediction-result" data-prediction-result></div>
          </div>

          <div class="bw-preset-grid">
            <button class="bw-btn bw-preset bw-no-boil-preset" type="button" data-no-boil-preset>${t('setNoBoil')}</button>
            <button class="bw-btn bw-preset bw-boil-preset" type="button" data-boil-preset>${t('setJustEnough')}</button>
          </div>
          <div class="bw-actions">
            <button class="bw-btn primary" type="button" data-start>${t('start')}</button>
            <button class="bw-btn" type="button" data-reset>${t('reset')}</button>
          </div>
        </aside>

      </section>`}

      ${activeTab === 'heatCapacity' ? `<section class="bw-dashboard bw-heat-dashboard ${controlsCollapsed ? 'controls-collapsed' : ''}" data-panel="heatCapacity">
        <div class="bw-card bw-parallel-demo">
          <button class="bw-controls-toggle bw-controls-toggle--overlay" type="button" data-toggle-controls aria-expanded="${String(!controlsCollapsed)}">
            <span aria-hidden="true">⚙</span>
            <strong>${controlsCollapsed ? t('showControls') : t('hideControls')}</strong>
          </button>
          <div class="bw-parallel-heading">
            <span>${t('commonConditions')}</span>
            <strong>${t('coreRelationship')}</strong>
          </div>
          <div class="bw-material-grid">
            ${renderMaterialCard('water', t('mediumWater'))}
            ${renderMaterialCard('aluminium', t('mediumAluminium'))}
            ${renderMaterialCard('glass', t('mediumGlass'))}
            ${renderMaterialCard('copper', t('mediumCopper'))}
          </div>
        </div>

        <aside class="bw-card bw-controls bw-heat-controls ${controlsCollapsed ? 'is-collapsed' : ''}">
          <h2 class="bw-card-title">${t('heatCapacityControls')}</h2>
          <div class="bw-control-group">
            <label class="bw-control-label" for="mass">
              <span>${t('mass')}</span>
              <output class="bw-badge" data-mass-output>${mass.toFixed(1)} ${t('kilograms')}</output>
            </label>
            <div class="bw-slider-row">
              <button class="bw-step-btn" type="button" data-heat-step="mass" data-delta="-0.1">−</button>
              <input id="mass" data-mass type="range" min="0.1" max="2" step="0.1" value="${mass}">
              <button class="bw-step-btn" type="button" data-heat-step="mass" data-delta="0.1">+</button>
            </div>
          </div>

          <div class="bw-control-group">
            <label class="bw-control-label" for="input-energy">
              <span>${t('inputEnergy')}</span>
              <output class="bw-badge" data-input-energy-output>${formatEnergy(inputEnergyJ)}</output>
            </label>
            <div class="bw-slider-row">
              <button class="bw-step-btn" type="button" data-heat-step="energy" data-delta="-5000">−</button>
              <input id="input-energy" data-input-energy type="range" min="5000" max="50000" step="5000" value="${inputEnergyJ}">
              <button class="bw-step-btn" type="button" data-heat-step="energy" data-delta="5000">+</button>
            </div>
          </div>
          <div class="bw-actions">
            <button class="bw-btn primary" type="button" data-shc-start>${t('heatAll')}</button>
            <button class="bw-btn" type="button" data-shc-reset>${t('resetHeating')}</button>
          </div>
          <p class="bw-threshold-note">${t('heatCapacityNote')}</p>
        </aside>

      </section>` : ''}
    </main>`;

  bindEvents();
  if (activeTab === 'heatCapacity') updateHeatCapacityDisplay();
  else updateDisplay();
}

function bindEvents() {
  root.querySelector('[data-language]')?.addEventListener('click', () => {
    lang = lang === 'en' ? 'zh' : 'en';
    render();
  });
  root.querySelector('[data-fullscreen]')?.addEventListener('click', toggleFullscreen);
  root.querySelectorAll('[data-toggle-controls]').forEach((button) => {
    button.addEventListener('click', () => {
      controlsCollapsed = !controlsCollapsed;
      sessionStorage.setItem('s3phy-boiling-water-controls-collapsed', String(controlsCollapsed));
      render();
    });
  });

  root.querySelector('[data-power]')?.addEventListener('input', (event) => {
    power = Number(event.target.value);
    if (!running) elapsed = 0;
    updateDisplay();
  });

  root.querySelector('[data-duration]')?.addEventListener('input', (event) => {
    duration = Number(event.target.value);
    if (elapsed > duration) elapsed = duration;
    if (!running) elapsed = 0;
    updateDisplay();
  });
  root.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.step;
      const delta = Number(button.dataset.delta);
      if (target === 'power') power = Math.max(0, Math.min(3000, power + delta));
      if (target === 'duration') duration = Math.max(0, Math.min(300, duration + delta));
      if (!running) elapsed = 0;
      updateDisplay();
    });
  });

  root.querySelector('[data-no-boil-preset]')?.addEventListener('click', setNoBoilPreset);
  root.querySelector('[data-boil-preset]')?.addEventListener('click', setJustEnoughToBoil);
  root.querySelector('[data-start]')?.addEventListener('click', toggleRunning);
  root.querySelector('[data-reset]')?.addEventListener('click', resetExperiment);

  root.querySelector('[data-mass]')?.addEventListener('input', (event) => {
    mass = Number(event.target.value);
    shcProgress = 0;
    updateHeatCapacityDisplay();
  });
  root.querySelector('[data-input-energy]')?.addEventListener('input', (event) => {
    inputEnergyJ = Number(event.target.value);
    shcProgress = 0;
    updateHeatCapacityDisplay();
  });
  root.querySelectorAll('[data-heat-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.heatStep;
      const delta = Number(button.dataset.delta);
      if (target === 'mass') mass = Math.max(0.1, Math.min(2, Number((mass + delta).toFixed(1))));
      if (target === 'energy') inputEnergyJ = Math.max(5000, Math.min(50000, inputEnergyJ + delta));
      shcProgress = 0;
      updateHeatCapacityDisplay();
    });
  });
  root.querySelector('[data-shc-start]')?.addEventListener('click', toggleShcHeating);
  root.querySelector('[data-shc-reset]')?.addEventListener('click', resetShcHeating);
}

async function toggleFullscreen() {
  try {
    const active = document.fullscreenElement || document.webkitFullscreenElement;
    if (!active) {
      const request = document.documentElement.requestFullscreen
        || document.documentElement.webkitRequestFullscreen;
      await request?.call(document.documentElement);
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      await exit?.call(document);
    }
  } catch {
    // Fullscreen may be blocked by browser policy; the hub's fullscreen control remains available.
  }
  updateFullscreenButton();
}

function updateFullscreenButton() {
  const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  const button = root?.querySelector('[data-fullscreen]');
  const label = root?.querySelector('[data-fullscreen-label]');
  const text = active ? t('exitFullscreen') : t('fullscreen');
  if (button) {
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', text);
  }
  if (label) label.textContent = text;
}

function toggleRunning() {
  if (elapsed >= duration) elapsed = 0;
  running = !running;
  lastFrame = performance.now();
  if (running) {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(step);
  } else {
    cancelAnimationFrame(animationFrame);
  }
  updateDisplay();
}

function resetExperiment() {
  running = false;
  power = 0;
  duration = 0;
  elapsed = 0;
  lastFrame = 0;
  cancelAnimationFrame(animationFrame);
  updateDisplay();
}

function applyPowerTimePreset(nextPower, nextDuration) {
  running = false;
  power = nextPower;
  duration = nextDuration;
  elapsed = 0;
  lastFrame = 0;
  cancelAnimationFrame(animationFrame);
  updateDisplay();
}

function setNoBoilPreset() {
  applyPowerTimePreset(NON_BOIL_POWER_W, PRESET_DURATION_S);
}

function setJustEnoughToBoil() {
  applyPowerTimePreset(JUST_BOIL_POWER_W, PRESET_DURATION_S);
}

function step(now) {
  if (!running) return;
  const deltaSeconds = Math.min((now - lastFrame) / 1000, 0.1) * SIMULATION_SPEED;
  lastFrame = now;
  elapsed = Math.min(duration, elapsed + deltaSeconds);
  if (elapsed >= duration) running = false;
  updateDisplay();
  if (running) animationFrame = requestAnimationFrame(step);
}

function toggleShcHeating() {
  if (shcProgress >= 1) shcProgress = 0;
  shcRunning = !shcRunning;
  shcLastFrame = performance.now();
  if (shcRunning) {
    cancelAnimationFrame(shcAnimationFrame);
    shcAnimationFrame = requestAnimationFrame(stepShcHeating);
  } else {
    cancelAnimationFrame(shcAnimationFrame);
  }
  updateHeatCapacityDisplay();
}

function resetShcHeating() {
  shcRunning = false;
  shcProgress = 0;
  shcLastFrame = 0;
  cancelAnimationFrame(shcAnimationFrame);
  updateHeatCapacityDisplay();
}

function stepShcHeating(now) {
  if (!shcRunning) return;
  const delta = Math.min((now - shcLastFrame) / 4000, 0.04);
  shcLastFrame = now;
  shcProgress = Math.min(1, shcProgress + delta);
  if (shcProgress >= 1) shcRunning = false;
  updateHeatCapacityDisplay();
  if (shcRunning) shcAnimationFrame = requestAnimationFrame(stepShcHeating);
}

function updateDisplay() {
  if (!root || activeTab !== 'powerTime') return;
  const energy = power * elapsed;
  const predictedEnergy = power * duration;
  const boilingProgress = Math.min(energy / BOILING_THRESHOLD_J, 1);
  const meterProgress = Math.min(energy / ENERGY_METER_MAX_J, 1);
  const remainingEnergy = Math.max(BOILING_THRESHOLD_J - energy, 0);
  const hasBoiled = energy >= BOILING_THRESHOLD_J;
  const finished = elapsed >= duration && duration > 0;
  const stage = root.querySelector('[data-stage]');
  const water = root.querySelector('[data-water]');
  const status = root.querySelector('[data-status]');
  const statusLabel = root.querySelector('[data-status-label]');
  const startButton = root.querySelector('[data-start]');

  root.querySelector('[data-power-output]').textContent = `${power} ${t('watts')}`;
  root.querySelector('[data-power-hero]').textContent = `${power} ${t('watts')}`;
  root.querySelector('[data-duration-output]').textContent = `${duration} ${t('seconds')}`;
  root.querySelector('[data-power]').value = String(power);
  root.querySelector('[data-duration]').value = String(duration);
  root.querySelector('[data-predicted-energy]').textContent = formatEnergy(predictedEnergy);
  root.querySelector('[data-live-energy]').textContent = formatEnergy(energy);
  root.querySelector('[data-energy-remaining]').textContent = formatEnergy(remainingEnergy);
  const progressPercent = meterProgress * 100;
  const progressBar = root.querySelector('[data-progress]');
  progressBar.setAttribute('aria-valuenow', String(Math.round(Math.min(energy, ENERGY_METER_MAX_J) / 1000)));
  root.querySelector('[data-progress-fill]').style.width = `${progressPercent}%`;

  const predictionResult = root.querySelector('[data-prediction-result]');
  const predictedToBoil = predictedEnergy >= BOILING_THRESHOLD_J;
  predictionResult.textContent = predictedToBoil ? t('willBoil') : t('willNotBoil');
  predictionResult.classList.toggle('will-not-boil', !predictedToBoil);

  stage.classList.toggle('is-heating', running && power > 0);
  stage.classList.toggle('is-near-boiling', boilingProgress >= 0.72);
  stage.classList.toggle('is-almost-boiling', boilingProgress >= 0.88);
  stage.classList.toggle('is-boiling', hasBoiled);
  stage.style.setProperty('--heat', boilingProgress.toFixed(2));
  stage.style.setProperty('--temp-level', boilingProgress.toFixed(3));
  stage.style.setProperty('--water-speed', `${Math.max(0.38, 2.2 - boilingProgress * 1.75).toFixed(2)}s`);
  stage.style.setProperty('--power-level', (power / 3000).toFixed(3));
  water.classList.toggle('is-warm', boilingProgress >= 0.2);
  water.classList.toggle('is-hot', boilingProgress >= 0.45);
  water.classList.toggle('is-boiling', hasBoiled);

  let state = 'ready';
  let statusText = t('statusReady');
  if (finished) {
    state = 'finished';
    statusText = hasBoiled ? t('statusBoiled') : t('statusFinished');
  } else if (running && hasBoiled) {
    state = 'boiling';
    statusText = t('statusBoiling');
  } else if (running || elapsed > 0) {
    state = 'heating';
    statusText = t('statusHeating');
  }
  status.dataset.state = state;
  statusLabel.textContent = statusText;

  if (running) startButton.textContent = t('pause');
  else if (finished) startButton.textContent = t('replay');
  else if (elapsed > 0) startButton.textContent = t('continue');
  else startButton.textContent = t('start');
  updateFullscreenButton();
}

function updateHeatCapacityDisplay() {
  if (!root || activeTab !== 'heatCapacity') return;
  const deliveredEnergy = inputEnergyJ * shcProgress;
  const maximumTargetRise = inputEnergyJ / (mass * MEDIA.copper.c);
  root.querySelector('[data-mass]').value = String(mass);
  root.querySelector('[data-input-energy]').value = String(inputEnergyJ);
  root.querySelector('[data-mass-output]').textContent = `${mass.toFixed(1)} ${t('kilograms')}`;
  root.querySelector('[data-input-energy-output]').textContent = formatEnergy(inputEnergyJ);

  Object.entries(MEDIA).forEach(([key, item]) => {
    const rise = deliveredEnergy / (mass * item.c);
    const relativeRise = maximumTargetRise > 0 ? rise / maximumTargetRise : 0;
    root.querySelector(`[data-material-rise="${key}"]`).textContent = `${rise.toFixed(1)}°C`;
    root.querySelector(`[data-material-temp-fill="${key}"]`).style.height = `${8 + relativeRise * 88}%`;
    const card = root.querySelector(`[data-material-card="${key}"]`);
    card.style.setProperty('--card-heat', shcProgress.toFixed(3));
    card.classList.toggle('is-heating', shcRunning);
  });

  const startButton = root.querySelector('[data-shc-start]');
  if (shcRunning) startButton.textContent = t('pauseHeating');
  else if (shcProgress >= 1) startButton.textContent = t('replayHeating');
  else startButton.textContent = t('heatAll');
}

window.addEventListener('message', (event) => {
  if (event.data?.type !== 's3phy:lang') return;
  const next = event.data.lang === 'en' ? 'en' : 'zh';
  if (next === lang) return;
  lang = next;
  render();
});
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);

render();
