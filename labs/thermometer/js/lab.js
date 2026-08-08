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

  let collapsed = sessionStorage.getItem(storageKey) === 'true';
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

  const isLiquidDesign = defaultType === 'liquid';

  const wrap = document.createElement('div');
  wrap.className = 'tl-wrap' + (isLiquidDesign ? ' tl-wrap--design-simple' : '');
  wrap.innerHTML = isLiquidDesign ? `
    <div class="tl-head">
      <h2 class="tl-title">${title}</h2>
      <div class="tl-sub">${subtitle}</div>
    </div>
    <div class="tl-part-tabs" id="tl-part-tabs" role="tablist">
      <button type="button" class="tl-part-tab active" data-part="bulb" role="tab" aria-selected="true">
        <span class="tl-part-dot tl-part-dot--bulb"></span>
        ${t('tools.thermometerLab.design.tabBulb')}
      </button>
      <button type="button" class="tl-part-tab" data-part="bore" role="tab" aria-selected="false">
        <span class="tl-part-dot tl-part-dot--bore"></span>
        ${t('tools.thermometerLab.design.tabBore')}
      </button>
      <button type="button" class="tl-part-tab" data-part="wall" role="tab" aria-selected="false">
        <span class="tl-part-dot tl-part-dot--wall"></span>
        ${t('tools.thermometerLab.design.tabWall')}
      </button>
    </div>
    <div class="tl-dash tl-dash--design-simple">
      <div class="tl-viz-phys tl-viz-phys--large">
        <canvas class="tl-canvas-phys" id="tl-thermometerCanvas" width="720" height="720"></canvas>
      </div>

      <aside class="tl-design-simple-side">
        <div class="tl-focus-card" id="tl-focus-card" data-focus="bulb">
          <div class="tl-focus-badge" id="tl-focus-badge">${t('tools.thermometerLab.design.tabBulb')}</div>
          <p class="tl-focus-explain" id="tl-focus-explain"></p>
          <div class="tl-focus-effect" id="tl-focus-effect">
            <span class="tl-focus-effect-k" id="tl-focus-effect-k"></span>
            <b class="tl-focus-effect-v" id="tl-focus-effect-v"></b>
          </div>
          <div class="tl-design-grid tl-design-grid--mini">
            <div class="tl-design-stat" data-stat="sensitivity">
              <span class="tl-design-k">${t('tools.thermometerLab.design.sensitivity')}</span>
              <b class="tl-design-v" id="tl-val-sensitivity">0.100 cm/°C</b>
            </div>
            <div class="tl-design-stat" data-stat="range">
              <span class="tl-design-k">${t('tools.thermometerLab.design.range')}</span>
              <b class="tl-design-v" id="tl-val-range">180 °C</b>
            </div>
            <div class="tl-design-stat" data-stat="response">
              <span class="tl-design-k">${t('tools.thermometerLab.design.response')}</span>
              <b class="tl-design-v" id="tl-val-response-time">0.65 s</b>
            </div>
          </div>
          <p class="tl-design-cue" id="tl-design-cue"></p>

          <div class="tl-focus-control" data-control="bulb">
            <div class="tl-lr">
              <span>${t('tools.thermometerLab.design.bulbShort')}</span>
              <input type="number" id="tl-input-bulb-vol" class="tl-param-num" min="10" max="1000" step="10" value="200">
            </div>
            <input type="range" id="tl-slider-bulb-vol" min="10" max="1000" step="10" value="200">
            <div class="tl-reset-row">
              <p class="tl-hint">${t('tools.thermometerLab.design.bulbHint')}</p>
              <button type="button" class="tl-btn tl-reset-part-btn" id="tl-btn-reset-bulb">${t('tools.thermometerLab.design.resetPart')}</button>
            </div>
          </div>
          <div class="tl-focus-control" data-control="bore" hidden>
            <div class="tl-lr">
              <span>${t('tools.thermometerLab.design.boreShort')}</span>
              <input type="number" id="tl-input-capillary-bore" class="tl-param-num" min="0.05" max="2.0" step="0.05" value="0.3">
            </div>
            <input type="range" id="tl-slider-capillary-bore" min="0.05" max="2.0" step="0.05" value="0.3">
            <div class="tl-reset-row">
              <p class="tl-hint">${t('tools.thermometerLab.design.boreHint')}</p>
              <button type="button" class="tl-btn tl-reset-part-btn" id="tl-btn-reset-bore">${t('tools.thermometerLab.design.resetPart')}</button>
            </div>
          </div>
          <div class="tl-focus-control" data-control="wall" hidden>
            <div class="tl-lr">
              <span>${t('tools.thermometerLab.design.wallShort')}</span>
              <input type="number" id="tl-input-wall-thick" class="tl-param-num" min="0.05" max="3.0" step="0.05" value="0.5">
            </div>
            <input type="range" id="tl-slider-wall-thick" min="0.05" max="3.0" step="0.05" value="0.5">
            <div class="tl-reset-row">
              <p class="tl-hint">${t('tools.thermometerLab.design.wallHint')}</p>
              <button type="button" class="tl-btn tl-reset-part-btn" id="tl-btn-reset-wall">${t('tools.thermometerLab.design.resetPart')}</button>
            </div>
          </div>
          <button type="button" class="tl-btn tl-reset-all-btn" id="tl-btn-reset-design">${t('tools.thermometerLab.design.resetAll')}</button>
        </div>

        <div class="tl-bath-bar tl-bath-bar--simple">
          <div class="tl-beaker-overlay">
            <span>${t('tools.thermometerLab.design.bath')}: <b id="tl-bath-state">Water</b></span>
            <span><b class="tl-temp-badge" id="tl-bath-temp-display">25.0°C</b></span>
          </div>
          <div class="tl-lr">
            <span>T<sub>bath</sub></span>
            <span class="tl-badge tl-lr-value tl-val-bath-temp" id="tl-val-bath-temp">25.0 °C</span>
          </div>
          <input type="range" id="tl-bath-temp-slider" min="0" max="200" step="0.5" value="25.0">
          <div class="tl-btn-group">
            <button class="tl-btn tl-preset-btn" id="tl-btn-preset-ice" type="button">0°C</button>
            <button class="tl-btn tl-preset-btn" id="tl-btn-preset-room" type="button">25°C</button>
            <button class="tl-btn tl-preset-btn" id="tl-btn-preset-steam" type="button">100°C</button>
            <button class="tl-btn tl-preset-btn" id="tl-btn-preset-oil" type="button">150°C</button>
          </div>
          <div class="tl-cg" style="margin-top:6px">
            <span class="tl-section-label">${t('tools.thermometerLab.design.liquid')}</span>
            <div class="tl-seg" role="group">
              <button type="button" class="tl-seg-btn active-mercury" id="tl-card-mercury">Hg</button>
              <button type="button" class="tl-seg-btn" id="tl-card-alcohol">Alcohol</button>
            </div>
          </div>
          <div class="tl-warning-banner" id="tl-alcohol-boiling-warning">
            ${t('tools.thermometerLab.design.alcoholWarn')}
          </div>
        </div>
      </aside>

      <div class="tl-design-simple-hidden" hidden aria-hidden="true">
        <canvas id="tl-graphCanvas" width="2" height="2"></canvas>
        <button id="tl-btn-toggle-labels" type="button"><span id="tl-lbl-toggle-labels"></span></button>
        <div id="tl-design-panel"></div>
        <span id="tl-live-liquid-lt"></span>
        <span id="tl-live-liquid-t-sub"></span>
        <span id="tl-display-liquid-l100"></span>
        <input type="number" id="tl-input-liquid-l0" value="3.0">
        <input type="range" id="tl-slider-liquid-l0" min="0.5" max="15" step="0.1" value="3.0">
        <div id="tl-svg-formula-liquid"></div>
        <div id="tl-svg-formula-liquid-sub"></div>
        <div id="tl-svg-formula-t-to-l"></div>
        <div id="tl-live-liquid" class="tl-live-tab active"></div>
        <div id="tl-live-resistance" class="tl-live-tab"></div>
        <div id="tl-live-thermistor" class="tl-live-tab"></div>
        <div id="tl-tab-liquid" class="tl-tab-content active"></div>
        <div id="tl-tab-resistance" class="tl-tab-content"></div>
        <div id="tl-tab-thermistor" class="tl-tab-content"></div>
        <div class="tl-controls" id="tl-controls-panel"></div>
      </div>
    </div>
  ` : `
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
            <div class="tl-info-label" style="margin-top:0;color:var(--tl-cyan)">Live calibration formula</div>
            <div class="tl-worked-solution tl-dual-direction">
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">L<sub>T</sub> → T</div>
                <div id="tl-svg-formula-liquid" class="tl-math-formula" style="min-height:55px; margin:4px 0"></div>
                <p><b class="tl-live-value" id="tl-live-liquid-lt">5.50 cm</b></p>
                <div id="tl-svg-formula-liquid-sub" class="tl-math-formula" style="min-height:90px; margin:4px 0"></div>
              </div>
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">T → L<sub>T</sub></div>
                <p><b class="tl-live-value" id="tl-live-liquid-t-sub">25.0°C</b></p>
                <div id="tl-svg-formula-t-to-l" class="tl-math-formula" style="min-height:100px; margin:4px 0"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tl-live-tab" id="tl-live-resistance">
          <div class="tl-controls-steps">
            <div class="tl-info-label" style="margin-top:0;color:var(--tl-cyan)">Live calibration formula</div>
            <div class="tl-worked-solution tl-dual-direction">
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">R<sub>T</sub> → T</div>
                <div id="tl-svg-formula-resistance" class="tl-math-formula" style="min-height:55px; margin:4px 0"></div>
                <p><b class="tl-live-value" id="tl-live-resistance-rt">5.30 Ω</b></p>
                <div id="tl-svg-formula-resistance-sub" class="tl-math-formula" style="min-height:90px; margin:4px 0"></div>
              </div>
              <div class="tl-direction-col">
                <div class="tl-info-label tl-live-direction" style="color:var(--tl-cyan)">T → R<sub>T</sub></div>
                <p><b class="tl-live-value" id="tl-live-resistance-t-sub">25.0°C</b></p>
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
              <p><b class="tl-live-value" id="tl-live-thermistor-rt">10.00 kΩ</b></p>
              <div id="tl-svg-formula-thermistor-sub" class="tl-math-formula"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- FLOATING CONTROLS -->
      <div class="tl-controls" id="tl-controls-panel">
        <div class="tl-controls-float-bar">
          <button type="button" class="tl-controls-drag-handle" id="tl-controls-drag" aria-label="${t('tools.floatingControls.dragHint')}" title="${t('tools.floatingControls.dragHint')}">⋮⋮</button>
          <button type="button" class="tl-controls-toggle" id="tl-controls-toggle" aria-expanded="true">
            <span data-float-chevron>▾</span>
            <span>${t('tools.thermometerLab.paramSettings')}</span>
          </button>
        </div>
        <div class="tl-controls-body">
        <div class="tl-tab-content active" id="tl-tab-liquid"></div>
        <div class="tl-tab-content" id="tl-tab-resistance">
          <details class="tl-details" open>
            <summary>${t('tools.thermometerLab.paramSettings')}</summary>
            <div class="tl-details-body">
              <div class="tl-probe-specs">
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">R<sub>0</sub></span>
                  <span class="tl-tile-val" id="tl-spec-resistance-r0">5.0 Ω</span>
                </div>
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">R<sub>100</sub></span>
                  <span class="tl-tile-val" id="tl-spec-resistance-r100">6.2 Ω</span>
                </div>
              </div>
              <div class="tl-param-grid">
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>R<sub>0</sub> [Ω]</span>
                    <input type="number" id="tl-input-resistance-r0" class="tl-param-num" min="0.5" max="20.0" step="0.1" value="5.0">
                  </div>
                  <input type="range" id="tl-slider-resistance-r0" min="0.5" max="20.0" step="0.1" value="5.0">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>R<sub>100</sub> [Ω]</span>
                    <input type="number" id="tl-input-resistance-r100" class="tl-param-num" min="2.0" max="30.0" step="0.1" value="6.2">
                  </div>
                  <input type="range" id="tl-slider-resistance-r100" min="2.0" max="30.0" step="0.1" value="6.2">
                </div>
              </div>
            </div>
          </details>
        </div>
        <div class="tl-tab-content" id="tl-tab-thermistor">
          <details class="tl-details" open>
            <summary>${t('tools.thermometerLab.paramSettings')}</summary>
            <div class="tl-details-body">
              <div class="tl-probe-specs">
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">R<sub>25</sub></span>
                  <span class="tl-tile-val" id="tl-spec-thermistor-r25">10.0 kΩ</span>
                </div>
                <div class="tl-spec-tile">
                  <span class="tl-tile-label">β</span>
                  <span class="tl-tile-val" id="tl-spec-thermistor-beta">3500 K</span>
                </div>
              </div>
              <div class="tl-param-grid">
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>R<sub>25</sub> [kΩ]</span>
                    <input type="number" id="tl-input-thermistor-r25" class="tl-param-num" min="0.5" max="50.0" step="0.1" value="10.0">
                  </div>
                  <input type="range" id="tl-slider-thermistor-r25" min="0.5" max="50.0" step="0.1" value="10.0">
                </div>
                <div class="tl-cg">
                  <div class="tl-lr">
                    <span>β [K]</span>
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
    showLabels: true,
    lastDesignChange: null, // 'bulb' | 'bore' | 'wall' | null
    focusPart: isLiquidDesign ? 'bulb' : null, // 'bulb' | 'bore' | 'wall'
    /** Reference thermometer temp (default design τ) for side-by-side response compare */
    refThermometerTemp: 25.0,
  };

  // Teaching model (design lab):
  // - Capillary bore → sensitivity S only (S ∝ 1/d²)
  // - Bulb volume → range only (larger V_b → smaller range); scale ticks follow range
  // - Glass wall → response time τ
  const DESIGN = {
    V_ref: 200,
    d_ref: 0.3,
    w_ref: 0.5,
    S_ref: 0.10, // cm/°C at reference bore
    stemRiseCm: 18,
    range_ref: 180, // °C at reference bulb volume
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
    if (!slider || !input) return;
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

  // Design mode: wide scene for side-by-side reference vs current thermometer
  const DESIGN_SCENE_W = 780;
  const DESIGN_SCENE_H = 600;
  const PHYS_WIDTH = isLiquidDesign ? DESIGN_SCENE_W : 460;
  const PHYS_HEIGHT = isLiquidDesign ? DESIGN_SCENE_H : 340;
  const LABEL_MARGIN = 8;
  const LABEL_LEFT = 10;
  const PHYS_SCENE_OFFSET_X = isLiquidDesign ? 0 : 40;
  const PHYS_SCENE_OFFSET_Y = isLiquidDesign ? 0 : 44;
  let activeSceneW = isLiquidDesign ? DESIGN_SCENE_W : PHYS_WIDTH - PHYS_SCENE_OFFSET_X;
  const SCENE_WIDTH = isLiquidDesign ? DESIGN_SCENE_W : PHYS_WIDTH - PHYS_SCENE_OFFSET_X;
  const BEAKER_W = isLiquidDesign ? 560 : 130;
  const GRAPH_WIDTH = 640;
  const GRAPH_HEIGHT = 420;

  function getPhysLayout() {
    const sceneW = isLiquidDesign ? activeSceneW : SCENE_WIDTH;
    if (state.thermometerType === 'liquid') {
      const beakerW = isLiquidDesign ? Math.min(BEAKER_W, sceneW * 0.9) : BEAKER_W;
      return {
        beakerX: sceneW / 2 - beakerW / 2,
        beakerW,
        thermometerX: sceneW / 2,
        leftThermometerX: sceneW * 0.30,
        rightThermometerX: sceneW * 0.70,
        sceneW,
      };
    }
    return { beakerX: 55, beakerW: BEAKER_W, thermometerX: 120, sceneW };
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

  function getDesignSensitivityFor(bore, liquidType = state.liquidType) {
    const d = Math.max(0.05, bore);
    // Alcohol expands more than mercury → slightly higher sensitivity
    const liquidFactor = liquidType === 'alcohol' ? 1.35 : 1.0;
    // Design lab: sensitivity depends on capillary bore only (not bulb volume)
    return DESIGN.S_ref * Math.pow(DESIGN.d_ref / d, 2) * liquidFactor;
  }

  function getDesignSensitivity() {
    return getDesignSensitivityFor(state.capillaryBore);
  }

  function getDesignRangeCFor(bulbVolume) {
    const V = Math.max(10, bulbVolume);
    // Design lab: range depends on bulb volume only (larger bulb → smaller range)
    return DESIGN.range_ref * (DESIGN.V_ref / V);
  }

  function getDesignRangeC() {
    return getDesignRangeCFor(state.bulbVolume);
  }

  function getReferenceDesign() {
    return {
      bulbVolume: DESIGN.V_ref,
      capillaryBore: DESIGN.d_ref,
      wallThickness: DESIGN.w_ref,
    };
  }

  function getCurrentDesign() {
    return {
      bulbVolume: state.bulbVolume,
      capillaryBore: state.capillaryBore,
      wallThickness: state.wallThickness,
    };
  }

  function applyDesignToLengths() {
    const S = getDesignSensitivity();
    state.liquidL100 = Math.round((state.liquidL0 + S * 100) * 10) / 10;
    const l100El = wrap.querySelector('#tl-display-liquid-l100');
    if (l100El) l100El.textContent = state.liquidL100.toFixed(1);
  }

  function getDesignCue() {
    const key = state.lastDesignChange || state.focusPart;
    if (key === 'bore') {
      return state.capillaryBore < DESIGN.d_ref
        ? t('tools.thermometerLab.design.cueNarrowBore')
        : t('tools.thermometerLab.design.cueWideBore');
    }
    if (key === 'bulb') {
      return state.bulbVolume > DESIGN.V_ref
        ? t('tools.thermometerLab.design.cueLargeBulb')
        : t('tools.thermometerLab.design.cueSmallBulb');
    }
    if (key === 'wall') {
      return state.wallThickness < DESIGN.w_ref
        ? t('tools.thermometerLab.design.cueThinWall')
        : t('tools.thermometerLab.design.cueThickWall');
    }
    return t('tools.thermometerLab.design.cueDefault');
  }

  function setFocusPart(part) {
    if (!isLiquidDesign) return;
    state.focusPart = part;
    state.lastDesignChange = part;
    wrap.querySelectorAll('.tl-part-tab').forEach((btn) => {
      const on = btn.dataset.part === part;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    wrap.querySelectorAll('.tl-focus-control').forEach((el) => {
      el.hidden = el.dataset.control !== part;
    });
    const card = wrap.querySelector('#tl-focus-card');
    if (card) card.dataset.focus = part;
    wrap.querySelectorAll('.tl-design-stat').forEach((el) => {
      const key = el.dataset.stat;
      const highlight =
        (part === 'bulb' && key === 'range') ||
        (part === 'bore' && key === 'sensitivity') ||
        (part === 'wall' && key === 'response');
      el.classList.toggle('is-focus', highlight);
    });
    const badge = wrap.querySelector('#tl-focus-badge');
    const explain = wrap.querySelector('#tl-focus-explain');
    const effectK = wrap.querySelector('#tl-focus-effect-k');
    if (badge) {
      badge.textContent =
        part === 'bulb' ? t('tools.thermometerLab.design.tabBulb')
          : part === 'bore' ? t('tools.thermometerLab.design.tabBore')
            : t('tools.thermometerLab.design.tabWall');
    }
    if (explain) {
      explain.textContent =
        part === 'bulb' ? t('tools.thermometerLab.design.explainBulb')
          : part === 'bore' ? t('tools.thermometerLab.design.explainBore')
            : t('tools.thermometerLab.design.explainWall');
    }
    if (effectK) {
      effectK.textContent =
        part === 'wall' ? t('tools.thermometerLab.design.response')
          : part === 'bore' ? t('tools.thermometerLab.design.sensitivity')
            : t('tools.thermometerLab.design.range');
    }
    updateWhyFocusEffect();
    updateHTMLDisplays(getResponseTimeConstant());
    drawVisuals();
  }

  function updateWhyFocusEffect() {
    const effectV = wrap.querySelector('#tl-focus-effect-v');
    if (!effectV || !isLiquidDesign) return;
    const S = getDesignSensitivity();
    const rangeC = getDesignRangeC();
    const tau = getResponseTimeConstant();
    if (state.focusPart === 'wall') {
      effectV.textContent = `${tau.toFixed(2)} s`;
    } else if (state.focusPart === 'bore') {
      effectV.textContent = `${S.toFixed(3)} cm/°C`;
    } else {
      effectV.textContent = `≈ ${rangeC.toFixed(0)} °C`;
    }
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

  // DPI setup (design mode re-syncs on each draw to match container / fullscreen)
  const dpr = window.devicePixelRatio || 1;
  physCanvas.width = PHYS_WIDTH * dpr;
  physCanvas.height = PHYS_HEIGHT * dpr;
  if (!isLiquidDesign) {
    physCtx.scale(dpr, dpr);
  } else {
    physCanvas.style.width = '100%';
    physCanvas.style.height = '100%';
  }

  graphCanvas.width = GRAPH_WIDTH * dpr;
  graphCanvas.height = GRAPH_HEIGHT * dpr;
  graphCtx.scale(dpr, dpr);

  function syncDesignCanvasSize() {
    const host = physCanvas.parentElement;
    const cssW = Math.max(320, Math.floor(host?.clientWidth || DESIGN_SCENE_W));
    const cssH = Math.max(320, Math.floor(host?.clientHeight || DESIGN_SCENE_H));
    const ratio = window.devicePixelRatio || 1;
    const bw = Math.max(1, Math.floor(cssW * ratio));
    const bh = Math.max(1, Math.floor(cssH * ratio));
    if (physCanvas.width !== bw || physCanvas.height !== bh) {
      physCanvas.width = bw;
      physCanvas.height = bh;
    }
    return { cssW, cssH, ratio };
  }

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

  function getBulbVisualRadiusFor(bulbVolume) {
    const scale = Math.pow(Math.max(10, bulbVolume) / BULB_VOLUME_REF, 1 / 3);
    return BULB_RADIUS_REF * scale;
  }

  function getBulbVisualRadius() {
    return getBulbVisualRadiusFor(state.bulbVolume);
  }

  function getResponseTimeConstantFor(design, liquidType = state.liquidType) {
    if (state.thermometerType === 'resistance' || state.thermometerType === 'thermistor') {
      return 0.35;
    }
    // HKDSE: thinner glass wall → faster heat transfer → smaller τ (faster response)
    const conductivityFactor = liquidType === 'mercury' ? 1.0 : 8.0;
    const thicknessFactor = 0.15 + design.wallThickness * 1.8;
    const volumeFactor = 0.55 + design.bulbVolume * 0.0025;
    const capillaryFactor = 1.15 - design.capillaryBore * 0.25;
    return Math.max(0.08, thicknessFactor * volumeFactor * capillaryFactor * conductivityFactor * 0.14);
  }

  function getResponseTimeConstant() {
    return getResponseTimeConstantFor(getCurrentDesign());
  }

  function getReferenceResponseTimeConstant() {
    return getResponseTimeConstantFor(getReferenceDesign());
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
    const by = isLiquidDesign ? 455 : 180;
    const bw = layout.beakerW;
    const bh = isLiquidDesign ? 175 : 100;
    const waterY = isLiquidDesign ? 475 : 190;

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

  function drawFocusCallout(ctx, x0, y0, x1, y1, label, color, align = 'left', sceneW = activeSceneW) {
    ctx.save();
    ctx.font = 'bold 12px "Noto Sans TC", Arial, sans-serif';
    const padX = 8;
    const tw = ctx.measureText(label).width;
    const boxW = tw + padX * 2;
    const boxH = 24;
    let bx = align === 'right' ? x1 - boxW : x1;
    bx = Math.max(6, Math.min(bx, sceneW - boxW - 6));
    const by = y1 - boxH / 2;
    const lineEndX = align === 'right' ? bx + boxW : bx;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(lineEndX, y1);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x0, y0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, bx + padX, by + boxH / 2);
    ctx.restore();
  }

  function drawLiquidThermometer(ctx, layout, view = null) {
    const design = view || {
      bulbVolume: state.bulbVolume,
      capillaryBore: state.capillaryBore,
      wallThickness: state.wallThickness,
      thermometerTemp: state.thermometerTemp,
      role: 'solo',
    };
    const x = layout.thermometerX;
    const sceneW = layout.sceneW || activeSceneW || SCENE_WIDTH;
    const isCompare = design.role === 'reference' || design.role === 'current';
    // Design mode: tall stem + oversized bulb for classroom / TV visibility
    // Compare mode leaves room for the Ref / Your-design caption badges at the top
    const stemTop = isLiquidDesign ? (isCompare ? 56 : 14) : 20;
    const bulbScale = isLiquidDesign ? (isCompare ? 3.2 : 4.4) : 1;
    const bulbRadius = getBulbVisualRadiusFor(design.bulbVolume) * bulbScale;
    const bulbCenterY = isLiquidDesign
      ? 520 + Math.max(0, bulbRadius - BULB_RADIUS_REF * bulbScale) * 0.15
      : 250 + Math.max(0, bulbRadius - BULB_RADIUS_REF) * 0.35;
    const stemBottom = bulbCenterY - bulbRadius - 1;
    const glassWidth = isLiquidDesign
      ? 28 + design.wallThickness * 14
      : 10 + design.wallThickness * 8;
    const leftX = x - glassWidth / 2;
    const rightX = x + glassWidth / 2;
    // Only highlight focus parts on the current (right) thermometer in compare mode
    const focus = isLiquidDesign && design.role !== 'reference' ? state.focusPart : null;
    const dim = (part) => (focus && focus !== part ? 0.28 : 1);

    // Soft colorful bath backdrop when in design mode (once; compare mode draws it in drawVisuals)
    if (isLiquidDesign && !isCompare) {
      const bg = ctx.createLinearGradient(0, 0, sceneW, DESIGN_SCENE_H);
      bg.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      bg.addColorStop(0.5, 'rgba(251, 191, 36, 0.1)');
      bg.addColorStop(1, 'rgba(248, 113, 113, 0.12)');
      ctx.fillStyle = bg;
      ctx.fillRect(-8, -8, sceneW + 16, DESIGN_SCENE_H + 16);
    }

    // Glass stem
    ctx.save();
    ctx.globalAlpha = dim('wall') * (focus === 'bore' ? 0.55 : 1);
    const glassGrad = ctx.createLinearGradient(leftX, stemTop, rightX, stemTop);
    if (focus === 'wall') {
      glassGrad.addColorStop(0, 'rgba(125, 211, 252, 0.95)');
      glassGrad.addColorStop(0.25, 'rgba(255, 255, 255, 1)');
      glassGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.55)');
      glassGrad.addColorStop(0.75, 'rgba(255, 255, 255, 1)');
      glassGrad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');
    } else {
      glassGrad.addColorStop(0, 'rgba(186, 230, 253, 0.95)');
      glassGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.98)');
      glassGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.45)');
      glassGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.98)');
      glassGrad.addColorStop(1, 'rgba(125, 211, 252, 0.95)');
    }
    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = focus === 'wall' ? '#0284c7' : '#38bdf8';
    ctx.lineWidth = focus === 'wall' ? 2.5 + design.wallThickness * 0.8 : 1.2 + design.wallThickness * 0.5;
    ctx.beginPath();
    ctx.moveTo(leftX, stemBottom);
    ctx.lineTo(leftX, stemTop + 5);
    ctx.arcTo(leftX, stemTop, leftX + 5, stemTop, 5);
    ctx.arcTo(rightX, stemTop, rightX, stemTop + 5, 5);
    ctx.lineTo(rightX, stemBottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Capillary bore channel first (drawn under liquid); exaggerated for TV visibility
    const boreWidth = isLiquidDesign
      ? Math.max(8, Math.min(glassWidth * 0.62, 8 + design.capillaryBore * 18))
      : Math.min(glassWidth * 0.72, 0.8 + design.capillaryBore * 4.5);
    ctx.save();
    ctx.globalAlpha = dim('bore');
    if (focus === 'bore') {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = isLiquidDesign ? 5 : 4;
      ctx.strokeRect(x - boreWidth / 2 - 3, stemTop + 6, boreWidth + 6, stemBottom - stemTop - 6);
    }
    // Empty bore: pale so red liquid pops
    ctx.fillStyle = isLiquidDesign ? '#fee2e2' : (focus === 'bore' ? '#3b0764' : '#1e1b4b');
    ctx.fillRect(x - boreWidth / 2, stemTop + 8, boreWidth, stemBottom - stemTop - 8);
    ctx.restore();

    // Design mode always uses vivid red liquid so the column is obvious on a large screen
    const isMercury = state.liquidType === 'mercury';
    const color = isLiquidDesign ? '#dc2626' : (isMercury ? '#94a3b8' : '#ef4444');
    const colorHi = isLiquidDesign ? '#f87171' : '#ffffff';
    const colorDeep = isLiquidDesign ? '#991b1b' : (isMercury ? '#64748b' : '#b91c1c');

    const S = getDesignSensitivityFor(design.capillaryBore);
    const rangeC = getDesignRangeCFor(design.bulbVolume);
    const zeroY = isLiquidDesign ? 420 : 210;
    const maxCY = isLiquidDesign ? (isCompare ? stemTop + 8 : 30) : 40;
    const stemPx = zeroY - maxCY;
    let tickPixelsPerC;
    let currentY;
    let atTop;
    if (isLiquidDesign) {
      // Bulb → engraved scale spans 0…rangeC over the full stem (shows range)
      tickPixelsPerC = stemPx / Math.max(rangeC, 1e-6);
      // Bore → sensitivity vs that scale (S_ref matches the marks)
      const liquidPixelsPerC = tickPixelsPerC * (S / DESIGN.S_ref);
      const displayT = Math.min(Math.max(design.thermometerTemp, 0), rangeC);
      const risePx = displayT * liquidPixelsPerC;
      currentY = Math.max(maxCY, zeroY - risePx);
      atTop = design.thermometerTemp > rangeC + 0.5 || risePx >= stemPx - 0.5;
    } else {
      tickPixelsPerC = (stemPx / DESIGN.stemRiseCm) * S;
      const displayT = Math.min(design.thermometerTemp, rangeC);
      currentY = zeroY - displayT * tickPixelsPerC;
      atTop = design.thermometerTemp > rangeC + 0.5;
    }

    // Liquid column — bright red highlight
    ctx.save();
    ctx.globalAlpha = dim('bore') * 0.98 + 0.02;
    if (isLiquidDesign) {
      ctx.shadowColor = 'rgba(220, 38, 38, 0.65)';
      ctx.shadowBlur = 14;
    }
    const colGrad = ctx.createLinearGradient(x - boreWidth / 2, currentY, x + boreWidth / 2, currentY);
    colGrad.addColorStop(0, colorDeep);
    colGrad.addColorStop(0.35, color);
    colGrad.addColorStop(0.55, colorHi);
    colGrad.addColorStop(1, colorDeep);
    ctx.fillStyle = colGrad;
    ctx.fillRect(x - boreWidth / 2, currentY, boreWidth, stemBottom - currentY);
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(x, currentY, boreWidth / 2, isLiquidDesign ? 4.5 : 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (isLiquidDesign) {
      ctx.fillStyle = 'rgba(254, 202, 202, 0.85)';
      ctx.fillRect(x - boreWidth * 0.18, currentY + 2, boreWidth * 0.28, Math.max(0, stemBottom - currentY - 4));
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha *= 0.7;
      ctx.fillRect(x - boreWidth / 6, currentY, boreWidth / 3, stemBottom - currentY);
    }
    ctx.restore();

    // Bulb glass shell (drawn after stem so outline stays crisp)
    ctx.save();
    ctx.globalAlpha = dim('bulb') * (focus === 'wall' ? 0.7 : 1);
    const wallExtra = (isLiquidDesign ? 2.2 : 0.5) + design.wallThickness * (isLiquidDesign ? 1.2 : 0.5);
    const bulbOuter = bulbRadius + wallExtra;
    const bulbGrad = ctx.createRadialGradient(
      x - bulbRadius * 0.25, bulbCenterY - bulbRadius * 0.25, bulbRadius * 0.08,
      x, bulbCenterY, bulbOuter
    );
    if (focus === 'bulb') {
      bulbGrad.addColorStop(0, '#fff7ed');
      bulbGrad.addColorStop(0.45, '#fdba74');
      bulbGrad.addColorStop(1, '#ea580c');
    } else if (focus === 'wall') {
      bulbGrad.addColorStop(0, 'rgba(224, 242, 254, 0.55)');
      bulbGrad.addColorStop(0.55, 'rgba(125, 211, 252, 0.45)');
      bulbGrad.addColorStop(1, 'rgba(2, 132, 199, 0.75)');
    } else if (isLiquidDesign) {
      // Mostly clear glass so the red liquid inside dominates
      bulbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      bulbGrad.addColorStop(0.55, 'rgba(254, 226, 226, 0.35)');
      bulbGrad.addColorStop(1, 'rgba(252, 165, 165, 0.55)');
    } else {
      bulbGrad.addColorStop(0, '#fffbeb');
      bulbGrad.addColorStop(0.5, '#fcd34d');
      bulbGrad.addColorStop(1, '#f59e0b');
    }
    ctx.fillStyle = bulbGrad;
    ctx.strokeStyle = focus === 'bulb' ? '#c2410c' : (focus === 'wall' ? '#0369a1' : (isLiquidDesign ? '#f87171' : '#d97706'));
    ctx.lineWidth = focus === 'wall' ? 2.8 + design.wallThickness : (focus === 'bulb' ? 4 : (isLiquidDesign ? 3 : 1.5));
    ctx.beginPath();
    ctx.arc(x, bulbCenterY, bulbOuter, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Liquid in bulb — vivid red fill
    ctx.save();
    ctx.globalAlpha = dim('bulb');
    const bulbCoreRadius = bulbRadius * (isLiquidDesign ? 0.9 : 0.88);
    const liquidBulbGrad = ctx.createRadialGradient(
      x - bulbCoreRadius * 0.25, bulbCenterY - bulbCoreRadius * 0.3, bulbCoreRadius * 0.08,
      x, bulbCenterY, bulbCoreRadius
    );
    if (isLiquidDesign || !isMercury) {
      liquidBulbGrad.addColorStop(0, '#fecaca');
      liquidBulbGrad.addColorStop(0.35, '#ef4444');
      liquidBulbGrad.addColorStop(0.7, '#dc2626');
      liquidBulbGrad.addColorStop(1, '#7f1d1d');
    } else {
      liquidBulbGrad.addColorStop(0, '#ffffff');
      liquidBulbGrad.addColorStop(0.35, '#cbd5e1');
      liquidBulbGrad.addColorStop(1, '#64748b');
    }
    if (isLiquidDesign) {
      ctx.shadowColor = 'rgba(220, 38, 38, 0.55)';
      ctx.shadowBlur = 18;
    }
    ctx.fillStyle = liquidBulbGrad;
    ctx.beginPath();
    ctx.arc(x, bulbCenterY, bulbCoreRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (isLiquidDesign) {
      ctx.fillStyle = 'rgba(254, 226, 226, 0.55)';
      ctx.beginPath();
      ctx.ellipse(x - bulbCoreRadius * 0.28, bulbCenterY - bulbCoreRadius * 0.32, bulbCoreRadius * 0.28, bulbCoreRadius * 0.18, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Scale markings — follow the bulb's range so students see range change on the stem
    ctx.save();
    ctx.globalAlpha = focus ? 0.7 : 0.95;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = isLiquidDesign ? 1.4 : 0.6;
    ctx.font = isLiquidDesign
      ? (isCompare ? 'bold 12px Arial' : 'bold 13px Arial')
      : 'bold 7px Arial';
    ctx.fillStyle = '#334155';
    ctx.textBaseline = 'middle';
    const tickLen = isLiquidDesign ? 12 : 5;
    // Choose a readable tick step for the current range (always adjust with bulb volume)
    let tickStep = 10;
    if (rangeC > 400) tickStep = 100;
    else if (rangeC > 250) tickStep = 50;
    else if (rangeC > 120) tickStep = 25;
    else if (rangeC > 60) tickStep = 10;
    else if (rangeC > 30) tickStep = 5;
    else tickStep = 5;
    // In compare mode, put labels on the outside so the two stems do not collide
    const ticksOnRight = isCompare && design.role === 'current';
    ctx.textAlign = ticksOnRight ? 'left' : 'right';
    const maxTick = Math.ceil(rangeC / tickStep) * tickStep;
    const labelGap = isLiquidDesign ? (isCompare ? 6 : 8) : 18;
    for (let tVal = 0; tVal <= maxTick + 0.01; tVal += tickStep) {
      if (tVal > rangeC + 0.01) break;
      const yTick = zeroY - tVal * tickPixelsPerC;
      if (yTick < maxCY - 2) break;
      ctx.beginPath();
      if (ticksOnRight) {
        ctx.moveTo(rightX - tickLen, yTick);
        ctx.lineTo(rightX, yTick);
        ctx.stroke();
        ctx.fillText(`${Math.round(tVal)}°`, rightX + labelGap, yTick);
      } else {
        ctx.moveTo(leftX, yTick);
        ctx.lineTo(leftX + tickLen, yTick);
        ctx.stroke();
        ctx.fillText(`${Math.round(tVal)}°`, leftX - labelGap, yTick);
      }
    }
    ctx.restore();

    if (atTop) {
      ctx.fillStyle = '#dc2626';
      ctx.font = isLiquidDesign
        ? 'bold 14px "Noto Sans TC", Arial, sans-serif'
        : 'bold 10px "Noto Sans TC", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(t('tools.thermometerLab.design.outOfRange'), rightX + 8, maxCY + 10);
    }

    // Focus indicators / callouts (solo design mode only — compare mode uses captions)
    if (isLiquidDesign && !isCompare) {
      const labelColRight = Math.min(sceneW - 12, x + Math.max(glassWidth / 2, bulbOuter) + 36);
      if (focus === 'bulb') {
        drawFocusCallout(ctx, x + bulbOuter * 0.75, bulbCenterY, labelColRight, bulbCenterY, t('tools.thermometerLab.design.tabBulb'), '#ea580c', 'left', sceneW);
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.55)';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(x, bulbCenterY, bulbOuter + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (focus === 'bore') {
        drawFocusCallout(ctx, x + boreWidth / 2 + 6, (stemTop + stemBottom) / 2, labelColRight, (stemTop + stemBottom) / 2 - 10, t('tools.thermometerLab.design.tabBore'), '#9333ea', 'left', sceneW);
      } else if (focus === 'wall') {
        drawFocusCallout(ctx, leftX, stemTop + 90, leftX - 12, stemTop + 90, t('tools.thermometerLab.design.tabWall'), '#0284c7', 'right', sceneW);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        const midY = stemTop + 130;
        ctx.beginPath();
        ctx.moveTo(leftX - 2, midY - 14);
        ctx.lineTo(leftX - 2, midY + 14);
        ctx.moveTo(leftX + (glassWidth - boreWidth) / 4, midY);
        ctx.lineTo(leftX - 2, midY);
        ctx.stroke();
      }
    } else if (isLiquidDesign && isCompare) {
      // Compact focus ring on the active part of the current thermometer
      if (design.role === 'current' && focus === 'bulb') {
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.55)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(x, bulbCenterY, bulbOuter + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (design.role === 'current' && focus === 'bore') {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - boreWidth / 2 - 2, stemTop + 6, boreWidth + 4, stemBottom - stemTop - 6);
      } else if (design.role === 'current' && focus === 'wall') {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(leftX - 2, stemTop + 4, glassWidth + 4, stemBottom - stemTop - 4);
      }
    } else if (state.showLabels) {
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

  function getCompareMetricLine(design) {
    const S = getDesignSensitivityFor(design.capillaryBore);
    const rangeC = getDesignRangeCFor(design.bulbVolume);
    const tau = getResponseTimeConstantFor(design);
    if (state.focusPart === 'bore') {
      return `${t('tools.thermometerLab.design.sensitivity')} ${S.toFixed(3)} cm/°C`;
    }
    if (state.focusPart === 'wall') {
      return `${t('tools.thermometerLab.design.response')} ${tau.toFixed(2)} s`;
    }
    return `${t('tools.thermometerLab.design.range')} ≈ ${rangeC.toFixed(0)} °C`;
  }

  function drawCompareCaption(ctx, x, y, title, metric, accent) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const boxW = 200;
    const boxH = 44;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - boxW / 2, y - boxH / 2, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = 'bold 14px "Noto Sans TC", Arial, sans-serif';
    ctx.fillText(title, x, y - 9);
    ctx.fillStyle = '#334155';
    ctx.font = '12px "Noto Sans TC", Arial, sans-serif';
    ctx.fillText(metric, x, y + 11);
    ctx.restore();
  }

  function drawVisuals() {
    if (isLiquidDesign) {
      const { cssW, cssH, ratio } = syncDesignCanvasSize();
      physCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      physCtx.clearRect(0, 0, cssW, cssH);
      const pad = 8;
      const availW = Math.max(1, cssW - pad * 2);
      const availH = Math.max(1, cssH - pad * 2);
      activeSceneW = DESIGN_SCENE_W;
      // Contain: keep both thermometers visible (no crop / over-zoom)
      const fit = Math.min(availW / DESIGN_SCENE_W, availH / DESIGN_SCENE_H);
      const ox = (cssW - DESIGN_SCENE_W * fit) / 2;
      const oy = (cssH - DESIGN_SCENE_H * fit) / 2;
      physCtx.setTransform(ratio * fit, 0, 0, ratio * fit, ratio * ox, ratio * oy);

      const physLayout = getPhysLayout();
      const sceneW = physLayout.sceneW;

      // Shared backdrop once for the compare scene
      const bg = physCtx.createLinearGradient(0, 0, sceneW, DESIGN_SCENE_H);
      bg.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      bg.addColorStop(0.5, 'rgba(251, 191, 36, 0.1)');
      bg.addColorStop(1, 'rgba(248, 113, 113, 0.12)');
      physCtx.fillStyle = bg;
      physCtx.fillRect(-8, -8, sceneW + 16, DESIGN_SCENE_H + 16);

      // Divider between reference and current
      physCtx.save();
      physCtx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
      physCtx.lineWidth = 2;
      physCtx.setLineDash([6, 6]);
      physCtx.beginPath();
      physCtx.moveTo(sceneW / 2, 10);
      physCtx.lineTo(sceneW / 2, 440);
      physCtx.stroke();
      physCtx.setLineDash([]);
      physCtx.restore();

      drawBeaker(physCtx, physLayout);

      const refDesign = getReferenceDesign();
      const curDesign = getCurrentDesign();
      // Wall tab: each thermometer uses its own τ-driven temperature.
      // Bulb / bore tabs: same temperature so students compare range / sensitivity only.
      const refTemp = state.focusPart === 'wall' ? state.refThermometerTemp : state.thermometerTemp;
      const curTemp = state.thermometerTemp;

      drawLiquidThermometer(
        physCtx,
        { ...physLayout, thermometerX: physLayout.leftThermometerX },
        { ...refDesign, thermometerTemp: refTemp, role: 'reference' }
      );
      drawLiquidThermometer(
        physCtx,
        { ...physLayout, thermometerX: physLayout.rightThermometerX },
        { ...curDesign, thermometerTemp: curTemp, role: 'current' }
      );

      drawCompareCaption(
        physCtx,
        physLayout.leftThermometerX,
        28,
        t('tools.thermometerLab.design.compareRef'),
        getCompareMetricLine(refDesign),
        '#64748b'
      );
      drawCompareCaption(
        physCtx,
        physLayout.rightThermometerX,
        28,
        t('tools.thermometerLab.design.compareCurrent'),
        getCompareMetricLine(curDesign),
        state.focusPart === 'bore' ? '#9333ea'
          : state.focusPart === 'wall' ? '#0284c7'
            : '#ea580c'
      );

      // Living temperature readout under each stem (helps wall/response demos)
      if (state.focusPart === 'wall') {
        physCtx.save();
        physCtx.textAlign = 'center';
        physCtx.font = 'bold 13px "Noto Sans TC", Arial, sans-serif';
        physCtx.fillStyle = '#0f766e';
        physCtx.fillText(`T = ${refTemp.toFixed(1)} °C`, physLayout.leftThermometerX, 448);
        physCtx.fillText(`T = ${curTemp.toFixed(1)} °C`, physLayout.rightThermometerX, 448);
        physCtx.restore();
      }

      return;
    }

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
    const bathTempDisplay = wrap.querySelector('#tl-bath-temp-display');
    const bathTempVal = wrap.querySelector('#tl-val-bath-temp');
    if (bathTempDisplay) bathTempDisplay.innerHTML = state.bathTemp.toFixed(1) + '°C';
    if (bathTempVal) bathTempVal.innerHTML = state.bathTemp.toFixed(1) + ' °C';

    const stateEl = wrap.querySelector('#tl-bath-state');
    if (stateEl) {
      if (state.bathTemp <= 0) {
        stateEl.textContent = 'Melting Ice Bath';
      } else if (state.bathTemp === 150) {
        stateEl.textContent = 'Hot Cooking Oil';
      } else if (state.bathTemp >= 100) {
        stateEl.textContent = 'Boiling Water/Steam';
      } else {
        stateEl.textContent = 'Liquid Water';
      }
    }

    const responseEl = wrap.querySelector('#tl-val-response-time');
    if (responseEl) responseEl.textContent = tau.toFixed(2) + ' s';

    if (state.thermometerType === 'liquid') {
      const S = getDesignSensitivity();
      const rangeC = getDesignRangeC();
      const sensEl = wrap.querySelector('#tl-val-sensitivity');
      const rangeEl = wrap.querySelector('#tl-val-range');
      const cueEl = wrap.querySelector('#tl-design-cue');
      if (sensEl) sensEl.textContent = `${S.toFixed(3)} cm/°C`;
      if (rangeEl) rangeEl.textContent = `≈ ${rangeC.toFixed(0)} °C`;
      if (cueEl) cueEl.textContent = getDesignCue();
      updateWhyFocusEffect();
    }

    const warnBanner = wrap.querySelector('#tl-alcohol-boiling-warning');
    if (warnBanner) {
      if (state.thermometerType === 'liquid' && state.liquidType === 'alcohol' && state.bathTemp >= 78) {
        warnBanner.style.display = 'block';
      } else {
        warnBanner.style.display = 'none';
      }
    }

    if (state.thermometerType === 'liquid') {
      const lt = wrap.querySelector('#tl-live-liquid-lt');
      const tSub = wrap.querySelector('#tl-live-liquid-t-sub');
      if (lt) lt.textContent = state.currentLength.toFixed(2) + ' cm';
      if (tSub) tSub.textContent = state.thermometerTemp.toFixed(1) + '°C';
    } else if (state.thermometerType === 'resistance') {
      const rt = wrap.querySelector('#tl-live-resistance-rt');
      const tSub = wrap.querySelector('#tl-live-resistance-t-sub');
      if (rt) rt.textContent = state.currentResistance.toFixed(2) + ' Ω';
      if (tSub) tSub.textContent = state.thermometerTemp.toFixed(1) + '°C';
    } else {
      const rt = wrap.querySelector('#tl-live-thermistor-rt');
      if (rt) rt.textContent = state.currentThermistorR.toFixed(2) + ' kΩ';
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

    if (isLiquidDesign) {
      const tauRef = getReferenceResponseTimeConstant();
      state.refThermometerTemp += (clampedDt / tauRef) * (state.bathTemp - state.refThermometerTemp);
    }

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
    const btn = wrap.querySelector('#' + btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.bathTemp = temp;
      const slider = wrap.querySelector('#tl-bath-temp-slider');
      if (slider) slider.value = String(temp);
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
    if (toggleLabelsBtn && !isLiquidDesign) {
      toggleLabelsBtn.addEventListener('click', () => {
        state.showLabels = !state.showLabels;
        wrap.querySelector('#tl-lbl-toggle-labels').textContent = state.showLabels
          ? t('tools.thermometerLab.labels.hide')
          : t('tools.thermometerLab.labels.show');
      });
    }

    if (isLiquidDesign) {
      wrap.querySelectorAll('.tl-part-tab').forEach((btn) => {
        btn.addEventListener('click', () => setFocusPart(btn.dataset.part));
      });
    }

    const tempSlider = wrap.querySelector('#tl-bath-temp-slider');
    if (tempSlider) {
      tempSlider.addEventListener('input', (e) => {
        state.bathTemp = parseFloat(e.target.value);
        updateCalculations();
      });
    }

    setupPreset('tl-btn-preset-ice', 0.0);
    setupPreset('tl-btn-preset-room', 25.0);
    setupPreset('tl-btn-preset-steam', 100.0);
    setupPreset('tl-btn-preset-oil', 150.0);

    const mercuryBtn = wrap.querySelector('#tl-card-mercury');
    const alcoholBtn = wrap.querySelector('#tl-card-alcohol');
    if (mercuryBtn && alcoholBtn) {
      mercuryBtn.addEventListener('click', () => {
        state.liquidType = 'mercury';
        mercuryBtn.className = 'tl-seg-btn active-mercury';
        alcoholBtn.className = 'tl-seg-btn';
        applyDesignToLengths();
        updateCalculations();
      });

      alcoholBtn.addEventListener('click', () => {
        state.liquidType = 'alcohol';
        mercuryBtn.className = 'tl-seg-btn';
        alcoholBtn.className = 'tl-seg-btn active-alcohol';
        applyDesignToLengths();
        updateCalculations();
      });
    }

    bindParamPair(
      wrap.querySelector('#tl-slider-bulb-vol'),
      wrap.querySelector('#tl-input-bulb-vol'),
      {
        min: 10, max: 1000, step: 10, decimals: 0,
        onUpdate: (v) => {
          state.bulbVolume = v;
          state.lastDesignChange = 'bulb';
          applyDesignToLengths();
          updateCalculations();
        }
      }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-wall-thick'),
      wrap.querySelector('#tl-input-wall-thick'),
      {
        min: 0.05, max: 3.0, step: 0.05, decimals: 2,
        onUpdate: (v) => {
          state.wallThickness = v;
          state.lastDesignChange = 'wall';
          updateCalculations();
        }
      }
    );

    bindParamPair(
      wrap.querySelector('#tl-slider-capillary-bore'),
      wrap.querySelector('#tl-input-capillary-bore'),
      {
        min: 0.05, max: 2.0, step: 0.05, decimals: 2,
        onUpdate: (v) => {
          state.capillaryBore = v;
          state.lastDesignChange = 'bore';
          applyDesignToLengths();
          updateCalculations();
        }
      }
    );

    function setDesignParamUI(part, value) {
      if (part === 'bulb') {
        const slider = wrap.querySelector('#tl-slider-bulb-vol');
        const input = wrap.querySelector('#tl-input-bulb-vol');
        if (slider) slider.value = String(value);
        if (input) input.value = Number(value).toFixed(0);
      } else if (part === 'bore') {
        const slider = wrap.querySelector('#tl-slider-capillary-bore');
        const input = wrap.querySelector('#tl-input-capillary-bore');
        if (slider) slider.value = String(value);
        if (input) input.value = Number(value).toFixed(2);
      } else if (part === 'wall') {
        const slider = wrap.querySelector('#tl-slider-wall-thick');
        const input = wrap.querySelector('#tl-input-wall-thick');
        if (slider) slider.value = String(value);
        if (input) input.value = Number(value).toFixed(2);
      }
    }

    function resetDesignPart(part) {
      if (part === 'bulb') {
        state.bulbVolume = DESIGN.V_ref;
        setDesignParamUI('bulb', DESIGN.V_ref);
      } else if (part === 'bore') {
        state.capillaryBore = DESIGN.d_ref;
        setDesignParamUI('bore', DESIGN.d_ref);
      } else if (part === 'wall') {
        state.wallThickness = DESIGN.w_ref;
        setDesignParamUI('wall', DESIGN.w_ref);
        // Align both columns so the next bath change shows a clean response compare
        state.refThermometerTemp = state.thermometerTemp;
      }
      state.lastDesignChange = part;
      applyDesignToLengths();
      updateCalculations();
      drawVisuals();
    }

    function resetAllDesignParts() {
      state.bulbVolume = DESIGN.V_ref;
      state.capillaryBore = DESIGN.d_ref;
      state.wallThickness = DESIGN.w_ref;
      setDesignParamUI('bulb', DESIGN.V_ref);
      setDesignParamUI('bore', DESIGN.d_ref);
      setDesignParamUI('wall', DESIGN.w_ref);
      state.refThermometerTemp = state.thermometerTemp;
      state.lastDesignChange = state.focusPart || 'bulb';
      applyDesignToLengths();
      updateCalculations();
      drawVisuals();
    }

    wrap.querySelector('#tl-btn-reset-bulb')?.addEventListener('click', () => resetDesignPart('bulb'));
    wrap.querySelector('#tl-btn-reset-bore')?.addEventListener('click', () => resetDesignPart('bore'));
    wrap.querySelector('#tl-btn-reset-wall')?.addEventListener('click', () => resetDesignPart('wall'));
    wrap.querySelector('#tl-btn-reset-design')?.addEventListener('click', () => resetAllDesignParts());

    bindParamPair(
      wrap.querySelector('#tl-slider-liquid-l0'),
      wrap.querySelector('#tl-input-liquid-l0'),
      {
        min: 0.5, max: 15.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.liquidL0 = v;
          applyDesignToLengths();
          updateCalculations();
        }
      }
    );

    const r0Slider = wrap.querySelector('#tl-slider-resistance-r0');
    const r0Input = wrap.querySelector('#tl-input-resistance-r0');
    if (r0Slider && r0Input) {
      bindParamPair(r0Slider, r0Input, {
        min: 0.5, max: 20.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.resistanceR0 = v;
          const el = wrap.querySelector('#tl-spec-resistance-r0');
          if (el) el.textContent = v.toFixed(1) + ' Ω';
          updateCalculations();
        }
      });
    }

    const r100Slider = wrap.querySelector('#tl-slider-resistance-r100');
    const r100Input = wrap.querySelector('#tl-input-resistance-r100');
    if (r100Slider && r100Input) {
      bindParamPair(r100Slider, r100Input, {
        min: 2.0, max: 30.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.resistanceR100 = v;
          const el = wrap.querySelector('#tl-spec-resistance-r100');
          if (el) el.textContent = v.toFixed(1) + ' Ω';
          updateCalculations();
        }
      });
    }

    const thRSlider = wrap.querySelector('#tl-slider-thermistor-r25');
    const thRInput = wrap.querySelector('#tl-input-thermistor-r25');
    if (thRSlider && thRInput) {
      bindParamPair(thRSlider, thRInput, {
        min: 0.5, max: 50.0, step: 0.1, decimals: 1,
        onUpdate: (v) => {
          state.thermistorR25 = v;
          const el = wrap.querySelector('#tl-spec-thermistor-r25');
          if (el) el.textContent = v.toFixed(1) + ' kΩ';
          updateCalculations();
        }
      });
    }

    const thBSlider = wrap.querySelector('#tl-slider-thermistor-beta');
    const thBInput = wrap.querySelector('#tl-input-thermistor-beta');
    if (thBSlider && thBInput) {
      bindParamPair(thBSlider, thBInput, {
        min: 1000, max: 8000, step: 50, decimals: 0,
        onUpdate: (v) => {
          state.thermistorBeta = v;
          const el = wrap.querySelector('#tl-spec-thermistor-beta');
          if (el) el.textContent = v + ' K';
          updateCalculations();
        }
      });
    }

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
  applyDesignToLengths();
  if (isLiquidDesign) setFocusPart('bulb');
  updateCalculations();

  const dash = wrap.querySelector('.tl-dash');
  const controlsPanel = wrap.querySelector('.tl-controls');
  const toggleBtn = wrap.querySelector('#tl-controls-toggle');
  const dragHandle = wrap.querySelector('#tl-controls-drag');
  const floatBar = wrap.querySelector('.tl-controls-float-bar');
  if (!isLiquidDesign && dash && controlsPanel && toggleBtn) {
    initFloatingControlsPanel({
      container: dash,
      panel: controlsPanel,
      toggleBtn,
      dragHandle,
      dragSurface: floatBar,
      storageKey: `s3phy-thermo-design-v13-${defaultType}`,
      breakpoint: THERM_FLOAT_BREAKPOINT,
      getToggleTitle: (collapsed) => collapsed
        ? t('tools.floatingControls.showParams')
        : t('tools.floatingControls.hideParams'),
      onLayoutChange: () => drawVisuals(),
    });
  }

  if (typeof ResizeObserver !== 'undefined' && dash) {
    const vizHost = wrap.querySelector('.tl-viz-phys--large') || dash;
    const ro = new ResizeObserver(() => drawVisuals());
    ro.observe(vizHost);
    const onWinResize = () => drawVisuals();
    window.addEventListener('resize', onWinResize);
    wrap._thermometerLabCleanup = () => {
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
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
