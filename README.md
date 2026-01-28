# 🏟️ FootballHub+ - Plateforme Complète de Gestion d'Événements Sportifs

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.3.3-blue)](https://www.typescriptlang.org)

> Une plateforme moderne et complète pour gérer vos événements sportifs, vendre des billets avec QR codes, gérer votre boutique en ligne et développer votre communauté de fans.

## ✨ Fonctionnalités Principales

### 🎫 Billetterie Intelligente
- Génération automatique de QR codes sécurisés
- Validation en temps réel à l'entrée
- Types de billets multiples (VIP, Standard, Early Bird, Gratuit)
- Gestion des annulations et remboursements

### 📅 Gestion d'Événements
- Création et gestion de matchs, tournois, entraînements
- Calendrier interactif
- Gestion des participants et capacités
- Notifications automatiques

### 🛍️ E-commerce Intégré
- Boutique en ligne pour maillots et accessoires
- Gestion d'inventaire en temps réel
- Panier et checkout sécurisé
- Suivi de commandes

### 👥 Gestion de Club
- Système d'abonnement (Basic, Pro, Elite)
- Gestion des membres et rôles
- Dashboard analytics complet
- Communication interne

### 📊 Analytics Avancés
- Tableaux de bord en temps réel
- Métriques de revenus et ventes
- Statistiques d'engagement
- Rapports exportables

### 🔐 Sécurité
- Authentification JWT avec refresh tokens
- Paiements sécurisés (Stripe, PayPal, Mobile Money)
- Chiffrement des données
- Protection GDPR

## 🏗️ Architecture

```
FootballHub+
├── Frontend (Next.js 14)
│   ├── React 18
│   ├── TanStack Query
│   ├── Zustand
│   ├── Tailwind CSS + shadcn/ui
│   └── Socket.io Client
│
├── Backend (NestJS)
│   ├── API Gateway
│   ├── Auth Service
│   ├── Ticket Service
│   ├── Event Service
│   ├── Shop Service
│   ├── Payment Service
│   ├── Club Service
│   ├── Badge Service
│   ├── Analytics Service
│   └── Notification Service
│
└── Infrastructure
    ├── PostgreSQL (Base de données)
    ├── Redis (Cache)
    ├── RabbitMQ (Message Queue)
    └── Docker + Kubernetes
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js >= 20.0.0
- PostgreSQL >= 15
- Redis >= 7
- Docker (optionnel mais recommandé)

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-org/footballhub-plus.git
cd footballhub-plus
```

2. **Installer les dépendances**

**Frontend:**
```bash
cd footballhub-frontend
npm install
```

**Backend:**
```bash
cd footballhub-backend
npm install
```

3. **Configuration des variables d'environnement**

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend (.env):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/footballhub
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

4. **Initialiser la base de données**
```bash
cd footballhub-backend
npx prisma migrate dev
npx prisma db seed
```

5. **Lancer l'application**

**Avec Docker (Recommandé):**
```bash
docker-compose up -d
```

**Sans Docker:**

Terminal 1 - Backend:
```bash
cd footballhub-backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd footballhub-frontend
npm run dev
```

6. **Accéder à l'application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

## 📚 Documentation

### Structure du Projet

#### Frontend (`footballhub-frontend/`)
```
src/
├── app/              # Next.js App Router
├── components/       # Composants réutilisables
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities et helpers
├── store/           # Zustand stores
├── types/           # TypeScript types
└── styles/          # Global styles
```

#### Backend (`footballhub-backend/`)
```
apps/
├── api-gateway/     # Main API Gateway
├── auth-service/    # Authentication
├── ticket-service/  # Ticketing & QR
├── event-service/   # Events
├── shop-service/    # E-commerce
└── ...

libs/
├── common/          # Shared utilities
├── database/        # Prisma & DB
└── config/          # Configuration
```

### API Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

#### Events
```
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/:id
PATCH  /api/v1/events/:id
DELETE /api/v1/events/:id
```

#### Tickets
```
GET    /api/v1/tickets
POST   /api/v1/tickets
GET    /api/v1/tickets/:id
POST   /api/v1/tickets/:id/validate
```

[Documentation complète des APIs](./docs/API.md)

## 🧪 Tests

```bash
# Frontend
cd footballhub-frontend
npm run test

# Backend
cd footballhub-backend
npm run test
npm run test:cov
```

## 📦 Déploiement

### Production avec Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Déploiement sur Cloud

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: AWS ECS, Google Cloud Run, Azure Container Apps
- **Base de données**: AWS RDS, Google Cloud SQL, Supabase

[Guide de déploiement complet](./docs/DEPLOYMENT.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

## 👥 Équipe

- **Développement**: Votre équipe
- **Design**: Votre équipe
- **Product**: Votre équipe

## 📞 Support

- Email: support@footballhub.com
- Documentation: https://docs.footballhub.com
- Discord: https://discord.gg/footballhub

## 🗺️ Roadmap

### Phase 1 (Q1 2026) ✅
- [x] Architecture de base
- [x] Authentification
- [x] Gestion d'événements
- [x] Billetterie avec QR

### Phase 2 (Q2 2026)
- [ ] E-commerce complet
- [ ] Paiements multiples
- [ ] Analytics avancés
- [ ] Mobile apps (iOS/Android)

### Phase 3 (Q3 2026)
- [ ] AI/ML pour prédictions
- [ ] Intégration réseaux sociaux
- [ ] Live streaming
- [ ] Gamification

### Phase 4 (Q4 2026)
- [ ] Marketplace tiers
- [ ] API publique
- [ ] White-label solution
- [ ] Enterprise features

---

**Fait avec ❤️ par l'équipe FootballHub+**
