migrate(app => {
  const source = $os.getenv('PORTFOLIO_DESKTOP');
  const assets = $os.getenv('PORTFOLIO_IMPORT_ASSETS');
  if (!source || !assets) throw new Error('Set PORTFOLIO_DESKTOP and PORTFOLIO_IMPORT_ASSETS.');
  const translated = (name, fr, en = fr, ru = fr) => ({ [`${name}_fr`]: fr, [`${name}_en`]: en, [`${name}_ru`]: ru });
  const save = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); return record; };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const category = (slug, fr, en, ru, order) => app.findRecordsByFilter('categories', 'slug = {:slug}', '', 1, 0, { slug })[0] || create('categories', { slug, sort_order: order, ...translated('name', fr, en, ru) });
  const image = (project, position, path, fr, en, ru) => create('project_media', { project: project.id, position, type: 'image', image: $filesystem.fileFromPath(path), ...translated('alt', fr, en, ru) });
  const music = app.findFirstRecordByFilter('projects', 'slug = "eclovoix"');
  save(music, { status: 'draft', ...translated('home_tools', 'Figma · Astro') });
  const musicMedia = app.findRecordsByFilter('project_media', 'project = {:project}', 'position', 0, 0, { project: music.id });
  save(musicMedia[1], { image: $filesystem.fileFromPath(`${source}/eclo-1.png`) });
  image(music, 4, `${source}/eclo-3.png`, 'Éclovoix : page chanson et fonctions de lecture sur ordinateur et téléphone.', 'Éclovoix: song page and playback features on desktop and mobile.', 'Éclovoix: страница песни и функции воспроизведения на компьютере и телефоне.');
  save(music, { status: 'published' });
  if (app.findRecordsByFilter('projects', 'slug = "stonehenge" || slug = "carnaval-des-profondeurs"', '', 1, 0).length) throw new Error('New projects already exist; refusing to overwrite.');
  const modelling = category('3d', 'Modélisation 3D', '3D modelling', '3D-моделирование', 3);
  const stone = create('projects', {
    slug: 'stonehenge', category: modelling.id, work_type: 'personal', completed_year: 2024, status: 'draft', priority_rank: 3, home_rank: 3, accent_override: '#C77450',
    ...translated('title', 'Stone', 'Stone', 'Стоун'), ...translated('title_outline', 'henge', 'henge', 'хендж'), ...translated('title_join', 'none'),
    ...translated('project_kind', 'Scène 3D', '3D scene', '3D-сцена'), ...translated('tools', 'Blender'), ...translated('home_tools', 'Blender'),
    ...translated('context', 'Projet personnel', 'Personal project', 'Личный проект'),
    ...translated('role', 'Conception, modélisation et rendu', 'Concept, modelling and rendering', 'Концепция, моделирование и рендер'),
    ...translated('description',
      'Stonehenge est une scène 3D personnelle réalisée en 2024 dans le cadre de mon apprentissage autonome de Blender. Après avoir découvert les principaux outils du logiciel, je me suis donné pour objectif de concevoir une scène complète sans suivre de tutoriel étape par étape.\n\nJ’ai modélisé et assemblé les différents éléments, puis travaillé l’environnement, les matériaux, l’éclairage et le cadrage afin de créer une atmosphère suspendue au-dessus des nuages.',
      'Stonehenge is a personal 3D scene created in 2024 while learning Blender independently. After exploring its main tools, I set myself the goal of building a complete scene without following a step-by-step tutorial.\n\nI modelled and assembled the elements, then worked on the environment, materials, lighting and framing to create an atmosphere suspended above the clouds.',
      'Стоунхендж — личная 3D-сцена, созданная в 2024 году в процессе самостоятельного изучения Blender. Освоив основные инструменты, я поставила цель создать целую сцену без пошагового повторения урока.\n\nЯ смоделировала и собрала элементы, затем проработала окружение, материалы, освещение и композицию, чтобы создать атмосферу парящего над облаками мира.'),
    ...translated('seo_description', 'Une scène 3D stylisée créée dans Blender : Stonehenge suspendu au-dessus des nuages.', 'A stylised Blender 3D scene: Stonehenge suspended above the clouds.', 'Стилизованная 3D-сцена в Blender: Стоунхендж, парящий над облаками.')
  });
  create('project_media', { project: stone.id, type: 'video', position: 1, media_url: 'https://pub-5f509ae51a6a403cac52f0d0e0e7171d.r2.dev/stonechenge-1.mov', image: $filesystem.fileFromPath(`${assets}/stonehenge/poster.jpg`), ...translated('caption', 'Stonehenge — rendu animé', 'Stonehenge — animated render', 'Стоунхендж — анимированный рендер') });
  image(stone, 2, `${source}/stonechenge-2.png`, 'Stonehenge : volumes de la scène dans Blender.', 'Stonehenge: scene geometry in Blender.', 'Стоунхендж: геометрия сцены в Blender.');
  image(stone, 3, `${source}/stonechenge-3.png`, 'Stonehenge : structure filaire.', 'Stonehenge: wireframe structure.', 'Стоунхендж: каркас сцены.');
  image(stone, 4, `${source}/stonechenge-4.png`, 'Stonehenge : matériaux de la scène.', 'Stonehenge: scene materials.', 'Стоунхендж: материалы сцены.');
  const stages = [
    ['Concept', 'Concept', 'Концепция', 'Réinterpréter Stonehenge comme une scène 3D stylisée : un monument de pierre installé sur un îlot suspendu au-dessus des nuages.', 'Reinterpret Stonehenge as a stylised 3D scene: a stone monument on an island suspended above the clouds.', 'Переосмыслить Стоунхендж как стилизованную 3D-сцену: каменный монумент на островке, парящем над облаками.'],
    ['Objectif', 'Objective', 'Цель', 'Mettre en pratique les outils découverts dans Blender et construire une scène complète de manière autonome.', 'Practise the tools discovered in Blender and build a complete scene independently.', 'Применить изученные инструменты Blender и самостоятельно создать целую сцену.'],
    ['Processus', 'Process', 'Процесс', 'Composition des volumes, modélisation des éléments, création de l’environnement, matériaux, éclairage et cadrage.', 'Composition of volumes, modelling the elements, creating the environment, materials, lighting and framing.', 'Композиция объёмов, моделирование элементов, создание окружения, материалов, освещения и выбор ракурса.']
  ];
  stages.forEach((stage, index) => create('project_sections', { project: stone.id, position: index + 1, ...translated('title', ...stage.slice(0, 3)), ...translated('description', ...stage.slice(3)) }));
  save(stone, { status: 'published' });
  const painting = category('drawing-painting', 'Dessin & peinture', 'Drawing & painting', 'Рисунок и живопись', 4);
  const carnaval = create('projects', {
    slug: 'carnaval-des-profondeurs', category: painting.id, work_type: 'personal', completed_year: 2026, status: 'draft', priority_rank: 0, home_rank: 0, accent_override: '#168D8F',
    ...translated('title', 'Carnaval des', 'Carnival of the', 'Карнавал'), ...translated('title_outline', 'Profondeurs', 'Depths', 'глубин'), ...translated('title_join', 'new_line'),
    ...translated('project_kind', 'Peinture', 'Painting', 'Живопись'), ...translated('technique', 'Gouache sur toile', 'Gouache on canvas', 'Гуашь на холсте'), ...translated('format', '30 × 30 cm', '30 × 30 cm', '30 × 30 см'),
    ...translated('description',
      'L’hippocampe, tel un observateur silencieux du monde sous-marin, demeure immobile tandis que la vie se manifeste autour de lui — dans le souffle de l’eau, la lumière et le calme.\n\nCette peinture évoque à la fois la fragilité et la résilience, cette force qui subsiste jusque dans la profondeur et le silence. Les couleurs ne sont pas seulement vives : elles résonnent comme le souvenir de l’été, de la chaleur et d’un instant que l’on aimerait préserver.',
      'The seahorse, a silent observer of the underwater world, remains still as life unfolds around it — in the movement of the water, the light and the calm.\n\nThis painting evokes both fragility and resilience, a strength that endures in depth and silence. The colours are more than vivid: they echo memories of summer, warmth and a moment we wish to preserve.',
      'Морской конёк, словно молчаливый наблюдатель подводного мира, остаётся неподвижным, пока вокруг него проявляется жизнь — в дыхании воды, свете и покое.\n\nЭта картина говорит о хрупкости и стойкости, о силе, сохраняющейся даже в глубине и тишине. Яркие цвета звучат как воспоминание о лете, тепле и мгновении, которое хочется сохранить.'),
    ...translated('seo_description', 'Carnaval des Profondeurs : une peinture à la gouache sur toile, inspirée du monde sous-marin.', 'Carnival of the Depths: a gouache painting on canvas inspired by the underwater world.', '«Карнавал глубин» — картина гуашью на холсте, вдохновлённая подводным миром.')
  });
  image(carnaval, 1, `${assets}/carnaval/painting.png`, 'Carnaval des Profondeurs : hippocampe rose entouré de plantes sous-marines.', 'Carnival of the Depths: a pink seahorse surrounded by underwater plants.', 'Карнавал глубин: розовый морской конёк среди подводных растений.');
  image(carnaval, 2, `${assets}/carnaval/interior-1.png`, 'Carnaval des Profondeurs présenté dans un intérieur.', 'Carnival of the Depths displayed in an interior.', 'Карнавал глубин в интерьере.');
  image(carnaval, 3, `${assets}/carnaval/interior-2.png`, 'Autre mise en situation de Carnaval des Profondeurs.', 'Another interior setting for Carnival of the Depths.', 'Другой вариант картины «Карнавал глубин» в интерьере.');
  save(carnaval, { status: 'published' });
  console.log('Éclovoix media updated; Stonehenge and Carnaval des Profondeurs published.');
});
