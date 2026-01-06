const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'yt-dlp backend service is running',
    ytdlp: 'available'
  });
});

// Get direct video URL using yt-dlp -g (get URL)
app.get('/download', async (req, res) => {
  try {
    const { url, format = 'mp4', quality = '' } = req.query;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL parameter is required',
        example: '/download?url=https://www.youtube.com/watch?v=VIDEO_ID'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Build format selector based on quality
    let formatSelector = '';
    if (format === 'mp3') {
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

    // Check if yt-dlp is available
    try {
      await execAsync('which yt-dlp');
    } catch {
      return res.status(500).json({ 
        error: 'yt-dlp not found. Please ensure yt-dlp is installed in the Docker container.' 
      });
    }

    // Get direct URL using yt-dlp -g (get URL without downloading)
    const ytdlpCommand = `yt-dlp -g -f "${formatSelector}" --no-warnings "${url}"`;
    
    console.log(`Fetching direct URL for: ${url}`);
    const { stdout, stderr } = await execAsync(ytdlpCommand, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    const directUrl = stdout.trim();

    if (!directUrl) {
      return res.status(500).json({ 
        error: 'Failed to get direct URL from yt-dlp',
        stderr: stderr || 'No output from yt-dlp'
      });
    }

    // Return the direct URL
    res.json({
      success: true,
      direct_url: directUrl,
      format: format,
      quality: quality || 'default',
      original_url: url
    });

  } catch (error) {
    console.error('Error in /download endpoint:', error);
    
    // Handle specific yt-dlp errors
    if (error.message.includes('Private video') || error.message.includes('Sign in')) {
      return res.status(403).json({ 
        error: 'This video is private or requires authentication' 
      });
    }
    
    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ 
        error: 'Video is unavailable or has been removed' 
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(504).json({ 
        error: 'Request timeout. The video URL may be invalid or the service is slow.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process video URL',
      message: error.message 
    });
  }
});

// Get video info (optional endpoint)
app.get('/info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Get video info using yt-dlp --dump-json
    const ytdlpCommand = `yt-dlp --dump-json --no-warnings --no-playlist --skip-download "${url}"`;
    
    const { stdout } = await execAsync(ytdlpCommand, {
      timeout: 20000,
      maxBuffer: 5 * 1024 * 1024,
    });

    const videoInfo = JSON.parse(stdout);

    res.json({
      success: true,
      id: videoInfo.id || videoInfo.display_id || 'unknown',
      title: videoInfo.title || 'Untitled',
      thumbnail: videoInfo.thumbnail || videoInfo.thumbnails?.[0]?.url || '',
      duration: videoInfo.duration || 0,
      platform: videoInfo.extractor || 'unknown',
    });

  } catch (error) {
    console.error('Error in /info endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video information',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 yt-dlp backend service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📥 Download endpoint: http://localhost:${PORT}/download?url=VIDEO_URL`);
});

