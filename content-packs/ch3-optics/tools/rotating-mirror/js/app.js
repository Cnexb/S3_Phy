/** Standalone lab app module. */

/**
 * @param {(key: string) => string} t
 */
export function initRotatingMirror(root, t) {
  const wrap = document.createElement('div');
  wrap.className = 'rml';
  wrap.innerHTML = `
    <div class="rml-head">
      <h2 class="rml-title">${t('tools.rotatingMirror.title')}</h2>
      <div class="rml-sub">${t('tools.rotatingMirror.subtitle')}</div>
    </div>
    <div class="rml-dash">
      <div class="rml-viz">
        <canvas class="rml-canvas" width="700" height="420" aria-label="${t('tools.rotatingMirror.title')}"></canvas>
      </div>
      <div class="rml-controls">
        <div class="rml-toggles">
          <button type="button" class="rml-toggle rml-btn-green active" data-rml-toggle="orig-norm">
            <span class="rml-ind"></span> ${t('tools.rotatingMirror.toggle.origNormal')}
          </button>
          <button type="button" class="rml-toggle rml-btn-green active" data-rml-toggle="orig-ray">
            <span class="rml-ind"></span> ${t('tools.rotatingMirror.toggle.origRay')}
          </button>
          <button type="button" class="rml-toggle rml-btn-cyan active" data-rml-toggle="new-norm">
            <span class="rml-ind"></span> ${t('tools.rotatingMirror.toggle.newNormal')}
          </button>
          <button type="button" class="rml-toggle rml-btn-cyan active" data-rml-toggle="new-ray">
            <span class="rml-ind"></span> ${t('tools.rotatingMirror.toggle.newRay')}
          </button>
        </div>
        <div class="rml-cg">
          <div class="rml-lr">
            <span>${t('tools.rotatingMirror.incidentAngle')}</span>
            <span class="rml-badge" data-rml-disp="inc">-140°</span>
          </div>
          <input type="range" data-rml-inc min="-170" max="-100" step="1" value="-140" />
        </div>
        <div class="rml-cg">
          <div class="rml-lr">
            <span style="color:var(--rml-yellow)">${t('tools.rotatingMirror.mirrorRotation')}</span>
            <span class="rml-badge" data-rml-disp="rot" style="color:var(--rml-yellow);background:rgba(255,204,0,0.15)">0°</span>
          </div>
          <input type="range" data-rml-rot min="-45" max="45" step="1" value="0" />
          <div class="rml-ticks">
            <span>-45°</span><span>0°</span><span>+45°</span>
          </div>
        </div>
        <div class="rml-stats">
          <div class="rml-sr">
            <span class="rml-sl">${t('tools.rotatingMirror.statIncidence')}</span>
            <span class="rml-sv" style="color:var(--rml-yellow)" data-rml-val="i">50.0°</span>
          </div>
          <div class="rml-sr">
            <span class="rml-sl">${t('tools.rotatingMirror.statReflection')}</span>
            <span class="rml-sv" style="color:var(--rml-cyan)" data-rml-val="r">50.0°</span>
          </div>
        </div>
        <div class="rml-shift">
          <div>
            <div class="rml-sl" style="color:#ff8a80;margin-bottom:2px">${t('tools.rotatingMirror.rayShift')}</div>
            <div class="rml-shv" data-rml-val="shift">0.0°</div>
          </div>
          <div class="rml-logic">${t('tools.rotatingMirror.logicBadge')}</div>
        </div>
        <button type="button" class="rml-reset" data-rml-reset>${t('tools.rotatingMirror.reset')}</button>
      </div>
    </div>
  `;

  const canvas = wrap.querySelector('.rml-canvas');
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const sliderRot = wrap.querySelector('[data-rml-rot]');
  const sliderInc = wrap.querySelector('[data-rml-inc]');
  const dispRot = wrap.querySelector('[data-rml-disp="rot"]');
  const dispInc = wrap.querySelector('[data-rml-disp="inc"]');
  const dispI = wrap.querySelector('[data-rml-val="i"]');
  const dispR = wrap.querySelector('[data-rml-val="r"]');
  const dispShift = wrap.querySelector('[data-rml-val="shift"]');

  const CX = 350;
  const CY = 380;
  const RAY_LEN = 300;
  const NEW_COLOR = '#22d3ee';
  const RAY_LABEL_FONT = 'bold 17px system-ui, sans-serif';

  let mirrorRot = 0;
  let incidentAngle = -140;
  let showOrigNormal = true;
  let showOrigRay = true;
  let showNewNormal = true;
  let showNewRay = true;

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function drawLine(x1, y1, angleDeg, len, color, width = 2, dashed = false) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dashed ? [6, 6] : []);
    const x2 = x1 + Math.cos(toRad(angleDeg)) * len;
    const y2 = y1 + Math.sin(toRad(angleDeg)) * len;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    return { x: x2, y: y2 };
  }

  function drawArrowhead(x1, y1, x2, y2, color, size = 14) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return;
    const ux = dx / len;
    const uy = dy / len;
    const bx = x2 - ux * size;
    const by = y2 - uy * size;
    const perp = 0.45 * size;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x2, y2);
    ctx.lineTo(bx - uy * perp, by + ux * perp);
    ctx.lineTo(bx + uy * perp, by - ux * perp);
    ctx.closePath();
    ctx.fill();
  }

  function drawArc(startDeg, endDeg, radius, color, text, textOffset = 25) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const s = Math.min(startDeg, endDeg);
    const e = Math.max(startDeg, endDeg);
    ctx.arc(CX, CY, radius, toRad(s), toRad(e), false);
    ctx.stroke();

    if (text) {
      const mid = (s + e) / 2;
      const tx = CX + Math.cos(toRad(mid)) * (radius + textOffset);
      const ty = CY + Math.sin(toRad(mid)) * (radius + textOffset);
      ctx.save();
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(text, tx, ty);
      ctx.restore();
    }
  }

  function draw(incAng, normAng, refAng, origRefAng, iVal) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = 'rgba(255, 204, 0, 0.45)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.moveTo(CX - 200, CY);
    ctx.lineTo(CX + 200, CY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = 'butt';

    const srcX = CX + Math.cos(toRad(incAng)) * RAY_LEN;
    const srcY = CY + Math.sin(toRad(incAng)) * RAY_LEN;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1a1c2c';
    ctx.moveTo(srcX, srcY);
    ctx.lineTo(CX, CY);
    ctx.stroke();

    const midX = (srcX + CX) * 0.5;
    const midY = (srcY + CY) * 0.5;
    const incLen = Math.hypot(CX - srcX, CY - srcY) || 1;
    const incUx = (CX - srcX) / incLen;
    const incUy = (CY - srcY) / incLen;
    drawArrowhead(midX - incUx * 28, midY - incUy * 28, midX, midY, '#1a1c2c', 16);

    ctx.save();
    ctx.font = RAY_LABEL_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#1a1c2c';
    ctx.fillText(t('tools.rotatingMirror.canvas.incident'), srcX, srcY - 12);
    ctx.restore();

    if (showOrigNormal) {
      const onEnd = drawLine(CX, CY, -90, RAY_LEN - 60, '#00e676', 1, true);
      ctx.save();
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#00e676';
      ctx.fillText(t('tools.rotatingMirror.canvas.n'), onEnd.x + 6, onEnd.y - 4);
      ctx.restore();

      // Right-angle indicator between original normal and horizontal mirror
      ctx.save();
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(CX + 22, CY);
      ctx.lineTo(CX + 22, CY - 22);
      ctx.lineTo(CX, CY - 22);
      ctx.stroke();

      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillStyle = '#00e676';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('90°', CX + 26, CY - 3);
      ctx.restore();
    }
    if (showOrigRay) {
      const origEnd = drawLine(CX, CY, origRefAng, RAY_LEN, '#00e676', 2, false);
      drawArrowhead(CX, CY, origEnd.x, origEnd.y, '#00e676', 16);
      ctx.save();
      ctx.font = RAY_LABEL_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#00e676';
      ctx.fillText(t('tools.rotatingMirror.canvas.originalReflected'), origEnd.x, origEnd.y - 14);
      ctx.restore();
    }

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(toRad(mirrorRot));
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffcc00';
    ctx.lineCap = 'round';
    ctx.moveTo(-200, 0);
    ctx.lineTo(200, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    for (let k = -190; k < 200; k += 15) {
      ctx.moveTo(k, 0);
      ctx.lineTo(k - 5, 8);
    }
    ctx.stroke();

    // Right-angle indicator between new normal and rotated mirror
    if (showNewNormal) {
      ctx.save();
      ctx.strokeStyle = NEW_COLOR;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(22, -22);
      ctx.lineTo(0, -22);
      ctx.stroke();

      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillStyle = NEW_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('90°', 26, -3);
      ctx.restore();
    }

    ctx.restore();

    if (showNewNormal) {
      const nnEnd = drawLine(CX, CY, normAng, RAY_LEN - 40, NEW_COLOR, 2, true);
      ctx.save();
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = NEW_COLOR;
      ctx.fillText(t('tools.rotatingMirror.canvas.nPrime'), nnEnd.x + 6, nnEnd.y - 4);
      ctx.restore();
    }
    if (showNewRay) {
      const newEnd = drawLine(CX, CY, refAng, RAY_LEN, NEW_COLOR, 4);
      drawArrowhead(CX, CY, newEnd.x, newEnd.y, NEW_COLOR, 16);
      if (Math.abs(mirrorRot) > 0.5) {
        ctx.save();
        ctx.font = RAY_LABEL_FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = NEW_COLOR;
        ctx.fillText(t('tools.rotatingMirror.canvas.newReflected'), newEnd.x, newEnd.y - 14);
        ctx.restore();
      }
    }

    if (showNewNormal) drawArc(incAng, normAng, 100, '#ffcc00', `i=${iVal.toFixed(0)}°`, 25);
    if (showNewNormal && showNewRay) drawArc(normAng, refAng, 100, NEW_COLOR, `r=${iVal.toFixed(0)}°`, 25);

    if (showOrigNormal && showNewNormal && Math.abs(mirrorRot) > 0.5) {
      drawArc(-90, normAng, 50, '#ffcc00', `θ=${Math.abs(mirrorRot)}°`, 20);
    }

    if (showOrigRay && showNewRay && Math.abs(mirrorRot) > 0.5) {
      const shiftDeg = refAng - origRefAng;
      drawArc(origRefAng, refAng, 260, '#ff5252', `${t('tools.rotatingMirror.canvas.shift')}=${shiftDeg.toFixed(0)}°`, 40);
    }
  }

  function update() {
    mirrorRot = parseFloat(sliderRot.value);
    incidentAngle = parseFloat(sliderInc.value);

    const sign = mirrorRot > 0 ? '+' : '';
    dispRot.textContent = `${sign}${mirrorRot}°`;
    dispInc.textContent = `${incidentAngle}°`;

    const origNormal = -90;
    const iBase = Math.abs(incidentAngle - origNormal);
    const origReflectedAng = origNormal + iBase;

    const currentNormal = -90 + mirrorRot;
    const iVal = Math.abs(incidentAngle - currentNormal);
    const reflectedAng = currentNormal + iVal;

    const shift = reflectedAng - origReflectedAng;

    dispI.textContent = `${iVal.toFixed(1)}°`;
    dispR.textContent = `${iVal.toFixed(1)}°`;
    const shiftSign = shift > 0 ? '+' : '';
    dispShift.textContent = `${shiftSign}${shift.toFixed(1)}°`;

    draw(incidentAngle, currentNormal, reflectedAng, origReflectedAng, iVal);
  }

  wrap.querySelectorAll('[data-rml-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-rml-toggle');
      if (type === 'orig-norm') showOrigNormal = !showOrigNormal;
      if (type === 'orig-ray') showOrigRay = !showOrigRay;
      if (type === 'new-norm') showNewNormal = !showNewNormal;
      if (type === 'new-ray') showNewRay = !showNewRay;
      btn.classList.toggle('active');
      update();
    });
  });

  wrap.querySelector('[data-rml-reset]').addEventListener('click', () => {
    sliderRot.value = '0';
    update();
  });

  sliderRot.addEventListener('input', update);
  sliderInc.addEventListener('input', update);

  update();

  root.appendChild(wrap);
  return wrap;
}
