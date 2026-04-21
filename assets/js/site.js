const COVER_REVEAL_DELAY_MS = 3000;
const HEADING_REVEAL_DELAY_MS = 500;
const HEADING_FADE_DURATION_MS = 420;
const SOCIAL_STAGGER_MS = 55;
const SOCIAL_REVEAL_DURATION_MS = 180;

export function getCoverRevealState({
  bioAnimated,
  linksVisible
}) {
  return {
    buttonVisible: Boolean(bioAnimated && linksVisible)
  };
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

export function initializeSite({
  body = document.body,
  headerEl = document.getElementById('header'),
  bioEl = headerEl?.querySelector('p'),
  socialItems = Array.from(document.querySelectorAll('#cover-social li'))
} = {}) {
  if (!body || !headerEl || !bioEl) return;

  const bioText = bioEl.textContent ?? '';

  let bioDuration = 0;
  if (bioText) {
    primeSplitFlapText(bioEl, bioText);
    bioDuration = getSplitFlapDuration(bioText);
  }

  const bioStartDelay = HEADING_REVEAL_DELAY_MS + HEADING_FADE_DURATION_MS;

  window.setTimeout(() => {
    body.classList.add('is-cover-heading-visible');
  }, HEADING_REVEAL_DELAY_MS);

  if (bioText) {
    window.setTimeout(() => {
      playSplitFlap(bioEl, bioText);
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
    const reveal = getCoverRevealState({
      bioAnimated: true,
      linksVisible: true
    });

    if (reveal.buttonVisible) {
      body.classList.add('is-cover-revealed');
    }
  }, ctaDelay);
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
