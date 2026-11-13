// Shared checks live in a module because PocketBase hook callbacks have isolated scopes.
onRecordValidate(e => {
  require(`${__hooks}/portfolio-validation.js`).validate(e);
  e.next();
}, 'projects', 'categories', 'project_media', 'project_sections');

onRecordDelete(e => {
  const project = e.app.findRecordById('projects', e.record.getString('project'));
  if (project.getString('status') === 'published') throw new BadRequestError('Switch the project to draft before removing its media or sections.');
  e.next();
}, 'project_media', 'project_sections');
