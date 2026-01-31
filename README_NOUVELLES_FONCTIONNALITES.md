# 🚀 FootballHub+ - Guide de Démarrage Rapide

## 📋 Nouvelles Fonctionnalités Intégrées

### ✅ Phase 1 - Fondations (COMPLÉTÉ)
1. **Système de Favoris** - Marquez vos ligues, équipes et joueurs préférés
2. **Notifications Push** - Recevez des alertes en temps réel pour vos matchs favoris

---

## 🔧 Installation

### 1. Cloner le Projet
```bash
git clone <votre-repo>
cd football-hub
```

### 2. Configuration Backend

```bash
cd server

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos clés
nano .env
```

**Variables essentielles à configurer :**
- `MONGODB_URI` - Votre base de données MongoDB
- `JWT_SECRET` - Clé secrète pour JWT (générez-en une aléatoire)
- `FIREBASE_*` - Credentials Firebase (optionnel pour notifications)

### 3. Configuration Frontend

```bash
cd ../footballhub-frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer .env.local
nano .env.local
```

**Variables essentielles :**
- `VITE_API_URL` - URL de votre API backend (http://localhost:5000)

---

## 🚀 Lancement

### Développement Local

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd footballhub-frontend
npm run dev
```

**Terminal 3 - Mobile (optionnel) :**
```bash
cd footballhub-frontend
npm run build
npx cap sync
npx cap open android
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000 ou http://localhost:5173
- **Backend API** : http://localhost:5000
- **Health Check** : http://localhost:5000/health

---

## 🎯 Utilisation des Nouvelles Fonctionnalités

### 1. Système de Favoris

#### Dans le Code
```tsx
import { FavoriteButton } from '@/components/FavoriteButton';

// Ajouter un bouton favori
<FavoriteButton 
  type="league"  // ou "team" ou "player"
  id={leagueId} 
  size="md"      // sm, md, lg
  showLabel={true}
  onToggle={(isFavorite) => {
    console.log('Statut favori:', isFavorite);
  }}
/>
```

#### Avec le Hook
```tsx
import { useFavorites } from '@/hooks/useFavorites';

function MyComponent() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  
  // Vérifier si une ligue est favorite
  const isLigueFavorite = isFavorite('league', leagueId);
  
  // Basculer le statut
  const handleToggle = async () => {
    const newStatus = await toggleFavorite('league', leagueId);
    console.log('Nouveau statut:', newStatus);
  };
  
  // Accéder à tous les favoris
  console.log('Ligues favorites:', favorites.leagues);
  console.log('Équipes favorites:', favorites.teams);
  console.log('Joueurs favoris:', favorites.players);
}
```

#### Page Favoris
Naviguez vers `/favorites` pour voir tous vos favoris organisés par catégorie.

---

### 2. Notifications Push

#### Configuration Firebase (Backend)

1. **Créer un projet Firebase :**
   - Allez sur https://console.firebase.google.com/
   - Créez un nouveau projet
   - Activez Cloud Messaging

2. **Obtenir les credentials :**
   - Project Settings > Service Accounts
   - Generate new private key
   - Téléchargez le fichier JSON

3. **Configurer dans .env :**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_ICI\n-----END PRIVATE KEY-----\n"
```

#### Utilisation dans le Code

**Envoyer une notification :**
```javascript
import notificationService from './services/notificationService.js';

// Notification à un utilisateur
await notificationService.sendToUser(userId, {
  title: 'Nouveau match',
  body: 'PSG vs OM commence dans 30 minutes',
  data: { matchId: '123', type: 'match_start' }
});

// Notification à plusieurs utilisateurs
await notificationService.sendToMultiple([userId1, userId2], {
  title: 'But !',
  body: 'Mbappé marque pour le PSG'
});

// Notification par topic
await notificationService.sendToTopic('match_123', {
  title: 'Événement',
  body: 'Carton rouge !'
});
```

**Notifications automatiques de match :**
```javascript
// Au début du match
await notificationService.notifyMatchStart(matchId);

// Quand un but est marqué
await notificationService.notifyGoal(matchId, {
  player: 'Mbappé',
  team: 'PSG'
});

// À la fin du match
await notificationService.notifyMatchResult(matchId);
```

---

## 📚 API Endpoints

### Favoris

```bash
# Récupérer tous les favoris
GET /api/favorites
Authorization: Bearer <token>

# Ajouter une ligue aux favoris
POST /api/favorites/leagues/:id
Authorization: Bearer <token>

# Retirer une ligue des favoris
DELETE /api/favorites/leagues/:id
Authorization: Bearer <token>

# Vérifier si une ligue est favorite
GET /api/favorites/leagues/check/:id
Authorization: Bearer <token>

# Basculer le statut favori
POST /api/favorites/toggle/league/:id
Authorization: Bearer <token>
```

Routes similaires pour `/teams` et `/players`.

---

## 🧪 Tests

### Tester les Favoris

```bash
# 1. S'authentifier
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Ajouter une ligue aux favoris
curl -X POST http://localhost:5000/api/favorites/leagues/LEAGUE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Récupérer les favoris
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Tester les Notifications

```bash
# Vérifier que Firebase est initialisé
# Regardez les logs du serveur : "✅ Firebase Admin initialized successfully"

# Envoyer une notification de test (créez d'abord une route de test)
curl -X POST http://localhost:5000/api/test/notification \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "title": "Test",
    "body": "Message de test"
  }'
```

---

## 📁 Structure des Fichiers

```
football-hub/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   └── favorites.js ⭐ NOUVEAU
│   │   ├── services/
│   │   │   └── notificationService.js ⭐ NOUVEAU
│   │   └── index.js (modifié)
│   ├── .env.example ⭐ NOUVEAU
│   └── package.json
│
├── footballhub-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── FavoriteButton.tsx ⭐ NOUVEAU
│   │   ├── hooks/
│   │   │   └── useFavorites.ts ⭐ NOUVEAU
│   │   ├── pages/
│   │   │   └── Favorites.tsx ⭐ NOUVEAU
│   │   └── vite-env.d.ts ⭐ NOUVEAU
│   ├── .env.example ⭐ NOUVEAU
│   └── package.json
│
├── AMELIORATIONS_DISPONIBLES.md ⭐ NOUVEAU
├── INTEGRATION_PHASE1.md ⭐ NOUVEAU
└── README_NOUVELLES_FONCTIONNALITES.md ⭐ CE FICHIER
```

---

## 🔜 Prochaines Étapes

### Phase 2 (À venir)
- **WebSocket Temps Réel** - Scores en direct
- **CRON Jobs** - Synchronisation automatique
- **Mobile QR Scanner** - Scanner de tickets amélioré
- **Design System** - Composants UI réutilisables

Consultez `AMELIORATIONS_DISPONIBLES.md` pour la liste complète des améliorations disponibles.

---

## 🆘 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier MongoDB
mongosh  # ou mongo

# Vérifier les variables d'environnement
cat server/.env

# Réinstaller les dépendances
cd server && rm -rf node_modules && npm install
```

### Erreurs Firebase
```bash
# Vérifier que les credentials sont corrects
# Le PRIVATE_KEY doit contenir les \n littéraux, pas les retours à la ligne réels

# Désactiver temporairement Firebase
# Dans server/.env, ne pas définir FIREBASE_PROJECT_ID
# Le service se désactivera automatiquement
```

### Favoris ne s'affichent pas
```bash
# Vérifier l'authentification
# Le token JWT doit être valide

# Vérifier les logs du serveur
# Regardez les erreurs dans la console

# Tester l'endpoint directement
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Support

Pour toute question ou problème :
1. Consultez `INTEGRATION_PHASE1.md` pour les détails techniques
2. Vérifiez les logs du serveur et du frontend
3. Consultez `AMELIORATIONS_DISPONIBLES.md` pour la documentation complète

---

**Bon développement ! ⚽🚀**

---

**Dernière mise à jour** : 31 janvier 2026  
**Version** : 1.0.0
