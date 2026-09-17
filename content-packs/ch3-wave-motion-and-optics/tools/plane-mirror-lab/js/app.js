import { applyI18n, toggleLang, t, getLang, setLang, hubLangToLocal, initLangFromLocation } from './i18n.js';
import { buildRayColorControls, refreshRayColorPanel } from './rayColorControls.js';
import { getRayColors } from './rayColors.js';
import { createImageFormationScenario } from './scenarios/imageFormation.js';
import { createMinMirrorLengthScenario } from './scenarios/minMirrorLength.js';
import { createMinMirrorHeightScenario } from './scenarios/minMirrorHeight.js';
import { createSeeBackObjectScenario } from './scenarios/seeBackObject.js';
import { createAngledMirrorsScenario } from './scenarios/angledMirrors.js';
import { createRaySketchScenario } from './scenarios/raySketch.js';

const SCENARIOS = [
  createImageFormationScenario(),
  createMinMirrorLengthScenario(),
  createMinMirrorHeightScenario(),
  createSeeBackObjectScenario(),
  createAngledMirrorsScenario(),
  createRaySketchScenario(),
];

const TAB_KEYS = [
  'imageFormation', 'minLength', 'minHeight', 'seeBack', 'angledMirrors', 'raySketch',
];

let currentIdx = 0;
let currentSub = null;

const els = {
  canvas: null,
  canvasTop: null,
  controls: null,
  stats: null,
  formula: null,
  formulaLatex: null,
  desc: null,
  subTabs: null,
  vizPanel: null,
  sceneBadge: null,
};

function getScenario() { return SCENARIOS[currentIdx]; }

/**
 * Build LaTeX from compute() — numbers update when sliders/drag change (teaching feedback loop).
 * Falls back to plain text in #formula if KaTeX CDN unavailable (offline file://).
 */
function buildLatex(sc, c) {
  const id = sc.id;
  switch (id) {
    case 'imageFormation':
      return [
        '\\begin{aligned}',
        `u &= ${c.u.toFixed(2)}\\,\\mathrm{m},\\quad v = ${c.v.toFixed(2)}\\,\\mathrm{m} \\\\[4pt]`,
        'u &= v \\\\[4pt]',
        `u + v &= ${(c.u + c.v).toFixed(2)}\\,\\mathrm{m}`,
        '\\end{aligned}',
      ].join('\n');
    case 'minLength':
      return [
        '\\begin{aligned}',
        `p &= \\tfrac{H}{2} = ${c.req.length.toFixed(2)}\\,\\mathrm{m} \\\\`,
        `q &= \\tfrac{h}{2} = ${c.req.bottom.toFixed(2)}\\,\\mathrm{m} \\\\`,
        `y_{\\mathrm{top}} &= \\tfrac{H+h}{2} = ${c.req.top.toFixed(2)}\\,\\mathrm{m}`,
        '\\end{aligned}',
      ].join('\n');
    case 'minHeight':
      if (c.mode === 'feet') {
        return `\\begin{aligned} 2y &= h_{\\mathrm{eye}} \\\\ y &= ${c.y.toFixed(2)}\\,\\mathrm{m} \\end{aligned}`;
      }
      if (c.mode === 'cockroach') {
        return `\\tfrac{y}{h-y} = \\tfrac{d_{\\mathrm{obj}}}{d_{\\mathrm{eye}}},\\; y = ${c.y.toFixed(2)}\\,\\mathrm{m}`;
      }
      return `p \\geq ${(c.req.minP * 100).toFixed(0)}\\,\\mathrm{cm}`;
    case 'seeBack':
      return c.mode === 'ceiling'
        ? '\\tfrac{h}{d_E} = \\tfrac{1}{d_E + d_L},\\; y_{\\mathrm{mirror}} = 1.83\\,\\mathrm{m}'
        : '\\tfrac{0.2}{1} = \\tfrac{h - 1.6}{5} \\Rightarrow h = 2.6\\,\\mathrm{m}';
    case 'angledMirrors': {
      const th = sc.params ? sc.params.theta : 45;
      return `n = \\dfrac{360^{\\circ}}{\\theta} - 1 = \\dfrac{360^{\\circ}}{${th}} - 1 = ${c.nFormula}`;
    }
    case 'raySketch':
      return '\\theta_i = \\theta_r';
    default:
      return null;
  }
}

