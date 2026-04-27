import {
  slideOrder,
  slideDefinitions,
  characterAttributes,
  signalRecords,
  trophyRecords,
  originNarrative,
  questLanes,
  questEntries
} from './character-site-data.js?v=character-url-migration-v2-20260427';

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

const slideControllerListeners = new WeakMap();
const attributeControllerListeners = new WeakMap();
const questControllerListeners = new WeakMap();
const trophyControllerListeners = new WeakMap();
const inputLockListeners = new WeakMap();
const portraitParticleCleanups = new WeakMap();

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const toClassSlug = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'item';

const renderSignalLog = (entries = []) => {
  if (!entries.length) {
    return '';
  }

  return `
    <section class="character-detail__signal-log" aria-label="Event log">
      <div class="character-detail__section-label">EVENT LOG</div>
      <ol>
        ${entries.map((entry) => `
          <li class="character-detail__log-event">
            <div class="character-detail__log-head">
              <span class="character-detail__log-stamp">[${escapeHtml(entry.stamp)}]</span>
              <span class="character-detail__log-source">${escapeHtml(entry.title)}</span>
              <span class="character-detail__log-status">[OK]</span>
            </div>
            <span class="character-detail__log-message">${escapeHtml(entry.text)}</span>
          </li>
        `.trim()).join('')}
      </ol>
    </section>
  `.trim();
};

const renderProofStack = (proofStack = []) => {
  if (!proofStack.length) {
    return '';
  }

  return `
    <section class="character-detail__proof-stack" aria-label="Traits">
      <div class="character-detail__section-label">TRAITS</div>
      <ul>
        ${proofStack.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}
      </ul>
    </section>
  `.trim();
};

const radarCenter = 160;
const radarOuterRadius = 108;

const polarPoint = (angleDegrees, radius) => {
  const radians = (angleDegrees - 90) * (Math.PI / 180);

  return {
    x: radarCenter + (Math.cos(radians) * radius),
    y: radarCenter + (Math.sin(radians) * radius)
  };
};

const radarPointString = (points) => points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

const createRadarGeometry = (attributes = []) => {
  const step = 360 / Math.max(1, attributes.length);
  const baseAngles = attributes.map((_, index) => index * step);
  const gridLevels = [1, 0.8, 0.6, 0.4, 0.2];

  return {
    axisPoints: baseAngles.map((angle) => polarPoint(angle, radarOuterRadius)),
    gridPolygons: gridLevels.map((level) => baseAngles.map((angle) => polarPoint(angle, radarOuterRadius * level))),
    statPolygon: attributes.map((attribute, index) => {
      const normalized = Math.max(0.18, Math.min(1, (attribute.score ?? 0) / 100));
      return polarPoint(baseAngles[index], radarOuterRadius * normalized);
    }),
    labelPoints: attributes.map((attribute, index) => {
      const anchor = index === 0 ? 'top' : index === 1 || index === 2 ? 'right' : index === 3 ? 'bottom' : 'left';
      const labelRadius = anchor === 'left' || anchor === 'right'
        ? radarOuterRadius + 22
        : radarOuterRadius + 14;

      return {
        id: attribute.id,
        angle: baseAngles[index],
        point: polarPoint(baseAngles[index], labelRadius),
        anchor
      };
    })
  };
};

const renderSlideTabs = (slides = []) => slides.map((slide, index) => `
  <button
    class="slide-tab${index === 0 ? ' is-active' : ''}"
    type="button"
    data-slide-tab="${escapeHtml(slide.id)}"
    aria-pressed="${index === 0 ? 'true' : 'false'}"
  >
    <i class="slide-tab__icon ${escapeHtml(slide.iconClass ?? 'fas fa-circle')}" aria-hidden="true"></i>
    <span class="slide-tab__mode">Manual</span>
    <strong>${escapeHtml(slide.label)}</strong>
  </button>
`.trim()).join('');

const renderSlideIndicator = (slide) => `
  <span class="slide-indicator__label">Active Console</span>
  <strong>${escapeHtml(slide.label)}</strong>
`.trim();

const renderCharacterReadout = () => `
  <article class="character-readout__panel terminal-pane">
    <div class="character-portrait__frame">
      <canvas
        class="character-portrait__canvas"
        data-particle-portrait
        data-particle-src="../assets/portrait.jpg"
        aria-label="Thomas Yao particle portrait"
      ></canvas>
    </div>
  </article>
`.trim();

