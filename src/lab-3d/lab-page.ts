import { smoothMotion } from '../lib/smooth-motion';
import type { LabModel } from './models';

type Viewer = Awaited<ReturnType<typeof import('./viewer').createViewer>>;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stats: Record<string, number> = ((window as unknown as { __lab3d: Record<string, number> }).__lab3d ??= {});

/** The 3D code is fetched only when the frame comes close to the screen. */
function whenNear(element: HTMLElement, action: () => void) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    action();
  }, { rootMargin: element.dataset.labMode === 'home' ? '1100px 0px' : '500px 0px' });
  observer.observe(element);
  return () => observer.disconnect();
}

async function mount(frame: HTMLElement) {
  const model = JSON.parse(frame.dataset.labModel!) as LabModel;
  const started = performance.now();
  const bar = frame.querySelector<HTMLElement>('[data-lab-progress]');
  const [{ createViewer }, path] = await Promise.all([
    import('./viewer'),
    ['home', 'path', 'gallery'].includes(frame.dataset.labMode!) ? fetch(`/lab-3d/models/${model.slug}-path.json`).then(response => {
      if (!response.ok) throw new Error(`Camera path: ${response.status}`);
      return response.json();
    }) : undefined,
  ]);
  const viewer = await createViewer({
    container: frame.querySelector<HTMLElement>('[data-lab-canvas]')!,
    url: `/lab-3d/models/${model.slug}.glb`,
    camera: model.camera, fit: Number(frame.dataset.labFit) || model.fit, lift: model.lift, gain: model.gain, glow: model.glow, focus: model.focus, light: model.light, lampPower: model.lampPower, lampTint: model.lampTint, envLight: model.envLight, glowParts: model.glowParts, tone: model.tone, startAt: model.startAt, glowTints: model.glowTints, matte: model.matte, fill: model.fill, smoothParts: model.smoothParts, shadowSoftness: model.shadowSoftness, innerGlow: model.innerGlow, corkParts: model.corkParts, sideGlow: model.sideGlow, toneMapping: model.toneMapping, exposure: model.exposure, worldLight: model.worldLight, rims: model.rims, path, world: model.world, worldTurn: model.worldTurn, pitch: model.pitch,
    onProgress: share => bar?.style.setProperty('--lab-progress', String(share)),
  });
  frame.classList.add('is-ready');
  stats[frame.dataset.labMode || model.slug] = Math.round(performance.now() - started);
  return viewer;
}

/** Option A: the frame travels like the home page and the model turns with the scroll. */
function scrollTurn(frame: HTMLElement, viewer: Viewer) {
  const stage = frame.closest<HTMLElement>('.project-stage')!;
  let angle = 0;
  let previous = 0;
  let waiting = 0;
  function tick(time: number) {
    waiting = 0;
    const box = stage.getBoundingClientRect();
    const middle = (window.innerHeight / 2 - box.top - box.height / 2) / window.innerHeight;
    const target = reduced() ? 0 : Math.max(-1, Math.min(1, middle)) * Math.PI;
    const next = smoothMotion(angle, target, previous ? Math.min(time - previous, 64) : 16);
    previous = next === target ? 0 : time;
    angle = next;
    viewer.turn(angle);
    if (previous) schedule();
  }
  function schedule() { waiting ||= requestAnimationFrame(tick); }
  window.addEventListener('scroll', schedule, { passive: true });
  schedule();
}

