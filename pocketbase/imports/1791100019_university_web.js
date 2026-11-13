migrate(app => {
  const source = $os.getenv('PORTFOLIO_UNIVERSITY_WEB');
  if (!source) throw new Error('Set PORTFOLIO_UNIVERSITY_WEB.');
  const tr = (field, values) => Object.fromEntries(['fr', 'en', 'ru'].map((lang, i) => [field + '_' + lang, values[i]]));
  const add = (collection, values) => {
    const record = new Record(app.findCollectionByNameOrId(collection));
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  const category = app.findFirstRecordByFilter('categories', 'slug = "web"');
  const entries = [
    {
      slug: 'tiktak', title: ['TiK•TaK', 'TiK•TaK', 'TiK•TaK'], rank: 6, accent: '#216D76', url: 'https://tiktak.ruslanabudniak.fr/',
      tools: 'Figma · Astro · Tailwind CSS · daisyUI · SQLite',
      alt: ['Montres et bracelets TiK•TaK sur fond coloré', 'TiK•TaK watches and straps on a colourful background', 'Часы и ремешки TiK•TaK на цветном фоне'],
      description: ['TiK•TaK est un site de personnalisation de montres réalisé en quatre jours dans le cadre d’une SAE. Le configurateur est au cœur du projet : il permet de composer une montre en choisissant ses composants, ses matériaux et ses couleurs. J’ai travaillé le parcours utilisateur, du prototype Figma à l’intégration du site.',
        'TiK•TaK is a watch customisation website built in four days for a university assignment. Its centrepiece is a configurator for choosing components, materials and colours. I worked on the user journey from the Figma prototype through to the website implementation.',
        'TiK•TaK — сайт для персонализации часов, созданный за четыре дня в рамках университетского задания SAE. В центре проекта — конфигуратор, в котором можно собрать модель из разных компонентов, материалов и цветов. Я проработала пользовательский путь от прототипа в Figma до реализации сайта.'],
      stages: [
        [['Parcours utilisateur', 'User journey', 'Пользовательский путь'], ['J’ai structuré le parcours autour de la personnalisation. Le prototype interactif Figma reliait le configurateur, la fiche produit et la création du compte pour rendre les transitions explicites.', 'I built the journey around customisation. The interactive Figma prototype linked the configurator, product page and account creation to make the transitions clear.', 'Я выстроила сценарий вокруг персонализации. Интерактивный прототип в Figma связал конфигуратор, карточку товара и создание аккаунта, чтобы проверить переходы между ними.']],
        [['Le configurateur', 'The configurator', 'Конфигуратор'], ['L’enjeu était de rendre les choix faciles à comparer : forme du boîtier, bracelet, matériaux et couleurs. L’utilisateur peut ainsi comprendre comment chaque choix contribue au modèle qu’il compose.', 'The challenge was to make choices easy to compare, from case shape and strap to materials and colours, so users can understand how each choice contributes to their design.', 'Главная задача — сделать выбор наглядным: форма корпуса, ремешок, материалы и цвета. Пользователь может сравнивать варианты и понимать, как каждый выбор влияет на итоговую модель.']],
        [['Développement et mise en ligne', 'Development and deployment', 'Разработка и публикация'], ['L’interface a été intégrée avec Astro, Tailwind CSS et daisyUI, avec SQLite pour les données. Le code a été soumis par pull request et le site déployé sur un VPS avec un domaine géré chez Infomaniak.', 'The interface was built with Astro, Tailwind CSS and daisyUI, with SQLite for the data. The code was submitted through a pull request and the website deployed to a VPS with a domain managed through Infomaniak.', 'Интерфейс реализован на Astro, Tailwind CSS и daisyUI, данные хранились в SQLite. Код отправили через pull request, а сайт развернули на VPS с доменом под управлением Infomaniak.']]
      ]
    },
    {
      slug: 'climat-montbeliard', title: ['Les années chaudes autour de Montbéliard', 'Warm Years Around Montbéliard', 'Тёплые годы в окрестностях Монбельяра'], rank: 5, accent: '#A44E23', url: 'https://sae303-groupe5.maman-sambe.fr/',
      tools: 'Astro · Tailwind CSS · Observable Plot',
      alt: ['Affiche sur les données climatiques autour de Montbéliard de 1959 à 2022', 'Poster on climate data around Montbéliard from 1959 to 2022', 'Постер о климате в окрестностях Монбельяра с 1959 по 2022 год'],
      description: ['Ce projet universitaire en binôme répondait à un défi de l’Open Data University : transformer des données climatiques ouvertes en un récit que le public puisse explorer. Notre question était locale : les années chaudes sont-elles devenues la norme autour de Montbéliard ?',
        'This university project, made in pairs, tackled an Open Data University challenge: turn open climate data into a story readers can explore. We asked a local question: have warm years become the norm around Montbéliard?',
        'В этом парном университетском проекте мы решали задачу Open Data University: превратить открытые климатические данные в понятный читателю рассказ. Мы поставили локальный вопрос: стали ли тёплые годы нормой в окрестностях Монбельяра?'],
      stages: [
        [['Choix des données', 'Selecting the data', 'Отбор данных'], ['J’ai recherché les sources et sélectionné les données pertinentes pour étudier le territoire sur la période 1959–2022. Il fallait garder des séries comparables dans le temps et retenir les indicateurs utiles à notre question.', 'I researched sources and selected relevant data for the area over 1959–2022. The goal was to keep series comparable over time and retain the indicators that helped answer our question.', 'Я искала источники и отбирала данные, подходящие для анализа региона за 1959–2022 годы. Нужно было сохранить сопоставимость рядов во времени и выбрать показатели, которые помогают ответить на наш вопрос.']],
        [['Visualisation et récit', 'Visualisation and narrative', 'Графики и повествование'], ['J’ai créé environ la moitié des graphiques et réalisé la majeure partie du site. J’ai organisé les visualisations de manière à guider la lecture des données, du contexte local aux tendances de long terme.', 'I created about half of the charts and built most of the website. I arranged the visualisations to guide readers from the local context to long-term trends.', 'Я подготовила примерно половину графиков и собрала основную часть сайта. Визуализации выстроила так, чтобы читатель мог перейти от местного контекста к долгосрочным тенденциям.']],
        [['Travail en binôme', 'Working in pairs', 'Работа в паре'], ['Mon binôme a réalisé et intégré plusieurs autres graphiques, puis assuré la publication du site.', 'My teammate built and integrated several of the other charts and handled the website deployment.', 'Мой напарник разработал и интегрировал несколько других графиков и опубликовал сайт.']]
      ]
    }
  ];
  for (const entry of entries) {
    const project = add('projects', { slug: entry.slug, category: category.id, work_type: 'university', completed_year: 2026, status: 'draft', priority_rank: entry.rank, accent_override: entry.accent, ...tr('title', entry.title), ...tr('description', entry.description), ...tr('tools', [entry.tools, entry.tools, entry.tools]) });
    const image = entry.slug === 'tiktak' ? 'tiktak.png' : 'climat.png';
    add('project_media', { project: project.id, type: 'image', position: 1, image: $filesystem.fileFromPath(source + '/' + image), ...tr('alt', entry.alt) });
    entry.stages.forEach(([title, description], i) => add('project_sections', {
      project: project.id, position: i + 1, ...tr('title', title), ...tr('description', description),
      ...(i === entry.stages.length - 1 ? { button_url: entry.url, ...tr('button_label', ['Voir le site ↗', 'Visit the website ↗', 'Открыть сайт ↗']) } : {})
    }));
    project.set('status', 'published');
    app.save(project);
  }
  const cielixir = app.findFirstRecordByFilter('projects', 'slug = "cielixir"');
  cielixir.set('priority_rank', 7);
  app.save(cielixir);
});