const renderCharacterRadar = (attributes = []) => `
  <div class="character-radar__identity">
    <span class="character-radar__identity-name">Thomas Yao</span>
    <span class="character-radar__identity-divider" aria-hidden="true">//</span>
    <span class="character-radar__identity-handle">@ghosTM55</span>
  </div>
  <div class="character-radar__frame terminal-pane">
    <div class="character-radar__frame-tag">Attributes</div>
    <div class="character-radar__graph">
      ${(() => {
        const geometry = createRadarGeometry(attributes);

        return `
          <svg class="character-radar__svg" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
            <g class="character-radar__grid">
              ${geometry.gridPolygons.map((polygon, index) => `
                <polygon class="character-radar__grid-level character-radar__grid-level--${index}" points="${radarPointString(polygon)}"></polygon>
              `.trim()).join('')}
              ${geometry.axisPoints.map((point) => `
                <line class="character-radar__axis" x1="${radarCenter}" y1="${radarCenter}" x2="${point.x.toFixed(2)}" y2="${point.y.toFixed(2)}"></line>
              `.trim()).join('')}
            </g>
            <polygon class="character-radar__shape-fill" points="${radarPointString(geometry.statPolygon)}"></polygon>
            <polygon class="character-radar__shape-stroke" points="${radarPointString(geometry.statPolygon)}"></polygon>
            ${geometry.statPolygon.map((point) => `
              <circle class="character-radar__vertex" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4.5"></circle>
            `.trim()).join('')}
          </svg>
          ${geometry.labelPoints.map(({ point, anchor, id }, index) => `
            <button
              class="character-radar__stat character-radar__stat--${escapeHtml(anchor)}${index === 0 ? ' is-active' : ''}"
              type="button"
              data-character-attribute="${escapeHtml(id)}"
              aria-pressed="${index === 0 ? 'true' : 'false'}"
              aria-label="${escapeHtml(attributes[index]?.label ?? '')}"
              style="left: ${((point.x / 320) * 100).toFixed(2)}%; top: ${((point.y / 320) * 100).toFixed(2)}%;"
            >
              <span class="character-radar__stat-score">${escapeHtml(String(attributes[index]?.score ?? '--'))}</span>
              <span class="character-radar__stat-label">${escapeHtml(attributes[index]?.label ?? '')}</span>
            </button>
          `.trim()).join('')}
        `;
      })()}
    </div>
  </div>
`.trim();

const renderCharacterDetail = (attribute) => `
  <article class="character-detail__panel terminal-pane" data-active-attribute="${escapeHtml(attribute.id)}">
    <h2 class="character-detail__title">${escapeHtml(attribute.label)}</h2>
    <div class="character-detail__meter" aria-hidden="true">
      <span class="character-detail__meter-label">STAT LEVEL</span>
      <div class="character-detail__meter-bar">
        <i style="--target-level: ${Math.max(18, Math.min(100, attribute.score ?? 60))}%;"></i>
      </div>
      <span class="character-detail__meter-value">${escapeHtml(String(attribute.score ?? '--'))}</span>
    </div>
    <p class="character-detail__interpretation">${escapeHtml(attribute.detail)}</p>
    <section class="character-detail__operating-notes" aria-label="Field notes">
      <div class="character-detail__section-label">FIELD NOTES</div>
      <div class="character-detail__note-body">
        <p>
          <span class="character-detail__note-mark character-detail__note-mark--plus">[+]</span>
          <span>${escapeHtml(attribute.bestUse)}</span>
        </p>
        <p>
          <span class="character-detail__note-mark character-detail__note-mark--minus">[-]</span>
          <span>${escapeHtml(attribute.tradeoff)}</span>
        </p>
      </div>
    </section>
    ${renderSignalLog(attribute.signalLog)}
    ${renderProofStack(attribute.proofStack)}
  </article>
`.trim();

const renderCharacterActions = () => '';

const PARTICLE_SETTINGS = {
  gridSize: 4,
  contrast: 1,
  sizeVariation: 0.3,
  mouseRadius: 20,
  repulsion: 0.3,
  returnSpeed: 0.3,
  accentColor: '#00d9ff',
  accentProbability: 0.02,
  damping: 0.85
};

