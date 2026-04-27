const COVER_REVEAL_DELAY_MS = 3000;
const HEADING_REVEAL_DELAY_MS = 500;
const HEADING_FADE_DURATION_MS = 420;
const COMPACT_BIO_MIN_WIDTH = 737;
const SHADER_IDLE_TIMEOUT_MS = 800;
const SOCIAL_STAGGER_MS = 55;
const SOCIAL_REVEAL_DURATION_MS = 180;
const ENTER_TRANSITION_DURATION_MS = 3100;
const ENTER_TRANSITION_REDUCED_DURATION_MS = 80;
const CHARACTER_RESOURCE_HINTS = [
  { href: '/character/', rel: 'prefetch', as: 'document' },
  { href: '/assets/css/fontawesome-all.min.css', rel: 'preload', as: 'style' },
  { href: '/assets/css/main.css?v=nong-studio-wide-card-20260427', rel: 'preload', as: 'style' },
  { href: '/assets/js/character-site-data.js?v=character-url-migration-v2-20260427', rel: 'modulepreload' },
  { href: '/assets/js/character-site.js?v=character-url-migration-v2-20260427', rel: 'modulepreload' },
  { href: '/assets/portrait.jpg', rel: 'preload', as: 'image' }
];

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

function preloadCharacterResources({
  doc = document,
  win = window
} = {}) {
  if (doc?.head) {
    CHARACTER_RESOURCE_HINTS.forEach((hint) => {
      const link = doc.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;

      if (hint.as) {
        link.as = hint.as;
      }

      doc.head.appendChild(link);
    });
  }

  if (typeof Image === 'undefined') return;

  const portraitImage = new Image();
  portraitImage.decoding = 'async';
  portraitImage.src = '/assets/portrait.jpg';
  win.__characterPortraitPreload = portraitImage;

  portraitImage.decode?.().catch(() => {});
}

function initializeSite({
  body = document.body,
  shaderFrame = document.getElementById('cover-shader'),
  headerEl = document.getElementById('header'),
  bioEl = headerEl?.querySelector('p'),
  socialItems = Array.from(document.querySelectorAll('#cover-social li'))
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
    body.classList.add('is-cover-heading-visible', 'is-cover-social-visible', 'is-cover-revealed');
    return;
  }

  let bioDuration = 0;

  if (prefersReducedMotion) {
    syncBioLayout();
    body.classList.add('is-cover-heading-visible', 'is-cover-social-visible', 'is-cover-revealed');
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

  const socialDuration = Math.max(0, socialItems.length - 1) * SOCIAL_STAGGER_MS + SOCIAL_REVEAL_DURATION_MS;
  const ctaDelay = Math.max(
    COVER_REVEAL_DELAY_MS,
    bioStartDelay + bioDuration + socialDuration
  );

  window.setTimeout(() => {
    body.classList.add('is-cover-revealed');
  }, ctaDelay);

  window.addEventListener('resize', () => {
    syncBioLayout();
    queueShaderLoad({ body, shaderFrame });
  }, { passive: true });
}

function initializeEnterTransition({
  body = document.body,
  enterLink = document.getElementById('enter-world'),
  transitionLayer = document.getElementById('page-transition'),
  win = window,
  setTimeoutFn = window.setTimeout.bind(window),
  resourcePreloader = preloadCharacterResources,
} = {}) {
  if (!body || !enterLink || !transitionLayer || !win) return;

  const prefersReducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const transitionDuration = prefersReducedMotion
    ? ENTER_TRANSITION_REDUCED_DURATION_MS
    : ENTER_TRANSITION_DURATION_MS;

  enterLink.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (enterLink.dataset.transitioning === 'true') return;

    const targetHref = event.currentTarget.href;

    event.preventDefault();
    enterLink.dataset.transitioning = 'true';

    try {
      resourcePreloader?.({ targetHref, win });
    } catch {
      // Resource hints are opportunistic; navigation must stay reliable.
    }

    body.classList.add('is-enter-transitioning');
    transitionLayer.classList.add('is-active');
    transitionLayer.setAttribute('aria-hidden', 'false');

    setTimeoutFn(() => {
      if (!win.location) win.location = {};
      win.location.href = targetHref;
    }, transitionDuration);
  });
}

function bootstrapSite() {
  document.body.classList.remove('is-preload');
  initializeSite();
  initializeEnterTransition();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.body) {
    bootstrapSite();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrapSite, { once: true });
  }
}
