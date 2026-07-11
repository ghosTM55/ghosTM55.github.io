export const CHARACTER_CACHE_VERSION = 'fe795a3070be';

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
