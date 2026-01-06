"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Download, Loader2, Video, Clock, Play, AlertCircle, Info } from "lucide-react"
import { toast } from "sonner"
import { detectPlatform, validateUrl } from "@/lib/platform-detector"
import axios from "axios"

interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration: number
  formats: Array<{
    format_id: string
    format: string
    resolution?: string
    filesize?: number
    ext: string
  }>
  platform: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDetect = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    if (!validateUrl(url)) {
      toast.error("Invalid URL format")
      return
    }

    const platformInfo = detectPlatform(url)
    if (!platformInfo.isValid) {
      toast.error("Unsupported platform. Supported: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit")
      return
    }

    setLoading(true)
    setVideoInfo(null)

    try {
      const response = await axios.post("/api/video/info", { url })
      setVideoInfo(response.data)
      toast.success("Video information loaded successfully")
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch video information"
      toast.error(errorMessage)
      console.error("Error fetching video info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (formatId: string) => {
    if (!videoInfo) return

    setDownloading(formatId)
    try {
      const downloadUrl = `/api/video/download?url=${encodeURIComponent(url)}&format_id=${formatId}`
      
      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `${videoInfo.title}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Download started")
    } catch (error: any) {
      toast.error(error.message || "Failed to start download")
    } finally {
      setDownloading(null)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      youtube: "YouTube",
      tiktok: "TikTok",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter/X",
      reddit: "Reddit",
    }
    return names[platform] || platform
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">CosmoVid</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Download Videos from Social Media</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Paste a video URL from YouTube, TikTok, Instagram, Facebook, Twitter/X, or Reddit
          </p>

          {/* URL Input */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Paste video URL here (e.g., https://www.youtube.com/watch?v=...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDetect()}
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleDetect}
                  disabled={loading || !url.trim()}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Detect & Load
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* How to Use */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <p>1. Copy the video URL from any supported platform</p>
                <p>2. Paste it in the input field above</p>
                <p>3. Click &quot;Detect &amp; Load&quot; to see available formats</p>
                <p>4. Choose your preferred quality and click download</p>
                <p className="mt-4 font-medium">Supported platforms: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Info */}
        {videoInfo && (
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                {videoInfo.thumbnail && (
                  <Image
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    width={192}
                    height={128}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <CardTitle className="mb-2">{videoInfo.title}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {getPlatformName(videoInfo.platform)}
                    </div>
                    {videoInfo.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(videoInfo.duration)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Available Formats:</h3>
                {videoInfo.formats.length > 0 ? (
                  <div className="grid gap-2">
                    {videoInfo.formats.map((format) => (
                      <div
                        key={format.format_id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <div className="font-medium">
                            {format.format} {format.resolution && `(${format.resolution})`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(format.format_id)}
                          disabled={downloading === format.format_id}
                          size="sm"
                        >
                          {downloading === format.format_id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No formats available</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Disclaimer:</strong> For personal, educational use only. Respect platform terms of service and copyright laws. Only download public content you have rights to.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

