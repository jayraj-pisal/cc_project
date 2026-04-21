# Smart PDF to Digital Form Automation System

## Overview

A full-stack web application that automates converting PDF forms into digital web forms. Users can fill out forms online and the system generates filled PDF documents.

## Architecture

- **Frontend**: React 19 + Vite (port 5000) — deployed to Vercel
- **Backend**: Node.js + Express (port 3001) — deployed to Railway
- **Database**: PostgreSQL

## Project Structure

```
/
├── src/              # React frontend source
│   ├── config.js     # API_BASE URL utility (reads VITE_API_URL env var)
│   ├── main.jsx      # Sets axios.defaults.baseURL from VITE_API_URL
│   ├── pages/        # Login, Register, Dashboard, FillForm, Preview, AdminDashboard, AdminUpload
│   ├── components/   # FormRenderer, Navbar
│   └── styles/       # CSS stylesheets
├── backend/          # Node.js Express API
│   ├── routes/       # auth.js, forms.js, submit.js
│   ├── server.js     # Express server (PORT from env, 0.0.0.0 on Railway)
│   └── db.js         # PostgreSQL connection (pg pool, uses DATABASE_URL)
├── vercel.json       # Vercel SPA routing config
├── Procfile          # Railway process config
├── vite.config.js    # Vite config with proxy to backend (dev only)
└── package.json      # Frontend dependencies
```

## Local Development Workflows

- **Start application**: `npm run dev` — Vite frontend on port 5000 (webview)
- **Backend API**: `node backend/server.js` — Express API on port 3001 (console)

Vite proxies `/api`, `/uploads`, `/filled` to `http://localhost:3001` in dev.

## Database Tables

- `users`: id, email, password (bcrypt), role (Student/Admin), created_at
- `forms`: id, filename, originalname, created_at
- `submissions`: id, user_id, form_id, data (JSON text), filled_pdf, created_at

## Authentication

- JWT-based auth (1h expiry)
- Roles: `Student` and `Admin`
- Admin code: `PICT123` (hardcoded in routes/auth.js)

## Deploying to Railway (Backend)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select this repo and point to root (Railway detects Procfile)
3. Add a **PostgreSQL** service in Railway — it auto-sets `DATABASE_URL`
4. Set these environment variables in Railway:
   - `FRONTEND_URL` = your Vercel URL (e.g. `https://my-app.vercel.app`)
   - `JWT_SECRET` = a long random secret string
5. Copy the Railway backend URL (e.g. `https://my-backend.railway.app`)

> **Note:** Uploaded PDFs are stored in `backend/uploads/` and filled PDFs in `backend/filled/`. On Railway these are ephemeral (lost on redeploy). For production persistence, use Railway Volumes or a cloud storage service.

## Deploying to Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `/` (the repo root)
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add this **Environment Variable**:
   - `VITE_API_URL` = your Railway backend URL (e.g. `https://my-backend.railway.app`)
6. Deploy

## Environment Variables Summary

| Variable | Platform | Value |
|---|---|---|
| `VITE_API_URL` | Vercel | Your Railway backend URL |
| `DATABASE_URL` | Railway | Auto-set by Railway PostgreSQL |
| `FRONTEND_URL` | Railway | Your Vercel frontend URL |
| `JWT_SECRET` | Railway | Random secret string |

## Changes Made from Original

- **MySQL → PostgreSQL**: Replaced `mysql2` with `pg`; queries use `$1, $2...` params
- **API URL**: `src/config.js` + `axios.defaults.baseURL` in main.jsx for Vercel→Railway calls
- **`vercel.json`**: SPA routing so all paths serve `index.html`
- **`Procfile`**: `web: node backend/server.js` for Railway
- **CORS**: Uses `FRONTEND_URL` env var to allow only the Vercel domain
