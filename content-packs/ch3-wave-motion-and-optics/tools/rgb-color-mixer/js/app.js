/** Standalone lab app module. */

export function initRgbColorMixer(root, t) {
  const wrap = document.createElement('div');
  wrap.className = 'rgb-mixer';
  wrap.innerHTML = `
    <p class="lead rgb-mixer-lead">${t('tools.rgbMixer.intro')}</p>
    <div class="rgb-mixer-body">
      <div class="rgb-mixer-stage">
        <canvas class="rgb-mixer-canvas" aria-label="${t('tools.rgbMixer.canvas')}"></canvas>
        <div class="rgb-mixer-labels" aria-hidden="true">
          <span class="lbl-r">${t('tools.rgbMixer.red')}</span>
          <span class="lbl-g">${t('tools.rgbMixer.green')}</span>
          <span class="lbl-b">${t('tools.rgbMixer.blue')}</span>
        </div>
      </div>
      <aside class="rgb-mixer-controls" aria-label="${t('tools.rgbMixer.controls')}">
        <div class="rgb-channel red">
          <label>
            <span class="name-red">${t('tools.rgbMixer.red')}</span>
            <span data-r-val>128</span>
          </label>
          <input type="range" min="0" max="255" value="128" data-r>
          <div class="rgb-channel-bar"><span data-r-bar style="width:50%"></span></div>
        </div>
        <div class="rgb-channel green">
          <label>
            <span class="name-green">${t('tools.rgbMixer.green')}</span>
            <span data-g-val>128</span>
          </label>
          <input type="range" min="0" max="255" value="128" data-g>
          <div class="rgb-channel-bar"><span data-g-bar style="width:50%"></span></div>
        </div>
        <div class="rgb-channel blue">
          <label>
            <span class="name-blue">${t('tools.rgbMixer.blue')}</span>
            <span data-b-val>128</span>
          </label>
          <input type="range" min="0" max="255" value="128" data-b>
          <div class="rgb-channel-bar"><span data-b-bar style="width:50%"></span></div>
        </div>
        <div class="rgb-preview">
          <div data-swatch class="rgb-swatch" role="img"></div>
          <div class="rgb-values" aria-live="polite">
            <p data-rgb-text>rgb(128, 128, 128)</p>
            <p data-hex-text>#808080</p>
          </div>
        </div>
        <div class="rgb-presets" aria-label="${t('tools.rgbMixer.presets')}">
          <button type="button" data-r="255" data-g="0" data-b="0">${t('tools.rgbMixer.presetRed')}</button>
          <button type="button" data-r="0" data-g="255" data-b="0">${t('tools.rgbMixer.presetGreen')}</button>
          <button type="button" data-r="0" data-g="0" data-b="255">${t('tools.rgbMixer.presetBlue')}</button>
          <button type="button" data-r="255" data-g="255" data-b="0">${t('tools.rgbMixer.presetYellow')}</button>
          <button type="button" data-r="0" data-g="255" data-b="255">${t('tools.rgbMixer.presetCyan')}</button>
          <button type="button" data-r="255" data-g="0" data-b="255">${t('tools.rgbMixer.presetMagenta')}</button>
          <button type="button" data-r="255" data-g="255" data-b="255">${t('tools.rgbMixer.presetWhite')}</button>
          <button type="button" data-r="0" data-g="0" data-b="0">${t('tools.rgbMixer.presetBlack')}</button>
        </div>
      </aside>
    </div>
  `;

  const rInput = wrap.querySelector('[data-r]');
  const gInput = wrap.querySelector('[data-g]');
  const bInput = wrap.querySelector('[data-b]');
  const canvas = wrap.querySelector('.rgb-mixer-canvas');
  const stage = wrap.querySelector('.rgb-mixer-stage');
  const ctx = canvas.getContext('2d');

  function toHex(n) {
    return n.toString(16).padStart(2, '0');
  }

  function drawOverlap(r, g, b) {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;
    const offset = radius * 0.5;
    const sin60 = Math.sqrt(3) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const lights = [
      { x: cx, y: cy - offset, rgb: [255, 0, 0], val: r },
      { x: cx - offset * sin60, y: cy + offset * 0.5, rgb: [0, 255, 0], val: g },
      { x: cx + offset * sin60, y: cy + offset * 0.5, rgb: [0, 0, 255], val: b },
    ];

    ctx.globalCompositeOperation = 'lighter';

    lights.forEach((light) => {
      if (light.val <= 0) return;
      const alpha = light.val / 255;
      const [lr, lg, lb] = light.rgb;
      const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, radius);
      grad.addColorStop(0, `rgba(${lr},${lg},${lb},${alpha})`);
      grad.addColorStop(0.65, `rgba(${lr},${lg},${lb},${alpha})`);
      grad.addColorStop(0.85, `rgba(${lr},${lg},${lb},${alpha * 0.5})`);
      grad.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(light.x, light.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
  }

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    const size = Math.max(200, Math.min(rect.width - 8, rect.height - 8, 720));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawOverlap(+rInput.value, +gInput.value, +bInput.value);
  }

  function updateColor() {
    const r = +rInput.value;
    const g = +gInput.value;
    const b = +bInput.value;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    wrap.querySelector('[data-r-val]').textContent = r;
    wrap.querySelector('[data-g-val]').textContent = g;
    wrap.querySelector('[data-b-val]').textContent = b;
    wrap.querySelector('[data-r-bar]').style.width = `${(r / 255) * 100}%`;
    wrap.querySelector('[data-g-bar]').style.width = `${(g / 255) * 100}%`;
    wrap.querySelector('[data-b-bar]').style.width = `${(b / 255) * 100}%`;

    rInput.style.setProperty('--fill', `${(r / 255) * 100}%`);
    gInput.style.setProperty('--fill', `${(g / 255) * 100}%`);
    bInput.style.setProperty('--fill', `${(b / 255) * 100}%`);

    const swatch = wrap.querySelector('[data-swatch]');
    swatch.style.backgroundColor = rgb;
    swatch.setAttribute('aria-label', `${t('tools.rgbMixer.preview')}: ${rgb}`);
    wrap.querySelector('[data-rgb-text]').textContent = rgb;
    wrap.querySelector('[data-hex-text]').textContent = hex;

    drawOverlap(r, g, b);
  }

  function setColor(r, g, b) {
    rInput.value = r;
    gInput.value = g;
    bInput.value = b;
    updateColor();
  }

  [rInput, gInput, bInput].forEach((el) => el.addEventListener('input', updateColor));

  wrap.querySelectorAll('.rgb-presets button').forEach((btn) => {
    btn.addEventListener('click', () => {
      setColor(+btn.dataset.r, +btn.dataset.g, +btn.dataset.b);
    });
  });

  const ro = new ResizeObserver(() => resizeCanvas());
  ro.observe(stage);
  requestAnimationFrame(() => {
    resizeCanvas();
    updateColor();
  });

  root.appendChild(wrap);
  return wrap;
}
