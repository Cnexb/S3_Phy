import { t } from '../i18n.js';
import { cleanupLabInstance, hydrateNoteCards, hydrateSummaryCards, loadToolId, saveToolId } from './hubHelpers.js';
import { mountHubShell } from '../hubShell.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';

const TOOL_STORAGE_KEY = 's3phy.mechanics.tool';

const MECHANICS_TOPICS = [
  {
    id: 'positionMovement',
    titleKey: 'topic.positionMovement',
    fileEn: 'position-movement-en.pdf',
    fileZh: 'position-movement-zhHant.pdf',
  },
  {
    id: 'equationOfMotion',
    titleKey: 'topic.equationOfMotion',
    fileEn: 'equation-of-motion-en.pdf',
    fileZh: 'equation-of-motion-zhHant.pdf',
  },
  {
    id: 'verticalMotion',
    titleKey: 'topic.verticalMotion',
    fileEn: 'vertical-motion-en.pdf',
    fileZh: 'vertical-motion-zhHant.pdf',
  },
  {
    id: 'motionGraph',
    titleKey: 'topic.motionGraph',
    fileEn: 'motion-graph-en.pdf',
    fileZh: 'motion-graph-zhHant.pdf',
  },
  {
    id: 'forceI',
    titleKey: 'topic.forceI',
    fileEn: 'force-i-en.pdf',
    fileZh: 'force-i-zhHant.pdf',
  },
  {
    id: 'forceII',
    titleKey: 'topic.forceII',
    fileEn: 'force-ii-en.pdf',
    fileZh: 'force-ii-zhHant.pdf',
    tool: 'elevatorWeight',
  },
  {
    id: 'forceIII',
    titleKey: 'topic.forceIII',
    fileEn: 'force-iii-en.pdf',
    fileZh: 'force-iii-zhHant.pdf',
  },
  {
    id: 'moment',
    titleKey: 'topic.moment',
    fileEn: 'moment-en.pdf',
    fileZh: 'moment-zhHant.pdf',
  },
  {
    id: 'workEnergyPower',
    titleKey: 'topic.workEnergyPower',
    fileEn: 'work-energy-power-en.pdf',
    fileZh: 'work-energy-power-zhHant.pdf',
  },
  {
    id: 'momentum',
    titleKey: 'topic.momentum',
    fileEn: 'momentum-en.pdf',
    fileZh: 'momentum-zhHant.pdf',
  },
  {
    id: 'projectileMotion',
    titleKey: 'topic.projectileMotion',
    fileEn: 'projectile-motion-en.pdf',
    fileZh: 'projectile-motion-zhHant.pdf',
    tool: 'projectileMotion',
  },
  {
    id: 'circularMotion',
    titleKey: 'topic.circularMotion',
    fileEn: 'circular-motion-en.pdf',
    fileZh: 'circular-motion-zhHant.pdf',
  },
  {
    id: 'gravitationalForce',
    titleKey: 'topic.gravitationalForce',
    fileEn: 'gravitational-force-en.pdf',
    fileZh: 'gravitational-force-zhHant.pdf',
  },
];

const SUMMARY_POSTER_BASE = {
  positionMovement: 'position-movement',
  equationOfMotion: 'equation-of-motion',
  verticalMotion: 'vertical-motion',
  motionGraph: 'motion-graph',
  forceI: 'force-i',
  forceII: 'force-ii',
  forceIII: 'force-iii',
  moment: 'moment',
  workEnergyPower: 'work-energy-power',
  momentum: 'momentum',
  projectileMotion: 'projectile-motion',
  circularMotion: 'circular-motion',
  gravitationalForce: 'gravitational-force',
};

const MECHANICS_SUMMARY_ROWS = MECHANICS_TOPICS.map((r) => {
  const posterBase = SUMMARY_POSTER_BASE[r.id];
  return {
    key: r.id,
    type: 'image',
    fileEn: `${posterBase}-en.webp`,
    fileZh: `${posterBase}-zhHant.webp`,
  };
});

const TOOL_ORDER = ['vectorTool', 'elevatorWeight', 'projectileMotion'];

const TOOL_LOADERS = {
  vectorTool: () => import('../tools/vectorToolLab.js').then((m) => m.createVectorToolLab),
  elevatorWeight: () =>
    import('../tools/elevatorWeightLab.js').then((m) => m.createElevatorWeightLab),
  projectileMotion: () =>
    import('../tools/projectileMotionLab.js').then((m) => m.createProjectileMotionLab),
};

