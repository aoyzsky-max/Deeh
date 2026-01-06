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

Deploy to Vercel or any Node.js hosting platform. Note: yt-dlp binary execution may require special configuration on serverless platforms.

## License

MIT License
