migrate(app => {
  const project = app.findFirstRecordByFilter('projects', 'slug = {:slug}', { slug: 'montbeliard-trois-lieux' });
  project.set('description_fr', 'Cette série de trois affiches touristiques a été réalisée dans le cadre d’un projet universitaire, à partir d’un brief simulant une commande de l’Office de Tourisme du Pays de Montbéliard. L’objectif était de mettre en valeur le patrimoine architectural, avec une identité visuelle cohérente pour la série tout en préservant la singularité de chaque lieu.');
  project.set('description_en', 'This series of three tourism posters was designed for a university project, based on a brief simulating a commission from the Pays de Montbéliard tourist office. The aim was to highlight architectural heritage through a coherent visual identity while preserving the character of each place.');
  project.set('description_ru', 'Серия из трёх туристических афиш выполнена в рамках университетского проекта по заданию, имитирующему заказ туристического офиса региона Монбельяр. Цель — представить архитектурное наследие в едином визуальном стиле, сохранив индивидуальность каждого места.');
  app.save(project);
});
