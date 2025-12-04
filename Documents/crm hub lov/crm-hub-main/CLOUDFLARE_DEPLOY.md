# Cloudflare Pages Deployment Configuration

## Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

## Environment Variables (à configurer dans Cloudflare Dashboard)

```
VITE_API_URL=https://votre-backend-api.com/api
VITE_SUPABASE_URL=votre_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=votre_supabase_key
```

## Déploiement

### Via Cloudflare Dashboard (Recommandé)

1. Connectez-vous à [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Allez dans **Pages** → **Create a project**
3. Connectez votre repository GitHub : `beniich/infomrig`
4. Configurez le build :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `/`
5. Ajoutez les variables d'environnement
6. Cliquez sur **Save and Deploy**

### Via Wrangler CLI

```bash
# Build l'application
npm run build

# Déployer sur Cloudflare Pages
npx wrangler pages deploy dist --project-name=crm-hub
```

## Notes Importantes

> [!WARNING]
> **Backend séparé requis** : Cette application frontend nécessite un backend API séparé. Le backend Node.js/Express créé dans le dossier `backend/` doit être déployé sur un serveur Node.js (pas Cloudflare Pages).

### Options de déploiement du backend :

1. **Heroku** (gratuit pour commencer)
2. **Railway** (facile à déployer)
3. **DigitalOcean App Platform**
4. **AWS EC2** ou **Google Cloud Run**
5. **Votre propre serveur VPS**

Une fois le backend déployé, mettez à jour `VITE_API_URL` avec l'URL de votre backend.
