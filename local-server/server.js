const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to get yt-dlp path
async function getYtDlpPath() {
  // Check if yt-dlp is in the project directory
  const projectPath = path.join(__dirname, 'yt-dlp');
  const projectPathExe = path.join(__dirname, 'yt-dlp.exe');
  
  if (fs.existsSync(projectPath)) {
    return projectPath;
  }
  if (fs.existsSync(projectPathExe)) {
    return projectPathExe;
  }

  // Check system PATH
  try {
    await execAsync('which yt-dlp');
    return 'yt-dlp';
  } catch {
    try {
      await execAsync('which yt-dlp.exe');
      return 'yt-dlp.exe';
    } catch {
      throw new Error('yt-dlp not found. Please install yt-dlp.');
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Local yt-dlp server is running' });
});

// Get video info
app.post('/api/video/info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const ytdlpPath = await getYtDlpPath();
    const infoCommand = `"${ytdlpPath}" --dump-json --no-warnings --no-playlist --skip-download "${url}"`;
    
    const { stdout } = await execAsync(infoCommand, {
      timeout: 20000,
      maxBuffer: 5 * 1024 * 1024,
    });

    const videoData = JSON.parse(stdout);
    
    const videoInfo = {
      id: videoData.id || videoData.display_id || 'unknown',
      title: videoData.title || 'Untitled',
      thumbnail: videoData.thumbnail || videoData.thumbnails?.[0]?.url || '',
      duration: videoData.duration || 0,
      filesize: videoData.filesize || videoData.filesize_approx || undefined,
      formats: videoData.formats || [],
      platform: videoData.extractor || 'unknown',
    };

    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch video information' });
  }
});

// Download video
app.get('/api/video/download', async (req, res) => {
  try {
    const { url, format = 'mp4', quality = '' } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const ytdlpPath = await getYtDlpPath();
    const isAudioOnly = format === 'mp3';
    const fileExtension = isAudioOnly ? 'mp3' : 'mp4';
    const contentType = isAudioOnly ? 'audio/mpeg' : 'video/mp4';

    // Build format selector
    let formatSelector = '';
    if (isAudioOnly) {
      formatSelector = 'bestaudio/best';
    } else {
      switch (quality) {
        case '1080p':
          formatSelector = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
          break;
        case '720p':
          formatSelector = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
          break;
        case '480p':
          formatSelector = 'bestvideo[height<=480]+bestaudio/best[height<=480]';
          break;
        case '360p':
          formatSelector = 'bestvideo[height<=360]+bestaudio/best[height<=360]';
          break;
        default:
          formatSelector = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
      }
    }

    const args = [];
    
    if (isAudioOnly) {
      args.push('-f', formatSelector);
      args.push('--extract-audio');
      args.push('--audio-format', 'mp3');
      let audioQuality = '0';
      if (quality === '192') audioQuality = '5';
      else if (quality === '128') audioQuality = '9';
      args.push('--audio-quality', audioQuality);
      args.push('--no-playlist');
    } else {
      args.push('-f', formatSelector);
      args.push('--merge-output-format', 'mp4');
      args.push('--no-playlist');
    }
    
    args.push('-o', '-');
    args.push('--no-warnings');
    args.push('--no-check-certificate');
    args.push('--prefer-free-formats');
    args.push(url);
    
    const ytdlp = spawn(ytdlpPath, args);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="video.${fileExtension}"`);
    res.setHeader('Cache-Control', 'no-cache');

    ytdlp.stdout.pipe(res);
    ytdlp.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString());
    });

    ytdlp.on('error', (error) => {
      console.error('yt-dlp error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });

    ytdlp.on('close', (code) => {
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({ error: `yt-dlp exited with code ${code}` });
      }
    });

    req.on('close', () => {
      ytdlp.kill();
    });
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Failed to download video' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local yt-dlp server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive requests from your Vercel frontend`);
});

