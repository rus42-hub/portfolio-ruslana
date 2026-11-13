import { scrollPose } from '../lib/project-motion';
import { smoothMotion } from '../lib/smooth-motion';
import { watchScrollMotion } from './scroll-motion';
const summaries = document.querySelectorAll<HTMLElement>('.project-summary');
if (summaries.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.add('is-visible');
      observer.unobserve(target);
    }
  }, { threshold: .2 });
  for (const summary of summaries) {
    summary.dataset.reveal = '';
    observer.observe(summary);
  }
}
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-project]')).map(section => {
  const stage = section.querySelector<HTMLElement>('.project-stage')!;
  const heading = stage.querySelector<HTMLElement>('h2')!;
  const frames = Array.from(stage.querySelectorAll<HTMLElement>('.project-paper-media, .project-poster')).map(frame => {
    const overlay = document.createElement('div');
    overlay.className = 'project-image-heading';
    overlay.setAttribute('aria-hidden', 'true');
    const plane = document.createElement('div');
    plane.className = 'project-heading-plane';
    const copy = heading.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    copy.querySelector('.sr-only')?.remove();
    plane.append(copy); overlay.append(plane); frame.append(overlay);
    return { frame, plane };
  });
  return { section, stage, frames, print: section.classList.contains('home-project-print'), travel: 0, headingScale: 1 };
});
const modelTracks = Array.from(document.querySelectorAll<HTMLElement>('.home-model-track'), track => ({
  track, frame: track.querySelector<HTMLElement>('.home-model-composition')!
}));
if (modelTracks.length) watchScrollMotion((_delta, _snap, reduced) => {
  for (const model of modelTracks) {
    const { track, frame } = model;
    const entering = Math.max(0, Math.min(1, track.getBoundingClientRect().top / window.innerHeight));
    track.style.setProperty('--project-heading-scale', String(reduced ? 1 : 1 + entering * .18));
    if (window.innerWidth >= 768) continue;
    const top = (window.innerHeight - frame.offsetHeight) / 2;
    track.style.setProperty('--model-pin-top', `${top}px`);
  }
  return false;
});
if (sections.length) watchScrollMotion((delta, snap, reduced) => {
  let moving = false;
  const mobile = window.innerWidth < 768;
  for (const item of sections) {
    const { section, stage, frames, print } = item;
    const bounds = stage.getBoundingClientRect();
    const target = scrollPose(bounds.top, bounds.height, window.innerHeight, mobile, reduced);
    const travel = item.travel = smoothMotion(item.travel, target.travel, delta, snap, 200);
    const headingScale = item.headingScale = smoothMotion(item.headingScale, target.headingScale, delta, snap, 200);
    moving ||= travel !== target.travel || headingScale !== target.headingScale;
    if (!print) section.style.setProperty('--project-y', `${-travel * (mobile ? 14 : 85)}px`);
    if (!print) section.style.setProperty('--project-rotation', `${-travel * (mobile ? 2 : 4)}deg`);
    section.style.setProperty('--project-heading-scale', String(headingScale));
    for (const [index, { frame, plane }] of frames.entries()) {
      if (print) {
        frame.style.setProperty('--poster-y', `${-travel * (mobile ? 14 : index === 1 ? 85 : 45)}px`);
        frame.style.setProperty('--poster-scale', String(mobile ? 1 : 1 - Math.abs(travel) * (index === 1 ? .05 : .12)));
        frame.style.setProperty('--poster-rotation', `${mobile ? -travel * 2 : (index - 1) * 9 - travel * (index === 1 ? 3 : 6)}deg`);
      }
      // Keep the duplicate heading aligned with the page while its image moves.
      // The image's own mask clips the light outline to the exact paper edge.
      const rect = frame.getBoundingClientRect();
      const matrix = new DOMMatrix(getComputedStyle(frame).transform);
      matrix.e = rect.left + rect.width / 2 - bounds.left - matrix.a * frame.offsetWidth / 2 - matrix.c * frame.offsetHeight / 2;
      matrix.f = rect.top + rect.height / 2 - bounds.top - matrix.b * frame.offsetWidth / 2 - matrix.d * frame.offsetHeight / 2;
      plane.style.width = `${bounds.width}px`;
      plane.style.height = `${bounds.height}px`;
      plane.style.transform = matrix.inverse().toString();
    }
  }
  return moving;
});
