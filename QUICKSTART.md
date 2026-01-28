# 🚀 Guide de Démarrage Rapide - FootballHub+

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 20.0.0 ([Télécharger](https://nodejs.org))
- **PostgreSQL** >= 15 ([Télécharger](https://www.postgresql.org/download/))
- **Git** ([Télécharger](https://git-scm.com/downloads))
- **Docker** (optionnel mais recommandé) ([Télécharger](https://www.docker.com/get-started))

## 🎯 Méthode 1 : Démarrage avec Docker (Recommandé)

### Étape 1 : Lancer tous les services

```bash
# À la racine du projet
docker-compose up -d
```

Cette commande va démarrer :
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ RabbitMQ (port 5672, interface web: 15672)
- ✅ Backend API (port 3001)
- ✅ Frontend (port 3000)

### Étape 2 : Initialiser la base de données

```bash
# Entrer dans le conteneur backend
docker exec -it footballhub-api sh

# Exécuter les migrations
npx prisma migrate dev

# (Optionnel) Seed la base avec des données de test
npx prisma db seed

# Sortir du conteneur
exit
```

### Étape 3 : Accéder à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

### Arrêter les services

```bash
docker-compose down
```

---

## 🛠️ Méthode 2 : Démarrage Manuel (Sans Docker)

### Étape 1 : Installer PostgreSQL

1. Téléchargez et installez PostgreSQL
2. Créez une base de données :

```sql
CREATE DATABASE footballhub;
```

### Étape 2 : Configurer le Backend

```bash
# Aller dans le dossier backend
cd footballhub-backend

# Installer les dépendances
npm install

# Copier le fichier .env et le configurer
# Modifiez DATABASE_URL avec vos credentials PostgreSQL

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# (Optionnel) Seed la base de données
npx prisma db seed
```

### Étape 3 : Lancer le Backend

```bash
# Toujours dans footballhub-backend/
npm run start:dev
```

Le backend sera accessible sur http://localhost:3001

### Étape 4 : Configurer le Frontend

Ouvrez un **nouveau terminal** :

```bash
# Aller dans le dossier frontend
cd footballhub-frontend

# Installer les dépendances
npm install

# Copier le fichier .env.local
# Vérifiez que NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Étape 5 : Lancer le Frontend

```bash
# Toujours dans footballhub-frontend/
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

---

## 🎨 Premiers Pas

### 1. Créer un compte

1. Allez sur http://localhost:3000
2. Cliquez sur "Commencer Gratuitement"
3. Remplissez le formulaire d'inscription
4. Vérifiez votre email (en dev, les emails sont loggés dans la console backend)

### 2. Créer votre premier club

1. Connectez-vous
2. Allez dans "Clubs" > "Créer un club"
3. Remplissez les informations du club
4. Choisissez votre plan d'abonnement

### 3. Créer un événement

1. Dans votre club, allez dans "Événements"
2. Cliquez sur "Nouvel événement"
3. Remplissez les détails (titre, date, lieu, etc.)
4. Publiez l'événement

### 4. Générer des billets

1. Dans votre événement, allez dans "Billets"
2. Configurez les types de billets (VIP, Standard, etc.)
3. Définissez les prix
4. Générez les billets avec QR codes

### 5. Tester la validation

1. Scannez un QR code de billet
2. Le système validera automatiquement le billet
3. Consultez les statistiques en temps réel

---

## 📊 Accès aux Outils de Développement

### Prisma Studio (Base de données visuelle)

```bash
cd footballhub-backend
npx prisma studio
```

Ouvre une interface web sur http://localhost:5555 pour visualiser et éditer vos données.

### API Documentation (Swagger)

Accédez à http://localhost:3001/api/docs pour :
- Voir tous les endpoints disponibles
- Tester les APIs directement
- Voir les schémas de données

---

## 🐛 Résolution de Problèmes

### Le backend ne démarre pas

**Problème** : Erreur de connexion à PostgreSQL

**Solution** :
```bash
# Vérifiez que PostgreSQL est en cours d'exécution
# Windows (PowerShell)
Get-Service postgresql*

# Vérifiez votre DATABASE_URL dans .env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Le frontend affiche une erreur de connexion

**Problème** : Cannot connect to API

**Solution** :
```bash
# Vérifiez que le backend est en cours d'exécution
# Vérifiez NEXT_PUBLIC_API_URL dans .env.local
# Doit être: http://localhost:3001
```

### Erreur Prisma "Migration failed"

**Solution** :
```bash
# Réinitialisez la base de données
npx prisma migrate reset

# Puis relancez les migrations
npx prisma migrate dev
```

### Port déjà utilisé

**Problème** : Port 3000 or 3001 already in use

**Solution** :
```bash
# Windows - Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacez PID)
taskkill /PID <PID> /F
```

---

## 📚 Prochaines Étapes

1. **Explorez la documentation** : [docs/](./docs/)
2. **Consultez l'architecture** : [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Contribuez** : [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Rejoignez la communauté** : Discord, GitHub Discussions

---

## 💡 Conseils

- Utilisez **Prisma Studio** pour visualiser vos données
- Consultez les **logs du backend** pour déboguer
- Utilisez les **DevTools React** pour le frontend
- Testez les APIs avec **Swagger UI**
- Activez le **hot reload** pour un développement rapide

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou contactez support@footballhub.com

**Bon développement ! 🚀⚽**
