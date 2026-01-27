# FootballHub Deployment Guide

## 🌍 1. GitHub (Source Code)
You need to push your code to GitHub first.
1. Create a repository named `yofoot` on GitHub.
2. Run these commands in your project folder:
```bash
git add .
git commit -m "Ready for deploy"
git branch -M main
git push -u origin main
```

---

## ⚡ 2. Frontend (Vercel)
**URL:** [https://vercel.com](https://vercel.com)

1. **Log in** to Vercel with GitHub.
2. Click **"Add New..."** -> **"Project"**.
3. Import your **`yofoot`** repository.
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (You will get this URL in Step 3)
6. Click **Deploy**.

---

## 🚀 3. Backend (Render)
**URL:** [https://render.com](https://render.com)

1. **Log in** to Render with GitHub.
2. Click **"New +"** -> **"Web Service"**.
3. Select your **`yofoot`** repository.
4. **Configure Service:**
   - **Name:** `footballhub-backend`
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables:**
   - `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your_secure_random_secrect`
   - `STRIPE_SECRET`: `sk_live_...`
   - `CLIENT_URL`: `https://your-vercel-frontend.app`
6. Click **Create Web Service**.
7. **Copy the URL** (e.g., `https://footballhub-backend.onrender.com`) and update your Frontend's `VITE_API_URL` variable in Vercel.

---

## 🧠 4. AI Service (Render - Optional)
1. New **Web Service** on Render.
2. **Root Directory:** `ai-service`
3. **Environment:** Python 3
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Click **Deploy**.

---

## 🗄️ 5. Database (MongoDB Atlas)
**URL:** [https://mongodb.com/atlas](https://mongodb.com/atlas)

1. Create a **Free Cluster**.
2. Create a Database User (username/password).
3. Network Access: Allow Access from Anywhere (`0.0.0.0/0`).
4. **Get Connection String**: `mongodb+srv://<username>:<password>@cluster0...`
5. Use this string in Render's `MONGO_URI`.

---

**✅ Your SaaS is now LIVE worldwide!**
