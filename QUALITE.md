# Contrôle qualité du portfolio

## Mesure PageSpeed Insights du novembre 2026

Résultats transmis pour le site publié. Lighthouse 13.6.0, émulation Moto G Power, réseau 4G lent, chargement initial d’une page. Il s’agit d’un test de laboratoire ponctuel.

| Indicateur | Résultat |
| --- | --- |
| Performance | 93 / 100 |
| Accessibilité automatique | 100 / 100 |
| Bonnes pratiques | 96 / 100 |
| SEO automatique | 100 / 100 |
| FCP et LCP | 1,2 s chacun |
| TBT | 170 ms |
| CLS | 0,012 |
| Speed Index | 5,4 s |

Le rapport signale encore environ 14 976 Kio de ressources, une économie potentielle de 4 918 Kio sur les images, 27 Kio de CSS et 203 Kio de JavaScript inutilisés durant ce parcours. Ces estimations ne prouvent pas que tout le code concerné peut être supprimé. Les interactions et les pages suivantes peuvent en avoir besoin.

Un aperçu PocketBase a dépassé le délai pendant le test. Une requête de contrôle ultérieure a reçu HTTP 200 pour ce fichier, de 340 184 octets. La fiabilité sous charge et sur réseau lent reste à observer.

Le score d’accessibilité porte sur les audits automatiques. Le parcours clavier et les contrôles manuels restent documentés ci-dessous. Aucun résultat INP de visiteurs réels n’est disponible dans les éléments fournis.

Le rapport Sitechecker transmis séparément donne 51 en performance avec un TBT de 6 240 ms. Les deux exécutions sont conservées comme observations distinctes, sans conclure à une amélioration entre elles.

## Vérification des alertes Sitechecker

- Le HTML public reçu lors du contrôle pèse 26 465 octets. L’alerte « HTML 6,66 Mo » ne correspond pas au poids de cette réponse HTML.
- Les métadonnées Open Graph sont présentes dans le HTML reçu.
- Le domaine `www.portfolio.ruslanabudniak.fr` ne se résout pas lors du contrôle. Le doublon www annoncé par Sitechecker n’a pas été reproduit.
- `robots.txt` répond actuellement en HTTP 404. Le sitemap répond en HTTP 200. Ajouter un fichier robots indiquant le sitemap reste une amélioration possible.
- Les avertissements sur les politiques CSP, HSTS, COOP et de protection contre l’intégration en iframe concernent la configuration HTTP du serveur. Leur déploiement demande une vérification de compatibilité avec les ressources et scripts du site.

Vérifications effectuées sur le site publié et sur la version locale. Les résultats sont des contrôles ciblés.


## Accessibilité

### Navigation clavier

- **Contrôle et résultat.** La touche Tab permet de parcourir les commandes et le focus reste identifiable. Un essai sous Edge à 393 px a également confirmé que le bouton du menu mobile reçoit le focus.

### Adaptation mobile

- **Contrôle et résultat.** J’ai parcouru le site sur mon téléphone et dans le mode responsive du navigateur à plusieurs largeurs. J’ai vérifié le cadrage des images, la lisibilité des textes, les menus, les espacements et la disposition des informations.
- **Corrections réalisées.** J’ai ajusté les images pour qu’elles occupent toute la largeur des cartes. J’ai adopté des cadres verticaux pour les trois projets sur téléphone et aligné leurs informations. La navigation entre projets est organisée sur deux lignes. Le contraste signalé sur ordinateur reste à examiner. Je n’ai pas testé le site avec un lecteur d’écran.

## Sobriété et performance

### Poids du portrait

- **Contrôle et résultat.** J’ai comparé les fichiers du portrait. Le PNG de prévisualisation pesait 2,26 Mo et le WebP servi par le site pèse 42 Ko.
- **Correction réalisée.** J’ai remplacé le portrait PNG par le WebP sur l’accueil et la page « Mon parcours ».

### Chargement de Stonehenge

- **Contrôle et résultat.** Vérification de la taille du GLB local, environ 7,5 Mo hors textures d’environnement et code, et inspection du déclenchement dans `src/lab-3d/lab-page.ts`.
- **Correction ou suite.** Un aperçu fixe est affiché pendant le chargement. Le module et la scène se chargent à l’approche de la section. Le temps de transition sur réseau lent reste à mesurer.

### Poids des couvertures

- **Contrôle et résultat.** Requêtes HTTP HEAD sur 27 fichiers PocketBase référencés dans le catalogue local. Total d’environ 39,5 Mo pour cette sélection, chargée progressivement au scroll. Une réponse échantillonnée annonce un cache de 30 jours.
- **Correction ou suite.** Prochaine optimisation proposée : servir des vignettes adaptées aux cartes et conserver les originaux pour les pages de projet. Le total ne correspond pas au poids du premier écran. Le résultat PageSpeed transmis ultérieurement est consigné en tête de ce fichier.

## Référencement

### Référencement et disponibilité

- **Contrôle et résultat.** Requêtes sur le domaine public. Accueil, catalogue, mentions légales, sitemap et CV répondent en HTTP 200. Le HTML de l’accueil et du catalogue contient un titre, une URL canonique et des liens hreflang. La description de page est définie dans le layout commun.
- **Correction ou suite.** Le site expose [un index de sitemap](https://portfolio.ruslanabudniak.fr/sitemap-index.xml). La déclaration du sitemap et l’indexation effective sont à confirmer dans Google Search Console.

## Conformité juridique

### Information des visiteurs

- **Contrôle et résultat.** Lecture du composant des mentions légales et contrôle de la [page publique](https://portfolio.ruslanabudniak.fr/mentions-legales/). Elle présente l’éditrice, son contact, le nom, l’adresse et l’e-mail de l’hébergeur, la propriété intellectuelle, le stockage local et les journaux techniques.
- **Correction ou suite.** Vérifier auprès de la DSIN le numéro de téléphone officiel de l’hébergeur à publier et les informations sur la conservation des journaux.

### Droits sur les contenus

- **Contrôle et résultat.** J’ai indiqué mes droits sur mes créations et distingué ceux des tiers.
- **Correction ou suite.** Les licences, crédits et autorisations restent à vérifier pour chaque élément tiers réellement publié, notamment les polices, textures 3D et médias de projets.
