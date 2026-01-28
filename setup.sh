#!/bin/bash

# 🚀 FootballHub - Script d'Installation Automatique
# Ce script configure l'environnement complet en une seule commande

set -e

echo "
╔══════════════════════════════════════════════╗
║  ⚽ FootballHub - Installation Automatique  ║
╚══════════════════════════════════════════════╝
"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier les prérequis
echo -e "${BLUE}📋 Vérification des prérequis...${NC}"

command -v node >/dev/null 2>&1 || { echo "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 n'est pas installé."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker n'est pas installé (optionnel mais recommandé)"; }

echo -e "${GREEN}✅ Prérequis vérifiés${NC}\n"

# Fonction pour demander une confirmation
confirm() {
    read -p "$1 (o/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Oo]$ ]]
}

# Option 1: Installation avec Docker
if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
    if confirm "💻 Voulez-vous installer avec Docker (recommandé)?"; then
        echo -e "\n${BLUE}🐳 Démarrage des services Docker...${NC}"
        docker-compose up -d
        
        echo -e "\n${GREEN}✅ Services Docker démarrés !${NC}"
        echo -e "
📍 Services accessibles:
   - Frontend: http://localhost:5173
   - Backend:  http://localhost:5000
   - AI Service: http://localhost:8000
   - MongoDB:  localhost:27017
   - Redis:    localhost:6379
"
        exit 0
    fi
fi

# Option 2: Installation manuelle
echo -e "\n${BLUE}📦 Installation manuelle...${NC}\n"

# Backend
echo -e "${BLUE}1️⃣  Installation du Backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  N'oubliez pas de configurer .env avec vos clés API${NC}"
fi

echo "Installation des dépendances Node.js..."
npm install

echo -e "${GREEN}✅ Backend configuré${NC}\n"
cd ..

# Frontend
echo -e "${BLUE}2️⃣  Installation du Frontend...${NC}"
cd frontend

if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
fi

echo "Installation des dépendances React..."
npm install

echo -e "${GREEN}✅ Frontend configuré${NC}\n"
cd ..

# AI Service
echo -e "${BLUE}3️⃣  Installation du Service IA...${NC}"
cd ai-service

if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel Python..."
    python3 -m venv venv
fi

echo "Activation de l'environnement virtuel..."
source venv/bin/activate

if [ -f "requirements.txt" ]; then
    echo "Installation des dépendances Python..."
    pip install -r requirements.txt
else
    echo "Création de requirements.txt..."
    cat > requirements.txt << EOF
fastapi==0.108.0
uvicorn[standard]==0.27.0
scikit-learn==1.4.0
pandas==2.1.4
numpy==1.26.3
joblib==1.3.2
python-dotenv==1.0.0
pydantic==2.5.3
EOF
    pip install -r requirements.txt
fi

echo -e "${GREEN}✅ Service IA configuré${NC}\n"
deactivate
cd ..

# Vérifier MongoDB et Redis
echo -e "${BLUE}4️⃣  Vérification de MongoDB et Redis...${NC}"

if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB n'est pas en cours d'exécution.${NC}"
    echo "   Démarrez MongoDB ou utilisez MongoDB Atlas (cloud)"
    echo "   MongoDB Atlas: https://cloud.mongodb.com"
fi

if ! pgrep -x "redis-server" > /dev/null; then
    echo -e "${YELLOW}⚠️  Redis n'est pas en cours d'exécution.${NC}"
    echo "   Installez Redis: https://redis.io/download"
fi

echo ""

# Créer des scripts de démarrage
echo -e "${BLUE}5️⃣  Création des scripts de démarrage...${NC}"

# Script pour démarrer le backend
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd server
npm run dev
EOF
chmod +x start-backend.sh

# Script pour démarrer le frontend
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF
chmod +x start-frontend.sh

# Script pour démarrer le service IA
cat > start-ai.sh << 'EOF'
#!/bin/bash
cd ai-service
source venv/bin/activate
python main.py
EOF
chmod +x start-ai.sh

# Script pour tout démarrer (avec tmux ou screen si disponible)
cat > start-all.sh << 'EOF'
#!/bin/bash

if command -v tmux >/dev/null 2>&1; then
    echo "🚀 Démarrage de tous les services avec tmux..."
    tmux new-session -d -s footballhub-backend './start-backend.sh'
    tmux new-session -d -s footballhub-frontend './start-frontend.sh'
    tmux new-session -d -s footballhub-ai './start-ai.sh'
    echo "✅ Services démarrés dans des sessions tmux"
    echo "   - backend:  tmux attach -t footballhub-backend"
    echo "   - frontend: tmux attach -t footballhub-frontend"
    echo "   - ai:       tmux attach -t footballhub-ai"
else
    echo "🚀 Démarrez chaque service dans un terminal séparé:"
    echo "   Terminal 1: ./start-backend.sh"
    echo "   Terminal 2: ./start-frontend.sh"
    echo "   Terminal 3: ./start-ai.sh"
fi
EOF
chmod +x start-all.sh

echo -e "${GREEN}✅ Scripts créés${NC}\n"

# Résumé final
echo -e "
╔════════════════════════════════════════════════╗
║  ✅ Installation Terminée !                    ║
╚════════════════════════════════════════════════╝

📝 Prochaines étapes:

1️⃣  Configurer les variables d'environnement:
   ${BLUE}nano server/.env${NC}
   - Ajouter votre clé API-Football
   - Configurer MongoDB URI
   - Ajouter Stripe keys (optionnel)

2️⃣  Démarrer les services:
   ${BLUE}./start-all.sh${NC}
   
   Ou manuellement dans 3 terminals séparés:
   ${BLUE}./start-backend.sh${NC}   # Terminal 1
   ${BLUE}./start-frontend.sh${NC}  # Terminal 2
   ${BLUE}./start-ai.sh${NC}        # Terminal 3

3️⃣  Accéder à l'application:
   Frontend: ${GREEN}http://localhost:5173${NC}
   Backend:  ${GREEN}http://localhost:5000${NC}
   AI API:   ${GREEN}http://localhost:8000${NC}

📚 Documentation:
   - README.md - Documentation complète
   - QUICKSTART.md - Guide de démarrage rapide

🆘 Besoin d'aide?
   Consultez les guides Word fournis pour l'implémentation complète

${GREEN}Bon développement ! ⚽🚀${NC}
"
