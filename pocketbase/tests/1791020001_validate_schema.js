// Runs only in the disposable .pocketbase-test database, never in the real migration directory.
migrate(app => {
  const create = (collection, values) => {
    const record = new Record(app.findCollectionByNameOrId(collection));
    for (const key in values) record.set(key, values[key]);
    app.save(record);
    return record;
  };
  const rejects = (action, expected) => {
    let failed = false;
    try { action(); } catch (error) { if (!String(error).includes(expected)) throw error; failed = true; }
    if (!failed) throw new Error(`Expected rejection: ${expected}`);
  };
  const category = create('categories', { slug: 'test', name_fr: 'Test', name_en: 'Test', name_ru: 'Тест' });
  const project = create('projects', { slug: 'test', category: category.id, work_type: 'personal', completed_year: 2024, title_fr: 'Test', description_fr: 'Description', status: 'draft' });
  project.set('status', 'published');
  rejects(() => app.save(project), 'title_en');
  for (const lang of ['en', 'ru']) { project.set(`title_${lang}`, 'Test'); project.set(`description_${lang}`, 'Description'); }
  rejects(() => app.save(project), 'gallery media');
  project.set('status', 'draft'); app.save(project);
  rejects(() => create('project_media', { project: project.id, type: 'video', position: 2, media_url: 'https://example.com/test.mp4' }), 'Video must be first');
  const media = create('project_media', { project: project.id, type: 'image', position: 1, media_url: 'https://example.com/test.webp' });
  project.set('status', 'published');
  rejects(() => app.save(project), 'alt_fr');
  project.set('status', 'draft'); app.save(project);
  for (const lang of ['fr', 'en', 'ru']) media.set(`alt_${lang}`, 'Test');
  app.save(media);
  const section = create('project_sections', { project: project.id, position: 1, title_fr: 'Concept', description_fr: 'Description' });
  project.set('status', 'published');
  rejects(() => app.save(project), 'title_en');
  project.set('status', 'draft'); app.save(project);
  for (const lang of ['en', 'ru']) { section.set(`title_${lang}`, 'Concept'); section.set(`description_${lang}`, 'Description'); }
  app.save(section);
  project.set('status', 'published'); app.save(project);
  rejects(() => app.save(media), 'Switch the project to draft');
  rejects(() => app.delete(media), 'Switch the project to draft');
  const videoProject = create('projects', { slug: 'video-only', category: category.id, work_type: 'personal', completed_year: 2024, status: 'draft' });
  for (const lang of ['fr', 'en', 'ru']) { videoProject.set(`title_${lang}`, 'Video'); videoProject.set(`description_${lang}`, 'Description'); }
  app.save(videoProject);
  create('project_media', { project: videoProject.id, type: 'video', position: 1, media_url: 'https://example.com/test.mp4' });
  videoProject.set('status', 'published'); app.save(videoProject);
  console.log('PASS: schema, translations, video-first, video-only, publication and published child protection.');
});