function mountParticlePortrait(canvas, src) {
  if (!canvas) {
    return () => {};
  }

  portraitParticleCleanups.get(canvas)?.();

  const context = canvas.getContext('2d');
  if (!context) {
    return () => {};
  }

  const image = new Image();
  const offscreen = document.createElement('canvas');
  const offscreenContext = offscreen.getContext('2d', { willReadFrequently: true });
  const particles = [];
  const mouse = { x: -9999, y: -9999, active: false };
  let frameId = 0;
  let resizeFrame = 0;
  let disposed = false;
  let logicalWidth = 0;
  let logicalHeight = 0;

  const scheduleBuild = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (disposed || !offscreenContext || !image.complete) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      logicalWidth = Math.max(1, Math.round(bounds.width));
      logicalHeight = Math.max(1, Math.round(bounds.height));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(logicalWidth * dpr));
      canvas.height = Math.max(1, Math.round(logicalHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      offscreen.width = logicalWidth;
      offscreen.height = logicalHeight;
      offscreenContext.clearRect(0, 0, logicalWidth, logicalHeight);

      const scale = Math.max(logicalWidth / image.width, logicalHeight / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;

      const drawX = (logicalWidth - drawWidth) / 2;
      const drawY = (logicalHeight - drawHeight) / 2;
      offscreenContext.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      const pixelData = offscreenContext.getImageData(0, 0, logicalWidth, logicalHeight).data;
      particles.length = 0;

      for (let y = 0; y < logicalHeight; y += PARTICLE_SETTINGS.gridSize) {
        for (let x = 0; x < logicalWidth; x += PARTICLE_SETTINGS.gridSize) {
          const index = ((y * logicalWidth) + x) * 4;
          const alpha = pixelData[index + 3] / 255;

          if (alpha < 0.08) {
            continue;
          }

          const brightness = Math.min(
            255,
            (((pixelData[index] + pixelData[index + 1] + pixelData[index + 2]) / 3) * PARTICLE_SETTINGS.contrast)
          );
          const sizeBase = (brightness / 255) * PARTICLE_SETTINGS.gridSize * 0.9;
          const size = sizeBase * (1 - PARTICLE_SETTINGS.sizeVariation + (Math.random() * PARTICLE_SETTINGS.sizeVariation * 2));

          if (size < 0.5) {
            continue;
          }

          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size,
            color: Math.random() < PARTICLE_SETTINGS.accentProbability ? PARTICLE_SETTINGS.accentColor : '#f3fbff'
          });
        }
      }
    });
  };

  const draw = () => {
    if (disposed || !logicalWidth || !logicalHeight) {
      return;
    }

    context.clearRect(0, 0, logicalWidth, logicalHeight);
    context.fillStyle = '#02070d';
    context.fillRect(0, 0, logicalWidth, logicalHeight);

    for (const particle of particles) {
      if (mouse.active) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance < PARTICLE_SETTINGS.mouseRadius) {
          const force = (1 - (distance / PARTICLE_SETTINGS.mouseRadius)) * PARTICLE_SETTINGS.repulsion * 1.8;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx += (particle.baseX - particle.x) * PARTICLE_SETTINGS.returnSpeed * 0.04;
      particle.vy += (particle.baseY - particle.y) * PARTICLE_SETTINGS.returnSpeed * 0.04;
      particle.vx *= PARTICLE_SETTINGS.damping;
      particle.vy *= PARTICLE_SETTINGS.damping;
      particle.x += particle.vx;
      particle.y += particle.vy;

      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    frameId = requestAnimationFrame(draw);
  };

  const pointerMove = (event) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = event.clientX - bounds.left;
    mouse.y = event.clientY - bounds.top;
    mouse.active = true;
  };

  const pointerLeave = () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  };

  const handleLoad = () => {
    scheduleBuild();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(draw);
  };

  image.addEventListener('load', handleLoad);
  image.src = src;
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerleave', pointerLeave);
  window.addEventListener('resize', scheduleBuild);

  const cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frameId);
    cancelAnimationFrame(resizeFrame);
    image.removeEventListener('load', handleLoad);
    canvas.removeEventListener('pointermove', pointerMove);
    canvas.removeEventListener('pointerleave', pointerLeave);
    window.removeEventListener('resize', scheduleBuild);
  };

  portraitParticleCleanups.set(canvas, cleanup);
  return cleanup;
}

