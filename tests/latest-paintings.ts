import assert from 'node:assert/strict';
import { latestPaintings, type FullProject } from '../src/lib/projects';
const paintings = Array.from({ length: 10 }, (_, index) => ({ slug: `painting-${index}`, created: `2026-10-${String(index + 1).padStart(2, '0')} 10:00:00.000Z`, completed_year: 2030 - index, categoryRecord: { slug: 'drawing-painting' } } as FullProject));
const collage = { ...paintings[0], slug: 'collage', created: '2026-12-01 10:00:00.000Z', categoryRecord: { slug: 'collage-mixed' } } as FullProject;
const source = [collage, ...paintings];
assert.deepEqual(latestPaintings(source).map(project => project.slug), ['painting-9', 'painting-8', 'painting-7', 'painting-6', 'painting-5', 'painting-4', 'painting-3', 'painting-2']);
assert.deepEqual(source, [collage, ...paintings]);
assert.equal(latestPaintings(paintings.slice(0, 3)).length, 3);
console.log('PASS: eight newest additions, no collage, creation year ignored, source order preserved.');
