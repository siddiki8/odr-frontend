"use client"

import { useResearch } from "@/hooks/use-research"
import type { ResearchPlan as ResearchPlanType } from "@/types/research"
import type { WritingPlanSection } from "@/types/research"

interface ResearchPlanDisplayProps {
  plan?: ResearchPlanType | null
  heading?: string
}

export function ResearchPlanDisplay({
  plan: planProp,
  heading = "Research Plan",
}: ResearchPlanDisplayProps) {
  const { plan: planFromHook } = useResearch()
  const planToDisplay = planProp !== undefined ? planProp : planFromHook
  const typedPlan = planToDisplay as ResearchPlanType | null

  if (!typedPlan) return null

  const { writing_plan, search_queries } = typedPlan

  if (!writing_plan) {
    console.warn("ResearchPlanDisplay received plan object without writing_plan.", typedPlan)
    return (
      <div className="border border-[var(--nd-border-visible)] rounded-xl bg-[var(--nd-surface)] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
          [PLAN DETAILS INCOMPLETE]
        </p>
      </div>
    )
  }

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          {heading.toUpperCase()}
        </p>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Research Goal */}
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">RESEARCH GOAL</p>
          <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed break-words">
            {writing_plan.overall_goal}
          </p>
        </section>

        {/* Desired Tone */}
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">DESIRED TONE</p>
          <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed break-words">
            {writing_plan.desired_tone}
          </p>
        </section>

        {/* Search Queries */}
        {search_queries && search_queries.length > 0 && (
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">
              SEARCH QUERIES — {search_queries.length}
            </p>
            <div className="space-y-2">
              {search_queries.map((query: string, index: number) => (
                <div key={index} className="flex items-start gap-4 border-b border-[var(--nd-border)] pb-2">
                  <span className="font-mono text-[11px] text-[var(--nd-text-disabled)] shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-grotesk text-sm text-[var(--nd-text-primary)] break-words flex-1">{query}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Report Sections */}
        {writing_plan.sections && writing_plan.sections.length > 0 && (
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">
              REPORT SECTIONS — {writing_plan.sections.length}
            </p>
            <div className="space-y-3">
              {writing_plan.sections.map((section: WritingPlanSection, index: number) => (
                <div key={index} className="border border-[var(--nd-border)] rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-[11px] text-[var(--nd-text-disabled)] shrink-0">
                      {String(index + 1).padStart(2, "0")} —
                    </span>
                    <p className="font-grotesk text-sm font-medium text-[var(--nd-text-display)]">{section.title}</p>
                  </div>
                  <p className="font-grotesk text-xs text-[var(--nd-text-secondary)] leading-relaxed ml-8 break-words">
                    {section.guidance}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Directives */}
        {writing_plan.additional_directives && writing_plan.additional_directives.length > 0 && (
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">
              ADDITIONAL DIRECTIVES
            </p>
            <div className="space-y-2">
              {writing_plan.additional_directives.map((directive: string, index: number) => (
                <div key={index} className="border-l-2 border-[var(--nd-border-visible)] pl-4 py-1">
                  <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] break-words">{directive}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
