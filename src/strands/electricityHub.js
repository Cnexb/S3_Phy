import { t } from '../i18n.js';
import { hydrateNoteCards } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';

const ELECTRICITY_TOPICS = [
  {
    id: 'electrostatics',
    titleKey: 'topic.electrostatics',
    fileEn: 'electrostatics-en.pdf',
    fileZh: 'electrostatics-zhHant.pdf',
  },
  {
    id: 'electricCircuits',
    titleKey: 'topic.electricCircuits',
    fileEn: 'electric-circuits-en.pdf',
    fileZh: 'electric-circuits-zhHant.pdf',
  },
  {
    id: 'domesticElectricity',
    titleKey: 'topic.domesticElectricity',
    fileEn: 'domestic-electricity-en.pdf',
    fileZh: 'domestic-electricity-zhHant.pdf',
  },
  {
    id: 'electromagnetism',
    titleKey: 'topic.electromagnetism',
    fileEn: 'electromagnetism-en.pdf',
    fileZh: 'electromagnetism-zhHant.pdf',
  },
  {
    id: 'electromagneticInduction',
    titleKey: 'topic.electromagneticInduction',
    fileEn: 'electromagnetic-induction-en.pdf',
    fileZh: 'electromagnetic-induction-zhHant.pdf',
  },
];

export function mountElectricityHub(root) {
  let section = resolveHubSection(sessionStorage.getItem('s3phy.electricity.section'));
  let shell = null;
  let el = { main: null };

  function renderMain() {
    if (!el.main) return;

    if (section === 'notes') {
      el.main.innerHTML = renderNotesShell();
      void hydrateNotes();
    } else {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t(`nav.${section}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t('electricity.comingSoon')}</p>
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
      subtitleKey: 'strand.electricity.subtitle',
      activeSection: section,
      onSection: (id) => {
        section = id;
        sessionStorage.setItem('s3phy.electricity.section', id);
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
          ${ELECTRICITY_TOPICS.map(
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
    const rows = ELECTRICITY_TOPICS.map((r) => ({
      key: r.id,
      fileEn: r.fileEn,
      fileZh: r.fileZh,
    }));
    await hydrateNoteCards(root, rows);
  }

  window.addEventListener('s3phy:lang', onLangChange);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLangChange);
    shell?.destroy();
  };
}
