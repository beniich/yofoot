# 🧪 Guide de Test Manuel - FootballHub+

## 🚀 Lancement de l'Application

```bash
cd C:\Users\pc gold\.gemini\antigravity\scratch\football-hub
npm run dev
```

L'application sera disponible sur : **http://localhost:5173**

---

## ✅ Pages à Tester

### 1. **Page Members** (`/members`)

**URL**: http://localhost:5173/members

**Tests à effectuer :**
- [ ] La page affiche 6 membres avec avatars
- [ ] La barre de recherche fonctionne (taper "Alex")
- [ ] Les filtres fonctionnent :
  - [ ] Cliquer sur "Elite" → Affiche 3 membres
  - [ ] Cliquer sur "Pro" → Affiche 2 membres
  - [ ] Cliquer sur "Inactive" → Affiche 1 membre
- [ ] Les toggle switches changent le statut actif/inactif
- [ ] Le bouton "+" en haut à droite est visible
- [ ] Les badges de tier (ELITE, PRO, STANDARD) sont affichés
- [ ] Les icônes de vérification (✓) apparaissent pour certains membres

**Éléments visuels à vérifier :**
- Thème gold/charcoal cohérent
- Avatars circulaires avec rings colorés
- Animations au survol des cartes
- Header sticky qui reste en haut lors du scroll

---

### 2. **Page Events** (`/events`)

**URL**: http://localhost:5173/events

**Tests à effectuer :**
- [ ] La page affiche 4 événements avec images
- [ ] La barre de recherche fonctionne (taper "Tournament")
- [ ] Les filtres de catégorie fonctionnent :
  - [ ] "Matches" → Affiche les matchs
  - [ ] "Tournaments" → Affiche les tournois
  - [ ] "Training" → Affiche les entraînements
  - [ ] "Social" → Affiche les événements sociaux
- [ ] Les stats cards affichent :
  - [ ] Total Events: 4
  - [ ] Attendees: Total des participants
  - [ ] Free Events: Nombre d'événements gratuits
- [ ] Les cartes d'événements affichent :
  - [ ] Image de couverture
  - [ ] Badge de catégorie
  - [ ] Date et heure
  - [ ] Lieu
  - [ ] Barre de progression (attendees/capacity)
  - [ ] Prix
  - [ ] Bouton "Get Ticket"
- [ ] Hover sur les cartes → Zoom de l'image

**Éléments visuels à vérifier :**
- Gradient sur les images (du bas vers le haut)
- Badges colorés selon la catégorie
- Barre de progression animée
- Boutons d'action (Share, Favorite)

---

### 3. **Page Tickets** (`/tickets`)

**URL**: http://localhost:5173/tickets

**Tests à effectuer :**
- [ ] Les onglets "Upcoming" et "Past" fonctionnent
- [ ] Onglet "Upcoming" affiche 2 billets
- [ ] Onglet "Past" affiche 1 billet (validé)
- [ ] Cliquer sur "Show QR Code" ouvre une modal
- [ ] La modal affiche :
  - [ ] QR code (placeholder)
  - [ ] Informations de l'événement
  - [ ] Numéro de billet
  - [ ] Boutons "Download" et "Share"
- [ ] Fermer la modal avec le bouton X
- [ ] Les billets validés affichent une coche verte
- [ ] Les informations de siège sont affichées (Section, Row, Seat)

**Éléments visuels à vérifier :**
- Bande de couleur en haut selon le type de billet (VIP, ELITE, STANDARD)
- Images d'événement dans les cartes
- Modal centrée avec fond flou
- Badges de type de billet

---

### 4. **Page Shop** (`/shop`)

**URL**: http://localhost:5173/shop

**Tests à effectuer :**
- [ ] La page affiche 6 produits en grille 2 colonnes
- [ ] La barre de recherche fonctionne (taper "Jersey")
- [ ] Les filtres de catégorie fonctionnent :
  - [ ] "Jerseys" → Affiche les maillots
  - [ ] "Training" → Affiche l'équipement d'entraînement
  - [ ] "Accessories" → Affiche les accessoires
  - [ ] "Memorabilia" → Affiche les objets de collection
- [ ] Cliquer sur le bouton "+" ajoute au panier
- [ ] Le compteur du panier s'incrémente
- [ ] Cliquer sur l'icône panier ouvre le sidebar
- [ ] Dans le panier :
  - [ ] Les produits ajoutés sont affichés
  - [ ] Les boutons +/- modifient la quantité
  - [ ] Le bouton poubelle supprime l'article
  - [ ] Le total est calculé correctement
  - [ ] Le bouton "Proceed to Checkout" est visible
- [ ] Fermer le panier avec le bouton X