/** Option B: the section stays pinned while the scroll makes one full turn. */
function pinnedTurn(frame: HTMLElement, viewer: Viewer) {
  const pin = frame.closest<HTMLElement>('[data-lab-pin]')!;
  const homeStage = frame.closest<HTMLElement>('[data-lab-pin-stage]');
  const start = viewer.orbitStart;
  let angle = 0;
  let zoom = 1;
  let drawn = false;
  let previous = 0;
  let waiting = 0;
  function tick(time: number) {
    waiting = 0;
    const box = pin.getBoundingClientRect();
    const portrait = homeStage && window.innerWidth < 768;
    const progress = portrait
      ? ((window.innerHeight - frame.offsetHeight) / 2 - box.top) / Math.max(1, box.height - homeStage.offsetHeight)
      : -box.top / Math.max(1, box.height - (homeStage?.offsetHeight ?? window.innerHeight));
    const share = Math.max(0, Math.min(1, portrait ? progress / .84 : homeStage ? (progress - .12) / .72 : progress));
    const delta = previous ? Math.min(time - previous, 64) : 16;
    const turn = homeStage ? (portrait ? share : share * share * (3 - 2 * share)) * Math.PI / 2 : share * Math.PI * 2;
    const nextAngle = smoothMotion(angle, reduced() ? 0 : turn, delta, false, portrait ? 85 : homeStage ? 220 : 120);
    const nextZoom = homeStage ? 1 : smoothMotion(zoom, reduced() ? 1 : 1 - Math.sin(share * Math.PI) * 0.18, delta);
    const moving = nextAngle !== angle || nextZoom !== zoom;
    angle = nextAngle;
    zoom = nextZoom;
    if (homeStage) {
      if (moving || !drawn) {
        viewer.orbit(start.angle + angle, Math.max(3 * Math.PI / 180, Math.min(55 * Math.PI / 180, start.height)), start.zoom);
        drawn = true;
      }
    }
    else { viewer.zoom(zoom); viewer.turn(angle); }
    previous = moving ? time : 0;
    if (moving) schedule();
  }
  function schedule() { waiting ||= requestAnimationFrame(tick); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
}

/** Project page: slow turn on its own, and a free 360° with the mouse or the finger. */
function dragTurn(frame: HTMLElement, viewer: Viewer) {
  const speed = reduced() ? 0 : 0.28;
  let angle = 0;
  let previous = 0;
  let dragging = false;
  let lastX = 0;
  let resumeAt = 0;
  function tick(time: number) {
    const delta = previous ? Math.min(time - previous, 64) : 16;
    previous = time;
    if (!dragging && time > resumeAt) angle += speed * delta / 1000;
    viewer.turn(angle);
    requestAnimationFrame(tick);
  }
  frame.addEventListener('pointerdown', event => {
    dragging = true;
    lastX = event.clientX;
    frame.setPointerCapture(event.pointerId);
    frame.classList.add('is-dragging');
  });
  frame.addEventListener('pointermove', event => {
    if (!dragging) return;
    angle += (event.clientX - lastX) * 0.012;
    lastX = event.clientX;
  });
  const release = () => { dragging = false; resumeAt = performance.now() + 2500; frame.classList.remove('is-dragging'); };
  frame.addEventListener('pointerup', release);
  frame.addEventListener('pointercancel', release);
  requestAnimationFrame(tick);
}

/** Project page: the scroll follows the camera animation made in Blender. */
function cameraPath(frame: HTMLElement, viewer: Viewer) {
  const pin = frame.closest<HTMLElement>('[data-lab-pin]')!;
  let share = 0;
  let previous = 0;
  let waiting = 0;
  function tick(time: number) {
    waiting = 0;
    const box = pin.getBoundingClientRect();
    const target = reduced() ? 0.5 : Math.max(0, Math.min(1, -box.top / (box.height - window.innerHeight)));
    const next = smoothMotion(share, target, previous ? Math.min(time - previous, 64) : 16);
    const moving = next !== share;
    share = next;
    viewer.seek(share);
    previous = moving ? time : 0;
    if (moving) schedule();
  }
  function schedule() { waiting ||= requestAnimationFrame(tick); }
  window.addEventListener('scroll', schedule, { passive: true });
  schedule();
}

/**
 * Project gallery: one 360° space. The model turns slowly on its own from the Blender camera angle;
 * the mouse or the finger takes over (turn, tilt, zoom) and the slow turn resumes from there.
 */
function galleryPlayer(frame: HTMLElement, viewer: Viewer) {
  const slide = frame.closest<HTMLElement>('[data-slide]');
  const playButton = frame.querySelector<HTMLButtonElement>('[data-lab-play]');
  const spin = (JSON.parse(frame.dataset.labModel!) as LabModel).spin ?? 1;
  const fullscreen = frame.querySelector<HTMLButtonElement>('[data-lab-fullscreen]');
  if (fullscreen && document.fullscreenEnabled && frame.requestFullscreen) {
    fullscreen.hidden = false;
    fullscreen.addEventListener('click', () => {
      const change = document.fullscreenElement === frame ? document.exitFullscreen() : frame.requestFullscreen();
      change.catch(error => console.warn('Fullscreen unavailable', error));
    });
    document.addEventListener('fullscreenchange', () => fullscreen.setAttribute('aria-pressed', String(document.fullscreenElement === frame)));
  }
  const surface = frame.querySelector<HTMLElement>('[data-lab-canvas]')!;
  // Vertical tilt, kept between eye level and a view from above.
  const lowest = 3 * Math.PI / 180;
  const highest = 55 * Math.PI / 180;
  const start = viewer.orbitStart;
  let angle = start.angle;
  let height = Math.max(lowest, Math.min(highest, start.height));
  // The view eases towards where the finger or mouse sends it, so every move stays smooth.
  let targetAngle = angle;
  let targetHeight = height;
  const nearest = Math.min((JSON.parse(frame.dataset.labModel!) as LabModel).closest ?? 0.55, start.zoom);
  const farthest = Math.max(1.5, start.zoom);
  let zoom = start.zoom;
  let targetZoom = zoom;
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  let lastX = 0;
  let lastY = 0;
  let playing = !reduced();
  let dragging = false;
  // The wheel zooms only once the visitor has touched the model, so the page still scrolls past it.
  let engaged = false;
  let resumeAt = 0;
  let previous = 0;
  let onScreen = false;
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(frame);
  const draw = () => viewer.orbit(angle, height, zoom);
  function tick(time: number) {
    const delta = previous ? Math.min(time - previous, 64) : 16;
    previous = time;
    const visible = onScreen && !slide?.hidden && !document.hidden;
    if (visible) {
      if (playing && !dragging && time > resumeAt) targetAngle += spin * 0.22 * delta / 1000;
      const nextAngle = smoothMotion(angle, targetAngle, delta);
      const nextHeight = smoothMotion(height, targetHeight, delta);
      const nextZoom = smoothMotion(zoom, targetZoom, delta);
      if (nextAngle !== angle || nextHeight !== height || nextZoom !== zoom) { angle = nextAngle; height = nextHeight; zoom = nextZoom; draw(); }
    }
    requestAnimationFrame(tick);
  }
  function setPlaying(value: boolean) {
    playing = value;
    if (playButton) playButton.textContent = value ? '❚❚' : '▶';
  }
  playButton?.addEventListener('click', () => setPlaying(!playing));
  surface.addEventListener('wheel', event => {
    if (!engaged) return;
    event.preventDefault();
    targetZoom = Math.max(nearest, Math.min(farthest, targetZoom * Math.exp(event.deltaY * 0.0012)));
    resumeAt = performance.now() + 2500;
  }, { passive: false });
  frame.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') engaged = false; });
  const spread = () => { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  surface.addEventListener('pointerdown', event => {
    engaged = true;
    // From the first touch on, the finger turns the model both ways instead of scrolling the page.
    frame.classList.add('is-orbit');
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) pinch = spread();
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    surface.setPointerCapture(event.pointerId);
    frame.classList.add('is-dragging');
  });
  surface.addEventListener('pointermove', event => {
    if (!dragging) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      // Two fingers: spreading them brings the camera closer.
      const now = spread();
      if (pinch) targetZoom = Math.max(nearest, Math.min(farthest, targetZoom * pinch / now));
      pinch = now;
      return;
    }
    targetAngle -= (event.clientX - lastX) * 0.01;
    targetHeight = Math.max(lowest, Math.min(highest, targetHeight + (event.clientY - lastY) * 0.006));
    lastX = event.clientX;
    lastY = event.clientY;
  });
  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    pinch = 0;
    if (pointers.size) { const [rest] = [...pointers.values()]; lastX = rest.x; lastY = rest.y; return; }
    dragging = false;
    resumeAt = performance.now() + 2500;
    frame.classList.remove('is-dragging');
  };
  surface.addEventListener('pointerup', release);
  surface.addEventListener('pointercancel', release);
  setPlaying(playing);
  draw();
  requestAnimationFrame(tick);
}

const modes = { home: pinnedTurn, scroll: scrollTurn, pin: pinnedTurn, drag: dragTurn, path: cameraPath, gallery: galleryPlayer };
for (const frame of document.querySelectorAll<HTMLElement>('[data-lab-model]')) {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    stopObserving();
    mount(frame).then(viewer => modes[frame.dataset.labMode as keyof typeof modes](frame, viewer)).catch(error => {
      console.error(error);
      frame.classList.add('has-failed');
    });
  };
  const stopObserving = whenNear(frame, start);
  if (frame.dataset.labMode === 'home') {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 900 });
    else setTimeout(start, 500);
  }
}
