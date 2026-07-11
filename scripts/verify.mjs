import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, label) {
  assert(new Set(items).size === items.length, `${label} must be unique`);
}

function withoutQuery(value) {
  return value.split(/[?#]/, 1)[0];
}

const sourceFiles = walk(root).filter((file) => (
  !file.includes(`${path.sep}.git${path.sep}`)
  && !file.includes(`${path.sep}tests${path.sep}`)
  && /\.(?:html|css|js|mjs|json)$/.test(file)
));
const jsFiles = sourceFiles.filter((file) => /\.(?:js|mjs)$/.test(file));

for (const file of jsFiles) {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert(check.status === 0, check.stderr || `Syntax check failed: ${path.relative(root, file)}`);
}

const cacheCheck = spawnSync(process.execPath, [path.join(root, 'scripts/bump-cache-version.mjs'), '--check'], { encoding: 'utf8' });
assert(cacheCheck.status === 0, cacheCheck.stderr || cacheCheck.stdout || 'Cache version check failed');

const dataUrl = `${pathToFileURL(path.join(root, 'assets/js/character-site-data.js')).href}?verify=${Date.now()}`;
const assetsUrl = `${pathToFileURL(path.join(root, 'assets/js/character/assets.js')).href}?verify=${Date.now()}`;
const data = await import(dataUrl);
const { CHARACTER_CACHE_VERSION } = await import(assetsUrl);

assertUnique(data.slideDefinitions.map(({ id }) => id), 'Slide IDs');
assertUnique(data.characterAttributes.map(({ id }) => id), 'Attribute IDs');
assertUnique(data.questLanes.map(({ id }) => id), 'Quest lane IDs');
assertUnique(data.questEntries.map(({ id }) => id), 'Quest IDs');
assertUnique(data.trophyRecords.map(({ id }) => id), 'Trophy IDs');

const laneIds = new Set(data.questLanes.map(({ id }) => id));
for (const quest of data.questEntries) {
  assert(laneIds.has(quest.lane), `Unknown lane "${quest.lane}" for quest "${quest.id}"`);
  const mediaPath = path.resolve(root, 'character', withoutQuery(quest.mediaSrc));
  assert(fs.existsSync(mediaPath), `Missing quest media: ${path.relative(root, mediaPath)}`);
}

const characterHtml = fs.readFileSync(path.join(root, 'character/index.html'), 'utf8');
const htmlSlideIds = [...characterHtml.matchAll(/data-slide="([^"]+)"/g)].map((match) => match[1]);
assert(
  JSON.stringify(htmlSlideIds) === JSON.stringify(data.slideDefinitions.map(({ id }) => id)),
  'Character HTML slides must match slideDefinitions order'
);

const runtimeSourceFiles = sourceFiles.filter((file) => !file.includes(`${path.sep}scripts${path.sep}`));
const combinedSource = runtimeSourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const cacheVersions = new Set([...combinedSource.matchAll(/\?v=([A-Za-z0-9_-]+)/g)].map((match) => match[1]));
assert(cacheVersions.size === 1 && cacheVersions.has(CHARACTER_CACHE_VERSION), 'Cache-busting versions must match CHARACTER_CACHE_VERSION');

const characterModuleFiles = jsFiles.filter((file) => (
  file.includes(`${path.sep}assets${path.sep}js${path.sep}character${path.sep}`)
  || file.endsWith(`${path.sep}assets${path.sep}js${path.sep}character-site.js`)
  || file.endsWith(`${path.sep}assets${path.sep}js${path.sep}character-site-data.js`)
));
for (const file of characterModuleFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const imports = [...source.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+\.js(?:\?[^'"]*)?)['"]/g)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'));
  for (const specifier of imports) {
    assert(specifier.includes(`?v=${CHARACTER_CACHE_VERSION}`), `Unversioned character import in ${path.relative(root, file)}: ${specifier}`);
  }
}

const iconCss = fs.readFileSync(path.join(root, 'assets/css/fontawesome-all.min.css'), 'utf8');
const iconNames = new Set([...jsFiles
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n')
  .matchAll(/\bfa-([a-z0-9-]+)/g)]
  .map((match) => match[1]));
for (const iconName of iconNames) {
  assert(iconCss.includes(`.fa-${iconName}:before`), `Missing Font Awesome glyph: fa-${iconName}`);
}

const assetFiles = walk(path.join(root, 'assets'));
const unreferencedAssets = assetFiles.filter((file) => {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const basename = path.basename(file);
  return !combinedSource.includes(relative) && !combinedSource.includes(basename);
});
assert(
  unreferencedAssets.length === 0,
  `Unreferenced assets:\n${unreferencedAssets.map((file) => path.relative(root, file)).join('\n')}`
);

console.log(`Verified ${jsFiles.length} scripts, ${assetFiles.length} assets, ${data.questEntries.length} quests, and ${data.trophyRecords.length} trophies.`);
