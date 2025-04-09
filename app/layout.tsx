import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

// Import the new Header and Footer components
import { Header } from "@/components/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"

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
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <LandingFooter />
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
