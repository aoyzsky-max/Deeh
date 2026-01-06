# CosmoVid

A modern, user-friendly web application for downloading videos from popular social media platforms.

## Features

- 🎥 Multi-Platform Support: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit
- 🎨 Modern UI with dark mode support
- ⚡ Fast & Simple: Just paste a URL and download
- 🔒 Privacy-Focused: No server storage
- 📱 Mobile-Responsive

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- yt-dlp

## Getting Started

### Prerequisites

- Node.js 18+
- yt-dlp installed on your system

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Copy a video URL from any supported platform
2. Paste it in the input field
3. Click "Detect & Load"
4. Choose quality and download

## Deployment

### ⚠️ Important: Vercel Limitation

**This application uses `yt-dlp`, which cannot run on Vercel's serverless functions.** Vercel's serverless environment does not support executing binary executables like `yt-dlp`.

### Deployment Options

1. **Alternative Hosting Platforms** (Recommended):
   - **Railway** - Supports Docker containers with yt-dlp
   - **Render** - Supports Docker containers
   - **Fly.io** - Supports Docker containers
   - **DigitalOcean App Platform** - Supports Docker containers
   - **VPS** (DigitalOcean, AWS EC2, etc.) - Full control

2. **Hybrid Approach**:
   - Deploy Next.js frontend to Vercel
   - Deploy a separate backend API service (with yt-dlp) to a platform that supports binaries
   - Update API routes to call the external backend service

3. **For Vercel Deployment** (Limited Functionality):
   - The code attempts to redirect to direct video URLs when `process.env.VERCEL` is detected
   - However, this still requires yt-dlp to be available, which won't work on Vercel
   - You would need to refactor to use a third-party API service instead

### Recommended: Railway Deployment

Railway is the easiest option for this app:

1. Create a `Dockerfile` in your project root
2. Push to GitHub
3. Connect Railway to your GitHub repo
4. Railway will automatically detect and deploy

See Railway's documentation for Docker deployment.

## License

MIT License
