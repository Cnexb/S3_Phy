import { t, getLang } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, hydrateSummaryCards, loadToolId, saveToolId } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';
import { mountFlashcardStudy } from '../flashcards/flashcardStudy.js';
import { buildOpticsDeck } from '../flashcards/flashcardDeck.js';

const TOOL_ORDER = ['rotatingMirror', 'planeMirrorLab', 'reflection3d', 'refraction', 'refractionTir', 'lens', 'rgbMixer', 'em'];
const TOOL_STORAGE_KEY = 's3phy.optics.tool';
const WORKSHEET_ORDER = ['lightLens', 'emWave'];
const SUMMARY_ASSET_VERSION = '20260627-em-v2';

const OPTICS_NOTE_ROWS = [
  { key: 'reflection', fileEn: 'reflection-en.pdf', fileZh: 'reflection-zhHant.pdf' },
  { key: 'refraction', fileEn: 'refraction-en.pdf', fileZh: 'refraction-zhHant.pdf' },
  { key: 'tir', fileEn: 'tir-en.pdf', fileZh: 'tir-zhHant.pdf' },
  { key: 'convexLens', fileEn: 'convex-lens-en.pdf', fileZh: 'convex-lens-zhHant.pdf' },
  { key: 'concaveLens', fileEn: 'concave-lens-en.pdf', fileZh: 'concave-lens-zhHant.pdf' },
  { key: 'em', fileEn: 'emwaves-en.pdf', fileZh: 'emwaves-zhHant.pdf' },
];

const OPTICS_SUMMARY_ROWS = [
  { key: 'reflection', type: 'image', fileEn: 'reflection-en.webp', fileZh: 'reflection-zhHant.webp' },
  { key: 'refraction', type: 'image', fileEn: 'refraction-en.webp', fileZh: 'refraction-zhHant.webp' },
  { key: 'tir', type: 'image', fileEn: 'tir-en.webp', fileZh: 'tir-zhHant.webp' },
  { key: 'convex', type: 'image', fileEn: 'convex-en.webp', fileZh: 'convex-zhHant.webp' },
  { key: 'concave', type: 'image', fileEn: 'concave-en.webp', fileZh: 'concave-zhHant.webp' },
  { key: 'em', type: 'image', fileEn: 'em-en.webp', fileZh: 'em-zhHant.webp' },
];

const WORKSHEET_LOADERS = {
  lightLens: () =>
    import('../worksheets/opticsLightLensWorksheet.js').then((m) => m.createOpticsLightLensWorksheet),
  emWave: () =>
    import('../worksheets/opticsCh4EmWorksheet.js').then((m) => m.createOpticsCh4EmWorksheet),
};

const TOOL_LOADERS = {
  rotatingMirror: () => import('../tools/rotatingMirrorLab.js').then((m) => m.createRotatingMirrorLab),
  planeMirrorLab: () => import('../tools/planeMirrorLab.js').then((m) => m.createPlaneMirrorLab),
  reflection3d: () => import('../tools/reflection3dLab.js').then((m) => m.createReflection3dLab),
  refraction: () => import('../tools/refractionLab.js').then((m) => m.createRefractionLab),
  refractionTir: () => import('../tools/tirEscapeLab.js').then((m) => m.createTirEscapeLab),
  lens: () => import('../tools/lensLab.js').then((m) => m.createLensLab),
  rgbMixer: () => import('../tools/rgbColorMixerLab.js').then((m) => m.createRgbColorMixerLab),
  em: () => import('../tools/emLab.js').then((m) => m.createEmLab),
};

function toolLabel(id) {
  const map = {
    rotatingMirror: 'tools.rotatingMirror.title',
    planeMirrorLab: 'tools.planeMirror.title',
    reflection3d: 'tools.reflection3d.title',
    refraction: 'tools.refraction.title',
    refractionTir: 'tools.refractionTir.title',
    lens: 'tools.lens.title',
    rgbMixer: 'tools.rgbMixer.title',
    em: 'tools.em.title',
  };
  return t(map[id] || id);
}

function worksheetLabel(id) {
  const map = {
    lightLens: 'worksheets.opticsLightLensTitle',
    emWave: 'worksheets.opticsEmWaveTitle',
  };
  return t(map[id] || id);
}

