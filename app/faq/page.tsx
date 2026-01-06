"use client"

import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  const faqs = [
    {
      question: "What platforms are supported?",
      answer: "CosmoVid supports YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, and DailyMotion. We&apos;re constantly adding support for more platforms."
    },
    {
      question: "Is it free to use?",
      answer: "Yes! CosmoVid is completely free to use. No registration, no subscriptions, and no hidden fees."
    },
    {
      question: "What video formats can I download?",
      answer: "You can download videos as MP4 (video) or extract audio as MP3. Multiple quality options are available for each format."
    },
    {
      question: "Are TikTok videos downloaded without watermarks?",
      answer: "Yes! When possible, TikTok videos are automatically downloaded without watermarks for a cleaner viewing experience."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. We don&apos;t store any of your data or video URLs. All processing happens in real-time, and we respect your privacy."
    },
    {
      question: "Can I download on mobile devices?",
      answer: "Yes! CosmoVid is fully responsive and works perfectly on desktop, tablet, and mobile devices."
    },
    {
      question: "What if a video won&apos;t download?",
      answer: "Some videos may be private, age-restricted, or region-locked. Make sure the video is publicly accessible and try again."
    },
    {
      question: "Do you store downloaded videos?",
      answer: "No. We don&apos;t store any videos on our servers. Downloads are processed in real-time and sent directly to your device."
    },
    {
      question: "Is this legal?",
      answer: "CosmoVid is for personal, educational use only. Please respect platform terms of service and copyright laws. Only download content you have rights to."
    },
    {
      question: "How do I report an issue?",
      answer: "If you encounter any problems, please check that the video URL is correct and the video is publicly accessible. For persistent issues, the video may not be supported."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Everything you need to know about CosmoVid
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                  <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>{faq.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-lg sm:text-xl mb-4">
                Still have questions?
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
