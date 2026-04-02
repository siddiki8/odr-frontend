"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const navGroups = [
  {
    items: [
      { href: "/deep_research", label: "RESEARCH" },
      { href: "/reports", label: "REPORTS" },
    ],
  },
  {
    items: [
      { href: "/cpe", label: "CPE" },
      { href: "/cpe-reports", label: "CPE REPORTS" },
    ],
  },
  {
    items: [
      { href: "/potential-agents", label: "AGENTS" },
      { href: "/comparison", label: "COMPARE" },
    ],
  },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  const allNavItems = navGroups.flatMap((g) => g.items)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--nd-surface)] border-b border-[var(--nd-border)]">
      <div className="container mx-auto px-6 h-14 flex justify-between items-center">
        {/* Wordmark + logos */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Image src="/odr-api.png" alt="ODR-API" width={24} height={24} className="rounded-sm" />
          <span className="font-grotesk text-[15px] font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
            ODR-API
          </span>
          <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">×</span>
          <Image src="/luminary.png" alt="Luminary" width={20} height={20} className="rounded-sm opacity-80" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navGroups.map((group, gi) => (
            <span key={gi} className="flex items-center gap-5">
              {gi > 0 && (
                <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">|</span>
              )}
              {group.items.map((item, ii) => (
                <span key={item.href} className="flex items-center gap-5">
                  {ii > 0 && (
                    <span className="text-[var(--nd-border)] font-mono text-[11px]">·</span>
                  )}
                  <Link
                    href={item.href}
                    className={[
                      "font-mono text-[11px] uppercase tracking-[0.08em] transition-colors whitespace-nowrap",
                      isActive(item.href)
                        ? "text-[var(--nd-accent)]"
                        : "text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)]",
                    ].join(" ")}
                  >
                    {isActive(item.href) ? `[ ${item.label} ]` : item.label}
                  </Link>
                </span>
              ))}
            </span>
          ))}

          <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">|</span>

          {/* GitHub icon */}
          <a
            href="https://github.com/siddiki8/ODR-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <span className="text-[var(--nd-border-visible)] font-mono text-[11px]">|</span>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "[ LIGHT ]" : "[ DARK ]"}
            </button>
          )}
        </nav>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {/* GitHub icon */}
          <a
            href="https://github.com/siddiki8/ODR-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors p-1"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--nd-border)] bg-[var(--nd-surface)] px-6 py-4 flex flex-col gap-4">
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                isActive(item.href)
                  ? "text-[var(--nd-accent)]"
                  : "text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)]",
              ].join(" ")}
            >
              {isActive(item.href) ? `[ ${item.label} ]` : item.label}
            </Link>
          ))}

          <div className="border-t border-[var(--nd-border)] pt-3">
            {mounted && (
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                  setMenuOpen(false)
                }}
                className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] hover:text-[var(--nd-text-secondary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "[ LIGHT MODE ]" : "[ DARK MODE ]"}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
