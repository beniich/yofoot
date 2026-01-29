# 🏗️ Architecture FootballHub - Plateforme SaaS Football Premium

## 📊 Vue d'Ensemble

FootballHub est une **plateforme SaaS full-stack** complète combinant :
- **Frontend React** (Vite) avec design premium (Glassmorphism, Gold/Dark theme)
- **Backend Node.js/Express** avec architecture RESTful
- **Base de données MongoDB** pour la gestion complexe des données (Membres, Billets, Boutique)
- **Service Layer Frontend** découplé (Supporte Mock Data & Appels API réels)
- **Système de Billetterie** avec QR Code et Scanner intégré
- **Boutique E-commerce** complète

---

## 📁 Structure du Projet

```
football-hub/
│
├── 🎨 FRONTEND (React + Vite)
│   ├── src/
│   │   ├── pages/              # Pages de l'application
│   │   │   ├── Home.jsx        # Dashboard Principal
│   │   │   ├── Shop.jsx        # Boutique (Nouveau)
│   │   │   ├── Tickets.jsx     # Mes Billets (Nouveau)
│   │   │   ├── TicketScanner.jsx # Scanner QR Staff (Nouveau)
│   │   │   ├── Events.jsx      # Calendrier Événements (Nouveau)
│   │   │   ├── Members.jsx     # Gestion Membres (Nouveau)
│   │   │   ├── Stats.jsx       # Analyses détaillées
│   │   │   ├── Standings.jsx   # Classements
│   │   │   ├── AIAgent.jsx     # Assistant IA
│   │   │   └── Chat.jsx        # Communauté
│   │   │
│   │   ├── components/         # Composants UI
│   │   │   ├── UI.jsx          # Kit UI (Button, Card, Badge...)
│   │   │   ├── Header.jsx      # Navigation Supérieure
│   │   │   └── BottomNavigation.jsx # Menu Mobile
│   │   │
│   │   ├── services/           # Couche de Service (API/Mock)
│   │   │   ├── api.js          # Client Axios Centralisé
│   │   │   ├── auth.js         # Service Auth
│   │   │   ├── members.js      # Service Membres (avec mode Simulation)
│   │   │   ├── events.js       # Service Événements (avec mode Simulation)
│   │   │   ├── tickets.js      # Service Billetterie & Validation
│   │   │   └── shop.js         # Service E-commerce
│   │   │
│   │   ├── App.jsx             # Routing
│   │   └── main.jsx            # Entry Point
│   │
│   ├── index.html              # HTML Root
│   └── vite.config.js          # Config Build
│
├── 🔧 BACKEND (Node.js + Express)
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/         # Endpoints API
│   │   │   │   ├── members.js  # CRUD Membres
│   │   │   │   ├── events.js   # Gestion Événements
│   │   │   │   ├── tickets.js  # Validation Billets
│   │   │   │   ├── products.js # Catalogue Produits
│   │   │   │   └── orders.js   # Commandes
│   │   │   │
│   │   │   ├── models/         # Schémas Mongoose
│   │   │   │   ├── Member.js   # Profil Membre étendu
│   │   │   │   ├── Event.js    # Un Événement
│   │   │   │   ├── Ticket.js   # Billet unique (liens QRCode)
│   │   │   │   ├── Product.js  # Article Boutique
│   │   │   │   └── Order.js    # Transaction
│   │   │   │
│   │   │   ├── seeds/          # Scripts de population DB
│   │   │   │   └── index.js    # Générateur de fausses données
│   │   │   │
│   │   │   └── index.js        # Serveur Express & Loading Routes
│   │   │
│   │   └── package.json
│
└── � DOCS & CONFIG
    ├── ARCHITECTURE.md         # Ce fichier
    ├── BACKEND_CONNECTION_GUIDE.md # Guide de transition Mock -> API
    └── ...
```

---

## 🔄 Flux de Données & Fonctionnalités

### 1. **Système Hybride (Mock vs API)**
L'architecture Frontend est conçue pour être robuste :
- **Mode Normal** : Les services (`src/services/*.js`) appellent le Backend via `api.js`.
- **Mode Simulation** : Si le Backend ou MongoDB est indisponible, les services basculent automatiquement (via code commenté/décommenté) sur des données Mock locales, assurant une démo toujours fonctionnelle.

### 2. **Billetterie & Contrôle d'Accès**
```
Achat Billet → Génération Ticket (DB) → Affichage QR (Tickets.jsx) → Scan par Staff (TicketScanner.jsx) → Validation API (/api/tickets/validate) → Mise à jour Status
```

### 3. **E-commerce (Shop)**
```
Catalogue (/api/products) → Panier Local (React State) → Checkout → Création Commande (/api/orders) → Mise à jour Stock
```

---

## 📊 Modèles de Données Clés (MongoDB)

### **Member**
Profil complet du supporter/joueur.
```javascript
{
  firstName, lastName, email,
  role: 'Player' | 'Staff' | 'Fan',
  tier: 'VIP' | 'Elite' | 'Standard',
  status: 'Active' | 'Inactive',
  orders: [Ref], tickets: [Ref]
}
```

### **Event**
Match, Entraînement ou Tournoi.
```javascript
{
  title, category, date, venue,
  capacity, attendees: [MemberRef],
  image, status
}
```

### **Product**
Article en vente.
```javascript
{
  name, price, stock, category,
  images: [String], rating
}
```

---

## 🛠️ Stack Technique

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Design System personnalisé : Gold/Charcoal)
- **Lucide React** (Icônes)
- **React Router Dom** (Navigation)

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose** (ODM)
- **CORS** & **Dotenv**

### Outils
- **Git** (Gestion de version)
- **Nodemon** (Dev Server Backend)

---

## � État Actuel du Projet

✅ **Frontend Complet** : Toutes les pages UI sont intégrées et responsive.
✅ **Architecture Services** : Prête pour basculer entre Mock et Réel.
✅ **Backend Configuré** : Routes et Modèles prêts.
⚠️ **Base de Données** : Nécessite une instance MongoDB locale (port 27017) pour le mode "Full Stack". En l'absence de DB, le frontend tourne en mode "Simulation".

---

**FootballHub+** est prêt pour la démonstration et l'extension.
