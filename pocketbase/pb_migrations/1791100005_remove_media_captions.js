migrate(app => {
  // Preserve spoken video descriptions as accessible alt text before removing captions.
  for (const media of app.findRecordsByFilter('project_media', 'type = "video"', '', 0, 0)) {
    const project = app.findRecordById('projects', media.getString('project'));
    const status = project.getString('status');
    project.set('status', 'draft'); app.save(project);
    for (const lang of ['fr', 'en', 'ru']) if (!media.getString(`alt_${lang}`)) media.set(`alt_${lang}`, media.getString(`caption_${lang}`));
    app.save(media);
    project.set('status', status); app.save(project);
  }
  const collection = app.findCollectionByNameOrId('project_media');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.removeByName(`caption_${lang}`);
  app.save(collection);
}, app => {
  const collection = app.findCollectionByNameOrId('project_media');
  for (const lang of ['fr', 'en', 'ru']) collection.fields.add(new TextField({ name: `caption_${lang}`, max: 1000 }));
  app.save(collection);
});
