migrate(app => {
  const media = app.findCollectionByNameOrId('project_media');
  const image = media.fields.getByName('image');
  if (!image.mimeTypes.includes('image/svg+xml')) image.mimeTypes.push('image/svg+xml');
  app.save(media);
}, app => {
  const media = app.findCollectionByNameOrId('project_media');
  const image = media.fields.getByName('image');
  image.mimeTypes = image.mimeTypes.filter(type => type !== 'image/svg+xml');
  app.save(media);
});