**Éléments visuels à vérifier :**
- Badges "Best Seller", réductions, stock limité
- Notes et avis (étoiles)
- Prix barrés pour les réductions
- Zoom de l'image au survol
- Panier coulissant depuis la droite
- Bouton panier flottant avec compteur

---

## 🎨 Tests de Design Global

### **Navigation Bottom Bar**
- [ ] 5 onglets visibles : Home, Events, Tickets, Shop, Profile
- [ ] L'onglet actif est en gold
- [ ] Les icônes changent de taille au clic
- [ ] Point lumineux sous l'onglet actif

### **Header**
- [ ] Logo FootballHub visible
- [ ] Titre en gold gradient
- [ ] Icône de notification avec point rouge
- [ ] Header sticky (reste en haut au scroll)

### **Thème**
- [ ] Fond charcoal (#101622)
- [ ] Accents gold (#D4AF37)
- [ ] Cartes avec bordures blanches semi-transparentes
- [ ] Effets glassmorphism (flou d'arrière-plan)

### **Animations**
- [ ] Transitions fluides entre les pages
- [ ] Hover effects sur les boutons
- [ ] Scale animations sur les clics
- [ ] Fade in des modals

### **Responsive**
- [ ] Scroll vertical fluide
- [ ] Scroll horizontal pour les filtres (sans scrollbar visible)
- [ ] Grilles adaptatives
- [ ] Texte tronqué avec ellipsis

---

## 🐛 Tests de Bugs Potentiels

### **Recherche**
- [ ] Recherche vide → Affiche tous les résultats
- [ ] Recherche sans résultat → Affiche "No ... found"
- [ ] Recherche case-insensitive

### **Filtres**
- [ ] Combiner recherche + filtre fonctionne
- [ ] Retour à "All" réinitialise le filtre

### **Panier**
- [ ] Ajouter le même produit 2 fois → Incrémente la quantité
- [ ] Quantité à 0 → Supprime l'article
- [ ] Panier vide → Affiche "Your cart is empty"

### **Modals**
- [ ] Cliquer en dehors ne ferme pas (seulement le bouton X)
- [ ] Scroll bloqué quand modal ouverte

---

## 📸 Screenshots Attendus

### **Members Page**
- Header avec "Members" et bouton +
- Barre de recherche
- 5 filtres chips
- 2 boutons d'action (Bulk Actions, Export CSV)
- Liste de 6 membres avec avatars et badges

### **Events Page**
- Header avec "Events" et bouton +
- Barre de recherche
- 5 filtres chips
- 3 stats cards (Total, Attendees, Free)
- 4 cartes d'événements avec images

### **Tickets Page**
- Header avec "My Tickets" et bouton scanner
- 2 onglets (Upcoming, Past)
- Cartes de billets avec bande colorée
- Modal QR code (si ouverte)

### **Shop Page**
- Header avec "Official Store" et icône panier
- Barre de recherche
- 5 filtres chips
- Grille 2x3 de produits
- Panier sidebar (si ouvert)

---

## ✅ Checklist Finale

- [ ] Toutes les pages se chargent sans erreur
- [ ] Aucune erreur dans la console du navigateur
- [ ] Les images se chargent correctement (Unsplash)
- [ ] Les icônes Material Symbols s'affichent
- [ ] Les transitions sont fluides (60 FPS)
- [ ] Le thème est cohérent sur toutes les pages
- [ ] La navigation fonctionne dans les deux sens
- [ ] Les données mock sont affichées correctement

---

## 🎯 Critères de Succès

### **Fonctionnalité** (40%)
- ✅ Toutes les fonctionnalités de base fonctionnent
- ✅ Recherche et filtres opérationnels
- ✅ Interactions (clics, toggles, modals) réactives
- ✅ Navigation fluide entre les pages

### **Design** (30%)
- ✅ Thème gold/charcoal cohérent
- ✅ Composants UI harmonieux
- ✅ Animations et transitions fluides
- ✅ Responsive design

### **Expérience Utilisateur** (20%)
- ✅ Feedback visuel immédiat
- ✅ États vides informatifs
- ✅ Messages clairs
- ✅ Navigation intuitive

### **Code Quality** (10%)
- ✅ Composants réutilisables
- ✅ Code organisé et lisible
- ✅ Pas de duplication
- ✅ Bonnes pratiques React

---

## 📝 Rapport de Test

**Date**: _______________
**Testeur**: _______________

**Pages testées**:
- [ ] Members
- [ ] Events
- [ ] Tickets
- [ ] Shop

**Bugs trouvés**: 
_______________________________________
_______________________________________
_______________________________________

**Améliorations suggérées**:
_______________________________________
_______________________________________
_______________________________________

**Note globale**: _____ / 10

---

**Bon test ! 🚀**