const renderOriginIntro = (narrative = originNarrative) => `
  <article class="origin-console__panel terminal-pane">
    <p class="eyebrow">${escapeHtml(narrative.title)}</p>
    <h2>Starting Stats</h2>
    <p class="origin-console__subtitle">${escapeHtml(narrative.subtitle)}</p>
    <p>${escapeHtml(narrative.summary)}</p>
    <ol class="origin-thesis-lines" aria-label="Philosophy output">
      ${(narrative.thesisLines ?? []).map((line) => `<li><span>&gt;</span>${escapeHtml(line)}</li>`).join('')}
    </ol>
  </article>
`.trim();

const getOriginNodes = (narrative = originNarrative) => (narrative.layers ?? []).flatMap((layer) => layer.nodes ?? []);

const renderOriginTechTree = (layers = []) => `
  <div class="origin-tech-tree" aria-label="Foundation tech tree">
    ${layers.map((layer, layerIndex) => `
      <section class="origin-tech-layer" data-origin-layer="${escapeHtml(layer.id)}">
        <header class="origin-tech-layer__header">
          <span>${escapeHtml(layer.code)}</span>
          <strong>${escapeHtml(layer.label)}</strong>
        </header>
        <div class="origin-tech-layer__nodes">
          ${(layer.nodes ?? []).map((node, nodeIndex) => `
            <div class="origin-branch-cluster">
              <button
                class="origin-tech-node"
                type="button"
                data-origin-node="${escapeHtml(node.id)}"
                aria-pressed="false"
              >
                <i class="origin-tech-node__icon ${escapeHtml(node.iconClass ?? 'fas fa-circle')}" aria-hidden="true"></i>
                <span class="origin-tech-node__type">${escapeHtml(node.type)}</span>
                <strong>${escapeHtml(node.label)}</strong>
              </button>
              <div class="origin-tech-branches" aria-label="${escapeHtml(node.label)} unlock branches">
                ${(node.branches ?? []).map((branch) => `
                  <span class="origin-branch-node" data-branch-node>
                    <span class="origin-branch-node__code">PERK</span>
                    <strong>${escapeHtml(branch)}</strong>
                  </span>
                `.trim()).join('')}
              </div>
            </div>
          `.trim()).join('')}
        </div>
      </section>
    `.trim()).join('')}
  </div>
`.trim();

const renderOriginDetail = (node) => {
  if (!node) {
    return '';
  }

  const layers = [
    { label: 'SOURCE', text: node.source },
    { label: 'TRAINING EFFECT', text: node.trainingEffect },
    { label: 'UNLOCKED PRIMITIVE', tags: node.unlockedPrimitives },
    { label: 'LATER COMBINES INTO', tags: node.laterCombinesInto }
  ];

  return `
    <article class="origin-detail__panel terminal-pane">
      <button class="origin-detail__close" type="button" data-origin-close aria-label="Close node details">
        <span aria-hidden="true">×</span>
      </button>
      <p class="origin-detail__type">INSPECTING ${escapeHtml(node.type)}</p>
      <h3>${escapeHtml(node.label)}</h3>
      <div class="origin-detail__layers">
        ${layers.map((layer) => `
          <section class="origin-detail__layer">
            <span>${escapeHtml(layer.label)}</span>
            ${layer.tags ? `
              <div class="origin-detail__tag-list">
                ${layer.tags.map((tag) => `<span class="origin-detail__tag">${escapeHtml(tag)}</span>`).join('')}
              </div>
            `.trim() : `<p>${escapeHtml(layer.text)}</p>`}
          </section>
        `.trim()).join('')}
      </div>
    </article>
  `.trim();
};

const renderOriginTraits = (traits = []) => `
  <section class="origin-traits__panel terminal-pane" aria-label="Compiled traits">
    <span class="origin-traits__label">COMPILED TRAITS</span>
    <div class="origin-traits__list">
      ${traits.map((trait) => `<span><i>[UNLOCKED]</i>${escapeHtml(trait)}</span>`).join('')}
    </div>
  </section>
`.trim();

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

const renderSignals = (records = []) => `
  <div class="signal-console">
    ${records.map((record) => `
      <article class="signal-card terminal-pane" data-signal-id="${escapeHtml(record.id)}">
        <span class="signal-year">${escapeHtml(record.year)}</span>
        <span class="signal-type">${escapeHtml(record.type)}</span>
        <h3>${escapeHtml(record.title)}</h3>
        <p>${escapeHtml(record.context)}</p>
      </article>
    `.trim()).join('')}
  </div>
`.trim();

