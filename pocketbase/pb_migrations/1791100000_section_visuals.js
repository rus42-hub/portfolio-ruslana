migrate(app => {
  const collection = app.findCollectionByNameOrId('project_sections');
  collection.fields.add(new TextField({ name: 'palette', max: 500 }));
  for (const name of ['palette_title', 'palette_notes', 'process_title', 'process', 'quotes']) for (const lang of ['fr', 'en', 'ru']) collection.fields.add(new TextField({ name: `${name}_${lang}`, max: 5000 }));
  app.save(collection);
}, app => {
  const collection = app.findCollectionByNameOrId('project_sections');
  collection.fields.removeByName('palette');
  for (const name of ['palette_title', 'palette_notes', 'process_title', 'process', 'quotes']) for (const lang of ['fr', 'en', 'ru']) collection.fields.removeByName(`${name}_${lang}`);
  app.save(collection);
});
