export {};
for (const gallery of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-slide]'));
  const thumbnails = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-index]'));
  const dialog = gallery.querySelector<HTMLDialogElement>('dialog')!;
  const viewport = dialog.querySelector<HTMLElement>('.gallery-lightbox-viewport')!;
  const enlarged = dialog.querySelector<HTMLImageElement>('img')!;
  let current = 0;
  let zoom = 1;
  let fittedWidth = 0;
  let previousOverflow = '';
  function show(index: number) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; const video = slide.querySelector('video'); if (video) { if (slide.hidden) video.pause(); else video.play().catch(() => { video.controls = true; }); } });
    thumbnails.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  function setZoom(value: number) {
    zoom = Math.max(1, Math.min(4, value));
    dialog.classList.toggle('is-zoomed', zoom > 1);
    enlarged.style.width = zoom > 1 ? `${fittedWidth * zoom}px` : '';
    dialog.querySelector<HTMLButtonElement>('[data-zoom-step="-1"]')!.disabled = zoom === 1;
    dialog.querySelector<HTMLButtonElement>('[data-zoom-reset]')!.disabled = zoom === 1;
    dialog.querySelector<HTMLButtonElement>('[data-zoom-step="1"]')!.disabled = zoom === 4;
    if (zoom === 1) viewport.scrollTo(0, 0);
    else viewport.scrollTo((viewport.scrollWidth - viewport.clientWidth) / 2, (viewport.scrollHeight - viewport.clientHeight) / 2);
  }
  function fit() { setZoom(1); fittedWidth = enlarged.getBoundingClientRect().width; }
  thumbnails.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.galleryIndex))));
  gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.galleryStep))));
  gallery.addEventListener('keydown', event => {
    if (!dialog.open && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
    if (dialog.open && ['+', '=', '-', '0'].includes(event.key)) { event.preventDefault(); setZoom(event.key === '0' ? 1 : zoom + (event.key === '-' ? -.5 : .5)); }
  });
  gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-open]').forEach(button => button.addEventListener('click', () => {
    const image = slides[current].querySelector('img');
    if (!image) return;
    enlarged.src = image.currentSrc || image.src;
    enlarged.alt = image.alt;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    fit();
  }));
  enlarged.addEventListener('load', fit);
  window.addEventListener('resize', () => { if (dialog.open) fit(); });
  dialog.querySelector('[data-gallery-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.documentElement.style.overflow = previousOverflow; setZoom(1); });
  dialog.querySelectorAll<HTMLButtonElement>('[data-zoom-step]').forEach(button => button.addEventListener('click', () => setZoom(zoom + Number(button.dataset.zoomStep) * .5)));
  dialog.querySelector('[data-zoom-reset]')!.addEventListener('click', fit);
  dialog.querySelector('[data-zoom-toggle]')!.addEventListener('click', () => setZoom(zoom === 1 ? 2 : 1));
  let drag: { x: number; y: number; left: number; top: number } | null = null;
  let dragged = false;
  enlarged.draggable = false;
  viewport.addEventListener('pointerdown', event => {
    dragged = false;
    if (zoom === 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) return;
    const x = event.clientX - drag.x, y = event.clientY - drag.y;
    if (Math.abs(x) + Math.abs(y) > 4) dragged = true;
    if (dragged && !viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
    viewport.scrollTo(drag.left - x, drag.top - y);
  });
  viewport.addEventListener('pointerup', () => { drag = null; });
  viewport.addEventListener('pointercancel', () => { drag = null; });
  viewport.addEventListener('click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } }, true);
  show(0);
}
