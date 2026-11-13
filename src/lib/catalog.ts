export interface CatalogItem { category: string; type: string; year: number; categoryOrder: number; order: number; }
export interface CatalogFilters { category: string; type: string; year: string; sort: string; }
export const isCompactCategory = (category: string) => ['drawing-painting', 'collage-mixed'].includes(category);
export function filterCatalog<T extends CatalogItem>(items: T[], filters: CatalogFilters): T[] {
  return items.filter(item => (!filters.category || item.category === filters.category) && (!filters.type || item.type === filters.type) && (!filters.year || item.year === Number(filters.year))).sort((a, b) => {
    if (filters.sort === 'newest') return b.year - a.year || a.order - b.order;
    if (filters.sort === 'oldest') return a.year - b.year || a.order - b.order;
    if (filters.sort === 'category') return a.categoryOrder - b.categoryOrder || a.order - b.order;
    return a.order - b.order;
  });
}
