import {
  characterAttributes,
  originNarrative,
  questEntries,
  questLanes,
  slideDefinitions
} from '../character-site-data.js?v=character-url-migration-v2-20260427';
import { mountParticlePortrait } from './particle-portrait.js';
import {
  getOriginNodes,
  renderCharacterActions,
  renderCharacterDetail,
  renderCharacterRadar,
  renderCharacterReadout,
  renderOriginDetail,
  renderOriginTechTree,
  renderQuestDetail,
  renderQuestLanes,
  renderQuestNetwork,
  renderSlideIndicator,
  renderSlideTabs
} from './renderers.js';

const slideControllerListeners = new WeakMap();
const attributeControllerListeners = new WeakMap();
const questControllerListeners = new WeakMap();
const trophyControllerListeners = new WeakMap();
const inputLockListeners = new WeakMap();

const createSvgElement = (documentRef, tagName) => documentRef.createElementNS('http://www.w3.org/2000/svg', tagName);

const ensureQuestPathOverlay = ({ lanesEl, networkEl, detailEl } = {}) => {
  const documentRef = lanesEl?.ownerDocument ?? networkEl?.ownerDocument ?? detailEl?.ownerDocument;
  const shellEl = lanesEl?.closest?.('.slide-shell--build') ?? lanesEl?.parentElement;

  if (!documentRef || !shellEl) {
    return null;
  }

  let overlay = shellEl.querySelector?.('.quest-path-overlay');

  if (!overlay) {
    overlay = createSvgElement(documentRef, 'svg');
    overlay.setAttribute('class', 'quest-path-overlay');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('focusable', 'false');
    overlay.innerHTML = `
      <path class="quest-path-overlay__line quest-path-overlay__line--lane"></path>
      <path class="quest-path-overlay__line quest-path-overlay__line--entry"></path>
    `.trim();
    shellEl.appendChild(overlay);
  }

  return overlay;
};

const getConnectionPoint = (rect, containerRect, side) => {
  const y = rect.top - containerRect.top + rect.height / 2;
  const x = side === 'right'
    ? rect.right - containerRect.left
    : rect.left - containerRect.left;

  return { x, y };
};

const createConnectorPath = (from, to) => {
  const distance = Math.max(28, Math.abs(to.x - from.x));
  const handle = Math.min(72, Math.max(24, distance * 0.45));

  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${(from.x + handle).toFixed(1)} ${from.y.toFixed(1)}, ${(to.x - handle).toFixed(1)} ${to.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
};

const syncQuestPathOverlay = ({ lanesEl, networkEl, detailEl, activeLaneId, activeQuestId } = {}) => {
  const overlay = ensureQuestPathOverlay({ lanesEl, networkEl, detailEl });
  const shellEl = overlay?.parentElement;
  const lanePath = overlay?.querySelector?.('.quest-path-overlay__line--lane');
  const entryPath = overlay?.querySelector?.('.quest-path-overlay__line--entry');
  const activeLaneEl = lanesEl?.querySelector?.(`[data-quest-lane="${activeLaneId}"]`);
  const activeQuestEl = networkEl?.querySelector?.(`[data-quest-id="${activeQuestId}"]`);
  const briefingEl = detailEl?.querySelector?.('.build-detail__panel');

  if (!overlay || !shellEl || !lanePath || !entryPath || !activeLaneEl || !activeQuestEl || !briefingEl) {
    return;
  }

  const containerRect = shellEl.getBoundingClientRect?.();
  const laneRect = activeLaneEl.getBoundingClientRect?.();
  const questRect = activeQuestEl.getBoundingClientRect?.();
  const briefingRect = briefingEl.getBoundingClientRect?.();

  if (!containerRect || !laneRect || !questRect || !briefingRect) {
    return;
  }

  overlay.setAttribute('viewBox', `0 0 ${Math.max(1, containerRect.width).toFixed(1)} ${Math.max(1, containerRect.height).toFixed(1)}`);
  lanePath.setAttribute('d', createConnectorPath(
    getConnectionPoint(laneRect, containerRect, 'right'),
    getConnectionPoint(questRect, containerRect, 'left')
  ));
  entryPath.setAttribute('d', createConnectorPath(
    getConnectionPoint(questRect, containerRect, 'right'),
    getConnectionPoint(briefingRect, containerRect, 'left')
  ));
};

const pulseCrt = (targetEl) => {
  if (!targetEl || !targetEl.classList) {
    return;
  }

  targetEl.classList.remove('is-crt-pulsing');
  targetEl.classList.add('is-crt-pulsing');

  if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
    window.setTimeout(() => {
      targetEl.classList.remove('is-crt-pulsing');
    }, 220);
  }
};

