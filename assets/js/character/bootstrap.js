import {
  characterAttributes,
  originNarrative,
  questEntries,
  questLanes,
  slideDefinitions,
  trophyRecords
} from '../character-site-data.js?v=fe795a3070be';
import {
  bindInputLock,
  createAttributeController,
  createQuestController,
  createSlideController,
  createStartingStatsController,
  createTrophyCollectionController
} from './controllers.js?v=fe795a3070be';
import { renderTrophyCollection } from './renderers.js?v=fe795a3070be';

export function mountEnSite({ documentRef = document } = {}) {
  if (!documentRef) {
    return null;
  }

  const stageEl = documentRef.getElementById('slide-stage');
  const indicatorEl = documentRef.getElementById('slide-indicator');
  const tabsEl = documentRef.getElementById('slide-tabs');
  const readoutEl = documentRef.getElementById('character-system-readout');
  const radarEl = documentRef.getElementById('character-radar');
  const detailEl = documentRef.getElementById('character-detail');
  const startingStatsVariablesEl = documentRef.getElementById('starting-stats-variables');
  const startingStatsDetailEl = documentRef.getElementById('starting-stats-detail');
  const achievementListEl = documentRef.getElementById('achievement-list');
  const questLanesEl = documentRef.getElementById('quest-lanes');
  const questNetworkEl = documentRef.getElementById('quest-network');
  const questDetailEl = documentRef.getElementById('quest-detail');

  const startingStatsController = createStartingStatsController({
    narrative: originNarrative,
    variablesEl: startingStatsVariablesEl,
    detailEl: startingStatsDetailEl
  });

  if (achievementListEl) {
    achievementListEl.innerHTML = renderTrophyCollection(trophyRecords);
  }

  const slideController = createSlideController({
    slides: slideDefinitions,
    stageEl,
    indicatorEl,
    tabsEl
  });

  const attributeController = createAttributeController({
    attributes: characterAttributes,
    radarEl,
    detailEl,
    readoutEl
  });

  const questController = createQuestController({
    lanes: questLanes,
    entries: questEntries,
    lanesEl: questLanesEl,
    networkEl: questNetworkEl,
    detailEl: questDetailEl
  });

  const trophyController = createTrophyCollectionController({
    rootEl: achievementListEl
  });

  const inputLock = bindInputLock({ stageEl });

  return {
    slideController,
    attributeController,
    questController,
    trophyController,
    startingStatsController,
    inputLock
  };
}
