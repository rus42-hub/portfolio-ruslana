import { smoothMotion } from '../lib/smooth-motion';
import { watchScrollMotion } from './scroll-motion';
const hero = document.querySelector<HTMLElement>('[data-hero]');
let offset = 0;
// Horizontal motion stays in CSS; scrolling only offsets the text layers vertically.
if (hero) watchScrollMotion((delta, snap, reduced) => {
  const target = reduced ? 0 : -Math.min(window.scrollY, hero.offsetHeight) * .45;
  offset = smoothMotion(offset, target, delta, snap);
  hero.style.setProperty('--text-scroll', `${offset}px`);
  return offset !== target;
});

