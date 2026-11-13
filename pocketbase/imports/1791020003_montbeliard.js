// One-time local content import. This directory is not included in regular schema migrations.
// Source images are supplied via PORTFOLIO_POSTERS_DIR, never embedded in the code repository.
migrate(app => {
  const source = $os.getenv('PORTFOLIO_POSTERS_DIR');
  if (!source) throw new Error('Set PORTFOLIO_POSTERS_DIR to the folder containing the three posters.');
  const create = (collection, values) => {
    const record = new Record(app.findCollectionByNameOrId(collection));
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  const existing = app.findRecordsByFilter('projects', 'slug = "montbeliard-trois-lieux"', '', 1, 0);
  if (existing.length) throw new Error('The Montbéliard project already exists; refusing to overwrite it.');
  let category = app.findRecordsByFilter('categories', 'slug = "graphic-print"', '', 1, 0)[0];
  if (!category) category = create('categories', { slug: 'graphic-print', name_fr: 'Design graphique & print', name_en: 'Graphic design & print', name_ru: 'Графический дизайн и печать', sort_order: 2 });
  const project = create('projects', {
    slug: 'montbeliard-trois-lieux', category: category.id, work_type: 'university', completed_year: 2026, status: 'draft', priority_rank: 2, home_rank: 2, accent_override: '#A95F43',
    title_fr: 'Montbéliard', title_en: 'Montbéliard', title_ru: 'Монбельяр',
    title_outline_fr: 'Trois lieux, mille histoires', title_outline_en: 'Three places, a thousand stories', title_outline_ru: 'Три места, тысяча историй',
    title_join_fr: 'new_line', title_join_en: 'new_line', title_join_ru: 'new_line',
    project_kind_fr: 'Série de trois affiches', project_kind_en: 'Three-poster series', project_kind_ru: 'Серия из трёх афиш',
    description_fr: 'Cette campagne touristique a été conçue à partir d’un brief universitaire simulant une commande de l’Office de Tourisme du Pays de Montbéliard. L’objectif était de créer trois affiches consacrées au patrimoine architectural, cohérentes comme une série tout en préservant l’identité de chaque lieu.',
    description_en: 'This tourism campaign was created from a university brief simulating a commission from the Pays de Montbéliard tourist office. The aim was to design three posters celebrating architectural heritage, keeping the series visually consistent while preserving the identity of each place.',
    description_ru: 'Эта туристическая кампания создана по университетскому заданию, имитирующему заказ туристического офиса региона Монбельяр. Цель — разработать три афиши об архитектурном наследии, объединённые общим визуальным стилем и сохраняющие индивидуальность каждого места.',
    context_fr: 'Brief universitaire à visée professionnelle', context_en: 'University brief simulating a professional commission', context_ru: 'Университетское задание, имитирующее профессиональный заказ',
    role_fr: 'Direction artistique, illustration vectorielle et mise en page', role_en: 'Art direction, vector illustration and layout', role_ru: 'Арт-дирекшн, векторная иллюстрация и вёрстка',
    tools_fr: 'Adobe Illustrator', tools_en: 'Adobe Illustrator', tools_ru: 'Adobe Illustrator',
    seo_title_fr: 'Montbéliard — série d’affiches | Ruslana Budniak', seo_title_en: 'Montbéliard — poster series | Ruslana Budniak', seo_title_ru: 'Монбельяр — серия афиш | Руслана Будняк',
    seo_description_fr: 'Trois affiches touristiques illustrées : le château, le théâtre et le temple. Un projet universitaire de design graphique de Ruslana Budniak.',
    seo_description_en: 'Three illustrated tourism posters featuring the castle, theatre and temple. A university graphic design project by Ruslana Budniak.',
    seo_description_ru: 'Три туристические афиши: замок, театр и храм. Университетский проект по графическому дизайну Русланы Будняк.'
  });
  const posters = [
    { file: 'Budniak_Ruslana_C1_Affiches_Montbeliard.png', fr: 'Le Château', en: 'The Castle', ru: 'Замок', alt_fr: 'Affiche touristique du château des ducs de Wurtemberg à Montbéliard, dans une palette terreuse.', alt_en: 'Tourism poster of the dukes of Württemberg castle in Montbéliard, illustrated in earthy colours.', alt_ru: 'Туристическая афиша замка герцогов Вюртембергских в Монбельяре, выполненная в земляной палитре.' },
    { file: 'Budniak_Ruslana_C1_Affiches_Montbeliardа.png', fr: 'Le Théâtre', en: 'The Theatre', ru: 'Театр', alt_fr: 'Affiche illustrée du théâtre gallo-romain de Mandeure au coucher du soleil.', alt_en: 'Illustrated poster of the Gallo-Roman theatre in Mandeure at sunset.', alt_ru: 'Иллюстрированная афиша галло-римского театра в Мандёре на закате.' },
    { file: 'Budniak_Ruslana_C1_Affiches_Montbeliard_temple.png', fr: 'Le Temple', en: 'The Temple', ru: 'Храм', alt_fr: 'Affiche touristique illustrant le temple Saint-Martin à Montbéliard.', alt_en: 'Tourism poster illustrating Saint-Martin temple in Montbéliard.', alt_ru: 'Туристическая афиша с изображением храма Сен-Мартен в Монбельяре.' }
  ];
  const media = posters.map((poster, index) => create('project_media', {
    project: project.id, type: 'image', position: index + 1,
    image: $filesystem.fileFromPath(`${source}/${poster.file}`),
    alt_fr: poster.alt_fr, alt_en: poster.alt_en, alt_ru: poster.alt_ru,
    caption_fr: poster.fr, caption_en: poster.en, caption_ru: poster.ru
  }));
  const stages = [
    { fr: 'Brief', en: 'Brief', ru: 'Задание', description_fr: 'Concevoir une série de trois affiches touristiques. Chaque affiche devait fonctionner seule tout en appartenant à une campagne visuellement cohérente.', description_en: 'Design a series of three tourism posters. Each poster had to work on its own while belonging to a visually consistent campaign.', description_ru: 'Разработать серию из трёх туристических афиш. Каждая должна работать самостоятельно и одновременно быть частью визуально цельной кампании.' },
    { fr: 'Approche', en: 'Approach', ru: 'Подход', description_fr: 'La série associe une illustration vectorielle simplifiée, une palette terreuse, une typographie commune et un bloc d’information partagé. Les compositions restent différentes : monumentalité du château, perspective du théâtre et symétrie du temple.', description_en: 'The series combines simplified vector illustration, an earthy palette, shared typography and a common information block. Each composition keeps its own character: the monumental castle, the theatre’s perspective and the temple’s symmetry.', description_ru: 'Серия объединяет упрощённую векторную иллюстрацию, земляную палитру, общую типографику и единый информационный блок. Композиции различаются: монументальность замка, перспектива театра и симметрия храма.' },
    { fr: 'Production', en: 'Production', ru: 'Реализация', description_fr: 'Les trois affiches ont été réalisées en illustration vectorielle et réunies dans une série cohérente consacrée au patrimoine du Pays de Montbéliard.', description_en: 'The three posters were created as vector illustrations and brought together in a consistent series celebrating the heritage of the Pays de Montbéliard.', description_ru: 'Три афиши созданы в векторной графике и объединены в цельную серию, посвящённую архитектурному наследию региона Монбельяр.' }
  ];
  stages.forEach((stage, index) => create('project_sections', { project: project.id, position: index + 1, title_fr: stage.fr, title_en: stage.en, title_ru: stage.ru, description_fr: stage.description_fr, description_en: stage.description_en, description_ru: stage.description_ru }));
  // Run publication checks, then keep the imported content as a draft for the author's review.
  project.set('status', 'published'); app.validate(project); project.set('status', 'draft'); app.save(project);
  if (media.length !== 3) throw new Error('Expected three posters.');
  console.log(`Montbeliard imported as draft: ${project.id}; three images and three translated stages.`);
});
