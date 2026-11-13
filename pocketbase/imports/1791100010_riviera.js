migrate(app => {
  const source = $os.getenv('PORTFOLIO_RIVIERA_SVG');
  if (!source) throw new Error('Set PORTFOLIO_RIVIERA_SVG to the original illustration.');
  if (app.findRecordsByFilter('projects', 'slug = "riviera"', '', 1, 0).length) throw new Error('Riviera already exists; refusing to overwrite.');
  const translated = (name, fr, en = fr, ru = fr) => ({ [`${name}_fr`]: fr, [`${name}_en`]: en, [`${name}_ru`]: ru });
  const save = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); return record; };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const category = app.findRecordsByFilter('categories', 'slug = "vector"', '', 1, 0)[0] || create('categories', { slug: 'vector', sort_order: 5, ...translated('name', 'Illustration vectorielle', 'Vector illustration', 'Векторная иллюстрация') });
  const project = create('projects', {
    slug: 'riviera', category: category.id, work_type: 'personal', completed_year: 2026, status: 'draft', priority_rank: 0, home_rank: 0, accent_override: '#08669B',
    ...translated('title', 'Riv', 'Riv', 'Рив'), ...translated('title_outline', 'iera', 'iera', 'ьера'), ...translated('title_join', 'none'),
    ...translated('project_kind', 'Illustration vectorielle', 'Vector illustration', 'Векторная иллюстрация'), ...translated('tools', 'Figma'),
    ...translated('technique', 'Dessin vectoriel numérique', 'Digital vector drawing', 'Цифровая векторная графика'),
    ...translated('context', 'Expérimentation personnelle · Octobre 2026', 'Personal experiment · October 2026', 'Личный эксперимент · Октябрь 2026'),
    ...translated('role', 'Composition, dessin et choix des couleurs', 'Composition, drawing and colour palette', 'Композиция, отрисовка и подбор палитры'),
    ...translated('description',
      'Riviera est une illustration vectorielle réalisée dans Figma en octobre 2026. J’avais envie d’essayer un autre langage graphique : des formes simplifiées, des aplats de couleur et une composition qui évoque une affiche de voyage.\n\nUn chemin descend entre les fleurs et les palmiers vers une côte éclairée par la lune. Les bleus profonds de la mer répondent aux verts du feuillage, tandis que les fleurs roses et les petites lumières des maisons apportent de la chaleur. Le reflet de la lune guide le regard dans ce paysage imaginé, entre évasion et calme nocturne.',
      'Riviera is a vector illustration created in Figma in October 2026. I wanted to explore a different visual language: simplified shapes, flat colours and a composition that recalls a travel poster.\n\nA path winds between flowers and palm trees towards a moonlit coast. The deep blues of the sea contrast with the green foliage, while pink flowers and the small lights of the houses add warmth. The moon’s reflection guides the eye through this imagined landscape, somewhere between escape and the quiet of night.',
      '«Ривьера» — векторная иллюстрация, созданная в Figma в октябре 2026 года. Мне захотелось попробовать другой графический язык: упрощённые формы, плоские цветовые пятна и композицию, напоминающую туристический плакат.\n\nДорожка спускается между цветами и пальмами к побережью, освещённому луной. Глубокие синие оттенки моря перекликаются с зеленью листвы, а розовые цветы и маленькие огни домов добавляют тепла. Лунное отражение ведёт взгляд через этот придуманный пейзаж — между мечтой о путешествии и ночным спокойствием.'),
    ...translated('seo_description', 'Riviera, illustration vectorielle réalisée dans Figma par Ruslana Budniak : un paysage côtier nocturne aux couleurs contrastées.', 'Riviera, a vector illustration created in Figma by Ruslana Budniak: a moonlit coastal landscape in contrasting colours.', '«Ривьера» — векторная иллюстрация Русланы Будняк в Figma: ночное побережье в контрастной палитре.')
  });
  create('project_media', { project: project.id, type: 'image', position: 1, image: $filesystem.fileFromPath(source), ...translated('alt', 'Riviera : côte nocturne, palmiers et fleurs roses, village sur les collines et reflet de la lune sur la mer.', 'Riviera: a night-time coast with palm trees, pink flowers, a hillside village and moonlight reflected on the sea.', 'Ривьера: ночное побережье с пальмами, розовыми цветами, домами на склоне и лунной дорожкой на море.') });
  save(project, { status: 'published' });
  console.log('Riviera published: original SVG, vector category and FR/EN/RU descriptions.');
});
