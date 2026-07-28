/* thermometerLab.js - Ported high-fidelity Thermometer Simulation Lab */

const THERM_FLOAT_BREAKPOINT = 768;

function initFloatingControlsPanel(options) {
  const FLOAT_BREAKPOINT = 768;
  const DEFAULT_POS = { x: 12, y: 12 };
  const LAYOUT_DEBOUNCE_MS = 200;
  const {
    container,
    panel,
    toggleBtn,
    dragHandle,
    dragSurface,
    storageKey,
    onLayoutChange,
    breakpoint = FLOAT_BREAKPOINT,
    collapsedClass = 'controls-collapsed',
    floatingClass = 'controls-floating',
  } = options;

  const dragTarget = dragSurface || dragHandle;

  if (!container || !panel || !toggleBtn) return null;

  let collapsed = sessionStorage.getItem(storageKey) !== 'false';
  let pos = (() => {
    try {
      const raw = localStorage.getItem(storageKey + ':pos');
      if (!raw) return { ...DEFAULT_POS };
      const parsed = JSON.parse(raw);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') return parsed;
    } catch (e) { void e; }
    return { ...DEFAULT_POS };
  })();
  let dragState = null;
  let layoutTimer = null;

  const isFloatingEnabled = () => window.innerWidth >= breakpoint;

  const clampPosition = (x, y) => {
    const cRect = container.getBoundingClientRect();
    const pRect = panel.getBoundingClientRect();
    const maxX = Math.max(0, cRect.width - pRect.width);
    const maxY = Math.max(0, cRect.height - pRect.height);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  };

  const applyPosition = () => {
    panel.style.left = pos.x + 'px';
    panel.style.top = pos.y + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  };

  const scheduleLayoutChange = () => {
    if (typeof onLayoutChange !== 'function') return;
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(onLayoutChange, LAYOUT_DEBOUNCE_MS);
  };

  const updateToggleUi = () => {
    toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (options.getToggleTitle) toggleBtn.title = options.getToggleTitle(collapsed);
    const icon = toggleBtn.querySelector('[data-float-chevron]');
    if (icon) icon.textContent = collapsed ? 'v' : '^';
  };

  const reclampPosition = () => {
    if (!isFloatingEnabled()) return;
    pos = clampPosition(pos.x, pos.y);
    applyPosition();
  };

  const setCollapsed = (next) => {
    collapsed = next;
    panel.classList.toggle(collapsedClass, collapsed);
    sessionStorage.setItem(storageKey, collapsed ? 'true' : 'false');
    updateToggleUi();
    scheduleLayoutChange();
    requestAnimationFrame(reclampPosition);
    setTimeout(reclampPosition, 260);
  };

  const enableFloating = () => {
    container.classList.add(floatingClass);
    panel.classList.add('lab-controls-float');
    pos = clampPosition(pos.x, pos.y);
    applyPosition();
    if (dragHandle) dragHandle.style.display = '';
  };

  const disableFloating = () => {
    container.classList.remove(floatingClass);
    panel.classList.remove('lab-controls-float');
    panel.style.left = '';
    panel.style.top = '';
    panel.style.right = '';
    panel.style.bottom = '';
    if (dragHandle) dragHandle.style.display = 'none';
  };

  const refreshMode = () => {
    if (isFloatingEnabled()) {
      enableFloating();
      pos = clampPosition(pos.x, pos.y);
      applyPosition();
    } else {
      disableFloating();
    }
    scheduleLayoutChange();
  };

  panel.classList.toggle(collapsedClass, collapsed);
  updateToggleUi();
  refreshMode();

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  });

  if (dragTarget) {
    dragTarget.addEventListener('pointerdown', (e) => {
      if (!isFloatingEnabled()) return;
      if (toggleBtn.contains(e.target)) return;
      e.preventDefault();
      dragState = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y };
      dragTarget.setPointerCapture(e.pointerId);
      dragTarget.classList.add('is-dragging');
    });
    dragTarget.addEventListener('pointermove', (e) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;
      pos = clampPosition(dragState.originX + e.clientX - dragState.startX, dragState.originY + e.clientY - dragState.startY);
      applyPosition();
    });
    const endDrag = (e) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;
      dragTarget.releasePointerCapture(e.pointerId);
      dragTarget.classList.remove('is-dragging');
      try { localStorage.setItem(storageKey + ':pos', JSON.stringify(pos)); } catch (err) { void err; }
      dragState = null;
      scheduleLayoutChange();
    };
    dragTarget.addEventListener('pointerup', endDrag);
    dragTarget.addEventListener('pointercancel', endDrag);
  }

  window.addEventListener('resize', refreshMode);
  return { setCollapsed, refreshMode, isCollapsed: () => collapsed };
}

