"use client"

import { useResearch } from "@/hooks/use-research"

export function QueryDisplay() {
  const { currentQuery, isResearching } = useResearch()

  if (!currentQuery) return null

  return (
    <div className="w-full mb-8">
      <div className="border border-[var(--nd-border-visible)] rounded-xl bg-[var(--nd-surface)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)] flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
            RESEARCH QUERY
          </p>
          {isResearching && (
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--nd-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-accent)]">ACTIVE</span>
            </span>
          )}
        </div>
        <div className="px-6 py-4">
          <p className="font-grotesk text-base text-[var(--nd-text-primary)] break-words">{currentQuery}</p>
        </div>
      </div>
    </div>
  )
}
