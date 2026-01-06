"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2, Video, Clock, Play, AlertCircle } from "lucide-react"
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
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">CosmoVid</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Download Videos from Social Media
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Fast, free, and simple. Download videos from YouTube, TikTok, Instagram, Facebook, Twitter/X, and Reddit.
          </p>

          {/* URL Input Section */}
          <section className="mb-12">
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="Paste video URL here..."
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
                        Loading...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Load Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </section>

        {/* Video Info Section */}
        {videoInfo && (
          <section className="mb-12">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {videoInfo.thumbnail && (
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-48 h-32 object-cover rounded-lg"
                      loading="lazy"
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
                <div className="space-y-3">
                  <h3 className="font-semibold mb-4">Download Options:</h3>
                  {videoInfo.formats.length > 0 ? (
                    <div className="grid gap-2">
                      {videoInfo.formats.map((format) => (
                        <div
                          key={format.format_id}
                          className="flex items-center justify-between p-3 border border-border/40 rounded-lg hover:bg-accent/50 transition-colors"
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
          </section>
        )}
      </main>

      {/* Footer Section */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-2 text-sm text-muted-foreground max-w-3xl">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Disclaimer:</strong> For personal, educational use only. Respect platform terms of service and copyright laws.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