export function createThermometerLab(t, options = {}) {

  const defaultType = options.type || 'liquid';
  let title = t('tools.thermometerLab.title');
  let subtitle = t('tools.thermometerLab.subtitle');
  if (options.type === 'liquid') {
    title = t('tools.thermometerLab.liquid.title');
    subtitle = t('tools.thermometerLab.liquid.subtitle') || t('tools.thermometerLab.subtitle');
  } else if (options.type === 'resistance') {
    title = t('tools.thermometerLab.resistance.title');
    subtitle = t('tools.thermometerLab.resistance.subtitle') || t('tools.thermometerLab.subtitle');
  } else if (options.type === 'thermistor') {
    title = t('tools.thermometerLab.thermistor.title');
    subtitle = t('tools.thermometerLab.thermistor.subtitle') || t('tools.thermometerLab.subtitle');
  }

  const wrap = document.createElement('div');
  wrap.className = 'tl-wrap';
  wrap.innerHTML = `
    <div class="tl-head">
      <h2 class="tl-title">${title}</h2>
      <div class="tl-sub">${subtitle}</div>
    </div>
    <div class="tl-dash">
      <!-- TOP ROW LEFT: THERMOMETER VIEW -->
      <div class="tl-viz-phys" style="display:flex;flex-direction:column;gap:8px;align-items:stretch;">
        <canvas class="tl-canvas-phys" id="tl-thermometerCanvas" width="460" height="340"></canvas>
        <button class="tl-btn" id="tl-btn-toggle-labels" style="margin-top:4px;width:100%;display:flex;align-items:center;justify-content:center;gap:6px;font-size:0.75rem;padding:6px 10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span id="tl-lbl-toggle-labels">${t('tools.thermometerLab.labels.hide')}</span>
        </button>
      </div>

      <!-- TOP ROW RIGHT: GRAPH -->
      <div class="tl-viz-graph" style="display:flex;flex-direction:column;gap:8px;align-items:stretch;width:100%">
        <canvas class="tl-canvas-graph" id="tl-graphCanvas" width="640" height="420"></canvas>
      </div>

      <!-- BATH CONTROLS (full width row) -->
      <div class="tl-bath-bar tl-bath-bar--full-width">
        <div class="tl-bath-bar-top">
          <div class="tl-beaker-overlay">
            <span>Liquid: <b id="tl-bath-state">Water</b></span>
            <span><b class="tl-temp-badge" id="tl-bath-temp-display">25.0°C</b></span>
          </div>
          <div class="tl-bath-slider-wrap">
            <div class="tl-lr">
              <span>T<sub>bath</sub></span>
              <span class="tl-badge tl-lr-value tl-val-bath-temp" id="tl-val-bath-temp">25.0 °C</span>
            </div>
            <input type="range" id="tl-bath-temp-slider" min="0" max="200" step="0.5" value="25.0">
          </div>
        </div>
        <div class="tl-btn-group">
          <button class="tl-btn tl-preset-btn" id="tl-btn-preset-ice">Ice 0°C</button>
          <button class="tl-btn tl-preset-btn" id="tl-btn-preset-room">Room 25°C</button>
          <button class="tl-btn tl-preset-btn" id="tl-btn-preset-steam">Steam 100°C</button>
          <button class="tl-btn tl-preset-btn" id="tl-btn-preset-oil">Oil 150°C</button>
        </div>
      </div>

      <!-- DOCKED LIVE CALCULATIONS -->
      <div class="tl-live-calculations">
        <div class="tl-live-tab active" id="tl-live-liquid">
          <div class="tl-controls-steps">
            <div class="tl-info-label" style="margin-top:0;color:var(--tl-cyan)">Live calibration formula (Dual-Directional Realtime Calculations)</div>
            <div class="tl-worked-solution tl-dual-direction">
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">Direction A: Length to Temperature (L<sub>T</sub> &rarr; T)</div>
                <div class="tl-info-label tl-slope-label">Slope Equation:</div>
                <div id="tl-svg-formula-liquid" class="tl-math-formula" style="min-height:55px; margin:4px 0"></div>
                <p>Substitute current reading <b class="tl-live-value" id="tl-live-liquid-lt">5.50 cm</b>:</p>
                <div id="tl-svg-formula-liquid-sub" class="tl-math-formula" style="min-height:90px; margin:4px 0"></div>
              </div>
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">Direction B: Temperature to Length (T &rarr; L<sub>T</sub>)</div>
                <p>Substitute current bath temperature <b class="tl-live-value" id="tl-live-liquid-t-sub">25.0°C</b>:</p>
                <div id="tl-svg-formula-t-to-l" class="tl-math-formula" style="min-height:100px; margin:4px 0"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tl-live-tab" id="tl-live-resistance">
          <div class="tl-controls-steps">
            <div class="tl-info-label" style="margin-top:0;color:var(--tl-cyan)">Live calibration formula (Dual-Directional Realtime Calculations)</div>
            <div class="tl-worked-solution tl-dual-direction">
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">Direction A: Resistance to Temperature (R<sub>T</sub> &rarr; T)</div>
                <div class="tl-info-label tl-slope-label">Slope Equation:</div>
                <div id="tl-svg-formula-resistance" class="tl-math-formula" style="min-height:55px; margin:4px 0"></div>
                <p>Substitute current resistance <b class="tl-live-value" id="tl-live-resistance-rt">5.30 Ω</b>:</p>
                <div id="tl-svg-formula-resistance-sub" class="tl-math-formula" style="min-height:90px; margin:4px 0"></div>
              </div>
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">Direction B: Temperature to Resistance (T &rarr; R<sub>T</sub>)</div>
                <p>Substitute current bath temperature <b class="tl-live-value" id="tl-live-resistance-t-sub">25.0°C</b>:</p>
                <div id="tl-svg-formula-t-to-r" class="tl-math-formula" style="min-height:100px; margin:4px 0"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tl-live-tab" id="tl-live-thermistor">
          <div class="tl-controls-steps">
            <div class="tl-info-label" style="margin-top:0;color:var(--tl-green)">${t('tools.thermometerLab.thermistor.liveBetaLabel')}</div>
            <div class="tl-worked-solution" style="background-color:rgba(16,185,129,0.05);border-left-color:var(--tl-green)">
              <div id="tl-svg-formula-thermistor" class="tl-math-formula"></div>
              <p>Substitute current resistance <b class="tl-live-value" id="tl-live-thermistor-rt">10.00 kΩ</b>:</p>
              <div id="tl-svg-formula-thermistor-sub" class="tl-math-formula"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- FLOATING CONTROLS & SOLVERS -->
      <div class="tl-controls controls-collapsed">
        <div class="tl-controls-float-bar">
          <button type="button" class="tl-controls-drag-handle" id="tl-controls-drag" aria-label="${t('tools.floatingControls.dragHint')}" title="${t('tools.floatingControls.dragHint')}">⋮⋮</button>
          <button type="button" class="tl-controls-toggle" id="tl-controls-toggle" aria-expanded="false">
            <span data-float-chevron>▾</span>
            <span>${t('tools.thermometerLab.paramSettings')}</span>
          </button>
        </div>
        <div class="tl-controls-body">

        <!-- TAB 1: LIQUID-IN-GLASS -->
        <div class="tl-tab-content active" id="tl-tab-liquid">
          <details class="tl-details">
            <summary>${t('tools.thermometerLab.paramSettings')}</summary>
            <div class="tl-details-body">
              <div class="tl-cg">
                <span class="tl-section-label">Thermometric liquid</span>
                <div class="tl-seg" role="group" aria-label="Thermometric liquid">
                  <button type="button" class="tl-seg-btn active-mercury" id="tl-card-mercury" title="Mercury — boils at 356.7°C; suitable for high temperatures">
                    <span class="tl-dot mercury"></span> Hg
                  </button>
                  <button type="button" class="tl-seg-btn" id="tl-card-alcohol" title="Alcohol — boils at 78.4°C; vaporizes at high temperatures">
                    <span class="tl-dot alcohol"></span> Alcohol
                  </button>
                </div>
              </div>
              <div class="tl-warning-banner" id="tl-alcohol-boiling-warning">
                <strong>CRITICAL PHYSICS ALERT!</strong> Alcohol boils at 78.4°C. Dipping it into this temperature vaporizes the liquid, creating extreme pressure and breaking the thermometer. This is why alcohol <b>cannot</b> be used to measure hot oil (150°C)!
              </div>
              <div class="tl-param-grid">
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Bulb Volume (V<sub>b</sub>) [mm³]</span>
                    <input type="number" id="tl-input-bulb-vol" class="tl-param-num" min="10" max="1000" step="10" value="200">
                  </div>
                  <input type="range" id="tl-slider-bulb-vol" min="10" max="1000" step="10" value="200">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Wall Thickness (w) [mm]</span>
                    <input type="number" id="tl-input-wall-thick" class="tl-param-num" min="0.05" max="3.0" step="0.05" value="0.5">
                  </div>
                  <input type="range" id="tl-slider-wall-thick" min="0.05" max="3.0" step="0.05" value="0.5">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Capillary Bore Diameter (d) [mm]</span>
                    <input type="number" id="tl-input-capillary-bore" class="tl-param-num" min="0.05" max="2.0" step="0.05" value="0.3">
                  </div>
                  <input type="range" id="tl-slider-capillary-bore" min="0.05" max="2.0" step="0.05" value="0.3">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Ice Point Column Length (L<sub>0</sub>) [cm]</span>
                    <input type="number" id="tl-input-liquid-l0" class="tl-param-num" min="0.5" max="15.0" step="0.1" value="3.0">
                  </div>
                  <input type="range" id="tl-slider-liquid-l0" min="0.5" max="15.0" step="0.1" value="3.0">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Steam Point Column Length (L<sub>100</sub>) [cm]</span>
                    <input type="number" id="tl-input-liquid-l100" class="tl-param-num" min="5.0" max="30.0" step="0.1" value="13.0">
                  </div>
                  <input type="range" id="tl-slider-liquid-l100" min="5.0" max="30.0" step="0.1" value="13.0">
                </div>
              </div>
              <div class="tl-info-card tl-info-card--compact">
                τ = <b id="tl-val-response-time">0.65 s</b> · larger V<sub>b</sub> → slower equilibration
              </div>
            </div>
          </details>
        </div>

        <!-- TAB 2: PLATINUM RESISTANCE -->
        <div class="tl-tab-content" id="tl-tab-resistance">
          <details class="tl-details">
            <summary>${t('tools.thermometerLab.paramSettings')}</summary>
            <div class="tl-details-body">
              <div class="tl-probe-specs">
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">Ice Point Resistance (R<sub>0</sub>)</span>
                  <span class="tl-tile-val" id="tl-spec-resistance-r0">5.0 Ω</span>
                </div>
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">Steam Point Resistance (R<sub>100</sub>)</span>
                  <span class="tl-tile-val" id="tl-spec-resistance-r100">6.2 Ω</span>
                </div>
              </div>
              <div class="tl-param-grid">
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Ice Point Resistance (R<sub>0</sub>) [Ω]</span>
                    <input type="number" id="tl-input-resistance-r0" class="tl-param-num" min="0.5" max="20.0" step="0.1" value="5.0">
                  </div>
                  <input type="range" id="tl-slider-resistance-r0" min="0.5" max="20.0" step="0.1" value="5.0">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Steam Point Resistance (R<sub>100</sub>) [Ω]</span>
                    <input type="number" id="tl-input-resistance-r100" class="tl-param-num" min="2.0" max="30.0" step="0.1" value="6.2">
                  </div>
                  <input type="range" id="tl-slider-resistance-r100" min="2.0" max="30.0" step="0.1" value="6.2">
                </div>
              </div>
              <div class="tl-info-card" style="border-color:rgba(245,158,11,0.3)">
                <div class="tl-info-label" style="color:#f59e0b">Fundamental Assumption</div>
                <p>To calculate temperature using linear calibration, it is <b>fundamentally assumed that electrical resistance varies linearly with temperature</b>.</p>
              </div>
            </div>
          </details>
        </div>

        <!-- TAB 3: THERMISTOR -->
        <div class="tl-tab-content" id="tl-tab-thermistor">
          <details class="tl-details">
            <summary>${t('tools.thermometerLab.paramSettings')}</summary>
            <div class="tl-details-body">
              <div class="tl-probe-specs">
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">Resistance at 25°C (R<sub>25</sub>)</span>
                  <span class="tl-tile-val" id="tl-spec-thermistor-r25">10.0 kΩ</span>
                </div>
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">Beta Parameter (β)</span>
                  <span class="tl-tile-val" id="tl-spec-thermistor-beta">3500 K</span>
                </div>
              </div>
              <div class="tl-param-grid">
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Resistance at 25°C (R<sub>25</sub>) [kΩ]</span>
                    <input type="number" id="tl-input-thermistor-r25" class="tl-param-num" min="0.5" max="50.0" step="0.1" value="10.0">
                  </div>
                  <input type="range" id="tl-slider-thermistor-r25" min="0.5" max="50.0" step="0.1" value="10.0">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>Beta Parameter (β) [K]</span>
                    <input type="number" id="tl-input-thermistor-beta" class="tl-param-num" min="1000" max="8000" step="50" value="3500">
                  </div>
                  <input type="range" id="tl-slider-thermistor-beta" min="1000" max="8000" step="50" value="3500">
                </div>
              </div>
            </div>
          </details>
        </div>

        </div>
      </div>
    </div>
  `;

  // --- STATE MANAGEMENT ---
  const state = {
    liquidType: 'mercury',
    thermometerType: defaultType,
    bulbVolume: 200,
    wallThickness: 0.5,
    capillaryBore: 0.3,
    liquidL0: 3.0,
    liquidL100: 13.0,
    resistanceR0: 5.0,
    resistanceR100: 6.2,
    thermistorR25: 10.0,
    thermistorBeta: 3500,

    bathTemp: 25.0,
    thermometerTemp: 25.0,

    bubbles: [],
    iceCubes: [],
    heatWaves: [],
    steamParticles: [],

    currentLength: 5.5,
    currentResistance: 5.3,
    currentThermistorR: 10.0,

    lastTimestamp: 0,
    showLabels: true
  };

  const TL_SVG = { xs: 11, sm: 14, md: 17, lg: 18, sub: 10 };

  function clampSnapParam(val, min, max, step) {
    let v = Math.min(max, Math.max(min, val));
    if (step > 0) {
      v = Math.round(v / step) * step;
      v = Math.min(max, Math.max(min, parseFloat(v.toFixed(10))));
    }
    return v;
  }

  function bindParamPair(slider, input, { min, max, step, decimals, onUpdate }) {
    function applyValue(raw) {
      const parsed = Number.isFinite(raw) ? raw : min;
      const v = clampSnapParam(parsed, min, max, step);
      slider.value = v;
      input.value = v.toFixed(decimals);
      onUpdate(v);
    }

    slider.addEventListener('input', () => applyValue(parseFloat(slider.value)));
    input.addEventListener('change', () => applyValue(parseFloat(input.value)));
    input.addEventListener('blur', () => applyValue(parseFloat(input.value)));
  }

  const PHYS_WIDTH = 460;
  const PHYS_HEIGHT = 340;
  const LABEL_MARGIN = 8;
  const LABEL_LEFT = 10;
  const PHYS_SCENE_OFFSET_X = 40;
  const PHYS_SCENE_OFFSET_Y = 44;
  const SCENE_WIDTH = PHYS_WIDTH - PHYS_SCENE_OFFSET_X;
  const BEAKER_W = 130;
  const GRAPH_WIDTH = 640;
  const GRAPH_HEIGHT = 420;

  function getPhysLayout() {
    if (state.thermometerType === 'liquid') {
      const beakerX = SCENE_WIDTH / 2 - BEAKER_W / 2;
      return { beakerX, beakerW: BEAKER_W, thermometerX: SCENE_WIDTH / 2 };
    }
    return { beakerX: 55, beakerW: BEAKER_W, thermometerX: 120 };
  }

  function getGraphLayout() {
    const margin = { left: 110, top: 48, right: 30, bottom: 65 };
    return {
      gx: margin.left,
      gy: margin.top,
      gw: GRAPH_WIDTH - margin.left - margin.right,
      gh: GRAPH_HEIGHT - margin.top - margin.bottom,
      tickFont: `bold ${Math.round(GRAPH_WIDTH * 0.024)}px Arial`,
      axisFont: `bold ${Math.round(GRAPH_WIDTH * 0.026)}px Arial`,
      dotR: 8,
      yLabelX: margin.left - 75,
      xLabelY: GRAPH_HEIGHT - margin.bottom + 32,
    };
  }

  function getTempAxisScale() {
    return { minT: 0, maxT: 200, tickStep: 25 };
  }

  function mapGraphX(t, minT, maxT, gx, gw) {
    return gx + ((t - minT) / (maxT - minT)) * gw;
  }

  function mapGraphY(v, minV, maxV, gy, gh) {
    return gy + gh - ((v - minV) / (maxV - minV)) * gh;
  }

  /** Temperature span where R(T) stays inside the visible y-axis range. */
  function getVisibleResistanceLineRange(minT, maxT, minR, maxR) {
    const r0 = state.resistanceR0;
    const slope = (state.resistanceR100 - state.resistanceR0) / 100;
    let tStart = minT;
    let tEnd = maxT;

    if (Math.abs(slope) > 1e-9) {
      const tAtMinR = (minR - r0) / slope;
      const tAtMaxR = (maxR - r0) / slope;
      const tLow = Math.min(tAtMinR, tAtMaxR);
      const tHigh = Math.max(tAtMinR, tAtMaxR);
      tStart = Math.max(minT, tLow);
      tEnd = Math.min(maxT, tHigh);
    } else if (r0 < minR || r0 > maxR) {
      return null;
    }

    if (tEnd <= tStart) {
      tStart = minT;
      tEnd = Math.min(100, maxT);
    }

    return { tStart, tEnd };
  }

  function drawGraphAxes(ctx, layout, minT, maxT, tStep, yTicks, activeTemp = null) {
    const { gx, gy, gw, gh, tickFont, axisFont, yLabelX, xLabelY } = layout;

    // Grid lines background
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1.0;
    for (const tick of yTicks) {
      const yGrid = mapGraphY(tick.value, tick.min, tick.max, gy, gh);
      ctx.beginPath();
      ctx.moveTo(gx, yGrid);
      ctx.lineTo(gx + gw, yGrid);
      ctx.stroke();
    }
    for (let tVal = minT; tVal <= maxT + 0.01; tVal += tStep) {
      const xGrid = mapGraphX(tVal, minT, maxT, gx, gw);
      ctx.beginPath();
      ctx.moveTo(xGrid, gy);
      ctx.lineTo(xGrid, gy + gh);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    ctx.fillStyle = '#4b5563';
    ctx.font = tickFont;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (const tick of yTicks) {
      const yGrid = mapGraphY(tick.value, tick.min, tick.max, gy, gh);
      ctx.fillText(tick.label, gx - 15, yGrid);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let tVal = minT; tVal <= maxT + 0.01; tVal += tStep) {
      if (activeTemp != null && Math.abs(tVal - activeTemp) < 0.25) continue;
      const xGrid = mapGraphX(tVal, minT, maxT, gx, gw);
      ctx.fillText(`${Math.round(tVal)}`, xGrid, gy + gh + 10);
    }

    return { gx, gy, gw, gh, axisFont, yLabelX, xLabelY };
  }

  function buildLengthTicks(minL, maxL) {
    const span = maxL - minL;
    const step = span <= 8 ? 1 : span <= 14 ? 2 : 5;
    const ticks = [];
    const start = Math.ceil(minL / step) * step;
    for (let l = start; l <= maxL + 0.001; l += step) {
      ticks.push({
        value: l,
        label: l % 1 === 0 ? `${l.toFixed(0)}` : `${l.toFixed(1)}`,
        min: minL,
        max: maxL,
      });
    }
    return ticks;
  }

  function getLiquidLengthBounds() {
    const { maxT } = getTempAxisScale();
    const lMin = liquidLengthAtTemp(0);
    const lMax = liquidLengthAtTemp(maxT);
    const span = lMax - lMin;
    const pad = Math.max(1, span * 0.1);
    const minL = Math.max(0, Math.round((lMin - pad) * 10) / 10);
    const maxL = Math.round((lMax + pad) * 10) / 10;
    return { minL, maxL };
  }

  function liquidLengthAtTemp(t) {
    return state.liquidL0 + ((state.liquidL100 - state.liquidL0) / 100) * t;
  }

  function getResistanceBounds() {
    const rAt0 = state.resistanceR0;
    const rAt100 = state.resistanceR100;
    const rCur = state.currentResistance;
    const rLo = Math.min(rAt0, rAt100, rCur);
    const rHi = Math.max(rAt0, rAt100, rCur);
    const span = Math.max(rHi - rLo, 0.4);
    const pad = Math.max(0.2, span * 0.12);
    let minR = Math.max(0, Math.floor((rLo - pad) * 10) / 10);
    let maxR = Math.ceil((rHi + pad) * 10) / 10;
    if (maxR <= minR) maxR = minR + Math.max(span, 0.5);
    const step = span <= 2 ? 0.5 : span <= 4 ? 1 : span <= 20 ? 2 : 5;
    const ticks = [];
    const start = Math.ceil(minR / step) * step;
    for (let r = start; r <= maxR + 0.001; r += step) {
      ticks.push({
        value: r,
        label: r.toFixed(1),
        min: minR,
        max: maxR,
      });
    }
    return { minR, maxR, ticks };
  }

  function resistanceAtTemp(t) {
    return state.resistanceR0 + ((state.resistanceR100 - state.resistanceR0) / 100) * t;
  }

  function getThermistorBounds(tempScale) {
    const { maxT } = tempScale;
    let maxR = state.thermistorR25;
    for (let tVal = 0; tVal <= maxT; tVal += 5) {
      const tempK = tVal + 273.15;
      const r = state.thermistorR25 * Math.exp(state.thermistorBeta * (1 / tempK - 1 / 298.15));
      maxR = Math.max(maxR, r);
    }
    maxR = Math.ceil(maxR * 1.08 * 10) / 10;
    const minR = 0;
    const step = maxR <= 12 ? 2 : 4;
    const ticks = [];
    for (let r = 0; r <= maxR + 0.001; r += step) {
      ticks.push({
        value: r,
        label: r.toFixed(0),
        min: minR,
        max: maxR,
      });
    }
    return { minR, maxR, ticks };
  }

  const physCanvas = wrap.querySelector('#tl-thermometerCanvas');
  const physCtx = physCanvas.getContext('2d');
  const graphCanvas = wrap.querySelector('#tl-graphCanvas');
  const graphCtx = graphCanvas.getContext('2d');

  // DPI setup
  const dpr = window.devicePixelRatio || 1;
  physCanvas.width = PHYS_WIDTH * dpr;
  physCanvas.height = PHYS_HEIGHT * dpr;
  physCtx.scale(dpr, dpr);

  graphCanvas.width = GRAPH_WIDTH * dpr;
  graphCanvas.height = GRAPH_HEIGHT * dpr;
  graphCtx.scale(dpr, dpr);

  // Particles
  function initParticles() {
    const { beakerX, beakerW } = getPhysLayout();
    const innerX = beakerX + 5;
    const innerW = beakerW - 10;
    state.iceCubes = [];
    for (let i = 0; i < 5; i++) {
      state.iceCubes.push({
        x: innerX + Math.random() * innerW,
        y: 200 + Math.random() * 15,
        size: 12 + Math.random() * 8,
        angle: Math.random() * Math.PI,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15
      });
    }
    state.bubbles = [];
    for (let i = 0; i < 20; i++) {
      state.bubbles.push({
        x: innerX + Math.random() * innerW,
        y: 190 + Math.random() * 70,
        r: 1 + Math.random() * 3.5,
        speedY: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08
      });
    }
    state.heatWaves = [];
    for (let i = 0; i < 8; i++) {
      state.heatWaves.push({
        x: beakerX + 10 + Math.random() * (beakerW - 20),
        y: 190 + Math.random() * 60,
        length: 15 + Math.random() * 15,
        speedY: 0.5 + Math.random() * 0.6,
        opacity: 0.15 + Math.random() * 0.25
      });
    }
    state.steamParticles = [];
    for (let i = 0; i < 12; i++) {
      state.steamParticles.push({
        x: innerX + Math.random() * innerW,
        y: 175 + Math.random() * 10,
        r: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.4 - Math.random() * 0.6,
        alpha: 0.2 + Math.random() * 0.4
      });
    }
  }

  const BULB_VOLUME_REF = 200;
  const BULB_RADIUS_REF = 11;

  function getBulbVisualRadius() {
    const scale = Math.pow(state.bulbVolume / BULB_VOLUME_REF, 1 / 3);
    return BULB_RADIUS_REF * scale;
  }

  function getResponseTimeConstant() {
    if (state.thermometerType === 'resistance' || state.thermometerType === 'thermistor') {
      return 0.35;
    }
    const conductivityFactor = state.liquidType === 'mercury' ? 1.0 : 8.0;
    const thicknessFactor = 0.2 + state.wallThickness * 1.5;
    const volumeFactor = 0.4 + state.bulbVolume * 0.003;
    const capillaryFactor = 1.35 - state.capillaryBore * 0.45;
    return Math.max(0.1, thicknessFactor * volumeFactor * capillaryFactor * conductivityFactor * 0.15);
  }

  function updateParticles(dt) {
    const { beakerX, beakerW } = getPhysLayout();
    const innerX = beakerX + 5;
    const innerW = beakerW - 10;
    const iceMinX = beakerX + 10;
    const iceMaxX = beakerX + beakerW - 10;
    if (state.bathTemp <= 8) {
      state.iceCubes.forEach(ice => {
        ice.x += ice.speedX;
        ice.y += ice.speedY;
        if (ice.x < iceMinX || ice.x > iceMaxX) ice.speedX *= -1;
        if (ice.y < 195 || ice.y > 210) ice.speedY *= -1;
      });
    }
    if (state.bathTemp > 35) {
      state.heatWaves.forEach(wave => {
        wave.y -= wave.speedY * (1.0 + state.bathTemp / 100);
        if (wave.y < 185) {
          wave.y = 265;
          wave.x = beakerX + 10 + Math.random() * (beakerW - 20);
        }
      });
    }
    if (state.bathTemp >= 80) {
      state.bubbles.forEach(bubble => {
        bubble.y -= bubble.speedY * (1.0 + (state.bathTemp - 80) / 40);
        bubble.phase += bubble.wobbleSpeed;
        bubble.x += Math.sin(bubble.phase) * 0.3;
        if (bubble.y < 185) {
          bubble.y = 260 + Math.random() * 10;
          bubble.x = innerX + Math.random() * innerW;
        }
      });
    }
    if (state.bathTemp >= 95) {
      state.steamParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.005;
        if (p.alpha <= 0 || p.y < 130) {
          p.x = innerX + Math.random() * innerW;
          p.y = 175 + Math.random() * 5;
          p.alpha = 0.2 + Math.random() * 0.4;
        }
      });
    }
  }

  function drawBeaker(ctx, layout) {
    const bx = layout.beakerX;
    const by = 180;
    const bw = layout.beakerW;
    const bh = 100;
    const waterY = 190;

    let r = 59, g = 130, b = 246;
    if (state.bathTemp < 25) {
      const ratio = state.bathTemp / 25;
      r = Math.round(180 - ratio * 121);
      g = Math.round(210 - ratio * 80);
      b = Math.round(250 - ratio * 4);
    } else {
      const ratio = Math.min(1.0, (state.bathTemp - 25) / 125);
      r = Math.round(59 + ratio * 180);
      g = Math.round(130 - ratio * 100);
      b = Math.round(246 - ratio * 190);
    }

    // Glowing heating element at the bottom (burner)
    if (state.bathTemp > 40) {
      const intensity = Math.min(1.0, (state.bathTemp - 40) / 100);
      const t = Date.now() * 0.02;
      
      // Draw glowing burner base
      ctx.fillStyle = `rgba(239, 68, 68, ${intensity * 0.25})`;
      ctx.beginPath();
      ctx.roundRect(bx - 10, by + bh + 4, bw + 20, 10, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.beginPath();
      ctx.moveTo(bx + bw/2 - 25, by + bh + 4);
      for (let dx = -25; dx <= 25; dx += 6) {
        const fHeight = intensity * (12 + Math.sin(dx * 0.4 + t) * 5);
        ctx.lineTo(bx + bw/2 + dx, by + bh + 4 - fHeight);
      }
      ctx.lineTo(bx + bw/2 + 25, by + bh + 4);
      ctx.closePath();
      ctx.fill();
    }

    // Beaker shadow/background
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(240, 240, 245, 0.6)';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [0, 0, 10, 10]);
    ctx.fill();

    // Water/Liquid
    const waterGrad = ctx.createLinearGradient(bx, waterY, bx, by + bh);
    waterGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`);
    waterGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.65)`);
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.moveTo(bx, waterY);
    const waveAmp = state.bathTemp >= 80 ? 2.0 : 0.5;
    const waveFreq = state.bathTemp >= 80 ? 0.09 : 0.03;
    const t = Date.now() * waveFreq;
    for (let x = bx; x <= bx + bw; x += 5) {
      const y = waterY + Math.sin(x * 0.15 + t) * waveAmp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx, by + bh);
    ctx.closePath();
    ctx.fill();

    // Heat waves
    if (state.bathTemp > 35) {
      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.min(0.5, (state.bathTemp-35)/120)})`;
      ctx.lineWidth = 1.2;
      state.heatWaves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(wave.x, wave.y);
        ctx.quadraticCurveTo(wave.x + Math.sin(wave.y*0.06)*5, wave.y - wave.length/2, wave.x, wave.y - wave.length);
        ctx.stroke();
      });
    }

    // Floating Ice Cubes
    if (state.bathTemp <= 8) {
      ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
      ctx.lineWidth = 1.0;
      state.iceCubes.forEach(ice => {
        ctx.save();
        ctx.translate(ice.x, ice.y);
        ctx.rotate(ice.angle);
        ctx.beginPath();
        ctx.roundRect(-ice.size/2, -ice.size/2, ice.size, ice.size, 3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    // Boiling Bubbles
    if (state.bathTemp >= 80) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 0.6;
      state.bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Steam particles rising above the beaker
    if (state.bathTemp >= 95) {
      state.steamParticles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Beaker Glass Outline (High Fidelity)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(bx - 1, by);
    ctx.lineTo(bx - 1, by + bh - 8);
    ctx.arcTo(bx - 1, by + bh + 1, bx + 10, by + bh + 1, 8);
    ctx.lineTo(bx + bw - 10, by + bh + 1);
    ctx.arcTo(bx + bw + 1, by + bh + 1, bx + bw + 1, by + bh - 8, 8);
    ctx.lineTo(bx + bw + 1, by);
    ctx.stroke();

    // Glass reflection highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 4, by + 10);
    ctx.lineTo(bx + 4, by + bh - 10);
    ctx.stroke();
  }

  function wrapLabelText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];

    function pushLongSegment(segment) {
      if (ctx.measureText(segment).width <= maxWidth) {
        lines.push(segment);
        return;
      }
      let chunk = '';
      for (const ch of segment) {
        const test = chunk + ch;
        if (ctx.measureText(test).width > maxWidth && chunk) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk = test;
        }
      }
      if (chunk) lines.push(chunk);
    }

    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth || !current) {
        current = test;
      } else {
        pushLongSegment(current);
        current = word;
      }
    }
    if (current) pushLongSegment(current);
    return lines.length ? lines : [text];
  }

  function drawLabelLine(ctx, startX, startY, endX, endY, text, align = 'left') {
    if (!state.showLabels) return;

    ctx.font = 'bold 9px system-ui, sans-serif';
    const lineHeight = 11;
    const padX = 5;
    const padY = 3;
    const maxWidth = Math.max(
      40,
      align === 'left'
        ? SCENE_WIDTH - endX - LABEL_MARGIN
        : endX - LABEL_MARGIN
    );

    const lines = wrapLabelText(ctx, text, maxWidth);
    const textWidths = lines.map((line) => ctx.measureText(line).width);
    const boxW = Math.max(...textWidths) + padX * 2;
    const boxH = lines.length * lineHeight + padY * 2;

    let bx = align === 'left' ? endX : endX - boxW;
    bx = Math.max(LABEL_MARGIN, Math.min(bx, SCENE_WIDTH - boxW - LABEL_MARGIN));
    const by = endY - boxH / 2;
    const lineEndX = align === 'left' ? bx : bx + boxW;

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(lineEndX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((line, i) => {
      const ty = by + padY + lineHeight * (i + 0.5);
      ctx.fillText(line, bx + boxW / 2, ty);
    });
  }

  function drawLiquidThermometer(ctx, layout) {
    const x = layout.thermometerX;
    const stemTop = 20;
    const bulbRadius = getBulbVisualRadius();
    const bulbCenterY = 250 + Math.max(0, bulbRadius - BULB_RADIUS_REF) * 0.35;
    const stemBottom = bulbCenterY - bulbRadius - 1;
    const glassWidth = 10 + state.wallThickness * 8;
    const leftX = x - glassWidth / 2;
    const rightX = x + glassWidth / 2;

    // Glass Stem Shading (3D effect)
    const glassGrad = ctx.createLinearGradient(leftX, stemTop, rightX, stemTop);
    glassGrad.addColorStop(0, 'rgba(226, 232, 240, 0.9)');
    glassGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.98)');
    glassGrad.addColorStop(0.5, 'rgba(248, 250, 252, 0.35)');
    glassGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.98)');
    glassGrad.addColorStop(1, 'rgba(186, 200, 219, 0.95)');

    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX, stemBottom);
    ctx.lineTo(leftX, stemTop + 5);
    ctx.arcTo(leftX, stemTop, leftX + 5, stemTop, 5);
    ctx.arcTo(rightX, stemTop, rightX, stemTop + 5, 5);
    ctx.lineTo(rightX, stemBottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bulb Glass Shell
    const bulbGrad = ctx.createRadialGradient(
      x - bulbRadius*0.2, bulbCenterY - bulbRadius*0.2, bulbRadius*0.1,
      x, bulbCenterY, bulbRadius
    );
    bulbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    bulbGrad.addColorStop(1, 'rgba(203, 213, 225, 0.45)');
    ctx.fillStyle = bulbGrad;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8 + state.wallThickness * 0.6;
    ctx.beginPath();
    ctx.arc(x, bulbCenterY, bulbRadius + 0.5 + state.wallThickness * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Capillary Bore (Dark inner channel)
    const boreWidth = Math.min(glassWidth * 0.72, 0.8 + state.capillaryBore * 4.5);
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(x - boreWidth / 2, stemTop + 8, boreWidth, stemBottom - stemTop - 8);

    const isMercury = state.liquidType === 'mercury';
    const color = isMercury ? '#d1d5db' : '#ff3b30';
    const reflectionColor = '#ffffff';

    const zeroY = 210;
    const maxC = 220;
    const maxCY = 40;
    const pixelsPerC = (zeroY - maxCY) / maxC;
    const currentY = zeroY - Math.min(maxC, state.thermometerTemp) * pixelsPerC;

    // Draw Liquid column inside capillary
    ctx.fillStyle = color;
    ctx.fillRect(x - boreWidth/2, currentY, boreWidth, stemBottom - currentY);
    
    // Draw liquid meniscus (curved top)
    ctx.beginPath();
    ctx.ellipse(x, currentY, boreWidth/2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Liquid reflection highlight
    ctx.fillStyle = reflectionColor;
    ctx.fillRect(x - boreWidth/6, currentY, boreWidth/3, stemBottom - currentY);

    // Liquid in Bulb
    const bulbCoreRadius = bulbRadius * 0.9;
    const liquidBulbGrad = ctx.createRadialGradient(
      x - bulbCoreRadius*0.2, bulbCenterY - bulbCoreRadius*0.2, bulbCoreRadius*0.1,
      x, bulbCenterY, bulbCoreRadius
    );
    if (isMercury) {
      liquidBulbGrad.addColorStop(0, '#ffffff');
      liquidBulbGrad.addColorStop(0.3, '#e4e4e7');
      liquidBulbGrad.addColorStop(0.8, '#a1a1aa');
      liquidBulbGrad.addColorStop(1, '#52525b');
    } else {
      liquidBulbGrad.addColorStop(0, '#ffffff');
      liquidBulbGrad.addColorStop(0.25, '#ff4d4d');
      liquidBulbGrad.addColorStop(0.75, '#ff0000');
      liquidBulbGrad.addColorStop(1, '#990000');
    }
    ctx.fillStyle = liquidBulbGrad;
    ctx.beginPath();
    ctx.arc(x, bulbCenterY, bulbCoreRadius, 0, Math.PI * 2);
    ctx.fill();

    // Scale markings
    ctx.strokeStyle = 'rgba(161, 161, 170, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.font = '6.5px Arial';
    ctx.fillStyle = '#a1a1aa';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let tVal = 0; tVal <= 200; tVal += 50) {
      const yTick = zeroY - tVal * pixelsPerC;
      ctx.beginPath();
      ctx.moveTo(leftX, yTick);
      ctx.lineTo(leftX + 4, yTick);
      ctx.stroke();
      ctx.fillText(`${tVal}°C`, leftX - 22, yTick + 2.5);
    }

    // Structure Labels
    if (state.showLabels) {
      const labelColRight = layout.beakerX + layout.beakerW + 12;
      const labelColLeftEnd = leftX - 28;
      drawLabelLine(ctx, leftX + 1, stemTop + 60, labelColLeftEnd, stemTop + 60, t('tools.thermometerLab.labels.thinWall'), 'right');
      drawLabelLine(ctx, rightX + 1, currentY, labelColRight, currentY, t('tools.thermometerLab.labels.meniscus'), 'left');
      drawLabelLine(ctx, leftX, stemTop + 110, labelColLeftEnd, stemTop + 110, t('tools.thermometerLab.labels.narrowBore'), 'right');
      drawLabelLine(ctx, rightX + 1, bulbCenterY, labelColRight, bulbCenterY, t('tools.thermometerLab.labels.largeBulb'), 'left');
    }
  }

  function drawResistanceProbe(ctx, layout) {
    const x = layout.thermometerX;
    const probeTop = 20;
    const probeBottom = 245;
    const width = 10;
    const rx = x - width / 2;

    // Metallic probe sheath
    const probeGrad = ctx.createLinearGradient(rx, probeTop, rx + width, probeTop);
    probeGrad.addColorStop(0, '#94a3b8');
    probeGrad.addColorStop(0.3, '#ffffff');
    probeGrad.addColorStop(0.7, '#e2e8f0');
    probeGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = probeGrad;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rx, probeTop, width, probeBottom - probeTop, [0, 0, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Platinum Coil Cutaway (Schematic view inside the tip)
    ctx.fillStyle = 'rgba(240, 240, 245, 0.85)';
    ctx.fillRect(rx + 2, probeBottom - 45, width - 4, 40);
    
    // Draw platinum coil wire
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let cy = probeBottom - 40;
    ctx.moveTo(x - 2, cy);
    for (let i = 0; i < 8; i++) {
      cy += 4;
      ctx.lineTo(x + 2, cy);
      cy += 4;
      ctx.lineTo(x - 2, cy);
    }
    ctx.stroke();

    // Connecting wires from probe top to meter
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x - 2, probeTop);
    ctx.bezierCurveTo(x - 10, probeTop - 15, 200, 30, 245, 60);
    ctx.stroke();

    ctx.strokeStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(x + 2, probeTop);
    ctx.bezierCurveTo(x + 10, probeTop - 12, 210, 45, 245, 75);
    ctx.stroke();

    // Digital Meter
    const ox = 245;
    const oy = 40;
    const ow = 135;
    const oh = 90;

    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(ox, oy, ow, oh, 10);
    ctx.fill();
    ctx.stroke();

    // Meter screen
    ctx.fillStyle = '#022c22';
    ctx.beginPath();
    ctx.roundRect(ox + 10, oy + 12, ow - 20, 34, 4);
    ctx.fill();

    // Glowing resistance display
    ctx.font = 'bold 17px "Courier New"';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'right';
    ctx.fillText(state.currentResistance.toFixed(2) + ' Ω', ox + ow - 16, oy + 34);

    ctx.font = '6px Arial';
    ctx.fillStyle = '#a7f3d0';
    ctx.textAlign = 'left';
    ctx.fillText('PLATINUM RTD METER', ox + 14, oy + 21);

    // Structure Labels
    if (state.showLabels) {
      const labelColRight = layout.beakerX + layout.beakerW + 12;
      const labelColLeftEnd = rx - 8;
      drawLabelLine(ctx, rx + 1, probeTop + 80, labelColLeftEnd, probeTop + 80, t('tools.thermometerLab.labels.metalSheath'), 'right');
      drawLabelLine(ctx, rx + width, probeBottom - 20, labelColRight, probeBottom - 20, t('tools.thermometerLab.labels.platinumCoil'), 'left');
    }
  }

  function drawThermistorProbe(ctx, layout) {
    const x = layout.thermometerX;
    const probeTop = 20;
    const beadY = 245;

    // Fine wires
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - 2, probeTop);
    ctx.lineTo(x - 2, beadY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 2, probeTop);
    ctx.lineTo(x + 2, beadY);
    ctx.stroke();

    // Glass tube sheath
    const tubeTop = 20;
    const tubeBottom = 225;
    const tubeWidth = 12;
    const tx = x - tubeWidth / 2;

    const tubeGrad = ctx.createLinearGradient(tx, tubeTop, tx + tubeWidth, tubeTop);
    tubeGrad.addColorStop(0, 'rgba(241, 245, 249, 0.5)');
    tubeGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.95)');
    tubeGrad.addColorStop(0.7, 'rgba(248, 250, 252, 0.6)');
    tubeGrad.addColorStop(1, 'rgba(226, 232, 240, 0.75)');

    ctx.fillStyle = tubeGrad;
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.75)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(tx, tubeTop, tubeWidth, tubeBottom - tubeTop, [0, 0, 3, 3]);
    ctx.fill();
    ctx.stroke();

    // Semiconductor Bead (3D Radial Gradient)
    const beadRadius = 7;
    const beadGrad = ctx.createRadialGradient(
      x - beadRadius * 0.2, beadY - beadRadius * 0.2, beadRadius * 0.1,
      x, beadY, beadRadius
    );
    beadGrad.addColorStop(0, '#6b7280');
    beadGrad.addColorStop(0.7, '#1f2937');
    beadGrad.addColorStop(1, '#09090b');

    ctx.fillStyle = beadGrad;
    ctx.strokeStyle = '#030712';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, beadY, beadRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Leads to meter
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x - 2, probeTop);
    ctx.bezierCurveTo(x - 10, probeTop - 15, 200, 30, 245, 60);
    ctx.stroke();

    ctx.strokeStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(x + 2, probeTop);
    ctx.bezierCurveTo(x + 10, probeTop - 12, 210, 45, 245, 75);
    ctx.stroke();

    // Digital Meter
    const ox = 245;
    const oy = 40;
    const ow = 135;
    const oh = 90;

    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(ox, oy, ow, oh, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#022c22';
    ctx.beginPath();
    ctx.roundRect(ox + 10, oy + 12, ow - 20, 34, 4);
    ctx.fill();

    ctx.font = 'bold 17px "Courier New"';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'right';
    ctx.fillText(state.currentThermistorR.toFixed(2) + ' kΩ', ox + ow - 16, oy + 34);

    ctx.font = '5px Arial';
    ctx.fillStyle = '#a7f3d0';
    ctx.textAlign = 'left';
    ctx.fillText(t('tools.thermometerLab.thermistor.meterLabelLine1'), ox + 14, oy + 52);
    ctx.fillText(t('tools.thermometerLab.thermistor.meterLabelLine2'), ox + 14, oy + 59);

    // Structure Labels
    if (state.showLabels) {
      const labelColRight = layout.beakerX + layout.beakerW + 12;
      const labelColLeftEnd = tx - 8;
      drawLabelLine(ctx, tx, probeTop + 100, labelColLeftEnd, probeTop + 100, t('tools.thermometerLab.labels.leads'), 'right');
      drawLabelLine(ctx, tx + tubeWidth, beadY, labelColRight, beadY, t('tools.thermometerLab.labels.semiconductorBead'), 'left');
    }
  }

  function drawGraphCrosshair(ctx, layout, px, py, xVal, yVal, xUnit, yUnit, color) {
    const { gx, gy, gw, gh, tickFont } = layout;
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 4]);

    // Projection to X-axis
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, gy + gh);
    ctx.stroke();

    // Projection to Y-axis
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(gx, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing labels on axes (x-axis aligned with tick labels at gy + gh + 10)
    const xTickY = gy + gh + 10;
    ctx.font = tickFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xText = `${xVal.toFixed(1)}${xUnit}`;
    const xTextW = ctx.measureText(xText).width + 10;
    const xPillH = 18;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(px - xTextW / 2, xTickY - 2, xTextW, xPillH, 3);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(xText, px, xTickY);

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yText = `${yVal.toFixed(2)} ${yUnit}`;
    const yTextW = ctx.measureText(yText).width + 10;
    const yfillStyle = color; // use the same color
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(gx - yTextW - 2, py - 7, yTextW, 15, 3);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(yText, gx - 7, py);
  }

  function drawLiquidGraph(ctx) {
    const layout = getGraphLayout();
    const { minL, maxL } = getLiquidLengthBounds();
    const { minT, maxT, tickStep } = getTempAxisScale();
    const yTicks = buildLengthTicks(minL, maxL);
    const axis = drawGraphAxes(ctx, layout, minT, maxT, tickStep, yTicks, state.thermometerTemp);
    const { gx, gy, gw, gh, axisFont, yLabelX, xLabelY, dotR } = { ...layout, ...axis };

    ctx.save();
    ctx.translate(yLabelX, gy + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Length of liquid column / cm', 0, 0);
    ctx.restore();

    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.fillText('temperature / °C', gx + gw / 2, xLabelY);

    const tLineEnd = maxT;
    const px0 = mapGraphX(0, minT, maxT, gx, gw);
    const py0 = mapGraphY(liquidLengthAtTemp(0), minL, maxL, gy, gh);
    const pxEnd = mapGraphX(tLineEnd, minT, maxT, gx, gw);
    const pyEnd = mapGraphY(liquidLengthAtTemp(tLineEnd), minL, maxL, gy, gh);

    // Linear line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px0, py0);
    ctx.lineTo(pxEnd, pyEnd);
    ctx.stroke();

    const currentT = state.thermometerTemp;
    const currentL = state.currentLength;
    if (currentT >= minT && currentT <= maxT) {
      const px = mapGraphX(currentT, minT, maxT, gx, gw);
      const py = mapGraphY(currentL, minL, maxL, gy, gh);

      // Draw crosshair projection
      drawGraphCrosshair(ctx, layout, px, py, currentT, currentL, '°C', 'cm', '#ef4444');

      // Glowing dot
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
  }

  function drawResistanceGraph(ctx) {
    const layout = getGraphLayout();
    const { minR, maxR, ticks } = getResistanceBounds();
    const tempScale = getTempAxisScale();
    const axis = drawGraphAxes(ctx, layout, tempScale.minT, tempScale.maxT, tempScale.tickStep, ticks, state.thermometerTemp);
    const { gx, gy, gw, gh, axisFont, yLabelX, xLabelY, dotR } = { ...layout, ...axis };

    ctx.save();
    ctx.translate(yLabelX, gy + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Resistance of platinum / Ω', 0, 0);
    ctx.restore();

    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.fillText('temperature / °C', gx + gw / 2, xLabelY);

    const { minT, maxT } = tempScale;
    const lineRange = getVisibleResistanceLineRange(minT, maxT, minR, maxR);

    // Linear calibration line, clipped to visible graph area
    if (lineRange) {
      const pxStart = mapGraphX(lineRange.tStart, minT, maxT, gx, gw);
      const pyStart = mapGraphY(resistanceAtTemp(lineRange.tStart), minR, maxR, gy, gh);
      const pxEndLine = mapGraphX(lineRange.tEnd, minT, maxT, gx, gw);
      const pyEndLine = mapGraphY(resistanceAtTemp(lineRange.tEnd), minR, maxR, gy, gh);

      ctx.save();
      ctx.beginPath();
      ctx.rect(gx, gy, gw, gh);
      ctx.clip();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pxStart, pyStart);
      ctx.lineTo(pxEndLine, pyEndLine);
      ctx.stroke();
      ctx.restore();
    }

    const currentT = state.thermometerTemp;
    const currentR = state.currentResistance;
    if (currentT >= minT && currentT <= maxT) {
      const px = mapGraphX(currentT, minT, maxT, gx, gw);
      const py = mapGraphY(currentR, minR, maxR, gy, gh);

      // Draw crosshair projection
      drawGraphCrosshair(ctx, layout, px, py, currentT, currentR, '°C', 'Ω', '#6366f1');

      // Glowing dot
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawThermistorGraph(ctx) {
    const layout = getGraphLayout();
    const tempScale = getTempAxisScale();
    const { minR, maxR, ticks } = getThermistorBounds(tempScale);
    const axis = drawGraphAxes(ctx, layout, tempScale.minT, tempScale.maxT, tempScale.tickStep, ticks, state.thermometerTemp);
    const { gx, gy, gw, gh, axisFont, yLabelX, xLabelY, dotR } = { ...layout, ...axis };
    const { minT, maxT } = tempScale;

    ctx.save();
    ctx.translate(yLabelX, gy + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Resistance of thermistor / kΩ', 0, 0);
    ctx.restore();

    ctx.font = axisFont;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.fillText('temperature / °C', gx + gw / 2, xLabelY);

    // Exponential curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let tVal = minT; tVal <= maxT; tVal += 1) {
      const tempK = tVal + 273.15;
      const r = state.thermistorR25 * Math.exp(state.thermistorBeta * (1 / tempK - 1 / 298.15));
      const px = mapGraphX(tVal, minT, maxT, gx, gw);
      const py = mapGraphY(Math.min(maxR, r), minR, maxR, gy, gh);
      if (py >= gy && py <= gy + gh) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    const currentT = state.thermometerTemp;
    const currentR = state.currentThermistorR;
    if (currentT >= minT && currentT <= maxT) {
      const px = mapGraphX(currentT, minT, maxT, gx, gw);
      const py = mapGraphY(Math.min(maxR, currentR), minR, maxR, gy, gh);

      // Draw crosshair projection
      drawGraphCrosshair(ctx, layout, px, py, currentT, currentR, '°C', 'kΩ', '#10b981');

      // Glowing dot
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawVisuals() {
    physCtx.clearRect(0, 0, PHYS_WIDTH, PHYS_HEIGHT);
    graphCtx.clearRect(0, 0, GRAPH_WIDTH, GRAPH_HEIGHT);

    physCtx.save();
    physCtx.translate(PHYS_SCENE_OFFSET_X, PHYS_SCENE_OFFSET_Y);
    const physLayout = getPhysLayout();
    drawBeaker(physCtx, physLayout);
    if (state.thermometerType === 'liquid') {
      drawLiquidThermometer(physCtx, physLayout);
    } else if (state.thermometerType === 'resistance') {
      drawResistanceProbe(physCtx, physLayout);
    } else {
      drawThermistorProbe(physCtx, physLayout);
    }
    physCtx.restore();

    if (state.thermometerType === 'liquid') {
      drawLiquidGraph(graphCtx);
    } else if (state.thermometerType === 'resistance') {
      drawResistanceGraph(graphCtx);
    } else {
      drawThermistorGraph(graphCtx);
    }
  }

  // Generate beautiful inline SVGs for LaTeX-like math equations
  function renderSVGFormulas() {
    const { sm, md, lg, xs, sub } = TL_SVG;
    const textColor = 'currentColor'; // automatically adapts to the parent's theme color!
    const mutedColor = '#4b5563'; // darker grey for better readability in light theme

    const liquidFormula = wrap.querySelector('#tl-svg-formula-liquid');
    if (liquidFormula) {
      liquidFormula.innerHTML = `
        <svg height="50" width="240" style="background:transparent; overflow:visible;">
          <line x1="10" y1="26" x2="100" y2="26" stroke="${textColor}" stroke-width="1.5" />
          <text x="55" y="18" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">L<tspan dy="2" font-size="${sub}">100</tspan><tspan dy="-2"> - L</tspan><tspan dy="2" font-size="${sub}">0</tspan><tspan dy="-2"></tspan></text>
          <text x="55" y="41" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="31" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="26" x2="220" y2="26" stroke="${textColor}" stroke-width="1.5" />
          <text x="175" y="18" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">L<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> - L</tspan><tspan dy="2" font-size="${sub}">0</tspan><tspan dy="-2"></tspan></text>
          <text x="175" y="41" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">T - 0</text>
        </svg>
      `;
    }

    const liquidFormulaSub = wrap.querySelector('#tl-svg-formula-liquid-sub');
    if (liquidFormulaSub) {
      const l100_l0 = state.liquidL100 - state.liquidL0;
      const lt_l0 = state.currentLength - state.liquidL0;
      liquidFormulaSub.innerHTML = `
        <svg height="90" width="340" style="background:transparent; overflow:visible;">
          <line x1="10" y1="30" x2="100" y2="30" stroke="${textColor}" stroke-width="1.2" />
          <text x="55" y="21" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${state.liquidL100.toFixed(1)} - ${state.liquidL0.toFixed(1)}</text>
          <text x="55" y="43" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="35" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="30" x2="220" y2="30" stroke="${textColor}" stroke-width="1.2" />
          <text x="175" y="21" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">${state.currentLength.toFixed(2)} - ${state.liquidL0.toFixed(1)}</text>
          <text x="175" y="43" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">T - 0</text>

          <line x1="10" y1="68" x2="90" y2="68" stroke="${textColor}" stroke-width="1.2" />
          <text x="50" y="60" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">${lt_l0.toFixed(2)} &times; 100</text>
          <text x="50" y="82" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${l100_l0.toFixed(1)}</text>
          
          <text x="105" y="73" fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" font-size="${lg}" class="tl-final-ans">&rArr; T = ${state.thermometerTemp.toFixed(1)}°C</text>
        </svg>
      `;
    }

    const resistanceFormula = wrap.querySelector('#tl-svg-formula-resistance');
    if (resistanceFormula) {
      resistanceFormula.innerHTML = `
        <svg height="50" width="240" style="background:transparent; overflow:visible;">
          <line x1="10" y1="26" x2="100" y2="26" stroke="${textColor}" stroke-width="1.5" />
          <text x="55" y="18" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">R<tspan dy="2" font-size="${sub}">100</tspan><tspan dy="-2"> - R</tspan><tspan dy="2" font-size="${sub}">0</tspan><tspan dy="-2"></tspan></text>
          <text x="55" y="41" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="31" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="26" x2="220" y2="26" stroke="${textColor}" stroke-width="1.5" />
          <text x="175" y="18" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">R<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> - R</tspan><tspan dy="2" font-size="${sub}">0</tspan><tspan dy="-2"></tspan></text>
          <text x="175" y="41" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">T - 0</text>
        </svg>
      `;
    }

    const resistanceFormulaSub = wrap.querySelector('#tl-svg-formula-resistance-sub');
    if (resistanceFormulaSub) {
      const r100_r0 = state.resistanceR100 - state.resistanceR0;
      const rt_r0 = state.currentResistance - state.resistanceR0;
      resistanceFormulaSub.innerHTML = `
        <svg height="90" width="340" style="background:transparent; overflow:visible;">
          <line x1="10" y1="30" x2="100" y2="30" stroke="${textColor}" stroke-width="1.2" />
          <text x="55" y="21" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${state.resistanceR100.toFixed(1)} - ${state.resistanceR0.toFixed(1)}</text>
          <text x="55" y="43" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="35" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="30" x2="220" y2="30" stroke="${textColor}" stroke-width="1.2" />
          <text x="175" y="21" fill="#6366f1" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">${state.currentResistance.toFixed(2)} - ${state.resistanceR0.toFixed(1)}</text>
          <text x="175" y="43" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">T - 0</text>

          <line x1="10" y1="68" x2="90" y2="68" stroke="${textColor}" stroke-width="1.2" />
          <text x="50" y="60" fill="#6366f1" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">${rt_r0.toFixed(2)} &times; 100</text>
          <text x="50" y="82" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${r100_r0.toFixed(1)}</text>
          
          <text x="105" y="73" fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" font-size="${lg}" class="tl-final-ans">&rArr; T = ${state.thermometerTemp.toFixed(1)}°C</text>
        </svg>
      `;
    }

    const thermistorFormula = wrap.querySelector('#tl-svg-formula-thermistor');
    if (thermistorFormula) {
      thermistorFormula.innerHTML = `
        <svg height="50" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="28" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">T =</text>
          <line x1="40" y1="23" x2="220" y2="23" stroke="${textColor}" stroke-width="1.5" />
          <text x="130" y="15" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">1</text>
          <text x="130" y="38" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${xs}" text-anchor="middle">(1/&beta;) &bull; ln(R<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2">/R</tspan><tspan dy="2" font-size="${sub}">25</tspan><tspan dy="-2">) + 1/298.15</tspan></text>
          <text x="230" y="28" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">- 273.15</text>
        </svg>
      `;
    }

    const thermistorFormulaSub = wrap.querySelector('#tl-svg-formula-thermistor-sub');
    if (thermistorFormulaSub) {
      const tempK = state.thermometerTemp + 273.15;
      thermistorFormulaSub.innerHTML = `
        <svg height="45" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="${md}">
            T<tspan dy="3" font-size="${sub}">K</tspan><tspan dy="-3" fill="#10b981" font-weight="bold"> = ${tempK.toFixed(2)} K</tspan>
            <tspan fill="${textColor}"> &rArr; T = </tspan>
            <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${state.thermometerTemp.toFixed(1)}°C</tspan>
          </text>
        </svg>
      `;
    }
  }

  // Draw interactive dual-scale comparison for faulty thermometer solver
  function drawDualScaleSVG() {
    const container = wrap.querySelector('#tl-faulty-svg-container');
    if (!container) return;

    const { cf, cu, interval } = getFaultyCalibration();
    const cm = parseFloat(wrap.querySelector('#tl-input-q10a-cm').value) || 0;
    const tVal = parseFloat(wrap.querySelector('#tl-input-q10b-t').value) || 0;

    // Determine current active solver pane
    const isPaneA = wrap.querySelector('#tl-pane-q10a').classList.contains('active');
    const displayT = isPaneA ? ((cm - cf) / interval) * 100 : tVal;
    const displayC = isPaneA ? cm : (tVal / 100) * interval + cf;

    // Map temperature to Y position (height is 120px, from y=30 to y=150)
    // 0°C -> y=130, 100°C -> y=50
    const mapY = (t) => 130 - (t / 100) * 80;
    const currentY = mapY(displayT);

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 340 180" style="background:transparent; overflow:visible;">
        <!-- Left Scale: True Scale -->
        <g transform="translate(0, 0)">
          <!-- Glass Tube -->
          <rect x="80" y="25" width="12" height="115" rx="6" fill="rgba(0,0,0,0.03)" stroke="#4b5563" stroke-width="1" />
          <!-- Bulb -->
          <circle cx="86" cy="144" r="10" fill="rgba(0,0,0,0.03)" stroke="#4b5563" stroke-width="1" />
          <!-- Liquid Core -->
          <rect x="84" y="${currentY}" width="4" height="${144 - currentY}" fill="#3b82f6" />
          <circle cx="86" cy="144" r="8" fill="#3b82f6" />
          
          <!-- Ticks -->
          <!-- Ice Point 0°C -->
          <line x1="70" y1="130" x2="78" y2="130" stroke="#3b82f6" stroke-width="1.5" />
          <text x="65" y="133" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="end">0°C</text>
          
          <!-- Steam Point 100°C -->
          <line x1="70" y1="50" x2="78" y2="50" stroke="#ef4444" stroke-width="1.5" />
          <text x="65" y="53" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="end">100°C</text>

          <!-- Current Point -->
          <text x="65" y="${currentY + 3}" fill="#34d399" font-size="10" font-weight="bold" text-anchor="end">${displayT.toFixed(1)}°C</text>

          <text x="86" y="170" fill="#6b7280" font-size="9" font-weight="bold" text-anchor="middle">${t('tools.thermometerLab.faulty.trueScale')}</text>
        </g>

        <!-- Right Scale: Faulty Scale -->
        <g transform="translate(130, 0)">
          <!-- Glass Tube -->
          <rect x="100" y="25" width="12" height="115" rx="6" fill="rgba(0,0,0,0.03)" stroke="#4b5563" stroke-width="1" />
          <!-- Bulb -->
          <circle cx="106" cy="144" r="10" fill="rgba(0,0,0,0.03)" stroke="#4b5563" stroke-width="1" />
          <!-- Liquid Core -->
          <rect x="104" y="${currentY}" width="4" height="${144 - currentY}" fill="#f59e0b" />
          <circle cx="106" cy="144" r="8" fill="#f59e0b" />
          
          <!-- Ticks -->
          <!-- Faulty Ice Point Cf -->
          <line x1="112" y1="130" x2="120" y2="130" stroke="#f59e0b" stroke-width="1.5" />
          <text x="125" y="133" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="start">C<tspan dy="3" font-size="7">f</tspan><tspan dy="-3"> = ${cf.toFixed(1)}°C</tspan></text>
          
          <!-- Faulty Steam Point Cu -->
          <line x1="112" y1="50" x2="120" y2="50" stroke="#ef4444" stroke-width="1.5" />
          <text x="125" y="53" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="start">C<tspan dy="3" font-size="7">u</tspan><tspan dy="-3"> = ${cu.toFixed(1)}°C</tspan></text>

          <!-- Current Faulty Point -->
          <text x="125" y="${currentY + 3}" fill="#34d399" font-size="10" font-weight="bold" text-anchor="start">C = ${displayC.toFixed(1)}°C</text>

          <text x="106" y="170" fill="#6b7280" font-size="9" font-weight="bold" text-anchor="middle">${t('tools.thermometerLab.faulty.faultyScale')}</text>
        </g>

        <!-- Connecting Ratio Indicator Line -->
        <line x1="86" y1="${currentY}" x2="236" y2="${currentY}" stroke="#34d399" stroke-dasharray="3,3" stroke-width="1.5" />
        <circle cx="86" cy="${currentY}" r="3" fill="#34d399" />
        <circle cx="236" cy="${currentY}" r="3" fill="#34d399" />
      </svg>
    `;
  }

  function updateHTMLDisplays(tau) {
    wrap.querySelector('#tl-bath-temp-display').innerHTML = state.bathTemp.toFixed(1) + '°C';
    wrap.querySelector('#tl-val-bath-temp').innerHTML = state.bathTemp.toFixed(1) + ' °C';

    const stateEl = wrap.querySelector('#tl-bath-state');
    if (state.bathTemp <= 0) {
      stateEl.textContent = 'Melting Ice Bath';
    } else if (state.bathTemp >= 100) {
      stateEl.textContent = 'Boiling Water/Steam';
    } else if (state.bathTemp === 150) {
      stateEl.textContent = 'Hot Cooking Oil';
    } else {
      stateEl.textContent = 'Liquid Water';
    }

    wrap.querySelector('#tl-val-response-time').textContent = tau.toFixed(2) + ' s';

    const warnBanner = wrap.querySelector('#tl-alcohol-boiling-warning');
    if (state.thermometerType === 'liquid' && state.liquidType === 'alcohol' && state.bathTemp >= 78) {
      warnBanner.style.display = 'block';
    } else {
      warnBanner.style.display = 'none';
    }

    if (state.thermometerType === 'liquid') {
      wrap.querySelector('#tl-live-liquid-lt').textContent = state.currentLength.toFixed(2) + ' cm';
      wrap.querySelector('#tl-live-liquid-t-sub').textContent = state.thermometerTemp.toFixed(1) + '°C';
    } else if (state.thermometerType === 'resistance') {
      wrap.querySelector('#tl-live-resistance-rt').textContent = state.currentResistance.toFixed(2) + ' Ω';
      wrap.querySelector('#tl-live-resistance-t-sub').textContent = state.thermometerTemp.toFixed(1) + '°C';
    } else {
      wrap.querySelector('#tl-live-thermistor-rt').textContent = state.currentThermistorR.toFixed(2) + ' kΩ';
    }

    renderSVGFormulas();
  }

  let animationFrameId = null;
  function simulationLoop(timestamp) {
    if (!state.lastTimestamp) state.lastTimestamp = timestamp;
    const dt = (timestamp - state.lastTimestamp) / 1000;
    state.lastTimestamp = timestamp;

    const clampedDt = Math.min(dt, 0.1);
    const tau = getResponseTimeConstant();

    const dTemp = (clampedDt / tau) * (state.bathTemp - state.thermometerTemp);
    state.thermometerTemp += dTemp;

    state.currentLength = state.liquidL0 + ((state.liquidL100 - state.liquidL0) / 100) * state.thermometerTemp;
    state.currentResistance = state.resistanceR0 + ((state.resistanceR100 - state.resistanceR0) / 100) * state.thermometerTemp;
    const tempK = state.thermometerTemp + 273.15;
    state.currentThermistorR = state.thermistorR25 * Math.exp(state.thermistorBeta * (1 / tempK - 1 / 298.15));

    updateParticles(clampedDt);
    drawVisuals();
    updateHTMLDisplays(tau);

    animationFrameId = requestAnimationFrame(simulationLoop);
  }

  function getFaultyCalibration() {
    const cf = parseFloat(wrap.querySelector('#tl-input-faulty-cf').value);
    const cu = parseFloat(wrap.querySelector('#tl-input-faulty-cu').value);
    const cfVal = Number.isFinite(cf) ? cf : -1.5;
    const cuVal = Number.isFinite(cu) ? cu : 105;
    const interval = cuVal - cfVal;
    return { cf: cfVal, cu: cuVal, interval };
  }

  function formatFaultyNum(n) {
    const rounded = Math.round(n * 100) / 100;
    return rounded >= 0 ? rounded.toFixed(1) : `(${rounded.toFixed(1)})`;
  }

  function updateFaultySolver() {
    if (!wrap.querySelector('#tl-input-faulty-cf')) return;
    const { cf, cu, interval } = getFaultyCalibration();
    const intervalEl = wrap.querySelector('#tl-val-faulty-interval');
    const errA = wrap.querySelector('#tl-faulty-error-a');
    const errB = wrap.querySelector('#tl-faulty-error-b');
    const invalid = Math.abs(interval) < 0.01;

    intervalEl.textContent = interval.toFixed(1) + ' °C';

    const formulaPaneA = wrap.querySelector('#tl-svg-formula-faulty-a');
    const formulaPaneB = wrap.querySelector('#tl-svg-formula-faulty-b');

    if (invalid) {
      errA.hidden = false;
      errA.textContent = 'C_u must differ from C_f (interval cannot be zero).';
      errB.hidden = false;
      errB.textContent = errA.textContent;
      if (formulaPaneA) formulaPaneA.innerHTML = '';
      if (formulaPaneB) formulaPaneB.innerHTML = '';
      return;
    }
    errA.hidden = true;
    errB.hidden = true;

    const cm = parseFloat(wrap.querySelector('#tl-input-q10a-cm').value) || 0;
    const tVal = parseFloat(wrap.querySelector('#tl-input-q10b-t').value) || 0;
    const trueT = ((cm - cf) / interval) * 100;
    const faultyC = (tVal / 100) * interval + cf;

    const textColor = 'currentColor';
    const mutedColor = '#4b5563';

    if (formulaPaneA) {
      formulaPaneA.innerHTML = `
        <svg height="45" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">T =</text>
          <line x1="40" y1="21" x2="160" y2="21" stroke="${textColor}" stroke-width="1.5" />
          <text x="100" y="15" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="12" text-anchor="middle">${cm.toFixed(1)} - ${formatFaultyNum(cf)}</text>
          <text x="100" y="36" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="12" text-anchor="middle">${cu.toFixed(1)} - ${formatFaultyNum(cf)}</text>
          <text x="170" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">
            &times; 100 = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${trueT.toFixed(1)}°C</tspan>
          </text>
        </svg>
      `;
    }

    if (formulaPaneB) {
      formulaPaneB.innerHTML = `
        <svg height="45" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">C =</text>
          <line x1="40" y1="21" x2="150" y2="21" stroke="${textColor}" stroke-width="1.5" />
          <text x="95" y="15" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="12" text-anchor="middle">${tVal.toFixed(1)} &times; ${interval.toFixed(1)}</text>
          <text x="95" y="36" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="12" text-anchor="middle">100</text>
          <text x="158" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="14">
            + ${formatFaultyNum(cf)} = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${faultyC.toFixed(2)}°C</tspan>
          </text>
        </svg>
      `;
    }

    drawDualScaleSVG();
  }

  function calculateTtoL() {
    const { sm, md, lg, sub } = TL_SVG;
    const tInput = state.thermometerTemp; 
    const l100_l0 = state.liquidL100 - state.liquidL0;
    const length = state.liquidL0 + (l100_l0 / 100) * tInput;
    
    const formulaPane = wrap.querySelector('#tl-svg-formula-t-to-l');
    if (formulaPane) {
      formulaPane.innerHTML = `
        <svg height="90" width="340" style="background:transparent; overflow:visible;">
          <line x1="10" y1="30" x2="100" y2="30" stroke="#fff" stroke-width="1.2" />
          <text x="55" y="21" fill="#a1a1aa" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${state.liquidL100.toFixed(1)} - ${state.liquidL0.toFixed(1)}</text>
          <text x="55" y="43" fill="#a1a1aa" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="35" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="30" x2="220" y2="30" stroke="#fff" stroke-width="1.2" />
          <text x="175" y="21" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">L<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> - ${state.liquidL0.toFixed(1)}</tspan></text>
          <text x="175" y="43" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${tInput.toFixed(1)} - 0</text>

          <text x="10" y="73" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${sm}">L<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> = ${state.liquidL0.toFixed(1)} + </tspan>
            <tspan fill="#a1a1aa">(${l100_l0.toFixed(1)} / 100)</tspan> &times; ${tInput.toFixed(1)} = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${length.toFixed(2)} cm</tspan>
          </text>
        </svg>
      `;
    }
  }

  function calculateTtoR() {
    const { sm, md, sub } = TL_SVG;
    const tInput = state.thermometerTemp;
    const r100_r0 = state.resistanceR100 - state.resistanceR0;
    const resistance = state.resistanceR0 + (r100_r0 / 100) * tInput;
    
    const formulaPane = wrap.querySelector('#tl-svg-formula-t-to-r');
    if (formulaPane) {
      formulaPane.innerHTML = `
        <svg height="90" width="340" style="background:transparent; overflow:visible;">
          <line x1="10" y1="30" x2="100" y2="30" stroke="#fff" stroke-width="1.2" />
          <text x="55" y="21" fill="#a1a1aa" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${state.resistanceR100.toFixed(1)} - ${state.resistanceR0.toFixed(1)}</text>
          <text x="55" y="43" fill="#a1a1aa" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">100 - 0</text>
          
          <text x="110" y="35" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${md}">=</text>
          
          <line x1="130" y1="30" x2="220" y2="30" stroke="#fff" stroke-width="1.2" />
          <text x="175" y="21" fill="#6366f1" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="${sm}" text-anchor="middle">R<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> - ${state.resistanceR0.toFixed(1)}</tspan></text>
          <text x="175" y="43" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${sm}" text-anchor="middle">${tInput.toFixed(1)} - 0</text>

          <text x="10" y="73" fill="#fff" font-family="Cambria, Georgia, serif" font-size="${sm}">R<tspan dy="2" font-size="${sub}">T</tspan><tspan dy="-2"> = ${state.resistanceR0.toFixed(1)} + </tspan>
            <tspan fill="#a1a1aa">(${r100_r0.toFixed(1)} / 100)</tspan> &times; ${tInput.toFixed(1)} = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${resistance.toFixed(2)} Ω</tspan>
          </text>
        </svg>
      `;
    }
  }

  function updateCalculations() {
    updateFaultySolver();
    calculateTtoL();
    calculateTtoR();
  }

  function setupPreset(btnId, temp) {
    wrap.querySelector('#' + btnId).addEventListener('click', () => {
      state.bathTemp = temp;
      wrap.querySelector('#tl-bath-temp-slider').value = temp;
      updateCalculations();
    });
  }

  function setActiveTab(tabId) {
    wrap.querySelectorAll('.tl-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tl-tab') === tabId);
    });
    wrap.querySelectorAll('.tl-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === 'tl-tab-' + tabId);
    });
    wrap.querySelectorAll('.tl-live-tab').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'tl-live-' + tabId);
    });
    state.thermometerType = tabId;
  }

  // Event Listeners
  function setupEventListeners() {
    wrap.querySelectorAll('.tl-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setActiveTab(btn.getAttribute('data-tl-tab'));
        updateCalculations();
      });
    });

    // Structure labels toggle button
    const toggleLabelsBtn = wrap.querySelector('#tl-btn-toggle-labels');
    toggleLabelsBtn.addEventListener('click', () => {
      state.showLabels = !state.showLabels;
      wrap.querySelector('#tl-lbl-toggle-labels').textContent = state.showLabels 
        ? t('tools.thermometerLab.labels.hide') 
        : t('tools.thermometerLab.labels.show');
    });

    const tempSlider = wrap.querySelector('#tl-bath-temp-slider');
    tempSlider.addEventListener('input', (e) => {
      state.bathTemp = parseFloat(e.target.value);
      updateCalculations();
    });

    setupPreset('tl-btn-preset-ice', 0.0);
    setupPreset('tl-btn-preset-room', 25.0);
    setupPreset('tl-btn-preset-steam', 100.0);
    setupPreset('tl-btn-preset-oil', 150.0);

    wrap.querySelector('#tl-card-mercury').addEventListener('click', () => {
      state.liquidType = 'mercury';
      wrap.querySelector('#tl-card-mercury').className = 'tl-seg-btn active-mercury';
      wrap.querySelector('#tl-card-alcohol').className = 'tl-seg-btn';
      updateCalculations();
    });

    wrap.querySelector('#tl-card-alcohol').addEventListener('click', () => {
      state.liquidType = 'alcohol';
      wrap.querySelector('#tl-card-mercury').className = 'tl-seg-btn';
      wrap.querySelector('#tl-card-alcohol').className = 'tl-seg-btn active-alcohol';
      updateCalculations();
    });

    bindParamPair(
      wrap.querySelector('#tl-slider-bulb-vol'),
      wrap.querySelector('#tl-input-bulb-vol'),
      { min: 10, max: 1000, step: 10, decimals: 0, onUpdate: (v) => { state.bulbVolume = v; } }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-wall-thick'),
      wrap.querySelector('#tl-input-wall-thick'),
      { min: 0.05, max: 3.0, step: 0.05, decimals: 2, onUpdate: (v) => { state.wallThickness = v; } }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-capillary-bore'),
      wrap.querySelector('#tl-input-capillary-bore'),
      { min: 0.05, max: 2.0, step: 0.05, decimals: 2, onUpdate: (v) => { state.capillaryBore = v; } }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-liquid-l0'),
      wrap.querySelector('#tl-input-liquid-l0'),
      { min: 0.5, max: 15.0, step: 0.1, decimals: 1, onUpdate: (v) => { state.liquidL0 = v; updateCalculations(); } }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-liquid-l100'),
      wrap.querySelector('#tl-input-liquid-l100'),
      { min: 5.0, max: 30.0, step: 0.1, decimals: 1, onUpdate: (v) => { state.liquidL100 = v; updateCalculations(); } }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-resistance-r0'),
      wrap.querySelector('#tl-input-resistance-r0'),
      {
        min: 0.5, max: 20.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.resistanceR0 = v;
          wrap.querySelector('#tl-spec-resistance-r0').textContent = v.toFixed(1) + ' Ω';
          updateCalculations();
        }
      }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-resistance-r100'),
      wrap.querySelector('#tl-input-resistance-r100'),
      {
        min: 2.0, max: 30.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.resistanceR100 = v;
          wrap.querySelector('#tl-spec-resistance-r100').textContent = v.toFixed(1) + ' Ω';
          updateCalculations();
        }
      }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-thermistor-r25'),
      wrap.querySelector('#tl-input-thermistor-r25'),
      {
        min: 0.5, max: 50.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.thermistorR25 = v;
          wrap.querySelector('#tl-spec-thermistor-r25').textContent = v.toFixed(1) + ' kΩ';
          updateCalculations();
        }
      }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-thermistor-beta'),
      wrap.querySelector('#tl-input-thermistor-beta'),
      {
        min: 1000, max: 8000, step: 50, decimals: 0,
        onUpdate: (v) => {
          state.thermistorBeta = v;
          wrap.querySelector('#tl-spec-thermistor-beta').textContent = v + ' K';
          updateCalculations();
        }
      }
    );

    const btnSolveQ10a = wrap.querySelector('#tl-btn-solve-q10a');
    const btnSolveQ10b = wrap.querySelector('#tl-btn-solve-q10b');
    if (btnSolveQ10a && btnSolveQ10b) {
      btnSolveQ10a.addEventListener('click', () => {
        btnSolveQ10a.classList.add('active');
        btnSolveQ10b.classList.remove('active');
        wrap.querySelector('#tl-pane-q10a').classList.add('active');
        wrap.querySelector('#tl-pane-q10b').classList.remove('active');
        updateFaultySolver();
      });

      btnSolveQ10b.addEventListener('click', () => {
        btnSolveQ10a.classList.remove('active');
        btnSolveQ10b.classList.add('active');
        wrap.querySelector('#tl-pane-q10a').classList.remove('active');
        wrap.querySelector('#tl-pane-q10b').classList.add('active');
        updateFaultySolver();
      });
    }

    wrap.querySelector('#tl-input-faulty-cf')?.addEventListener('input', updateFaultySolver);
    wrap.querySelector('#tl-input-faulty-cu')?.addEventListener('input', updateFaultySolver);
    wrap.querySelector('#tl-input-q10a-cm')?.addEventListener('input', updateFaultySolver);
    wrap.querySelector('#tl-input-q10b-t')?.addEventListener('input', updateFaultySolver);
    
    // T to L and T to R solvers
    const inputTtoL = wrap.querySelector('#tl-input-t-to-l');
    if (inputTtoL) {
      inputTtoL.addEventListener('input', updateCalculations);
    }
    const inputTtoR = wrap.querySelector('#tl-input-t-to-r');
    if (inputTtoR) {
      inputTtoR.addEventListener('input', updateCalculations);
    }
  }

  // Programmatic tab activation based on defaultType
  if (options.type) {
    const tabsContainer = wrap.querySelector('.tl-tabs-container');
    if (tabsContainer) {
      tabsContainer.style.display = 'none';
    }
  }

  setActiveTab(defaultType);

  initParticles();
  setupEventListeners();
  updateCalculations();

  const dash = wrap.querySelector('.tl-dash');
  const controlsPanel = wrap.querySelector('.tl-controls');
  const toggleBtn = wrap.querySelector('#tl-controls-toggle');
  const dragHandle = wrap.querySelector('#tl-controls-drag');
  const floatBar = wrap.querySelector('.tl-controls-float-bar');
  if (dash && controlsPanel && toggleBtn) {
    initFloatingControlsPanel({
      container: dash,
      panel: controlsPanel,
      toggleBtn,
      dragHandle,
      dragSurface: floatBar,
      storageKey: `s3phy-thermo-${defaultType}`,
      breakpoint: THERM_FLOAT_BREAKPOINT,
      getToggleTitle: (collapsed) => collapsed
        ? t('tools.floatingControls.showParams')
        : t('tools.floatingControls.hideParams'),
      onLayoutChange: () => drawVisuals(),
    });
  }

  if (typeof ResizeObserver !== 'undefined' && dash) {
    const ro = new ResizeObserver(() => drawVisuals());
    ro.observe(dash);
    wrap._thermometerLabCleanup = () => {
      ro.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  } else {
    wrap._thermometerLabCleanup = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }

  // Start loop
  animationFrameId = requestAnimationFrame(simulationLoop);

  return wrap;
}

