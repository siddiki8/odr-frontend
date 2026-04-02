"use client"

import React from "react"

interface ComparisonRow {
  benefit: string
  customSolution: string
  genericTool: string
}

const comparisonData: ComparisonRow[] = [
  {
    benefit: "Tailored Insights",
    customSolution: "Research designed for your specific domain with relevant data sources and analysis.",
    genericTool: "Generic web search results, often missing niche data or industry context.",
  },
  {
    benefit: "Research Depth",
    customSolution: "Multi-step process (Plan → Gather → Analyze → Refine) ensures thoroughness.",
    genericTool: "Locked into hidden workflows; manual follow-up required.",
  },
  {
    benefit: "Accuracy",
    customSolution: "Structured workflows and data checks reduce errors and hallucinations.",
    genericTool: "Prone to inaccuracies; requires manual fact-checking.",
  },
  {
    benefit: "Coverage",
    customSolution: "Integrates diverse sources including private data (web, PDFs, APIs, databases).",
    genericTool: "Limited to standard web search; struggles with complex documents.",
  },
  {
    benefit: "Actionable Output",
    customSolution: "Delivers insights as dashboards, alerts, formatted reports, direct integrations.",
    genericTool: "Primarily plain text; requires manual formatting and integration.",
  },
  {
    benefit: "Always Current",
    customSolution: "Continuously monitors sources and alerts on critical changes automatically.",
    genericTool: "Static results; requires manual re-running to stay current.",
  },
  {
    benefit: "Consistency",
    customSolution: "Standardized processes ensure repeatable, high-quality results every time.",
    genericTool: "Output quality varies greatly depending on the prompt and the day.",
  },
  {
    benefit: "Integration",
    customSolution: "Feeds insights directly into your tools (BI, CRM, Slack) via custom pipelines.",
    genericTool: "Isolated tool; requires manual steps to use research elsewhere.",
  },
]

export const ComparisonTable: React.FC = () => {
  return (
    <div className="border border-[var(--nd-border)] rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-3 border-b border-[var(--nd-border-visible)] bg-[var(--nd-surface-raised)]">
        <div className="px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
            CATEGORY
          </span>
        </div>
        <div className="px-6 py-4 border-l border-[var(--nd-border-visible)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-success)]">
            ◈ CUSTOM ODR-API SOLUTION
          </span>
        </div>
        <div className="px-6 py-4 border-l border-[var(--nd-border-visible)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
            ◇ GENERIC LLM INTERFACE
          </span>
        </div>
      </div>

      <div className="divide-y divide-[var(--nd-border)] bg-[var(--nd-surface)]">
        {comparisonData.map((row, i) => (
          <div key={i} className="grid grid-cols-3 hover:bg-[var(--nd-surface-raised)] transition-colors">
            <div className="px-6 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">
                {row.benefit}
              </span>
            </div>
            <div className="px-6 py-4 border-l border-[var(--nd-border)]">
              <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed">
                {row.customSolution}
              </p>
            </div>
            <div className="px-6 py-4 border-l border-[var(--nd-border)]">
              <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed">
                {row.genericTool}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-5 border-t border-[var(--nd-border-visible)] bg-[var(--nd-surface-raised)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          BOTTOM LINE —{" "}
          <span className="text-[var(--nd-text-primary)]">
            ODR-API delivers powerful, reliable, and integrated research far beyond generic tools.
          </span>
        </p>
      </div>
    </div>
  )
}
