import { t } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, loadToolId, saveToolId } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';

const TOOL_STORAGE_KEY = 's3phy.gas.tool';
const TOOL_ORDER = [
  'boylesLaw',
  'charlesLaw',
  'pressureLaw',
  'connectedContainers',
  'kineticTheory',
];

const TOOL_LOADERS = {
  boylesLaw: () => import('../tools/boylesLawLab.js').then((m) => m.createBoylesLawLab),
  charlesLaw: () => import('../tools/charlesLawLab.js').then((m) => m.createCharlesLawLab),
  pressureLaw: () => import('../tools/pressureLawLab.js').then((m) => m.createPressureLawLab),
  connectedContainers: () =>
    import('../tools/connectedContainersLab.js').then((m) => m.createConnectedContainersLab),
  kineticTheory: () => import('../tools/kineticTheoryLab.js').then((m) => m.createKineticTheoryLab),
};

function toolLabel(id) {
  const map = {
    boylesLaw: 'tools.boylesLaw.title',
    charlesLaw: 'tools.charlesLaw.title',
    pressureLaw: 'tools.pressureLaw.title',
    connectedContainers: 'tools.connectedContainers.title',
    kineticTheory: 'tools.kineticTheory.title',
  };
  return t(map[id] || id);
}

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
  let section = resolveHubSection(sessionStorage.getItem('s3phy.gas.section'));
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'boylesLaw');
  let shell = null;
  let el = { main: null };
  let activeLabInstance = null;

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

  function renderMain() {
    if (!el.main) return;

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
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
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

  function renderNotesShell() {
    return `
      <section class="panel">
        <h2>${t('notes.title')}</h2>
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

  window.addEventListener('s3phy:lang', onLangChange);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLangChange);
    cleanupActiveLab();
    shell?.destroy();
  };
}