export function createSlideController({
  slides = slideDefinitions,
  stageEl,
  indicatorEl,
  tabsEl
} = {}) {
  const orderedSlides = Array.isArray(slides) ? slides : [];

  if (!stageEl || !indicatorEl || !tabsEl || !orderedSlides.length) {
    return null;
  }

  const previousListeners = slideControllerListeners.get(stageEl);
  let activeIndex = 0;

  const applyActiveSlide = () => {
    const activeSlide = orderedSlides[activeIndex];
    stageEl.dataset.activeSlide = activeSlide.id;
    indicatorEl.innerHTML = renderSlideIndicator(activeSlide);

    tabsEl.querySelectorAll('[data-slide-tab]').forEach((tab) => {
      const isActive = tab.dataset.slideTab === activeSlide.id;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    });

    pulseCrt(stageEl);

    return activeSlide.id;
  };

  tabsEl.innerHTML = renderSlideTabs(orderedSlides);

  const onTabsClick = (event) => {
    const tab = event.target.closest('[data-slide-tab]');

    if (!tab || !tabsEl.contains(tab)) {
      return;
    }

    const nextIndex = orderedSlides.findIndex((slide) => slide.id === tab.dataset.slideTab);

    if (nextIndex >= 0) {
      activeIndex = nextIndex;
      applyActiveSlide();
    }
  };

  if (previousListeners) {
    tabsEl.removeEventListener('click', previousListeners.onTabsClick);
  }

  tabsEl.addEventListener('click', onTabsClick);
  slideControllerListeners.set(stageEl, { onTabsClick });

  applyActiveSlide();

  return {
    getActiveSlide() {
      return orderedSlides[activeIndex].id;
    },
    next() {
      activeIndex = Math.min(activeIndex + 1, orderedSlides.length - 1);
      applyActiveSlide();
      return orderedSlides[activeIndex].id;
    },
    back() {
      activeIndex = Math.max(activeIndex - 1, 0);
      applyActiveSlide();
      return orderedSlides[activeIndex].id;
    },
    goTo(slideId) {
      const nextIndex = orderedSlides.findIndex((slide) => slide.id === slideId);

      if (nextIndex >= 0) {
        activeIndex = nextIndex;
        applyActiveSlide();
      }

      return orderedSlides[activeIndex].id;
    },
    dispose() {
      tabsEl.removeEventListener('click', onTabsClick);

      if (slideControllerListeners.get(stageEl)?.onTabsClick === onTabsClick) {
        slideControllerListeners.delete(stageEl);
      }
    }
  };
}

