import { t } from '../i18n.js';
import { mountHubShell } from '../hubShell.js';
import { cleanupLabInstance, hydrateNoteCards, loadToolId, saveToolId } from './hubHelpers.js';
import { renderToolsShell, hydrateToolsShell } from '../tools/toolsShell.js';

const TOOL_STORAGE_KEY = 's3phy.waves.tool';

const WAVES_TOPICS = [
  {
    id: 'waveMotion',
    titleKey: 'topic.waveMotion',
    fileEn: 'wave-motion-en.pdf',
    fileZh: 'wave-motion-zhHant.pdf',
    tool: 'waveMotion',
  },
  {
    id: 'waveProperties',
    titleKey: 'topic.waveProperties',
    fileEn: 'wave-properties-en.pdf',
    fileZh: 'wave-properties-zhHant.pdf',
    tool: 'waveInterference',
  },
  {
    id: 'stationaryWave',
    titleKey: 'topic.stationaryWave',
    fileEn: 'stationary-wave-en.pdf',
    fileZh: 'stationary-wave-zhHant.pdf',
  },
  {
    id: 'lightWave',
    titleKey: 'topic.lightWave',
    fileEn: 'light-wave-en.pdf',
    fileZh: 'light-wave-zhHant.pdf',
    tool: 'thinFilmInterference',
  },
  {
    id: 'soundWave',
    titleKey: 'topic.soundWave',
    fileEn: 'sound-wave-en.pdf',
    fileZh: 'sound-wave-zhHant.pdf',
    tool: 'ultrasoundReflection',
  },
];

const TOOL_ORDER = [
  'waveMotion',
  'longitudinalWave',
  'waveInterference',
  'waveDiffraction',
  'thinFilmInterference',
  'diffractionGratingCompare',
  'spectralOverlap',
  'ultrasoundReflection',
  'soundRefractionShadow',
];

const TOOL_LOADERS = {
  waveMotion: () => import('../tools/waveMotionLab.js').then((m) => m.createWaveMotionLab),
  longitudinalWave: () =>
    import('../tools/longitudinalWaveLab.js').then((m) => m.createLongitudinalWaveLab),
  waveInterference: () => import('../tools/waveInterferenceLab.js').then((m) => m.createWaveInterferenceLab),
  waveDiffraction: () =>
    import('../tools/waveDiffractionLab.js').then((m) => m.createWaveDiffractionLab),
  thinFilmInterference: () =>
    import('../tools/thinFilmInterferenceLab.js').then((m) => m.createThinFilmInterferenceLab),
  diffractionGratingCompare: () =>
    import('../tools/diffractionGratingCompareLab.js').then((m) => m.createDiffractionGratingCompareLab),
  spectralOverlap: () =>
    import('../tools/spectralOverlapLab.js').then((m) => m.createSpectralOverlapLab),
  ultrasoundReflection: () =>
    import('../tools/ultrasoundReflectionLab.js').then((m) => m.createUltrasoundReflectionLab),
  soundRefractionShadow: () =>
    import('../tools/soundRefractionShadowLab.js').then((m) => m.createSoundRefractionShadowLab),
};

function toolLabel(id) {
  const map = {
    waveMotion: 'tools.waveMotion.title',
    longitudinalWave: 'tools.longitudinalWave.title',
    waveInterference: 'tools.waveInterference.title',
    waveDiffraction: 'tools.waveDiffraction.title',
    thinFilmInterference: 'tools.thinFilmInterference.title',
    diffractionGratingCompare: 'tools.diffractionGratingCompare.title',
    spectralOverlap: 'tools.spectralOverlap.title',
    ultrasoundReflection: 'tools.ultrasoundReflection.title',
    soundRefractionShadow: 'tools.soundRefractionShadow.title',
  };
  return t(map[id] || id);
}

export function mountWavesHub(root) {
  let section = sessionStorage.getItem('s3phy.waves.section') || 'topics';
  let toolId = loadToolId(TOOL_STORAGE_KEY, TOOL_ORDER, 'waveMotion');
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
            <p class="lead" style="margin-bottom: 0;">${t('waves.comingSoon')}</p>
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
      subtitleKey: 'strand.waves.subtitle',
      activeSection: section,
      onSection: (id) => {
        if (section === 'tools' && id !== 'tools') {
          cleanupActiveLab();
        }
        section = id;
        sessionStorage.setItem('s3phy.waves.section', id);
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
        <div class="grid cols-3 topic-hub-grid">
          ${WAVES_TOPICS.map((topic) => {
            const btn = topic.tool
              ? `<button class="btn primary" type="button" data-go-tool="${topic.tool}">${t('topic.openTool')}</button>`
              : `<button class="btn primary" type="button" disabled>${t('topic.openTool')}</button>`;
            return `
            <div class="card">
              <h3>${t(topic.titleKey)}</h3>
              ${btn}
            </div>`;
          }).join('')}
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
        <div class="grid cols-3" data-notes-grid>
          ${WAVES_TOPICS.map(
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
    const rows = WAVES_TOPICS.map((r) => ({
      key: r.id,
      fileEn: r.fileEn,
      fileZh: r.fileZh,
    }));
    await hydrateNoteCards(root, rows);
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
      sessionStorage.setItem('s3phy.waves.section', 'tools');
      shell.updateSection(section);
      renderMain();
      return;
    }
    const notesBtn = ev.target.closest('[data-go-section]');
    if (notesBtn?.getAttribute('data-go-section') === 'notes') {
      section = 'notes';
      sessionStorage.setItem('s3phy.waves.section', 'notes');
      shell.updateSection(section);
      renderMain();
    }
  }

  root.addEventListener('click', onMainClick);
  window.addEventListener('s3phy:lang', onLangChange);

  render();

  return () => {
    root.removeEventListener('click', onMainClick);
    window.removeEventListener('s3phy:lang', onLangChange);
    cleanupActiveLab();
    shell?.destroy();
  };
}
