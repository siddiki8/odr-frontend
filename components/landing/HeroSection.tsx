"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // In dark mode show light screenshot, in light mode show dark screenshot
  const screenshot = mounted
    ? resolvedTheme === "dark"
      ? "/nothing-light.png"
      : "/nothing-dark.png"
    : "/nothing-dark.png"

  return (
    <section className="relative pt-28 pb-24 bg-[var(--nd-bg)] dot-grid-subtle overflow-hidden">
      {/* Subtle accent glow in background */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[400px] opacity-[0.06] dark:opacity-[0.10] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--nd-accent) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-0 right-1/4 w-[400px] h-[300px] opacity-[0.04] dark:opacity-[0.07] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--nd-interactive) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative">
        {/* Collaboration notice */}
        <div
          className="mb-12 border rounded-lg p-4 max-w-2xl"
          style={{ borderColor: "var(--nd-accent)", background: "var(--nd-accent-subtle)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--nd-accent)" }}>
            ◈ SEEKING COLLABORATORS &amp; FUNDING —{" "}
            <a
              href="mailto:siddiki@luminarysolutions.ai"
              className="hover:underline"
              style={{ color: "var(--nd-interactive)" }}
            >
              siddiki@luminarysolutions.ai
            </a>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-6" style={{ color: "var(--nd-accent)" }}>
              01 — OPEN DEEP RESEARCH
            </p>
            <h1 className="font-doto text-5xl md:text-6xl lg:text-7xl text-[var(--nd-text-display)] leading-[1.0] tracking-[-0.02em] mb-8">
              Research that thinks,{" "}
              <span style={{ color: "var(--nd-accent)" }}>not just retrieves.</span>
            </h1>
            <p className="font-grotesk text-base md:text-lg text-[var(--nd-text-secondary)] leading-relaxed mb-12 max-w-lg">
              A modular, extensible foundation for creating specialized multi-agent AI research systems. Build advanced capabilities, faster.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="lg" asChild>
                <Link href="/deep_research">TRY THE DEMO</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/Luminary-AI-Solutions/ODR-api" target="_blank" rel="noopener noreferrer">
                  VIEW SOURCE
                </a>
              </Button>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)] mt-8">
              BY{" "}
              <a
                href="https://luminarysolutions.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "var(--nd-interactive)" }}
              >
                LUMINARY AI SOLUTIONS
              </a>
            </p>
          </div>

          {/* Right: Screenshot — theme-aware */}
          <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
            <div className="h-8 bg-[var(--nd-surface-raised)] border-b border-[var(--nd-border)] flex items-center px-4 gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--nd-accent)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--nd-warning)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--nd-success)" }} />
              <span className="ml-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
                ODR-API — DEEP RESEARCH
              </span>
            </div>
            <div className="aspect-video relative bg-[var(--nd-surface-raised)]">
              <Image
                key={screenshot}
                src={screenshot}
                alt="ODR-API Deep Research Demo"
                fill
                style={{ objectFit: "cover" }}
                quality={90}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
