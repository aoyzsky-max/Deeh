import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { detectPlatform, validateUrl, sanitizeUrl } from '@/lib/platform-detector';
import path from 'path';
import fs from 'fs';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  filesize?: number;
  formats: Array<{
    format_id: string;
    format: string;
    resolution?: string;
    filesize?: number;
    ext: string;
  }>;
  platform: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate URL
    const sanitizedUrl = sanitizeUrl(url);
    if (!validateUrl(sanitizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Additional length check
    if (sanitizedUrl.length > 2048) {
      return NextResponse.json(
        { error: 'URL is too long' },
        { status: 400 }
      );
    }

    // Detect platform
    const platformInfo = detectPlatform(sanitizedUrl);
    if (!platformInfo.isValid) {
      return NextResponse.json(
        { error: 'Unsupported platform. Supported: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, DailyMotion' },
        { status: 400 }
      );
    }

    // Get yt-dlp path
    const ytdlpPath = await getYtDlpPath();

    // Optimized: Get only essential video info (skip formats, skip download, faster)
    const infoCommand = `"${ytdlpPath}" --dump-json --no-warnings --no-playlist --skip-download --no-check-certificate --no-warnings "${sanitizedUrl}"`;
    
    let infoOutput: string;
    try {
      const { stdout } = await execAsync(infoCommand, {
        timeout: 20000, // Reduced to 20 seconds
        maxBuffer: 5 * 1024 * 1024, // Reduced to 5MB buffer
      });
      infoOutput = stdout;
    } catch (error: any) {
      console.error('yt-dlp error:', error);
      if (error.message.includes('Private video') || error.message.includes('Sign in')) {
        return NextResponse.json(
          { error: 'This video is private or requires authentication' },
          { status: 403 }
        );
      }
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json(
          { error: 'Video is unavailable or has been removed' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch video info: ${error.message}` },
        { status: 500 }
      );
    }

    // Parse JSON output
    let videoData: any;
    try {
      videoData = JSON.parse(infoOutput);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to parse video information' },
        { status: 500 }
      );
    }

    // Optimized: We don't need formats array anymore since we use predefined quality options
    // Just return minimal info needed for display
    const videoInfo: VideoInfo = {
      id: videoData.id || videoData.display_id || 'unknown',
      title: videoData.title || 'Untitled',
      thumbnail: videoData.thumbnail || videoData.thumbnails?.[0]?.url || '',
      duration: videoData.duration || 0,
      filesize: videoData.filesize || videoData.filesize_approx || undefined,
      formats: [], // Empty since we use predefined quality options
      platform: platformInfo.platform,
    };

    return NextResponse.json(videoInfo);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getYtDlpPath(): Promise<string> {
  // Check if yt-dlp is in the project directory
  const projectPath = path.join(process.cwd(), 'yt-dlp');
  const projectPathExe = path.join(process.cwd(), 'yt-dlp.exe');
  
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
      throw new Error('yt-dlp not found. Please install yt-dlp and ensure it is in your PATH or project directory.');
    }
  }
}

