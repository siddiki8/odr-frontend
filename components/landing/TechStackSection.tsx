"use client"

const stack = [
  {
    category: "BACKEND FRAMEWORK",
    items: ["FastAPI", "Python 3.10+", "Pydantic V2", "Pydantic-AI"],
  },
  {
    category: "AI & CORE SERVICES",
    items: ["Crawl4AI", "Serper API", "Together AI", "OpenRouter"],
  },
  {
    category: "FRONTEND DEMO",
    items: ["Next.js 15", "TailwindCSS", "Shadcn/ui", "WebSockets"],
  },
]

export function TechStackSection() {
  return (
    <section className="py-24 border-t border-[var(--nd-border)] bg-[var(--nd-surface)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-6" style={{ color: "var(--nd-warning)" }}>
          06 — TECH STACK
        </p>
        <h2 className="font-grotesk text-3xl md:text-4xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em] mb-4 max-w-2xl">
          Modern, robust tooling.
        </h2>
        <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-16 max-w-xl leading-relaxed">
          Leveraging powerful libraries and services for optimal performance and developer experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--nd-border)] border border-[var(--nd-border)] rounded-xl overflow-hidden">
          {stack.map((group) => (
            <div key={group.category} className="p-6 bg-[var(--nd-surface)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-6">
                {group.category}
              </p>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[var(--nd-text-disabled)] shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-grotesk text-sm text-[var(--nd-text-primary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