function toolLabel(id) {
  const map = {
    vectorTool: 'tools.vectorTool.title',
    elevatorWeight: 'tools.elevatorWeight.title',
    projectileMotion: 'tools.projectileMotion.title',
  };
  return t(map[id] || id);
}

export function mountMechanicsHub(root) {
  let section = sessionStorage.getItem('s3phy.mechanics.section') || 'topics';
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'projectileMotion');

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
    const node = factory(t);
    activeLabInstance = node;
    stage.appendChild(node);
  }

  function renderMain() {
    if (!el.main) return;

    if (section === 'topics') {
      el.main.innerHTML = renderTopics();
    } else if (section === 'notes') {
      el.main.innerHTML = renderNotesShell();
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
    } else if (section === 'worksheets') {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t('worksheets.practiceTitle')}</h2>
          <p class="lead">${t('worksheets.comingSoon')}</p>
        </section>
      `;
    } else if (section === 'quiz') {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t('quiz.practiceTitle')}</h2>
          <p class="lead">${t('quiz.comingSoon')}</p>
        </section>
      `;
    } else if (section === 'flashcards') {
      el.main.innerHTML = `
        <section class="panel">
          <h2>${t('flashcards.title')}</h2>
          <p class="lead">${t('flashcards.comingSoon')}</p>
        </section>
      `;
    } else if (section === 'summary') {
      el.main.innerHTML = renderSummary();
    }

    if (section === 'notes') void hydrateNotes();
    if (section === 'summary') void hydrateSummary();
  }

  function onLangChange() {
    shell?.refreshLabels();
    renderMain();
  }

  function render() {
    shell?.destroy();
    shell = mountHubShell(root, {
      subtitleKey: 'strand.mechanics.subtitle',
      activeSection: section,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.mechanics.section', id);
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
          ${MECHANICS_TOPICS.map((topic) => {
            const btn = topic.tool
              ? `<button class="btn primary" type="button" data-go-tool="${topic.tool}">${t('topic.openTool')}</button>`
              : `<button class="btn primary" type="button" data-go-section="notes">${t('topic.viewNotes')}</button>`;
            return `
            <div class="card">
              <h3>${t(topic.titleKey)}</h3>
              ${btn}
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  function onMainClick(ev) {
    const toolBtn = ev.target.closest('[data-go-tool]');
    if (toolBtn) {
      const targetTool = toolBtn.getAttribute('data-go-tool');
      if (TOOL_ORDER.includes(targetTool)) {
        toolId = targetTool;
        saveToolId(TOOL_STORAGE_KEY, toolId);
      }
      section = 'tools';
      sessionStorage.setItem('s3phy.mechanics.section', 'tools');
      shell.updateSection(section);
      renderMain();
      return;
    }
    const notesBtn = ev.target.closest('[data-go-section]');
    if (notesBtn?.getAttribute('data-go-section') === 'notes') {
      section = 'notes';
      sessionStorage.setItem('s3phy.mechanics.section', 'notes');
      shell.updateSection(section);
      renderMain();
    }
  }

  function renderNotesShell() {
    return `
      <section class="panel">
        <h2>${t('notes.title')}</h2>
        <p class="lead">${t('notes.intro')}</p>
        <p class="lead">${t('notes.embedHint')}</p>
        <div class="grid cols-2" data-notes-grid>
          ${MECHANICS_TOPICS.map((r) => `
            <div class="card" data-note-card="${r.id}">
              <h3>${t(`notes.card.${r.id}`)}</h3>
              <div data-note-body></div>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  async function hydrateNotes() {
    const rows = MECHANICS_TOPICS.map((r) => ({
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
          ${MECHANICS_TOPICS.map((it) => `
            <div class="card" data-summary-card="${it.id}">
              <h3>${t(`summary.item.${it.id}`)}</h3>
              <div data-summary-body></div>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  async function hydrateSummary() {
    await hydrateSummaryCards(root, MECHANICS_SUMMARY_ROWS);
  }

  window.addEventListener('s3phy:lang', onLangChange);
  root.addEventListener('click', onMainClick);

  render();

  return () => {
    window.removeEventListener('s3phy:lang', onLangChange);
    root.removeEventListener('click', onMainClick);
    cleanupActiveLab();
    shell?.destroy();
  };
}
