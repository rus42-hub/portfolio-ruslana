# Portfolio — Ruslana Budniak

Site statique Astro et Tailwind CSS, en français, anglais et russe. PocketBase fournit les projets à la construction et sert leurs médias.

## Développement local

Depuis le dépôt, lancer `bun install` puis `bun run dev`. Le script démarre ou réutilise la base existante dans le dossier voisin `Base-de-donnees-Portfolio`.

- Site : http://127.0.0.1:4330/
- Administration PocketBase : http://127.0.0.1:8097/_/

Garder la base active pour `bun run build`. Lancer `bun run check` pour vérifier les types et exécuter chaque fichier de `tests/` avec Bun pour vérifier les filtres et les animations.

## Publication

Configurer `PUBLIC_POCKETBASE_URL` et `SITE_URL` avec les adresses HTTPS définitives dans l’environnement de construction. Publier `dist/` après `bun run build`. Reconstruire le site après une modification des projets.

Consulter [la structure PocketBase](docs/pocketbase-structure.md) et [les notes de déploiement](docs/deployment-handoff.md). Les migrations de schéma sont dans `pocketbase/pb_migrations`, les validations dans `pocketbase/pb_hooks` et les imports ponctuels dans `pocketbase/imports`. Les données et les fichiers de stockage de la base restent hors du dépôt.
