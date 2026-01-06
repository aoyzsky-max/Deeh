# Railway Deployment Guide

Complete guide to deploy CosmoVid to Railway with full yt-dlp support.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a Git repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app) (free tier available)
3. **Dockerfile** - Already created ✅
4. **.dockerignore** - Already created ✅

---

## Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
# Add Docker files
git add Dockerfile .dockerignore
git commit -m "Add Docker configuration for Railway deployment"
git push origin main
```

---

## Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended for easy integration)
4. Authorize Railway to access your GitHub repositories

---

## Step 3: Deploy Your Project

### 3.1 Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository (e.g., `Deeh` or your repo name)
4. Click **"Deploy Now"**

### 3.2 Railway Auto-Detection

Railway will automatically:
- ✅ Detect Dockerfile
- ✅ Start building Docker image
- ✅ Install yt-dlp during build
- ✅ Build Next.js application
- ✅ Deploy your app

**Build time**: Usually 5-10 minutes (first time)

---

## Step 4: Configure Settings (Optional)

Railway usually auto-detects everything, but verify:

### 4.1 Build Settings

1. Go to your project → **Settings** → **Build**
2. Verify:
   - **Build Command**: (empty - Docker handles it)
   - **Start Command**: (empty - Docker CMD handles it)
   - **Root Directory**: `/` (root)

### 4.2 Environment Variables

Railway automatically sets:
- `PORT` - Railway sets this automatically
- `NODE_ENV=production` - Set in Dockerfile

**Add custom variables if needed:**
1. Go to **Variables** tab
2. Add any custom environment variables
3. Railway will automatically redeploy

---

## Step 5: Get Your Domain

### 5.1 Generate Railway Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Railway provides a free `.railway.app` domain
4. Copy the URL (e.g., `cosmovid-production.up.railway.app`)

### 5.2 Custom Domain (Optional)

1. In **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Railway will show DNS records to add:
   - **Type**: CNAME
   - **Name**: @ (or yourdomain.com)
   - **Value**: [Railway-provided-value].railway.app
5. Add the CNAME record at your domain registrar
6. Wait for DNS propagation (15-60 minutes)
7. Railway automatically provisions SSL certificate

---

## Step 6: Test Your Deployment

### 6.1 Visit Your Site

1. Open your Railway URL in browser
2. Your app should load!

### 6.2 Test Video Download

1. Paste a video URL (YouTube, TikTok, etc.)
2. Click "Detect & Load"
3. Click download
4. **It should work!** yt-dlp is installed and ready

### 6.3 Check Logs

1. Go to **Deployments** tab
2. Click on latest deployment
3. View **Logs** to see:
   - Build process
   - yt-dlp installation
   - App startup
   - Any errors

---

## Step 7: Monitor Usage

### 7.1 Check Resource Usage

1. Go to **Metrics** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic

### 7.2 Cost Tracking

- Railway free tier: **$5 credit/month**
- Check usage in **Settings** → **Usage**
- Video processing uses resources, so monitor usage

---

## Troubleshooting

### Build Fails

**Error**: Docker build timeout
- **Solution**: Railway free tier has build time limits. Check logs for specific error.

**Error**: yt-dlp installation fails
- **Solution**: Check Dockerfile includes pip install step. Verify logs show yt-dlp installation.

**Error**: npm install fails
- **Solution**: Check `package.json` has all dependencies. Verify Node.js version in Dockerfile.

### App Crashes

**Error**: Port binding issue
- **Solution**: Railway sets `PORT` automatically. Your app uses `process.env.PORT || 3000` ✅

**Error**: Memory limit exceeded
- **Solution**: Video processing uses memory. Railway free tier has limits. Consider upgrading.

### yt-dlp Not Found

**Error**: "yt-dlp not found"
- **Solution**: 
  1. Check Railway logs - verify yt-dlp installed during build
  2. Check logs show: `yt-dlp --version` succeeded
  3. The `getYtDlpPath()` function should find it in PATH

### Video Downloads Fail

**Error**: Downloads timeout
- **Solution**: 
  1. Check Railway logs for yt-dlp errors
  2. Some videos may be region-locked or private
  3. Check network connectivity in logs

### Slow Performance

- Railway free tier has resource limits
- Video processing is resource-intensive
- Consider upgrading to paid plan for better performance

---

## Railway vs Vercel

| Feature | Vercel | Railway |
|---------|--------|---------|
| yt-dlp Support | ❌ No | ✅ Yes |
| Docker Support | ❌ No | ✅ Yes |
| Free Tier | ✅ Generous | ✅ $5/month credit |
| Custom Domain | ✅ Free | ✅ Free |
| SSL Certificate | ✅ Auto | ✅ Auto |
| Best For | Frontend only | Full-stack with binaries |

---

## Cost Breakdown

### Railway Free Tier
- **$5 credit/month**
- Usually enough for testing and light usage
- Video processing uses resources quickly

### Railway Paid Plans
- **Starter**: $5/month + usage
- **Developer**: $20/month + usage
- **Team**: Custom pricing

**Note**: Monitor usage in Railway dashboard. Video downloads consume resources.

---

## Best Practices

### 1. Monitor Usage
- Check Railway dashboard regularly
- Set up usage alerts if needed
- Upgrade plan if approaching limits

### 2. Optimize Builds
- Use `.dockerignore` to exclude unnecessary files ✅
- Keep Dockerfile efficient ✅
- Cache dependencies when possible

### 3. Error Handling
- Check Railway logs regularly
- Set up error monitoring
- Handle edge cases in code

### 4. Security
- Keep dependencies updated
- Use environment variables for secrets
- Review Railway security settings

---

## Next Steps

1. ✅ Dockerfile created
2. ✅ .dockerignore created
3. ✅ Push to GitHub
4. ✅ Deploy to Railway
5. ✅ Test video downloads
6. ✅ Add custom domain (optional)
7. ✅ Monitor usage

---

## Summary

Your app is now deployed on Railway with full yt-dlp support! 🚀

- ✅ yt-dlp installed in Docker container
- ✅ Next.js app built and running
- ✅ Public URL provided
- ✅ SSL certificate automatic
- ✅ Ready for production

**Your video download website is live and working!**

---

## Need Help?

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Check Railway logs for specific errors
- Verify Dockerfile syntax
- Test locally with Docker first (optional)

