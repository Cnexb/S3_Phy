import { t, getLang } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, hydrateSummaryCards, loadToolId, saveToolId } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';
import { mountFlashcardStudy } from '../flashcards/flashcardStudy.js';
import { buildHeatDeck } from '../flashcards/flashcardDeck.js';

const HEAT_TOPICS = [
  {
    id: 'thermometer',
    titleKey: 'topic.thermometer',
    fileEn: 'thermometer-en.pdf',
    fileZh: 'thermometer-zhHant.pdf',
    tool: 'liquid',
  },
  {
    id: 'heatInternalEnergy',
    titleKey: 'topic.heatInternalEnergy',
    fileEn: 'heat-internal-energy-en.pdf',
    fileZh: 'heat-internal-energy-zhHant.pdf',
    tool: 'heatingMaterials',
  },
  {
    id: 'changeOfState',
    titleKey: 'topic.changeOfState',
    fileEn: 'change-of-state-en.pdf',
    fileZh: 'change-of-state-zhHant.pdf',
    tool: 'changeOfState',
  },
  {
    id: 'heatTransfer',
    titleKey: 'topic.heatTransfer',
    fileEn: 'heat-transfer-en.pdf',
    fileZh: 'heat-transfer-zhHant.pdf',
    tool: 'heatFlow',
  },
];

const SUMMARY_POSTER_BASE = {
  thermometer: 'thermometer',
  heatInternalEnergy: 'heat-internal-energy',
  changeOfState: 'change-of-state',
  heatTransfer: 'heat-transfer',
};

const HEAT_SUMMARY_ROWS = HEAT_TOPICS.map((r) => {
  const posterBase = SUMMARY_POSTER_BASE[r.id];
  return {
    key: r.id,
    type: 'image',
    fileEn: `${posterBase}-en.webp`,
    fileZh: `${posterBase}-zhHant.webp`,
  };
});

const TOOL_ORDER = [
  'liquid', 'boilingWater', 'heatingMaterials', 'changeOfState', 'heatFlow', 'heatTransfer',
];
const TOOL_STORAGE_KEY = 's3phy.heat.tool';

const TOOL_LOADERS = {
  liquid: () => import('../tools/thermometerLab.js').then((m) => m.createThermometerLab),
  boilingWater: () => import('../tools/boilingWaterLab.js').then((m) => m.createBoilingWaterLab),
  heatingMaterials: () => import('../tools/heatingMaterialsLab.js').then((m) => m.createHeatingMaterialsLab),
  changeOfState: () => import('../tools/changeOfStateLab.js').then((m) => m.createChangeOfStateLab),
  heatFlow: () => import('../tools/heatFlowLab.js').then((m) => m.createHeatFlowLab),
  heatTransfer: () => import('../tools/heatTransferLab.js').then((m) => m.createHeatTransferLab),
};

function toolLabel(id) {
  const map = {
    liquid: 'tools.thermometerLab.liquid.title',
    boilingWater: 'tools.boilingWater.title',
    heatingMaterials: 'tools.heatingMaterials.title',
    changeOfState: 'tools.changeOfState.title',
    heatFlow: 'tools.heatFlow.title',
    heatTransfer: 'tools.heatTransfer.title',
  };
  return t(map[id] || id);
}

export function mountHeatHub(root) {
  let section = resolveHubSection(sessionStorage.getItem('s3phy.heat.section'), 'notes');
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'liquid');

  let shell = null;
  let el = { main: null };
  let activeLabInstance = null;
  let destroyFlashcards = null;
  let destroyWorksheet = null;

  const HEAT_DECK_OPTIONS = [
    { value: 'all', labelKey: 'flashcards.all' },
    { value: 'thermometry', labelKey: 'flashcards.deck.thermometry' },
    { value: 'heatInternalEnergy', labelKey: 'flashcards.deck.heatInternalEnergy' },
    { value: 'changeOfState', labelKey: 'flashcards.deck.changeOfState' },
    { value: 'heatTransfer', labelKey: 'flashcards.deck.heatTransfer' },
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
    activeLabInstance = toolId === 'liquid' ? factory(t, { type: 'liquid' }) : factory(t);
    stage.appendChild(activeLabInstance);
  }

  async function mountWorksheet(panel) {
    const { createHeatFinalExamWorksheet } = await import('../worksheets/heatFinalExamWorksheet.js');
    const node = createHeatFinalExamWorksheet(t);
    panel.appendChild(node);
    destroyWorksheet = node._heatFinalExamWorksheetCleanup || null;
  }

  async function mountQuiz(panel) {
    const { createHeatCh1Quiz } = await import('../worksheets/heatCh1Quiz.js');
    const node = createHeatCh1Quiz(t);
    panel.appendChild(node);
    destroyWorksheet = node._heatCh1QuizCleanup || null;
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
      el.main.innerHTML = '<section class="panel panel--worksheets-embed"></section>';
      const panel = el.main.querySelector('.panel--worksheets-embed');
      void mountWorksheet(panel);
    } else if (section === 'quiz') {
      el.main.innerHTML = '<section class="panel panel--quiz-embed"></section>';
      const panel = el.main.querySelector('.panel--quiz-embed');
      void mountQuiz(panel);
    } else if (section === 'flashcards') {
      destroyFlashcards = mountFlashcardStudy(el.main, {
        deckOptions: HEAT_DECK_OPTIONS.map((o) => ({
          value: o.value,
          label: t(o.labelKey),
        })),
        buildDeck: (key) => buildHeatDeck(key, getLang()),
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
      subtitleKey: 'strand.heat.subtitle',
      activeSection: section,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.heat.section', id);
        shell.updateSection(section);
        renderMain();
      },
      onLang: onLangChange,
    });
    el.main = shell.main;
    shell.updateSection(section);
    renderMain();
  }

  function renderNotesShell() {
    return `
      <section class="panel">
        <h2>${t('notes.title')}</h2>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-2" data-notes-grid>
          ${HEAT_TOPICS.map(
            (r) => `
            <div class="card" data-note-card="${r.id}">
              <h3>${t(`notes.card.${r.id}`)}</h3>
              <div data-note-body></div>
            </div>`,
          ).join('')}
        </div>
      </section>`;
  }

  async function hydrateNotes() {
    const rows = HEAT_TOPICS.map((r) => ({
      key: r.id,
      fileEn: r.fileEn,
      fileZh: r.fileZh,
    }));
    await hydrateNoteCards(root, rows);
  }

  function renderSummary() {
    return `
      <section class="panel">
        <h2>${t('summary.title')}</h2>
        <p class="lead">${t('summary.intro')}</p>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-4" data-summary-grid>
          ${HEAT_TOPICS.map(
            (it) => `
            <div class="card" data-summary-card="${it.id}">
              <h3>${t(`summary.item.${it.id}`)}</h3>
              <div data-summary-body></div>
            </div>`,
          ).join('')}
        </div>
      </section>`;
  }

  async function hydrateSummary() {
    await hydrateSummaryCards(root, HEAT_SUMMARY_ROWS);
  }

  const onLang = onLangChange;

  window.addEventListener('s3phy:lang', onLang);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLang);
    destroyFlashcards?.();
    cleanupActiveLab();
    shell?.destroy();
  };
}