export function createFaultyScaleCalibrationLab(t) {

  const wrap = document.createElement('div');
  wrap.className = 'tl-wrap tl-wrap--faulty-cal';
  wrap.innerHTML = `
    <div class="tl-head">
      <h2 class="tl-title">${t('tools.faultyCalibration.title')}</h2>
      <div class="tl-sub">${t('tools.faultyCalibration.subtitle')}</div>
    </div>
    <div class="tl-dash tl-dash--faulty">
      <section class="tl-faulty-hero">
        <div class="tl-info-card" style="margin:0">
          <div class="tl-info-label">${t('tools.faultyCalibration.formulaTitle')}</div>
          <p style="margin:0;font-size:0.82rem">T / 100 = (C − C<sub>f</sub>) / (C<sub>u</sub> − C<sub>f</sub>)</p>
        </div>
        <div class="tl-info-label" style="font-size:0.78rem;color:var(--tl-muted);margin:0;">${t('tools.thermometerLab.faulty.dualScale')}</div>
        <div id="fsc-faulty-svg-container" class="tl-faulty-hero-viz"></div>
      </section>

      <section class="tl-faulty-live">
        <div class="tl-info-label" style="margin-top:0;font-size:0.8rem;color:var(--tl-cyan)">${t('tools.faultyCalibration.liveLabel')}</div>
        <div id="fsc-pane-q10a" class="tl-solver-pane active">
          <div class="tl-worked-solution" style="background:rgba(0,0,0,0.15);margin:0">
            <div id="fsc-svg-formula-faulty-a" class="tl-math-formula" style="font-size:0.85rem"></div>
          </div>
        </div>
        <div id="fsc-pane-q10b" class="tl-solver-pane">
          <div class="tl-worked-solution" style="background:rgba(0,0,0,0.15);margin:0">
            <div id="fsc-svg-formula-faulty-b" class="tl-math-formula" style="font-size:0.85rem"></div>
          </div>
        </div>
      </section>

      <div class="tl-controls controls-collapsed">
        <div class="tl-controls-float-bar">
          <button type="button" class="tl-controls-drag-handle" id="fsc-controls-drag" aria-label="${t('tools.floatingControls.dragHint')}" title="${t('tools.floatingControls.dragHint')}">⋮⋮</button>
          <button type="button" class="tl-controls-toggle" id="fsc-controls-toggle" aria-expanded="false">
            <span data-float-chevron>▾</span>
            <span>${t('tools.thermometerLab.paramSettings')}</span>
          </button>
        </div>
        <div class="tl-controls-body">
          <p style="font-size:0.75rem;color:var(--tl-muted);margin:0 0 8px">${t('tools.faultyCalibration.intro')}</p>
          <div class="tl-faulty-cal">
            <div class="tl-calc-inputs">
              <span>${t('tools.faultyCalibration.iceReading')}</span>
              <div class="tl-input-with-unit">
                <input type="number" id="fsc-input-faulty-cf" value="-1.5" step="0.1" class="tl-calc-input" aria-label="Ice point faulty reading">
                <span class="tl-unit">°C</span>
              </div>
            </div>
            <div class="tl-calc-inputs">
              <span>${t('tools.faultyCalibration.steamReading')}</span>
              <div class="tl-input-with-unit">
                <input type="number" id="fsc-input-faulty-cu" value="105" step="0.1" class="tl-calc-input" aria-label="Steam point faulty reading">
                <span class="tl-unit">°C</span>
              </div>
            </div>
          </div>
          <div class="tl-faulty-interval">
            <span>${t('tools.faultyCalibration.interval')}</span>
            <b id="fsc-val-faulty-interval">106.5 °C</b>
          </div>
          <div class="tl-solver-tabs">
            <button class="tl-solver-tab-btn active" id="fsc-btn-solve-q10a">${t('tools.faultyCalibration.findTrueTemp')}</button>
            <button class="tl-solver-tab-btn" id="fsc-btn-solve-q10b">${t('tools.faultyCalibration.findFaultyReading')}</button>
          </div>
          <div id="fsc-input-pane-q10a" class="tl-solver-pane active">
            <div class="tl-calc-inputs">
              <span>${t('tools.faultyCalibration.faultyReadingC')}</span>
              <div class="tl-input-with-unit">
                <input type="number" id="fsc-input-q10a-cm" value="25.0" step="0.5" class="tl-calc-input">
                <span class="tl-unit">°C</span>
              </div>
            </div>
            <p class="tl-solver-error" id="fsc-faulty-error-a" hidden></p>
          </div>
          <div id="fsc-input-pane-q10b" class="tl-solver-pane">
            <div class="tl-calc-inputs">
              <span>${t('tools.faultyCalibration.trueTempT')}</span>
              <div class="tl-input-with-unit">
                <input type="number" id="fsc-input-q10b-t" value="70.0" step="1.0" class="tl-calc-input">
                <span class="tl-unit">°C</span>
              </div>
            </div>
            <p class="tl-solver-error" id="fsc-faulty-error-b" hidden></p>
          </div>
        </div>
      </div>
    </div>
  `;

  function formatFaultyNum(n) {
    const rounded = Math.round(n * 100) / 100;
    return rounded >= 0 ? rounded.toFixed(1) : `(${rounded.toFixed(1)})`;
  }

  function getFaultyCalibration() {
    const cf = parseFloat(wrap.querySelector('#fsc-input-faulty-cf').value);
    const cu = parseFloat(wrap.querySelector('#fsc-input-faulty-cu').value);
    const cfVal = Number.isFinite(cf) ? cf : -1.5;
    const cuVal = Number.isFinite(cu) ? cu : 105;
    const interval = cuVal - cfVal;
    return { cf: cfVal, cu: cuVal, interval };
  }

  function drawDualScaleSVG() {
    const container = wrap.querySelector('#fsc-faulty-svg-container');
    if (!container) return;

    const { cf, cu, interval } = getFaultyCalibration();
    const cm = parseFloat(wrap.querySelector('#fsc-input-q10a-cm').value) || 0;
    const tVal = parseFloat(wrap.querySelector('#fsc-input-q10b-t').value) || 0;
    const isPaneA = wrap.querySelector('#fsc-input-pane-q10a').classList.contains('active');
    const displayT = isPaneA ? ((cm - cf) / interval) * 100 : tVal;
    const displayC = isPaneA ? cm : (tVal / 100) * interval + cf;
    const mapY = (temp) => 130 - (temp / 100) * 80;
    const currentY = Number.isFinite(displayT) ? mapY(displayT) : 130;

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 340 180" style="background:transparent; overflow:visible;">
        <g transform="translate(0, 0)">
          <rect x="80" y="25" width="12" height="115" rx="6" fill="rgba(255,255,255,0.05)" stroke="#4b5563" stroke-width="1" />
          <circle cx="86" cy="144" r="10" fill="rgba(255,255,255,0.05)" stroke="#4b5563" stroke-width="1" />
          <rect x="84" y="${currentY}" width="4" height="${144 - currentY}" fill="#3b82f6" />
          <circle cx="86" cy="144" r="8" fill="#3b82f6" />
          <line x1="70" y1="130" x2="78" y2="130" stroke="#3b82f6" stroke-width="1.5" />
          <text x="65" y="133" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="end">0°C</text>
          <line x1="70" y1="50" x2="78" y2="50" stroke="#ef4444" stroke-width="1.5" />
          <text x="65" y="53" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="end">100°C</text>
          <text x="65" y="${currentY + 3}" fill="#34d399" font-size="10" font-weight="bold" text-anchor="end">${Number.isFinite(displayT) ? displayT.toFixed(1) : '—'}°C</text>
          <text x="86" y="170" fill="#a1a1aa" font-size="9" font-weight="bold" text-anchor="middle">${t('tools.thermometerLab.faulty.trueScale')}</text>
        </g>
        <g transform="translate(130, 0)">
          <rect x="100" y="25" width="12" height="115" rx="6" fill="rgba(255,255,255,0.05)" stroke="#4b5563" stroke-width="1" />
          <circle cx="106" cy="144" r="10" fill="rgba(255,255,255,0.05)" stroke="#4b5563" stroke-width="1" />
          <rect x="104" y="${currentY}" width="4" height="${144 - currentY}" fill="#f59e0b" />
          <circle cx="106" cy="144" r="8" fill="#f59e0b" />
          <line x1="112" y1="130" x2="120" y2="130" stroke="#f59e0b" stroke-width="1.5" />
          <text x="125" y="133" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="start">C<tspan dy="3" font-size="7">f</tspan><tspan dy="-3"> = ${cf.toFixed(1)}°C</tspan></text>
          <line x1="112" y1="50" x2="120" y2="50" stroke="#ef4444" stroke-width="1.5" />
          <text x="125" y="53" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="start">C<tspan dy="3" font-size="7">u</tspan><tspan dy="-3"> = ${cu.toFixed(1)}°C</tspan></text>
          <text x="125" y="${currentY + 3}" fill="#34d399" font-size="10" font-weight="bold" text-anchor="start">C = ${Number.isFinite(displayC) ? displayC.toFixed(1) : '—'}°C</text>
          <text x="106" y="170" fill="#a1a1aa" font-size="9" font-weight="bold" text-anchor="middle">${t('tools.thermometerLab.faulty.faultyScale')}</text>
        </g>
        <line x1="86" y1="${currentY}" x2="236" y2="${currentY}" stroke="#34d399" stroke-dasharray="3,3" stroke-width="1.5" />
        <circle cx="86" cy="${currentY}" r="3" fill="#34d399" />
        <circle cx="236" cy="${currentY}" r="3" fill="#34d399" />
      </svg>
    `;
  }

  function setSolverMode(mode) {
    const isA = mode === 'a';
    wrap.querySelector('#fsc-btn-solve-q10a').classList.toggle('active', isA);
    wrap.querySelector('#fsc-btn-solve-q10b').classList.toggle('active', !isA);
    wrap.querySelector('#fsc-input-pane-q10a').classList.toggle('active', isA);
    wrap.querySelector('#fsc-input-pane-q10b').classList.toggle('active', !isA);
    wrap.querySelector('#fsc-pane-q10a').classList.toggle('active', isA);
    wrap.querySelector('#fsc-pane-q10b').classList.toggle('active', !isA);
    updateFaultySolver();
  }

  function updateFaultySolver() {
    const { cf, cu, interval } = getFaultyCalibration();
    const intervalEl = wrap.querySelector('#fsc-val-faulty-interval');
    const errA = wrap.querySelector('#fsc-faulty-error-a');
    const errB = wrap.querySelector('#fsc-faulty-error-b');
    const formulaPaneA = wrap.querySelector('#fsc-svg-formula-faulty-a');
    const formulaPaneB = wrap.querySelector('#fsc-svg-formula-faulty-b');
    const invalid = Math.abs(interval) < 0.01;
    const errMsg = t('tools.faultyCalibration.invalidInterval');

    intervalEl.textContent = interval.toFixed(1) + ' °C';

    if (invalid) {
      errA.hidden = false;
      errA.textContent = errMsg;
      errB.hidden = false;
      errB.textContent = errMsg;
      if (formulaPaneA) formulaPaneA.innerHTML = '';
      if (formulaPaneB) formulaPaneB.innerHTML = '';
      drawDualScaleSVG();
      return;
    }

    errA.hidden = true;
    errB.hidden = true;

    const cm = parseFloat(wrap.querySelector('#fsc-input-q10a-cm').value) || 0;
    const tVal = parseFloat(wrap.querySelector('#fsc-input-q10b-t').value) || 0;
    const trueT = ((cm - cf) / interval) * 100;
    const faultyC = (tVal / 100) * interval + cf;

    const textColor = 'currentColor';
    const mutedColor = '#4b5563';

    if (formulaPaneA) {
      formulaPaneA.innerHTML = `
        <svg height="45" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">T =</text>
          <line x1="40" y1="21" x2="160" y2="21" stroke="${textColor}" stroke-width="1.5" />
          <text x="100" y="15" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="12" text-anchor="middle">${cm.toFixed(1)} - ${formatFaultyNum(cf)}</text>
          <text x="100" y="36" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="12" text-anchor="middle">${cu.toFixed(1)} - ${formatFaultyNum(cf)}</text>
          <text x="170" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">
            &times; 100 = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${trueT.toFixed(1)}°C</tspan>
          </text>
        </svg>
      `;
    }

    if (formulaPaneB) {
      formulaPaneB.innerHTML = `
        <svg height="45" width="280" style="background:transparent; overflow:visible;">
          <text x="10" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="15">C =</text>
          <line x1="40" y1="21" x2="150" y2="21" stroke="${textColor}" stroke-width="1.5" />
          <text x="95" y="15" fill="#06b6d4" font-family="Cambria, Georgia, serif" font-weight="bold" font-size="12" text-anchor="middle">${tVal.toFixed(1)} &times; ${interval.toFixed(1)}</text>
          <text x="95" y="36" fill="${mutedColor}" font-family="Cambria, Georgia, serif" font-size="12" text-anchor="middle">100</text>
          <text x="158" y="26" fill="${textColor}" font-family="Cambria, Georgia, serif" font-size="14">
            + ${formatFaultyNum(cf)} = <tspan fill="#10b981" font-family="system-ui, sans-serif" font-weight="900" class="tl-final-ans">${faultyC.toFixed(2)}°C</tspan>
          </text>
        </svg>
      `;
    }

    drawDualScaleSVG();
  }

  wrap.querySelector('#fsc-btn-solve-q10a').addEventListener('click', () => setSolverMode('a'));
  wrap.querySelector('#fsc-btn-solve-q10b').addEventListener('click', () => setSolverMode('b'));
  wrap.querySelector('#fsc-input-faulty-cf').addEventListener('input', updateFaultySolver);
  wrap.querySelector('#fsc-input-faulty-cu').addEventListener('input', updateFaultySolver);
  wrap.querySelector('#fsc-input-q10a-cm').addEventListener('input', updateFaultySolver);
  wrap.querySelector('#fsc-input-q10b-t').addEventListener('input', updateFaultySolver);

  const dash = wrap.querySelector('.tl-dash--faulty');
  const controlsPanel = wrap.querySelector('.tl-controls');
  const toggleBtn = wrap.querySelector('#fsc-controls-toggle');
  const dragHandle = wrap.querySelector('#fsc-controls-drag');
  const floatBar = wrap.querySelector('.tl-controls-float-bar');
  if (dash && controlsPanel && toggleBtn) {
    initFloatingControlsPanel({
      container: dash,
      panel: controlsPanel,
      toggleBtn,
      dragHandle,
      dragSurface: floatBar,
      storageKey: 's3phy-faulty-calibration',
      breakpoint: THERM_FLOAT_BREAKPOINT,
      getToggleTitle: (collapsed) => collapsed
        ? t('tools.floatingControls.showParams')
        : t('tools.floatingControls.hideParams'),
    });
  }

  updateFaultySolver();
  wrap._thermometerLabCleanup = () => {};
  return wrap;
}
