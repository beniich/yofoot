# 🏟️ FootballHub+ - Plateforme Premium de Gestion Sportive

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/vite-5.4.21-purple)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

> **Plateforme SaaS complète** pour clubs sportifs : gestion d'événements, billetterie avec QR codes, boutique en ligne, et gestion des membres.

![FootballHub+ Banner](https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=400&fit=crop)

---

## ✨ Nouvelles Fonctionnalités (v2.0)

### 🎯 **4 Nouvelles Pages Premium**

#### 1. **Members** - Gestion des Membres
- 👥 Base de données complète des membres
- 🔍 Recherche avancée (nom, ID, rôle)
- 🏷️ Filtres multiples (Elite, Pro, Active, Inactive)
- 🎖️ Système de tiers (ELITE, PRO, STANDARD)
- ✅ Badges de vérification
- 🔄 Toggle activation/désactivation
- 📊 Actions groupées et export CSV

#### 2. **Events** - Découverte d'Événements
- 📅 Calendrier d'événements interactif
- 🏆 Catégories : Matchs, Tournois, Entraînements, Social
- 📈 Stats en temps réel (attendees, capacité, gratuits)
- 🎫 Réservation de billets intégrée
- 📍 Informations de lieu et date
- 💰 Affichage des prix et disponibilités
- 📊 Barre de progression de remplissage

#### 3. **Tickets** - Mes Billets
- 🎟️ Gestion complète des billets
- 📱 QR codes pour validation
- 🔄 Onglets Upcoming / Past
- ✅ Statut de validation en temps réel
- 💺 Informations de siège (section, rangée, siège)
- 📥 Téléchargement et partage
- 🎨 Types de billets (VIP, ELITE, STANDARD, EARLY_BIRD)

#### 4. **Shop** - Boutique Officielle
- 🛍️ E-commerce complet
- 🛒 Panier d'achat interactif
- 🔍 Recherche et filtres par catégorie
- ⭐ Notes et avis clients
- 💎 Badges (Best Seller, Réductions, Stock limité)
- 📦 Catégories : Jerseys, Training, Accessories, Memorabilia
- 💳 Checkout sécurisé (à venir)

---

## 🎨 Design System Premium

### **Thème Gold & Charcoal**
- **Primary Gold**: `#D4AF37` - Accents premium
- **Gold Light**: `#E5C158` - Highlights
- **Charcoal**: `#101622` - Fond principal
- **Surface Dark**: `#1a2232` - Cartes et surfaces

### **Composants UI Réutilisables**
```jsx
// Bibliothèque complète dans src/components/UI.jsx
<Button variant="primary" size="md" icon="add">Action</Button>
<Card variant="glass">Content</Card>
<Badge variant="success">Active</Badge>
<Input icon="search" placeholder="Search..." />
<Toggle checked={true} label="Active" />
<Modal isOpen={true} title="Title">Content</Modal>
<Spinner size="md" />
<EmptyState icon="inbox" title="No data" />
```

### **Animations & Transitions**
- ✨ Hover effects sur tous les éléments interactifs
- 🎭 Scale animations sur les clics
- 🌊 Smooth transitions (200-500ms)
- 🔄 Loading states avec spinners
- 📱 Touch-friendly interactions

---

## 🚀 Démarrage Rapide

### **Installation**

