migrate(app => {
  const source = $os.getenv('PORTFOLIO_STONEHENGE_ORIGINALS');
  if (!source) throw new Error('Set PORTFOLIO_STONEHENGE_ORIGINALS to the downloaded Figma asset folder.');
  const project = app.findFirstRecordByFilter('projects', 'slug = "stonehenge"');
  const status = project.getString('status');
  project.set('status', 'draft'); app.save(project);
  const media = app.findRecordsByFilter('project_media', 'project = {:project} && type = "image"', 'position', 0, 0, { project: project.id });
  for (const item of media) {
    item.set('image', $filesystem.fileFromPath(`${source}/original-${item.getInt('position')}.png`));
    app.save(item);
  }
  project.set('status', status); app.save(project);
  console.log('Three Stonehenge images replaced with original Figma assets.');
});
