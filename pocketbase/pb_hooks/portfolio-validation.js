const languages = ['fr', 'en', 'ru'];
const fail = message => { throw new BadRequestError(message); };
const has = (record, field) => record.getString(field).trim() !== '';
const requireTranslations = (record, field) => {
  for (const lang of languages) if (!has(record, `${field}_${lang}`)) fail(`Fill ${field}_${lang}.`);
};
const webURL = (record, field) => {
  const value = record.getString(field);
  if (value && !/^https?:\/\//i.test(value)) fail(`${field} must start with https:// or http://.`);
};
const mediaCheck = (record, publishing) => {
  if (record.getInt('position') < 1) fail('Media position must be between 1 and 4.');
  webURL(record, 'media_url');
  if (record.getString('type') === 'video') {
    const file = has(record, 'video') || record.getUnsavedFiles('video').length > 0;
    if (file === has(record, 'media_url')) fail('Choose one video source: video file OR media_url.');
    if (record.getInt('position') !== 1) fail('Video must be first: position = 1.');
  } else {
    const file = has(record, 'image') || record.getUnsavedFiles('image').length > 0;
    if (file === has(record, 'media_url')) fail('Choose one image source: image file OR media_url.');
    if (publishing) requireTranslations(record, 'alt');
  }
};
const sectionCheck = (record, publishing) => {
  if (record.getInt('position') < 1) fail('Section position must be positive.');
  webURL(record, 'button_url');
  const palette = record.getString('palette').split('\n').map(value => value.trim()).filter(Boolean);
  if (palette.length > 12 || palette.some(value => !/^#[0-9a-f]{6}$/i.test(value))) fail('Palette: enter up to 12 HEX colours, one per line (for example #CE744F).');
  if (publishing) {
    requireTranslations(record, 'title');
    requireTranslations(record, 'description');
    for (const field of ['note', 'palette_title', 'palette_notes', 'process_title', 'process', 'quotes']) if (languages.some(lang => has(record, `${field}_${lang}`))) requireTranslations(record, field);
    if (has(record, 'button_url')) requireTranslations(record, 'button_label');
    if (has(record, 'detail_image')) requireTranslations(record, 'detail_alt');
  }
};
module.exports = { validate(e) {
  const record = e.record;
  const name = record.collection().name;
  if (name === 'categories') {
    requireTranslations(record, 'name');
    return;
  }
  if (name === 'projects') {
    if (!has(record, 'status')) record.set('status', 'draft');
    if (record.getString('status') !== 'published') return;
    if (record.getInt('completed_year') < 1900) fail('Fill completed_year.');
    requireTranslations(record, 'title');
    requireTranslations(record, 'description');
    for (const field of ['project_kind', 'context', 'role', 'tools', 'home_tools', 'technique', 'format']) if (languages.some(lang => has(record, `${field}_${lang}`))) requireTranslations(record, field);
    const params = { project: record.id };
    const media = e.app.findRecordsByFilter('project_media', 'project = {:project}', 'position', 5, 0, params);
    if (media.length < 1 || media.length > 4) fail('Publish with 1 to 4 gallery media.');
    if (media[0].getInt('position') !== 1) fail('The main media must have position = 1.');
    for (const item of media) mediaCheck(item, true);
    for (const item of e.app.findRecordsByFilter('project_sections', 'project = {:project}', 'position', 0, 0, params)) sectionCheck(item, true);
    return;
  }
  const project = e.app.findRecordById('projects', record.getString('project'));
  if (project.getString('status') === 'published') fail('Switch the project to draft before editing its media or sections.');
  if (name === 'project_media') mediaCheck(record, false);
  if (name === 'project_sections') sectionCheck(record, false);
} };
