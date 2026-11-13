migrate(app => {
  const source = $os.getenv('PORTFOLIO_ECLOVOIX_DIR');
  if (!source) throw new Error('Set PORTFOLIO_ECLOVOIX_DIR to the downloaded Figma assets folder.');
  const create = (collection, values) => {
    const record = new Record(app.findCollectionByNameOrId(collection));
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  if (app.findRecordsByFilter('projects', 'slug = "eclovoix"', '', 1, 0).length) throw new Error('Éclovoix already exists; refusing to overwrite it.');
  let category = app.findRecordsByFilter('categories', 'slug = "web"', '', 1, 0)[0];
  if (!category) category = create('categories', { slug: 'web', name_fr: 'Web & interfaces', name_en: 'Web & interfaces', name_ru: 'Веб и интерфейсы', sort_order: 1 });
  const project = create('projects', {
    slug: 'eclovoix', category: category.id, work_type: 'personal', completed_year: 2026, status: 'draft', priority_rank: 1, home_rank: 1, accent_override: '#9D467E',
    title_fr: 'Éclo', title_en: 'Éclo', title_ru: 'Éclo', title_outline_fr: 'voix', title_outline_en: 'voix', title_outline_ru: 'voix', title_join_fr: 'none', title_join_en: 'none', title_join_ru: 'none',
    project_kind_fr: 'Plateforme web musicale', project_kind_en: 'Music web platform', project_kind_ru: 'Музыкальная веб-платформа',
    description_fr: 'Éclovoix est une plateforme consacrée aux chansons originales. Elle permet aux auteurs émergents de publier leurs créations et aux visiteurs de les découvrir, de les écouter et de les jouer grâce aux paroles, aux accords, aux tablatures et aux enregistrements réunis au même endroit.\n\nPensé d’abord pour rassembler mes propres chansons, le projet s’est transformé en un espace de partage ouvert à d’autres voix.',
    description_en: 'Éclovoix is a platform dedicated to original songs. It allows emerging songwriters to publish their work and visitors to discover, listen to and play it, with lyrics, chords, tablature and recordings gathered in one place.\n\nOriginally conceived to bring together my own songs, the project grew into a shared space open to other voices.',
    description_ru: 'Éclovoix — платформа для авторских песен. Начинающие авторы могут публиковать свои произведения, а посетители — открывать их, слушать и исполнять: тексты, аккорды, табулатуры и записи собраны в одном месте.\n\nИзначально проект задумывался как собрание моих собственных песен, а затем превратился в пространство для других авторов.',
    role_fr: 'UX/UI, direction artistique et développement', role_en: 'UX/UI, art direction and development', role_ru: 'UX/UI, арт-дирекшн и разработка',
    tools_fr: 'Figma · Astro · Tailwind CSS · PocketBase', tools_en: 'Figma · Astro · Tailwind CSS · PocketBase', tools_ru: 'Figma · Astro · Tailwind CSS · PocketBase',
    seo_title_fr: 'Éclovoix — plateforme musicale | Ruslana Budniak', seo_title_en: 'Éclovoix — music platform | Ruslana Budniak', seo_title_ru: 'Éclovoix — музыкальная платформа | Руслана Будняк',
    seo_description_fr: 'Découvrez Éclovoix, une plateforme pour publier, écouter et jouer des chansons originales. Design et développement par Ruslana Budniak.',
    seo_description_en: 'Discover Éclovoix, a platform to publish, listen to and play original songs. Designed and developed by Ruslana Budniak.',
    seo_description_ru: 'Éclovoix — платформа для публикации, прослушивания и исполнения авторских песен. Дизайн и разработка Русланы Будняк.'
  });
  const images = [
    ['cover.png', ['Éclovoix — univers musical', 'Éclovoix — musical world', 'Éclovoix — музыкальный мир'], ['Présentation d’Éclovoix avec guitare, fleurs sauvages et interface sombre.', 'Éclovoix presentation with a guitar, wildflowers and a dark interface.', 'Презентация Éclovoix: гитара, полевые цветы и тёмный интерфейс.']],
    ['mockup.png', ['Maquette sur ordinateur', 'Desktop mockup', 'Макет на ноутбуке'], ['Interface Éclovoix présentée sur un ordinateur portable.', 'Éclovoix interface shown on a laptop.', 'Интерфейс Éclovoix на экране ноутбука.']],
    ['interface.png', ['Interface de la plateforme', 'Platform interface', 'Интерфейс платформы'], ['Capture de l’interface Éclovoix et de sa navigation musicale.', 'Screenshot of the Éclovoix interface and music navigation.', 'Скриншот интерфейса и музыкальной навигации Éclovoix.']]
  ];
  images.forEach(([file, captions, alts], index) => {
    const values = { project: project.id, type: 'image', position: index + 1, image: $filesystem.fileFromPath(`${source}/${file}`) };
    ['fr', 'en', 'ru'].forEach((lang, i) => { values[`caption_${lang}`] = captions[i]; values[`alt_${lang}`] = alts[i]; });
    create('project_media', values);
  });
  const stages = [
    { titles: ['Problématique', 'Problem', 'Задача'], descriptions: ['Les auteurs débutants disposent rarement d’un espace adapté pour présenter une chanson encore inconnue, avec tout ce qu’il faut pour l’écouter et la jouer.', 'Emerging songwriters rarely have a suitable space to present an unknown song with everything needed to listen to and play it.', 'Начинающим авторам часто не хватает подходящего пространства для новой песни, где есть всё необходимое, чтобы её послушать и исполнить.'] },
    { titles: ['Conception', 'Design', 'Проектирование'], descriptions: ['Le projet associe une atmosphère sombre et intime à des éléments naturels lumineux. Les fleurs sauvages et les mûres traduisent une identité à la fois délicate, libre et mélancolique.', 'The project combines a dark, intimate atmosphere with bright natural elements. Wildflowers and blackberries express an identity that is delicate, free and melancholic.', 'Проект сочетает тёмную, камерную атмосферу со светлыми природными элементами. Полевые цветы и ежевика передают нежный, свободный и меланхоличный характер.'], notes: ['Recherche → Prototype Figma → Développement → Tests & mise en ligne', 'Research → Figma prototype → Development → Testing & launch', 'Исследование → Прототип в Figma → Разработка → Проверка и публикация'] },
    { titles: ['Solution', 'Solution', 'Решение'], descriptions: ['Chaque page chanson accompagne l’utilisateur de la découverte à l’interprétation.', 'Each song page guides the user from discovery to performance.', 'Страница каждой песни сопровождает пользователя от знакомства до исполнения.'], notes: ['Paroles & accords · Tablatures · Transposition · Taille du texte · Défilement automatique · Audio ou vidéo', 'Lyrics & chords · Tablature · Transposition · Text size · Auto-scroll · Audio or video', 'Тексты и аккорды · Табулатуры · Транспонирование · Размер текста · Автопрокрутка · Аудио или видео'] },
    { titles: ['Réalisation & production', 'Development & production', 'Разработка и реализация'], descriptions: ['Figma · Astro · Tailwind CSS · PocketBase · Netlify', 'Figma · Astro · Tailwind CSS · PocketBase · Netlify', 'Figma · Astro · Tailwind CSS · PocketBase · Netlify'], button_url: 'https://www.behance.net/gallery/255436969/ECLOVOIX-un-espace', buttons: ['Voir le projet sur Behance', 'View the project on Behance', 'Посмотреть проект на Behance'] }
  ];
  stages.forEach((stage, index) => {
    const values = { project: project.id, position: index + 1 };
    ['fr', 'en', 'ru'].forEach((lang, i) => { values[`title_${lang}`] = stage.titles[i]; values[`description_${lang}`] = stage.descriptions[i]; if (stage.notes) values[`note_${lang}`] = stage.notes[i]; if (stage.buttons) values[`button_label_${lang}`] = stage.buttons[i]; });
    if (stage.button_url) values.button_url = stage.button_url;
    create('project_sections', values);
  });
  project.set('status', 'published'); app.save(project);
  const posters = app.findFirstRecordByData('projects', 'slug', 'montbeliard-trois-lieux');
  posters.set('status', 'published'); app.save(posters);
  console.log('Published locally: Éclovoix (3 media, 4 stages) and Montbéliard (3 media, 3 stages).');
});
