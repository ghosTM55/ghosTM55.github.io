const portraitParticleCleanups = new WeakMap();

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

export function mountParticlePortrait(canvas, src) {
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
