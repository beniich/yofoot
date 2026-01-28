# 🏗️ Architecture FootballHub - Plateforme SaaS Football Premium

## 📊 Vue d'Ensemble

FootballHub est une **plateforme SaaS full-stack** combinant :
- **Frontend React** (Vite) avec design premium
- **Backend Node.js/Express** avec authentification JWT
- **Service IA Python** (FastAPI) pour prédictions
- **Base de données MongoDB** pour persistance
- **Redis** pour cache et sessions
- **Stripe** pour paiements et abonnements

---

## 📁 Structure du Projet

```
football-hub/
│
├── 🎨 FRONTEND (React + Vite)
│   ├── src/
│   │   ├── pages/              # Pages de l'application
│   │   │   ├── Home.jsx        # Page d'accueil
│   │   │   ├── Auth.jsx        # Connexion/Inscription
│   │   │   ├── Profile.jsx     # Profil utilisateur
│   │   │   ├── Subscription.jsx # Plans premium
│   │   │   ├── Chat.jsx        # Salons communautaires
│   │   │   ├── AIAgent.jsx     # Prédictions IA
│   │   │   ├── Stats.jsx       # Statistiques
│   │   │   ├── BetSlip.jsx     # Ticket de paris
│   │   │   └── Standings.jsx   # Classements
│   │   │
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── Header.jsx      # En-tête avec logo
│   │   │   ├── BottomNavigation.jsx # Navigation mobile
│   │   │   ├── MatchCard.jsx   # Carte de match
│   │   │   └── LiveScore.jsx   # Score en direct
│   │   │
│   │   ├── context/            # Gestion d'état global
│   │   │   └── AuthContext.jsx # Contexte authentification
│   │   │
│   │   ├── services/           # Appels API
│   │   │   ├── api.js          # Client Axios configuré
│   │   │   └── auth.js         # Services d'authentification
│   │   │
│   │   ├── data/               # Données mock
│   │   │   └── mockData.js     # Données de test
│   │   │
│   │   ├── App.jsx             # Routeur principal
│   │   ├── main.jsx            # Point d'entrée
│   │   └── index.css           # Styles globaux
│   │
│   ├── public/
│   │   └── logo.png            # Logo (couronne + ballon)
│   │
│   ├── index.html              # Template HTML
│   ├── vite.config.js          # Configuration Vite
│   ├── tailwind.config.js      # Configuration Tailwind CSS
│   └── package.json            # Dépendances frontend
│
├── 🔧 BACKEND (Node.js + Express)
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/         # Routes API
│   │   │   │   ├── auth.js     # POST /api/auth/register, /login
│   │   │   │   ├── matches.js  # GET /api/matches/live
│   │   │   │   ├── leagues.js  # GET /api/leagues
│   │   │   │   ├── standings.js # GET /api/standings/:id
│   │   │   │   └── stripe.js   # POST /api/stripe/checkout
│   │   │   │
│   │   │   ├── models/         # Modèles MongoDB
│   │   │   │   ├── User.js     # Schéma utilisateur
│   │   │   │   └── Match.js    # Schéma match
│   │   │   │
│   │   │   ├── middleware/     # Middlewares
│   │   │   │   └── auth.js     # Vérification JWT
│   │   │   │
│   │   │   ├── services/       # Services métier
│   │   │   │   ├── footballApi.js # API externe (API-Football)
│   │   │   │   └── redis.js    # Client Redis
│   │   │   │
│   │   │   ├── socket.js       # WebSocket (Socket.io)
│   │   │   └── index.js        # Serveur Express principal
│   │   │
│   │   ├── .env                # Variables d'environnement
│   │   ├── Dockerfile          # Image Docker backend
│   │   └── package.json        # Dépendances backend
│
├── 🤖 AI SERVICE (Python + FastAPI)
│   ├── ai-service/
│   │   ├── main.py             # API FastAPI
│   │   ├── model.pkl           # Modèle ML entraîné (à créer)
│   │   ├── requirements.txt    # Dépendances Python
│   │   └── Dockerfile          # Image Docker IA
│
├── 🐳 INFRASTRUCTURE
│   ├── docker-compose.yml      # Orchestration services
│   ├── vercel.json             # Config déploiement Vercel
│   └── .vercelignore           # Fichiers exclus Vercel
│
└── 📚 DOCUMENTATION
    ├── README.md               # Documentation principale
    ├── DEPLOY.md               # Guide de déploiement
    ├── DEVELOPMENT.md          # Guide développement
    └── PROJECT_STRUCTURE.md    # Structure du projet
```

