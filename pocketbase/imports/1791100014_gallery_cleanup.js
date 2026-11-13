migrate(app => {
  const source = $os.getenv('PORTFOLIO_RIVIERA_SVG');
  if (!source) throw new Error('Set PORTFOLIO_RIVIERA_SVG to the updated SVG.');
  const replacement = $filesystem.fileFromPath(source);
  const edits = [
    ['les-histoires-qu-elle-porte-en-elle', 4, '4zzfmtydjvy_sx35uvim5f.png'],
    ['dans-la-vase-des-eaux-profondes', 4, '43wydupm6s3_h3t5wlfchi.png'],
    ['l-immensite-de-la-mer', 3, '3zw76cbzirz_91c3rokbob.png'],
    ['la-lumiere-qui-voit', 3, '3ohd5e7qwob_7bf8e2peji.png'],
    ['riviera', 1, '9gak9f9m8r_pqbt41x7av.svg']
  ].map(([slug, position, expected]) => {
    const project = app.findFirstRecordByFilter('projects', 'slug = {:slug}', { slug });
    const media = app.findFirstRecordByFilter('project_media', 'project = {:project} && position = {:position}', { project: project.id, position });
    if (media.getString('image') !== expected) throw new Error(`Unexpected image: ${slug} / ${position}`);
    return { slug, project, media, status: project.getString('status') };
  });
  for (const { slug, project, media, status } of edits) {
    project.set('status', 'draft'); app.save(project);
    if (slug === 'riviera') { media.set('image', replacement); app.save(media); }
    else app.delete(media);
    project.set('status', status); app.save(project);
  }
});
