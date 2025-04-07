import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

// Import Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link
                href="/"
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] dark:from-gray-100 dark:to-white"
              >
                Deep Research
              </Link>
              <nav className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/reports">
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Link>
                </Button>
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-4 mt-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>
                Built on the open source{" "}
                <a
                  href="https://github.com/siddiki8/ODR-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ODR-API
                </a>{" "}
                maintained by Luminary AI Solutions, LLC.
              </p>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
