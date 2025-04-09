"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Rocket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-24 md:pt-28 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-blue-50/50 to-white dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950">
      {/* Background Glows */}
      <div className="absolute -top-1/4 left-0 w-1/2 h-full bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute -top-1/4 right-0 w-1/2 h-full bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Collaboration/Funding Banner */}
        <div className="bg-blue-100 dark:bg-blue-900/80 p-3 text-center text-sm shadow-sm border-b border-blue-200 dark:border-blue-800 rounded-md mb-4">
          <p className="text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Seeking Collaborators & Funding!</span> We're actively looking for contributors and funding to accelerate development. Contact us at <a href="mailto:a.siddiki@proton.me" className="underline font-medium hover:text-blue-600 dark:hover:text-blue-100">a.siddiki@proton.me</a>.
          </p>
        </div>

        {/* Removed logo section - moved to Header */}

        {/* Two-column grid for text and image */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 tracking-tight leading-tight">
              Build Advanced AI Research Systems, Faster.
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
              Leverage the <span className="font-semibold text-blue-600 dark:text-blue-400">Open Deep Research API</span> framework: A modular, extensible foundation for creating specialized, multi-agent AI research capabilities.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mb-12">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-6 rounded-xl text-lg font-semibold">
                <Link href="/deep_research">
                  <Rocket className="mr-2 h-5 w-5" /> Try the Demo
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 shadow-sm hover:shadow-md transition-all duration-300 px-8 py-6 rounded-xl text-lg font-semibold">
                <a href="https://github.com/siddiki8/ODR-api" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" /> View Source Code
                </a>
              </Button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <a href="https://luminarysolutions.ai" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-blue-600 dark:text-blue-400">Luminary AI Solutions LLC</a>
            </p>
          </motion.div>

          {/* Right Column: Screenshot with Window Frame */}
          <motion.div
            className="relative mt-10 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Window Frame */}
            <div className="bg-white dark:bg-gray-800/60 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700/50">
              {/* Window Title Bar */}
              <div className="h-7 bg-gray-100 dark:bg-gray-700/80 flex items-center px-3 border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Image Content - Removed outer border/shadow, kept aspect ratio and inner styles */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                <Image
                  src="/screenshot.png"
                  alt="ODR-API Deep Research Demo Screenshot"
                  fill
                  style={{ objectFit: "cover" }}
                  quality={90}
                  priority
                />
              </div>
            </div>

            {/* Optional: Add subtle glow or decoration around image (kept from original) */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl blur-lg -z-10 opacity-50"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Removed floating nav - moved to Header */}
    </section>
  )
} 