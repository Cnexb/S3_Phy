import { t } from '../i18n.js';
import { createFlashcardSession } from './flashcardSession.js';

/**
 * @typedef {{ value: string, label: string }} DeckOption
 * @typedef {(deckKey: string) => import('./flashcardDeck.js').Flashcard[]} BuildDeckFn
 */

const SUBTOPIC_LABEL_KEYS = {
  thermometry: 'flashcards.deck.thermometry',
  heatInternalEnergy: 'flashcards.deck.heatInternalEnergy',
  changeOfState: 'flashcards.deck.changeOfState',
  heatTransfer: 'flashcards.deck.heatTransfer',
  reflection: 'topic.reflection',
  refraction: 'topic.refraction',
  tir: 'topic.tir',
  convex: 'topic.convex',
  concave: 'topic.concave',
  em: 'topic.em',
  rotatingMirror: 'topic.reflection',
  quantitiesUnits: 'topic.quantitiesUnits',
  usefulMaths: 'topic.usefulMaths',
  positionMovement: 'topic.positionMovement',
  equationOfMotion: 'topic.equationOfMotion',
  verticalMotion: 'topic.verticalMotion',
  motionGraph: 'topic.motionGraph',
  forceI: 'topic.forceI',
  forceII: 'topic.forceII',
  forceIII: 'topic.forceIII',
  moment: 'topic.moment',
  workEnergyPower: 'topic.workEnergyPower',
  momentum: 'topic.momentum',
  projectileMotion: 'topic.projectileMotion',
  circularMotion: 'topic.circularMotion',
  gravitationalForce: 'topic.gravitationalForce',
};

function subtopicLabel(topic) {
  const key = SUBTOPIC_LABEL_KEYS[topic] || `topic.${topic}`;
  const label = t(key);
  return label === key ? topic : label;
}

/**
 * @param {HTMLElement} container
 * @param {{ deckOptions: DeckOption[], buildDeck: BuildDeckFn, initialDeck?: string, introKey?: string }} opts
 * @returns {() => void}
 */