---

## 🔄 Flux de Données

### 1. **Authentification**
```
User → Auth.jsx → /api/auth/login → JWT Token → localStorage → AuthContext
```

### 2. **Abonnement Premium**
```
User → Subscription.jsx → /api/stripe/checkout → Stripe → Webhook → Update User.plan
```

### 3. **Prédictions IA**
```
User → AIAgent.jsx → /api/ai/predict → FastAPI (ai-service) → ML Model → Prediction
```

### 4. **Scores en Direct**
```
Backend → API-Football → Redis Cache → Socket.io → Frontend (LiveScore.jsx)
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling utility-first
- **React Router** - Navigation SPA
- **Axios** - Client HTTP
- **Socket.io Client** - WebSocket temps réel
- **Framer Motion** - Animations

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB + Mongoose** - Base de données NoSQL
- **Redis** - Cache et sessions
- **Socket.io** - WebSocket serveur
- **JWT** - Authentification
- **Bcrypt** - Hashage mots de passe
- **Stripe** - Paiements

### AI Service
- **Python 3.10+** - Langage ML
- **FastAPI** - Framework API moderne
- **scikit-learn** - Machine Learning
- **pandas** - Manipulation données
- **joblib** - Sérialisation modèle

### DevOps
- **Docker** - Conteneurisation
- **Vercel** - Déploiement frontend
- **Render** - Déploiement backend
- **MongoDB Atlas** - Base cloud
- **GitHub** - Versioning

---

## 🔐 Variables d'Environnement

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/footballhub
JWT_SECRET=your_super_secret_key_here
REDIS_URL=redis://localhost:6379
FOOTBALL_API_KEY=your_api_football_key
STRIPE_SECRET=sk_test_...
CLIENT_URL=http://localhost:3000
```

### AI Service (`ai-service/.env`)
```env
MODEL_PATH=./model.pkl
```

---

## 🚀 Déploiement

### Local
```bash
npm run dev:full  # Lance frontend + backend simultanément
```

### Production
1. **Frontend** → Vercel (automatique depuis GitHub)
2. **Backend** → Render (Node.js service)
3. **AI Service** → Render (Python service)
4. **Database** → MongoDB Atlas (cluster gratuit)

---

## 📊 Modèle de Données

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String (unique),
  password: String (hashed),
  plan: String (free|pro|elite),
  createdAt: Date
}
```

### Match
```javascript
{
  _id: ObjectId,
  fixtureId: Number,
  leagueId: Number,
  homeTeam: String,
  awayTeam: String,
  homeScore: Number,
  awayScore: Number,
  status: String,
  startTime: Date
}
```

---

## 🎨 Design System

### Couleurs
- **Primary**: `#135bec` (Bleu électrique)
- **Gold**: `#D4AF37` (Or premium)
- **Charcoal**: `#101622` (Fond sombre)
- **Surface Dark**: `#1a2232` (Cartes)

### Typographie
- **Display**: Lexend (moderne, tech)
- **Serif**: Playfair Display (élégance)
- **Sans**: Inter (lisibilité)

---

## 🔒 Sécurité

✅ **JWT** pour authentification stateless
✅ **Bcrypt** pour hashage mots de passe (10 rounds)
✅ **CORS** configuré pour domaines autorisés
✅ **Rate limiting** sur API (à implémenter)
✅ **Validation** des inputs (à renforcer)
✅ **HTTPS** en production (Vercel/Render)

---

## 📈 Évolutivité

### Actuellement Implémenté
- ✅ Architecture microservices (Backend + IA séparés)
- ✅ Cache Redis pour performances
- ✅ WebSocket pour temps réel
- ✅ Paiements Stripe intégrés

### À Implémenter
- ⏳ Entraînement modèle IA
- ⏳ Tests unitaires (Jest, Pytest)
- ⏳ CI/CD pipeline (GitHub Actions)
- ⏳ Monitoring (Sentry, LogRocket)
- ⏳ Analytics (Google Analytics, Mixpanel)

---

**Architecture conçue pour scaler de 0 à 100k utilisateurs** 🚀
