"use client"

import Link from "next/link"
import { Video } from "lucide-react"

export function Nav() {
  return (
    <header className="border-b border-border/40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Video className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">CosmoVid</h1>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/platforms" className="text-sm font-medium hover:text-primary transition-colors">
            Platforms
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  )
}
