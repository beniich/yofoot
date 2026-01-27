# Guide de Développement

## Commandes Utiles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée la version de production
- `npm run preview` : Prévisualise la version de production

## Ajouter une nouvelle page

1. Créer le composant dans `src/pages/MaNouvellePage.jsx`
2. Ajouter la route dans `src/App.jsx`
3. Ajouter le lien dans `src/components/BottomNavigation.jsx` (si nécessaire)

## Design System

Utilisez les classes utilitaires personnalisées :
- `text-gold` / `bg-gold` pour la couleur principale
- `bg-charcoal` pour le fond sombre
- `glass-card` pour l'effet de verre
- `gold-gradient` pour les dégradés dorés

## Données

Les données sont mockées dans `src/data/mockData.js`.
Pour connecter un backend, remplacez les imports de mockData par des appels API (fetch/axios).