function renderFormulaPanel(latexEl, fallbackEl, latex, fallbackText, opts = {}) {
  const katex = typeof window !== 'undefined' ? window.katex : null;
  if (latexEl && latex && katex?.renderToString) {
    try {
      latexEl.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: true });
      latexEl.hidden = false;
      if (fallbackEl) {
        fallbackEl.textContent = fallbackText || '';
        fallbackEl.hidden = !opts.keepFallback;
      }
      return;
    } catch (_) { /* plain text */ }
  }
  if (latexEl) latexEl.hidden = true;
  if (fallbackEl) {
    fallbackEl.textContent = fallbackText || '';
    fallbackEl.hidden = false;
  }
}

function buildTabs() {
  const bar = document.getElementById('tabBar');
  bar.innerHTML = '';
  TAB_KEYS.forEach((key, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn' + (i === currentIdx ? ' active' : '');
    btn.dataset.i18n = `tabs.${key}`;
    btn.addEventListener('click', () => switchScenario(i));
    bar.appendChild(btn);
  });
  applyI18n(bar);
}

function buildSubTabs(scenario) {
  if (!els.subTabs) return;
  els.subTabs.innerHTML = '';
  if (!scenario.getSubTabs) {
    els.subTabs.style.display = 'none';
    currentSub = null;
    return;
  }
  els.subTabs.style.display = 'flex';
  const subs = scenario.getSubTabs();
  if (!currentSub || !subs.includes(currentSub)) currentSub = subs[0];
  subs.forEach((sub) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sub-tab-btn' + (sub === currentSub ? ' active' : '');
    btn.dataset.i18n = `sub.${sub}`;
    btn.addEventListener('click', () => {
      currentSub = sub;
      scenario.setSub(sub);
      buildSubTabs(scenario);
      rebuildControls();
      render();
    });
    els.subTabs.appendChild(btn);
  });
  applyI18n(els.subTabs);
}

function updateAnimPanel() {
  const panel = document.getElementById('animPanel');
  if (panel) panel.style.display = getScenario().hideAnimation ? 'none' : '';
}

function updateResultsPanel() {
  const sc = getScenario();
  const hide = !!sc.hideResults;
  const title = document.getElementById('resultsTitle');
  const stats = document.getElementById('stats');
  if (title) {
    title.style.display = hide ? 'none' : '';
    title.dataset.i18n = hide ? 'formulaLive' : 'results';
    if (!hide) title.textContent = t('results');
  }
  if (stats) stats.style.display = hide ? 'none' : '';
}

function pauseAllAnimators() {
  SCENARIOS.forEach((s) => {
    const anim = s.getAnimator?.();
    if (anim) {
      anim.pause();
      anim.onUpdate = null;
    }
  });
}

/** Clear stale canvas refs / listeners before destroying the canvas element. */
function teardownAllScenarios() {
  pauseAllAnimators();
  SCENARIOS.forEach((s) => s.teardown?.());
}

function switchScenario(i) {
  if (i < 0 || i >= SCENARIOS.length) return;

  teardownAllScenarios();

  currentIdx = i;
  const sc = getScenario();
  const subs = sc.getSubTabs?.();
  currentSub = subs ? subs[0] : null;

  buildTabs();
  setupCanvas();
  sc.preset();

  if (subs) sc.setSub(currentSub);

  buildSubTabs(sc);
  sc.getAnimator?.()?.reset?.();
  rebuildControls();
  updateAnimPanel();
  updateResultsPanel();
  render();
}

function setupCanvas() {
  const sc = getScenario();
  const panel = els.vizPanel;

  /* 保留 viz-chrome（場景徽章 + 操作提示），只替換 canvas 區域 */
  let chrome = panel.querySelector('.viz-chrome');
  if (!chrome) {
    chrome = document.createElement('div');
    chrome.className = 'viz-chrome';
    chrome.innerHTML = '<span class="scene-badge" id="sceneBadge" aria-live="polite"></span>'
      + '<span class="viz-hint" id="vizHint" data-i18n="vizHint"></span>';
    panel.insertBefore(chrome, panel.firstChild);
    applyI18n(chrome);
  }
  els.sceneBadge = document.getElementById('sceneBadge');

  let wrap = document.getElementById('vizCanvasWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'viz-canvas-wrap';
    wrap.id = 'vizCanvasWrap';
    const legend = panel.querySelector('.viz-legend');
    panel.insertBefore(wrap, legend || null);
  }
  wrap.innerHTML = '';

  if (sc.dualCanvas) {
    const dual = document.createElement('div');
    dual.className = 'dual-canvas';
    const c1 = document.createElement('canvas');
    const c2 = document.createElement('canvas');
    c1.id = 'simCanvas';
    c2.id = 'simCanvasTop';
    dual.appendChild(c1);
    dual.appendChild(c2);
    wrap.appendChild(dual);
    els.canvas = c1;
    els.canvasTop = c2;
    sc.init(c1, c2);
  } else {
    const c = document.createElement('canvas');
    c.id = 'simCanvas';
    c.setAttribute('aria-label', 'Optics simulation');
    wrap.appendChild(c);
    els.canvas = c;
    els.canvasTop = null;
    sc.init(c);
  }
}

