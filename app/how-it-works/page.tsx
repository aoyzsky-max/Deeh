"use client"

import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Download, FileVideo, Music } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Paste Video URL",
      description: "Copy the video URL from any supported platform and paste it in the input field. The platform will be automatically detected.",
      icon: Play,
    },
    {
      number: 2,
      title: "Load Video Info",
      description: "Click 'Load Video' to fetch video information. This process is optimized for speed.",
      icon: FileVideo,
    },
    {
      number: 3,
      title: "Choose Format & Quality",
      description: "Select MP4 (video) or MP3 (audio) format, then choose your preferred quality option.",
      icon: Music,
    },
    {
      number: 4,
      title: "Download",
      description: "Click download and wait for your file. The download will start automatically. Please don't close the page during download.",
      icon: Download,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6">
            How It Works
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Download videos in just a few simple steps
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center relative">
                        <Icon className="h-8 w-8 text-primary" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {step.number}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl sm:text-2xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg sm:text-xl mb-4">
                That's it! Simple as that!
              </p>
              <Link href="/">
                <Button size="lg">
                  Try It Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
