migrate(app => {
  const update = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); };
  const translated = (name, values) => ({ [`${name}_fr`]: values[0], [`${name}_en`]: values[1], [`${name}_ru`]: values[2] });
  const find = slug => app.findFirstRecordByFilter('projects', 'slug = {:slug}', { slug });
  const sections = project => app.findRecordsByFilter('project_sections', 'project = {:project}', 'position', 0, 0, { project: project.id });
  const posters = find('montbeliard-trois-lieux');
  const music = find('eclovoix');
  const statuses = [posters.getString('status'), music.getString('status')];
  update(posters, { status: 'draft' }); update(music, { status: 'draft' });
  const printStages = sections(posters);
  update(printStages[0], translated('quotes', [
    'Là où les ducs veillaient sur | la ville\nQuand la pierre | racontait des histoires\nUne silhouette qui guide | la ville',
    'Where the dukes watched over | the city\nWhen stone | told stories\nA silhouette that guides | the city',
    'Там, где герцоги оберегали | город\nКогда камень | рассказывал истории\nСилуэт, указывающий путь | городу'
  ]));
  update(printStages[1], { palette: '#CE744F\n#EECBA5\n#66702E\n#7F8DA0\n#2E3B42', ...translated('process', [
    'Recherche architecturale\nConstruction vectorielle\nComposition de la série\nPréparation à l’impression',
    'Architectural research\nVector construction\nComposition of the series\nPreparation for print',
    'Изучение архитектуры\nСоздание векторной графики\nКомпозиция серии\nПодготовка к печати'
  ]) });
  update(printStages[2], translated('note', ['3 affiches · CMJN · Fond perdu 3 mm · Traits de coupe · PDF print', '3 posters · CMYK · 3 mm bleed · Crop marks · Print PDF', '3 афиши · CMYK · Вылеты 3 мм · Метки обрезки · PDF для печати']));
  const conception = sections(music)[1];
  update(conception, {
    palette: '#8F3D72\n#111214\n#2D2F33\n#FFFFFF',
    ...translated('palette_title', ['Système visuel', 'Visual system', 'Визуальная система']),
    ...translated('palette_notes', ['Interface sombre\nAccent personnalisable\nUnivers naturel', 'Dark interface\nCustomisable accent\nNatural world', 'Тёмный интерфейс\nНастраиваемый акцент\nПриродные мотивы']),
    ...translated('process_title', ['Processus', 'Process', 'Процесс']),
    ...translated('process', ['Recherche\nPrototype Figma\nDéveloppement\nTests & mise en ligne', 'Research\nFigma prototype\nDevelopment\nTesting & launch', 'Исследование\nПрототип Figma\nРазработка\nТестирование и запуск']),
    note_fr: '', note_en: '', note_ru: ''
  });
  update(posters, { status: statuses[0] }); update(music, { status: statuses[1] });
  console.log('Project palettes, quotes and processes updated in three languages.');
});
