# Structure du Projet FootballHub

```
football-hub/
├── src/
│   ├── components/
│   │   ├── BottomNavigation.jsx  # Navigation mobile
│   │   ├── Header.jsx            # En-tête avec logo
│   │   ├── MatchCard.jsx         # Carte de match (Live/Upcoming)
│   │   ├── PredictionCard.jsx    # Carte de prédiction IA
│   │   └── SubscriptionBadge.jsx # Badge de niveau d'abonnement
│   │
│   ├── data/
│   │   └── mockData.js           # Données simulées (Matchs, Users, etc.)
│   │
│   ├── pages/
│   │   ├── AIAgent.jsx           # Page de l'agent IA
│   │   ├── Chat.jsx              # Liste des salles de chat
│   │   ├── Home.jsx              # Page d'accueil
│   │   ├── Profile.jsx           # Profil utilisateur
│   │   ├── Stats.jsx             # Page de statistiques
│   │   └── Subscription.jsx      # Page d'abonnement
│   │
│   ├── App.jsx                   # Configuration des routes
│   ├── main.jsx                  # Point d'entrée React
│   └── index.css                 # Styles globaux et Tailwind
│
├── public/                       # Assets statiques
├── tailwind.config.js            # Configuration du design system
└── vite.config.js                # Configuration du bundler
```
