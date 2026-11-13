import type { Language } from '../i18n';
export const tools = [
  { category: 'design', items: [['Figma', 'figma'], ['Illustrator', 'illustrator'], ['Affinity', 'affinity'], ['InDesign', 'indesign']] },
  { category: 'motion', items: [['After Effects', 'after-effects'], ['VEGAS Pro', 'vegas'], ['DaVinci Resolve', 'davinci']] },
  { category: '3d', items: [['Blender', 'blender']] },
  { category: 'web', items: [['WordPress', 'wordpress'], ['VS Code', 'vscode'], ['GitHub', 'github']] }
] as const;
export const interests = ['drawing', 'music', 'nature', 'museums'] as const;
export const aboutCopy = {
  fr: {
    headline: ['Je crée avec', 'attention, du sens', 'et le souci du détail'], role: 'Design visuel · UI/UX · Création numérique', introduction: 'Étudiante en BUT MMI à Montbéliard, je transforme une idée en expérience visuelle — de la recherche à la réalisation.', projects: 'Voir mes projets', cv: 'Télécharger mon CV', cvSoon: 'CV bientôt disponible', skillsTitle: ['Domaines de', 'compétences'], toolsTitle: ['Mes', 'outils'], software: 'Logiciels & environnements', journeyTitle: ['Parcours', '& curiosité'], education: 'Formation', degree: 'BUT Métiers du Multimédia et de l’Internet', course: 'Parcours Création numérique · Montbéliard', courseDescription: 'Une formation pluridisciplinaire entre création, communication et développement web.', inspiration: 'Ce qui nourrit mon regard', categories: { design: 'Design', motion: 'Motion & vidéo', '3d': '3D', web: 'Web' }, interests: { drawing: 'Dessin', music: 'Musique', nature: 'Nature', museums: 'Peinture' },
    skills: [
      { title: 'Comprendre', subtitle: 'Recherche, analyse & besoins utilisateurs', lines: ['Analyser un contexte et l’existant', 'Identifier les publics et leurs besoins', 'Transformer les données en parcours utiles'] },
      { title: 'Concevoir', subtitle: 'Stratégie, UX & conception', lines: ['Définir les objectifs et les fonctionnalités', 'Structurer l’arborescence et les parcours', 'Prototyper, tester et améliorer'] },
      { title: 'Exprimer', subtitle: 'Création visuelle, éditoriale & multimédia', lines: ['Définir une identité visuelle cohérente', 'Concevoir des supports web et imprimés', 'Scénariser l’image, le mouvement et le récit'] },
      { title: 'Développer', subtitle: 'Production web & mise en ligne', lines: ['Intégrer des interfaces responsives', 'Connecter contenus, données et services', 'Tester, optimiser et déployer'] },
      { title: 'Entreprendre', subtitle: 'Gestion de projet & collaboration', lines: ['Transformer un brief en étapes et livrables', 'Planifier les délais, ressources et priorités', 'Documenter, présenter et travailler en autonomie'] }
    ]
  },
  en: {
    headline: ['I create with', 'care and meaning', 'and an eye for detail'], role: 'Visual design · UI/UX · Digital creation', introduction: 'As a BUT MMI student in Montbéliard, I turn an idea into a visual experience — from research to production.', projects: 'View my projects', cv: 'Download my CV', cvSoon: 'CV coming soon', skillsTitle: ['Areas of', 'expertise'], toolsTitle: ['My', 'tools'], software: 'Software & environments', journeyTitle: ['Background', '& curiosity'], education: 'Education', degree: 'BUT in Multimedia and Internet Professions', course: 'Digital creation track · Montbéliard', courseDescription: 'A multidisciplinary programme combining creation, communication and web development.', inspiration: 'What inspires me', categories: { design: 'Design', motion: 'Motion & video', '3d': '3D', web: 'Web' }, interests: { drawing: 'Drawing', music: 'Music', nature: 'Nature', museums: 'Painting' },
    skills: [
      { title: 'Understand', subtitle: 'Research, analysis & user needs', lines: ['Analyse the context and existing solutions', 'Identify audiences and their needs', 'Turn data into useful user journeys'] },
      { title: 'Design', subtitle: 'Strategy, UX & conception', lines: ['Define objectives and functionality', 'Structure information and user journeys', 'Prototype, test and improve'] },
      { title: 'Express', subtitle: 'Visual, editorial & multimedia creation', lines: ['Define a coherent visual identity', 'Create digital and printed materials', 'Shape image, motion and storytelling'] },
      { title: 'Develop', subtitle: 'Web production & publishing', lines: ['Build responsive interfaces', 'Connect content, data and services', 'Test, optimise and deploy'] },
      { title: 'Organise', subtitle: 'Project management & collaboration', lines: ['Turn a brief into steps and deliverables', 'Plan deadlines, resources and priorities', 'Document, present and work independently'] }
    ]
  },
  ru: {
    headline: ['Я создаю', 'со смыслом', 'и вниманием к деталям'], role: 'Визуальный дизайн · UI/UX · Цифровое творчество', introduction: 'Я учусь на программе BUT MMI в Монбельяре и превращаю идею в визуальный опыт — от исследования до реализации.', projects: 'Смотреть проекты', cv: 'Скачать моё резюме', cvSoon: 'Резюме скоро появится', skillsTitle: ['Области', 'компетенций'], toolsTitle: ['Мои', 'инструменты'], software: 'Программы и среды', journeyTitle: ['Мой путь', 'и интересы'], education: 'Образование', degree: 'BUT — мультимедиа и интернет', course: 'Направление «Цифровое творчество» · Монбельяр', courseDescription: 'Междисциплинарное обучение на пересечении творчества, коммуникации и веб-разработки.', inspiration: 'Что меня вдохновляет', categories: { design: 'Дизайн', motion: 'Монтаж и видео', '3d': '3D', web: 'Веб' }, interests: { drawing: 'Рисование', music: 'Музыка', nature: 'Природа', museums: 'Живопись' },
    skills: [
      { title: 'Понимать', subtitle: 'Исследование, анализ и потребности пользователей', lines: ['Анализировать контекст и существующие решения', 'Определять аудиторию и её потребности', 'Превращать данные в полезные пользовательские сценарии'] },
      { title: 'Проектировать', subtitle: 'Стратегия, UX и концепция', lines: ['Определять цели и функциональность', 'Выстраивать структуру и пользовательские сценарии', 'Создавать прототипы, тестировать и улучшать'] },
      { title: 'Выражать', subtitle: 'Визуальное творчество, редактура и мультимедиа', lines: ['Создавать целостную визуальную айдентику', 'Разрабатывать веб-материалы и печатную продукцию', 'Продумывать изображение, движение и повествование'] },
      { title: 'Разрабатывать', subtitle: 'Создание и публикация сайтов', lines: ['Создавать адаптивные интерфейсы', 'Связывать контент, данные и сервисы', 'Тестировать, оптимизировать и публиковать'] },
      { title: 'Организовывать', subtitle: 'Управление проектами и сотрудничество', lines: ['Разбивать задачу на этапы и результаты', 'Планировать сроки, ресурсы и приоритеты', 'Документировать, презентовать и работать самостоятельно'] }
    ]
  }
} satisfies Record<Language, unknown>;
