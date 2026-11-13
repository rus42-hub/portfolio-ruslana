migrate(app => {
  const source = $os.getenv('PORTFOLIO_3D_IMAGES');
  if (!source) throw new Error('Set PORTFOLIO_3D_IMAGES.');
  const languages = ['fr', 'en', 'ru'];
  const translated = (field, values) => Object.fromEntries(languages.map((lang, i) => [`${field}_${lang}`, values[i]]));
  const save = (record, values) => {
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const category = app.findFirstRecordByFilter('categories', 'slug = "3d"');
  const entries = [
    {
      slug: 'foret', year: 2024, accent: '#426644',
      title: ['La Forêt', 'The Forest', 'Лес'],
      kind: ['Scène 3D', '3D scene', '3D-сцена'],
      role: ['Conception de la scène et modélisation', 'Scene design and modelling', 'Концепция сцены и моделирование'],
      description: [
        'La Forêt est ma première scène 3D dans Blender. J’ai imaginé un îlot suspendu autour d’un étang, avec des arbres aux silhouettes différentes, des nénuphars et de petits détails à découvrir en tournant autour du décor.\n\nCe projet personnel m’a permis d’apprendre à modeler des formes simples et à les assembler en un paysage cohérent. J’ai consacré l’essentiel du travail à la modélisation et à la composition de ce petit monde.',
        'The Forest is my first 3D scene in Blender. I imagined a floating island around a pond, with trees of different silhouettes, water lilies and small details to discover as you turn around the scene.\n\nThis personal project taught me how to model simple forms and bring them together into a coherent landscape. I focused on modelling and composing this small world.',
        '«Лес» — моя первая 3D-сцена в Blender. Я придумала парящий остров с прудом, деревьями разных силуэтов, кувшинками и мелкими деталями, которые можно заметить, поворачивая сцену.\n\nВ этой самостоятельной работе я училась моделировать простые формы и собирать их в цельный пейзаж. Больше всего внимания уделила моделированию и композиции.'
      ],
      alt: ['Îlot boisé suspendu avec un étang au centre', 'Floating wooded island with a central pond', 'Парящий лесной остров с прудом в центре']
    },
    {
      slug: 'chateau', year: 2025, accent: '#80527E',
      title: ['Château enchanté', 'Enchanted Castle', 'Зачарованный замок'],
      kind: ['Scène 3D', '3D scene', '3D-сцена'],
      role: ['Composition, matériaux et éclairage', 'Composition, materials and lighting', 'Композиция, материалы и освещение'],
      description: [
        'Un château de conte se dresse sur un îlot suspendu. Les fenêtres chaudes, les tours violettes et les arbres en silhouette composent une scène entre le merveilleux et la nuit.\n\nDans ce projet personnel sur Blender, j’ai surtout travaillé les matériaux et la lumière. Le contraste entre l’éclat des fenêtres et l’environnement sombre donne du relief à l’architecture et installe l’atmosphère du décor.',
        'A fairy-tale castle stands on a floating island. Warm windows, purple towers and silhouetted trees give the scene a magical, nocturnal atmosphere.\n\nIn this personal Blender project I focused on materials and lighting. The contrast between the glowing windows and the dark surroundings gives depth to the architecture and sets the mood.',
        'Сказочный замок стоит на парящем острове. Тёплый свет окон, фиолетовые башни и силуэты деревьев создают ощущение волшебной ночи.\n\nВ этой самостоятельной работе в Blender я сосредоточилась на материалах и свете. Контраст светящихся окон и тёмного окружения подчёркивает объём архитектуры и задаёт настроение сцены.'
      ],
      alt: ['Château aux fenêtres éclairées sur un îlot flottant', 'Castle with glowing windows on a floating island', 'Замок со светящимися окнами на парящем острове']
    },
    {
      slug: 'potion', year: 2025, accent: '#81516E',
      title: ['La Potion', 'The Potion', 'Зелье'],
      kind: ['Objet 3D', '3D object', '3D-объект'],
      role: ['Modélisation, textures et mise en lumière', 'Modelling, textures and lighting', 'Моделирование, текстуры и освещение'],
      description: [
        'La Potion est une étude personnelle de matériaux dans Blender. Au centre de la composition, un flacon de verre contient un liquide lumineux. Les reflets colorés font ressortir sa silhouette sur un socle sombre.\n\nJ’ai exploré le contraste entre la transparence du verre, la matière du bouchon et la surface du socle. L’éclairage révèle ces différences quand on observe l’objet sous plusieurs angles.',
        'The Potion is a personal study of materials in Blender. A glass bottle holds a luminous liquid at the centre of the composition. Coloured reflections bring out its silhouette against a dark base.\n\nI explored the contrast between the transparency of the glass, the texture of the cork and the surface of the base. The lighting reveals those differences as you view the object from different angles.',
        '«Зелье» — самостоятельная работа с материалами в Blender. В центре композиции — стеклянный флакон со светящейся жидкостью. Цветные отражения выделяют его силуэт на тёмной подставке.\n\nМне было интересно сопоставить прозрачность стекла, фактуру пробки и поверхность подставки. Свет помогает увидеть различия материалов с разных ракурсов.'
      ],
      alt: ['Fiole de potion lumineuse sur un socle sombre', 'Glowing potion bottle on a dark base', 'Флакон светящегося зелья на тёмной подставке']
    }
  ];
  for (const entry of entries) {
    if (app.findRecordsByFilter('projects', 'slug = {:slug}', '', 1, 0, { slug: entry.slug }).length) throw new Error(`Project already exists: ${entry.slug}`);
    const project = create('projects', {
      slug: entry.slug, category: category.id, completed_year: entry.year, work_type: 'personal', status: 'draft', home_rank: 0, priority_rank: 0, accent_override: entry.accent,
      ...translated('title', entry.title), ...translated('description', entry.description),
      ...translated('project_kind', entry.kind), ...translated('role', entry.role),
      ...translated('tools', ['Blender', 'Blender', 'Blender']),
      ...translated('context', ['Projet personnel d’apprentissage', 'Personal learning project', 'Самостоятельная учебная работа'])
    });
    create('project_media', { project: project.id, position: 1, type: 'image', image: $filesystem.fileFromPath(`${source}/${entry.slug}.png`), ...translated('alt', entry.alt) });
    save(project, { status: 'published' });
  }
});