const trophyTiers = ['platinum', 'gold', 'silver', 'bronze'];

const trophyTierLabels = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze'
};

const getTrophyTierRank = (tier) => trophyTiers.indexOf(tier);

const getSortedTrophyRecords = (records = []) => [...records].sort((a, b) => {
  const tierDelta = getTrophyTierRank(a.tier) - getTrophyTierRank(b.tier);
  if (tierDelta !== 0) return tierDelta;

  return records.indexOf(a) - records.indexOf(b);
});

export function getTrophySummary(records = []) {
  const counts = trophyTiers.reduce((result, tier) => ({
    ...result,
    [tier]: records.filter((record) => record.tier === tier).length
  }), {});
  const level = 42;

  return {
    counts,
    level,
    total: records.length
  };
}

const renderTrophyFilter = (id, label, count = null, active = false) => `
  <button
    class="trophy-filter${active ? ' is-active' : ''}"
    type="button"
    data-trophy-filter="${escapeHtml(id)}"
    aria-pressed="${active ? 'true' : 'false'}"
  >
    <span>${escapeHtml(label)}</span>
    ${count === null ? '' : `<strong>${escapeHtml(count)}</strong>`}
  </button>
`.trim();

const renderTrophyTitle = (record) => {
  if (record?.id === 'tedx-talks') {
    return 'TED<span class="trophy-title__case-lock">x</span> Talks';
  }

  return escapeHtml(record.title);
};

const renderTrophyRow = (record) => {
  const tierLabel = trophyTierLabels[record.tier] ?? record.tier;

  return `
    <article class="trophy-row trophy-row--${escapeHtml(record.tier)}" data-trophy-tier="${escapeHtml(record.tier)}" data-trophy-id="${escapeHtml(record.id)}">
      <div class="trophy-row__emblem" aria-hidden="true">
        <i class="${escapeHtml(record.iconClass)}"></i>
      </div>
      <div class="trophy-row__copy">
        <div class="trophy-row__head">
          <span class="trophy-row__tier">${escapeHtml(tierLabel)} Trophy</span>
        </div>
        <h3>${renderTrophyTitle(record)}</h3>
        <p>${escapeHtml(record.description)}</p>
      </div>
      <strong class="trophy-row__rarity">${escapeHtml(record.rarity)}</strong>
    </article>
  `.trim();
};

export const renderTrophyCollection = (records = []) => {
  const summary = getTrophySummary(records);
  const sortedRecords = getSortedTrophyRecords(records);

  return `
    <section class="trophy-collection" aria-label="Trophy Collection">
      <header class="trophy-summary">
        <div class="trophy-summary__title">
          <span>Achievements</span>
          <h2>Trophy Collection</h2>
        </div>
        <div class="trophy-summary__level">
          <span>Trophy Level</span>
          <strong>LV. ${escapeHtml(summary.level)}</strong>
        </div>
        <div class="trophy-summary__counts" aria-label="Trophy counts">
          ${trophyTiers.map((tier) => `
            <span class="trophy-count trophy-count--${escapeHtml(tier)}">
              <span class="trophy-count__icon" aria-hidden="true"><i class="fas fa-trophy"></i></span>
              <i class="trophy-count__label">${escapeHtml(trophyTierLabels[tier])}</i>
              <strong>${escapeHtml(summary.counts[tier] ?? 0)}</strong>
            </span>
          `.trim()).join('')}
        </div>
      </header>
      <nav class="trophy-filters" aria-label="Trophy filters">
        ${renderTrophyFilter('all', 'All', summary.total, true)}
        ${trophyTiers.map((tier) => renderTrophyFilter(tier, trophyTierLabels[tier], summary.counts[tier] ?? 0)).join('')}
      </nav>
      <div class="trophy-list" data-scroll-lock-allow="true" aria-label="Trophy list">
        ${sortedRecords.map(renderTrophyRow).join('')}
      </div>
    </section>
  `.trim();
};

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

const getLaneLabel = (laneId, lanes = []) => lanes.find((lane) => lane.id === laneId)?.label ?? laneId;

