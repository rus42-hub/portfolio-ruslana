migrate(app => {
  const source = $os.getenv('PORTFOLIO_CIELIXIR_IMAGE');
  if (!source) throw new Error('Set PORTFOLIO_CIELIXIR_IMAGE to Cielixir-1.png.');
  if (app.findRecordsByFilter('projects', 'slug = "cielixir"', '', 1, 0).length) throw new Error('Cielixir already exists; refusing to overwrite.');
  const translated = (name, fr, en = fr, ru = fr) => ({ [`${name}_fr`]: fr, [`${name}_en`]: en, [`${name}_ru`]: ru });
  const save = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); return record; };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const category = app.findFirstRecordByFilter('categories', 'slug = "web"');
  const project = create('projects', {
    slug: 'cielixir', category: category.id, work_type: 'university', completed_year: 2026, status: 'draft', priority_rank: 4, home_rank: 0, accent_override: '#287F7A',
    ...translated('title', 'Ciel'), ...translated('title_outline', 'ixir'), ...translated('title_join', 'none'),
    ...translated('project_kind', 'Plateforme de découverte de boissons', 'Drink discovery platform', 'Платформа для выбора напитков'),
    ...translated('context', 'Projet pédagogique et expérimental en formation MMI', 'Educational and experimental project during MMI studies', 'Учебный и экспериментальный проект в рамках обучения MMI'),
    ...translated('role', 'UX/UI design, développement full-stack et communication', 'UX/UI design, full-stack development and communication', 'UX/UI-дизайн, full-stack-разработка и коммуникация'),
    ...translated('tools', 'Astro · Tailwind CSS · PocketBase'), ...translated('home_tools', 'Astro · Tailwind CSS'),
    ...translated('description',
      'Cielixir est une plateforme de découverte de boissons qui prend en compte la météo, la saison et les envies de l’utilisateur. Le projet cherche à rendre le choix plus simple et plus agréable, en reliant des recommandations, des recettes et des articles pratiques dans une expérience visuelle cohérente.\n\nConçu dans le cadre de la formation Métiers du Multimédia et de l’Internet, ce projet collectif associe UX/UI et communication. Mon rôle couvre le design de l’expérience et de l’interface, le développement full-stack et la communication.',
      'Cielixir is a drink discovery platform that takes the weather, season and the user’s preferences into account. It aims to make choosing a drink easier and more enjoyable by bringing recommendations, recipes and practical articles together in a coherent visual experience.\n\nCreated as a team project during Métiers du Multimédia et de l’Internet studies, it combines UX/UI and communication. My role covers experience and interface design, full-stack development and communication.',
      'Cielixir — платформа для поиска напитков с учётом погоды, сезона и предпочтений пользователя. Проект помогает сделать выбор проще и приятнее, объединяя рекомендации, рецепты и практические статьи в целостном визуальном интерфейсе.\n\nЭто командный учебный проект направления Métiers du Multimédia et de l’Internet, который соединяет UX/UI и коммуникацию. Моя роль включает проектирование пользовательского опыта и интерфейса, full-stack-разработку и коммуникацию.'),
    ...translated('seo_description', 'Cielixir : projet universitaire de plateforme de boissons, UX/UI, développement full-stack et communication par Ruslana Budniak.', 'Cielixir: a university drink discovery platform project, with UX/UI, full-stack development and communication by Ruslana Budniak.', 'Cielixir — учебный проект платформы напитков: UX/UI-дизайн, full-stack-разработка и коммуникация Русланы Будняк.')
  });
  create('project_media', { project: project.id, type: 'image', position: 1, image: $filesystem.fileFromPath(source), ...translated('alt', 'Visuel Cielixir : verre turquoise et soleil jaune sur un fond vert sombre parcouru de lignes dorées.', 'Cielixir visual: a turquoise glass and yellow sun against a dark green background with golden flowing lines.', 'Визуал Cielixir: бирюзовый бокал и жёлтое солнце на тёмно-зелёном фоне с золотистыми линиями.') });
  create('project_sections', {
    project: project.id, position: 1, ...translated('title', 'Idée & contexte', 'Idea & context', 'Идея и контекст'),
    ...translated('description', 'Le point de départ est une question du quotidien : comment choisir une boisson qui correspond au moment ? La météo, la température et les envies deviennent des repères pour proposer une découverte plus contextualisée.', 'The starting point is an everyday question: how can we choose a drink that suits the moment? Weather, temperature and preferences provide a context for discovering drinks.', 'Отправная точка — повседневный вопрос: как выбрать напиток, подходящий моменту? Погода, температура и личные предпочтения становятся ориентирами для поиска.'),
  });
  create('project_sections', {
    project: project.id, position: 2, ...translated('title', 'Expérience & système visuel', 'Experience & visual system', 'Пользовательский опыт и визуальная система'),
    ...translated('description', 'L’interface propose plusieurs portes d’entrée : la météo, les catégories de boissons et un questionnaire de personnalisation. Les tons turquoise et verts, les surfaces claires et les dégradés composent une identité fraîche, pensée pour accompagner la navigation.', 'The interface offers several starting points: weather, drink categories and a personalisation questionnaire. Turquoise and green tones, light surfaces and gradients create a fresh identity that supports navigation.', 'В интерфейсе предусмотрено несколько путей: погода, категории напитков и опрос для персонального выбора. Бирюзовые и зелёные оттенки, светлые поверхности и градиенты формируют свежую визуальную систему.'),
    palette: '#3CEEDF\n#6EED62\n#C3FFAD\n#DEFDF8', ...translated('palette_title', 'Palette du site', 'Website palette', 'Палитра сайта'), ...translated('palette_notes', 'Turquoise\nVert\nVert doux\nMenthe', 'Turquoise\nGreen\nSoft green\nMint', 'Бирюзовый\nЗелёный\nМягкий зелёный\nМятный')
  });
  create('project_sections', {
    project: project.id, position: 3, ...translated('title', 'Contenus & découverte', 'Content & discovery', 'Контент и поиск'),
    ...translated('description', 'Les recommandations sont accompagnées de fiches recettes et d’articles pratiques. Le catalogue permet d’explorer différentes familles de boissons, tandis que la personnalisation rapproche la sélection des envies de l’utilisateur.', 'Recommendations are accompanied by recipe pages and practical articles. The catalogue lets visitors explore different drink categories, while personalisation brings the selection closer to their preferences.', 'Рекомендации дополняются страницами рецептов и практическими статьями. Каталог позволяет изучать разные категории напитков, а персональный подбор связывает выбор с предпочтениями пользователя.'),
    ...translated('button_label', 'Voir la présentation sur Behance ↗', 'View the presentation on Behance ↗', 'Посмотреть презентацию на Behance ↗'), button_url: 'https://www.behance.net/gallery/250370081/Cielixir-UXUI-stratgie-de-communication'
  });
  create('project_sections', {
    project: project.id, position: 4, ...translated('title', 'Développement & réalisation', 'Development & delivery', 'Разработка и реализация'),
    ...translated('description', 'Le site est développé avec Astro et Tailwind CSS ; PocketBase fournit les contenus. La réalisation relie les interfaces, les données et les parcours de découverte dans un site responsive.', 'The website uses Astro and Tailwind CSS, with content supplied by PocketBase. Implementation connects interfaces, data and discovery journeys in a responsive website.', 'Сайт создан на Astro и Tailwind CSS, а контент поступает из PocketBase. Реализация объединяет интерфейсы, данные и сценарии поиска в адаптивный сайт.'),
    ...translated('button_label', 'Visiter Cielixir ↗', 'Visit Cielixir ↗', 'Открыть Cielixir ↗'), button_url: 'https://cielixir.ruslanabudniak.fr/'
  });
  save(project, { status: 'published' });
  console.log('Cielixir published with one original visual, four sections and FR/EN/RU translations.');
});
