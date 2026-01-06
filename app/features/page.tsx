"use client"

import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Smartphone, Music, Star, Video } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "Fast & Optimized",
      description: "Optimized fetching process ensures quick video information retrieval. No unnecessary delays.",
    },
    {
      icon: Video,
      title: "Multiple Formats",
      description: "Download as MP4 video or extract audio as MP3. Choose from multiple quality options.",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Built with security in mind. Your data is safe, and downloads are processed securely.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Fully responsive design works perfectly on all devices - desktop, tablet, and mobile.",
    },
    {
      icon: Music,
      title: "No Watermark",
      description: "TikTok videos automatically download without watermarks when possible.",
    },
    {
      icon: Star,
      title: "Free Forever",
      description: "Completely free to use. No registration, no subscriptions, no hidden fees.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6">
            Features
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Everything you need to download and enjoy your favorite videos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-lg sm:text-xl mb-4">
                Ready to start downloading?
              </p>
              <Link href="/">
                <Button size="lg">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
