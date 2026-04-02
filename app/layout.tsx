import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Space_Grotesk, Space_Mono, Doto } from "next/font/google"

import { Header } from "@/components/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
})

const doto = Doto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-doto",
  display: "swap",
})

export const metadata: Metadata = {
  generator: "v0.dev",
  icons: {
    icon: "/odr-api.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} ${doto.variable} font-grotesk flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <LandingFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
