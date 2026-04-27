export const CHARACTER_CACHE_VERSION = '20260427';
export const CHARACTER_SITE_VERSION = 'character-url-migration-v2-20260427';
export const CHARACTER_CSS_VERSION = 'nong-studio-wide-card-20260427';

export function withAssetVersion(path, version = CHARACTER_CACHE_VERSION) {
  if (!path || !version || path.includes('?')) {
    return path;
  }

  return `${path}?v=${version}`;
}

export function questImage(fileName, mediaAlt, options = {}) {
  const { version = CHARACTER_CACHE_VERSION, ...mediaOptions } = options;

  return {
    mediaSrc: withAssetVersion(`../assets/images/quests/${fileName}`, version),
    mediaAlt,
    ...mediaOptions
  };
}