function syncLegendRayColors() {
  const colors = getRayColors();
  document.getElementById('legendRealStroke')?.setAttribute('stroke', colors.real);
  document.getElementById('legendRealFill')?.setAttribute('fill', colors.real);
  document.getElementById('legendVirtualStroke')?.setAttribute('stroke', colors.virtual);
}

function handleRayColorChange() {
  syncLegendRayColors();
  refreshRayColorPanel();
  getScenario()._refreshToolbar?.();
  updateResults();
  render();
}

function rebuildControls() {
  const sc = getScenario();
  els.controls.innerHTML = '';

  const controlsPanel = els.controls.closest('.panel-section');
  const controlsTitle = controlsPanel?.querySelector('.panel-title');
  if (controlsTitle) {
    const key = sc.controlsTitleKey || 'controls';
    controlsTitle.dataset.i18n = key;
    controlsTitle.textContent = t(key);
  }

  sc._refreshRayColors = sc.id !== 'raySketch'
    ? buildRayColorControls(els.controls, {
      getSelectedRays: () => sc.getSelectedRays?.() || [],
      setSelectedRayColors: (hex) => sc.setSelectedRayColors?.(hex),
      onChange: handleRayColorChange,
    })
    : null;

  sc.getControls().forEach((ctrl) => {
    const g = document.createElement('div');
    g.className = 'control-group';
    const id = `ctrl-${ctrl.id}`;
    const displayValue = ctrl.valueMap
      ? ctrl.valueMap[Math.round(ctrl.value)]
      : ctrl.value;
    g.innerHTML = `
      <div class="label-row">
        <span data-i18n="${ctrl.labelKey}"></span>
        <span class="badge" id="${id}-val">${displayValue}${ctrl.unit || ''}</span>
      </div>
    `;
    if (ctrl.options) {
      const select = document.createElement('select');
      select.id = id;
      select.className = 'control-select';
      ctrl.options.forEach((opt) => {
        const o = document.createElement('option');
        o.value = String(opt);
        o.textContent = `${opt}${ctrl.unit || ''}`;
        if (opt === ctrl.value) o.selected = true;
        select.appendChild(o);
      });
      g.appendChild(select);
      select.addEventListener('change', () => {
        const v = parseFloat(select.value);
        sc.updateParams(ctrl.id, v);
        g.querySelector('.badge').textContent = `${v}${ctrl.unit || ''}`;
        updateResults();
        render();
      });
    } else {
      g.innerHTML += `
        <input type="range" id="${id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${ctrl.value}">
      `;
      const slider = g.querySelector('input');
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        sc.updateParams(ctrl.id, v);
        const shown = ctrl.valueMap ? ctrl.valueMap[Math.round(v)] : v;
        g.querySelector('.badge').textContent = `${shown}${ctrl.unit || ''}`;
        updateResults();
        render();
      });
    }
    els.controls.appendChild(g);
  });

  if (sc.buildToolbar) {
    sc._refreshToolbar = sc.buildToolbar(els.controls, () => {
      refreshRayColorPanel();
      updateResults();
      render();
    });
    const colorPanel = els.controls.querySelector('.ray-color-panel');
    if (colorPanel && colorPanel !== els.controls.firstElementChild) {
      els.controls.insertBefore(colorPanel, els.controls.firstElementChild);
    }
  } else if (sc.extraToggles) {
    const row = document.createElement('div');
    row.className = 'btn-row';
    sc.extraToggles.forEach((tog) => {
      const btn = document.createElement('button');
      const isOn = (p) => p[tog.id] !== false;
      btn.className = 'btn' + (isOn(sc.params || {}) ? ' btn-primary' : '');
      btn.dataset.i18n = tog.labelKey;
      btn.textContent = t(tog.labelKey);
      btn.addEventListener('click', () => {
        const cur = sc.params?.[tog.id] !== false;
        sc.updateParams(tog.id, !cur);
        btn.classList.toggle('btn-primary', !cur);
        render();
      });
      row.appendChild(btn);
    });
    els.controls.appendChild(row);
    applyI18n(row);
  }

  if (!sc.buildToolbar && sc.extraButtons) {
    const row = document.createElement('div');
    row.className = 'btn-row';
    sc.extraButtons.forEach((btnDef) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-accent';
      btn.dataset.i18n = btnDef.labelKey;
      if (btnDef.toggle) {
        let on = sc.params?.[btnDef.id] === true;
        btn.classList.toggle('btn-primary', on);
        btn.addEventListener('click', () => {
          if (sc.handleAction) sc.handleAction(btnDef.id);
          else {
            on = !on;
            sc.updateParams(btnDef.id, on);
          }
          rebuildControls();
          updateResults();
          render();
        });
      } else {
        btn.addEventListener('click', () => {
          if (sc.handleAction) sc.handleAction(btnDef.id);
          else sc.updateParams(btnDef.id, true);
          updateResults();
          render();
        });
      }
      row.appendChild(btn);
    });
    els.controls.appendChild(row);
    applyI18n(row);
  }

  applyI18n(els.controls);
  syncLegendRayColors();
}

