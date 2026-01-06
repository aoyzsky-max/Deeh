# Step-by-Step Vercel Deployment Guide

## ⚠️ IMPORTANT WARNING

**This application uses `yt-dlp`, which cannot execute on Vercel's serverless functions.** The deployment will succeed, but the video download functionality **will not work** because Vercel cannot run binary executables.

The app will deploy successfully, but API routes will fail when trying to use yt-dlp.

---

## Prerequisites

1. **GitHub Account** - Your code needs to be in a Git repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Node.js 18+** installed locally (for testing)

---

## Step 1: Prepare Your Code

### 1.1 Ensure all files are committed

```bash
# Check git status
git status

# If not initialized, initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Vercel deployment"
```

### 1.2 Verify your project structure

Make sure these files exist:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`
- ✅ `vercel.json` (already created)
- ✅ All source files in `app/`, `components/`, `lib/`

---

## Step 2: Push to GitHub

### 2.1 Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Name it (e.g., `cosmovid`)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (you already have these)
6. Click **"Create repository"**

### 2.2 Push Your Code

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

#### 3.1 Import Your Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in (or create account)
3. Click **"Add New..."** → **"Project"**
4. Click **"Import Git Repository"**
5. Select your GitHub repository
6. Click **"Import"**

#### 3.2 Configure Project

1. **Project Name**: `cosmovid` (or your preferred name)
2. **Framework Preset**: Should auto-detect "Next.js" ✅
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build` (auto-filled)
5. **Output Directory**: `.next` (auto-filled)
6. **Install Command**: `npm install` (auto-filled)

#### 3.3 Environment Variables

**No environment variables are required** for basic deployment.

However, if you need to set any:
- Click **"Environment Variables"**
- Add any variables (e.g., `NODE_ENV=production`)
- Click **"Save"**

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. You'll see build logs in real-time

### Option B: Deploy via Vercel CLI

#### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 3.2 Login to Vercel

```bash
vercel login
```

#### 3.3 Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No (first time)
# - Project name? cosmovid
# - Directory? ./
# - Override settings? No
```

#### 3.4 Production Deploy

```bash
# Deploy to production
vercel --prod
```

---

## Step 4: Verify Deployment

### 4.1 Check Deployment Status

1. Go to your Vercel dashboard
2. Click on your project
3. Check the **"Deployments"** tab
4. Status should show **"Ready"** ✅

### 4.2 Visit Your Site

1. Click the deployment URL (e.g., `cosmovid.vercel.app`)
2. Your site should load
3. **However**, video download features will fail (yt-dlp limitation)

### 4.3 Test the Application

1. Try pasting a video URL
2. Click "Detect & Load"
3. **Expected**: API will fail with "yt-dlp not found" error

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain

1. In Vercel dashboard, go to **"Settings"** → **"Domains"**
2. Enter your domain (e.g., `cosmovid.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

---

## Step 6: Monitor and Update

### 6.1 Automatic Deployments

- Every push to `main` branch = automatic production deployment
- Pull requests = preview deployments

### 6.2 View Logs

1. Go to **"Deployments"** tab
2. Click on a deployment
3. Click **"Functions"** tab to see API route logs
4. Check for errors related to yt-dlp

### 6.3 Update Your App

```bash
# Make changes
# Commit and push
git add .
git commit -m "Update app"
git push origin main

# Vercel automatically deploys
```

---

## Troubleshooting

### Build Fails

**Error**: Build timeout
- **Solution**: Check `vercel.json` has `maxDuration: 60` (already configured)

**Error**: Module not found
- **Solution**: Run `npm install` locally to verify dependencies

**Error**: TypeScript errors
- **Solution**: Run `npm run build` locally first to catch errors

### API Routes Fail

**Error**: "yt-dlp not found"
- **Expected**: This is the limitation - yt-dlp cannot run on Vercel
- **Solution**: Use alternative hosting (Railway, Render, etc.)

### Deployment Succeeds but Site Doesn't Load

1. Check build logs in Vercel dashboard
2. Verify all files are committed to Git
3. Check browser console for errors
4. Verify `next.config.js` is correct

---

## Next Steps (To Make It Work)

Since Vercel won't work with yt-dlp, consider:

1. **Railway Deployment** (Recommended)
   - Supports Docker containers
   - Can install yt-dlp
   - See Railway deployment guide

2. **Hybrid Approach**
   - Frontend on Vercel
   - Backend API on Railway/Render
   - Update API routes to call external service

3. **Alternative API Service**
   - Use a third-party video extraction API
   - Refactor code to use API instead of yt-dlp

---

## Summary

✅ **What Works:**
- Next.js app deploys successfully
- Frontend UI loads correctly
- Static pages work

❌ **What Doesn't Work:**
- Video download API routes (yt-dlp limitation)
- Video info API routes (yt-dlp limitation)

**The deployment process will succeed, but the core functionality will not work on Vercel.**

