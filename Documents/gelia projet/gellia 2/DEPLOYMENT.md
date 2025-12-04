Deployment guide
================

This repository contains two GitHub Actions workflows to automate deployment:

- `.github/workflows/backend-build-push.yml` — builds the backend Docker image and pushes it to GitHub Container Registry (GHCR) when pushing to `main`.
- `.github/workflows/frontend-vercel-deploy.yml` — deploys the Next.js frontend to Vercel when pushing to `main`.

Required repository secrets (set in GitHub Settings → Secrets → Actions):

- `VERCEL_TOKEN` — Personal token from Vercel used by the deploy action.
- `VERCEL_ORG_ID` — Your Vercel organization ID.
- `VERCEL_PROJECT_ID` — The Vercel project ID for this repository.
- (optional) `GCP_SA_KEY` — JSON service account key to deploy to Google Cloud Run (if you later add a Cloud Run deploy step).
- (optional) `RENDER_API_KEY` — API key to deploy to Render (if you prefer Render instead of Cloud Run).

Notes:

- The backend workflow pushes built images to GHCR at `ghcr.io/<OWNER>/erp-sa:latest` and `ghcr.io/<OWNER>/erp-sa:<commit_sha>`.
- Pushing images to GHCR uses the repository `GITHUB_TOKEN` (no additional secret needed by default). If you change registry, update the workflow.
- The Vercel action requires `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` to be set as repository secrets.

Manual deploy hints
-------------------

Frontend (Vercel):

1. Connect the GitHub repository to Vercel via the Vercel dashboard — this will handle automatic deployments when you push.
2. Alternatively, use the Vercel CLI locally:

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Backend (Docker / GHCR):

Build and push locally:

```powershell
docker build -t ghcr.io/<OWNER>/erp-sa:latest .
docker tag ghcr.io/<OWNER>/erp-sa:latest ghcr.io/<OWNER>/erp-sa:<sha>
docker push ghcr.io/<OWNER>/erp-sa:latest
docker push ghcr.io/<OWNER>/erp-sa:<sha>
```

Deploy to Cloud Run (example):

```powershell
gcloud auth activate-service-account --key-file=path/to/key.json
gcloud run deploy erp-sa --image=ghcr.io/<OWNER>/erp-sa:latest --region=us-central1 --platform=managed --allow-unauthenticated
```

If you want me to add a Cloud Run / Render deployment step into the workflow, tell me which provider to use and I'll update the workflow and list the specific secrets you must add.
