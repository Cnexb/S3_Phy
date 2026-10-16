/** Interactive TIR lab — semicircular glass block in air, critical angle. */

const N_GLASS = 1.5;
const N_AIR = 1.0;
const DEFAULTS = { angle: 30, fromBottom: true };
const CRITICAL_BAND = 0.05;

/**
 * @param {(key: string) => string} t
 */
export function initTirEscapeLab(root, t) {
  const params = new URLSearchParams(location.search);
  function clampNum(raw, fallback, min, max) {
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  const n1Val = N_GLASS;
  const n2Val = N_AIR;
  let theta1Deg = Math.round(clampNum(params.get('angle'), DEFAULTS.angle, 0, 90) * 10) / 10;
  let incidentFromBottom = DEFAULTS.fromBottom;

  document.title = t('tools.tir.title');

  const wrap = document.createElement('div');
  wrap.className = 'tirlab';
  wrap.innerHTML = `
    <div class="tirlab-head">
      <div class="tirlab-head-main">
        <h2 class="tirlab-title">${t('tools.tir.title')}</h2>
        <div class="tirlab-sub">${t('tools.tir.subtitle')}</div>
      </div>
      <div class="lang-bar">
        <button type="button" class="lang-btn" data-set-lang="en">English</button>
        <button type="button" class="lang-btn" data-set-lang="zh">繁體中文</button>
      </div>
    </div>
    <div class="tirlab-dash">
      <div class="tirlab-viz">
        <div class="tirlab-mode-toggle">
          <button type="button" class="tirlab-mode-btn active" data-dir="up">${t('tools.tir.dirUp')}</button>
          <button type="button" class="tirlab-mode-btn" data-dir="down">${t('tools.tir.dirDown')}</button>
        </div>
        <canvas id="simCanvas" class="tirlab-canvas" width="800" height="480" aria-label="${t('tools.tir.title')}"></canvas>

        <div class="tirlab-medium-tag tirlab-medium-tag--air">${t('tools.tir.canvas.air')}  n₂ = ${formatN(n2Val)}</div>
        <div class="tirlab-medium-tag tirlab-medium-tag--glass">${t('tools.tir.canvas.glass')}  n₁ = ${formatN(n1Val)}</div>

        <div class="tirlab-canvas-hud-stack tirlab-canvas-hud-stack--right">
          <div class="tirlab-canvas-hud tirlab-canvas-hud--angle">
            <div class="tirlab-hud-label">${t('tools.tir.angleI')}</div>
            <div class="tirlab-slider-row">
              <input type="range" id="angle-slider" data-angle-slider min="0" max="90" step="0.1" value="${theta1Deg.toFixed(1)}" aria-label="theta1" />
              <input type="number" data-angle-input min="0" max="90" step="0.1" value="${theta1Deg.toFixed(1)}" class="tirlab-num-input" />
            </div>
            <strong class="tirlab-n-live" data-angle hidden>${theta1Deg.toFixed(1)}°</strong>
          </div>

          <div class="tirlab-canvas-hud tirlab-canvas-hud--critical">
            <div class="tirlab-hud-label" data-critical-label>${t('tools.tir.critical')}</div>
            <div class="tirlab-sr" data-critical-row>
              <span class="tirlab-sv" data-critical>—</span>
            </div>
            <div class="tirlab-hud-actions">
              <button type="button" id="btn-set-critical" class="tirlab-set-c" data-set-critical>${t('tools.tir.setCritical')}</button>
              <button type="button" class="tirlab-reset tirlab-reset--compact" data-reset>${t('tools.tir.reset')}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  const canvas = /** @type {HTMLCanvasElement} */ (wrap.querySelector('#simCanvas'));
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const angleSlider = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-angle-slider]'));
  const angleInput = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-angle-input]'));
  const angleEl = wrap.querySelector('[data-angle]');
  const critHud = wrap.querySelector('.tirlab-canvas-hud--critical');
  const critEl = wrap.querySelector('[data-critical]');
  const critLabel = wrap.querySelector('[data-critical-label]');
  const setCritBtn = /** @type {HTMLButtonElement} */ (wrap.querySelector('[data-set-critical]'));

  const COLOR_INCIDENT = '#b45309';
  const COLOR_REFRACTED = '#0e7490';
  const COLOR_REFLECTED = '#b91c1c';
  const COLOR_CRITICAL = '#ca8a04';
  const COLOR_AXIS = '#374151';
  const COLOR_LABEL = '#1a1c2c';

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }
  function toDeg(rad) {
    return (rad * 180) / Math.PI;
  }
  function formatN(n) {
    return n.toFixed(2);
  }
  /** @returns {{ nI: number, nT: number, tc: number | null, state: 'refract' | 'critical' | 'tir' | 'noTir', theta2Deg: number | null, canShowReflection: boolean }} */
  function getOptics() {
    const nI = incidentFromBottom ? n1Val : n2Val;
    const nT = incidentFromBottom ? n2Val : n1Val;
    const tc = nI > nT ? toDeg(Math.asin(nT / nI)) : null;
    const sin2 = (nI * Math.sin(toRad(theta1Deg))) / nT;
    let state = /** @type {'refract' | 'critical' | 'tir' | 'noTir'} */ ('refract');
    let theta2Deg = null;
    if (tc == null) {
      state = 'noTir';
      theta2Deg = toDeg(Math.asin(Math.min(1, Math.max(-1, sin2))));
    } else if (Math.abs(theta1Deg - tc) < CRITICAL_BAND) {
      state = 'critical';
      theta2Deg = 90;
    } else if (sin2 >= 1) {
      state = 'tir';
    } else {
      theta2Deg = toDeg(Math.asin(sin2));
    }
    return {
      nI,
      nT,
      tc,
      state,
      theta2Deg,
      canShowReflection: nI > nT && theta1Deg > 0.05,
    };
  }

  function paintDirection() {
    wrap.querySelectorAll('[data-dir]').forEach((btn) => {
      const up = btn.getAttribute('data-dir') === 'up';
      btn.classList.toggle('active', up === incidentFromBottom);
    });
  }

  function updateReadouts() {
    const opt = getOptics();
    if (angleEl) angleEl.textContent = `${theta1Deg.toFixed(1)}°`;
    if (angleSlider) angleSlider.value = String(theta1Deg);
    if (angleInput && document.activeElement !== angleInput) angleInput.value = theta1Deg.toFixed(1);

    if (critEl && critLabel) {
      if (opt.tc != null) {
        critLabel.textContent = t('tools.tir.critical');
        critEl.textContent = `${opt.tc.toFixed(1)}°`;
        critEl.hidden = false;
      } else {
        critLabel.textContent = t('tools.tir.noCritical');
        critEl.textContent = '';
        critEl.hidden = true;
      }
    }
    if (critHud) critHud.classList.toggle('is-at-critical', opt.state === 'critical');
    if (setCritBtn) setCritBtn.disabled = opt.tc == null;
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

  function applyState() {
    paintDirection();
    updateReadouts();
    requestDraw();
  }

  function mediumFill(n, alpha) {
    if (n < 1.15) return `rgba(120, 160, 220, ${alpha})`;
    if (n < 1.42) return `rgba(40, 120, 200, ${alpha})`;
    return `rgba(160, 200, 230, ${alpha})`;
  }

  let cssW = 800;
  let cssH = 480;

  function currentDpr() {
    return Math.min(window.devicePixelRatio || 1, 3);
  }

  function getGeom() {
    const W = cssW;
    const H = cssH;
    const cx = W / 2;
    const cy = Math.round(H * 0.50);
    const radius = Math.min(W * 0.28, H * 0.38);
    return { W, H, cx, cy, radius };
  }

  function drawArrow(x1, y1, x2, y2, color, width = 5.5) {
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

  function labelAlongRay(x1, y1, x2, y2, text, color, side = 1) {
    const mx = x1 + (x2 - x1) * 0.62;
    const my = y1 + (y2 - y1) * 0.62;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * 28 * side;
    const oy = (dx / len) * 28 * side;
    drawTextWithOutline(text, mx + ox, my + oy, color, 'center', 'middle', 'bold 14px system-ui, sans-serif');
  }

  function drawAngleArc(cx, cy, r, start, end, text, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.arc(cx, cy, r, start, end);
    ctx.stroke();
    const mid = (start + end) / 2;
    const tx = cx + (r + 22) * Math.cos(mid);
    const ty = cy + (r + 22) * Math.sin(mid);
    drawTextWithOutline(text, tx, ty, color, 'center', 'middle', 'bold 14px system-ui, sans-serif');
  }

  function drawRightAngle(x, y, size, text, color, dirX, dirY) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(x, y + dirY * size);
    ctx.lineTo(x + dirX * size, y + dirY * size);
    ctx.lineTo(x + dirX * size, y);
    ctx.stroke();
    drawTextWithOutline(text, x + dirX * (size + 26), y + dirY * (size + 8), color, 'center', 'middle', 'bold 14px system-ui, sans-serif');
  }

  function draw() {
    const dpr = currentDpr();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    const { W, H, cx, cy, radius } = getGeom();
    if (!W || !H) return;
    const opt = getOptics();
    const theta1 = toRad(theta1Deg);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = mediumFill(n2Val, 0.22);
    ctx.fillRect(0, 0, W, cy);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = mediumFill(n1Val, 0.28);
    ctx.fill();
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 3;
    ctx.moveTo(cx - radius - 40, cy);
    ctx.lineTo(cx + radius + 40, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 2.5;
    ctx.moveTo(cx, cy - radius * 0.85);
    ctx.lineTo(cx, cy + radius * 0.85);
    ctx.stroke();
    ctx.setLineDash([]);
    drawTextWithOutline(t('tools.tir.canvas.normal'), cx + 12, cy - radius * 0.72, COLOR_LABEL, 'start', 'middle', 'bold 13px system-ui, sans-serif');

    const startX = cx - radius * Math.sin(theta1);
    const startY = incidentFromBottom
      ? cy + radius * Math.cos(theta1)
      : cy - radius * Math.cos(theta1);
    const reflectX = cx + radius * Math.sin(theta1);
    const reflectY = startY;

    const showRayNames = radius >= 140;

    drawArrow(startX, startY, cx, cy, COLOR_INCIDENT, 5.5);
    if (showRayNames) {
      labelAlongRay(startX, startY, cx, cy, t('tools.tir.canvas.incident'), COLOR_INCIDENT, incidentFromBottom ? 1 : -1);
    }

    if (opt.state === 'critical' && opt.tc != null) {
      if (Math.abs(opt.tc - 90) < 0.1) {
        drawRightAngle(cx, cy, 22, `θc = ${opt.tc.toFixed(1)}°`, '#2563eb', -1, incidentFromBottom ? 1 : -1);
      } else if (incidentFromBottom) {
        drawAngleArc(cx, cy, radius * 0.26, Math.PI / 2, Math.PI / 2 + theta1, `θc = ${opt.tc.toFixed(1)}°`, '#2563eb');
      } else {
        drawAngleArc(cx, cy, radius * 0.26, -Math.PI / 2 - theta1, -Math.PI / 2, `θc = ${opt.tc.toFixed(1)}°`, '#2563eb');
      }
    } else if (Math.abs(theta1Deg - 90) < 0.1) {
      drawRightAngle(cx, cy, 18, 'θ₁ = 90.0°', COLOR_INCIDENT, -1, incidentFromBottom ? 1 : -1);
    } else if (incidentFromBottom) {
      drawAngleArc(cx, cy, radius * 0.22, Math.PI / 2, Math.PI / 2 + theta1, `θ₁ = ${theta1Deg.toFixed(1)}°`, COLOR_INCIDENT);
    } else {
      drawAngleArc(cx, cy, radius * 0.22, -Math.PI / 2 - theta1, -Math.PI / 2, `θ₁ = ${theta1Deg.toFixed(1)}°`, COLOR_INCIDENT);
    }

    if (opt.state === 'critical') {
      const endX = cx + radius * 1.45;
      drawArrow(cx, cy, endX, cy, COLOR_CRITICAL, 5.5);
      if (showRayNames) {
        labelAlongRay(cx, cy, endX, cy, t('tools.tir.canvas.refracted'), COLOR_CRITICAL, incidentFromBottom ? -1 : 1);
      }
      drawRightAngle(cx, cy, 18, 'θ₂ = 90.0°', COLOR_CRITICAL, 1, incidentFromBottom ? -1 : 1);
    } else if (opt.state !== 'tir' && opt.theta2Deg != null) {
      const theta2 = toRad(opt.theta2Deg);
      const rayLen = radius * 1.45;
      const endX = cx + rayLen * Math.sin(theta2);
      const endY = incidentFromBottom
        ? cy - rayLen * Math.cos(theta2)
        : cy + rayLen * Math.cos(theta2);
      drawArrow(cx, cy, endX, endY, COLOR_REFRACTED, 5.5);
      if (showRayNames) {
        labelAlongRay(cx, cy, endX, endY, t('tools.tir.canvas.refracted'), COLOR_REFRACTED, 1);
      }
      if (incidentFromBottom) {
        drawAngleArc(cx, cy, radius * 0.16, -Math.PI / 2, -Math.PI / 2 + theta2, `θ₂ = ${opt.theta2Deg.toFixed(1)}°`, COLOR_REFRACTED);
      } else {
        drawAngleArc(cx, cy, radius * 0.16, Math.PI / 2 - theta2, Math.PI / 2, `θ₂ = ${opt.theta2Deg.toFixed(1)}°`, COLOR_REFRACTED);
      }
    }

    if (opt.canShowReflection) {
      drawArrow(cx, cy, reflectX, reflectY, COLOR_REFLECTED, 5.5);
      if (showRayNames) {
        labelAlongRay(cx, cy, reflectX, reflectY, t('tools.tir.canvas.reflected'), COLOR_REFLECTED, incidentFromBottom ? -1 : 1);
      }
      if (Math.abs(theta1Deg - 90) < 0.1) {
        drawRightAngle(cx, cy, 18, 'θᵣ = 90.0°', COLOR_REFLECTED, 1, incidentFromBottom ? 1 : -1);
      } else if (incidentFromBottom) {
        drawAngleArc(cx, cy, radius * 0.16, Math.PI / 2 - theta1, Math.PI / 2, `θᵣ = ${theta1Deg.toFixed(1)}°`, COLOR_REFLECTED);
      } else {
        drawAngleArc(cx, cy, radius * 0.16, -Math.PI / 2, -Math.PI / 2 + theta1, `θᵣ = ${theta1Deg.toFixed(1)}°`, COLOR_REFLECTED);
      }
    }
  }

  angleSlider.addEventListener('input', () => {
    theta1Deg = Math.round(Number(angleSlider.value) * 10) / 10;
    applyState();
  });
  angleInput.addEventListener('change', () => {
    let val = Number(angleInput.value);
    if (Number.isNaN(val)) return;
    theta1Deg = Math.round(Math.min(90, Math.max(0, val)) * 10) / 10;
    applyState();
  });

  wrap.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => {
      incidentFromBottom = btn.getAttribute('data-dir') === 'up';
      applyState();
    });
  });

  setCritBtn.addEventListener('click', () => {
    const opt = getOptics();
    if (opt.tc == null) return;
    theta1Deg = Math.round(opt.tc * 10) / 10;
    applyState();
  });

  wrap.querySelector('[data-reset]').addEventListener('click', () => {
    theta1Deg = DEFAULTS.angle;
    incidentFromBottom = DEFAULTS.fromBottom;
    applyState();
  });

  function canvasPointerPos(ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left) * (cssW / rect.width),
      y: (ev.clientY - rect.top) * (cssH / rect.height),
    };
  }

  function distPointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 < 1e-9) return Math.hypot(px - x1, py - y1);
    let u = ((px - x1) * dx + (py - y1) * dy) / len2;
    u = Math.min(1, Math.max(0, u));
    return Math.hypot(px - (x1 + u * dx), py - (y1 + u * dy));
  }

  function theta1FromPoint(px, py) {
    const { cx, cy } = getGeom();
    const dx = px - cx;
    const dy = py - cy;
    let deg = incidentFromBottom
      ? toDeg(Math.atan2(-dx, dy))
      : toDeg(Math.atan2(-dx, -dy));
    if (deg < 0) deg = 0;
    return Math.min(90, deg);
  }

  let dragging = false;
  function hitIncident(px, py) {
    const { cx, cy, radius } = getGeom();
    const theta1 = toRad(theta1Deg);
    const startX = cx - radius * Math.sin(theta1);
    const startY = incidentFromBottom
      ? cy + radius * Math.cos(theta1)
      : cy - radius * Math.cos(theta1);
    return distPointToSegment(px, py, startX, startY, cx, cy) <= 16;
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (ev.button != null && ev.button !== 0) return;
    const { x, y } = canvasPointerPos(ev);
    if (!hitIncident(x, y)) return;
    dragging = true;
    canvas.setPointerCapture(ev.pointerId);
    theta1Deg = Math.round(theta1FromPoint(x, y) * 10) / 10;
    applyState();
    ev.preventDefault();
  });
  canvas.addEventListener('pointermove', (ev) => {
    const { x, y } = canvasPointerPos(ev);
    canvas.style.cursor = dragging || hitIncident(x, y) ? 'grab' : 'default';
    if (!dragging) return;
    theta1Deg = Math.round(theta1FromPoint(x, y) * 10) / 10;
    applyState();
    ev.preventDefault();
  });
  function endDrag(ev) {
    if (!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture(ev.pointerId); } catch (_) { /* already released */ }
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  function fitCanvas() {
    const viz = wrap.querySelector('.tirlab-viz');
    if (!viz) return;
    const w = Math.max(320, viz.clientWidth - 20);
    const h = Math.round(w * (480 / 800));
    const dpr = currentDpr();
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh || cssW !== w || cssH !== h) {
      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      cssW = w;
      cssH = h;
    }
    requestDraw();
  }

  applyState();
  root.appendChild(wrap);

  const ro = new ResizeObserver(() => fitCanvas());
  ro.observe(wrap);
  const vizEl = wrap.querySelector('.tirlab-viz');
  if (vizEl) ro.observe(vizEl);
  fitCanvas();
}