```bash
# Cloner le repository
git clone https://github.com/votre-org/footballhub-plus.git
cd footballhub-plus

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

### **Build Production**

```bash
npm run build
npm run preview
```

---

## 📁 Structure du Projet

```
football-hub/
├── src/
│   ├── pages/                    # Pages de l'application
│   │   ├── Home.jsx             # Page d'accueil
│   │   ├── Events.jsx           # ✨ NOUVEAU - Événements
│   │   ├── Tickets.jsx          # ✨ NOUVEAU - Billets
│   │   ├── Shop.jsx             # ✨ NOUVEAU - Boutique
│   │   ├── Members.jsx          # ✨ NOUVEAU - Membres
│   │   ├── Profile.jsx          # Profil utilisateur
│   │   ├── Subscription.jsx     # Plans premium
│   │   ├── Stats.jsx            # Statistiques
│   │   ├── Chat.jsx             # Chat communautaire
│   │   ├── AIAgent.jsx          # Prédictions IA
│   │   ├── BetSlip.jsx          # Paris sportifs
│   │   └── Auth.jsx             # Authentification
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── UI.jsx               # ✨ NOUVEAU - Bibliothèque UI
│   │   ├── Header.jsx           # En-tête
│   │   ├── BottomNavigation.jsx # Navigation mobile
│   │   ├── MatchCard.jsx        # Carte de match
│   │   └── PredictionCard.jsx   # Carte de prédiction
│   │
│   ├── context/                  # Gestion d'état
│   │   └── AuthContext.jsx      # Contexte auth
│   │
│   ├── services/                 # Services API
│   │   ├── api.js               # Client Axios
│   │   └── auth.js              # Services auth
│   │
│   ├── data/                     # Données mock
│   │   └── mockData.js          # Données de test
│   │
│   ├── App.jsx                   # Routeur principal
│   ├── main.jsx                  # Point d'entrée
│   └── index.css                 # Styles globaux
│
├── server/                       # Backend Node.js
│   ├── src/
│   │   ├── routes/              # Routes API
│   │   ├── models/              # Modèles MongoDB
│   │   ├── middleware/          # Middlewares
│   │   └── services/            # Services métier
│   └── index.js                 # Serveur Express
│
├── public/                       # Assets statiques
│   └── logo.png                 # Logo FootballHub
│
├── ARCHITECTURE.md              # Documentation architecture
├── INTEGRATION_SUMMARY.md       # ✨ NOUVEAU - Résumé intégration
├── TESTING_GUIDE.md             # ✨ NOUVEAU - Guide de test
└── README.md                    # Ce fichier
```

---

## 🗺️ Routes Disponibles

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil avec matchs en direct |
| `/events` | **Events** ✨ | Découverte d'événements |
| `/tickets` | **Tickets** ✨ | Gestion des billets |
| `/shop` | **Shop** ✨ | Boutique officielle |
| `/members` | **Members** ✨ | Gestion des membres (Admin) |
| `/profile` | Profile | Profil utilisateur |
| `/subscription` | Subscription | Plans premium |
| `/stats` | Stats | Statistiques détaillées |
| `/chat` | Chat | Chat communautaire |
| `/ai-agent` | AI Agent | Prédictions IA |
| `/betslip` | Bet Slip | Paris sportifs |
| `/standings` | Standings | Classements |
| `/auth` | Auth | Connexion/Inscription |

---

## 🎯 Fonctionnalités par Page

### **Home**
- ⚽ Matchs en direct
- 📊 Statistiques rapides
- 🔥 Événements à venir
- 💬 Chat en direct

### **Events** ✨
- 📅 Liste complète des événements
- 🔍 Recherche et filtres
- 📈 Stats (total, attendees, gratuits)
- 🎫 Réservation directe
- 📊 Barre de progression
- 💰 Affichage des prix

### **Tickets** ✨
- 🎟️ Mes billets (upcoming/past)
- 📱 QR codes de validation
- ✅ Statut de validation
- 💺 Informations de siège
- 📥 Téléchargement PDF
- 🔗 Partage social

### **Shop** ✨
- 🛍️ Catalogue de produits
- 🛒 Panier d'achat
- 🔍 Recherche avancée
- ⭐ Notes et avis
- 💎 Badges promotionnels
- 💳 Checkout (à venir)

### **Members** ✨
- 👥 Base de données membres
- 🔍 Recherche multi-critères
- 🏷️ Filtres avancés
- 🎖️ Système de tiers
- ✅ Vérification
- 🔄 Gestion du statut
- 📊 Actions groupées

---

## 🛠️ Technologies

### **Frontend**
- **React 18.3.1** - Framework UI
- **Vite 5.4.21** - Build tool ultra-rapide
- **React Router 7.1.1** - Navigation SPA
- **Tailwind CSS 3.4.17** - Styling utility-first
- **Material Symbols** - Icônes Google
- **Axios** - Client HTTP

### **Backend** (à connecter)
- **Node.js 18+** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB + Mongoose** - Base de données NoSQL
- **JWT** - Authentification
- **Stripe** - Paiements

### **DevOps**
- **Docker** - Conteneurisation
- **Vercel** - Déploiement frontend
- **GitHub** - Versioning

---

## 📊 Données Mock

### **Members** (6 exemples)
```javascript
{
  id: 8821,
  name: "Alex Johnson",
  tier: "ELITE",
  role: "Forward",
  joinDate: "Oct 2023",
  isActive: true,
  isVerified: true
}
```

### **Events** (4 exemples)
```javascript
{
  id: "1",
  title: "FC Lions vs. Tigers",
  category: "MATCH",
  startDate: "2024-10-12T19:00:00",
  venue: "Main Stadium",
  price: 45,
  attendees: 1250,
  capacity: 2000
}
```

### **Tickets** (3 exemples)
```javascript
{
  id: "1",
  ticketNumber: "TKT-ABC123",
  ticketType: "VIP",
  isValidated: false,
  event: { ... }
}
```

### **Products** (6 exemples)
```javascript
{
  id: "1",
  name: "23/24 Home Jersey",
  price: 85,
  comparePrice: 100,
  category: "JERSEY",
  stock: 50,
  rating: 4.8,
  reviews: 124
}
```

---

## 🧪 Tests

### **Test Manuel**
Consultez [TESTING_GUIDE.md](./TESTING_GUIDE.md) pour le guide complet de test.

**Checklist rapide :**
- [ ] Toutes les pages se chargent
- [ ] Navigation fonctionne
- [ ] Recherche et filtres opérationnels
- [ ] Interactions réactives
- [ ] Design cohérent

### **Tests Automatisés** (à venir)
```bash
npm run test
npm run test:coverage
```

---

## 📈 Roadmap

### **v2.0 (Actuel)** ✅
- [x] Page Events complète
- [x] Page Tickets avec QR codes
- [x] Page Shop avec panier
- [x] Page Members avec gestion
- [x] Bibliothèque UI réutilisable
- [x] Design system unifié

### **v2.1 (Prochain)**
- [ ] Connexion au backend
- [ ] Authentification JWT
- [ ] Paiements Stripe
- [ ] Upload d'images
- [ ] Notifications push

### **v3.0 (Futur)**
- [ ] Application mobile (React Native)
- [ ] IA pour recommandations
- [ ] Live streaming
- [ ] Analytics avancés
- [ ] Multi-langue

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 📞 Support

- **Email**: support@footballhub.com
- **Documentation**: [docs.footballhub.com](https://docs.footballhub.com)
- **Discord**: [discord.gg/footballhub](https://discord.gg/footballhub)
- **GitHub Issues**: [github.com/footballhub/issues](https://github.com/footballhub/issues)

---

## 🎉 Remerciements

- **Design**: Inspiré des meilleures pratiques UI/UX modernes
- **Icônes**: Google Material Symbols
- **Images**: Unsplash
- **Communauté**: Tous les contributeurs

---

**Fait avec ❤️ et ⚽ par l'équipe FootballHub+**

*Architecture conçue pour scaler de 0 à 100k utilisateurs* 🚀
