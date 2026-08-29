const STORAGE_KEY = 's3phy:tool-picker-collapsed';
const MOBILE_BREAKPOINT = 768;

/**
 * @param {{ toolOrder: string[], toolId: string, getLabel: (id: string) => string, t: (key: string) => string }} opts
 */
export function renderToolsShell({ toolOrder, toolId, getLabel, t }) {
  const buttons = toolOrder
    .map(
      (id) =>
        `<button type="button" data-tool="${id}" class="${toolId === id ? 'active' : ''}">${getLabel(id)}</button>`,
    )
    .join('');

  return `
      <section class="panel panel--tools" data-tools-panel>
        <div class="tools-panel-head">
          <div class="tools-panel-head__text">
            <h2>${t('tools.title')}</h2>
            <p class="tools-active-lab" data-tool-active-label hidden>${getLabel(toolId)}</p>
          </div>
          <div class="tools-panel-head__actions">
            <button type="button" class="tool-picker-toggle" data-tool-picker-toggle aria-expanded="true">
              <span data-tool-picker-chevron aria-hidden="true">&#9650;</span>
              <span data-tool-picker-toggle-label>${t('tools.hideLabList')}</span>
            </button>
            <button type="button" class="tool-picker-toggle" data-hub-fullscreen aria-pressed="false">
              <span class="material-symbols-outlined" data-hub-fullscreen-icon aria-hidden="true">fullscreen</span>
              <span data-hub-fullscreen-label>${t('tools.fullscreen')}</span>
            </button>
          </div>
        </div>
        <div class="tools-layout">
          <aside class="tool-picker" data-tool-picker>
            <p class="lead">${t('tools.pick')}</p>
            <div class="tool-list" data-tool-list>${buttons}</div>
          </aside>
          <div class="tool-stage" data-tool-stage></div>
        </div>
      </section>`;
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   getLabel: (id: string) => string,
 *   t: (key: string) => string,
 *   onSelectTool: (toolId: string) => void,
 *   mountTool: (stage: HTMLElement) => void,
 *   getActiveToolId: () => string,
 * }} opts
 */
export function hydrateToolsShell(root, { getLabel, t, onSelectTool, mountTool, getActiveToolId }) {
  const panel = root.querySelector('[data-tools-panel]');
  const picker = root.querySelector('[data-tool-picker]');
  const list = root.querySelector('[data-tool-list]');
  const stage = root.querySelector('[data-tool-stage]');
  const toggleBtn = root.querySelector('[data-tool-picker-toggle]');
  const toggleLabel = root.querySelector('[data-tool-picker-toggle-label]');
  const chevron = root.querySelector('[data-tool-picker-chevron]');
  const activeLabel = root.querySelector('[data-tool-active-label]');

  if (!panel || !picker || !list || !stage || !toggleBtn) return;

  let collapsed = sessionStorage.getItem(STORAGE_KEY) === 'true';

  const updateActiveLabel = () => {
    if (!activeLabel) return;
    activeLabel.textContent = getLabel(getActiveToolId());
  };

  const updateToggleUi = () => {
    toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (toggleLabel) {
      toggleLabel.textContent = collapsed ? t('tools.showLabList') : t('tools.hideLabList');
    }
    if (chevron) {
      chevron.textContent = collapsed ? '\u25BC' : '\u25B2';
    }
    if (activeLabel) {
      activeLabel.hidden = !collapsed;
    }
  };

  const setCollapsed = (next) => {
    collapsed = next;
    panel.classList.toggle('is-picker-collapsed', collapsed);
    sessionStorage.setItem(STORAGE_KEY, collapsed ? 'true' : 'false');
    updateToggleUi();
  };

  panel.classList.toggle('is-picker-collapsed', collapsed);
  updateActiveLabel();
  updateToggleUi();

  toggleBtn.addEventListener('click', () => {
    setCollapsed(!collapsed);
  });

  list.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-tool');
      if (!id) return;
      onSelectTool(id);
      list.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-tool') === id);
      });
      updateActiveLabel();
      mountTool(stage);
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setCollapsed(true);
      }
    });
  });

  mountTool(stage);
}
