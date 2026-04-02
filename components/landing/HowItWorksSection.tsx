"use client"

const steps = [
  {
    num: "01",
    label: "DEFINE & PLAN",
    description:
      "Provide a research query. The Planner agent generates a structured plan with search queries and a writing outline.",
    detail: "Input: User Query → Output: WritingPlan, SearchTasks",
    color: "var(--nd-interactive)",
  },
  {
    num: "02",
    label: "GATHER & PROCESS",
    description:
      "The system executes searches, scrapes web content via Crawl4AI, handles PDFs, chunks text, and ranks for relevance.",
    detail: "Services: Search, Scraper, Chunking, Ranking",
    color: "var(--nd-warning)",
  },
  {
    num: "03",
    label: "SYNTHESIZE & WRITE",
    description:
      "The Writer agent drafts the report using processed context, structuring it according to the plan with citations.",
    detail: "Input: Processed Content, Plan → Output: Draft Report",
    color: "var(--nd-accent)",
  },
  {
    num: "04",
    label: "REFINE & ITERATE",
    description:
      "The Refiner agent iteratively enhances the draft, incorporating only new information from further searches.",
    detail: "Loop: Search → Process → Refine → Output: Refined Report",
    color: "var(--nd-warning)",
  },
  {
    num: "05",
    label: "FINALIZE & DELIVER",
    description:
      "The system assembles the final report, formats citations, adds references, and delivers via WebSocket stream.",
    detail: "Output: Final Report, Usage Stats",
    color: "var(--nd-success)",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-[var(--nd-border)] bg-[var(--nd-surface)]">
      <div className="container mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-6">
          04 — HOW IT WORKS
        </p>
        <h2 className="font-grotesk text-3xl md:text-4xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em] mb-4 max-w-2xl">
          Orchestrated agent pipeline.
        </h2>
        <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-16 max-w-xl leading-relaxed">
          See the coordinated flow of agents and services inside the{" "}
          <span className="font-mono text-[var(--nd-text-primary)]">deep_research</span> agency.
        </p>

        <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden divide-y divide-[var(--nd-border)]">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-6 p-6 bg-[var(--nd-surface)] hover:bg-[var(--nd-surface-raised)] transition-colors group"
            >
              <span
                className="font-doto text-3xl leading-none shrink-0 w-12 text-right transition-colors"
                style={{ color: step.color }}
              >
                {step.num}
              </span>
              <div
                className="pl-6 flex-1"
                style={{ borderLeft: `2px solid ${step.color}` }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-2" style={{ color: step.color }}>
                  {step.label}
                </p>
                <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed mb-3">
                  {step.description}
                </p>
                <p className="font-mono text-[11px] text-[var(--nd-text-disabled)] tracking-[0.04em]">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
