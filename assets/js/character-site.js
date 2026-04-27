export {
  bindInputLock,
  createAttributeController,
  createQuestController,
  createSlideController,
  createStartingStatsController,
  createTrophyCollectionController
} from './character/controllers.js';
export {
  getTrophySummary,
  renderTrophyCollection
} from './character/renderers.js';
export {
  initializeEnSite,
  loadOriginContext,
  mountEnSite
} from './character/bootstrap.js';

import { mountEnSite } from './character/bootstrap.js';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    void mountEnSite().catch((error) => {
      console.error(error);
    });
  }, { once: true });
}
