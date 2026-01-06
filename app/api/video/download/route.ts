import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { validateUrl, detectPlatform, sanitizeUrl } from '@/lib/platform-detector';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'mp4'; // mp4 or mp3
    const quality = searchParams.get('quality') || ''; // quality option (1080p, 720p, etc. for video or 320, 256, etc. for audio)

    if (!url) {
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

    // Validate format and quality parameters
    const validFormats = ['mp4', 'mp3'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    const platformInfo = detectPlatform(sanitizedUrl);
    if (!platformInfo.isValid) {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    // Get yt-dlp path
    const ytdlpPath = await getYtDlpPath();

    // Optimized: Skip title fetch to speed up download start
    // Use a simple filename based on timestamp and format
    const timestamp = Date.now();
    const title = `video_${timestamp}`;

    const isTikTok = platformInfo.platform === 'tiktok';
    const isAudioOnly = format === 'mp3';
    const fileExtension = isAudioOnly ? 'mp3' : 'mp4';
    const contentType = isAudioOnly ? 'audio/mpeg' : 'video/mp4';

    // Build format selector based on quality
    let formatSelector = '';
    if (isAudioOnly) {
      // Audio quality options
      const audioQuality = quality || '320';
      formatSelector = 'bestaudio/best';
    } else {
      // Video quality options
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

    // Stream video/audio using yt-dlp
    // For Vercel/serverless, we'll get the direct URL and redirect
    // For local development, we can stream directly
    
    if (process.env.VERCEL) {
      // On Vercel, get the direct URL and redirect (use sanitized URL)
      const urlCommand = `"${ytdlpPath}" --get-url -f "${formatSelector}" --no-warnings ${isTikTok ? '--no-watermark' : ''} "${sanitizedUrl}"`;
      try {
        const { stdout } = await execAsync(urlCommand, { timeout: 30000 });
        const directUrl = stdout.trim();
        
        if (directUrl) {
          return NextResponse.redirect(directUrl);
        }
      } catch (error: any) {
        return NextResponse.json(
          { error: `Failed to get video URL: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // For local development, stream the video/audio
    const { spawn } = await import('child_process');
    const args: string[] = [];
    
    // Add TikTok watermark removal
    if (isTikTok) {
      args.push('--no-watermark');
    }
    
    if (isAudioOnly) {
      // Extract audio only and convert to MP3 (optimized flags)
      args.push('-f', formatSelector);
      args.push('--extract-audio');
      args.push('--audio-format', 'mp3');
      // Set audio quality (0=best, 9=worst)
      // Map bitrate to quality: 320/256->0, 192->5, 128->9
      let audioQuality = '0'; // default to best
      if (quality === '192') audioQuality = '5';
      else if (quality === '128') audioQuality = '9';
      args.push('--audio-quality', audioQuality);
      args.push('--no-playlist');
    } else {
      // Download video (optimized flags)
      args.push('-f', formatSelector);
      args.push('--merge-output-format', 'mp4');
      args.push('--no-playlist');
    }
    
    // Optimized: Add performance flags
    args.push('-o', '-');
    args.push('--no-warnings');
    args.push('--no-check-certificate');
    args.push('--prefer-free-formats');
    args.push(sanitizedUrl); // Use sanitized URL
    
    const ytdlp = spawn(ytdlpPath, args);

    // Set up response headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${title}.${fileExtension}"`);
    headers.set('Cache-Control', 'no-cache');

    // Create a readable stream from the process
    const stream = new ReadableStream({
      start(controller) {
        ytdlp.stdout.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
        });

        ytdlp.stdout.on('end', () => {
          controller.close();
        });

        ytdlp.stderr.on('data', (data: Buffer) => {
          console.error('yt-dlp stderr:', data.toString());
        });

        ytdlp.on('error', (error: Error) => {
          console.error('yt-dlp error:', error);
          controller.error(error);
        });

        ytdlp.on('close', (code: number) => {
          if (code !== 0) {
            controller.error(new Error(`yt-dlp exited with code ${code}`));
          }
        });
      },
      cancel() {
        ytdlp.kill();
      },
    });

    return new NextResponse(stream, { headers });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    );
  }
}

async function getYtDlpPath(): Promise<string> {
  const projectPath = path.join(process.cwd(), 'yt-dlp');
  const projectPathExe = path.join(process.cwd(), 'yt-dlp.exe');
  
  if (fs.existsSync(projectPath)) {
    return projectPath;
  }
  if (fs.existsSync(projectPathExe)) {
    return projectPathExe;
  }

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