function updateSceneBadge() {
  const sc = getScenario();
  if (els.sceneBadge) {
    els.sceneBadge.textContent = t(`concept.${TAB_KEYS[currentIdx]}`) || '';
  }
}

function updateResults() {
  const sc = getScenario();
  const c = sc.compute();
  updateResultsPanel();
  els.stats.innerHTML = '';
  if (!sc.hideResults) {
    (sc.getStats(c) || []).forEach((row) => {
    const div = document.createElement('div');
    div.className = 'stat-row';
    const valCls = row.ok ? 'ok' : row.fail ? 'fail' : '';
    div.innerHTML = `<span>${row.label}</span><span class="stat-val ${valCls}">${row.value}</span>`;
    els.stats.appendChild(div);
    });
  }
  const fallback = sc.getFormula(c) || '';
  const latex = buildLatex(sc, c);
  renderFormulaPanel(els.formulaLatex, els.formula, latex, fallback, {
    keepFallback: sc.id === 'raySketch',
  });
  els.desc.textContent = sc.getDescription();
  updateSceneBadge();
}

function render() {
  const sc = getScenario();
  if (sc.dualCanvas) sc.draw(els.canvas, els.canvasTop);
  else sc.draw(els.canvas);
  updateResults();
}

function bindAnim() {
  document.getElementById('btnPlay').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    if (!anim?.play) return;
    anim.play();
  });
  document.getElementById('btnPause').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.pause?.();
    render();
  });
  document.getElementById('btnStep').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.stepNext?.();
    render();
  });
  document.getElementById('btnShowAll').addEventListener('click', () => {
    const anim = getScenario().getAnimator?.();
    anim?.showAll?.();
    render();
  });
  document.getElementById('btnReplay').addEventListener('click', () => {
    const sc = getScenario();
    if (sc.replayAnimation) {
      sc.replayAnimation();
    } else {
      const anim = sc.getAnimator?.();
      anim?.reset?.();
      anim?.play?.();
    }
    render();
  });
}

function bindReset() {
  document.getElementById('btnReset').addEventListener('click', () => {
    getScenario().preset();
    rebuildControls();
    getScenario().getAnimator?.()?.reset?.();
    render();
  });
}

function refreshLangUi() {
  applyI18n();
  buildTabs();
  const sc = getScenario();
  buildSubTabs(sc);
  rebuildControls();
  updateResults();
  applyI18n(document.getElementById('legendPanel'));
  render();
}

function bindLangToggle() {
  const handler = () => {
    toggleLang();
    refreshLangUi();
  };
  document.getElementById('langToggle')?.addEventListener('click', handler);
}

function bindHubLangSync() {
  window.addEventListener('message', (ev) => {
    if (ev.data?.type !== 's3phy:lang') return;
    const next = hubLangToLocal(ev.data.lang);
    if (next === getLang()) return;
    setLang(next);
    refreshLangUi();
  });
}

function init() {
  els.controls = document.getElementById('controls');
  els.stats = document.getElementById('stats');
  els.formula = document.getElementById('formula');
  els.formulaLatex = document.getElementById('formulaLatex');
  els.desc = document.getElementById('desc');
  els.subTabs = document.getElementById('subTabs');
  els.vizPanel = document.getElementById('vizPanel');
  els.sceneBadge = document.getElementById('sceneBadge');

  initLangFromLocation();
  bindLangToggle();
  bindHubLangSync();

  applyI18n();
  buildTabs();
  setupCanvas();
  const sc = getScenario();
  if (sc.getSubTabs) {
    currentSub = sc.getSubTabs()[0];
    sc.setSub(currentSub);
  }
  buildSubTabs(sc);
  rebuildControls();
  updateAnimPanel();
  updateResultsPanel();
  bindAnim();
  bindReset();
  syncLegendRayColors();
  render();

  window.addEventListener('resize', () => render());
}

document.addEventListener('DOMContentLoaded', init);
