// Schema only: no projects, categories or accounts are inserted.
migrate((app) => {
  const editor = '@request.auth.collectionName = "editors"';
  const languages = ['fr', 'en', 'ru'];
  const text = (name, required = false, max = 5000) => ({ name, type: 'text', required, max });
  const translated = (name, max = 5000) => languages.map(lang => text(`${name}_${lang}`, false, max));
  const number = (name, min = 0, max = 99999) => ({ name, type: 'number', min, max, onlyInt: true });
  const select = (name, values) => ({ name, type: 'select', required: true, maxSelect: 1, values });
  const relation = (name, collection) => ({ name, type: 'relation', required: true, maxSelect: 1, collectionId: collection.id, cascadeDelete: true });
  const image = name => ({ name, type: 'file', maxSelect: 1, maxSize: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: ['400x0', '1200x0'] });
  const dates = [{ name: 'created', type: 'autodate', onCreate: true }, { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true }];
  const save = (name, fields, readRule, indexes = []) => {
    const collection = new Collection({ name, type: 'base', fields: [...fields, ...dates], listRule: readRule, viewRule: readRule, createRule: editor, updateRule: editor, deleteRule: editor, indexes });
    app.save(collection);
    return collection;
  };
  app.save(new Collection({ name: 'editors', type: 'auth', fields: [text('name', false, 100)], listRule: 'id = @request.auth.id', viewRule: 'id = @request.auth.id', createRule: null, updateRule: null, deleteRule: null, manageRule: null, passwordAuth: { enabled: true, identityFields: ['email'] } }));
  const categories = save('categories', [text('slug', true, 100), ...translated('name', 150), number('sort_order')], '', ['CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)']);
  const projects = save('projects', [
    { ...text('slug', true, 150), pattern: '^[a-z0-9]+(-[a-z0-9]+)*$' },
    ...translated('title', 200), ...translated('title_outline', 200),
    ...languages.map(lang => ({ name: `title_join_${lang}`, type: 'select', maxSelect: 1, values: ['none', 'space', 'new_line'] })),
    relation('category', categories), select('work_type', ['personal', 'university', 'professional']), number('completed_year', 1900, 2100),
    ...['description', 'context', 'role', 'tools', 'technique', 'format'].flatMap(name => translated(name)),
    ...translated('seo_title', 200), ...translated('seo_description', 500),
    { ...text('accent_auto', false, 7), pattern: '^#[0-9a-fA-F]{6}$' }, { ...text('accent_override', false, 7), pattern: '^#[0-9a-fA-F]{6}$' },
    number('priority_rank'), number('home_rank'), select('status', ['draft', 'published'])
  ], `status = "published" || ${editor}`, [
    'CREATE UNIQUE INDEX idx_projects_slug ON projects (slug)',
    'CREATE INDEX idx_projects_category ON projects (category)',
    'CREATE UNIQUE INDEX idx_projects_priority ON projects (priority_rank) WHERE priority_rank > 0 AND status = "published"',
    'CREATE UNIQUE INDEX idx_projects_home ON projects (home_rank) WHERE home_rank > 0 AND status = "published"'
  ]);
  const childRead = `project.status = "published" || ${editor}`;
  save('project_media', [relation('project', projects), select('type', ['image', 'video']), number('position', 1, 4), image('image'), { name: 'media_url', type: 'url' }, ...translated('alt', 500), ...translated('caption', 1000)], childRead, [
    'CREATE UNIQUE INDEX idx_media_position ON project_media (project, position)',
    'CREATE UNIQUE INDEX idx_media_video ON project_media (project) WHERE type = "video"'
  ]);
  save('project_sections', [relation('project', projects), number('position', 1), ...translated('title', 200), ...translated('description'), image('detail_image'), image('detail_image_mobile'), ...translated('detail_alt', 500), ...translated('note', 2000), ...translated('button_label', 150), { name: 'button_url', type: 'url' }], childRead, ['CREATE UNIQUE INDEX idx_sections_position ON project_sections (project, position)']);
}, (app) => {
  // Explicit rollback removes these collections and their data; do not run on a populated production database.
  for (const name of ['project_sections', 'project_media', 'projects', 'categories', 'editors']) app.delete(app.findCollectionByNameOrId(name));
});
