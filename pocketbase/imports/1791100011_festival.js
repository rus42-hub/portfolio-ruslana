migrate(app => {
  const source = $os.getenv('PORTFOLIO_FESTIVAL_IMAGE');
  if (!source) throw new Error('Set PORTFOLIO_FESTIVAL_IMAGE to festival.png.');
  if (app.findRecordsByFilter('projects', 'slug = "la-fanfa-comtoise"', '', 1, 0).length) throw new Error('Festival already exists; refusing to overwrite.');
  const translated = (name, fr, en = fr, ru = fr) => ({ [`${name}_fr`]: fr, [`${name}_en`]: en, [`${name}_ru`]: ru });
  const save = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); return record; };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const riviera = app.findFirstRecordByFilter('projects', 'slug = "riviera"');
  const status = riviera.getString('status');
  save(riviera, { status: 'draft' });
  for (const lang of ['fr', 'en', 'ru']) {
    riviera.set(`tools_${lang}`, '');
    riviera.set(`home_tools_${lang}`, '');
    for (const field of ['description', 'seo_description']) riviera.set(`${field}_${lang}`, riviera.getString(`${field}_${lang}`).replace(/ dans Figma/g, '').replace(/ in Figma/g, '').replace(/ в Figma/g, ''));
  }
  save(riviera, { status });
  const category = app.findFirstRecordByFilter('categories', 'slug = "web"');
  const project = create('projects', {
    slug: 'la-fanfa-comtoise', category: category.id, work_type: 'university', completed_year: 2025, status: 'draft', priority_rank: 0, home_rank: 0, accent_override: '#59780F',
    ...translated('title', 'La Fanfa’'), ...translated('title_outline', 'Comtoise'), ...translated('title_join', 'none'),
    ...translated('project_kind', 'Site de festival musical', 'Music festival website', 'Сайт музыкального фестиваля'),
    ...translated('context', 'Projet pédagogique MMI · Festival fictif à Montbéliard', 'MMI university project · Fictional festival in Montbéliard', 'Учебный проект MMI · Вымышленный фестиваль в Монбельяре'),
    ...translated('tools', 'HTML · CSS · JavaScript'), ...translated('home_tools', 'HTML · CSS'),
    ...translated('role', 'Conception visuelle et intégration front-end', 'Visual design and front-end implementation', 'Визуальная концепция и фронтенд-вёрстка'),
    ...translated('description',
      'La Fanfa’Comtoise est un site conçu pour un festival musical fictif à Montbéliard, dans le cadre d’un projet pédagogique MMI en 2025. L’objectif était de donner envie de découvrir l’événement tout en rendant sa programmation et ses informations essentielles faciles à repérer.\n\nLe premier écran associe un message direct — « La musique prend la ville » — à des portraits d’artistes et à une composition dynamique. La page présente l’affiche, les deux scènes et une sélection de concerts, dans un univers sombre ponctué de couleurs vives.',
      'La Fanfa’Comtoise is a website for a fictional music festival in Montbéliard, created as an MMI university project in 2025. The aim was to encourage visitors to discover the event while making its programme and essential information easy to find.\n\nThe opening screen pairs a direct message — “Music takes over the city” — with artist portraits and a dynamic composition. The page introduces the line-up, two stages and selected concerts through a dark visual identity with bright colour accents.',
      'La Fanfa’Comtoise — сайт вымышленного музыкального фестиваля в Монбельяре, созданный в рамках учебного проекта MMI в 2025 году. Задача — заинтересовать событием и сделать программу и основную информацию понятными с первого взгляда.\n\nПервый экран объединяет прямой посыл «Музыка захватывает город», портреты артистов и динамичную композицию. На странице представлены участники, две сцены и подборка концертов — в тёмном оформлении с яркими цветовыми акцентами.'),
    ...translated('seo_description', 'La Fanfa’Comtoise : site de festival fictif, projet universitaire MMI 2025 de Ruslana Budniak. Design et intégration HTML, CSS, JavaScript.', 'La Fanfa’Comtoise: a fictional festival website, an MMI university project by Ruslana Budniak, 2025. Design and HTML, CSS, JavaScript implementation.', 'La Fanfa’Comtoise — сайт вымышленного фестиваля, учебный проект MMI Русланы Будняк, 2025. Дизайн и вёрстка на HTML, CSS и JavaScript.')
  });
  create('project_media', { project: project.id, type: 'image', position: 1, image: $filesystem.fileFromPath(source), ...translated('alt', 'Page d’accueil de La Fanfa’Comtoise : grand titre blanc et vert sur fond sombre, portraits d’artistes à droite.', 'La Fanfa’Comtoise homepage: a large white and lime heading on a dark background with artist portraits on the right.', 'Главный экран La Fanfa’Comtoise: крупный бело-салатовый заголовок на тёмном фоне и портреты артистов справа.') });
  create('project_sections', {
    project: project.id, position: 1, ...translated('title', 'Intention', 'Intent', 'Задача'),
    ...translated('description', 'Créer une vitrine expressive pour un festival fictif de trois jours, gratuit et ouvert à tous. Donner une place centrale à la musique et aux artistes, sans perdre les repères pratiques : dates, ville et scènes.', 'Create an expressive showcase for a fictional three-day festival with free admission. Put music and artists at the centre while keeping dates, location and stages easy to identify.', 'Создать выразительную страницу вымышленного трёхдневного фестиваля со свободным входом. Выделить музыку и артистов, сохранив заметными даты, город и сцены.')
  });
  create('project_sections', {
    project: project.id, position: 2, ...translated('title', 'Direction visuelle', 'Visual direction', 'Визуальная концепция'),
    ...translated('description', 'Le contraste du fond presque noir et des accents lumineux renforce l’énergie de l’ensemble. Les grands titres, les cartes arrondies et les portraits superposés construisent une composition qui évoque l’affiche et le rythme d’un événement musical.', 'The contrast between the near-black background and bright accents gives the page energy. Large headings, rounded cards and overlapping portraits create a composition that recalls a poster and the rhythm of a music event.', 'Контраст почти чёрного фона и ярких акцентов задаёт энергичный тон. Крупные заголовки, скруглённые карточки и наложенные друг на друга портреты напоминают плакат и передают ритм музыкального события.'),
    palette: '#08080C\n#F4F1EA\n#C7FF38\n#FF3B8D\n#8C3CFF', ...translated('palette_title', 'Palette du site', 'Website palette', 'Палитра сайта')
  });
  create('project_sections', {
    project: project.id, position: 3, ...translated('title', 'Organisation de la page', 'Page structure', 'Структура страницы'),
    ...translated('description', 'La page passe du message d’accueil à la sélection d’artistes, puis aux caractéristiques du festival et aux horaires des concerts. Cette hiérarchie accompagne la découverte, de l’ambiance générale vers les informations concrètes.', 'The page moves from the opening message to the artist selection, festival highlights and concert times. This hierarchy guides discovery from the overall atmosphere to practical details.', 'После первого экрана идут артисты, особенности фестиваля и время концертов. Такая иерархия переводит знакомство с общей атмосферой к конкретной информации.')
  });
  create('project_sections', {
    project: project.id, position: 4, ...translated('title', 'Intégration & mise en ligne', 'Implementation & publishing', 'Вёрстка и публикация'),
    ...translated('description', 'Le site utilise HTML, CSS et JavaScript et est publié sur Netlify. La mise en page combine une navigation, des sections de présentation et des cartes de contenu pour donner forme au concept du festival.', 'The website uses HTML, CSS and JavaScript and is published on Netlify. Navigation, presentation sections and content cards bring the festival concept to life.', 'Сайт написан на HTML, CSS и JavaScript и опубликован на Netlify. Навигация, презентационные секции и карточки контента воплощают концепцию фестиваля.'),
    ...translated('button_label', 'Visiter le site ↗', 'Visit the website ↗', 'Открыть сайт ↗'), button_url: 'https://sae-105-2025-ruslana42.netlify.app/'
  });
  save(project, { status: 'published' });
  console.log('Riviera tool references removed; La Fanfa’Comtoise published with FR/EN/RU descriptions.');
});
