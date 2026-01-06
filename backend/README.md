# CosmoVid Backend Service

A simple Express.js API service that runs yt-dlp to get direct video URLs for downloading.

## Features

- ✅ GET `/download?url=<video_url>` - Get direct download URL
- ✅ GET `/info?url=<video_url>` - Get video information
- ✅ GET `/health` - Health check endpoint
- ✅ Supports multiple video platforms (YouTube, TikTok, Instagram, etc.)
- ✅ Configurable quality and format options
- ✅ CORS enabled for frontend integration

## Prerequisites

- Node.js 18+
- yt-dlp installed (handled by Dockerfile)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Install yt-dlp

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
pip3 install yt-dlp
```

**Windows:**
```bash
pip install yt-dlp
```

### 3. Start Server

```bash
npm start
```

Server runs on `http://localhost:3001`

### 4. Test Endpoints

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Get Direct URL:**
```bash
curl "http://localhost:3001/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Get Video Info:**
```bash
curl "http://localhost:3001/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

## API Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "yt-dlp backend service is running",
  "ytdlp": "available"
}
```

### GET /download

Get direct download URL for a video.

**Parameters:**
- `url` (required) - Video URL
- `format` (optional) - `mp4` or `mp3` (default: `mp4`)
- `quality` (optional) - `1080p`, `720p`, `480p`, `360p` (default: `720p`)

**Example:**
```
GET /download?url=https://www.youtube.com/watch?v=VIDEO_ID&format=mp4&quality=1080p
```

**Response:**
```json
{
  "success": true,
  "direct_url": "https://...",
  "format": "mp4",
  "quality": "1080p",
  "original_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### GET /info

Get video information.

**Parameters:**
- `url` (required) - Video URL

**Example:**
```
GET /info?url=https://www.youtube.com/watch?v=VIDEO_ID
```

**Response:**
```json
{
  "success": true,
  "id": "VIDEO_ID",
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 180,
  "platform": "youtube"
}
```

## Deployment to Railway

### Step 1: Push to GitHub

Make sure your backend code is in a GitHub repository.

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Select the **`backend`** directory as the root (or deploy the whole repo and set root directory)

### Step 3: Configure Root Directory (if needed)

If deploying from monorepo:
1. Go to **Settings** → **Build**
2. Set **Root Directory** to `/backend`
3. Railway will auto-detect Dockerfile

### Step 4: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `your-backend.up.railway.app`)

### Step 5: Test Backend

```bash
curl https://your-backend.up.railway.app/health
```

## Connecting from Next.js Frontend

### Option 1: Environment Variable (Recommended)

1. In your Next.js app (Vercel), go to **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend.up.railway.app`
3. Update your frontend API calls:

```javascript
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Get direct URL
const response = await fetch(
  `${backendUrl}/download?url=${encodeURIComponent(videoUrl)}&format=mp4&quality=1080p`
);
const data = await response.json();

if (data.success) {
  // Redirect to direct URL or create download link
  window.location.href = data.direct_url;
}
```

### Option 2: Update API Routes

Update your Next.js API routes to proxy requests to the backend:

```javascript
// app/api/video/download/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  
  const backendUrl = process.env.BACKEND_URL || 'https://your-backend.up.railway.app';
  const response = await fetch(`${backendUrl}/download?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  
  if (data.success) {
    return NextResponse.redirect(data.direct_url);
  }
  
  return NextResponse.json({ error: data.error }, { status: 500 });
}
```

## Environment Variables

- `PORT` - Server port (Railway sets this automatically)
- `NODE_ENV` - Environment (set to `production` in Dockerfile)

## Troubleshooting

### yt-dlp not found

- Check Railway logs to verify yt-dlp installed during build
- Verify Dockerfile includes yt-dlp installation step

### CORS errors

- Backend has CORS enabled by default
- If issues persist, update CORS settings in `server.js`

### Timeout errors

- Some videos take longer to process
- Consider increasing timeout in `server.js` (currently 30 seconds)

### Port issues

- Railway automatically sets `PORT` environment variable
- Server listens on `0.0.0.0` to accept external connections

## Cost

- Railway free tier: $5 credit/month
- This lightweight service uses minimal resources
- Monitor usage in Railway dashboard

## Security Notes

- The service is public by default
- Consider adding rate limiting for production
- Add authentication if needed
- Validate and sanitize input URLs

## License

MIT

