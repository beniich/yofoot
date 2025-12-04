# Configuration Cloudflare Pages - Variables d'Environnement

## Variables à Configurer dans Cloudflare Dashboard

Allez dans **Cloudflare Pages** → Votre projet → **Settings** → **Environment variables**

Ajoutez ces variables :

```bash
VITE_SUPABASE_PROJECT_ID=wukfzyooibeiwawwkmka
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1a2Z6eW9vaWJlaXdhd3drbWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDM2MTMsImV4cCI6MjA4MDAxOTYxM30.y0bZXNO1oSuiiLfKKws5oJUaNRDGSfblbTV7yai9dts
VITE_SUPABASE_URL=https://wukfzyooibeiwawwkmka.supabase.co
VITE_API_URL=https://cloudindustrie.com/api
```

## Configuration du Build

| Paramètre | Valeur |
|-----------|--------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Framework preset** | Vite |

## Note Importante

⚠️ **VITE_API_URL** doit pointer vers votre backend Node.js déployé sur cPanel.

Une fois votre backend configuré sur cPanel avec un sous-domaine (ex: api.cloudindustrie.com), mettez à jour cette variable.
