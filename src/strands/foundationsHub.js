import { t, getLang } from '../i18n.js';
import { hydrateNoteCards, hydrateSummaryCards } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';
import { mountFlashcardStudy } from '../flashcards/flashcardStudy.js';
import { buildFoundationsDeck } from '../flashcards/flashcardDeck.js';

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
  let section = resolveHubSection(sessionStorage.getItem('s3phy.foundations.section'));
  let shell = null;
  let el = { main: null };
  let destroyQuiz = null;
  let destroyFlashcards = null;

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
    destroyFlashcards?.();
    destroyFlashcards = null;

    if (section === 'notes') {
      el.main.innerHTML = renderNotesShell();
      void hydrateNotes();
    } else if (section === 'summary') {
      el.main.innerHTML = renderSummary();
      void hydrateSummary();
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
    } else {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t(`nav.${section}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t('foundations.comingSoon')}</p>
          </div>
        </section>
      `;
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
      onSection: (id) => {
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
    destroyFlashcards?.();
    shell?.destroy();
  };
}
