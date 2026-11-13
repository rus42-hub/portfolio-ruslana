migrate(app => {
  const source = $os.getenv('PORTFOLIO_ART_ASSETS');
  if (!source) throw new Error('Set PORTFOLIO_ART_ASSETS to the downloaded Figma originals.');
  const translated = (name, values) => Object.fromEntries(['fr', 'en', 'ru'].map((lang, index) => [`${name}_${lang}`, values[index]]));
  const save = (record, values) => { for (const key in values) record.set(key, values[key]); app.save(record); return record; };
  const create = (collection, values) => save(new Record(app.findCollectionByNameOrId(collection)), values);
  const painting = app.findFirstRecordByFilter('categories', 'slug = "drawing-painting"');
  const collage = app.findRecordsByFilter('categories', 'slug = "collage-mixed"', '', 1, 0)[0] || create('categories', { slug: 'collage-mixed', sort_order: 7, ...translated('name', ['Collage & techniques mixtes', 'Collage & mixed media', 'Коллаж и смешанные техники']) });
  const works = [
    {
      slug: 'depuis-ma-fenetre', folder: '377-335', count: 3, year: 2026, accent: '#326D93',
      title: ['Depuis', 'From', 'Из моего'], outline: ['ma fenêtre', 'my window', 'окна'],
      technique: ['Gouache sur toile rigide', 'Gouache on canvas board', 'Гуашь на жёстком холсте'],
      description: [
        'J’ai peint en France ce paysage d’automne que je voyais depuis la fenêtre de ma maison à Dnipriany, où je suis née et où j’ai grandi. Les couleurs du rivage et l’étendue de l’eau sont restées en moi, même à distance.\n\nLa guerre et les inondations ont transformé ces lieux ; je ne sais pas ce qu’il reste aujourd’hui de cette rive. Cette peinture garde le paysage tel que je le porte en mémoire, avec sa douceur et sa lumière. On ne peut pas retrouver le passé, mais on peut lui donner une place : pour moi, cette vue reste une façon de rentrer chez moi.',
        'I painted this autumn landscape in France, remembering the view from the window of my home in Dnipriany, where I was born and grew up. The colours of the shore and the expanse of water have stayed with me across the distance.\n\nWar and flooding have changed these places; I do not know what remains of that shore today. This painting holds the landscape as I remember it, with its warmth and light. We cannot bring the past back, but we can make room for it: for me, this view is still a way of coming home.',
        'Этот осенний пейзаж я написала во Франции, вспоминая вид из окна моего дома в Днепрянах, где я родилась и выросла. Цвета берега и простор воды остались со мной, несмотря на расстояние.\n\nВойна и затопление изменили эти места; я не знаю, что осталось от того берега сегодня. На картине он сохраняется таким, каким живёт в моей памяти, — тёплым и светлым. Прошлое нельзя вернуть, но ему можно оставить место: для меня этот вид всё ещё становится маленьким возвращением домой.'
      ],
      alt: ['Paysage d’automne à Dnipriany : rive arborée et eau bleue, peints de mémoire.', 'Autumn landscape in Dnipriany: a tree-lined shore and blue water painted from memory.', 'Осенний пейзаж Днепрян: берег с деревьями и синяя вода, написанные по памяти.']
    },
    {
      slug: 'le-cycle', folder: '377-336', count: 3, year: 2023, accent: '#365C99', collage: true,
      title: ['Le', 'The', 'Круговорот'], outline: ['Cycle', 'Cycle', ''],
      technique: ['Collage de papier et de fragments de magazines', 'Paper and magazine collage', 'Аппликация из бумаги и журнальных фрагментов'],
      context: ['Atelier au 19, Centre régional d’art contemporain, Montbéliard', 'Workshop at Le 19, Centre régional d’art contemporain, Montbéliard', 'Творческая мастерская Le 19, Centre régional d’art contemporain, Монбельяр'],
      description: [
        'Ce collage a été créé lors d’un atelier au 19, Centre régional d’art contemporain à Montbéliard. Avec du papier, des fragments de magazines et de la colle, j’ai composé une mer traversée par des dauphins qui tournent en cercle.\n\nLeurs silhouettes un peu naïves donnent au mouvement une sincérité que j’aime. Pour moi, ce cercle évoque le temps qui continue, le fait de grandir et de revenir à soi : tout change, mais quelque chose reste vivant.',
        'I made this collage during a workshop at Le 19, Centre régional d’art contemporain in Montbéliard. Using paper, magazine fragments and glue, I created a sea crossed by dolphins moving in a circle.\n\nTheir slightly naive silhouettes give the movement a sincerity I like. To me, the circle suggests time moving on, growing up and finding our way back to ourselves: everything changes, yet something stays alive.',
        'Эта аппликация появилась на творческой мастерской в Le 19, Centre régional d’art contemporain в Монбельяре. Из бумаги, журнальных фрагментов и клея я собрала море и дельфинов, движущихся по кругу.\n\nВ немного наивных силуэтах есть искренность, которая мне нравится. Для меня этот круг — течение времени, взросление и возвращение к себе: всё меняется, но что-то остаётся живым.'
      ],
      alt: ['Collage bleu et blanc : dauphins en cercle au-dessus de lignes de vagues.', 'Blue and white collage: dolphins in a circle above rows of waves.', 'Сине-белая аппликация: дельфины по кругу над рядами волн.']
    },
    {
      slug: 'l-appel-des-profondeurs', folder: '377-337', count: 3, year: 2025, accent: '#58782C',
      title: ['L’Appel', 'The Call', 'Зов'], outline: ['des profondeurs', 'of the Depths', 'глубины'],
      technique: ['Gouache', 'Gouache', 'Гуашь'], format: ['A4', 'A4', 'А4'],
      description: [
        'Cette peinture est née de l’envie de saisir la beauté d’un coquillage, une forme où la nature réunit fragilité et force. Ses reliefs me font penser à une empreinte du temps, à quelque chose de minuscule qui garde un monde entier.\n\nJ’ai choisi un vert vif pour faire ressortir ses nuances chaudes. Le coquillage semble silencieux, pourtant il rappelle ce bruit de mer que l’on croit entendre en l’approchant de l’oreille. C’est ce lien entre le silence, le souvenir et l’imagination que je voulais peindre.',
        'This painting began with a wish to capture the beauty of a seashell, a form in which nature brings fragility and strength together. Its ridges remind me of an imprint of time: something small that seems to hold an entire world.\n\nI chose a vivid green background to bring out its warm colours. The shell appears silent, yet it recalls the sound of the sea we imagine when holding it to our ear. I wanted to paint that connection between silence, memory and imagination.',
        'Эта работа родилась из желания передать красоту морской раковины — формы, в которой природа соединяет хрупкость и силу. Её рельеф напоминает мне отпечаток времени: маленький предмет, который будто хранит целый мир.\n\nЯ выбрала яркий зелёный фон, чтобы подчеркнуть её тёплые оттенки. Раковина молчит, но напоминает о шуме моря, который мы будто слышим, поднося её к уху. Мне хотелось написать эту связь между тишиной, памятью и воображением.'
      ],
      alt: ['Coquillage aux tons chauds peint sur un fond vert vif.', 'Warm-coloured seashell painted against a vivid green background.', 'Морская раковина в тёплых оттенках на ярком зелёном фоне.']
    },
    {
      slug: 'les-histoires-qu-elle-porte-en-elle', folder: '377-338', count: 4, year: 2020, accent: '#655B4E',
      title: ['Les histoires', 'The Stories', 'Истории'], outline: ['qu’elle porte en elle', 'She Carries Within', 'внутри неё'],
      technique: ['Stylo noir sur papier blanc', 'Black pen on white paper', 'Чёрная ручка на белой бумаге'],
      context: ['Recherche personnelle autour du portrait, de l’ornement et du rythme graphique', 'Personal exploration of portraiture, ornament and graphic rhythm', 'Личный эксперимент с портретом, орнаментом и графическим ритмом'],
      description: [
        'Le regard de cette femme est calme, tandis que les motifs autour d’elle composent un monde plus dense. Lignes, ornements et rythmes s’entrelacent comme des pensées, des souvenirs et des émotions que le visage ne révèle pas entièrement.\n\nChaque fragment participe à son histoire. Le contraste du noir et du blanc me permet de chercher une profondeur sans couleur, où le silence peut lui aussi devenir une voix.',
        'This woman’s gaze is calm, while the patterns around her form a denser world. Lines, ornaments and rhythms intertwine like thoughts, memories and emotions that a face never fully reveals.\n\nEvery fragment belongs to her story. Working in black and white lets me explore depth without colour, a space where silence can become a voice of its own.',
        'Взгляд героини спокоен, а узоры вокруг него создают более сложный мир. Линии, орнаменты и ритмы переплетаются, как мысли, воспоминания и чувства, которые невозможно полностью прочитать по лицу.\n\nКаждый фрагмент становится частью её истории. Чёрно-белый контраст позволяет искать глубину без цвета — пространство, где даже тишина может обрести голос.'
      ],
      alt: ['Portrait féminin au stylo noir, entouré de motifs et d’ornements.', 'Black-pen portrait of a woman surrounded by patterns and ornaments.', 'Женский портрет чёрной ручкой в окружении узоров и орнаментов.']
    },
    {
      slug: 'le-ressac', folder: '377-339', count: 3, year: 2026, accent: '#28698A',
      title: ['Le', 'The', 'Прибой'], outline: ['Ressac', 'Surf', ''],
      technique: ['Acrylique sur toile', 'Acrylic on canvas', 'Акрил на холсте'], format: ['50 × 50 cm', '50 × 50 cm', '50 × 50 см'],
      description: [
        'Dans cette peinture, les vagues relient le ciel et les rochers dans un même rythme. Je voulais retrouver cette présence particulière de la mer, capable d’être puissante et apaisante à la fois.\n\nLes nuances de bleu et les touches d’écume donnent du mouvement à la surface ronde. Pour moi, ce paysage évoque aussi un état intérieur : une agitation que l’on ressent profondément, même lorsque tout semble calme autour de soi.',
        'In this painting, the waves connect the sky and the rocks in a shared rhythm. I wanted to capture that particular presence of the sea, which can feel powerful and soothing at the same time.\n\nShades of blue and touches of foam bring movement to the round surface. To me, the landscape also suggests an inner state: a restlessness we feel deeply, even when everything around us seems calm.',
        'На этой картине волны соединяют небо и камни в одном ритме. Мне хотелось передать особое присутствие моря — его способность быть сильным и одновременно успокаивающим.\n\nОттенки синего и мазки пены наполняют круглую поверхность движением. Для меня это ещё и внутреннее состояние: волнение, которое чувствуешь глубоко внутри, даже когда вокруг всё кажется спокойным.'
      ],
      alt: ['Peinture ronde : vagues bleues et écume contre un rivage rocheux.', 'Round painting of blue waves and foam along a rocky shore.', 'Круглая картина: синие волны и пена у каменистого берега.']
    },
    {
      slug: 'la-lumiere-qui-voit', folder: '377-340', count: 3, year: 2026, accent: '#AD4F2B',
      title: ['La lumière', 'The Light', 'Свет,'], outline: ['qui voit', 'That Sees', 'который видит'],
      technique: ['Aquarelle sur papier', 'Watercolour on paper', 'Акварель на бумаге'], format: ['30 × 30 cm', '30 × 30 cm', '30 × 30 см'],
      description: [
        'Cette œuvre parle d’un regard qu’il est impossible de dissimuler. Ici, l’œil ne se contente pas d’observer : il ressent et traverse l’expérience. Il porte en lui la mémoire, la douleur, la curiosité et le reflet du monde.\n\nJ’ai voulu montrer comment un seul regard peut contenir toute une histoire : la lumière que nous recevons et celle que nous transmettons.',
        'This work is about a gaze that cannot be hidden. Here, the eye does more than observe: it feels and lives through experience. It carries memory, pain, curiosity and a reflection of the world.\n\nI wanted to show how a single gaze can contain an entire story: the light we receive and the light we pass on.',
        'Эта работа — о взгляде, который невозможно спрятать. Глаз здесь не просто наблюдает: он чувствует и проживает опыт, хранит память, боль, любопытство и отражение мира.\n\nЯ хотела показать, как в одном взгляде может поместиться целая история: свет, который мы принимаем, и тот, который передаём дальше.'
      ],
      alt: ['Gros plan d’un œil peint à l’aquarelle dans des tons roses et orangés.', 'Close-up watercolour painting of an eye in pink and orange tones.', 'Крупный план глаза, написанного акварелью в розовых и оранжевых оттенках.']
    },
    {
      slug: 'l-immensite-de-la-mer', folder: '377-341', count: 3, year: 2020, accent: '#3279AA',
      title: ['L’Immensité', 'The Immensity', 'Бескрайность'], outline: ['de la mer', 'of the Sea', 'моря'],
      technique: ['Aquarelle sur papier', 'Watercolour on paper', 'Акварель на бумаге'], format: ['30 × 30 cm', '30 × 30 cm', '30 × 30 см'],
      description: [
        'C’est la première fois que j’ai peint la mer. Je n’avais pas besoin d’un sujet compliqué : j’avais simplement très envie de retrouver ce bleu, cette distance et la place que la mer occupe en moi.\n\nJ’aime encore les couleurs de cette peinture et l’espace qui s’ouvre entre la plage et l’horizon. Elle garde quelque chose de mon premier élan : le plaisir de peindre un lieu que j’aime, sans chercher à tout expliquer. Cette immensité me laisse respirer.',
        'This was the first time I painted the sea. I did not need a complicated subject: I simply wanted to find that blue, that sense of distance and the place the sea holds within me.\n\nI still love the colours in this painting and the space opening between the beach and the horizon. It keeps something of that first impulse: the pleasure of painting a place I love without needing to explain everything. Its vastness gives me room to breathe.',
        'Это моя первая картина о море. Мне не нужен был сложный сюжет: я просто очень хотела написать этот синий цвет, эту даль и то место, которое море занимает во мне.\n\nЯ до сих пор люблю её цвета и простор между пляжем и горизонтом. В ней осталось что-то от первого порыва — удовольствие писать то, что любишь, не пытаясь всё объяснить. Эта бескрайность даёт мне возможность выдохнуть.'
      ],
      alt: ['Aquarelle d’un bord de mer : plage dorée, vagues bleues et grand ciel clair.', 'Watercolour seascape with a golden beach, blue waves and a broad light sky.', 'Акварельный морской пейзаж: золотистый пляж, синие волны и простор светлого неба.']
    },
    {
      slug: 'dans-la-vase-des-eaux-profondes', folder: '377-342', count: 4, year: 2026, accent: '#756C38',
      title: ['Dans la vase', 'In the Silt', 'В иле'], outline: ['des eaux profondes', 'of Deep Waters', 'глубоких вод'],
      technique: ['Gouache sur toile', 'Gouache on canvas', 'Гуашь на холсте'],
      description: [
        'J’ai imaginé une sirène qui appartiendrait vraiment au monde sous-marin. Elle tient un poisson près de sa bouche ; son regard et son corps évoquent un être vivant, guidé par l’instinct, plutôt qu’une héroïne de conte.\n\nSi les sirènes existaient, seraient-elles forcément douces et rassurantes ? J’avais envie d’explorer une autre possibilité, plus sauvage. Les cheveux lumineux contrastent avec l’eau sombre et la peau tachetée : la beauté reste présente, mais elle ne fait pas disparaître le danger.',
        'I imagined a mermaid who would truly belong to the underwater world. She holds a fish near her mouth; her gaze and body suggest a living creature driven by instinct rather than a fairy-tale heroine.\n\nIf mermaids existed, would they necessarily be gentle and reassuring? I wanted to explore a wilder possibility. Her luminous hair contrasts with the dark water and spotted skin: beauty is still there, but it does not make the danger disappear.',
        'Я представила русалку, которая действительно могла бы принадлежать подводному миру. Она держит рыбу у рта; её взгляд и тело напоминают живое существо, ведомое инстинктом, а не героиню доброй сказки.\n\nЕсли бы русалки существовали, обязательно ли они были бы нежными и безопасными? Мне захотелось представить другой, более дикий образ. Светлые волосы контрастируют с тёмной водой и пятнистой кожей: красота здесь остаётся, но не отменяет опасности.'
      ],
      alt: ['Sirène aux cheveux dorés, à la queue tachetée, tenant un poisson dans une eau sombre.', 'Golden-haired mermaid with a spotted tail holding a fish in dark water.', 'Златоволосая русалка с пятнистым хвостом держит рыбу в тёмной воде.']
    }
  ];
  // Refuse duplicates before creating any project; the migration itself runs in a transaction.
  for (const work of works) if (app.findRecordsByFilter('projects', 'slug = {:slug}', '', 1, 0, { slug: work.slug }).length) throw new Error(`Project already exists: ${work.slug}`);
  for (const work of works) {
    const values = { slug: work.slug, category: work.collage ? collage.id : painting.id, work_type: 'personal', completed_year: work.year, status: 'draft', home_rank: 0, priority_rank: 0, accent_override: work.accent, ...translated('title', work.title), ...translated('title_outline', work.outline), ...translated('title_join', ['new_line', 'new_line', 'new_line']), ...translated('description', work.description), ...translated('technique', work.technique), ...translated('project_kind', work.collage ? ['Collage', 'Collage', 'Аппликация'] : ['Œuvre graphique', 'Visual artwork', 'Художественная работа']) };
    if (work.format) Object.assign(values, translated('format', work.format));
    if (work.context) Object.assign(values, translated('context', work.context));
    const project = create('projects', values);
    for (let position = 1; position <= work.count; position++) {
      const alt = position === 1 ? work.alt : [`${work.title[0]} ${work.outline[0]} : mise en situation ${position - 1}.`, `${work.title[1]} ${work.outline[1]}: display setting ${position - 1}.`, `${work.title[2]} ${work.outline[2]}: вариант оформления ${position - 1}.`];
      create('project_media', { project: project.id, type: 'image', position, image: $filesystem.fileFromPath(`${source}/${work.folder}/${position}.png`), ...translated('alt', alt) });
    }
    save(project, { status: 'published' });
  }
  console.log('Eight artworks published with original Figma galleries and FR/EN/RU translations.');
});
