"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, MonitorPlay, LayoutGrid, Scaling, FileText } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Left Side: Logos */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Open Deep Research API Logo"
            width={36} // Smaller size for header
            height={36}
            className=""
          />
           <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          <Image
            src="/luminary.png"
            alt="Luminary AI Solutions LLC Logo"
            width={28} // Smaller size for header
            height={28}
            className="opacity-90"
          />
          {/* Optional: Add text logo if needed */}
          {/* <span className="text-lg font-semibold text-gray-800 dark:text-white">ODR-API</span> */}
        </Link>

        {/* Right Side: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href="/potential-agents">
              <LayoutGrid className="mr-1.5 h-4 w-4" /> Agents
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href="/comparison">
              <Scaling className="mr-1.5 h-4 w-4" /> Compare
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href="/reports">
              <FileText className="mr-1.5 h-4 w-4" /> Reports
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div> {/* Separator */}
          <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href="/deep_research">
              <MonitorPlay className="mr-1.5 h-4 w-4" /> Demo
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <a href="https://github.com/siddiki8/ODR-api" target="_blank" rel="noopener noreferrer">
              <Github className="mr-1.5 h-4 w-4" /> GitHub
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
} 