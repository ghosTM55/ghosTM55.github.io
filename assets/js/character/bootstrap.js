import {
  characterAttributes,
  originNarrative,
  questEntries,
  questLanes,
  signalRecords,
  slideDefinitions,
  slideOrder,
  trophyRecords
} from '../character-site-data.js?v=character-url-migration-v2-20260427';
import {
  bindInputLock,
  createAttributeController,
  createQuestController,
  createSlideController,
  createStartingStatsController,
  createTrophyCollectionController
} from './controllers.js';
import { renderTrophyCollection } from './renderers.js';

const fallbackOriginContext = {
  generatedAt: 'offline-fallback',
  shanghai: {
    label: 'Shanghai context',
    value: 'Snapshot unavailable',
    context: 'Shanghai remains the urban operating context even when the live metrics snapshot cannot be loaded.',
    source: null
  },
  china: {
    label: 'China context',
    value: 'Snapshot unavailable',
    context: 'China remains the macro environment behind the story when the verified data feed is temporarily unavailable.',
    source: null
  },
  culturalInputs: ['Games', 'Music', 'Film', 'Open source', 'Hacker culture']
};

export async function loadOriginContext(url = '../assets/data/origin-context.json', fetchImpl = fetch) {
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Failed to load origin context: ${response.status}`);
  }

  return response.json();
}

export async function initializeEnSite() {
  let originContext;

  try {
    originContext = await loadOriginContext();
  } catch {
    originContext = fallbackOriginContext;
  }

  return {
    slideOrder,
    slideDefinitions,
    characterAttributes,
    signalRecords,
    trophyRecords,
    questEntries,
    questLanes,
    originContext,
  };
}

export async function mountEnSite({ documentRef = document } = {}) {
  if (!documentRef) {
    return null;
  }

  const data = await initializeEnSite();
  const stageEl = documentRef.getElementById('slide-stage');
  const indicatorEl = documentRef.getElementById('slide-indicator');
  const tabsEl = documentRef.getElementById('slide-tabs');
  const readoutEl = documentRef.getElementById('character-system-readout');
  const radarEl = documentRef.getElementById('character-radar');
  const detailEl = documentRef.getElementById('character-detail');
  const actionsEl = documentRef.getElementById('character-actions');
  const startingStatsIntroEl = documentRef.getElementById('starting-stats-intro');
  const startingStatsVariablesEl = documentRef.getElementById('starting-stats-variables');
  const startingStatsDetailEl = documentRef.getElementById('starting-stats-detail');
  const startingStatsTraitsEl = documentRef.getElementById('starting-stats-traits');
  const achievementListEl = documentRef.getElementById('achievement-list');
  const questLanesEl = documentRef.getElementById('quest-lanes');
  const questNetworkEl = documentRef.getElementById('quest-network');
  const questDetailEl = documentRef.getElementById('quest-detail');

  const startingStatsController = createStartingStatsController({
    narrative: originNarrative,
    introEl: startingStatsIntroEl,
    variablesEl: startingStatsVariablesEl,
    detailEl: startingStatsDetailEl,
    traitsEl: startingStatsTraitsEl,
  });

  if (achievementListEl) {
    achievementListEl.innerHTML = renderTrophyCollection(data.trophyRecords);
  }

  const slideController = createSlideController({
    slides: data.slideDefinitions,
    stageEl,
    indicatorEl,
    tabsEl
  });

  const attributeController = createAttributeController({
    attributes: data.characterAttributes,
    radarEl,
    detailEl,
    readoutEl,
    actionsEl,
    onJump: (slideId) => slideController?.goTo(slideId)
  });

  const questController = createQuestController({
    lanes: data.questLanes,
    entries: data.questEntries,
    lanesEl: questLanesEl,
    networkEl: questNetworkEl,
    detailEl: questDetailEl
  });

  const trophyController = createTrophyCollectionController({
    rootEl: achievementListEl
  });

  const inputLock = bindInputLock({ stageEl });

  return {
    ...data,
    slideController,
    attributeController,
    questController,
    trophyController,
    startingStatsController,
    inputLock
  };
}
