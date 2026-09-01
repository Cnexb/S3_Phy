import { t } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, loadToolId, saveToolId } from './hubHelpers.js';
import { mountHubShell, resolveHubSection } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';

const TOOL_STORAGE_KEY = 's3phy.radioactivity.tool';
const TOOL_ORDER = ['radiationDeflection'];

const TOOL_LOADERS = {
  radiationDeflection: () =>
    import('../tools/radiationDeflectionLab.js').then((m) => m.createRadiationDeflectionLab),
};

function toolLabel(id) {
  const map = {
    radiationDeflection: 'tools.radiationDeflection.title',
  };
  return t(map[id] || id);
}

const RADIOACTIVITY_TOPICS = [
  {
    id: 'radiationRadioactivity',
    titleKey: 'topic.radiationRadioactivity',
    fileEn: 'radiation-radioactivity-en.pdf',
    fileZh: 'radiation-radioactivity-zhHant.pdf',
  },
  {
    id: 'atomicModel',
    titleKey: 'topic.atomicModel',
    fileEn: 'atomic-model-en.pdf',
    fileZh: 'atomic-model-zhHant.pdf',
  },
  {
    id: 'nuclearEnergy',
    titleKey: 'topic.nuclearEnergy',
    fileEn: 'nuclear-energy-en.pdf',
    fileZh: 'nuclear-energy-zhHant.pdf',
  },
];

export function mountRadioactivityHub(root) {
  let section = resolveHubSection(sessionStorage.getItem('s3phy.radioactivity.section'));
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'radiationDeflection');
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
            <p class="lead" style="margin-bottom: 0;">${t('radioactivity.comingSoon')}</p>
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
      subtitleKey: 'strand.radioactivity.subtitle',
      activeSection: section,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.radioactivity.section', id);
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
          ${RADIOACTIVITY_TOPICS.map(
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
    const rows = RADIOACTIVITY_TOPICS.map((r) => ({
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
