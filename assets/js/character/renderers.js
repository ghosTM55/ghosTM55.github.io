import { characterAttributes, originNarrative, questEntries, questLanes } from '../character-site-data.js?v=character-url-migration-v2-20260427';
import { escapeHtml, toClassSlug } from './utils.js';

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

export const renderSlideTabs = (slides = []) => slides.map((slide, index) => `
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

export const renderSlideIndicator = (slide) => `
  <span class="slide-indicator__label">Active Console</span>
  <strong>${escapeHtml(slide.label)}</strong>
`.trim();

export const renderCharacterReadout = () => `
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

export const renderCharacterRadar = (attributes = characterAttributes) => `
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

export const renderCharacterDetail = (attribute) => `
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

export const renderCharacterActions = () => '';

const getOriginNodes = (narrative = originNarrative) => (narrative.layers ?? []).flatMap((layer) => layer.nodes ?? []);

export { getOriginNodes };

export const renderOriginTechTree = (layers = []) => `
  <div class="origin-tech-tree" aria-label="Foundation tech tree">
    ${layers.map((layer) => `
      <section class="origin-tech-layer" data-origin-layer="${escapeHtml(layer.id)}">
        <header class="origin-tech-layer__header">
          <span>${escapeHtml(layer.code)}</span>
          <strong>${escapeHtml(layer.label)}</strong>
        </header>
        <div class="origin-tech-layer__nodes">
          ${(layer.nodes ?? []).map((node) => `
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

export const renderOriginDetail = (node) => {
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

const getLaneLabel = (laneId, lanes = []) => lanes.find((lane) => lane.id === laneId)?.label ?? laneId;

const renderQuestColumnHeader = (title) => `
  <div class="quest-column-header">
    <span>${escapeHtml(title)}</span>
  </div>
`.trim();

export const renderQuestLanes = (lanes = questLanes) => `
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

export const renderQuestNetwork = (entries = questEntries) => `
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

export const renderQuestDetail = (item, lanes = questLanes) => `
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
