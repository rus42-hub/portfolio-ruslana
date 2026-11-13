migrate(app => {
  const collection = app.findCollectionByNameOrId('projects');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.add(new TextField({ name: `project_kind_${lang}`, max: 200 }));
  app.save(collection);
}, app => {
  const collection = app.findCollectionByNameOrId('projects');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.removeByName(`project_kind_${lang}`);
  app.save(collection);
});
