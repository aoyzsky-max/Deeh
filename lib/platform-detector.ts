export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'reddit' | 'dailymotion' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  isValid: boolean;
}

export function detectPlatform(url: string): PlatformInfo {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return { platform: 'youtube', isValid: true };
    }
    
    // TikTok
    if (hostname.includes('tiktok.com')) {
      return { platform: 'tiktok', isValid: true };
    }
    
    // Instagram
    if (hostname.includes('instagram.com')) {
      return { platform: 'instagram', isValid: true };
    }
    
    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com') || hostname.includes('fb.watch')) {
      return { platform: 'facebook', isValid: true };
    }
    
    // Twitter/X
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return { platform: 'twitter', isValid: true };
    }
    
    // Reddit
    if (hostname.includes('reddit.com')) {
      return { platform: 'reddit', isValid: true };
    }
    
    // DailyMotion
    if (hostname.includes('dailymotion.com') || hostname.includes('dai.ly')) {
      return { platform: 'dailymotion', isValid: true };
    }
    
    return { platform: 'unknown', isValid: false };
  } catch {
    return { platform: 'unknown', isValid: false };
  }
}

export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // Validate hostname (basic check)
    if (!urlObj.hostname || urlObj.hostname.length > 253) {
      return false;
    }
    // Prevent localhost and private IPs (basic check)
    if (urlObj.hostname === 'localhost' || urlObj.hostname.startsWith('127.') || urlObj.hostname.startsWith('192.168.')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Sanitize URL to prevent command injection
export function sanitizeUrl(url: string): string {
  // Remove any potentially dangerous characters
  return url.trim().replace(/[;&|`$(){}[\]<>]/g, '');
}

