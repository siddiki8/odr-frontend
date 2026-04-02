"use client"

const coreFeatures = [
  {
    symbol: "⬡",
    symColor: "var(--nd-interactive)",
    borderColor: "var(--nd-interactive)",
    label: "MODULAR AGENCY DESIGN",
    description:
      "Create specialized research domains as independent Agencies, each orchestrating their own workflow and agents for specific tasks.",
  },
  {
    symbol: "◎",
    symColor: "var(--nd-success)",
    borderColor: "var(--nd-success)",
    label: "REUSABLE CORE SERVICES",
    description:
      "Leverage a shared library for search, scraping, chunking, PDF handling, and ranking across any agency.",
  },
  {
    symbol: "◈",
    symColor: "var(--nd-accent)",
    borderColor: "var(--nd-accent)",
    label: "MULTI-AGENT ORCHESTRATION",
    description:
      "Coordinate multiple specialized LLM agents — Planner, Writer, Refiner — with customizable workflow logic.",
  },
  {
    symbol: "⟳",
    symColor: "var(--nd-warning)",
    borderColor: "var(--nd-warning)",
    label: "STRUCTURED DATA FLOW",
    description:
      "Ensure reliable data transfer and validation between agents using Pydantic V2 schemas for robust interactions.",
  },
  {
    symbol: "◇",
    symColor: "var(--nd-text-secondary)",
    borderColor: "var(--nd-border-visible)",
    label: "EXTENSIBLE ARCHITECTURE",
    description:
      "Easily add new agencies, swap services, integrate custom tools, or configure LLM providers via environment or API.",
  },
  {
    symbol: "⚡",
    symColor: "var(--nd-warning)",
    borderColor: "var(--nd-warning)",
    label: "REAL-TIME STREAMING",
    description:
      "Monitor research live with step-by-step updates streamed via WebSockets, providing full transparency.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 border-t border-[var(--nd-border)] bg-[var(--nd-bg)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-6">
          03 — CAPABILITIES
        </p>
        <h2 className="font-grotesk text-3xl md:text-4xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em] mb-4 max-w-2xl">
          Powerful features out-of-the-box.
        </h2>
        <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-16 max-w-xl leading-relaxed">
          ODR-API provides a comprehensive toolkit for building sophisticated AI research applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--nd-border)] border border-[var(--nd-border)] rounded-xl overflow-hidden">
          {coreFeatures.map((feature) => (
            <div
              key={feature.label}
              className="bg-[var(--nd-surface)] p-6 flex flex-col gap-4 relative"
              style={{ borderTop: `2px solid ${feature.borderColor}` }}
            >
              <span
                className="text-3xl leading-none"
                style={{ color: feature.symColor }}
              >
                {feature.symbol}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-primary)] mb-3">
                  {feature.label}
                </p>
                <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