export function createAttributeController({
  attributes = characterAttributes,
  radarEl,
  detailEl,
  readoutEl,
  actionsEl = null,
  onJump = null
} = {}) {
  const availableAttributes = Array.isArray(attributes) ? attributes : [];

  if (!radarEl || !detailEl || !readoutEl || !availableAttributes.length) {
    return null;
  }

  const previousListeners = attributeControllerListeners.get(radarEl);
  let activeAttributeId = availableAttributes[0].id;
  let portraitCleanup = null;

  const applyActiveAttribute = () => {
    const activeAttribute = availableAttributes.find((attribute) => attribute.id === activeAttributeId) ?? availableAttributes[0];

    radarEl.querySelectorAll('[data-character-attribute]').forEach((node) => {
      const isActive = node.dataset.characterAttribute === activeAttribute.id;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', String(isActive));
    });

    detailEl.innerHTML = renderCharacterDetail(activeAttribute);
    detailEl.dataset.activeAttribute = activeAttribute.id;

    return activeAttribute.id;
  };

  readoutEl.innerHTML = renderCharacterReadout();
  radarEl.innerHTML = renderCharacterRadar(availableAttributes);
  if (actionsEl) {
    actionsEl.innerHTML = renderCharacterActions();
    actionsEl.hidden = true;
  }
  const portraitCanvas = readoutEl.querySelector('[data-particle-portrait]');
  portraitCleanup = mountParticlePortrait(
    portraitCanvas,
    portraitCanvas?.dataset.particleSrc ?? '../assets/portrait.jpg'
  );

  const onRadarClick = (event) => {
    const node = event.target.closest('[data-character-attribute]');

    if (!node || !radarEl.contains(node)) {
      return;
    }

    activeAttributeId = node.dataset.characterAttribute;
    applyActiveAttribute();
  };

  const onActionsClick = (event) => {
    const action = event.target.closest('[data-slide-jump]');

    if (!actionsEl || !action || !actionsEl.contains(action) || !onJump) {
      return;
    }

    onJump(action.dataset.slideJump);
  };

  if (previousListeners) {
    radarEl.removeEventListener('click', previousListeners.onRadarClick);
    if (actionsEl) {
      actionsEl.removeEventListener('click', previousListeners.onActionsClick);
    }
  }

  radarEl.addEventListener('click', onRadarClick);
  if (actionsEl) {
    actionsEl.addEventListener('click', onActionsClick);
  }
  attributeControllerListeners.set(radarEl, { onRadarClick, onActionsClick });
  applyActiveAttribute();

  return {
    getActiveAttribute() {
      return activeAttributeId;
    },
    select(attributeId) {
      if (availableAttributes.some((attribute) => attribute.id === attributeId)) {
        activeAttributeId = attributeId;
        applyActiveAttribute();
      }

      return activeAttributeId;
    },
    dispose() {
      radarEl.removeEventListener('click', onRadarClick);
      if (actionsEl) {
        actionsEl.removeEventListener('click', onActionsClick);
      }
      portraitCleanup?.();

      if (attributeControllerListeners.get(radarEl)?.onRadarClick === onRadarClick) {
        attributeControllerListeners.delete(radarEl);
      }
    }
  };
}