const renderQuestColumnHeader = (title) => `
  <div class="quest-column-header">
    <span>${escapeHtml(title)}</span>
  </div>
`.trim();

const renderQuestLanes = (lanes = []) => `
  <section class="quest-column quest-column--lanes" aria-label="Quests">
    ${renderQuestColumnHeader('Quests')}
    <div class="quest-lanes__grid">
      ${lanes.map((lane, index) => `
      <button
        class="quest-lane${index === 0 ? ' is-active' : ''}"
        type="button"
        data-quest-lane="${escapeHtml(lane.id)}"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
      >
        <span class="quest-lane__icon ${escapeHtml(lane.iconClass)}" aria-hidden="true"></span>
        <strong>${escapeHtml(lane.label)}</strong>
      </button>
      `.trim()).join('')}
    </div>
  </section>
`.trim();

const renderQuestNetwork = (entries = []) => `
  <section class="quest-board" aria-label="Quest Board">
    ${renderQuestColumnHeader('Quest Board')}
    <div class="build-network__grid build-network__grid--quests">
    ${entries.map((item, index) => `
      <button
        class="build-network__node build-network__node--quest build-network__node--${escapeHtml(toClassSlug(item.category))}${index === 0 ? ' is-active' : ''}"
        type="button"
        data-quest-id="${escapeHtml(item.id)}"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
      >
        <span class="build-network__status build-network__status--${escapeHtml(toClassSlug(item.status))}">${escapeHtml(item.status)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.outcome)}</p>
      </button>
    `.trim()).join('')}
    </div>
  </section>
`.trim();

const renderQuestTraits = (traits = []) => {
  if (!traits.length) {
    return '';
  }

  return `
    <section class="build-detail__traits" aria-label="Unlocked Traits">
      <h3>Unlocked Traits</h3>
      <ul>
        ${traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join('')}
      </ul>
    </section>
  `.trim();
};

const renderQuestIcon = (item) => {
  if (!item?.mediaSrc) {
    return '';
  }

  const mediaLayout = toClassSlug(item.mediaLayout ?? 'standard');
  const mediaStyle = item.mediaAspect ? ` style="--quest-media-aspect: ${escapeHtml(item.mediaAspect)}"` : '';

  return `
    <figure class="build-detail__icon build-detail__icon--${escapeHtml(mediaLayout)}"${mediaStyle}>
      <img class="build-detail__icon-image" src="${escapeHtml(item.mediaSrc)}" alt="${escapeHtml(item.mediaAlt ?? `${item.title} quest icon`)}" loading="lazy" />
    </figure>
  `.trim();
};

const renderQuestBriefingSections = (briefing = {}) => {
  const sections = [
    ['Origin', briefing.origin],
    ['Actions Taken', briefing.actions],
    ['Takeaway', briefing.takeaway]
  ].filter(([, body]) => body);

  if (!sections.length) {
    return '';
  }

  return `
    <div class="build-detail__briefing-sections">
      ${sections.map(([label, body]) => `
        <section class="build-detail__briefing-section" aria-label="${escapeHtml(label)}">
          <h3>${escapeHtml(label)}</h3>
          <p>${escapeHtml(body)}</p>
        </section>
      `.trim()).join('')}
    </div>
  `.trim();
};

const renderQuestDetail = (item, lanes = []) => `
  <section class="quest-detail" aria-label="Quest Briefing">
    ${renderQuestColumnHeader('Quest Briefing')}
    <article class="build-detail__panel build-detail__panel--media-${escapeHtml(toClassSlug(item.mediaLayout ?? 'standard'))}" data-active-quest-id="${escapeHtml(item.id)}">
      <header class="build-detail__header">
        <div class="build-detail__header-copy">
          <p class="build-detail__lane">${escapeHtml(getLaneLabel(item.lane, lanes))}</p>
          <p class="build-detail__status build-detail__status--${escapeHtml(toClassSlug(item.status))}">${escapeHtml(item.status)}</p>
          <h2>${escapeHtml(item.title)}</h2>
          <p class="build-detail__outcome">${escapeHtml(item.outcome)}</p>
        </div>
        ${renderQuestIcon(item)}
      </header>
      ${renderQuestBriefingSections(item.briefing)}
      ${renderQuestTraits(item.traits)}
    </article>
  </section>
`.trim();

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

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    void mountEnSite().catch((error) => {
      console.error(error);
    });
  }, { once: true });
}
