"use client"

import Image from "next/image"

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--nd-border)] bg-[var(--nd-surface)]">
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Wordmark + logos */}
        <div className="flex items-center gap-3">
          <Image src="/odr-api.png" alt="ODR-API" width={20} height={20} className="rounded-sm opacity-80" />
          <span className="font-grotesk text-[13px] font-medium text-[var(--nd-text-display)]">ODR-API</span>
          <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">×</span>
          <a
            href="https://luminarysolutions.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image src="/luminary.png" alt="Luminary AI Solutions" width={18} height={18} className="rounded-sm" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
              LUMINARY
            </span>
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/siddiki8/ODR-api"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors"
          >
            GITHUB
          </a>
          <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">|</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
            MIT LICENSE
          </span>
        </div>

        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
