"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Mail } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Luminary Info */}
          <div className="flex items-center gap-4">
            <Image
              src="/luminary.png"
              alt="Luminary AI Solutions LLC Logo"
              width={40}
              height={40}
              className="rounded-sm"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Developed & Maintained by 
                <a 
                  href="https://luminarysolutions.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Luminary AI Solutions LLC
                </a>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Building the future of AI research tools.</p>
            </div>
          </div>

          {/* Links & Copyright */}
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end items-center gap-6 mb-3">
              <a 
                href="https://github.com/siddiki8/ODR-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@luminarysolutions.ai"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="Contact Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Luminary AI Solutions LLC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 