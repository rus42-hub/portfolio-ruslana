migrate(app => {
  const source = $os.getenv('PORTFOLIO_UPDATED_ART');
  if (!source) throw new Error('Set PORTFOLIO_UPDATED_ART to the folder containing the five updated paintings.');
  const updates = [
    ['carnaval-des-profondeurs', 'Конек 5.png'],
    ['l-appel-des-profondeurs', 'Ракушка 5.png'],
    ['les-histoires-qu-elle-porte-en-elle', 'Она 6.png'],
    ['l-immensite-de-la-mer', 'Джарылгач 7.png'],
    ['dans-la-vase-des-eaux-profondes', 'Русалка 7.png']
  ].map(([slug, filename]) => {
    const project = app.findFirstRecordByFilter('projects', 'slug = {:slug}', { slug });
    const media = app.findFirstRecordByFilter('project_media', 'project = {:project} && position = 1', { project: project.id });
    if (media.getString('type') !== 'image') throw new Error(`Expected an image cover: ${slug}`);
    return { project, media, file: $filesystem.fileFromPath(`${source}/${filename}`), status: project.getString('status') };
  });
  for (const { project, media, file, status } of updates) {
    project.set('status', 'draft'); app.save(project);
    media.set('image', file); app.save(media);
    project.set('status', status); app.save(project);
  }
  console.log('Five painting covers replaced; project records and remaining gallery images preserved.');
});
