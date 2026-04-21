const HEADING_REVEAL_DELAY_MS = 500;
const HEADING_FADE_DURATION_MS = 420;
const COMPACT_BIO_MIN_WIDTH = 737;
const SHADER_IDLE_TIMEOUT_MS = 800;

function shouldUseCompactBio({ viewportWidth } = {}) {
  return typeof viewportWidth === 'number' && viewportWidth < COMPACT_BIO_MIN_WIDTH;
}

function getBioSegments(bioText = '') {
  return bioText
    .split('\u2022')
    .map((segment) => segment.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function getCompactBioDuration(bioText) {
  const chipDelay = 120;

  return getBioSegments(bioText).reduce((total, segment, index) => (
    Math.max(total, (index * chipDelay) + getSplitFlapDuration(segment))
  ), 0) + 120;
}

function shouldLoadShader() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (connection?.saveData) return false;

  return true;
}

function primeSplitFlapText(bioEl, bioText) {
  bioEl.innerHTML = Array.from(bioText).map((ch) => {
    if (ch === ' ' || ch === '\u00a0') return '<span class="sf-char">&nbsp;</span>';
    if (ch === '\u2022') return '<span class="sf-char sf-fade" style="opacity:0">&nbsp;</span>';
    return '<span class="sf-char" style="opacity:0">&nbsp;</span>';
  }).join('');
}

function getSplitFlapDuration(bioText) {
  const flips = 10;
  const flipMs = 55;
  const charDelay = 38;
  const revealableIndexes = Array.from(bioText).flatMap((ch, i) => (
    ch === ' ' || ch === '\u00a0' ? [] : [i]
  ));
  const lastAnimatedIndex = revealableIndexes.at(-1) ?? 0;

  return (lastAnimatedIndex * charDelay) + (flips * flipMs) + 120;
}

function renderCompactBioMarkup(bioEl, bioText, { animated = false } = {}) {
  const fragment = document.createDocumentFragment();

  getBioSegments(bioText).forEach((segment) => {
    const chip = document.createElement('span');
    chip.className = 'bio-chip';
    const text = document.createElement('span');
    text.className = 'bio-chip__text';

    if (animated) {
      primeSplitFlapText(text, segment);
    } else {
      text.textContent = segment;
      chip.classList.add('is-visible');
    }

    chip.appendChild(text);
    fragment.appendChild(chip);
  });

  bioEl.replaceChildren(fragment);
}

function playCompactBio(bioEl, bioText) {
  const chipDelay = 120;
  const chips = Array.from(bioEl.querySelectorAll('.bio-chip'));
  const segments = getBioSegments(bioText);

  chips.forEach((chip, index) => {
    const textEl = chip.querySelector('.bio-chip__text');
    const segment = segments[index];
    if (!textEl || !segment) return;

    window.setTimeout(() => {
      chip.classList.add('is-visible');
      playSplitFlap(textEl, segment);
    }, index * chipDelay);
  });
}

function playSplitFlap(bioEl, bioText) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789•';
  const flips = 10;
  const flipMs = 55;
  const charDelay = 38;

  const start = () => {
    Array.from(bioEl.querySelectorAll('.sf-char')).forEach((span, i) => {
      const target = bioText[i];
      if (target === ' ' || target === '\u00a0') return;

      setTimeout(() => {
        if (target === '\u2022') {
          span.textContent = target;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            span.style.opacity = '1';
          }));
          return;
        }

        let count = 0;
        span.style.opacity = '1';
        span.textContent = chars[Math.floor(Math.random() * chars.length)];

        const interval = setInterval(() => {
          count += 1;
          if (count >= flips) {
            clearInterval(interval);
            span.textContent = target;
          } else {
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
          }
        }, flipMs);
      }, i * charDelay);
    });
  };

  requestAnimationFrame(start);
}

function queueShaderLoad({ body, shaderFrame }) {
  if (!body || !shaderFrame) return;
  if (shaderFrame.dataset.loaded === 'true' || shaderFrame.dataset.pending === 'true') return;

  if (!shouldLoadShader()) {
    body.classList.add('is-cover-static');
    return;
  }

  body.classList.remove('is-cover-static');
  shaderFrame.dataset.pending = 'true';

  const load = () => {
    if (shaderFrame.dataset.loaded === 'true') return;

    const { src } = shaderFrame.dataset;
    delete shaderFrame.dataset.pending;

    if (!src) return;

    shaderFrame.addEventListener('load', () => {
      body.classList.add('is-cover-shader-ready');
    }, { once: true });
    shaderFrame.src = src;
    shaderFrame.dataset.loaded = 'true';
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: SHADER_IDLE_TIMEOUT_MS });
  } else {
    window.setTimeout(load, 220);
  }
}

function initializeSite({
  body = document.body,
  shaderFrame = document.getElementById('cover-shader'),
  headerEl = document.getElementById('header'),
  bioEl = headerEl?.querySelector('p')
} = {}) {
  if (!body || !headerEl || !bioEl) return;

  const bioText = bioEl.textContent ?? '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialCompactBio = shouldUseCompactBio({ viewportWidth: window.innerWidth });

  const syncBioLayout = () => {
    const useCompactBio = shouldUseCompactBio({ viewportWidth: window.innerWidth });

    if (useCompactBio) {
      if (bioEl.dataset.bioLayout !== 'compact') {
        renderCompactBioMarkup(bioEl, bioText, { animated: false });
        bioEl.dataset.bioLayout = 'compact';
      }
      return;
    }

    if (bioEl.dataset.bioLayout === 'compact') {
      bioEl.textContent = bioText;
      delete bioEl.dataset.bioLayout;
    }
  };

  queueShaderLoad({ body, shaderFrame });

  if (!bioText) {
    body.classList.add('is-cover-heading-visible', 'is-cover-social-visible');
    return;
  }

  let bioDuration = 0;

  if (prefersReducedMotion) {
    syncBioLayout();
    body.classList.add('is-cover-heading-visible', 'is-cover-social-visible');
    return;
  }

  if (!initialCompactBio) {
    primeSplitFlapText(bioEl, bioText);
    bioDuration = getSplitFlapDuration(bioText);
  } else {
    renderCompactBioMarkup(bioEl, bioText, { animated: true });
    bioEl.dataset.bioLayout = 'compact';
    bioDuration = getCompactBioDuration(bioText);
  }

  const bioStartDelay = HEADING_REVEAL_DELAY_MS + HEADING_FADE_DURATION_MS;

  window.setTimeout(() => {
    body.classList.add('is-cover-heading-visible');
  }, HEADING_REVEAL_DELAY_MS);

  if (!initialCompactBio) {
    window.setTimeout(() => {
      playSplitFlap(bioEl, bioText);
    }, bioStartDelay);
  } else {
    window.setTimeout(() => {
      playCompactBio(bioEl, bioText);
    }, bioStartDelay);
  }

  window.setTimeout(() => {
    body.classList.add('is-cover-social-visible');
  }, bioStartDelay + bioDuration);

  window.addEventListener('resize', () => {
    syncBioLayout();
    queueShaderLoad({ body, shaderFrame });
  }, { passive: true });
}

function bootstrapSite() {
  document.body.classList.remove('is-preload');
  initializeSite();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.body) {
    bootstrapSite();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrapSite, { once: true });
  }
}