export function mountOpticsHub(root) {
  let section = resolveHubSection(sessionStorage.getItem('s3phy.optics.section'));
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'rotatingMirror');
  let worksheetId = 'lightLens';
  let lensDefaultKind = 'convex';

  let shell = null;
  let el = { main: null };
  let activeLabInstance = null;
  let destroyFlashcards = null;
  let destroyWorksheet = null;

  const OPTICS_DECK_OPTIONS = [
    { value: 'all', labelKey: 'flashcards.all' },
    { value: 'reflection', labelKey: 'topic.reflection' },
    { value: 'refractionTir', labelKey: 'flashcards.deck.refractionTir' },
    { value: 'convex', labelKey: 'topic.convex' },
    { value: 'concave', labelKey: 'topic.concave' },
    { value: 'em', labelKey: 'topic.em' },
  ];

  function cleanupActiveLab() {
    cleanupLabInstance(activeLabInstance);
    activeLabInstance = null;
  }

  async function mountActiveTool(stage) {
    stage.innerHTML = '';
    cleanupActiveLab();
    const loader = TOOL_LOADERS[toolId];
    if (!loader) return;
    const factory = await loader();
    const node = toolId === 'lens' ? factory(t, { defaultKind: lensDefaultKind }) : factory(t);
    activeLabInstance = node;
    stage.appendChild(node);
  }

  async function mountActiveWorksheet(stage) {
    if (!stage) return;
    destroyWorksheet?.();
    destroyWorksheet = null;
    stage.innerHTML = '';
    const loader = WORKSHEET_LOADERS[worksheetId];
    if (!loader) return;
    const factory = await loader();
    const node = factory(t);
    stage.appendChild(node);
    destroyWorksheet =
      node._opticsLightLensWorksheetCleanup ||
      node._opticsCh4EmWorksheetCleanup ||
      null;
  }

  async function mountQuiz(panel) {
    const { createOpticsCh3Quiz } = await import('../worksheets/opticsCh3Quiz.js');
    const node = createOpticsCh3Quiz(t);
    panel.appendChild(node);
    destroyWorksheet = node._opticsCh3QuizCleanup || null;
  }

  function renderWorksheets() {
    const buttons = WORKSHEET_ORDER.map(
      (id) =>
        `<button type="button" data-worksheet="${id}" class="${worksheetId === id ? 'active' : ''}">${worksheetLabel(id)}</button>`,
    ).join('');
    return `
      <section class="panel panel--worksheets-embed">
        <div class="worksheet-picker">
          <p class="lead">${t('worksheets.pick')}</p>
          <div class="tool-list" data-worksheet-list>${buttons}</div>
        </div>
        <div class="worksheet-stage" data-worksheet-stage></div>
      </section>`;
  }

  function renderMain() {
    if (!el.main) return;

    destroyFlashcards?.();
    destroyFlashcards = null;
    destroyWorksheet?.();
    destroyWorksheet = null;

    if (section === 'notes') el.main.innerHTML = renderNotesShell();
    else if (section === 'tools') {
      el.main.innerHTML = renderToolsShell({
        toolOrder: TOOL_ORDER,
        toolId,
        getLabel: toolLabel,
        t,
      });
    }
    else if (section === 'worksheets') {
      el.main.innerHTML = renderWorksheets();
      void mountActiveWorksheet(el.main.querySelector('[data-worksheet-stage]'));
    }
    else if (section === 'quiz') {
      el.main.innerHTML = '<section class="panel panel--quiz-embed"></section>';
      const panel = el.main.querySelector('.panel--quiz-embed');
      void mountQuiz(panel);
    }
    else if (section === 'flashcards') {
      destroyFlashcards = mountFlashcardStudy(el.main, {
        deckOptions: OPTICS_DECK_OPTIONS.map((o) => ({
          value: o.value,
          label: t(o.labelKey),
        })),
        buildDeck: (key) => buildOpticsDeck(key, getLang()),
      });
    } else if (section === 'summary') el.main.innerHTML = renderSummary();

    if (section === 'notes') void hydrateNotes();
    if (section === 'tools') {
      hydrateToolsShell(root, {
        getLabel: toolLabel,
        t,
        getActiveToolId: () => toolId,
        onSelectTool: (id) => {
          toolId = id;
          saveToolId(TOOL_STORAGE_KEY, toolId);
        },
        mountTool: (stage) => {
          void mountActiveTool(stage);
        },
      });
    }
    if (section === 'summary') void hydrateSummary();
  }

  function onLangChange() {
    shell?.refreshLabels();
    renderMain();
  }

  function render() {
    shell?.destroy();
    shell = mountHubShell(root, {
      subtitleKey: 'strand.optics.subtitle',
      activeSection: section,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.optics.section', id);
        shell.updateSection(section);
        renderMain();
      },
      onLang: onLangChange,
    });
    el.main = shell.main;
    shell.updateSection(section);
    renderMain();
  }

  function onMainClick(ev) {
    const ws = ev.target.closest('[data-worksheet]');
    if (ws && section === 'worksheets') {
      const id = ws.getAttribute('data-worksheet');
      if (id && id !== worksheetId && WORKSHEET_LOADERS[id]) {
        worksheetId = id;
        renderMain();
      }
    }
  }

  function renderNotesShell() {
    return `
      <section class="panel">
        <h2>${t('notes.title')}</h2>
        <p class="lead">${t('notes.intro')}</p>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-3x2" data-notes-grid>
          ${OPTICS_NOTE_ROWS.map((r) => {
            const title = t(`notes.card.${r.key}`);
            return `
            <div class="card" data-note-card="${r.key}">
              <h3>${title}</h3>
              <div data-note-body></div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  async function hydrateNotes() {
    await hydrateNoteCards(root, OPTICS_NOTE_ROWS);
  }

  function renderSummary() {
    return `
      <section class="panel">
        <h2>${t('summary.title')}</h2>
        <p class="lead">${t('summary.intro')}</p>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-3x2" data-summary-grid>
          ${OPTICS_SUMMARY_ROWS.map((it) => {
            const title = t(`summary.item.${it.key}`);
            return `
            <div class="card" data-summary-card="${it.key}">
              <h3>${title}</h3>
              <div data-summary-body></div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  async function hydrateSummary() {
    await hydrateSummaryCards(root, OPTICS_SUMMARY_ROWS, { version: SUMMARY_ASSET_VERSION });
  }

  const onLang = onLangChange;
  const onClick = (ev) => onMainClick(ev);

  window.addEventListener('s3phy:lang', onLang);
  root.addEventListener('click', onClick);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLang);
    root.removeEventListener('click', onClick);
    destroyFlashcards?.();
    destroyWorksheet?.();
    cleanupActiveLab();
    shell?.destroy();
  };
}