export function mountFlashcardStudy(container, { deckOptions, buildDeck, initialDeck = 'all', introKey = 'flashcards.intro' }) {
  let deckKey = initialDeck;
  let session = null;
  let onKeyDown = null;

  container.innerHTML = `
    <section class="panel panel--flashcards">
      <h2>${t('flashcards.title')}</h2>
      <p class="lead">${t(introKey)}</p>
      <div class="fc-controls no-print">
        <div class="control">
          <label>${t('flashcards.deck')}</label>
          <select data-fc-deck>
            ${deckOptions.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}
          </select>
        </div>
        <div class="fc-controls-right">
          <div class="fc-mode-group">
            <span class="fc-mode-label">${t('flashcards.studyMode')}</span>
            <div class="fc-mode-toggle" data-fc-mode>
              <button type="button" data-mode="sequence" class="active">${t('flashcards.mode.sequence')}</button>
              <button type="button" data-mode="random">${t('flashcards.mode.random')}</button>
            </div>
          </div>
          <span class="fc-round-badge" data-fc-round></span>
          <div class="fc-progress-block">
            <span class="fc-progress-label">${t('flashcards.progressLabel')}</span>
            <span class="fc-progress-num" data-fc-progress></span>
          </div>
        </div>
      </div>
      <div data-fc-study-panel>
        <div class="fc-study-stage">
          <div class="fc-card-layer fc-card-layer-back" aria-hidden="true"></div>
          <div class="fc-card-layer fc-card-layer-mid" aria-hidden="true"></div>
          <div class="fc-card-container" data-fc-card-wrap>
            <div class="fc-card-inner" data-fc-card-inner>
              <div class="fc-card-face fc-card-face-front">
                <div class="fc-card-top">
                  <span class="fc-subtopic-pill" data-fc-subtopic-pill></span>
                  <span class="fc-card-code" data-fc-card-code></span>
                </div>
                <div class="fc-card-body-scroll">
                  <div class="fc-card-text" data-fc-front-body></div>
                </div>
                <p class="fc-flip-prompt" data-fc-flip-prompt>${t('flashcards.tapFlip')}</p>
              </div>
              <div class="fc-card-face fc-card-face-back">
                <div class="fc-card-top">
                  <span class="fc-subtopic-pill" data-fc-subtopic-pill-back></span>
                  <span class="fc-card-code" data-fc-card-code-back></span>
                </div>
                <div class="fc-card-body-scroll">
                  <div class="fc-card-text" data-fc-back-body></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="fc-rating-hint" data-fc-hint></p>
        <div class="fc-toolbar no-print">
          <button type="button" class="fc-btn-nav" data-fc-prev>
            <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            <span data-fc-prev-label>${t('flashcards.prev')}</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-again" data-fc-again title="${t('flashcards.again')}">
            <span class="material-symbols-outlined" aria-hidden="true">history</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-flip" data-fc-flip title="${t('flashcards.flip')}">
            <span class="material-symbols-outlined fc-flip-icon" aria-hidden="true">sync</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-gotit" data-fc-gotit title="${t('flashcards.gotIt')}">
            <span class="material-symbols-outlined" aria-hidden="true">check</span>
          </button>
          <button type="button" class="fc-btn-nav" data-fc-next>
            <span data-fc-next-label>${t('flashcards.next')}</span>
            <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </button>
        </div>
      </div>
      <div class="fc-summary-panel" data-fc-summary hidden>
        <h3 data-fc-summary-title></h3>
        <p class="muted" data-fc-summary-stats></p>
        <div class="fc-summary-counts">
          <span data-fc-summary-keep></span>
          <span data-fc-summary-confident></span>
        </div>
        <div class="fc-toolbar no-print">
          <button class="btn primary" type="button" data-fc-next-round>${t('flashcards.summary.nextRound')}</button>
          <button class="btn" type="button" data-fc-restart>${t('flashcards.summary.restart')}</button>
        </div>
      </div>
    </section>`;

  const els = {
    deck: container.querySelector('[data-fc-deck]'),
    mode: container.querySelector('[data-fc-mode]'),
    round: container.querySelector('[data-fc-round]'),
    progress: container.querySelector('[data-fc-progress]'),
    studyPanel: container.querySelector('[data-fc-study-panel]'),
    summaryPanel: container.querySelector('[data-fc-summary]'),
    cardWrap: container.querySelector('[data-fc-card-wrap]'),
    cardInner: container.querySelector('[data-fc-card-inner]'),
    subtopicPill: container.querySelector('[data-fc-subtopic-pill]'),
    subtopicPillBack: container.querySelector('[data-fc-subtopic-pill-back]'),
    cardCode: container.querySelector('[data-fc-card-code]'),
    cardCodeBack: container.querySelector('[data-fc-card-code-back]'),
    frontBody: container.querySelector('[data-fc-front-body]'),
    backBody: container.querySelector('[data-fc-back-body]'),
    flipPrompt: container.querySelector('[data-fc-flip-prompt]'),
    hint: container.querySelector('[data-fc-hint]'),
    prev: container.querySelector('[data-fc-prev]'),
    again: container.querySelector('[data-fc-again]'),
    flip: container.querySelector('[data-fc-flip]'),
    gotit: container.querySelector('[data-fc-gotit]'),
    next: container.querySelector('[data-fc-next]'),
    summaryTitle: container.querySelector('[data-fc-summary-title]'),
    summaryStats: container.querySelector('[data-fc-summary-stats]'),
    summaryKeep: container.querySelector('[data-fc-summary-keep]'),
    summaryConfident: container.querySelector('[data-fc-summary-confident]'),
    nextRound: container.querySelector('[data-fc-next-round]'),
    restart: container.querySelector('[data-fc-restart]'),
  };

  async function makeSession() {
    const cards = await buildDeck(deckKey);
    session = createFlashcardSession(() => cards);
  }

  function setControlsEnabled(flipped, hasCard) {
    const dis = !hasCard;
    els.prev.disabled = dis;
    els.again.disabled = dis || !flipped;
    els.gotit.disabled = dis || !flipped;
    els.flip.disabled = dis;
    els.next.disabled = dis;
  }

  function applyTextCardSize(el, html, forceCompact = false) {
    el.classList.remove('fc-card-text-long', 'fc-card-text-compact');
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    const plain = (tmp.textContent || '').trim();
    const plainLines = plain.split('\n').filter(Boolean).length;
    const brLines = (html || '').match(/<br\s*\/?>/gi)?.length ?? 0;
    const visualLines = Math.max(plainLines, brLines > 0 ? brLines + 1 : 0);
    const len = plain.length;
    if (forceCompact || visualLines >= 5 || len > 220) {
      el.classList.add('fc-card-text-compact');
    } else if (visualLines >= 4 || len > 130) {
      el.classList.add('fc-card-text-long');
    }
  }

  function renderImageBody(el, src, alt) {
    const safeAlt = (alt || '').replace(/"/g, '&quot;');
    const fallback = (alt || t('flashcards.question')).replace(/</g, '&lt;');
    el.innerHTML = `<img src="${src}" alt="${safeAlt}" loading="lazy" class="fc-card-img" data-fc-img /><p class="fc-img-fallback muted" data-fc-img-fallback hidden>${fallback}</p>`;
    const img = el.querySelector('[data-fc-img]');
    const fb = el.querySelector('[data-fc-img-fallback]');
    if (img && fb) {
      img.onerror = () => {
        img.hidden = true;
        fb.hidden = false;
      };
      img.onload = () => {
        img.hidden = false;
        fb.hidden = true;
      };
    }
  }

  function renderCard() {
    const card = session.currentCard();
    const flipped = session.isFlipped();

    els.cardInner.classList.toggle('fc-flipped', flipped);

    if (!card) {
      els.subtopicPill.textContent = '';
      els.subtopicPillBack.textContent = '';
      els.cardCode.textContent = '';
      els.cardCodeBack.textContent = '';
      els.frontBody.innerHTML = '';
      els.backBody.innerHTML = '';
      els.flipPrompt.hidden = true;
      els.cardWrap.classList.remove('fc-card-container--image');
      setControlsEnabled(false, false);
      els.hint.textContent = '';
      return;
    }

    const label = subtopicLabel(card.subtopic);
    const code = t('flashcards.cardCode').replace('{id}', String(card.id));
    els.subtopicPill.textContent = label;
    els.subtopicPillBack.textContent = label;
    els.cardCode.textContent = code;
    els.cardCodeBack.textContent = code;

    if (card.isImage) {
      els.cardWrap.classList.add('fc-card-container--image');
      els.flipPrompt.hidden = true;
      renderImageBody(els.frontBody, card.frontImage, card.alt);
      if (card.backImage && card.backImage !== card.frontImage) {
        renderImageBody(els.backBody, card.backImage, card.alt);
      } else {
        els.backBody.innerHTML = els.frontBody.innerHTML;
      }
    } else {
      els.cardWrap.classList.remove('fc-card-container--image');
      els.flipPrompt.hidden = flipped;
      els.frontBody.innerHTML = card.front;
      if (card.backImage) {
        const alt = card.imageAlt || '';
        els.backBody.innerHTML = `${card.back}<img class="fc-card-back-img" src="${card.backImage}" alt="${alt}" />`;
      } else {
        els.backBody.innerHTML = card.back;
      }
      applyTextCardSize(els.frontBody, card.front, card.compactFront);
      applyTextCardSize(els.backBody, card.back, card.compactBack);
    }

    setControlsEnabled(flipped, true);
    els.hint.textContent = flipped ? t('flashcards.hint.rated') : t('flashcards.flipFirst');
    els.hint.classList.toggle('fc-rating-hint--action', !flipped);
  }

  function renderSummary() {
    const stats = session.getRoundStats();
    const { total } = session.getProgress();

    if (session.isSessionComplete()) {
      els.summaryTitle.textContent = t('flashcards.summary.complete');
      els.summaryStats.textContent = t('flashcards.summary.completeStats');
      els.nextRound.hidden = true;
    } else {
      els.summaryTitle.textContent = t('flashcards.summary.title')
        .replace('{round}', String(session.getRoundNumber()));
      els.summaryStats.textContent = t('flashcards.summary.stats')
        .replace('{total}', String(total))
        .replace('{again}', String(stats.again))
        .replace('{gotIt}', String(stats.gotIt))
        .replace('{neutral}', String(stats.neutral));
      els.nextRound.hidden = false;
    }

    els.summaryKeep.textContent = t('flashcards.summary.keep')
      .replace('{count}', String(stats.again));
    els.summaryConfident.textContent = t('flashcards.summary.confident')
      .replace('{count}', String(stats.gotIt));
  }

  function renderUI() {
    const { index, total } = session.getProgress();
    els.round.textContent = t('flashcards.round')
      .replace('{round}', String(session.getRoundNumber()))
      .replace('{total}', String(total));
    els.progress.textContent = total ? `${index} / ${total}` : '—';

    const summary = session.isSummary();
    els.studyPanel.hidden = summary;
    els.summaryPanel.hidden = !summary;

    if (summary) renderSummary();
    else renderCard();
  }

  function renderModeToggle() {
    const mode = session.getMode();
    els.mode.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  function doFlip() {
    if (!session.currentCard()) return;
    session.flip();
    renderCard();
  }

  function refreshLabels() {
    container.querySelector('h2').textContent = t('flashcards.title');
    container.querySelector('.lead').textContent = t('flashcards.intro');
    container.querySelector('[data-fc-deck]').previousElementSibling.textContent = t('flashcards.deck');
    container.querySelector('.fc-mode-label').textContent = t('flashcards.studyMode');
    container.querySelector('.fc-progress-label').textContent = t('flashcards.progressLabel');
    els.mode.querySelector('[data-mode="sequence"]').textContent = t('flashcards.mode.sequence');
    els.mode.querySelector('[data-mode="random"]').textContent = t('flashcards.mode.random');
    els.flipPrompt.textContent = t('flashcards.tapFlip');
    container.querySelector('[data-fc-prev-label]').textContent = t('flashcards.prev');
    container.querySelector('[data-fc-next-label]').textContent = t('flashcards.next');
    els.nextRound.textContent = t('flashcards.summary.nextRound');
    els.restart.textContent = t('flashcards.summary.restart');
    renderUI();
  }

  els.deck.value = deckKey;
  els.deck.addEventListener('change', () => {
    deckKey = els.deck.value;
    void makeSession().then(() => {
      renderModeToggle();
      renderUI();
    });
  });

  els.mode.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      session.setMode(btn.dataset.mode);
      renderModeToggle();
      renderUI();
    });
  });

  els.cardWrap.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    doFlip();
  });

  els.flip.addEventListener('click', (e) => {
    e.stopPropagation();
    doFlip();
  });

  els.prev.addEventListener('click', () => {
    session.prev();
    renderUI();
  });

  els.again.addEventListener('click', () => {
    if (session.rateAgain()) renderUI();
    else renderCard();
  });

  els.gotit.addEventListener('click', () => {
    if (session.rateGotIt()) renderUI();
    else renderCard();
  });

  els.next.addEventListener('click', () => {
    if (session.isFlipped()) {
      if (session.rateNeutral()) renderUI();
      else renderCard();
    } else if (session.nextNavigate()) {
      renderUI();
    }
  });

  els.nextRound.addEventListener('click', () => {
    session.nextRound();
    renderUI();
  });

  els.restart.addEventListener('click', () => {
    session.restart();
    renderUI();
  });

  onKeyDown = (e) => {
    if (!container.isConnected) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      doFlip();
      return;
    }
    if (e.key === 'ArrowLeft') {
      if (session.isFlipped()) {
        if (session.rateAgain()) renderUI();
        else renderCard();
      } else {
        session.prev();
        renderUI();
      }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === '1') {
      if (session.isFlipped()) {
        if (session.rateGotIt()) renderUI();
        else renderCard();
      } else if (session.nextNavigate()) {
        renderUI();
      }
      return;
    }
    if (e.key === '2' && session.isFlipped()) {
      if (session.rateAgain()) renderUI();
      else renderCard();
    }
  };

  window.addEventListener('keydown', onKeyDown);

  const onLang = () => {
    void makeSession().then(() => {
      renderModeToggle();
      refreshLabels();
    });
  };
  window.addEventListener('s3phy:lang', onLang);

  void makeSession().then(() => {
    renderModeToggle();
    renderUI();
  });

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('s3phy:lang', onLang);
    session?.restart();
    container.innerHTML = '';
  };
}
