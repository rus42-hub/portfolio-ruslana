migrate(app => {
  const collection = app.findCollectionByNameOrId('projects');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.add(new TextField({ name: `home_tools_${lang}`, max: 100 }));
  app.save(collection);
}, app => {
  const collection = app.findCollectionByNameOrId('projects');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.removeByName(`home_tools_${lang}`);
  app.save(collection);
});
