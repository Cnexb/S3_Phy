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
        <div class="reflab-viz-actions">
          <button type="button" class="reflab-controls-toggle" data-toggle-controls aria-pressed="false">${t('tools.refraction.hideControls')}</button>
          <button type="button" class="reflab-reset" data-reset>${t('tools.refraction.reset')}</button>
        </div>
        <canvas class="reflab-canvas" width="720" height="440" aria-label="${t('tools.refraction.title')}"></canvas>

        <!-- Two-layer HUDs -->
        <div class="reflab-mode-panel" data-mode-panel="two">
          <div class="reflab-canvas-hud reflab-canvas-hud--incident">
            <div class="reflab-hud-label">${t('tools.refraction.n1')}</div>
            <div class="reflab-chips" data-side="1">${mediumChips('1')}</div>
            <div class="reflab-slider-row reflab-angle-row">
              <span class="reflab-angle-label">θ₁</span>
              <input type="range" data-theta1-slider min="0" max="89" step="0.1" value="40" aria-label="${t('tools.refraction.angleI')}" />
              <input type="number" data-theta1-input min="0" max="89" step="0.1" value="40.0" class="reflab-num-input" aria-label="${t('tools.refraction.angleI')}" />
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--refracted">
            <div class="reflab-hud-label">${t('tools.refraction.n2')}</div>
            <div class="reflab-chips" data-side="2">${mediumChips('2')}</div>
            <div class="reflab-slider-row reflab-angle-row">
              <span class="reflab-angle-label">θ₂</span>
              <input type="range" data-theta2-slider min="0" max="89" step="0.1" value="28.9" aria-label="${t('tools.refraction.angleR')}" />
              <input type="number" data-theta2-input min="0" max="89" step="0.1" value="28.9" class="reflab-num-input" aria-label="${t('tools.refraction.angleR')}" />
            </div>
          </div>
        </div>

        <!-- Three-layer HUDs (X / Y / Z) -->
        <div class="reflab-mode-panel" data-mode-panel="three" hidden>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerX">
            <div class="reflab-hud-label">${t('tools.refraction.layer.X')}</div>
            <div class="reflab-chips" data-side="X">${mediumChips('X')}</div>
            <div class="reflab-slider-row reflab-angle-row">
              <span class="reflab-angle-label">θX</span>
              <input type="range" data-thetax-slider min="0" max="89" step="0.1" value="35" aria-label="${t('tools.refraction.angleX')}" />
              <input type="number" data-thetax-input min="0" max="89" step="0.1" value="35.0" class="reflab-num-input" aria-label="${t('tools.refraction.angleX')}" />
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerY">
            <div class="reflab-hud-label">${t('tools.refraction.layer.Y')}</div>
            <div class="reflab-chips" data-side="Y">${mediumChips('Y')}</div>
            <div class="reflab-slider-row reflab-angle-row">
              <span class="reflab-angle-label">θY</span>
              <input type="range" data-thetay-slider min="0" max="89" step="0.1" value="27.2" aria-label="${t('tools.refraction.angleY')}" />
              <input type="number" data-thetay-input min="0" max="89" step="0.1" value="27.2" class="reflab-num-input" aria-label="${t('tools.refraction.angleY')}" />
            </div>
          </div>
          <div class="reflab-canvas-hud reflab-canvas-hud--layerZ">
            <div class="reflab-hud-label">${t('tools.refraction.layer.Z')}</div>
            <div class="reflab-chips" data-side="Z">${mediumChips('Z')}</div>
            <div class="reflab-slider-row reflab-angle-row">
              <span class="reflab-angle-label">θZ</span>
              <input type="range" data-thetaz-slider min="0" max="89" step="0.1" value="43.4" aria-label="${t('tools.refraction.angleZ')}" />
              <input type="number" data-thetaz-input min="0" max="89" step="0.1" value="43.4" class="reflab-num-input" aria-label="${t('tools.refraction.angleZ')}" />
            </div>
          </div>
        </div>

        <div class="reflab-micro-overlay reflab-micro-overlay--1">
          <div class="reflab-micro-box" data-side="1">
            <canvas class="reflab-particle-canvas-1" width="640" height="420" aria-label="${t('tools.refraction.particleModel.title')}"></canvas>
          </div>
        </div>
        <div class="reflab-micro-overlay reflab-micro-overlay--3" hidden>
          <div class="reflab-micro-box" data-side="Y">
            <canvas class="reflab-particle-canvas-Y" width="640" height="420" aria-label="${t('tools.refraction.particleModel.title')}"></canvas>
          </div>
        </div>
        <div class="reflab-micro-overlay reflab-micro-overlay--2">
          <div class="reflab-micro-box" data-side="2">
            <canvas class="reflab-particle-canvas-2" width="640" height="420" aria-label="${t('tools.refraction.particleModel.title')}"></canvas>
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
  const particleCanvas1 = /** @type {HTMLCanvasElement | null} */ (wrap.querySelector('.reflab-particle-canvas-1'));
  const ctxP1 = particleCanvas1 ? /** @type {CanvasRenderingContext2D} */ (particleCanvas1.getContext('2d')) : null;
  const particleCanvas2 = /** @type {HTMLCanvasElement | null} */ (wrap.querySelector('.reflab-particle-canvas-2'));
  const ctxP2 = particleCanvas2 ? /** @type {CanvasRenderingContext2D} */ (particleCanvas2.getContext('2d')) : null;
  const particleCanvasY = /** @type {HTMLCanvasElement | null} */ (wrap.querySelector('.reflab-particle-canvas-Y'));
  const ctxPY = particleCanvasY ? /** @type {CanvasRenderingContext2D} */ (particleCanvasY.getContext('2d')) : null;
  const microOverlayY = /** @type {HTMLElement | null} */ (wrap.querySelector('.reflab-micro-overlay--3'));
  const theta1Slider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-theta1-slider]'));
  const theta2Slider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-theta2-slider]'));
  const theta1Input = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-theta1-input]'));
  const theta2Input = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-theta2-input]'));
  const thetaXSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetax-slider]'));
  const thetaYSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetay-slider]'));
  const thetaZSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetaz-slider]'));
  const thetaXInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetax-input]'));
  const thetaYInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetay-input]'));
  const thetaZInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-thetaz-input]'));
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
  let nXVal = 1.33;
  let nYVal = 1.50;
  let nZVal = 1.00;
  let thetaXDeg = 35;
  /** Logical canvas size in CSS pixels. The bitmap is this size times the screen density. */
  let viewW = 720;
  let viewH = 440;
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

  function mediumCaption(n) {
    const id = getActiveMedium(n);
    const index = `n = ${formatN(n)}`;
    if (!id) return index;
    return `${t(`tools.refraction.medium.${id}`)}   ${index}`;
  }

  /** Backing-store scale. At least 2× so the diagram and light animation stay sharp. */
  function bitmapScale() {
    return Math.min(3, Math.max(2, window.devicePixelRatio || 1));
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

  /** Largest angle (0–89) whose sine stays within limitRatio. */
  function maxAngleDeg(limitRatio) {
    if (!(limitRatio > 0)) return 0;
    if (limitRatio >= 1) return 89;
    const raw = toDeg(Math.asin(Math.min(1, limitRatio)));
    const floored = Math.floor((raw - 1e-6) * 10) / 10;
    return Math.min(89, Math.max(0, floored));
  }

  function clampAngle(deg, maxDeg) {
    const max = Math.min(89, Math.max(0, maxDeg));
    let v = Number(deg);
    if (!Number.isFinite(v)) v = 0;
    v = Math.min(max, Math.max(0, v));
    return Math.round(v * 10) / 10;
  }

  function maxTheta1Deg() {
    return maxAngleDeg(n2() / n1());
  }

  function maxTheta2Deg() {
    return maxAngleDeg(n1() / n2());
  }

  /** Largest θX that still refracts through both interfaces. */
  function maxThetaXDeg() {
    return maxAngleDeg(Math.min(nYVal, nZVal) / nXVal);
  }

  function maxThetaYDeg() {
    return maxAngleDeg(Math.min(nXVal, nZVal) / nYVal);
  }

  function maxThetaZDeg() {
    return maxAngleDeg(Math.min(nXVal, nYVal) / nZVal);
  }

  function syncAngleControl(slider, input, deg, maxDeg, enabled) {
    const max = Math.min(89, Math.max(0, maxDeg));
    const shown = deg == null || !enabled ? '' : clampAngle(deg, max).toFixed(1);
    if (slider) {
      slider.max = max.toFixed(1);
      slider.disabled = !enabled;
      if (!enabled) slider.value = '0';
      else if (shown !== '' && document.activeElement !== slider) slider.value = shown;
    }
    if (input) {
      input.max = max.toFixed(1);
      input.disabled = !enabled;
      input.placeholder = enabled ? '' : '—';
      input.title = enabled ? '' : t('tools.refraction.angleLocked');
      if (document.activeElement !== input) input.value = shown;
    }
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

    const two = solveFromTheta1(theta1Deg);
    syncAngleControl(theta1Slider, theta1Input, theta1Deg, maxTheta1Deg(), true);
    syncAngleControl(theta2Slider, theta2Input, two.tir ? null : two.theta2, maxTheta2Deg(), !two.tir);

    const three = solveThreeFromThetaX(thetaXDeg);
    syncAngleControl(thetaXSlider, thetaXInput, thetaXDeg, maxThetaXDeg(), true);
    syncAngleControl(thetaYSlider, thetaYInput, three.thetaY, maxThetaYDeg(), three.tir !== 'xy');
    syncAngleControl(thetaZSlider, thetaZInput, three.thetaZ, maxThetaZDeg(), three.tir == null);

    if (layerMode === 'three') {
      threeTirAt = solveThreeFromThetaX(thetaXDeg).tir;
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
    const W = viewW;
    const H = viewH;
    const cx = W / 2;
    const cy = H / 2;
    const rayLen = Math.min(W, H) * 0.42;
    const margin = 28;
    function fitEnd(x1, y1, ang) {
      const x2 = x1 + Math.cos(ang) * rayLen;
      const y2 = y1 + Math.sin(ang) * rayLen;
      const dx = x2 - x1;
      const dy = y2 - y1;
      let t = 1;
      if (x2 < margin && dx !== 0) t = Math.min(t, (margin - x1) / dx);
      if (x2 > W - margin && dx !== 0) t = Math.min(t, (W - margin - x1) / dx);
      if (y2 < margin && dy !== 0) t = Math.min(t, (margin - y1) / dy);
      if (y2 > H - margin && dy !== 0) t = Math.min(t, (H - margin - y1) / dy);
      t = Math.max(0.2, Math.min(1, t));
      return { x: x1 + dx * t, y: y1 + dy * t };
    }
    const iAngle = -Math.PI / 2 - toRad(theta1Deg);
    const incident = fitEnd(cx, cy, iAngle);
    const ix = incident.x;
    const iy = incident.y;
    let tx = null;
    let ty = null;
    let rx = null;
    let ry = null;
    let t2 = null;
    if (isTir) {
      const reflected = fitEnd(cx, cy, -Math.PI / 2 + toRad(theta1Deg));
      rx = reflected.x;
      ry = reflected.y;
    } else {
      const sol = solveFromTheta1(theta1Deg);
      t2 = sol.theta2 ?? 0;
      const refracted = fitEnd(cx, cy, Math.PI / 2 - toRad(t2));
      tx = refracted.x;
      ty = refracted.y;
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
    const W = viewW;
    const H = viewH;
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
    thetaXDeg = clampAngle(thetaXDeg, maxThetaXDeg());
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
    const scaleX = viewW / Math.max(1, rect.width);
    const scaleY = viewH / Math.max(1, rect.height);
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
    theta1Deg = clampAngle(theta1Deg, maxTheta1Deg());
    const r = solveFromTheta1(theta1Deg);
    isTir = r.tir;
    updateReadouts();
    syncSlidersFromState();
    requestDraw();
  }

  function applyFromTheta2(t2) {
    const clamped = clampAngle(t2, maxTheta2Deg());
    const r = solveFromTheta2(clamped);
    if (r.tir || r.theta1 == null) {
      applyFromTheta1();
      return;
    }
    theta1Deg = clampAngle(r.theta1, maxTheta1Deg());
    isTir = false;
    updateReadouts();
    requestDraw();
  }

  function applyFromThetaY(tY) {
    const clamped = clampAngle(tY, maxThetaYDeg());
    const sX = (nYVal / nXVal) * Math.sin(toRad(clamped));
    if (sX > 1 + 1e-9) {
      applyFromThetaX();
      return;
    }
    thetaXDeg = clampAngle(toDeg(Math.asin(Math.min(1, Math.max(0, sX)))), maxThetaXDeg());
    applyFromThetaX();
  }

  function applyFromThetaZ(tZ) {
    const clamped = clampAngle(tZ, maxThetaZDeg());
    const sX = (nZVal / nXVal) * Math.sin(toRad(clamped));
    if (sX > 1 + 1e-9) {
      applyFromThetaX();
      return;
    }
    thetaXDeg = clampAngle(toDeg(Math.asin(Math.min(1, Math.max(0, sX)))), maxThetaXDeg());
    applyFromThetaX();
  }

  // Darker ray / label colors for light-mode canvas readability
  const COLOR_INCIDENT = '#f97316';
  const COLOR_REFRACTED = '#0284c7';
  const COLOR_REFLECTED = '#f43f5e';
  const COLOR_MID = '#7c3aed';
  const COLOR_AXIS = '#000000';
  const COLOR_LABEL = '#0f172a';
  const RAY_FONT = '"Plus Jakarta Sans", Inter, system-ui, sans-serif';

  function drawArrow(x1, y1, x2, y2, color, width = 3.2) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = Math.max(12, width * 4.2);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const tipX = (x1 + x2) / 2;
    const tipY = (y1 + y2) / 2;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (len >= 8) {
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - head * Math.cos(ang - 0.42), tipY - head * Math.sin(ang - 0.42));
      ctx.lineTo(tipX - head * Math.cos(ang + 0.42), tipY - head * Math.sin(ang + 0.42));
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTextWithOutline(text, x, y, textColor, align = 'center', baseline = 'middle', font = `800 15px ${RAY_FONT}`) {
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
    ctx.lineWidth = 2;
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

  /** Medium name and refractive index, sitting in that medium beside the interface. */
  function drawMediumSideLabel(n, x, y, align) {
    drawTextWithOutline(
      mediumCaption(n),
      x,
      y,
      COLOR_LABEL,
      align,
      'middle',
      `700 14px ${RAY_FONT}`,
    );
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

    drawBoundary(cy, W);
    drawTextWithOutline(t('tools.refraction.canvas.interface'), W / 2 + 24, cy - 10, COLOR_LABEL, 'start', 'bottom', `800 14px ${RAY_FONT}`);
    drawMediumSideLabel(n1Val, 18, cy - 20, 'left');
    drawMediumSideLabel(n2Val, W - 18, cy + 20, 'right');

    ctx.beginPath();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 1.5;
    ctx.moveTo(cx, 18);
    ctx.lineTo(cx, H - 18);
    ctx.stroke();
    ctx.setLineDash([]);
    drawTextWithOutline(t('tools.refraction.canvas.normal'), cx + 10, 72, COLOR_LABEL, 'start', 'alphabetic', `800 14px ${RAY_FONT}`);

    drawArrow(ix, iy, cx, cy, COLOR_INCIDENT, 3.2);

    if (isTir) {
      drawArrow(cx, cy, g.rx, g.ry, COLOR_REFLECTED, 3.2);

      drawAngleArc(cx, cy, -90, -90 - theta1Deg, COLOR_INCIDENT, `θ₁ = ${theta1Deg.toFixed(1)}°`);
      drawAngleArc(cx, cy, -90, -90 + theta1Deg, COLOR_REFLECTED, `θ₁ = ${theta1Deg.toFixed(1)}°`);
    } else {
      const t2 = g.t2 ?? 0;
      drawArrow(cx, cy, g.tx, g.ty, COLOR_REFRACTED, 3.2);

      drawAngleArc(cx, cy, -90, -90 - theta1Deg, COLOR_INCIDENT, `θ₁ = ${theta1Deg.toFixed(1)}°`);
      drawAngleArc(cx, cy, 90, 90 - t2, COLOR_REFRACTED, `θ₂ = ${t2.toFixed(1)}°`);
    }
  }

  function drawDashedNormal(nx, y0, y1) {
    ctx.beginPath();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 1.5;
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

    drawBoundary(yXY, W);
    drawBoundary(yYZ, W);
    const sideX = W - 210;
    drawMediumSideLabel(nXVal, sideX, yXY - 16, 'right');
    drawMediumSideLabel(nYVal, sideX, yYZ - 16, 'right');
    drawMediumSideLabel(nZVal, 248, yYZ + 20, 'left');

    // Normals at each interface hit
    drawDashedNormal(x1, Math.max(12, yXY - H * 0.28), Math.min(H - 12, yXY + H * 0.28));
    if (g.tir !== 'xy') {
      drawDashedNormal(x2, Math.max(12, yYZ - H * 0.28), Math.min(H - 12, yYZ + H * 0.28));
    }
    drawTextWithOutline(t('tools.refraction.canvas.normal'), x1 + 8, Math.max(72, yXY - H * 0.18), COLOR_LABEL, 'start', 'alphabetic', `800 13px ${RAY_FONT}`);

    drawArrow(ix, iy, x1, yXY, COLOR_INCIDENT, 3.2);
    drawAngleArc(x1, yXY, -90, -90 - thetaXDeg, COLOR_INCIDENT, `θX = ${thetaXDeg.toFixed(1)}°`);

    if (g.tir === 'xy') {
      drawArrow(x1, yXY, g.rx, g.ry, COLOR_REFLECTED, 3.2);
      drawAngleArc(x1, yXY, -90, -90 + thetaXDeg, COLOR_REFLECTED, `θX = ${thetaXDeg.toFixed(1)}°`);
      drawTextWithOutline(t('tools.refraction.canvas.reflected'), (x1 + (g.rx ?? x1)) / 2 + 28, (yXY + (g.ry ?? yXY)) / 2, COLOR_REFLECTED, 'center', 'middle', `800 14px ${RAY_FONT}`);
      return;
    }

    const tY = g.thetaY ?? 0;
    drawArrow(x1, yXY, x2, yYZ, COLOR_MID, 3.2);
    drawAngleArc(x1, yXY, 90, 90 - tY, COLOR_MID, `θY = ${tY.toFixed(1)}°`);

    if (g.tir === 'yz') {
      drawArrow(x2, yYZ, g.rx, g.ry, COLOR_REFLECTED, 3.2);
      drawAngleArc(x2, yYZ, -90, -90 + tY, COLOR_REFLECTED, `θY = ${tY.toFixed(1)}°`);
      drawTextWithOutline(t('tools.refraction.canvas.reflected'), (x2 + (g.rx ?? x2)) / 2 + 28, (yYZ + (g.ry ?? yYZ)) / 2, COLOR_REFLECTED, 'center', 'middle', `800 14px ${RAY_FONT}`);
      return;
    }

    const tZ = g.thetaZ ?? 0;
    drawArrow(x2, yYZ, g.zx, g.zy, COLOR_REFRACTED, 3.2);
    drawAngleArc(x2, yYZ, -90, -90 - tY, COLOR_MID, `θY = ${tY.toFixed(1)}°`);
    drawAngleArc(x2, yYZ, 90, 90 - tZ, COLOR_REFRACTED, `θZ = ${tZ.toFixed(1)}°`);
  }

  function applyHiDpi() {
    const dpr = bitmapScale();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    applyHiDpi();
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

  function drawSingleParticleModel(canvas, pctx, nVal, side, primaryColor) {
    if (!canvas || !pctx) return;
    const dpr = bitmapScale();
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pctx.clearRect(0, 0, W, H);
    const ctx = pctx;

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
    if (!particleCanvas1 || !ctxP1 || !particleCanvas2 || !ctxP2) return;
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

  function mediumFill(n) {
    if (n < 1.15) return 'rgba(56, 189, 248, 0.28)';
    if (n < 1.42) return 'rgba(2, 132, 199, 0.34)';
    return 'rgba(13, 148, 136, 0.32)';
  }

  function drawBoundary(y, width) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
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

  function bindAngleControl(slider, input, applyDeg) {
    const fromRaw = (raw) => {
      const val = Number(raw);
      if (!Number.isFinite(val)) return;
      applyDeg(val);
    };
    if (slider) slider.addEventListener('input', () => fromRaw(slider.value));
    if (input) {
      input.addEventListener('input', () => {
        const text = input.value.trim();
        if (text === '' || text === '-' || text === '.' || text === '-.') return;
        fromRaw(text);
      });
      input.addEventListener('change', () => {
        const val = Number(input.value);
        fromRaw(Number.isFinite(val) ? val : 0);
        if (input.disabled) input.value = '';
        else if (slider) input.value = Number(slider.value).toFixed(1);
      });
    }
  }

  bindAngleControl(theta1Slider, theta1Input, (deg) => {
    theta1Deg = clampAngle(deg, maxTheta1Deg());
    applyFromTheta1();
  });
  bindAngleControl(theta2Slider, theta2Input, (deg) => {
    applyFromTheta2(deg);
  });
  bindAngleControl(thetaXSlider, thetaXInput, (deg) => {
    thetaXDeg = clampAngle(deg, maxThetaXDeg());
    applyFromThetaX();
  });
  bindAngleControl(thetaYSlider, thetaYInput, (deg) => {
    applyFromThetaY(deg);
  });
  bindAngleControl(thetaZSlider, thetaZInput, (deg) => {
    applyFromThetaZ(deg);
  });

  const controlsBtn = wrap.querySelector('[data-toggle-controls]');
  controlsBtn?.addEventListener('click', () => {
    const hidden = wrap.dataset.controls !== 'hidden';
    wrap.dataset.controls = hidden ? 'hidden' : 'shown';
    if (controlsBtn) {
      controlsBtn.textContent = t(hidden ? 'tools.refraction.showControls' : 'tools.refraction.hideControls');
      controlsBtn.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    }
  });

  wrap.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (layerMode === 'three') {
      nXVal = 1.33;
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
        const next = clampAngle(theta1FromPoint(x, y, g.x1, g.yXY), maxThetaXDeg());
        if (Math.abs(next - thetaXDeg) >= 0.05) {
          thetaXDeg = next;
          applyFromThetaX();
        }
      }
    } else {
      const g = getMacroGeometry();
      if (dragTarget === 'incident') {
        const next = clampAngle(theta1FromPoint(x, y, g.cx, g.cy), maxTheta1Deg());
        if (Math.abs(next - theta1Deg) >= 0.05) {
          theta1Deg = next;
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
    const overlay = el.closest('.reflab-micro-overlay');
    const w = Math.max(180, (overlay ? overlay.clientWidth : el.clientWidth) - 4);
    const room = overlay ? overlay.clientHeight : 0;
    let h = Math.round(w * (200 / 320));
    if (room > 70) h = Math.min(h, room);
    const dpr = bitmapScale();
    const bufW = Math.floor(w * dpr);
    const bufH = Math.floor(h * dpr);
    particleCanvas.style.width = `${w}px`;
    particleCanvas.style.height = `${h}px`;
    if (particleCanvas.width !== bufW || particleCanvas.height !== bufH) {
      particleCanvas.width = bufW;
      particleCanvas.height = bufH;
      return true;
    }
    return false;
  }

  function fitCanvases(forceDraw = false) {
    const viz = wrap.querySelector('.reflab-viz');
    let macroChanged = false;
    if (viz) {
      const w = Math.max(320, viz.clientWidth - 20);
      const h = Math.round(w * (520 / 880));
      const dpr = bitmapScale();
      const bufW = Math.floor(w * dpr);
      const bufH = Math.floor(h * dpr);
      if (viewW !== w || viewH !== h || canvas.width !== bufW || canvas.height !== bufH) {
        viewW = w;
        viewH = h;
        canvas.width = bufW;
        canvas.height = bufH;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        applyHiDpi();
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
  if (particleCanvas1) requestAnimationFrame(tick);

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

