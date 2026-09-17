/** Interactive refraction lab — Snell's law, media, light speed. */

const MEDIA = {
  air: { id: 'air', n: 1.0 },
  water: { id: 'water', n: 1.33 },
  glass: { id: 'glass', n: 1.5 },
};

const C_VACUUM = 3.0; // × 10⁸ m s⁻¹

/**
 * @param {(key: string) => string} t
 */
export function initRefractionLab(root, t) {
  const wrap = document.createElement('div');
  wrap.className = 'reflab';
  wrap.innerHTML = `
    <div class="reflab-head">
      <div class="reflab-head-main">
        <h2 class="reflab-title">${t('tools.refraction.title')}</h2>
        <div class="reflab-sub">${t('tools.refraction.subtitle')}</div>
      </div>
      <div class="lang-bar">
        <button type="button" class="lang-btn" data-set-lang="en">English</button>
        <button type="button" class="lang-btn" data-set-lang="zh">繁體中文</button>
      </div>
    </div>
    <div class="reflab-dash">
      <div class="reflab-viz">
        <div class="reflab-mode-toggle">
          <button type="button" class="reflab-mode-btn active" data-layer-mode="two">${t('tools.refraction.mode.two')}</button>
          <button type="button" class="reflab-mode-btn" data-layer-mode="three">${t('tools.refraction.mode.three')}</button>
        </div>
        <canvas class="reflab-canvas" width="720" height="440" aria-label="${t('tools.refraction.title')}"></canvas>

        <!-- Two-layer HUDs -->
        <div class="reflab-mode-panel" data-mode-panel="two">
          <div class="reflab-canvas-hud reflab-canvas-hud--incident">
            <div class="reflab-hud-label">${t('tools.refraction.n1')}</div>
            <div class="reflab-chips" data-side="1">${mediumChips('1')}</div>
            <div class="reflab-slider-row">
              <input type="range" data-n1-slider min="1.00" max="2.00" step="0.01" value="1.00" aria-label="n1" />
              <input type="number" data-n1-input min="1.00" max="2.00" step="0.01" value="1.00" class="reflab-num-input" />
            </div>
            <div class="reflab-readout reflab-readout--compact">
              <span>${t('tools.refraction.nLabel')}₁ = <strong data-n="1">1.00</strong></span>
              <span>${t('tools.refraction.speedLabel')}₁ = <strong data-v="1">3.00</strong> ${t('tools.refraction.speedUnit')}</span>
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--refracted">
            <div class="reflab-hud-label">${t('tools.refraction.n2')}</div>
            <div class="reflab-chips" data-side="2">${mediumChips('2')}</div>
            <div class="reflab-slider-row">
              <input type="range" data-n2-slider min="1.00" max="2.00" step="0.01" value="1.33" aria-label="n2" />
              <input type="number" data-n2-input min="1.00" max="2.00" step="0.01" value="1.33" class="reflab-num-input" />
            </div>
            <div class="reflab-readout reflab-readout--compact">
              <span>${t('tools.refraction.nLabel')}₂ = <strong data-n="2">1.33</strong></span>
              <span>${t('tools.refraction.speedLabel')}₂ = <strong data-v="2">2.26</strong> ${t('tools.refraction.speedUnit')}</span>
            </div>
          </div>
        </div>

        <!-- Three-layer HUDs (X / Y / Z) -->
        <div class="reflab-mode-panel" data-mode-panel="three" hidden>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerX">
            <div class="reflab-hud-label">${t('tools.refraction.layer.X')}</div>
            <div class="reflab-chips" data-side="X">${mediumChips('X')}</div>
            <div class="reflab-slider-row">
              <input type="range" data-nx-slider min="1.00" max="2.00" step="0.01" value="1.20" aria-label="nX" />
              <input type="number" data-nx-input min="1.00" max="2.00" step="0.01" value="1.20" class="reflab-num-input" />
            </div>
            <div class="reflab-readout reflab-readout--compact">
              <span>n<sub>X</sub> = <strong data-n="X">1.20</strong></span>
              <span>v<sub>X</sub> = <strong data-v="X">2.50</strong> ${t('tools.refraction.speedUnit')}</span>
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerY">
            <div class="reflab-hud-label">${t('tools.refraction.layer.Y')}</div>
            <div class="reflab-chips" data-side="Y">${mediumChips('Y')}</div>
            <div class="reflab-slider-row">
              <input type="range" data-ny-slider min="1.00" max="2.00" step="0.01" value="1.50" aria-label="nY" />
              <input type="number" data-ny-input min="1.00" max="2.00" step="0.01" value="1.50" class="reflab-num-input" />
            </div>
            <div class="reflab-readout reflab-readout--compact">
              <span>n<sub>Y</sub> = <strong data-n="Y">1.50</strong></span>
              <span>v<sub>Y</sub> = <strong data-v="Y">2.00</strong> ${t('tools.refraction.speedUnit')}</span>
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerZ">
            <div class="reflab-hud-label">${t('tools.refraction.layer.Z')}</div>
            <div class="reflab-chips" data-side="Z">${mediumChips('Z')}</div>
            <div class="reflab-slider-row">
              <input type="range" data-nz-slider min="1.00" max="2.00" step="0.01" value="1.00" aria-label="nZ" />
              <input type="number" data-nz-input min="1.00" max="2.00" step="0.01" value="1.00" class="reflab-num-input" />
            </div>
            <div class="reflab-readout reflab-readout--compact">
              <span>n<sub>Z</sub> = <strong data-n="Z">1.00</strong></span>
              <span>v<sub>Z</sub> = <strong data-v="Z">3.00</strong> ${t('tools.refraction.speedUnit')}</span>
            </div>
          </div>
        </div>

        <!-- Formula strip -->
        <div class="reflab-canvas-hud reflab-canvas-hud--formula">
          <div class="reflab-formula">${t('tools.refraction.snell')}</div>
          <div class="reflab-hud-meta">
            <div class="reflab-sr" data-critical-row hidden>
              <span class="reflab-sl">${t('tools.refraction.critical')}</span>
              <span class="reflab-sv" data-critical>—</span>
            </div>
            <div class="reflab-tir" data-tir hidden>${t('tools.refraction.tir')}</div>
            <button type="button" class="reflab-reset reflab-reset--compact" data-reset>${t('tools.refraction.reset')}</button>
          </div>
        </div>

        <!-- Microscopic models -->
        <div class="reflab-micro-overlay reflab-micro-overlay--1">
          <div class="reflab-micro-box" data-side="1">
            <div class="reflab-micro-title reflab-micro-title--1">${t('tools.refraction.particleModel.title')}</div>
            <canvas class="reflab-particle-canvas-1" width="320" height="220" aria-label="Microscopic Particle Model 1"></canvas>
          </div>
        </div>
        <div class="reflab-micro-overlay reflab-micro-overlay--3" hidden>
          <div class="reflab-micro-box" data-side="Y">
            <div class="reflab-micro-title reflab-micro-title--Y">${t('tools.refraction.particleModel.title')}</div>
            <canvas class="reflab-particle-canvas-Y" width="320" height="220" aria-label="Microscopic Particle Model Y"></canvas>
          </div>
        </div>
        <div class="reflab-micro-overlay reflab-micro-overlay--2">
          <div class="reflab-micro-box" data-side="2">
            <div class="reflab-micro-title reflab-micro-title--2">${t('tools.refraction.particleModel.title')}</div>
            <canvas class="reflab-particle-canvas-2" width="320" height="220" aria-label="Microscopic Particle Model 2"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  function mediumChips(side) {
    return ['air', 'water', 'glass']
      .map(
        (id) => `
      <button type="button" class="reflab-chip" data-medium="${id}" data-for="${side}">
        ${t(`tools.refraction.medium.${id}`)}
      </button>`,
      )
      .join('');
  }

  const canvas = /** @type {HTMLCanvasElement} */ (wrap.querySelector('.reflab-canvas'));
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const particleCanvas1 = /** @type {HTMLCanvasElement} */ (wrap.querySelector('.reflab-particle-canvas-1'));
  const ctxP1 = /** @type {CanvasRenderingContext2D} */ (particleCanvas1.getContext('2d'));
  const particleCanvas2 = /** @type {HTMLCanvasElement} */ (wrap.querySelector('.reflab-particle-canvas-2'));
  const ctxP2 = /** @type {CanvasRenderingContext2D} */ (particleCanvas2.getContext('2d'));
  const particleCanvasY = /** @type {HTMLCanvasElement} */ (wrap.querySelector('.reflab-particle-canvas-Y'));
  const ctxPY = particleCanvasY ? /** @type {CanvasRenderingContext2D} */ (particleCanvasY.getContext('2d')) : null;
  const microOverlayY = /** @type {HTMLElement | null} */ (wrap.querySelector('.reflab-micro-overlay--3'));
  const microTitle1 = wrap.querySelector('.reflab-micro-title--1');
  const microTitle2 = wrap.querySelector('.reflab-micro-title--2');
  const microTitleY = wrap.querySelector('.reflab-micro-title--Y');
  const n1Slider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-n1-slider]'));
  const n2Slider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-n2-slider]'));
  const n1Input = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-n1-input]'));
  const n2Input = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-n2-input]'));
  const nXSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-nx-slider]'));
  const nYSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-ny-slider]'));
  const nZSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-nz-slider]'));
  const nXInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-nx-input]'));
  const nYInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-ny-input]'));
  const nZInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-nz-input]'));
  const n1El = wrap.querySelector('[data-n="1"]');
  const n2El = wrap.querySelector('[data-n="2"]');
  const v1El = wrap.querySelector('[data-v="1"]');
  const v2El = wrap.querySelector('[data-v="2"]');
  const nXEl = wrap.querySelector('[data-n="X"]');
  const nYEl = wrap.querySelector('[data-n="Y"]');
  const nZEl = wrap.querySelector('[data-n="Z"]');
  const vXEl = wrap.querySelector('[data-v="X"]');
  const vYEl = wrap.querySelector('[data-v="Y"]');
  const vZEl = wrap.querySelector('[data-v="Z"]');
  const tirEl = wrap.querySelector('[data-tir]');
  const critRow = wrap.querySelector('[data-critical-row]');
  const critEl = wrap.querySelector('[data-critical]');
  const formulaEl = wrap.querySelector('.reflab-formula');

  /** @type {'two' | 'three'} */
  let layerMode = 'two';
  let n1Val = 1.00;
  let n2Val = 1.33;
  let theta1Deg = 40;
  let isTir = false;
  // Three-layer defaults ≈ textbook-style denser middle layer
  let nXVal = 1.20;
  let nYVal = 1.50;
  let nZVal = 1.00;
  let thetaXDeg = 35;
  /** @type {null | 'xy' | 'yz'} */
  let threeTirAt = null;
  // Shared real-time clock for both microscopic models (seconds)
  let microElapsedSec = 0;
  let microLastTs = 0;

  function n1() {
    return n1Val;
  }
  function n2() {
    return n2Val;
  }

  function getActiveMedium(n) {
    if (Math.abs(n - 1.0) < 0.005) return 'air';
    if (Math.abs(n - 1.33) < 0.005) return 'water';
    if (Math.abs(n - 1.5) < 0.005) return 'glass';
    return null;
  }

  function formatN(n) {
    return n.toFixed(2);
  }

  function formatV(n) {
    return (C_VACUUM / n).toFixed(2);
  }

  /** Format a positive ratio to 3 significant figures (e.g. 1.33 not 1.330). */
  function formatSig3(n) {
    if (n == null || !Number.isFinite(n)) return '—';
    return Number(n.toPrecision(3)).toString();
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function toDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  function criticalDeg() {
    if (n1() <= n2()) return null;
    const s = n2() / n1();
    if (s >= 1) return null;
    return toDeg(Math.asin(s));
  }

  /** @returns {{ tir: boolean, theta2: number | null }} */
  function solveFromTheta1(t1) {
    const s2 = (n1() / n2()) * Math.sin(toRad(t1));
    if (s2 > 1 + 1e-9) return { tir: true, theta2: null };
    if (s2 < -1) return { tir: true, theta2: null };
    return { tir: false, theta2: toDeg(Math.asin(Math.min(1, Math.max(-1, s2)))) };
  }

  /** @returns {{ tir: boolean, theta1: number | null }} */
  function solveFromTheta2(t2) {
    const s1 = (n2() / n1()) * Math.sin(toRad(t2));
    if (s1 > 1 + 1e-9) return { tir: true, theta1: null };
    return { tir: false, theta1: toDeg(Math.asin(Math.min(1, Math.max(-1, s1)))) };
  }

  function paintMediumChips() {
    const map = {
      '1': getActiveMedium(n1Val),
      '2': getActiveMedium(n2Val),
      X: getActiveMedium(nXVal),
      Y: getActiveMedium(nYVal),
      Z: getActiveMedium(nZVal),
    };
    Object.keys(map).forEach((side) => {
      wrap.querySelectorAll(`.reflab-chip[data-for="${side}"]`).forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-medium') === map[side]);
      });
    });
  }

  function fracHtml(num, den) {
    return `<span class="reflab-frac" aria-label="${num} / ${den}"><span class="reflab-frac-num">${num}</span><span class="reflab-frac-bar"></span><span class="reflab-frac-den">${den}</span></span>`;
  }

  /** @returns {{ tir: null | 'xy' | 'yz', thetaY: number | null, thetaZ: number | null }} */
  function solveThreeFromThetaX(tX) {
    const sY = (nXVal / nYVal) * Math.sin(toRad(tX));
    if (sY > 1 + 1e-9) return { tir: 'xy', thetaY: null, thetaZ: null };
    const tY = toDeg(Math.asin(Math.min(1, Math.max(-1, sY))));
    const sZ = (nYVal / nZVal) * Math.sin(toRad(tY));
    if (sZ > 1 + 1e-9) return { tir: 'yz', thetaY: tY, thetaZ: null };
    const tZ = toDeg(Math.asin(Math.min(1, Math.max(-1, sZ))));
    return { tir: null, thetaY: tY, thetaZ: tZ };
  }

  function applyLayerModeUI() {
    wrap.dataset.layers = layerMode;
    wrap.querySelectorAll('[data-mode-panel]').forEach((el) => {
      const mode = el.getAttribute('data-mode-panel');
      /** @type {HTMLElement} */ (el).hidden = mode !== layerMode;
    });
    wrap.querySelectorAll('[data-layer-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-layer-mode') === layerMode);
    });
    if (microOverlayY) microOverlayY.hidden = layerMode !== 'three';
    const title = t('tools.refraction.particleModel.title');
    if (layerMode === 'three') {
      if (microTitle1) microTitle1.textContent = `${title} · X`;
      if (microTitleY) microTitleY.textContent = `${title} · Y`;
      if (microTitle2) microTitle2.textContent = `${title} · Z`;
    } else {
      if (microTitle1) microTitle1.textContent = title;
      if (microTitle2) microTitle2.textContent = title;
    }
  }

  function updateReadouts() {
    if (n1El) n1El.textContent = formatN(n1());
    if (n2El) n2El.textContent = formatN(n2());
    if (v1El) v1El.textContent = formatV(n1());
    if (v2El) v2El.textContent = formatV(n2());
    if (nXEl) nXEl.textContent = formatN(nXVal);
    if (nYEl) nYEl.textContent = formatN(nYVal);
    if (nZEl) nZEl.textContent = formatN(nZVal);
    if (vXEl) vXEl.textContent = formatV(nXVal);
    if (vYEl) vYEl.textContent = formatV(nYVal);
    if (vZEl) vZEl.textContent = formatV(nZVal);

    if (n1Slider) n1Slider.value = String(n1Val);
    if (n2Slider) n2Slider.value = String(n2Val);
    if (nXSlider) nXSlider.value = String(nXVal);
    if (nYSlider) nYSlider.value = String(nYVal);
    if (nZSlider) nZSlider.value = String(nZVal);
    if (n1Input && document.activeElement !== n1Input) n1Input.value = n1Val.toFixed(2);
    if (n2Input && document.activeElement !== n2Input) n2Input.value = n2Val.toFixed(2);
    if (nXInput && document.activeElement !== nXInput) nXInput.value = nXVal.toFixed(2);
    if (nYInput && document.activeElement !== nYInput) nYInput.value = nYVal.toFixed(2);
    if (nZInput && document.activeElement !== nZInput) nZInput.value = nZVal.toFixed(2);

    if (layerMode === 'three') {
      const sol = solveThreeFromThetaX(thetaXDeg);
      threeTirAt = sol.tir;
      if (tirEl) {
        tirEl.hidden = !threeTirAt;
        if (threeTirAt === 'xy') tirEl.textContent = t('tools.refraction.tirXY');
        else if (threeTirAt === 'yz') tirEl.textContent = t('tools.refraction.tirYZ');
      }
      if (critRow) critRow.hidden = true;

      if (formulaEl) {
        const lawTitle = `${fracHtml('sin&nbsp;θ₁', 'sin&nbsp;θ₂')} = ${t('tools.refraction.snellConstant')}`;
        if (sol.tir === 'xy') {
          formulaEl.innerHTML = `
            <div class="reflab-formula-title">${lawTitle} · X→Y</div>
            <div class="reflab-formula-body reflab-formula-body--tir">${t('tools.refraction.tirXY')}
              <span>θ<sub>X</sub> = ${thetaXDeg.toFixed(1)}°</span>
            </div>`;
        } else if (sol.tir === 'yz') {
          const tY = sol.thetaY ?? 0;
          formulaEl.innerHTML = `
            <div class="reflab-formula-title">${lawTitle} · Y→Z</div>
            <div class="reflab-formula-body reflab-formula-body--tir">${t('tools.refraction.tirYZ')}
              <span>θ<sub>X</sub> = ${thetaXDeg.toFixed(1)}° · θ<sub>Y</sub> = ${tY.toFixed(1)}°</span>
            </div>`;
        } else {
          const pX = formatSig3(nXVal * Math.sin(toRad(thetaXDeg)));
          formulaEl.innerHTML = `
            <div class="reflab-formula-body reflab-formula-body--row">
              <span>n<sub>X</sub> sin θ<sub>X</sub> = n<sub>Y</sub> sin θ<sub>Y</sub> = n<sub>Z</sub> sin θ<sub>Z</sub></span>
              <span class="reflab-eq">=</span>
              <span class="reflab-eq-val">${pX}</span>
            </div>`;
        }
      }
      return;
    }

    // Two-layer readouts
    const tc = criticalDeg();
    if (critRow && critEl) {
      if (tc != null) {
        critRow.hidden = false;
        critEl.textContent = `${tc.toFixed(1)}°`;
      } else {
        critRow.hidden = true;
      }
    }
    if (tirEl) {
      tirEl.hidden = !isTir;
      tirEl.textContent = t('tools.refraction.tir');
    }

    if (formulaEl) {
      const r = solveFromTheta1(theta1Deg);
      if (isTir) {
        formulaEl.innerHTML = `
          <div class="reflab-formula-body reflab-formula-body--tir">
            ${t('tools.refraction.snellTir')}
            <span>θ₁ = ${theta1Deg.toFixed(1)}° · ${t('tools.refraction.canvas.reflected')}</span>
          </div>
        `;
      } else {
        const t2 = r.theta2 != null ? r.theta2 : 0;
        const sinI = Math.sin(toRad(theta1Deg));
        const sinR = Math.sin(toRad(t2));
        const ratio = Math.abs(sinR) < 1e-9 ? null : sinI / sinR;
        const nRatio = n2Val / n1Val;
        const ratioStr = formatSig3(ratio);
        formulaEl.innerHTML = `
          <div class="reflab-formula-body reflab-formula-body--row">
            ${fracHtml('sin&nbsp;θ₁', 'sin&nbsp;θ₂')}
            <span class="reflab-eq">=</span>
            ${fracHtml(`sin(${theta1Deg.toFixed(1)}°)`, `sin(${t2.toFixed(1)}°)`)}
            <span class="reflab-eq">=</span>
            <span class="reflab-eq-val">${ratioStr}</span>
            <span class="reflab-eq">=</span>
            ${fracHtml('n₂', 'n₁')}
            <span class="reflab-eq">=</span>
            ${fracHtml(formatN(n2Val), formatN(n1Val))}
            <span class="reflab-eq">=</span>
            <span class="reflab-eq-val">${formatSig3(nRatio)}</span>
          </div>
        `;
      }
    }
  }

  function syncSlidersFromState() {
    // Angles are canvas-drag only; n sliders synced in updateReadouts
  }

  let drawPending = false;
  function requestDraw() {
    if (drawPending) return;
    drawPending = true;
    requestAnimationFrame(() => {
      drawPending = false;
      draw();
    });
  }

  /** Shared macro-canvas geometry for draw + drag hit-testing (two-layer) */
  function getMacroGeometry() {
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const rayLen = Math.min(W, H) * 0.47;
    const iAngle = -Math.PI / 2 - toRad(theta1Deg);
    const ix = cx + Math.cos(iAngle) * rayLen;
    const iy = cy + Math.sin(iAngle) * rayLen;
    let tx = null;
    let ty = null;
    let rx = null;
    let ry = null;
    let t2 = null;
    if (isTir) {
      const rAngle = -Math.PI / 2 + toRad(theta1Deg);
      rx = cx + Math.cos(rAngle) * rayLen;
      ry = cy + Math.sin(rAngle) * rayLen;
    } else {
      const sol = solveFromTheta1(theta1Deg);
      t2 = sol.theta2 ?? 0;
      const tAngle = Math.PI / 2 - toRad(t2);
      tx = cx + Math.cos(tAngle) * rayLen;
      ty = cy + Math.sin(tAngle) * rayLen;
    }
    return { W, H, cx, cy, rayLen, ix, iy, tx, ty, rx, ry, t2 };
  }

  /**
   * Three horizontal layers X / Y / Z with dual interfaces.
   * @returns {{
   *   W: number, H: number, yXY: number, yYZ: number,
   *   x1: number, x2: number, ix: number, iy: number,
   *   zx: number | null, zy: number | null,
   *   rx: number | null, ry: number | null,
   *   thetaY: number | null, thetaZ: number | null,
   *   tir: null | 'xy' | 'yz', rayLen: number
   * }}
   */
  function getThreeLayerGeometry() {
    const W = canvas.width;
    const H = canvas.height;
    const yXY = H / 3;
    const yYZ = (2 * H) / 3;
    const hLayer = H / 3;
    const rayLen = Math.min(W, H) * 0.42;
    const x1 = W * 0.42;
    const sol = solveThreeFromThetaX(thetaXDeg);
    const tir = sol.tir;
    const iAngle = -Math.PI / 2 - toRad(thetaXDeg);
    // Keep incident start inside layer X
    const maxBack = Math.min(rayLen, (yXY - 16) / Math.max(0.08, Math.abs(Math.sin(iAngle))));
    const ix = x1 + Math.cos(iAngle) * maxBack;
    const iy = yXY + Math.sin(iAngle) * maxBack;

    let thetaY = sol.thetaY;
    let thetaZ = sol.thetaZ;
    let x2 = x1;
    let zx = null;
    let zy = null;
    let rx = null;
    let ry = null;

    if (tir === 'xy') {
      const rAngle = -Math.PI / 2 + toRad(thetaXDeg);
      const maxFwd = Math.min(rayLen, (yXY - 16) / Math.max(0.08, Math.abs(Math.sin(rAngle))));
      rx = x1 + Math.cos(rAngle) * maxFwd;
      ry = yXY + Math.sin(rAngle) * maxFwd;
    } else if (thetaY != null) {
      const dxY = hLayer * Math.tan(toRad(thetaY));
      x2 = x1 + dxY;
      if (tir === 'yz') {
        const rAngle = -Math.PI / 2 + toRad(thetaY);
        const maxFwd = Math.min(rayLen, (hLayer - 12) / Math.max(0.08, Math.abs(Math.sin(rAngle))));
        rx = x2 + Math.cos(rAngle) * maxFwd;
        ry = yYZ + Math.sin(rAngle) * maxFwd;
      } else if (thetaZ != null) {
        const tAngle = Math.PI / 2 - toRad(thetaZ);
        const maxFwd = Math.min(rayLen, (H - yYZ - 16) / Math.max(0.08, Math.sin(tAngle)));
        zx = x2 + Math.cos(tAngle) * maxFwd;
        zy = yYZ + Math.sin(tAngle) * maxFwd;
      }
    }

    return {
      W,
      H,
      yXY,
      yYZ,
      x1,
      x2,
      ix,
      iy,
      zx,
      zy,
      rx,
      ry,
      thetaY,
      thetaZ,
      tir,
      rayLen,
    };
  }

  function setLayerMode(mode) {
    if (mode !== 'two' && mode !== 'three') return;
    layerMode = mode;
    applyLayerModeUI();
    if (layerMode === 'three') applyFromThetaX();
    else applyFromTheta1();
    fitCanvases(true);
  }

  function applyFromThetaX() {
    const sol = solveThreeFromThetaX(thetaXDeg);
    threeTirAt = sol.tir;
    updateReadouts();
    requestDraw();
  }

  function distPointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 < 1e-9) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.min(1, Math.max(0, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function canvasPointerPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (ev.clientX - rect.left) * scaleX,
      y: (ev.clientY - rect.top) * scaleY,
    };
  }

  /** θ₁ from a point relative to the interface center (upper-left convention). */
  function theta1FromPoint(px, py, cx, cy) {
    const dx = px - cx;
    const dy = py - cy;
    // Angle from upward normal; left side → positive θ₁
    let deg = -toDeg(Math.atan2(dx, -dy));
    if (deg < 0) deg = 0;
    return Math.min(89, Math.max(0, deg));
  }

  /** θ₂ from a point in the lower half (downward normal). */
  function theta2FromPoint(px, py, cx, cy) {
    const dx = px - cx;
    const dy = py - cy;
    let deg = toDeg(Math.atan2(dx, dy));
    if (deg < 0) deg = 0;
    return Math.min(89, Math.max(0, deg));
  }

  const HIT_RAY = 16;
  let dragTarget = /** @type {null | 'incident' | 'refracted'} */ (null);

  function hitTestRays(px, py) {
    if (layerMode === 'three') {
      const g = getThreeLayerGeometry();
      const dInc = distPointToSegment(px, py, g.ix, g.iy, g.x1, g.yXY);
      if (dInc <= HIT_RAY) return 'incident';
      return null;
    }
    const g = getMacroGeometry();
    const dInc = distPointToSegment(px, py, g.ix, g.iy, g.cx, g.cy);
    let best = null;
    let bestDist = Infinity;
    if (dInc <= HIT_RAY) {
      best = 'incident';
      bestDist = dInc;
    }
    if (!isTir && g.tx != null && g.ty != null) {
      const dRef = distPointToSegment(px, py, g.cx, g.cy, g.tx, g.ty);
      if (dRef <= HIT_RAY && dRef < bestDist) {
        best = 'refracted';
        bestDist = dRef;
      }
    }
    return best;
  }

  function applyFromTheta1() {
    const r = solveFromTheta1(theta1Deg);
    isTir = r.tir;
    updateReadouts();
    syncSlidersFromState();
    requestDraw();
  }

  function applyFromTheta2(t2) {
    const r = solveFromTheta2(t2);
    if (r.tir || r.theta1 == null) {
      // Impossible from θ₂ side — keep θ₁-driven state
      applyFromTheta1();
      return;
    }
    theta1Deg = Math.min(89, Math.max(0, r.theta1));
    isTir = false;
    updateReadouts();
    requestDraw();
  }

  // Darker ray / label colors for light-mode canvas readability
  const COLOR_INCIDENT = '#b45309';
  const COLOR_REFRACTED = '#0e7490';
  const COLOR_REFLECTED = '#b91c1c';
  const COLOR_MID = '#5b21b6';
  const COLOR_AXIS = '#374151';
  const COLOR_LABEL = '#1a1c2c';

  function drawArrow(x1, y1, x2, y2, color, width = 2.5) {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len >= 1) {
      const ux = dx / len;
      const uy = dy / len;
      // Larger arrowhead centered on the mid-point of the ray
      const size = 26;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const tipX = mx + ux * (size * 0.35);
      const tipY = my + uy * (size * 0.35);
      const baseX = tipX - ux * size;
      const baseY = tipY - uy * size;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(baseX - uy * size * 0.55, baseY + ux * size * 0.55);
      ctx.lineTo(baseX + uy * size * 0.55, baseY - ux * size * 0.55);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTextWithOutline(text, x, y, textColor, align = 'center', baseline = 'middle', font = 'bold 15px system-ui, sans-serif') {
    // Canvas has no <sub>; draw θX / θY / θZ with a true subscript letter
    const thetaSub = /^θ([XYZ]) = (.+)$/.exec(text);
    if (thetaSub) {
      drawThetaSubOutline(thetaSub[1], thetaSub[2], x, y, textColor, align, baseline, font);
      return;
    }
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /** Draw "θₛ = …" with letter as a lowered, smaller subscript. */
  function drawThetaSubOutline(letter, rest, x, y, textColor, align, baseline, font) {
    ctx.save();
    ctx.font = font;
    const mainSize = parseFloat(font) || 15;
    const subFont = font.replace(/(\d+(?:\.\d+)?)px/, `${Math.max(9, mainSize * 0.72)}px`);
    const thetaW = ctx.measureText('θ').width;
    ctx.font = subFont;
    const letterW = ctx.measureText(letter).width;
    ctx.font = font;
    const restW = ctx.measureText(` = ${rest}`).width;
    const totalW = thetaW + letterW + restW;

    let left = x;
    if (align === 'center') left = x - totalW / 2;
    else if (align === 'right' || align === 'end') left = x - totalW;

    let baseY = y;
    // Approximate vertical shift for middle baseline
    const subDy = mainSize * 0.28;

    function strokeFill(str, px, py, fnt) {
      ctx.font = fnt;
      ctx.textAlign = 'left';
      ctx.textBaseline = baseline;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(str, px, py);
      ctx.fillStyle = textColor;
      ctx.fillText(str, px, py);
    }

    strokeFill('θ', left, baseY, font);
    strokeFill(letter, left + thetaW, baseY + subDy, subFont);
    strokeFill(` = ${rest}`, left + thetaW + letterW, baseY, font);
    ctx.restore();
  }

  function drawAngleArc(cx, cy, startDeg, endDeg, color, label) {
    const r = 55; // Larger radius for projector clarity
    const a0 = toRad(startDeg);
    const a1 = toRad(endDeg);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5; // Thicker line
    ctx.arc(cx, cy, r, a0, a1, endDeg < startDeg);
    ctx.stroke();

    // Place label near the light ray (end of arc) and offset into the open angle,
    // so it always moves with the ray — same idea as Incident / Refracted labels.
    const mid = (a0 + a1) / 2;
    const along = r + 18;
    const bx = cx + Math.cos(a1) * along;
    const by = cy + Math.sin(a1) * along;

    // Perpendicular to the ray; flip so the offset points into the angle wedge (toward mid)
    let px = Math.cos(a1 + Math.PI / 2);
    let py = Math.sin(a1 + Math.PI / 2);
    const towardMidX = Math.cos(mid);
    const towardMidY = Math.sin(mid);
    if (px * towardMidX + py * towardMidY < 0) {
      px = -px;
      py = -py;
    }

    const offset = 42;
    const textX = bx + px * offset;
    const textY = by + py * offset;
    drawTextWithOutline(label, textX, textY, color, 'center', 'middle', 'bold 15px system-ui, sans-serif');
  }

  function drawTwoLayers() {
    const g = getMacroGeometry();
    const { W, H, cx, cy, rayLen, ix, iy } = g;
    ctx.clearRect(0, 0, W, H);

    // Media tint: top = medium 1, bottom = medium 2
    ctx.fillStyle = mediumFill(n1Val, 0.22);
    ctx.fillRect(0, 0, W, cy);
    ctx.fillStyle = mediumFill(n2Val, 0.28);
    ctx.fillRect(0, cy, W, H - cy);

    // Interface
    ctx.beginPath();
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 3;
    ctx.moveTo(30, cy);
    ctx.lineTo(W - 30, cy);
    ctx.stroke();
    drawTextWithOutline(t('tools.refraction.canvas.interface'), W / 2 + 24, cy - 12, COLOR_LABEL, 'start', 'bottom', 'bold 14px system-ui, sans-serif');

    // Normal (dashed vertical)
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 2.5;
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, H - 20);
    ctx.stroke();
    ctx.setLineDash([]);
    drawTextWithOutline(t('tools.refraction.canvas.normal'), cx + 10, 78, COLOR_LABEL, 'start', 'alphabetic', 'bold 14px system-ui, sans-serif');

    drawArrow(ix, iy, cx, cy, COLOR_INCIDENT, 5.5);

    const labelDist = rayLen * 0.65;

    if (isTir) {
      const rAngle = -Math.PI / 2 + toRad(theta1Deg);
      drawArrow(cx, cy, g.rx, g.ry, COLOR_REFLECTED, 5.5);

      const perpAngleR = rAngle + Math.PI / 2;
      const lrx = cx + Math.cos(rAngle) * labelDist + Math.cos(perpAngleR) * 38;
      const lry = cy + Math.sin(rAngle) * labelDist + Math.sin(perpAngleR) * 38;
      drawTextWithOutline(t('tools.refraction.canvas.reflected'), lrx, lry, COLOR_REFLECTED, 'center', 'middle', 'bold 15px system-ui, sans-serif');

      drawAngleArc(cx, cy, -90, -90 - theta1Deg, COLOR_INCIDENT, `θ₁ = ${theta1Deg.toFixed(1)}°`);
      drawAngleArc(cx, cy, -90, -90 + theta1Deg, COLOR_REFLECTED, `θ₁ = ${theta1Deg.toFixed(1)}°`);
    } else {
      const t2 = g.t2 ?? 0;
      const tAngle = Math.PI / 2 - toRad(t2);
      drawArrow(cx, cy, g.tx, g.ty, COLOR_REFRACTED, 5.5);

      const perpAngleT = tAngle - Math.PI / 2;
      const ltx = cx + Math.cos(tAngle) * labelDist + Math.cos(perpAngleT) * 38;
      const lty = cy + Math.sin(tAngle) * labelDist + Math.sin(perpAngleT) * 38;
      drawTextWithOutline(t('tools.refraction.canvas.refracted'), ltx, lty, COLOR_REFRACTED, 'center', 'middle', 'bold 15px system-ui, sans-serif');

      drawAngleArc(cx, cy, -90, -90 - theta1Deg, COLOR_INCIDENT, `θ₁ = ${theta1Deg.toFixed(1)}°`);
      drawAngleArc(cx, cy, 90, 90 - t2, COLOR_REFRACTED, `θ₂ = ${t2.toFixed(1)}°`);
    }

    const iAngle = -Math.PI / 2 - toRad(theta1Deg);
    const perpAngleI = iAngle - Math.PI / 2;
    const lix = cx + Math.cos(iAngle) * labelDist + Math.cos(perpAngleI) * 38;
    const liy = cy + Math.sin(iAngle) * labelDist + Math.sin(perpAngleI) * 38;
    drawTextWithOutline(t('tools.refraction.canvas.incident'), lix, liy, COLOR_INCIDENT, 'center', 'middle', 'bold 15px system-ui, sans-serif');
  }

  function drawDashedNormal(nx, y0, y1) {
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 2;
    ctx.moveTo(nx, y0);
    ctx.lineTo(nx, y1);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawThreeLayers() {
    const g = getThreeLayerGeometry();
    const { W, H, yXY, yYZ, x1, x2, ix, iy } = g;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = mediumFill(nXVal, 0.2);
    ctx.fillRect(0, 0, W, yXY);
    ctx.fillStyle = mediumFill(nYVal, 0.26);
    ctx.fillRect(0, yXY, W, yYZ - yXY);
    ctx.fillStyle = mediumFill(nZVal, 0.22);
    ctx.fillRect(0, yYZ, W, H - yYZ);

    // Interfaces
    ctx.beginPath();
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 3;
    ctx.moveTo(24, yXY);
    ctx.lineTo(W - 24, yXY);
    ctx.moveTo(24, yYZ);
    ctx.lineTo(W - 24, yYZ);
    ctx.stroke();

    drawTextWithOutline('X', 28, yXY / 2, COLOR_LABEL, 'start', 'middle', 'bold 18px system-ui, sans-serif');
    drawTextWithOutline('Y', 28, (yXY + yYZ) / 2, COLOR_LABEL, 'start', 'middle', 'bold 18px system-ui, sans-serif');
    drawTextWithOutline('Z', 28, (yYZ + H) / 2, COLOR_LABEL, 'start', 'middle', 'bold 18px system-ui, sans-serif');

    // Normals at each interface hit
    drawDashedNormal(x1, Math.max(12, yXY - H * 0.28), Math.min(H - 12, yXY + H * 0.28));
    if (g.tir !== 'xy') {
      drawDashedNormal(x2, Math.max(12, yYZ - H * 0.28), Math.min(H - 12, yYZ + H * 0.28));
    }
    drawTextWithOutline(t('tools.refraction.canvas.normal'), x1 + 8, Math.max(78, yXY - H * 0.18), COLOR_LABEL, 'start', 'alphabetic', 'bold 13px system-ui, sans-serif');

    // Incident in X
    drawArrow(ix, iy, x1, yXY, COLOR_INCIDENT, 5);
    drawAngleArc(x1, yXY, -90, -90 - thetaXDeg, COLOR_INCIDENT, `θX = ${thetaXDeg.toFixed(1)}°`);

    if (g.tir === 'xy') {
      drawArrow(x1, yXY, g.rx, g.ry, COLOR_REFLECTED, 5);
      drawAngleArc(x1, yXY, -90, -90 + thetaXDeg, COLOR_REFLECTED, `θX = ${thetaXDeg.toFixed(1)}°`);
      drawTextWithOutline(t('tools.refraction.canvas.reflected'), (x1 + (g.rx ?? x1)) / 2 + 28, (yXY + (g.ry ?? yXY)) / 2, COLOR_REFLECTED, 'center', 'middle', 'bold 14px system-ui, sans-serif');
      return;
    }

    const tY = g.thetaY ?? 0;
    drawArrow(x1, yXY, x2, yYZ, COLOR_MID, 5);
    drawAngleArc(x1, yXY, 90, 90 - tY, COLOR_MID, `θY = ${tY.toFixed(1)}°`);

    if (g.tir === 'yz') {
      drawArrow(x2, yYZ, g.rx, g.ry, COLOR_REFLECTED, 5);
      drawAngleArc(x2, yYZ, -90, -90 + tY, COLOR_REFLECTED, `θY = ${tY.toFixed(1)}°`);
      drawTextWithOutline(t('tools.refraction.canvas.reflected'), (x2 + (g.rx ?? x2)) / 2 + 28, (yYZ + (g.ry ?? yYZ)) / 2, COLOR_REFLECTED, 'center', 'middle', 'bold 14px system-ui, sans-serif');
      return;
    }

    const tZ = g.thetaZ ?? 0;
    drawArrow(x2, yYZ, g.zx, g.zy, COLOR_REFRACTED, 5);
    drawAngleArc(x2, yYZ, -90, -90 - tY, COLOR_MID, `θY = ${tY.toFixed(1)}°`);
    drawAngleArc(x2, yYZ, 90, 90 - tZ, COLOR_REFRACTED, `θZ = ${tZ.toFixed(1)}°`);
  }

  function draw() {
    if (layerMode === 'three') drawThreeLayers();
    else drawTwoLayers();
  }

  function seededRandom(s) {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  /** Path length in pixels along a polyline. */
  function pathLength(path) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
    }
    return total;
  }

  /** Position at arc-length distance along path (wraps). */
  function getPathPosByDistance(path, distance) {
    if (!path || path.length < 2) return path?.[0] || { x: 0, y: 0, segmentIndex: 0 };
    const total = pathLength(path);
    if (total < 1e-6) return { ...path[0], segmentIndex: 0 };
    let d = ((distance % total) + total) % total;
    let accumulated = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const len = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
      if (d <= accumulated + len || i === path.length - 2) {
        const t = len < 1e-9 ? 0 : (d - accumulated) / len;
        return {
          x: path[i].x + (path[i + 1].x - path[i].x) * t,
          y: path[i].y + (path[i + 1].y - path[i].y) * t,
          segmentIndex: i,
        };
      }
      accumulated += len;
    }
    return { ...path[path.length - 1], segmentIndex: path.length - 2 };
  }

  /**
   * Forward-only scatter paths. Denser media → more waypoints, but all rays exit bottom.
   * Interaction count scales continuously with n (no bounce-back).
   */
  function generateBoxRays(bx, by, bw, bh, nVal, side) {
    const baseAngle = toRad(16);
    const dx = bh * Math.tan(baseAngle);
    const starts = [bx + bw * 0.18, bx + bw * 0.45, bx + bw * 0.72];

    // More interactions in optically denser media (continuous in n)
    const scatterCount = Math.max(0, Math.round((nVal - 1) * 8));

    function buildRay(x0, rayIdx) {
      const pts = [{ x: x0, y: by }];
      if (scatterCount === 0) {
        pts.push({ x: x0 + dx, y: by + bh });
        return pts;
      }
      for (let k = 1; k <= scatterCount; k++) {
        const frac = k / (scatterCount + 1);
        const seed = side * 1000 + rayIdx * 97 + k * 13 + Math.round(nVal * 100);
        const wobble = (seededRandom(seed) - 0.5) * (10 + nVal * 14);
        const sign = k % 2 === 0 ? 1 : -1;
        pts.push({
          x: x0 + dx * frac + sign * wobble,
          y: by + bh * frac,
        });
      }
      pts.push({ x: x0 + dx, y: by + bh });
      // Clamp x inside box with padding
      for (let i = 1; i < pts.length; i++) {
        pts[i].x = Math.min(bx + bw - 6, Math.max(bx + 6, pts[i].x));
      }
      return pts;
    }

    return {
      rays: starts.map((x0, i) => buildRay(x0, i)),
    };
  }

  function drawSingleParticleModel(canvas, ctx, nVal, side, primaryColor) {
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const boxW = W * 0.94;
    const boxH = H * 0.86;
    const boxY = H * 0.06;
    const boxX = W * 0.03;

    ctx.fillStyle = mediumFill(nVal, side === 1 ? 0.18 : 0.24);
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#3f4a66';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Background molecules — denser packing for higher n
    drawBoxParticles(boxX, boxY, boxW, boxH, nVal, side === 1 ? 'rgba(180, 83, 9, 0.35)' : 'rgba(14, 116, 144, 0.35)');

    const boxData = generateBoxRays(boxX, boxY, boxW, boxH, nVal, side);
    const rays = boxData.rays;

    // Draw ray polylines (all forward transmission)
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    rays.forEach((ray) => {
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.moveTo(ray[0].x, ray[0].y);
      for (let i = 1; i < ray.length; i++) ctx.lineTo(ray[i].x, ray[i].y);
      ctx.stroke();
    });

    // Interaction markers at intermediate waypoints (not bounce-backs)
    rays.forEach((ray) => {
      for (let i = 1; i < ray.length - 1; i++) {
        const pt = ray[i];
        ctx.beginPath();
        ctx.fillStyle = COLOR_REFLECTED;
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Strict v = c/n: vacuum baseline ≈ one box-height per second
    const speed = 1.0 / nVal;
    const V0_PX = boxH; // pixels/sec at n = 1
    const vPx = V0_PX * speed;
    const distance = microElapsedSec * vPx;

    // Photons advance by arc length (same clock → denser travels less)
    rays.forEach((ray) => {
      const p = getPathPosByDistance(ray, distance);
      drawSinglePhoton(p.x, p.y, primaryColor);
    });

    // Wavefront ticks along the middle ray (same physical speed)
    if (rays[1] && rays[1].length >= 2) {
      const mid = rays[1];
      const midLen = pathLength(mid);
      const spacing = Math.max(28, midLen / 3.5);
      for (let k = 0; k < 3; k++) {
        const s = (distance + k * spacing) % midLen;
        const p = getPathPosByDistance(mid, s);
        // Estimate local tangent
        const p2 = getPathPosByDistance(mid, s + 2);
        const tx = p2.x - p.x;
        const ty = p2.y - p.y;
        const tlen = Math.hypot(tx, ty) || 1;
        const nx = -ty / tlen;
        const ny = tx / tlen;
        const hw = 7;
        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.55;
        ctx.moveTo(p.x - nx * hw, p.y - ny * hw);
        ctx.lineTo(p.x + nx * hw, p.y + ny * hw);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    function drawSinglePhoton(x, y, color) {
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    function drawBoxParticles(bx, by, bw, bh, n, color) {
      const spacing = 36 / (n * n);
      ctx.fillStyle = color;
      const cols = Math.ceil(bw / spacing) + 1;
      const rows = Math.ceil(bh / spacing) + 1;
      const jigglePhase = microElapsedSec * 60; // smooth vs frame count

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const gridX = bx + c * spacing;
          const gridY = by + r * spacing;
          const seed = c * 17 + r * 31 + (side === 2 ? 500 : 0);
          const randX = seededRandom(seed) * 0.3 - 0.15;
          const randY = seededRandom(seed + 1) * 0.3 - 0.15;
          const jiggleSpeed = 0.04 + seededRandom(seed + 2) * 0.04;
          const jiggleAmp = 0.8 + seededRandom(seed + 3) * 0.8;
          const jiggleX = Math.sin(jigglePhase * jiggleSpeed + seed) * jiggleAmp;
          const jiggleY = Math.cos(jigglePhase * jiggleSpeed + seed * 1.3) * jiggleAmp;
          const x = gridX + randX * spacing + jiggleX;
          const y = gridY + randY * spacing + jiggleY;
          if (x >= bx + 4 && x <= bx + bw - 4 && y >= by + 4 && y <= by + bh - 4) {
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }

  function drawParticleModel() {
    if (layerMode === 'three') {
      drawSingleParticleModel(particleCanvas1, ctxP1, nXVal, 1, COLOR_INCIDENT);
      if (particleCanvasY && ctxPY) {
        drawSingleParticleModel(particleCanvasY, ctxPY, nYVal, 3, COLOR_MID);
      }
      drawSingleParticleModel(particleCanvas2, ctxP2, nZVal, 2, COLOR_REFRACTED);
    } else {
      drawSingleParticleModel(particleCanvas1, ctxP1, n1Val, 1, COLOR_INCIDENT);
      drawSingleParticleModel(particleCanvas2, ctxP2, n2Val, 2, COLOR_REFRACTED);
    }
  }

  function mediumFill(n, alpha) {
    if (n < 1.15) return `rgba(120, 160, 220, ${alpha})`;
    if (n < 1.42) return `rgba(40, 120, 200, ${alpha})`;
    return `rgba(160, 200, 230, ${alpha})`;
  }

  // Events
  wrap.querySelectorAll('[data-layer-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-layer-mode');
      if (mode === 'two' || mode === 'three') setLayerMode(mode);
    });
  });

  wrap.querySelectorAll('.reflab-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const side = btn.getAttribute('data-for');
      const id = btn.getAttribute('data-medium');
      if (!id || !MEDIA[id]) return;
      if (side === '1') n1Val = MEDIA[id].n;
      else if (side === '2') n2Val = MEDIA[id].n;
      else if (side === 'X') nXVal = MEDIA[id].n;
      else if (side === 'Y') nYVal = MEDIA[id].n;
      else if (side === 'Z') nZVal = MEDIA[id].n;
      paintMediumChips();
      if (side === 'X' || side === 'Y' || side === 'Z') applyFromThetaX();
      else applyFromTheta1();
    });
  });

  function bindNControl(slider, input, getVal, setVal, onChange, fallback) {
    if (slider) {
      slider.addEventListener('input', () => {
        setVal(Number(slider.value));
        paintMediumChips();
        onChange();
      });
      slider.addEventListener('change', () => {
        setVal(Number(slider.value));
        paintMediumChips();
        onChange();
      });
    }
    if (input) {
      input.addEventListener('input', () => {
        let val = Number(input.value);
        if (isNaN(val)) return;
        val = Math.min(2.0, Math.max(1.0, val));
        setVal(val);
        paintMediumChips();
        onChange();
      });
      input.addEventListener('change', () => {
        let val = Number(input.value);
        if (isNaN(val)) val = fallback;
        val = Math.min(2.0, Math.max(1.0, val));
        setVal(val);
        input.value = val.toFixed(2);
        paintMediumChips();
        onChange();
      });
    }
  }

  bindNControl(n1Slider, n1Input, () => n1Val, (v) => { n1Val = v; }, applyFromTheta1, 1.0);
  bindNControl(n2Slider, n2Input, () => n2Val, (v) => { n2Val = v; }, applyFromTheta1, 1.33);
  bindNControl(nXSlider, nXInput, () => nXVal, (v) => { nXVal = v; }, applyFromThetaX, 1.2);
  bindNControl(nYSlider, nYInput, () => nYVal, (v) => { nYVal = v; }, applyFromThetaX, 1.5);
  bindNControl(nZSlider, nZInput, () => nZVal, (v) => { nZVal = v; }, applyFromThetaX, 1.0);

  wrap.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (layerMode === 'three') {
      nXVal = 1.2;
      nYVal = 1.5;
      nZVal = 1.0;
      thetaXDeg = 35;
      paintMediumChips();
      applyFromThetaX();
    } else {
      n1Val = 1.0;
      n2Val = 1.33;
      theta1Deg = 40;
      paintMediumChips();
      applyFromTheta1();
    }
  });

  // Drag rays on the macro canvas to change angles
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'default';

  function updateCanvasCursor(hit) {
    if (dragTarget) {
      canvas.style.cursor = 'grabbing';
    } else if (hit) {
      canvas.style.cursor = 'grab';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  function onRayPointerDown(ev) {
    if (ev.button != null && ev.button !== 0) return;
    const { x, y } = canvasPointerPos(ev);
    const hit = hitTestRays(x, y);
    if (!hit) return;
    dragTarget = hit;
    canvas.setPointerCapture(ev.pointerId);
    updateCanvasCursor(hit);
    requestDraw();
    ev.preventDefault();
  }

  function onRayPointerMove(ev) {
    const { x, y } = canvasPointerPos(ev);
    if (!dragTarget) {
      updateCanvasCursor(hitTestRays(x, y));
      return;
    }
    if (layerMode === 'three') {
      if (dragTarget === 'incident') {
        const g = getThreeLayerGeometry();
        const next = theta1FromPoint(x, y, g.x1, g.yXY);
        if (Math.abs(next - thetaXDeg) >= 0.05) {
          thetaXDeg = Math.round(next * 10) / 10;
          applyFromThetaX();
        }
      }
    } else {
      const g = getMacroGeometry();
      if (dragTarget === 'incident') {
        const next = theta1FromPoint(x, y, g.cx, g.cy);
        if (Math.abs(next - theta1Deg) >= 0.05) {
          theta1Deg = Math.round(next * 10) / 10;
          applyFromTheta1();
        }
      } else if (dragTarget === 'refracted' && !isTir) {
        const next = theta2FromPoint(x, y, g.cx, g.cy);
        applyFromTheta2(Math.round(next * 10) / 10);
      }
    }
    updateCanvasCursor(dragTarget);
    ev.preventDefault();
  }

  function onRayPointerUp(ev) {
    if (!dragTarget) return;
    dragTarget = null;
    try {
      canvas.releasePointerCapture(ev.pointerId);
    } catch (_) {
      /* already released */
    }
    const { x, y } = canvasPointerPos(ev);
    updateCanvasCursor(hitTestRays(x, y));
    requestDraw();
  }

  canvas.addEventListener('pointerdown', onRayPointerDown);
  canvas.addEventListener('pointermove', onRayPointerMove);
  canvas.addEventListener('pointerup', onRayPointerUp);
  canvas.addEventListener('pointercancel', onRayPointerUp);
  canvas.addEventListener('pointerleave', () => {
    if (!dragTarget) updateCanvasCursor(null);
  });

  function fitParticleCanvas(el, particleCanvas) {
    if (!el || !particleCanvas) return false;
    const w = Math.max(160, el.clientWidth - 8);
    const h = Math.round(w * (210 / 320));
    if (particleCanvas.width !== w || particleCanvas.height !== h) {
      particleCanvas.width = w;
      particleCanvas.height = h;
      return true;
    }
    return false;
  }

  function fitCanvases(forceDraw = false) {
    const viz = wrap.querySelector('.reflab-viz');
    let macroChanged = false;
    if (viz) {
      const w = Math.max(320, viz.clientWidth - 20);
      const h = Math.round(w * (440 / 720));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        macroChanged = true;
      }
    }
    const micro1 = wrap.querySelector('.reflab-micro-box[data-side="1"]');
    const micro2 = wrap.querySelector('.reflab-micro-box[data-side="2"]');
    const microY = wrap.querySelector('.reflab-micro-box[data-side="Y"]');
    const p1Changed = fitParticleCanvas(micro1, particleCanvas1);
    const p2Changed = fitParticleCanvas(micro2, particleCanvas2);
    const pYChanged = fitParticleCanvas(microY, particleCanvasY);
    if (forceDraw || macroChanged) requestDraw();
    if (forceDraw || p1Changed || p2Changed || pYChanged) drawParticleModel();
  }

  paintMediumChips();
  applyLayerModeUI();
  applyFromTheta1();

  root.appendChild(wrap);

  // Animation loop — shared real-time clock, v = c/n arc-length advance
  let animId = null;
  function tick(ts) {
    if (!wrap.isConnected) {
      if (animId) cancelAnimationFrame(animId);
      return;
    }
    if (!microLastTs) microLastTs = ts;
    const dt = Math.min(0.05, (ts - microLastTs) / 1000);
    microLastTs = ts;
    microElapsedSec += dt;
    drawParticleModel();
    animId = requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Fit canvases to container / overlay width
  const ro = new ResizeObserver(() => {
    fitCanvases(false);
  });
  ro.observe(wrap);
  const vizEl = wrap.querySelector('.reflab-viz');
  if (vizEl) ro.observe(vizEl);
  wrap.querySelectorAll('.reflab-micro-overlay').forEach((el) => ro.observe(el));
  fitCanvases(true);
}

