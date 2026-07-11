import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDirectory = path.join(root, 'assets');
const checkOnly = process.argv.includes('--check');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function normalizedContent(file) {
  const content = fs.readFileSync(file);
  if (!/\.(?:css|html|js|mjs|svg)$/.test(file)) return content;
  return Buffer.from(content.toString('utf8')
    .replace(/\?v=[A-Za-z0-9_-]+/g, '?v=VERSION')
    .replace(/CHARACTER_CACHE_VERSION = '[A-Za-z0-9_-]+'/g, "CHARACTER_CACHE_VERSION = 'VERSION'"));
}

const versionInputs = [...walk(assetsDirectory), path.join(root, 'character/index.html')].sort();
const hash = crypto.createHash('sha256');
for (const file of versionInputs) {
  hash.update(path.relative(root, file));
  hash.update('\0');
  hash.update(normalizedContent(file));
  hash.update('\0');
}
const version = hash.digest('hex').slice(0, 12);

const editableFiles = [
  ...walk(assetsDirectory).filter((file) => /\.(?:css|html|js|mjs|svg)$/.test(file)),
  path.join(root, 'character/index.html')
];
const versionedFiles = editableFiles.filter((file) => /\?v=[A-Za-z0-9_-]+/.test(fs.readFileSync(file, 'utf8')));
const currentVersions = new Set(versionedFiles.flatMap((file) => (
  [...fs.readFileSync(file, 'utf8').matchAll(/\?v=([A-Za-z0-9_-]+)/g)].map((match) => match[1])
)));

if (checkOnly) {
  if (currentVersions.size !== 1 || !currentVersions.has(version)) {
    throw new Error(`Cache version is stale; run node scripts/bump-cache-version.mjs (expected ${version})`);
  }
  console.log(`Cache version ${version} matches asset content.`);
  process.exit(0);
}

for (const file of versionedFiles) {
  const source = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, source.replace(/\?v=[A-Za-z0-9_-]+/g, `?v=${version}`));
}

const assetsModule = path.join(assetsDirectory, 'js/character/assets.js');
const assetsSource = fs.readFileSync(assetsModule, 'utf8');
fs.writeFileSync(assetsModule, assetsSource.replace(
  /CHARACTER_CACHE_VERSION = '[A-Za-z0-9_-]+'/,
  `CHARACTER_CACHE_VERSION = '${version}'`
));

console.log(`Cache version updated to ${version}.`);