export function createStartingStatsController({
  narrative = originNarrative,
  introEl,
  variablesEl,
  detailEl,
  traitsEl,
} = {}) {
  const nodes = getOriginNodes(narrative);

  if (!introEl || !variablesEl || !detailEl || !traitsEl || !nodes.length) {
    return null;
  }

  const setActiveButton = (activeId) => {
    variablesEl.querySelectorAll('[data-origin-node]').forEach((button) => {
      const isActive = button.dataset.originNode === activeId;
      button.classList.toggle?.('is-active', isActive);
      button.setAttribute?.('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const close = () => {
    detailEl.dataset.activeOriginNode = '';
    detailEl.innerHTML = '';
    detailEl.classList.remove?.('is-visible');
    setActiveButton('');
  };

  const select = (id) => {
    const selected = nodes.find((node) => node.id === id) ?? nodes[0];
    detailEl.dataset.activeOriginNode = selected.id;
    detailEl.innerHTML = renderOriginDetail(selected);
    detailEl.classList.add?.('is-visible');
    setActiveButton(selected.id);
  };

  introEl.innerHTML = '';
  variablesEl.innerHTML = renderOriginTechTree(narrative.layers ?? []);
  detailEl.innerHTML = '';
  detailEl.classList.remove?.('is-visible');
  traitsEl.innerHTML = '';
  setActiveButton('');

  const onVariablesClick = (event) => {
    const target = event.target?.closest?.('[data-origin-node]') ?? event.target;

    if (!target?.dataset?.originNode) {
      return;
    }

    select(target.dataset.originNode);
  };

  const onDetailClick = (event) => {
    const closeTarget = event.target?.closest?.('[data-origin-close]');

    if (closeTarget || event.target === detailEl) {
      close();
    }
  };

  variablesEl.addEventListener('click', onVariablesClick);
  detailEl.addEventListener('click', onDetailClick);

  return {
    select,
    close,
    dispose() {
      variablesEl.removeEventListener?.('click', onVariablesClick);
      detailEl.removeEventListener?.('click', onDetailClick);
    }
  };
}

export function createQuestController({
  lanes = questLanes,
  entries = questEntries,
  lanesEl,
  networkEl,
  detailEl
} = {}) {
  const availableLanes = Array.isArray(lanes) ? lanes : [];
  const availableEntries = Array.isArray(entries) ? entries : [];

  if (!lanesEl || !networkEl || !detailEl || !availableEntries.length || !availableLanes.length) {
    return null;
  }

  const previousHandlers = questControllerListeners.get(networkEl);
  let activeLaneId = availableLanes[0].id;
  let activeQuestId = availableEntries.find((item) => item.lane === activeLaneId)?.id ?? availableEntries[0].id;
  let pathFrame = 0;

  const getVisibleEntries = () => availableEntries.filter((item) => item.lane === activeLaneId);

  const scheduleQuestPathSync = () => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      syncQuestPathOverlay({ lanesEl, networkEl, detailEl, activeLaneId, activeQuestId });
      return;
    }

    window.cancelAnimationFrame?.(pathFrame);
    pathFrame = window.requestAnimationFrame(() => {
      syncQuestPathOverlay({ lanesEl, networkEl, detailEl, activeLaneId, activeQuestId });
    });
  };

  const applyActiveQuest = () => {
    const visibleEntries = getVisibleEntries();
    const activeQuest = visibleEntries.find((item) => item.id === activeQuestId) ?? visibleEntries[0] ?? availableEntries[0];
    activeQuestId = activeQuest.id;

    lanesEl.querySelectorAll('[data-quest-lane]').forEach((node) => {
      const isActive = node.dataset.questLane === activeLaneId;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', String(isActive));
    });

    networkEl.innerHTML = renderQuestNetwork(visibleEntries, availableLanes);
    networkEl.querySelectorAll('[data-quest-id]').forEach((node) => {
      const isActive = node.dataset.questId === activeQuest.id;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', String(isActive));
    });

    detailEl.innerHTML = renderQuestDetail(activeQuest, availableLanes);
    detailEl.dataset.activeQuestId = activeQuest.id;
    scheduleQuestPathSync();

    return activeQuest.id;
  };

  lanesEl.innerHTML = renderQuestLanes(availableLanes);

  const onLaneClick = (event) => {
    const node = event.target.closest('[data-quest-lane]');

    if (!node || !lanesEl.contains(node)) {
      return;
    }

    activeLaneId = node.dataset.questLane;
    activeQuestId = getVisibleEntries()[0]?.id ?? activeQuestId;
    applyActiveQuest();
  };

  const onNetworkClick = (event) => {
    const node = event.target.closest('[data-quest-id]');

    if (!node || !networkEl.contains(node)) {
      return;
    }

    activeQuestId = node.dataset.questId;
    applyActiveQuest();
  };

  const onWindowResize = () => {
    scheduleQuestPathSync();
  };

  if (previousHandlers) {
    lanesEl.removeEventListener('click', previousHandlers.onLaneClick);
    networkEl.removeEventListener('click', previousHandlers.onNetworkClick);
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', previousHandlers.onWindowResize);
    }
  }

  lanesEl.addEventListener('click', onLaneClick);
  networkEl.addEventListener('click', onNetworkClick);
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onWindowResize, { passive: true });
  }
  questControllerListeners.set(networkEl, { onLaneClick, onNetworkClick, onWindowResize });
  applyActiveQuest();

  return {
    getActiveQuest() {
      return activeQuestId;
    },
    getActiveLane() {
      return activeLaneId;
    },
    select(questId) {
      const nextQuest = availableEntries.find((item) => item.id === questId);

      if (nextQuest) {
        activeLaneId = nextQuest.lane;
        activeQuestId = questId;
        applyActiveQuest();
      }

      return activeQuestId;
    },
    selectLane(laneId) {
      if (availableLanes.some((item) => item.id === laneId)) {
        activeLaneId = laneId;
        activeQuestId = getVisibleEntries()[0]?.id ?? activeQuestId;
        applyActiveQuest();
      }

      return activeLaneId;
    },
    dispose() {
      lanesEl.removeEventListener('click', onLaneClick);
      networkEl.removeEventListener('click', onNetworkClick);
      if (typeof window !== 'undefined') {
        window.cancelAnimationFrame?.(pathFrame);
        window.removeEventListener('resize', onWindowResize);
      }

      if (questControllerListeners.get(networkEl)?.onNetworkClick === onNetworkClick) {
        questControllerListeners.delete(networkEl);
      }
    }
  };
}

