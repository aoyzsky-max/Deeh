"use client"

import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PlatformsPage() {
  const platforms = [
    { 
      name: 'YouTube', 
      color: 'bg-red-500',
      description: 'Download videos from YouTube with all quality options available.'
    },
    { 
      name: 'TikTok', 
      color: 'bg-black dark:bg-white',
      description: 'TikTok videos download automatically without watermarks!'
    },
    { 
      name: 'Instagram', 
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
      description: 'Download Instagram Reels and posts in high quality.'
    },
    { 
      name: 'Facebook', 
      color: 'bg-blue-600',
      description: 'Get videos from Facebook with ease.'
    },
    { 
      name: 'Twitter/X', 
      color: 'bg-black dark:bg-white',
      description: 'Download videos from Twitter/X posts and threads.'
    },
    { 
      name: 'Reddit', 
      color: 'bg-orange-500',
      description: 'Save videos from Reddit posts and comments.'
    },
    { 
      name: 'DailyMotion', 
      color: 'bg-blue-500',
      description: 'Download videos from DailyMotion with high quality options.'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6">
            Supported Platforms
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Download videos from all major social media platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6 text-center">
                <div className={`w-20 h-20 ${platform.color} rounded-lg mx-auto mb-4 flex items-center justify-center relative`}>
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 bg-background rounded-full" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{platform.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {platform.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-lg sm:text-xl mb-4">
                Ready to download from these platforms?
              </p>
              <Link href="/">
                <Button size="lg">
                  Start Downloading
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
