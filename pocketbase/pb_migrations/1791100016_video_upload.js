migrate(app => {
  const media = app.findCollectionByNameOrId('project_media');
  media.fields.add(new FileField({ name: 'video', maxSelect: 1, maxSize: 10485760, mimeTypes: ['video/mp4'] }));
  app.save(media);
});
