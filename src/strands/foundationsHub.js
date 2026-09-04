import { t, getLang } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, hydrateSummaryCards, loadToolId, saveToolId } from './hubHelpers.js';
import { FOUNDATIONS_HUB_SECTIONS, mountHubShell, resolveHubSection } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';
import { mountFlashcardStudy } from '../flashcards/flashcardStudy.js';
import { buildFoundationsDeck } from '../flashcards/flashcardDeck.js';

const TOOL_ORDER = ['siUnits'];
const TOOL_STORAGE_KEY = 's3phy.foundations.tool';
const TOOL_LOADERS = {
  siUnits: () => import('../tools/siUnitsLab.js').then((m) => m.createSiUnitsLab),
};

function toolLabel(id) {
  const map = { siUnits: 'tools.siUnits.title' };
  return t(map[id] || id);
}

const FOUNDATIONS_TOPICS = [
  {
    id: 'quantitiesUnits',
    titleKey: 'topic.quantitiesUnits',
    fileEn: 'quantities-units-en.pdf',
    fileZh: 'quantities-units-zhHant.pdf',
  },
  {
    id: 'usefulMaths',
    titleKey: 'topic.usefulMaths',
    fileEn: 'useful-mathematics-en.pdf',
    fileZh: 'useful-mathematics-zhHant.pdf',
  },
];

const FOUNDATIONS_SUMMARY_ROWS = [
  {
    key: 'quantitiesUnits',
    type: 'image',
    fileEn: 'quantities-units-en.webp',
    fileZh: 'quantities-units-zhHant.webp',
  },
  {
    key: 'usefulMaths',
    type: 'image',
    fileEn: 'useful-mathematics-en.webp',
    fileZh: 'useful-mathematics-zhHant.webp',
  },
];

const FOUNDATIONS_DECK_OPTIONS = [
  { value: 'all', labelKey: 'flashcards.all' },
  { value: 'quantitiesUnits', labelKey: 'topic.quantitiesUnits' },
  { value: 'usefulMaths', labelKey: 'topic.usefulMaths' },
];

export function mountFoundationsHub(root) {
  let section = resolveHubSection(
    sessionStorage.getItem('s3phy.foundations.section'),
    'notes',
    FOUNDATIONS_HUB_SECTIONS,
  );
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'siUnits');
  let shell = null;
  let el = { main: null };
  let activeLabInstance = null;
  let destroyQuiz = null;
  let destroyWorksheet = null;
  let destroyFlashcards = null;

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
    activeLabInstance = factory(t);
    stage.appendChild(activeLabInstance);
  }

  async function mountWorksheet(panel) {
    const { createFoundationsNotesWorksheet } = await import('../worksheets/foundationsNotesWorksheet.js');
    const node = createFoundationsNotesWorksheet(t);
    panel.appendChild(node);
    destroyWorksheet = node._foundationsNotesWorksheetCleanup || null;
  }

  async function mountQuiz(panel) {
    const { createFoundationsQuantitiesQuiz } = await import('../worksheets/foundationsQuantitiesQuiz.js');
    const node = createFoundationsQuantitiesQuiz(t);
    panel.appendChild(node);
    destroyQuiz = node._foundationsQuantitiesQuizCleanup || null;
  }

  function renderMain() {
    if (!el.main) return;

    destroyQuiz?.();
    destroyQuiz = null;
    destroyWorksheet?.();
    destroyWorksheet = null;
    destroyFlashcards?.();
    destroyFlashcards = null;
    cleanupActiveLab();

    if (section === 'notes') {
      el.main.innerHTML = renderNotesShell();
      void hydrateNotes();
    } else if (section === 'tools') {
      el.main.innerHTML = renderToolsShell({
        toolOrder: TOOL_ORDER,
        toolId,
        getLabel: toolLabel,
        t,
      });
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
    } else if (section === 'summary') {
      el.main.innerHTML = renderSummary();
      void hydrateSummary();
    } else if (section === 'worksheets') {
      el.main.innerHTML = '<section class="panel panel--worksheets-embed"></section>';
      const panel = el.main.querySelector('.panel--worksheets-embed');
      void mountWorksheet(panel);
    } else if (section === 'quiz') {
      el.main.innerHTML = '<section class="panel panel--quiz-embed"></section>';
      const panel = el.main.querySelector('.panel--quiz-embed');
      void mountQuiz(panel);
    } else if (section === 'flashcards') {
      destroyFlashcards = mountFlashcardStudy(el.main, {
        deckOptions: FOUNDATIONS_DECK_OPTIONS.map((o) => ({
          value: o.value,
          label: t(o.labelKey),
        })),
        buildDeck: (key) => buildFoundationsDeck(key, getLang()),
        introKey: 'flashcards.introFoundations',
      });
    }
  }

  function onLangChange() {
    shell?.refreshLabels();
    renderMain();
  }

  function render() {
    shell?.destroy();
    shell = mountHubShell(root, {
      subtitleKey: 'strand.foundations.subtitle',
      activeSection: section,
      sections: FOUNDATIONS_HUB_SECTIONS,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.foundations.section', id);
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
          ${FOUNDATIONS_TOPICS.map(
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
    const rows = FOUNDATIONS_TOPICS.map((r) => ({
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
        <div class="grid cols-2" data-summary-grid>
          ${FOUNDATIONS_TOPICS.map(
            (topic) => `
            <div class="card" data-summary-card="${topic.id}">
              <h3>${t(`summary.item.${topic.id}`)}</h3>
              <div data-summary-body></div>
            </div>`,
          ).join('')}
        </div>
      </section>`;
  }

  async function hydrateSummary() {
    await hydrateSummaryCards(root, FOUNDATIONS_SUMMARY_ROWS);
  }

  window.addEventListener('s3phy:lang', onLangChange);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLangChange);
    destroyQuiz?.();
    destroyWorksheet?.();
    destroyFlashcards?.();
    cleanupActiveLab();
    shell?.destroy();
  };
}
