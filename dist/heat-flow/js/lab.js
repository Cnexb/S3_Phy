const MATERIALS = {
  aluminium: { c: 900, symbol: 'Al' },
  copper: { c: 390, symbol: 'Cu' },
  iron: { c: 450, symbol: 'Fe' },
  glass: { c: 840, symbol: 'SiO₂' },
  water: { c: 4200, symbol: 'H₂O' },
};

const DEFAULTS = {
  hotMaterial: 'water',
  coldMaterial: 'water',
  hotMass: 1,
  coldMass: 1,
  hotInitial: 100,
  coldInitial: 0,
  conductance: 100,
};

const MASS_TEMPERATURE_PRESET = {
  hotMass: 2,
  coldMass: 1,
  hotInitial: 80,
  coldInitial: 20,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const format = (value, digits = 1) => Number(value).toFixed(digits);

function materialOptions(t, selected) {
  return Object.keys(MATERIALS).map((id) =>
    `<option value="${id}"${id === selected ? ' selected' : ''}>${t(id)} · ${MATERIALS[id].c} J kg⁻¹ °C⁻¹</option>`,
  ).join('');
}

function controlCard(t, side, state) {
  const isHot = side === 'hot';
  const title = isHot ? t('hotObject') : t('coldObject');
  const material = isHot ? state.hotMaterial : state.coldMaterial;
  const mass = isHot ? state.hotMass : state.coldMass;
  const temp = isHot ? state.hotInitial : state.coldInitial;
  const tempMin = 0;
  const tempMax = 100;

  return `
    <section class="hf-control-card hf-control-card--${side}">
      <div class="hf-control-title"><span class="hf-dot"></span><strong data-role-label="${side}">${title}</strong></div>
      <label>
        <span>${t('material')}</span>
        <select data-field="${side}Material">${materialOptions(t, material)}</select>
      </label>
      <label>
        <span>${t('mass')} <output data-output="${side}Mass">${format(mass)} kg</output></span>
        <div class="hf-slider-row">
          <input data-field="${side}Mass" type="range" min="0.1" max="2" step="0.1" value="${mass}">
          <input class="hf-number" data-field="${side}Mass" type="number" min="0.1" max="2" step="0.1" value="${mass}" aria-label="${t('mass')}">
        </div>
      </label>
      <label>
        <span>${t('initialTemp')} <output data-output="${side}Initial">${format(temp, 0)} °C</output></span>
        <div class="hf-slider-row">
          <input data-field="${side}Initial" type="range" min="${tempMin}" max="${tempMax}" step="1" value="${temp}">
          <input class="hf-number" data-field="${side}Initial" type="number" min="${tempMin}" max="${tempMax}" step="1" value="${temp}" aria-label="${t('initialTemp')}">
        </div>
      </label>
    </section>`;
}

function particleMarkup() {
  return Array.from({ length: 28 }, (_, index) =>
    `<i style="--i:${index};--row:${index % 7};--size:${7 + (index % 3) * 2}px" aria-hidden="true"></i>`,
  ).join('');
}

export function createHeatFlowLab(t, options = {}) {
  const root = document.createElement('main');
  root.className = 'hf-wrap';
  const state = { ...DEFAULTS };
  let phase = 'separated';
  let hotTemp = state.hotInitial;
  let coldTemp = state.coldInitial;
  let equilibrium = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let lastVisualFrame = 0;
  let lastFlowTextMode = '';
  let lastSyncedPhase = '';
  let animationFrame = 0;
  let joinTimer = 0;
  let controlsCollapsed = true;

  root.innerHTML = `
    <header class="hf-head">
      <div>
        <h1>${t('title')}</h1>
        <p>${t('subtitle')}</p>
      </div>
      <button class="hf-language" type="button" data-action="language">${t('language')}</button>
    </header>

    <div class="hf-layout">
      <div class="hf-main">
        <section class="hf-stage" data-stage>
          <button class="hf-fullscreen" type="button" data-action="fullscreen" aria-pressed="false">
            <span data-fullscreen-icon aria-hidden="true">⛶</span>
            <strong data-fullscreen-label>${t('fullscreen')}</strong>
          </button>
          <button class="hf-panel-toggle hf-panel-toggle--overlay" type="button" data-action="toggleControls" aria-expanded="false">
            <span aria-hidden="true">⚙</span>
            <strong data-panel-toggle-text>${t('showControls')}</strong>
          </button>
          <div class="hf-stage-actions" aria-label="${t('animationControls')}">
            <button class="hf-stage-play" type="button" data-action="stagePlay">
              <span aria-hidden="true" data-stage-play-icon>▶</span>
              <strong data-stage-play-text>${t('startAnimation')}</strong>
            </button>
            <button class="hf-stage-reset" type="button" data-action="reset">
              <span aria-hidden="true">↻</span>
              <strong>${t('reset')}</strong>
            </button>
          </div>
          <div class="hf-status" role="status" aria-live="polite">
            <span class="hf-status-icon" data-status-icon>↔</span>
            <div><strong data-status-title></strong><small data-status-detail></small></div>
          </div>

          <div class="hf-objects">
            <div class="hf-object-wrap">
              <article class="hf-object hf-object--hot" data-object="hot">
                <div class="hf-thermometer" aria-hidden="true"><span data-thermo="hot"></span></div>
                <div class="hf-object-symbol" data-symbol="hot">Al</div>
                <strong data-temp="hot">80.0 °C</strong>
              </article>
              <strong class="hf-object-label" data-role-label="hot">${t('hotObject')}</strong>
              <small class="hf-initial-temp" data-initial-temp="hot"></small>
              <div class="hf-temperature-change">
                <span class="hf-final-question">${t('finalTemperatureQuestion')}</span>
                <div class="hf-delta-result">
                  <span data-temperature-change-label="hot"></span>
                  <strong data-temperature-change="hot"></strong>
                </div>
              </div>
            </div>

            <div class="hf-flow" data-flow aria-hidden="true">
              <div class="hf-flow-track" aria-hidden="true">${particleMarkup()}</div>
            </div>

            <div class="hf-object-wrap">
              <article class="hf-object hf-object--cold" data-object="cold">
                <div class="hf-thermometer" aria-hidden="true"><span data-thermo="cold"></span></div>
                <div class="hf-object-symbol" data-symbol="cold">H₂O</div>
                <strong data-temp="cold">20.0 °C</strong>
              </article>
              <strong class="hf-object-label" data-role-label="cold">${t('coldObject')}</strong>
              <small class="hf-initial-temp" data-initial-temp="cold"></small>
              <div class="hf-temperature-change">
                <span class="hf-final-question">${t('finalTemperatureQuestion')}</span>
                <div class="hf-delta-result">
                  <span data-temperature-change-label="cold"></span>
                  <strong data-temperature-change="cold"></strong>
                </div>
              </div>
            </div>
          </div>

          <div class="hf-flow-indicator" aria-live="polite">
            <span class="hf-arrow" data-flow-arrow aria-hidden="true">→</span>
            <strong data-flow-text>${t('flowIndicator')}</strong>
          </div>

          <div class="hf-readouts">
            <div><span>${t('predictedFinal')}</span><strong data-readout="final">—</strong></div>
            <div><span>${t('elapsed')}</span><strong data-readout="time">0.0 s</strong></div>
          </div>
        </section>

      </div>

      <aside class="hf-sidebar">
        <div class="hf-control-grid">
          ${controlCard(t, 'hot', state)}
          ${controlCard(t, 'cold', state)}
        </div>
        <section class="hf-contact-control">
          <label>
            <span>${t('conductivity')} <output data-output="conductance">100%</output></span>
            <div class="hf-slider-row">
              <input data-field="conductance" type="range" min="10" max="100" step="5" value="${state.conductance}">
              <input class="hf-number" data-field="conductance" type="number" min="10" max="100" step="5" value="${state.conductance}" aria-label="${t('conductivity')}">
            </div>
          </label>
          <div class="hf-range-ends"><span>${t('poor')}</span><span>${t('good')}</span></div>
          <p>${t('conductivityHint')}</p>
        </section>
        <div class="hf-actions">
          <button class="hf-primary" type="button" data-action="contact">${t('contact')}</button>
          <button type="button" data-action="pause" disabled>${t('pause')}</button>
          <button type="button" data-action="reset">${t('reset')}</button>
          <button class="hf-default" type="button" data-action="default">${t('default')}</button>
          <button class="hf-preset" type="button" data-action="massTemperaturePreset">${t('massTemperaturePreset')}</button>
        </div>
      </aside>
    </div>`;

  const query = (selector) => root.querySelector(selector);
  const queryAll = (selector) => [...root.querySelectorAll(selector)];

  function isFullscreen() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function updateFullscreenButton() {
    const active = isFullscreen();
    const button = query('[data-action="fullscreen"]');
    if (!button) return;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? t('exitFullscreen') : t('fullscreen'));
    query('[data-fullscreen-label]').textContent = active ? t('exitFullscreen') : t('fullscreen');
    query('[data-fullscreen-icon]').textContent = active ? '✕' : '⛶';
  }

  async function toggleFullscreen() {
    try {
      if (!isFullscreen()) {
        const request = document.documentElement.requestFullscreen
          || document.documentElement.webkitRequestFullscreen;
        await request?.call(document.documentElement);
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit?.call(document);
      }
    } catch {
      // The containing hub also provides a fullscreen fallback.
    }
    updateFullscreenButton();
  }

  function capacities() {
    return {
      hot: state.hotMass * MATERIALS[state.hotMaterial].c,
      cold: state.coldMass * MATERIALS[state.coldMaterial].c,
    };
  }

  function calculateEquilibrium() {
    const capacity = capacities();
    return (capacity.hot * state.hotInitial + capacity.cold * state.coldInitial)
      / (capacity.hot + capacity.cold);
  }

  function temperatureColour(role, temp) {
    if (phase === 'equilibrium' || role === 'equal') return 'hsl(145 70% 43%)';
    const heat = clamp(temp / 100, 0, 1);
    if (role === 'hot') {
      return `hsl(2 ${72 + heat * 24}% ${76 - heat * 34}%)`;
    }
    const coldness = 1 - heat;
    return `hsl(210 ${70 + coldness * 25}% ${75 - coldness * 30}%)`;
  }

  function statusCopy() {
    if (phase === 'running') return [t('flowing'), t('flowingExplain'), '→'];
    if (phase === 'joining') return [t('joining'), t('joiningExplain'), '○'];
    if (phase === 'paused') return [t('paused'), t('flowingExplain'), 'Ⅱ'];
    if (phase === 'equilibrium') return [t('equilibrium'), t('equilibriumExplain'), '✓'];
    return [t('separated'), t('separatedExplain'), '○'];
  }

  function renderFlowText(noHeatFlow) {
    const mode = noHeatFlow ? 'no-flow' : 'flow';
    if (lastFlowTextMode === mode) return;
    lastFlowTextMode = mode;
    const flowText = query('[data-flow-text]');
    if (noHeatFlow) {
      flowText.textContent = t('noFlow');
      return;
    }

    const hot = document.createElement('span');
    hot.className = 'hf-flow-hot';
    hot.textContent = t('hotShort');
    const cold = document.createElement('span');
    cold.className = 'hf-flow-cold';
    cold.textContent = t('coldShort');
    flowText.replaceChildren(
      document.createTextNode(t('flowPrefix')),
      hot,
      document.createTextNode(t('flowConnector')),
      cold,
    );
  }

  function syncControls() {
    queryAll('[data-field]').forEach((input) => {
      const field = input.dataset.field;
      input.disabled = phase !== 'separated';
      input.value = state[field];
    });
    query('[data-output="hotMass"]').textContent = `${format(state.hotMass)} kg`;
    query('[data-output="coldMass"]').textContent = `${format(state.coldMass)} kg`;
    query('[data-output="hotInitial"]').textContent = `${format(state.hotInitial, 0)} °C`;
    query('[data-output="coldInitial"]').textContent = `${format(state.coldInitial, 0)} °C`;
    query('[data-output="conductance"]').textContent = `${state.conductance}%`;
    query('[data-symbol="hot"]').textContent = MATERIALS[state.hotMaterial].symbol;
    query('[data-symbol="cold"]').textContent = MATERIALS[state.coldMaterial].symbol;
  }

  function render() {
    const [statusTitle, statusDetail, statusIcon] = statusCopy();
    const stage = query('[data-stage]');
    const temperatureDifference = hotTemp - coldTemp;
    const roles = Math.abs(temperatureDifference) < 0.05
      ? { hot: 'equal', cold: 'equal' }
      : temperatureDifference > 0
        ? { hot: 'hot', cold: 'cold' }
        : { hot: 'cold', cold: 'hot' };
    const initialDifference = state.hotInitial - state.coldInitial;
    const initialRoles = Math.abs(initialDifference) < 0.05
      ? { hot: 'equal', cold: 'equal' }
      : initialDifference > 0
        ? { hot: 'hot', cold: 'cold' }
        : { hot: 'cold', cold: 'hot' };
    stage.classList.toggle('is-contacting', phase !== 'separated');
    stage.classList.toggle('is-flowing', phase === 'running');
    stage.classList.toggle('is-equilibrium', phase === 'equilibrium');
    stage.classList.toggle('is-flow-reverse', phase === 'running' && temperatureDifference < 0);
    root.classList.toggle('controls-collapsed', controlsCollapsed);
    const panelToggle = query('[data-action="toggleControls"]');
    panelToggle.setAttribute('aria-expanded', String(!controlsCollapsed));
    query('[data-panel-toggle-text]').textContent = controlsCollapsed ? t('showControls') : t('hideControls');
    const speedRatio = state.conductance / 100;
    stage.style.setProperty('--particle-duration', `${3 - speedRatio * 1.7}s`);
    query('[data-status-title]').textContent = statusTitle;
    query('[data-status-detail]').textContent = statusDetail;
    query('[data-status-icon]').textContent = statusIcon;

    ['hot', 'cold'].forEach((side) => {
      const value = side === 'hot' ? hotTemp : coldTemp;
      const role = roles[side];
      const notationRole = initialRoles[side];
      const colour = temperatureColour(role, value);
      const roleLabel = role === 'hot' ? t('hotObject') : role === 'cold' ? t('coldObject') : t('sameTempObject');
      const object = query(`[data-object="${side}"]`);
      const objectWrap = object.closest('.hf-object-wrap');
      const controlCard = query(`.hf-control-card--${side}`);
      const mass = side === 'hot' ? state.hotMass : state.coldMass;
      const massRatio = clamp((mass - 0.1) / 1.9, 0, 1);
      const variable = phase === 'equilibrium'
        ? 'f'
        : notationRole === 'hot'
          ? 'h'
          : notationRole === 'cold'
            ? 'c'
            : '';
      query(`[data-temp="${side}"]`).innerHTML =
        `T${variable ? `<sub>${variable}</sub>` : ''} = ${format(value)} °C`;
      objectWrap.style.setProperty('--mass-width', `${220 + massRatio * 110}px`);
      objectWrap.style.setProperty('--mass-height', `${230 + massRatio * 100}px`);
      objectWrap.style.setProperty('--mass-width-collapsed', `${280 + massRatio * 110}px`);
      objectWrap.style.setProperty('--mass-height-collapsed', `${270 + massRatio * 100}px`);
      objectWrap.style.setProperty('--mass-width-compact', `${250 + massRatio * 90}px`);
      objectWrap.style.setProperty('--mass-height-compact', `${155 + massRatio * 50}px`);
      objectWrap.style.setProperty('--mass-height-compact-collapsed', `${185 + massRatio * 60}px`);
      objectWrap.style.setProperty('--mass-width-mobile', `${105 + massRatio * 35}px`);
      objectWrap.style.setProperty('--mass-height-mobile', `${110 + massRatio * 45}px`);
      object.style.setProperty('--object-colour', colour);
      ['hot', 'cold', 'equal'].forEach((name) => {
        object.classList.toggle(`is-role-${name}`, role === name);
        controlCard.classList.toggle(`is-role-${name}`, initialRoles[side] === name);
      });
      queryAll(`[data-role-label="${side}"]`).forEach((label) => {
        label.textContent = roleLabel;
      });
      const initial = side === 'hot' ? state.hotInitial : state.coldInitial;
      const initialLabel = query(`[data-initial-temp="${side}"]`);
      const temperatureChange = query(`[data-temperature-change="${side}"]`);
      const temperatureChangeBox = temperatureChange.closest('.hf-temperature-change');
      const temperatureChangeLabel = query(`[data-temperature-change-label="${side}"]`);
      initialLabel.textContent = t('initialTempLabel').replace('{n}', format(initial, 0));
      ['hot', 'cold', 'equal'].forEach((name) => {
        initialLabel.classList.toggle(`is-initial-${name}`, initialRoles[side] === name);
        temperatureChangeBox.classList.toggle(`hf-temperature-change--${name}`, notationRole === name);
      });
      if (notationRole === 'hot') {
        temperatureChangeLabel.textContent = t('temperatureFall');
        temperatureChange.innerHTML =
          `ΔT = T<sub>h</sub> − T<sub>f</sub> = ${format(initial - equilibrium)} °C`;
      } else if (notationRole === 'cold') {
        temperatureChangeLabel.textContent = t('temperatureRise');
        temperatureChange.innerHTML =
          `ΔT = T<sub>f</sub> − T<sub>c</sub> = ${format(equilibrium - initial)} °C`;
      } else {
        temperatureChangeLabel.textContent = t('noTemperatureChange');
        temperatureChange.innerHTML = `ΔT = 0.0 °C`;
      }
      query(`[data-thermo="${side}"]`).style.height = `${clamp(value, 5, 100)}%`;
      query(`[data-thermo="${side}"]`).style.background = colour;
    });

    const reverseFlow = temperatureDifference < 0;
    const noHeatFlow = phase === 'equilibrium';
    const flowArrow = query('[data-flow-arrow]');
    flowArrow.hidden = noHeatFlow;
    flowArrow.textContent = reverseFlow ? '←' : '→';
    renderFlowText(noHeatFlow);
    query('[data-readout="final"]').textContent = phase === 'equilibrium'
      ? `= ${format(equilibrium)} °C`
      : '= ?';
    query('[data-readout="time"]').textContent = `${format(elapsed)} s`;

    const contactButton = query('.hf-actions [data-action="contact"]');
    const pauseButton = query('[data-action="pause"]');
    const stagePlayButton = query('[data-action="stagePlay"]');
    const stagePlayText = query('[data-stage-play-text]');
    const stagePlayIcon = query('[data-stage-play-icon]');
    contactButton.hidden = phase !== 'separated';
    pauseButton.disabled = phase !== 'running' && phase !== 'paused';
    pauseButton.textContent = phase === 'paused' ? t('resume') : t('pause');
    stagePlayButton.disabled = phase === 'joining';
    if (phase === 'running') {
      stagePlayText.textContent = t('pause');
      stagePlayIcon.textContent = 'Ⅱ';
    } else if (phase === 'paused') {
      stagePlayText.textContent = t('resume');
      stagePlayIcon.textContent = '▶';
    } else if (phase === 'equilibrium') {
      stagePlayText.textContent = t('replay');
      stagePlayIcon.textContent = '↻';
    } else {
      stagePlayText.textContent = t('startAnimation');
      stagePlayIcon.textContent = '▶';
    }
    if (phase === 'separated' || lastSyncedPhase !== phase) {
      syncControls();
      lastSyncedPhase = phase;
    }
  }

  function reset() {
    cancelAnimationFrame(animationFrame);
    clearTimeout(joinTimer);
    phase = 'separated';
    hotTemp = state.hotInitial;
    coldTemp = state.coldInitial;
    equilibrium = calculateEquilibrium();
    elapsed = 0;
    lastFrame = 0;
    lastVisualFrame = 0;
    render();
  }

  function tick(now) {
    if (phase !== 'running') return;
    if (!lastFrame) lastFrame = now;
    const realDelta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    const simulatedDelta = realDelta * 20;
    const capacity = capacities();
    const decayRate = state.conductance * (1 / capacity.hot + 1 / capacity.cold);
    const oldDifference = hotTemp - coldTemp;
    const newDifference = oldDifference * Math.exp(-decayRate * simulatedDelta);
    hotTemp = equilibrium + (capacity.cold / (capacity.hot + capacity.cold)) * newDifference;
    coldTemp = equilibrium - (capacity.hot / (capacity.hot + capacity.cold)) * newDifference;
    elapsed += simulatedDelta;

    if (Math.abs(newDifference) <= 0.5) {
      hotTemp = equilibrium;
      coldTemp = equilibrium;
      phase = 'equilibrium';
      render();
      return;
    }

    if (!lastVisualFrame || now - lastVisualFrame >= 33) {
      render();
      lastVisualFrame = now;
    }
    animationFrame = requestAnimationFrame(tick);
  }

  function start() {
    if (phase === 'separated') {
      equilibrium = calculateEquilibrium();
      phase = 'joining';
      render();
      joinTimer = window.setTimeout(() => {
        phase = Math.abs(hotTemp - coldTemp) <= 0.5 ? 'equilibrium' : 'running';
        lastFrame = 0;
        render();
        if (phase === 'running') animationFrame = requestAnimationFrame(tick);
      }, 760);
      return;
    } else if (phase === 'paused') {
      phase = 'running';
    }
    lastFrame = 0;
    lastVisualFrame = 0;
    render();
    animationFrame = requestAnimationFrame(tick);
  }

  function onInput(event) {
    const input = event.target.closest('[data-field]');
    if (!input || phase !== 'separated') return;
    if (input.type === 'number' && event.type === 'input') return;
    const field = input.dataset.field;
    if (input.tagName === 'SELECT') {
      state[field] = input.value;
    } else {
      if (input.value === '') return;
      const min = Number(input.min);
      const max = Number(input.max);
      state[field] = clamp(Number(input.value), min, max);
    }
    reset();
  }

  function onClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'contact') start();
    if (action === 'pause' || action === 'stagePlay') {
      if (phase === 'running') {
        phase = 'paused';
        cancelAnimationFrame(animationFrame);
        render();
      } else if (phase === 'paused') {
        start();
      } else if (action === 'stagePlay' && phase === 'separated') {
        start();
      } else if (action === 'stagePlay' && phase === 'equilibrium') {
        reset();
        start();
      }
    }
    if (action === 'reset') reset();
    if (action === 'default') {
      Object.assign(state, DEFAULTS);
      reset();
    }
    if (action === 'massTemperaturePreset') {
      Object.assign(state, MASS_TEMPERATURE_PRESET);
      reset();
    }
    if (action === 'toggleControls') {
      controlsCollapsed = !controlsCollapsed;
      render();
    }
    if (action === 'fullscreen') void toggleFullscreen();
    if (action === 'language') options.onLanguageToggle?.();
  }

  root.addEventListener('input', onInput);
  root.addEventListener('change', onInput);
  root.addEventListener('click', onClick);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  reset();
  updateFullscreenButton();

  root.destroy = () => {
    cancelAnimationFrame(animationFrame);
    clearTimeout(joinTimer);
    root.removeEventListener('input', onInput);
    root.removeEventListener('change', onInput);
    root.removeEventListener('click', onClick);
    document.removeEventListener('fullscreenchange', updateFullscreenButton);
    document.removeEventListener('webkitfullscreenchange', updateFullscreenButton);
  };

  return root;
}
