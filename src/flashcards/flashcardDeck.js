import { assetUrl } from '../assetUrl.js';

/** @type {Promise<object[]> | null} */
let lightCardsPromise = null;
/** @type {Promise<object[]> | null} */
let definitionsCardsPromise = null;
/** @type {Promise<object[]> | null} */
let heatCardsPromise = null;
/** @type {Promise<object[]> | null} */
let foundationsCardsPromise = null;

function loadLightCards() {
  if (!lightCardsPromise) {
    lightCardsPromise = import('../../content/flashcards/data/flashcards-light-ch3.json').then(
      (m) => m.default,
    );
  }
  return lightCardsPromise;
}

function loadDefinitionsCards() {
  if (!definitionsCardsPromise) {
    definitionsCardsPromise = import(
      '../../content/flashcards/data/flashcards-optics-definitions.json'
    ).then((m) => m.default);
  }
  return definitionsCardsPromise;
}

function loadHeatCards() {
  if (!heatCardsPromise) {
    heatCardsPromise = import('../../content/flashcards/data/flashcards-heat-ch1.json').then(
      (m) => m.default,
    );
  }
  return heatCardsPromise;
}

function loadFoundationsCards() {
  if (!foundationsCardsPromise) {
    foundationsCardsPromise = import(
      '../../content/flashcards/data/flashcards-foundations.json'
    ).then((m) => m.default);
  }
  return foundationsCardsPromise;
}

function langKey(lang) {
  return lang === 'zh-Hant' ? 'zhHant' : 'en';
}

function flashImageUrl(relPath) {
  return assetUrl(relPath);
}

function lightByTopic(cards, topic) {
  return cards.filter((card) => card.topic === topic);
}

/**
 * @param {object} card
 * @param {string} lang
 * @param {number} id
 * @param {string} subtopic
 */
function normalizeCard(card, lang, id, subtopic) {
  const lk = langKey(lang);

  if (card?.en?.front || card?.zhHant?.front) {
    const pack = card[lk]?.front ? card[lk] : card.en || card.zhHant;
    const frontSrc = flashImageUrl(pack.front);
    const backSrc = pack.back ? flashImageUrl(pack.back) : frontSrc;
    return {
      id,
      subtopic: card.topic || subtopic,
      front: '',
      back: '',
      frontImage: frontSrc,
      backImage: backSrc,
      alt: card.alt || card.title || '',
      isImage: true,
    };
  }

  if (card?.front) {
    const frontSrc = flashImageUrl(card.front);
    const backSrc = card.back ? flashImageUrl(card.back) : frontSrc;
    return {
      id,
      subtopic: card.topic || subtopic,
      front: '',
      back: '',
      frontImage: frontSrc,
      backImage: backSrc,
      alt: card.alt || card.title || '',
      isImage: true,
    };
  }

  const pack = card[lk] || card.en;
  const normalized = {
    id,
    subtopic: card.topic || subtopic,
    front: pack?.q || '',
    back: pack?.a || '',
    isImage: false,
    compactFront: Boolean(card.compactFront),
    compactBack: Boolean(card.compactBack),
  };
  if (card.backImage) {
    normalized.backImage = flashImageUrl(card.backImage);
    normalized.imageAlt = card.imageAlt || '';
  }
  return normalized;
}

/**
 * @param {object[]} rawCards
 * @param {string} lang
 * @param {string} defaultSubtopic
 */
function normalizeDeck(rawCards, lang, defaultSubtopic = 'General') {
  let nextId = 1;
  return rawCards.map((card) => {
    const normalized = normalizeCard(card, lang, nextId, card.topic || defaultSubtopic);
    nextId += 1;
    return normalized;
  });
}

function definitionsByTopic(cards, topic) {
  return cards.filter((card) => card.topic === topic);
}

async function opticsRawDeck(deckKey) {
  const lightCh3Cards = await loadLightCards();
  const definitionCards = await loadDefinitionsCards();
  const deck = deckKey === 'rotatingMirror' ? 'reflection' : deckKey;

  if (deck === 'all') return [...lightCh3Cards, ...definitionCards];
  if (deck === 'reflection') return lightByTopic(lightCh3Cards, 'reflection');
  if (deck === 'refractionTir') {
    return [...lightByTopic(lightCh3Cards, 'refraction'), ...lightByTopic(lightCh3Cards, 'tir')];
  }
  if (deck === 'definitions') return definitionCards.slice();
  if (deck === 'convex') return definitionsByTopic(definitionCards, 'convex');
  if (deck === 'concave') return definitionsByTopic(definitionCards, 'concave');
  if (deck === 'em') return definitionsByTopic(definitionCards, 'em');
  return lightCh3Cards.slice();
}

async function heatRawDeck(deckKey) {
  const heatCh1Cards = await loadHeatCards();
  if (deckKey === 'all') return heatCh1Cards.slice();
  return heatCh1Cards.filter((card) => card.topic === deckKey);
}

/**
 * @param {string} deckKey
 * @param {string} lang
 */
export async function buildOpticsDeck(deckKey, lang) {
  return normalizeDeck(await opticsRawDeck(deckKey), lang);
}

/**
 * @param {string} deckKey
 * @param {string} lang
 */
export async function buildHeatDeck(deckKey, lang) {
  return normalizeDeck(await heatRawDeck(deckKey), lang);
}

async function foundationsRawDeck(deckKey) {
  const cards = await loadFoundationsCards();
  if (deckKey === 'all') return cards.slice();
  return cards.filter((card) => card.topic === deckKey);
}

/**
 * @param {string} deckKey
 * @param {string} lang
 */
export async function buildFoundationsDeck(deckKey, lang) {
  return normalizeDeck(await foundationsRawDeck(deckKey), lang);
}
