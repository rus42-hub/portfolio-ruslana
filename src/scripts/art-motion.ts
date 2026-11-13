import { smoothMotion } from '../lib/smooth-motion';
import { watchScrollMotion } from './scroll-motion';
const artworks = Array.from(document.querySelectorAll<HTMLElement>('[data-art-float]')).map(artwork => ({ artwork, progress: 0, y: 0 }));
if (artworks.length) watchScrollMotion((delta, snap, reduced) => {
  let moving = false;
  for (const item of artworks) {
    const { artwork } = item;
    const bounds = artwork.getBoundingClientRect();
    const index = Number(artwork.dataset.artIndex);
    // Read the stationary grid cell so the transform cannot feed back into the next scroll calculation.
    const center = bounds.top + bounds.height / 2 - item.y;
    const target = reduced ? 0 : Math.max(-1, Math.min(1, (window.innerHeight / 2 - center) / window.innerHeight));
    const progress = item.progress = smoothMotion(item.progress, target, delta, snap);
    moving ||= progress !== target;
    const distance = (window.innerWidth < 768 ? 50 : 110) + index % 3 * 16;
    const y = item.y = -progress * distance;
    const rotation = progress * (index % 2 ? -5 : 5);
    artwork.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
  }
  return moving;
});
