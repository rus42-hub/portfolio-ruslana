migrate(app => {
  const source = $os.getenv('PORTFOLIO_MOON_VIDEO');
  if (!source) throw new Error('Set PORTFOLIO_MOON_VIDEO.');
  const project = slug => app.findFirstRecordByFilter('projects', 'slug = {:slug}', { slug });
  const languages = ['fr', 'en', 'ru'];
  const descriptions = {
    brutalisme: [
      'Ce collage est l’aboutissement d’une recherche universitaire sur l’histoire du brutalisme. J’en ai retenu une idée : laisser la matière parler telle qu’elle est, en particulier le béton brut. Dans ma composition, j’ai joué avec ce que cette matière évoque, la masse et la pesanteur, en imaginant des fragments en apesanteur comme attirés par l’édifice.',
      'This collage grew out of university research into the history of Brutalism. I took one idea from that research: let materials speak for themselves, especially raw concrete. In my composition, I played with the weight we associate with concrete by imagining fragments suspended in mid-air, as if drawn towards the building.',
      'Эта аппликация стала итогом университетского исследования истории брутализма. Мне была близка идея показать материал таким, какой он есть, — оставить бетону его фактуру и тяжесть. В композиции я обыграла это ощущение веса: фрагменты словно зависли в воздухе и притягиваются к зданию.'
    ],
    terrasse: [
      'Avant mes études universitaires, j’ai réalisé cette illustration pour me familiariser avec Adobe Illustrator. J’ai associé des formes vectorielles nettes à un grain marqué pour explorer comment la texture peut réchauffer des aplats et donner à une image numérique le caractère d’une affiche imprimée.',
      'Before university, I made this illustration to get comfortable with Adobe Illustrator. I paired crisp vector shapes with a pronounced grain to explore how texture can soften flat colours and give a digital image the feel of a printed poster.',
      'Эту иллюстрацию я сделала до университета, когда осваивала Adobe Illustrator. Я соединила чёткие векторные формы с заметной зернистостью, чтобы понять, как фактура меняет восприятие цветовых пятен и придаёт цифровому рисунку характер печатной афиши.'
    ],
    'monde-sous-marin': [
      'Dans cette étude sur Illustrator, je me suis demandé comment donner de la profondeur à une image faite d’aplats. J’ai travaillé la taille, le contraste et la superposition des formes pour distinguer les plans et guider le regard dans la composition.',
      'In this Illustrator study, I explored how to create a sense of depth with flat shapes. I used scale, contrast and overlap to separate the visual planes and guide the eye through the composition.',
      'В этой работе в Illustrator я искала способ передать глубину простыми плоскими формами. Я меняла их масштаб, контраст и наложение, чтобы разделить планы и направить взгляд внутри композиции.'
    ],
    'ailes-de-feuilles': [
      'Invitée à un atelier de création à la Donation Patt, Centre d’art d’Audincourt, j’ai d’abord découvert les œuvres du musée lors d’une visite guidée. Des sculptures féminines aux jambes massives m’ont donné l’idée d’un personnage que j’ai associé au parc qui entoure le musée : une créature des arbres, dont les ailes sont faites de feuilles.\n\nMon animation a été projetée sur la façade avec les créations des autres participants. Les enfants pouvaient donner vie aux dessins à l’aide d’une tablette. Cet atelier m’a appris à partir d’un lieu et de ses œuvres pour inventer un personnage et imaginer comment le public pourrait interagir avec lui.',
      'I was invited to a creative workshop at Donation Patt, the Audincourt art centre. We began with a guided tour, where sculptures of women with exaggerated, solid legs caught my eye. I brought that inspiration together with the park around the museum and imagined a creature that lived in the trees, with leaves for wings.\n\nMy animation was projected onto the façade alongside the other participants’ work. Children could bring our drawings to life using a tablet. The workshop taught me to use a place and its collection as starting points for a character and to consider how an audience might interact with it.',
      'Меня пригласили на творческий мастер-класс в Donation Patt, центр искусства в Одэнкуре. Всё началось с экскурсии по музею. Моё внимание привлекли женские скульптуры с необычно массивными ногами. Я соединила этот образ с парком вокруг музея и придумала существо, которое живёт среди деревьев и носит листья вместо крыльев.\n\nМою анимацию вместе с работами других участников спроецировали на фасад. Дети могли оживлять наши рисунки с помощью планшета. Этот опыт научил меня придумывать персонажа, отталкиваясь от конкретного места, и заранее думать о том, как зритель сможет с ним взаимодействовать.'
    ]
  };
  const materials = ['Gouache, carton et découpes de magazines', 'Gouache, cardboard and magazine cutouts', 'Гуашь, картон и журнальные вырезки'];
  for (const [slug, description] of Object.entries(descriptions)) {
    const record = project(slug);
    languages.forEach((lang, i) => {
      record.set('description_' + lang, description[i]);
      if (slug === 'brutalisme') record.set('tools_' + lang, materials[i]);
    });
    app.save(record);
  }
  const moon = project('lune');
  const media = app.findFirstRecordByFilter('project_media', 'project = {:id} && position = 1 && type = "video"', { id: moon.id });
  moon.set('status', 'draft');
  app.save(moon);
  media.set('video', $filesystem.fileFromPath(source));
  app.save(media);
  moon.set('status', 'published');
  app.save(moon);
});
