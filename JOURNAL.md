# Journal de bord — Portfolio de Ruslana Budniak

Journal reconstitué à partir des échanges de travail, des fichiers d’import PocketBase et des commits. Les périodes sans trace datée sont données à titre indicatif. Les dates des fichiers attestent des étapes d’intégration, tandis que les commits documentent la mise en ligne et les derniers ajustements.

## Avant le 3 octobre 2026 · Positionnement et maquette (période approximative)

- J’ai construit un portfolio qui présente mes deux axes, le graphisme et le design UX/UI.
- J’ai préparé un prototype Figma avec des compositions distinctes pour ordinateur et téléphone.
- J’ai choisi une palette chocolat et papier, des bords déchirés et des compositions qui associent typographie et images.
- J’ai pris le portfolio de Tore S. Bentsen comme référence pour la réaction des titres et des images au défilement.
- J’ai prévu un accès direct aux projets, une page de parcours et une section Contact sur l’accueil.

## Semaine du 28 septembre au 4 octobre · Intégration et premiers contenus

- J’ai commencé l’intégration avec Astro et Tailwind CSS. Les composants réutilisent le fond, la navigation et le pied de page.
- J’ai organisé les textes et les parcours en français, en anglais et en russe.
- J’ai choisi PocketBase pour gérer les projets, catégories, médias et étapes de présentation.
- La difficulté était de construire une page commune pour un tableau, une série d’affiches, un site et une scène 3D. J’ai retenu des champs et des sections facultatifs.
- Les imports du 3 octobre documentent la mise en place des fiches Montbéliard et Éclovoix.
- Ceux du 4 octobre documentent l’ajout de Stonehenge, de la collection de dessins et de Cielixir, ainsi que les premières corrections de visuels.
- J’ai retenu des filtres par catégorie, type et année pour que le catalogue reste navigable à mesure que les contenus s’ajoutent.

## Semaine du 19 au 25 octobre · Enrichissement du catalogue

- Les imports du 22 octobre documentent l’ajout de Riviera, du festival et du projet sur l’effet Matilda.
- J’ai ajouté des liens vers les réalisations en ligne lorsque le projet s’y prêtait.
- J’ai repris plusieurs couvertures de dessins pour rendre la présentation plus cohérente.
- Les formats variaient fortement d’une œuvre à l’autre. J’ai distingué le cadrage des couvertures et celui des galeries, où le visiteur peut consulter l’image entière.

## Semaine du 9 au 15 novembre · Refonte du catalogue et mise en ligne

- Le 12 novembre, j’ai intégré les scènes interactives La Forêt, Château enchanté et La Potion, avec des images fixes dans le catalogue.
- J’ai ajouté des illustrations et deux animations. Pour « Ailes de feuilles », j’ai retenu une image de la projection comme couverture et ajouté le croquis à la galerie.
- J’ai ajouté TiK•TaK et le projet de visualisation climatique autour de Montbéliard, avec des étapes détaillées et des liens vers les sites.
- J’ai comparé une version en mosaïque au catalogue initial. J’ai retenu la mosaïque compacte, avec des angles droits et des titres toujours visibles sous les images.
- J’ai ajusté les espacements et les cadrages sur téléphone. Les trois projets mis en avant sur l’accueil ont reçu des cadres verticaux au format mobile.
- Les premiers commits ont été enregistrés le 13 novembre, lors de l’initialisation du dépôt et de la publication.
- Le 15 novembre, j’ai ajouté le CV et précisé les mentions légales.

## À partir du 16 novembre · Stabilisation et préparation de la soutenance

- Le 16 novembre, j’ai adopté le nouveau portrait sur l’accueil et sur la page « Mon parcours ». Le fichier WebP pèse 42 Ko.
- J’ai reporté le chargement de Stonehenge à l’approche de la section. Un aperçu fixe reste visible pendant le chargement de la scène.
- Le déploiement automatique depuis GitHub vers le VPS a été configuré le 16 novembre. PocketBase fonctionne séparément du déploiement du site.
- Le 17 novembre, j’ai corrigé le filet visible sous le bord déchiré du papier et vérifié la réussite du déploiement dans GitHub Actions.
- J’ai commencé le bilan de qualité en réunissant les observations sur la navigation clavier, les poids de fichiers, le référencement et les mentions légales dans `QUALITE.md`.
- Pour la soutenance, j’ai retenu les affiches de Montbéliard comme exemple détaillé. Elles me permettent d’expliquer un choix de composition, un système de série et la reconstitution du théâtre de Mandeure.

## Choix de ma présence professionnelle

1. J’utilise LinkedIn pour rendre visibles mon parcours en BUT MMI et mon positionnement de graphiste et designer UX/UI.
2. LinkedIn me permet de donner un point de contact aux recruteurs, aux agences et aux équipes qui consultent mon CV.
3. J’utilise Behance pour présenter en images les projets qui demandent une lecture plus détaillée, notamment les interfaces et les séries graphiques.
4. Je garde la même signature sur le portfolio, le CV et les profils pour que l’on puisse retrouver facilement mes travaux.
5. Le portfolio rassemble ces liens dans la rubrique Contact et donne une vue d’ensemble de mes projets de design, de développement et de création visuelle.
