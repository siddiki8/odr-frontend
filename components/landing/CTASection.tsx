"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-32 border-t border-[var(--nd-border)] bg-[var(--nd-bg)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-6" style={{ color: "var(--nd-accent)" }}>
          07 — GET STARTED
        </p>
        <h2 className="font-doto text-5xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.02em] mb-12 max-w-3xl" style={{ color: "var(--nd-text-display)" }}>
          Build your AI{" "}
          <span style={{ color: "var(--nd-interactive)" }}>research</span>{" "}
          system.
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href="/deep_research">TRY DEMO</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/siddiki8/ODR-api" target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a
              href="https://github.com/siddiki8/ODR-api/blob/main/README.md#contributing"
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTRIBUTE
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
