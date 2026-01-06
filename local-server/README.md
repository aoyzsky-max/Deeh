# Local yt-dlp Server

This is a local server that runs yt-dlp on your machine. Your Vercel-deployed frontend will call this server to download videos.

## Setup

### 1. Install Dependencies

```bash
cd local-server
npm install
```

### 2. Install yt-dlp

Make sure yt-dlp is installed on your system:

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

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

## Exposing to Internet

To make your local server accessible from Vercel, you need to expose it to the internet. Here are options:

### Option 1: ngrok (Easiest - Recommended)

1. Install ngrok: https://ngrok.com/download
2. Run:
   ```bash
   ngrok http 3001
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update your Vercel frontend to use this URL

### Option 2: Cloudflare Tunnel (Free)

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Run:
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```
3. Copy the HTTPS URL provided

### Option 3: localtunnel (Free)

1. Install:
   ```bash
   npm install -g localtunnel
   ```
2. Run:
   ```bash
   lt --port 3001
   ```
3. Copy the HTTPS URL provided

### Option 4: Port Forwarding (Advanced)

1. Configure your router to forward port 3001
2. Use your public IP address
3. **Warning**: Less secure, requires static IP or dynamic DNS

## Update Vercel Frontend

Once you have your public URL (from ngrok, etc.), update your Vercel frontend:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_URL` = `https://your-ngrok-url.ngrok.io` (or your tunnel URL)
3. Update your frontend code to use this environment variable

## Security Notes

- The local server has CORS enabled to allow requests from your Vercel domain
- Consider adding authentication if you want to restrict access
- Keep your ngrok/tunnel URL private
- The server runs on your local machine, so keep it running when you want downloads to work

## Running 24/7

If you want the server running all the time:

**macOS/Linux:**
- Use `pm2`: `npm install -g pm2 && pm2 start server.js`
- Or create a systemd service

**Windows:**
- Use Task Scheduler
- Or run as a service with `node-windows`

## Testing

Test the server locally:

```bash
# Health check
curl http://localhost:3001/health

# Get video info
curl -X POST http://localhost:3001/api/video/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

