import assert from 'node:assert/strict';
import { getTrophySummary, renderTrophyCollection, renderQuestDetail } from '../assets/js/character/renderers.js';
import { questEntries, questLanes } from '../assets/js/character-site-data.js';

const records = [
  { id: 'silver-first', tier: 'silver' },
  { id: 'gold-first', tier: 'gold' },
  { id: 'silver-second', tier: 'silver' },
  { id: 'platinum', tier: 'platinum' },
  { id: 'gold-second', tier: 'gold' },
  { id: 'bronze', tier: 'bronze' }
].map((record) => Object.freeze({
  ...record, title: 'A & <B>', description: 'Example', rarity: 'Rare', iconClass: 'fas fa-trophy'
}));
Object.freeze(records);

const html = renderTrophyCollection(records);
assert.deepEqual([...html.matchAll(/data-trophy-id="([^"]+)"/g)].map((match) => match[1]), [
  'platinum', 'gold-first', 'gold-second', 'silver-first', 'silver-second', 'bronze'
]);
assert.match(html, /A &amp; &lt;B&gt;/);
assert.deepEqual(getTrophySummary(records).counts, { platinum: 1, gold: 2, silver: 2, bronze: 1 });
assert.equal(getTrophySummary([]).total, 0);
assert.doesNotMatch(renderTrophyCollection([]), /data-trophy-id=/);

for (const quest of questEntries) {
  for (const field of ['origin', 'actions', 'takeaway']) {
    assert.equal(typeof quest.briefing?.[field], 'string', `${quest.id}: missing briefing ${field}`);
    assert.ok(quest.briefing[field].trim(), `${quest.id}: empty briefing ${field}`);
  }
  const detail = renderQuestDetail(quest, questLanes);
  assert.ok(detail.includes(`data-active-quest-id="${quest.id}"`));
  assert.deepEqual([...detail.matchAll(/class="build-detail__briefing-section" aria-label="([^"]+)"/g)]
    .map((match) => match[1]), ['Origin', 'Actions Taken', 'Takeaway']);
}