export function createTrophyCollectionController({ rootEl } = {}) {
  if (!rootEl || trophyControllerListeners.has(rootEl)) {
    return null;
  }

  const buttons = Array.from(rootEl.querySelectorAll?.('[data-trophy-filter]') ?? []);
  const rows = Array.from(rootEl.querySelectorAll?.('[data-trophy-tier]') ?? []);

  if (!buttons.length || !rows.length) {
    return null;
  }

  const select = (filter) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.trophyFilter === filter;
      button.classList?.toggle('is-active', isActive);
      button.setAttribute?.('aria-pressed', isActive ? 'true' : 'false');
    });

    rows.forEach((row) => {
      row.hidden = filter !== 'all' && row.dataset.trophyTier !== filter;
    });
  };

  const onClick = (event) => {
    const button = event.target?.closest?.('[data-trophy-filter]');
    const filter = button?.dataset?.trophyFilter;

    if (!filter) return;
    select(filter);
  };

  rootEl.addEventListener?.('click', onClick);
  trophyControllerListeners.set(rootEl, { onClick });

  return {
    select,
    dispose() {
      rootEl.removeEventListener?.('click', onClick);
      trophyControllerListeners.delete(rootEl);
    }
  };
}

export function bindInputLock({ stageEl } = {}) {
  if (!stageEl) {
    return null;
  }

  const previousHandlers = inputLockListeners.get(stageEl);
  const findAllowedScrollRegion = (target) => target?.closest?.('[data-scroll-lock-allow]') ?? null;
  const canScrollRegion = (region, deltaY = 0) => {
    if (!region) {
      return false;
    }

    const maxScrollTop = region.scrollHeight - region.clientHeight;

    if (maxScrollTop <= 0) {
      return false;
    }

    if (deltaY > 0) {
      return region.scrollTop < maxScrollTop;
    }

    if (deltaY < 0) {
      return region.scrollTop > 0;
    }

    return true;
  };
  const preventDefault = (event) => {
    const scrollRegion = findAllowedScrollRegion(event.target);

    if (event.type === 'touchmove' && canScrollRegion(scrollRegion)) {
      return;
    }

    if (event.type === 'wheel' && canScrollRegion(scrollRegion, event.deltaY)) {
      return;
    }

    event.preventDefault();
  };

  if (previousHandlers) {
    stageEl.removeEventListener('wheel', previousHandlers.preventDefault);
    stageEl.removeEventListener('touchmove', previousHandlers.preventDefault);
  }

  stageEl.addEventListener('wheel', preventDefault, { passive: false });
  stageEl.addEventListener('touchmove', preventDefault, { passive: false });
  inputLockListeners.set(stageEl, { preventDefault });

  return {
    dispose() {
      stageEl.removeEventListener('wheel', preventDefault);
      stageEl.removeEventListener('touchmove', preventDefault);

      if (inputLockListeners.get(stageEl)?.preventDefault === preventDefault) {
        inputLockListeners.delete(stageEl);
      }
    }
  };
}
