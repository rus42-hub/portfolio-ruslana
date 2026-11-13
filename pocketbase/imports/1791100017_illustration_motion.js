migrate(app => {
  const source = $os.getenv('PORTFOLIO_MOTION_ASSETS');
  if (!source) throw new Error('Set PORTFOLIO_MOTION_ASSETS.');
  const translated = (field, values) => Object.fromEntries(['fr', 'en', 'ru'].map((lang, i) => [field + '_' + lang, values[i]]));
  const save = (record, values) => {
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const find = (collection, slug) => app.findRecordsByFilter(collection, 'slug = {:slug}', '', 1, 0, { slug })[0];
  const file = name => $filesystem.fileFromPath(source + '/' + name);
  const motion = find('categories', 'motion') || create('categories', { slug: 'motion', sort_order: 8, ...translated('name', ['Animation', 'Animation', 'Анимация']) });
  const vector = find('categories', 'vector');
  const collage = find('categories', 'collage-mixed');
  const entries = [
    ['lune', motion, 2026, 'personal', 'moon.png', 'moon.mp4', 'Adobe After Effects',
      ['Clair de lune', 'Moonlight', 'Лунный свет'],
      ['Ma première animation personnelle dans After Effects. J’ai choisi un ciel nocturne et des mouvements discrets pour donner vie à la scène sans rompre son calme.',
       'My first personal animation in After Effects. I used a night sky and subtle motion to bring the scene to life while keeping it calm.',
       'Моя первая самостоятельная анимация в After Effects. Я выбрала ночное небо и добавила лёгкое движение, чтобы оживить сцену и сохранить её тишину.'],
      ['Lune dorée dans un ciel nocturne', 'Golden moon in a night sky', 'Золотистая луна в ночном небе']],
    ['retro', vector, 2026, 'personal', 'retro.svg', '', 'Adobe Illustrator',
      ['Rétro', 'Retro', 'Ретро'],
      ['Une illustration personnelle réalisée dans Adobe Illustrator pour affiner mon dessin vectoriel. Le format vertical m’a amenée à travailler la composition et l’équilibre des formes sur toute la hauteur.',
       'A personal Adobe Illustrator piece made to refine my vector drawing skills. Its tall format gave me room to work on composition and balance from top to bottom.',
       'Самостоятельная иллюстрация в Adobe Illustrator, в которой я оттачивала навыки векторного рисунка. Вытянутый формат помог мне поработать над композицией и балансом форм по всей высоте.'],
      ['Illustration Rétro au format vertical', 'Tall-format Retro illustration', 'Вертикальная иллюстрация «Ретро»']],
    ['planete', vector, 2025, 'personal', 'planet.png', '', 'Adobe Illustrator',
      ['Planète lointaine', 'Distant Planet', 'Далёкая планета'],
      ['Mon premier dessin dans Adobe Illustrator. J’ai construit une planète à partir de formes simples et utilisé les dégradés et les reflets pour lui donner du volume.',
       'My first illustration in Adobe Illustrator. I built a planet out of simple shapes and used gradients and highlights to give it volume.',
       'Моя первая иллюстрация в Adobe Illustrator. Я собрала планету из простых форм, а градиентами и бликами придала ей объём.'],
      ['Planète orange entourée de météores', 'Orange planet surrounded by meteors', 'Оранжевая планета в окружении метеоров']],
    ['monde-sous-marin', vector, 2025, 'personal', 'orcas.png', '', 'Adobe Illustrator',
      ['Monde sous-marin', 'Underwater World', 'Подводный мир'],
      ['Deux orques traversent un paysage sous-marin stylisé. J’ai joué sur la taille des silhouettes, les nuances de bleu et les formes ondulantes pour donner de la profondeur à la composition.',
       'Two orcas swim through a stylised underwater landscape. I used silhouettes at different scales, shades of blue and flowing shapes to give the composition depth.',
       'Две косатки плывут в стилизованном подводном мире. Разный масштаб силуэтов, оттенки синего и волнистые формы придают композиции глубину.'],
      ['Deux orques parmi les algues et les bancs de poissons', 'Two orcas among seaweed and schools of fish', 'Две косатки среди водорослей и стай рыб']],
    ['terrasse', vector, 2025, 'personal', 'terrace.png', '', 'Adobe Illustrator',
      ['Terrasse au soleil', 'Sunlit Terrace', 'Терраса под солнцем'],
      ['J’ai associé des formes vectorielles franches à un grain marqué. Les arches, l’escalier et les palmiers structurent la composition, tandis que la texture rapproche l’image d’une affiche imprimée.',
       'I paired crisp vector shapes with a pronounced grain. Arches, steps and palms structure the composition, while the texture gives it the feel of a printed poster.',
       'Я соединила чёткие векторные формы с заметной зернистостью. Арки, лестница и пальмы задают структуру, а текстура придаёт рисунку характер печатной афиши.'],
      ['Composition texturée avec des arches, un palmier et des vagues', 'Textured composition with arches, a palm and waves', 'Зернистая композиция с арками, пальмой и волнами']],
    ['ailes-de-feuilles', motion, 2025, 'personal', 'projection.png', 'projection.mp4', '',
      ['Ailes de feuilles', 'Leaf Wings', 'Крылья из листьев'],
      ['Pour un atelier collectif, j’ai conçu un personnage aux ailes de feuilles, inspiré de statuettes féminines découvertes au musée. Mon animation a été projetée avec celles du groupe sur la façade de la Donation Patt, Centre d’art d’Audincourt. Les enfants pouvaient dessiner du doigt et intervenir sur les images projetées.',
       'For a group workshop, I designed a character with leaf wings inspired by female figurines I saw at the museum. My animation was projected alongside the group’s work onto the façade of Donation Patt, the Audincourt art centre. Children could draw with their fingers and interact with the projected images.',
       'На групповом мастер-классе я придумала персонажа с крыльями из листьев, вдохновившись женскими статуэтками из музея. Мою анимацию вместе с работами других участников показали на фасаде Donation Patt, центра искусства в Одэнкуре. Дети могли рисовать пальцем и взаимодействовать с проекцией.'],
      ['Animation projetée sur la façade du centre d’art', 'Animation projected onto the art centre façade', 'Анимация на фасаде центра искусства']],
    ['brutalisme', collage, 2025, 'university', 'brutalisme.png', '', '',
      ['Brutalisme', 'Brutalism', 'Брутализм'],
      ['Pour ce collage universitaire, j’ai étudié l’histoire du brutalisme avant de dessiner un bâtiment et un fond évoquant le béton. J’ai assemblé des blocs et des lettres découpés dans la presse, puis ajouté une touche vive. Les fragments semblent flotter et être attirés vers le bâtiment.',
       'For this university collage, I researched the history of Brutalism before drawing a building and a concrete-like background. I arranged blocks and letters cut from newspapers and added a vivid accent. The fragments appear to float towards the building.',
       'Для этой университетской аппликации я изучила историю брутализма, нарисовала здание и фон с фактурой бетона. Из газет вырезала блоки и буквы и добавила яркий акцент. Фрагменты словно зависли в воздухе и притягиваются к зданию.'],
      ['Collage de blocs et de lettres autour d’un bâtiment brutaliste', 'Collage of blocks and letters around a Brutalist building', 'Коллаж из блоков и букв вокруг бруталистского здания']]
  ];
  for (const [slug, category, year, workType, image, video, tools, title, description, alt] of entries) {
    if (find('projects', slug)) throw new Error('Project already exists: ' + slug);
    const project = create('projects', {
      slug, category: category.id, completed_year: year, work_type: workType, status: 'draft',
      ...translated('title', title), ...translated('description', description),
      ...translated('tools', [tools, tools, tools])
    });
    create('project_media', {
      project: project.id, position: 1, type: video ? 'video' : 'image', image: file(image),
      ...(video ? { video: file(video) } : {}), ...translated('alt', alt)
    });
    if (slug === 'ailes-de-feuilles') create('project_media', {
      project: project.id, position: 2, type: 'image', image: file('sketch.png'),
      ...translated('alt', ['Croquis du personnage aux ailes de feuilles', 'Sketch of the character with leaf wings', 'Эскиз персонажа с крыльями из листьев'])
    });
    save(project, { status: 'published' });
  }
  const stonehenge = find('projects', 'stonehenge');
  const primary = app.findFirstRecordByFilter('project_media', 'project = {:id} && position = 1', { id: stonehenge.id });
  if (primary.getString('type') !== 'video') throw new Error('Expected a video as the first Stonehenge medium.');
  save(stonehenge, { status: 'draft' });
  save(primary, { image: file('stonehenge.jpg') });
  save(stonehenge, { status: 'published' });
});
