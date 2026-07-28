import { t } from '../i18n.js';
import { hydrateNoteCards } from './hubHelpers.js';
import { mountHubShell } from '../hubShell.js';

const GAS_TOPICS = [
  {
    id: 'gasLaws',
    titleKey: 'topic.gasLaws',
    fileEn: 'gas-laws-en.pdf',
    fileZh: 'gas-laws-zhHant.pdf',
  },
  {
    id: 'kineticTheory',
    titleKey: 'topic.kineticTheory',
    fileEn: 'kinetic-theory-en.pdf',
    fileZh: 'kinetic-theory-zhHant.pdf',
  },
];

export function mountGasHub(root) {
  let section = sessionStorage.getItem('s3phy.gas.section') || 'topics';
  let shell = null;
  let el = { main: null };

  function renderMain() {
    if (!el.main) return;

    if (section === 'topics') {
      el.main.innerHTML = renderTopics();
    } else if (section === 'notes') {
      el.main.innerHTML = renderNotesShell();
      void hydrateNotes();
    } else {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t(`nav.${section}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t('gas.comingSoon')}</p>
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
      subtitleKey: 'strand.gas.subtitle',
      activeSection: section,
      onSection: (id) => {
        section = id;
        sessionStorage.setItem('s3phy.gas.section', id);
        shell.updateSection(section);
        renderMain();
      },
      onLang: onLangChange,
    });
    el.main = shell.main;
    shell.updateSection(section);
    renderMain();
  }

  function renderTopics() {
    return `
      <section class="panel panel--topic-hub">
        <h2>${t('topics.title')}</h2>
        <p class="lead">${t('topics.intro')}</p>
        <div class="grid cols-2 topic-hub-grid">
          ${GAS_TOPICS.map(
            (topic) => `
            <div class="card">
              <h3>${t(topic.titleKey)}</h3>
              <button class="btn primary" type="button" data-go-section="notes">${t('topic.viewNotes')}</button>
            </div>`,
          ).join('')}
        </div>
      </section>
    `;
  }

  function renderNotesShell() {
    return `
      <section class="panel">
        <h2>${t('notes.title')}</h2>
        <p class="lead">${t('notes.intro')}</p>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-2" data-notes-grid>
          ${GAS_TOPICS.map(
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
    const rows = GAS_TOPICS.map((r) => ({
      key: r.id,
      fileEn: r.fileEn,
      fileZh: r.fileZh,
    }));
    await hydrateNoteCards(root, rows);
  }

  function onMainClick(ev) {
    const notesBtn = ev.target.closest('[data-go-section]');
    if (notesBtn?.getAttribute('data-go-section') === 'notes') {
      section = 'notes';
      sessionStorage.setItem('s3phy.gas.section', 'notes');
      shell.updateSection(section);
      renderMain();
    }
  }

  window.addEventListener('s3phy:lang', onLangChange);
  root.addEventListener('click', onMainClick);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLangChange);
    root.removeEventListener('click', onMainClick);
    shell?.destroy();
  };
}
