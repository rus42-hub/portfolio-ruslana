export function watchScrollMotion(update: (delta: number, snap: boolean, reduced: boolean) => boolean) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let previous = 0;
  let snap = true;
  function tick(time: number) {
    frame = 0;
    const moving = update(previous ? Math.min(time - previous, 64) : 16, snap || reducedMotion.matches, reducedMotion.matches);
    snap = false;
    previous = moving ? time : 0;
    if (moving) schedule();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
  function reset() { snap = true; schedule(); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', reset);
  window.addEventListener('load', reset, { once: true });
  reducedMotion.addEventListener('change', reset);
  document.fonts.ready.then(reset);
  schedule();
}
