import { filterCatalog } from '../lib/catalog';
const catalog = document.querySelector<HTMLElement>('[data-project-catalog]');
if (catalog) {
  const form = catalog.querySelector<HTMLFormElement>('form')!;
  const list = catalog.querySelector<HTMLElement>('[data-project-list]')!;
  const cards = Array.from(list.querySelectorAll<HTMLElement>('.catalog-card'));
  const items = cards.map(card => ({ card, category: card.dataset.category || '', type: card.dataset.type || '', year: Number(card.dataset.year), categoryOrder: Number(card.dataset.categoryOrder), order: Number(card.dataset.order) }));
  const count = catalog.querySelector<HTMLElement>('[data-result-count]')!;
  const empty = catalog.querySelector<HTMLElement>('[data-empty]')!;
  function update() {
    const data = new FormData(form);
    const category = String(data.get('category') || '');
    const type = String(data.get('type') || '');
    const year = String(data.get('year') || '');
    const sort = String(data.get('sort') || 'recommended');
    catalog!.querySelector<HTMLElement>('[data-filter-active]')!.hidden = !type && !year;
    catalog!.querySelector<HTMLElement>('[data-sort-active]')!.hidden = sort === 'recommended';
    const visible = filterCatalog(items, { category, type, year, sort });
    const visibleCards = new Set(visible.map(item => item.card));
    for (const card of cards) card.hidden = !visibleCards.has(card);
    visible.forEach(item => list.append(item.card));
    count.textContent = String(visible.length);
    empty.hidden = visible.length !== 0;
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (type) query.set('type', type);
    if (year) query.set('year', year);
    if (sort !== 'recommended') query.set('sort', sort);
    history.replaceState(null, '', `${location.pathname}${query.size ? '?' + query : ''}`);
  }
  const params = new URLSearchParams(location.search);
  const category = form.querySelector<HTMLInputElement>(`input[name="category"][value="${CSS.escape(params.get('category') || '')}"]`);
  if (category) category.checked = true;
  for (const name of ['type', 'year', 'sort']) {
    const select = form.querySelector<HTMLSelectElement>(`select[name="${name}"]`)!;
    const value = params.get(name);
    if (value && [...select.options].some(option => option.value === value)) select.value = value;
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => requestAnimationFrame(update));
  const menus = Array.from(form.querySelectorAll<HTMLDetailsElement>('details'));
  document.addEventListener('click', event => { for (const menu of menus) if (!menu.contains(event.target as Node)) menu.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') for (const menu of menus) if (menu.open) { menu.open = false; menu.querySelector('summary')?.focus(); } });
  update();
}
