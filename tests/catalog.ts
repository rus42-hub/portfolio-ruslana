import assert from 'node:assert/strict';
import { filterCatalog, isCompactCategory, type CatalogFilters } from '../src/lib/catalog';
const items = [
  { id: 'poster', category: 'print', type: 'university', year: 2026, categoryOrder: 2, order: 1 },
  { id: 'web', category: 'web', type: 'personal', year: 2026, categoryOrder: 1, order: 0 },
  { id: 'older-web', category: 'web', type: 'professional', year: 2024, categoryOrder: 1, order: 2 }
];
const defaults: CatalogFilters = { category: '', type: '', year: '', sort: 'recommended' };
const ids = (changes: Partial<CatalogFilters> = {}) => filterCatalog(items, { ...defaults, ...changes }).map(item => item.id);
assert.deepEqual(ids(), ['web', 'poster', 'older-web']);
assert.deepEqual(ids({ category: 'print', type: 'university', year: '2026' }), ['poster']);
assert.deepEqual(ids({ category: 'web', type: 'university' }), []);
assert.deepEqual(ids({ sort: 'newest' }), ['web', 'poster', 'older-web']);
assert.deepEqual(ids({ sort: 'oldest' }), ['older-web', 'web', 'poster']);
assert.deepEqual(ids({ sort: 'category' }), ['web', 'older-web', 'poster']);
assert.deepEqual(ids({ year: '2024' }), ['older-web']);
assert.deepEqual(items.map(item => item.id), ['poster', 'web', 'older-web']);
assert.equal(isCompactCategory('drawing-painting'), true);
assert.equal(isCompactCategory('collage-mixed'), true);
assert.equal(isCompactCategory('web'), false);
assert.equal(isCompactCategory('3d'), false);
console.log('PASS: combined filters, empty results, year sorting, category grouping, stable priorities.');
