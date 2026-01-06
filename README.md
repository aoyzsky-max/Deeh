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

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Deploy automatically

**Note**: Video download functionality requires yt-dlp, which cannot run on Vercel's serverless functions. The API routes will need to be configured to work with an external service or alternative hosting solution.

## License

MIT License
