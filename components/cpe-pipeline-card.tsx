"use client"

import { useCpe } from "@/hooks/use-cpe"
import { cn } from "@/lib/utils"

const PHASES = [
  { step: "PLANNING", label: "PLAN", minRank: 2 },
  { step: "SEARCHING", label: "SEARCH", minRank: 3 },
  { step: "EXTRACTING", label: "EXTRACT", minRank: 4 },
  { step: "COMPLETE", label: "DONE", minRank: 5 },
] as const

const RANK: Record<string, number> = {
  STARTING: 0,
  INITIALIZING: 1,
  PLANNING: 2,
  SEARCHING: 3,
  EXTRACTING: 4,
  COMPLETE: 5,
  ERROR: -1,
}

export function CpePipelineCard() {
  const { messages, isRunning, currentQuery } = useCpe()

  if (!currentQuery && messages.length === 0) return null

  let maxRank = 0
  let sawComplete = false
  let sawError = false
  for (const m of messages) {
    if (m.step === "COMPLETE") sawComplete = true
    if (m.step === "ERROR") sawError = true
    maxRank = Math.max(maxRank, RANK[m.step] ?? 0)
  }
  if (sawComplete) maxRank = Math.max(maxRank, 5)

  const activePhaseIdx = (() => {
    if (sawError) return -1
    if (sawComplete) return PHASES.length - 1
    if (!isRunning && messages.length === 0) return -1
    for (let i = 0; i < PHASES.length; i++) {
      const done = maxRank > PHASES[i].minRank || (PHASES[i].step === "COMPLETE" && sawComplete)
      if (!done) return i
    }
    return PHASES.length - 1
  })()

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          EXTRACTION PIPELINE
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          {PHASES.map((phase, i) => {
            const done =
              sawComplete ||
              (!sawError && maxRank > phase.minRank) ||
              (phase.step === "COMPLETE" && sawComplete)
            const active = isRunning && !sawComplete && !sawError && i === activePhaseIdx

            return (
              <div key={phase.step} className="flex items-center gap-x-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] rounded-full transition-colors",
                    done && "border-[var(--nd-success)] text-[var(--nd-success)]",
                    active && "border-[var(--nd-accent)] text-[var(--nd-accent)]",
                    !done && !active && "border-[var(--nd-border-visible)] text-[var(--nd-text-disabled)]",
                  )}
                >
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--nd-accent)] animate-pulse" />
                  )}
                  {done && !active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--nd-success)]" />
                  )}
                  {phase.label}
                </span>
                {i < PHASES.length - 1 && (
                  <span className="font-mono text-[11px] text-[var(--nd-text-disabled)]">—</span>
                )}
              </div>
            )
          })}

          {sawError && (
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-accent)]">
              [ERROR]
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
