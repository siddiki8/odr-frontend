"use client"

import { useResearch } from "@/hooks/use-research"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ResearchStats() {
  const { stats, messages } = useResearch()

  if (!stats) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
          [NO STATS AVAILABLE]
        </p>
      </div>
    )
  }

  // Calculate step durations
  const stepDurations: Record<string, { start: number; end: number }> = {}
  const stepTimestamps: Record<string, number[]> = {}
  messages.forEach((msg, index) => {
    if (!stepTimestamps[msg.step]) stepTimestamps[msg.step] = []
    stepTimestamps[msg.step].push(index)
    if (msg.status === "START") stepDurations[msg.step] = { start: index, end: index }
    else if (msg.status === "END" && stepDurations[msg.step]) stepDurations[msg.step].end = index
  })

  const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-center justify-between py-3 border-b border-[var(--nd-border)]">
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">{label}</span>
      <span className="font-mono text-[13px] text-[var(--nd-text-primary)]">{value}</span>
    </div>
  )

  return (
    <div className="h-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-4">STATISTICS</p>
      <ScrollArea className="h-[460px] pr-4">
        <div className="space-y-6">
          {/* Key metrics */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">USAGE</p>
            <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
              <StatRow label="SEARCHES" value={stats.usage?.serper_queries_used ?? 0} />
              <StatRow label="SOURCES PROCESSED" value={stats.usage?.sources_processed_count ?? 0} />
              <StatRow label="REFINEMENT ITERATIONS" value={stats.usage?.refinement_iterations_run ?? 0} />
              <StatRow
                label="REPORT SIZE"
                value={stats.final_report_length ? `${Math.round(stats.final_report_length / 1000)}K CHARS` : "N/A"}
              />
            </div>
          </section>

          {/* Token usage */}
          {stats.usage?.token_usage && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">TOKENS</p>
              <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                {Object.entries(stats.usage.token_usage).map(([role, usage]) => {
                  if (role === "total" || !usage || typeof usage !== "object") return null
                  return (
                    <StatRow key={role} label={role.toUpperCase()} value={(usage.total_tokens ?? 0).toLocaleString()} />
                  )
                })}
                <div className="flex items-center justify-between py-3 px-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-display)]">TOTAL</span>
                  <span className="font-mono text-[13px] text-[var(--nd-text-display)]">
                    {(stats.usage.token_usage.total?.total_tokens ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Cost */}
          {stats.usage?.estimated_cost && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">ESTIMATED COST</p>
              <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                {Object.entries(stats.usage.estimated_cost).map(([role, cost]) => {
                  if (role === "total" || typeof cost !== "number") return null
                  return <StatRow key={role} label={role.toUpperCase()} value={`$${cost.toFixed(4)}`} />
                })}
                <div className="flex items-center justify-between py-3 px-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-display)]">TOTAL</span>
                  <span className="font-mono text-[13px] text-[var(--nd-text-display)]">
                    ${typeof stats.usage.estimated_cost.total === "number"
                      ? stats.usage.estimated_cost.total.toFixed(4)
                      : "0.0000"}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Process timeline */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">PROCESS STEPS</p>
            <div className="space-y-3">
              {Object.entries(stepTimestamps).map(([step, _]) => {
                const duration = stepDurations[step] ? stepDurations[step].end - stepDurations[step].start : 0
                if (duration <= 0 && step !== "COMPLETE" && step !== "ERROR") return null
                const totalDuration = messages.length
                const percentage = totalDuration > 0 ? Math.round((duration / totalDuration) * 100) : 0
                return (
                  <div key={step}>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">
                        {step}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--nd-text-disabled)]">
                        {duration > 0 ? `${percentage}%` : "—"}
                      </span>
                    </div>
                    {/* Segmented progress bar — Nothing style */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1"
                          style={{
                            backgroundColor: i < Math.round(percentage / 5)
                              ? "var(--nd-text-display)"
                              : "var(--nd-border)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
