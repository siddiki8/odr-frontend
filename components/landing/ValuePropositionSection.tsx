"use client"

const challenges = [
  "Duplicated effort for search, scraping, and chunking",
  "Complex agent coordination and fragile data flow",
  "Difficulty adapting to new domains or tools",
  "Scalability and maintainability bottlenecks",
]

const solutions = [
  "Modular Agencies for domain specialization",
  "Reusable Services for core functionalities",
  "Clear Agent orchestration patterns",
  "Reliable data flow via Pydantic schemas",
]

export function ValuePropositionSection() {
  return (
    <section className="py-24 border-t border-[var(--nd-border)] bg-[var(--nd-surface)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-6" style={{ color: "var(--nd-interactive)" }}>
          02 — WHY ODR-API
        </p>
        <h2 className="font-grotesk text-3xl md:text-4xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em] mb-4 max-w-2xl">
          Stop reinventing the wheel for AI research.
        </h2>
        <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-16 max-w-xl leading-relaxed">
          Building robust AI research systems is complex. ODR-API gives you the structured, reusable foundation to focus on innovation, not infrastructure.
        </p>

        <div className="grid md:grid-cols-2 gap-0 border border-[var(--nd-border-visible)] rounded-xl overflow-hidden">
          {/* Challenge column */}
          <div className="border-r border-[var(--nd-border-visible)]">
            <div className="px-6 py-4 border-b border-[var(--nd-border-visible)] bg-[var(--nd-surface-raised)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
                ◇ THE CHALLENGE
              </p>
            </div>
            <div className="divide-y divide-[var(--nd-border)]">
              {challenges.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[var(--nd-text-disabled)] mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution column */}
          <div>
            <div className="px-6 py-4 border-b border-[var(--nd-border-visible)] bg-[var(--nd-surface-raised)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-accent)]">
                ◈ THE SOLUTION
              </p>
            </div>
            <div className="divide-y divide-[var(--nd-border)]">
              {solutions.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[var(--nd-accent)] mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
