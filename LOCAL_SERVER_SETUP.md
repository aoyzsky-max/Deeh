# Local Server Setup Guide

This guide shows you how to run yt-dlp locally and connect it to your Vercel-deployed frontend.

## Why This Approach?

- ✅ Keep yt-dlp private (runs on your machine)
- ✅ Frontend stays on Vercel (fast, free)
- ✅ No need for Railway or other hosting
- ✅ Full yt-dlp functionality

## Step 1: Set Up Local Server

### 1.1 Install Dependencies

```bash
cd local-server
npm install
```

### 1.2 Install yt-dlp on Your Machine

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
pip3 install yt-dlp
# or
sudo apt install yt-dlp
```

**Windows:**
```bash
pip install yt-dlp
```

### 1.3 Start the Server

```bash
npm start
```

You should see:
```
🚀 Local yt-dlp server running on http://localhost:3001
📡 Ready to receive requests from your Vercel frontend
```

## Step 2: Expose Local Server to Internet

Your local server needs to be accessible from the internet. Use one of these methods:

### Option A: ngrok (Recommended - Easiest)

1. **Sign up** at [ngrok.com](https://ngrok.com) (free account)
2. **Download** ngrok for your OS
3. **Authenticate**:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```
4. **Start tunnel**:
   ```bash
   ngrok http 3001
   ```
5. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

**Note**: Free ngrok URLs change each time. For a permanent URL, upgrade to paid plan.

### Option B: Cloudflare Tunnel (Free, Permanent)

1. **Install cloudflared**:
   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared
   
   # Linux
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
   chmod +x cloudflared-linux-amd64
   sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
   ```

2. **Run tunnel**:
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```
3. **Copy the HTTPS URL** provided

### Option C: localtunnel (Free, Simple)

1. **Install**:
   ```bash
   npm install -g localtunnel
   ```
2. **Run**:
   ```bash
   lt --port 3001
   ```
3. **Copy the HTTPS URL** provided

## Step 3: Update Vercel Frontend

### 3.1 Add Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your tunnel URL (e.g., `https://abc123.ngrok-free.app`)
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### 3.2 Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **Redeploy**
3. Or push a new commit to trigger redeploy

## Step 4: Test

1. **Keep your local server running** (`npm start` in `local-server` folder)
2. **Keep your tunnel running** (ngrok/cloudflared/localtunnel)
3. **Visit your Vercel site**
4. **Try downloading a video** - it should work!

## Running 24/7

If you want the server running all the time:

### macOS/Linux with PM2

```bash
# Install PM2
npm install -g pm2

# Start server
cd local-server
pm2 start server.js --name cosmovid-server

# Make it start on boot
pm2 startup
pm2 save
```

### Windows

1. Use **Task Scheduler** to run `node server.js` on startup
2. Or use **NSSM** (Non-Sucking Service Manager) to run as Windows service

## Security Considerations

1. **CORS**: The server allows requests from any origin. For production:
   - Update `server.js` to restrict CORS to your Vercel domain
   - Add authentication if needed

2. **Rate Limiting**: Consider adding rate limiting to prevent abuse

3. **Keep Tunnel URL Private**: Don't share your ngrok/tunnel URL publicly

## Troubleshooting

### Server Not Starting

- Check if port 3001 is already in use
- Verify yt-dlp is installed: `yt-dlp --version`
- Check Node.js is installed: `node --version`

### Tunnel Not Working

- Ensure local server is running first
- Check firewall isn't blocking connections
- Try a different tunnel service

### Vercel Can't Connect

- Verify environment variable is set correctly
- Check tunnel URL is accessible (visit it in browser)
- Ensure tunnel is still running
- Check CORS settings in server.js

### Downloads Fail

- Check local server logs for errors
- Verify yt-dlp is working: test with a YouTube URL directly
- Check tunnel is still active (they can timeout)

## Alternative: Use ngrok with Fixed Domain

For a permanent URL with ngrok:

1. **Upgrade to ngrok paid plan** ($8/month)
2. **Reserve a domain** in ngrok dashboard
3. **Use reserved domain**:
   ```bash
   ngrok http 3001 --domain=your-domain.ngrok-free.app
   ```

## Summary

1. ✅ Run local server: `cd local-server && npm start`
2. ✅ Expose with tunnel: `ngrok http 3001` (or cloudflared/localtunnel)
3. ✅ Add `NEXT_PUBLIC_API_URL` to Vercel environment variables
4. ✅ Redeploy Vercel
5. ✅ Keep both running when you want downloads to work

Your Vercel frontend will now call your local server for video downloads! 🚀

