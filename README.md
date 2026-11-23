# WonderLust

The repo is split into two independently deployable apps:

| Folder      | What it is                                   | Deploy to                                   |
| ----------- | -------------------------------------------- | ------------------------------------------- |
| `backend/`  | Express + MongoDB JSON API (`/api/...`)      | Render Web Service (or Railway, Fly, etc.)  |
| `frontend/` | React + Vite single-page app (static files)  | Vercel, Netlify, or Render Static Site      |

The frontend is static, so it loads instantly and never "sleeps". Only API calls
wait for the backend, and the UI shows a "waking up the server" banner while it boots.

## Local development

```bash
# terminal 1
cd backend
cp .env.example .env   # fill in ATLASDB_URL, SECRET, (Cloudinary keys)
npm install
npm run dev            # http://localhost:8080

# terminal 2
cd frontend
npm install
npm run dev            # http://localhost:5173  (proxies /api to :8080)
```

## API

| Method | Path                                   | Auth |
| ------ | -------------------------------------- | ---- |
| GET    | `/api/health`                          |      |
| GET    | `/api/auth/me`                         |      |
| POST   | `/api/auth/signup` `{username,email,password}` |      |
| POST   | `/api/auth/login` `{username,password}` |      |
| POST   | `/api/auth/logout`                     | ✓    |
| GET    | `/api/listings`                        |      |
| GET    | `/api/listings/:id`                    |      |
| POST   | `/api/listings` (multipart: `title,description,price,location,image`) | ✓ |
| PUT    | `/api/listings/:id` (multipart, `image` optional) | owner |
| DELETE | `/api/listings/:id`                    | owner |
| POST   | `/api/listings/:id/reviews` `{rating,comment}` | ✓ |
| DELETE | `/api/listings/:id/reviews/:reviewId`  | author / listing owner |

## Deploying

### 1. Backend (Render)

- New → Web Service → this repo, **Root Directory: `backend`**
  (or use the included `render.yaml` blueprint)
- Build: `npm install` · Start: `npm start` · Health check path: `/api/health`
- Env vars: `NODE_ENV=production`, `ATLASDB_URL`, `SECRET`, `CLOUD_NAME`,
  `CLOUD_API_KEY`, `CLOUD_API_SECRET`, and `FRONTEND_URL` (your frontend URL)

> Set the Cloudinary keys. The disk on Render's free tier is wiped on every restart,
> so images saved to `uploads/` disappear.

### 2. Frontend (Vercel, recommended)

- New Project → this repo, **Root Directory: `frontend`** (framework: Vite)
- Edit `frontend/vercel.json` and replace `YOUR-BACKEND.onrender.com` with your backend URL
- Leave `VITE_API_URL` unset

Vercel then proxies `/api/*` to the backend, so the login cookie is first-party.
This matters because browsers (Safari especially) block third-party cookies.

**Netlify:** base directory `frontend`, build `npm run build`, publish `dist`.
Edit the URL in `frontend/public/_redirects`.

**Any other static host without proxying:** set `VITE_API_URL=https://your-backend...`
at build time and add the frontend URL to the backend's `FRONTEND_URL`.

### 3. Shorter cold starts

Free Render instances sleep after ~15 minutes of inactivity and take ~30–60s to wake.
The frontend already pings `/api/health` on page load to start the wake-up early.
To avoid the sleep, have a free uptime monitor (UptimeRobot, cron-job.org) hit
`https://YOUR-BACKEND.onrender.com/api/health` every 10 minutes, or move to a paid instance.

## Images (Cloudinary)

Uploads go straight to Cloudinary (folder `CLOUD_FOLDER`, default `wonderlust`) when
`CLOUD_NAME`, `CLOUD_API_KEY` and `CLOUD_API_SECRET` are set. Large photos are scaled down to 1600px on upload.
The frontend requests `f_auto,q_auto` so each browser gets WebP/AVIF. When a listing is deleted
or its image replaced, the old image is removed from Cloudinary.

To move existing listings that still point at local files (`backend/uploads` or the seed
images) onto Cloudinary, run once:

```bash
cd backend
npm run migrate:images -- --dry-run   # preview
npm run migrate:images
```

## Seeding

```bash
cd backend
# set SEED_OWNER_ID in .env to an existing user's _id
npm run seed
```
