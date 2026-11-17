# Contrôle qualité du portfolio

Vérifications effectuées sur le site publié et sur la version locale. Les résultats sont des contrôles ciblés. Les points restant à vérifier sont indiqués dans chaque rubrique.


## Accessibilité

### Navigation clavier

- **Contrôle et résultat.** Essai manuel rapporté par l’autrice sur le site local. La touche Tab permet de parcourir les commandes et le focus reste identifiable. Un essai sous Edge à 393 px a également confirmé que le bouton du menu mobile reçoit le focus.
- **Correction ou suite.** Le CSS comporte un style `:focus-visible`. Reste à documenter séparément le parcours complet dans les filtres et la galerie, ainsi que le retour du focus après fermeture.

### Adaptation mobile

- **Contrôle et résultat.** Contrôles visuels réalisés par l’autrice sur téléphone et en mode responsive, notamment sur la page d’accueil et le catalogue.
- **Correction ou suite.** Les images du catalogue occupent toute la largeur de leur carte. Sur téléphone, les trois projets mis en avant utilisent un cadre vertical et la navigation entre projets est répartie sur deux lignes. Le contraste et le comportement avec un lecteur d’écran restent à contrôler.

## Sobriété et performance

### Coût du premier écran

- **Contrôle et résultat.** Comparaison des fichiers du portrait. Le PNG de prévisualisation pesait 2,26 Mo et le WebP servi par le site pèse 42 Ko.
- **Correction ou suite.** Le WebP remplace le PNG sur l’accueil et la page « Mon parcours ».

### Coût de Stonehenge

- **Contrôle et résultat.** Vérification de la taille du GLB local, environ 7,5 Mo hors textures d’environnement et code, et inspection du déclenchement dans `src/lab-3d/lab-page.ts`.
- **Correction ou suite.** Un aperçu fixe est affiché pendant le chargement. Le module et la scène se chargent à l’approche de la section. Le temps de transition sur réseau lent reste à mesurer.

### Poids des couvertures

- **Contrôle et résultat.** Requêtes HTTP HEAD sur 27 fichiers PocketBase référencés dans le catalogue local. Total d’environ 39,5 Mo pour cette sélection, chargée progressivement au scroll. Une réponse échantillonnée annonce un cache de 30 jours.
- **Correction ou suite.** Prochaine optimisation proposée : servir des vignettes adaptées aux cartes et conserver les originaux pour les pages de projet. Le total ne correspond pas au poids du premier écran. Aucun score Lighthouse n’a été mesuré pour cette fiche.

## Référencement

### Référencement et disponibilité

- **Contrôle et résultat.** Requêtes sur le domaine public. Accueil, catalogue, mentions légales, sitemap et CV répondent en HTTP 200. Le HTML de l’accueil et du catalogue contient un titre, une URL canonique et des liens hreflang. La description de page est définie dans le layout commun.
- **Correction ou suite.** Le site expose [un index de sitemap](https://portfolio.ruslanabudniak.fr/sitemap-index.xml). La déclaration du sitemap et l’indexation effective sont à confirmer dans Google Search Console.

## Conformité juridique

### Information des visiteurs

- **Contrôle et résultat.** Lecture du composant des mentions légales et contrôle de la [page publique](https://portfolio.ruslanabudniak.fr/mentions-legales/). Elle présente l’éditrice, son contact, le nom, l’adresse et l’e-mail de l’hébergeur, la propriété intellectuelle, le stockage local et les journaux techniques.
- **Correction ou suite.** Vérifier auprès de la DSIN le numéro de téléphone officiel de l’hébergeur à publier et les informations sur la conservation des journaux.

### Droits sur les contenus

- **Contrôle et résultat.** La page identifie les créations de l’autrice et distingue les droits des tiers.
- **Correction ou suite.** Les licences, crédits et autorisations restent à vérifier pour chaque élément tiers réellement publié, notamment les polices, textures 3D et médias de projets.
