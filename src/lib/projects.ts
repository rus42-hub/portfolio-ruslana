import { url, type Language } from '../i18n';
export interface PBRecord { id: string; [key: string]: unknown; }
export interface Category extends PBRecord { slug: string; sort_order: number; }
export interface Media extends PBRecord { project: string; type: 'image' | 'video'; position: number; image: string; video?: string; media_url: string; }
export interface Section extends PBRecord { project: string; position: number; detail_image: string; detail_image_mobile: string; button_url: string; }
export interface Project extends PBRecord { slug: string; category: string; work_type: string; completed_year: number; home_rank: number; priority_rank: number; accent_auto: string; accent_override: string; }
export interface FullProject extends Project { categoryRecord: Category; media: Media[]; sections: Section[]; }
const baseURL = (import.meta.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8097').replace(/\/$/, '');
async function records<T>(collection: string): Promise<T[]> {
  const result: T[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await fetch(`${baseURL}/api/collections/${collection}/records?perPage=100&page=${page}`);
    if (!response.ok) throw new Error(`PocketBase ${collection}: HTTP ${response.status}`);
    const data = await response.json();
    result.push(...data.items);
    totalPages = data.totalPages;
    page++;
  } while (page <= totalPages);
  return result;
}
export async function getPortfolio() {
  const [projects, categories, media, sections] = await Promise.all([records<Project>('projects'), records<Category>('categories'), records<Media>('project_media'), records<Section>('project_sections')]);
  const populated: FullProject[] = projects.map(project => {
    const categoryRecord = categories.find(category => category.id === project.category);
    if (!categoryRecord) throw new Error(`Missing category for ${project.slug}`);
    return { ...project, categoryRecord, media: media.filter(item => item.project === project.id).sort((a, b) => a.position - b.position), sections: sections.filter(item => item.project === project.id).sort((a, b) => a.position - b.position) };
  });
  return { projects: populated.sort(recommended), categories: categories.sort((a, b) => a.sort_order - b.sort_order) };
}
export const field = (record: PBRecord, name: string, lang: Language): string => String(record[`${name}_${lang}`] || record[`${name}_fr`] || '');
export const projectTitle = (project: Project, lang: Language) => `${field(project, 'title', lang)}${field(project, 'title_outline', lang) ? (field(project, 'title_join', lang) === 'none' ? '' : ' ') + field(project, 'title_outline', lang) : ''}`;
export const projectURL = (project: Project, lang: Language) => url(lang, 'projects', project.slug);
export const fileURL = (record: PBRecord, collection: string, filename: string) => filename ? `${baseURL}/api/files/${collection}/${record.id}/${encodeURIComponent(filename)}` : '';
export const mediaURL = (media: Media) => fileURL(media, 'project_media', (media.type === 'video' ? media.video : media.image) || '') || media.media_url;
export const accent = (project: Project) => /^#[0-9a-f]{6}$/i.test(project.accent_override || project.accent_auto) ? project.accent_override || project.accent_auto : 'var(--color-accent)';
export const latestPaintings = (projects: FullProject[]) => projects.filter(project => project.categoryRecord.slug === 'drawing-painting').sort((a, b) => String(b.created).localeCompare(String(a.created)) || a.slug.localeCompare(b.slug)).slice(0, 8);
export function recommended(a: Project, b: Project) { return (a.priority_rank || Infinity) - (b.priority_rank || Infinity) || b.completed_year - a.completed_year || a.slug.localeCompare(b.slug); }
