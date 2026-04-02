"use client"

const layers = [
  {
    label: "AGENCIES",
    description: "Domain-specialized orchestration units. Each Agency bundles its own logic, agents, and schemas for a specific research domain.",
    items: ["Deep Research", "Financial Analyzer", "Company Profiler"],
    symbol: "⬡",
    symColor: "var(--nd-interactive)",
    tagColor: "var(--nd-interactive)",
  },
  {
    label: "AGENTS",
    description: "LLM-powered workers with defined roles. Coordinate within an Agency to execute sub-tasks.",
    items: ["Planner", "Writer", "Refiner"],
    symbol: "◎",
    symColor: "var(--nd-success)",
    tagColor: "var(--nd-success)",
  },
  {
    label: "SERVICES",
    description: "Shared, non-LLM capabilities called programmatically by Agencies and Agents.",
    items: ["Search", "Scraper", "Chunking", "Ranking"],
    symbol: "◇",
    symColor: "var(--nd-warning)",
    tagColor: "var(--nd-warning)",
  },
  {
    label: "SCHEMAS",
    description: "Pydantic V2 models defining data contracts between all components — the glue of the system.",
    items: ["WritingPlan", "SearchTask", "ReportSection", "UsageStats"],
    symbol: "◈",
    symColor: "var(--nd-accent)",
    tagColor: "var(--nd-accent)",
  },
]

export function ArchitectureSection() {
  return (
    <section className="py-24 border-t border-[var(--nd-border)] bg-[var(--nd-bg)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-6">
          05 — ARCHITECTURE
        </p>
        <h2 className="font-grotesk text-3xl md:text-4xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em] mb-4 max-w-2xl">
          Solid, modular foundation.
        </h2>
        <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-16 max-w-xl leading-relaxed">
          Understand the core components that make ODR-API powerful and easy to extend.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--nd-border)] border border-[var(--nd-border)] rounded-xl overflow-hidden">
          {layers.map((layer) => (
            <div key={layer.label} className="bg-[var(--nd-surface)] p-6" style={{ borderTop: `2px solid ${layer.symColor}` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl leading-none" style={{ color: layer.symColor }}>{layer.symbol}</span>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: layer.symColor }}>
                  {layer.label}
                </p>
              </div>
              <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed mb-4">
                {layer.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 border rounded"
                    style={{
                      borderColor: layer.tagColor,
                      color: layer.tagColor,
                      opacity: 0.8,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
