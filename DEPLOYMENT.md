# Council.host Deployment Guide

This guide will walk you through deploying Council.host to production using Vercel (frontend) and Railway (backend + database).

## Prerequisites

- Node.js 18+ installed locally
- Git repository set up
- X (Twitter) Developer account with API credentials
- Domain: Council.host (already purchased)

## Part 1: Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Install Railway CLI (optional but recommended):
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Backend to Railway

1. Create a new project in Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your councilhost repository
4. Railway will detect your backend automatically

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provision a PostgreSQL database and set `DATABASE_URL`

### Step 4: Run Database Migration

1. In Railway dashboard, go to your PostgreSQL service
2. Click "Connect" and copy the connection string
3. Run locally or in Railway shell:
```bash
psql <DATABASE_URL> -f backend/schema.sql
```

Or use Railway's built-in PostgreSQL client to paste the SQL from `backend/schema.sql`.

### Step 5: Configure Environment Variables

In Railway dashboard, go to your backend service and add these variables:

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://council.host
DATABASE_URL=(automatically set by Railway)
SESSION_SECRET=(generate a random 32-character string)
TWITTER_CONSUMER_KEY=(your X API key)
TWITTER_CONSUMER_SECRET=(your X API secret)
TWITTER_CALLBACK_URL=https://your-backend-url.railway.app/auth/twitter/callback
```

To generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Configure Build Settings

In Railway dashboard:
1. Go to Settings → Build
2. Set Root Directory: `backend`
3. Set Install Command: `npm install`
4. Set Build Command: `npm run build`
5. Set Start Command: `npm start`

### Step 7: Deploy

1. Click "Deploy" or push to your GitHub repository
2. Railway will build and deploy automatically
3. Note your backend URL (something like `councilhost-backend.railway.app`)

## Part 2: X (Twitter) API Configuration

### Step 1: Update X Developer Portal

1. Go to [developer.twitter.com](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. Go to "Settings" → "User authentication settings"
4. Configure OAuth 1.0a:
   - App permissions: Read
   - Type of App: Web App
   - Callback URL: `https://your-backend-url.railway.app/auth/twitter/callback`
   - Website URL: `https://council.host`
5. Save changes

### Step 2: Update Railway Environment Variables

Update `TWITTER_CALLBACK_URL` in Railway with the correct URL.

## Part 3: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Deploy Frontend to Vercel

1. Click "Add New Project"
2. Import your councilhost repository
3. Vercel will detect Vite automatically

### Step 3: Configure Build Settings

Vercel should auto-detect these, but verify:
- Framework Preset: Vite
- Root Directory: `./` (root)
- Build Command: `npm run build`
- Output Directory: `dist`

### Step 4: Configure Environment Variables

In Vercel dashboard, add this environment variable:

```
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Note your deployment URL (something like `councilhost.vercel.app`)

## Part 4: Domain Configuration

### Step 1: Configure Vercel Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain: `council.host`
4. Add www subdomain: `www.council.host`
5. Vercel will provide DNS records

### Step 2: Update DNS Settings

1. Go to your domain registrar (where you bought council.host)
2. Update DNS records as instructed by Vercel:
   - Add A record for `@` pointing to Vercel IP
   - Add CNAME for `www` pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (can take up to 48 hours, usually much faster)

### Step 3: Update Environment Variables

After domain is configured, update these in Railway:
```
FRONTEND_URL=https://council.host
```

And update in X Developer Portal:
- Website URL: `https://council.host`

## Part 5: Testing

1. Visit `https://council.host`
2. Click "Sign in with X"
3. Authorize the app
4. Create a test council
5. Verify all features work:
   - Council creation
   - Invitations
   - Proposals
   - Opinions
   - Resolutions

## Part 6: Post-Deployment

### Monitor Backend

- Check Railway logs for errors
- Monitor PostgreSQL database usage
- Set up alerts in Railway dashboard

### Monitor Frontend

- Check Vercel logs for errors
- Monitor Vercel Analytics (free tier available)
- Set up error tracking (optional: Sentry)

### Database Backups

Railway provides automatic backups, but you can also:
1. Set up additional backups using `pg_dump`
2. Configure backup schedule in Railway dashboard

## Troubleshooting

### OAuth Redirect Issues

If OAuth fails:
1. Verify `TWITTER_CALLBACK_URL` matches exactly in Railway and X Developer Portal
2. Check that `FRONTEND_URL` is correct in Railway
3. Ensure your domain has HTTPS enabled

### Database Connection Issues

If backend can't connect to database:
1. Verify `DATABASE_URL` is set in Railway
2. Check PostgreSQL service is running
3. Review Railway logs for connection errors

### CORS Errors

If frontend can't reach backend:
1. Verify `FRONTEND_URL` in Railway matches your domain
2. Check `VITE_API_URL` in Vercel matches your Railway backend URL
3. Ensure Railway backend service is deployed and running

### Session Issues

If users can't stay logged in:
1. Check `SESSION_SECRET` is set in Railway
2. Verify cookie settings (secure, sameSite) in backend
3. Ensure both frontend and backend are on HTTPS

## Estimated Costs

- **Railway**: $5-20/month (backend + PostgreSQL, depends on usage)
- **Vercel**: Free tier should be sufficient (generous limits)
- **X API**: Free (with approved developer account)
- **Domain**: Varies by registrar

## Security Checklist

- [ ] `SESSION_SECRET` is strong and random
- [ ] X API credentials are secure and not exposed
- [ ] HTTPS is enabled on both frontend and backend
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Database has secure password
- [ ] Environment variables are not in source code

## Need Help?

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- X API: [developer.twitter.com/en/docs](https://developer.twitter.com/en/docs)

---

## Quick Commands Reference

### Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

### Railway CLI

```bash
# Link to project
railway link

# View logs
railway logs

# Run command in Railway
railway run npm run migrate

# Open project in dashboard
railway open
```

### Vercel CLI

```bash
# Install globally
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```
