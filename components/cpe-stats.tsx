"use client"

import { useCpe } from "@/hooks/use-cpe"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CpeStats() {
  const { stats, profileCount } = useCpe()

  if (!stats) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
          [NO STATS AVAILABLE]
        </p>
      </div>
    )
  }

  const tokenUsage = stats.token_usage ?? {}
  const totalTokens = Object.values(tokenUsage).reduce(
    (s, u) => s + (u?.total_tokens ?? 0),
    0,
  )
  const estimatedCost = stats.estimated_cost ?? {}
  const totalCost = Object.values(estimatedCost).reduce(
    (s, v) => s + (typeof v === "number" ? v : 0),
    0,
  )

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
              <StatRow label="SERPER QUERIES" value={stats.serper_queries_used ?? 0} />
              <StatRow label="PROFILES EXTRACTED" value={profileCount ?? 0} />
              <StatRow label="TOTAL TOKENS" value={totalTokens.toLocaleString()} />
            </div>
          </section>

          {/* Token breakdown */}
          {Object.keys(tokenUsage).length > 0 && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">TOKENS BY ROLE</p>
              <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                {Object.entries(tokenUsage).map(([role, usage]) => {
                  if (!usage || typeof usage !== "object") return null
                  return (
                    <StatRow key={role} label={role.toUpperCase()} value={(usage.total_tokens ?? 0).toLocaleString()} />
                  )
                })}
              </div>
            </section>
          )}

          {/* Cost */}
          {Object.keys(estimatedCost).length > 0 && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">ESTIMATED COST</p>
              <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                {Object.entries(estimatedCost).map(([role, cost]) => {
                  if (typeof cost !== "number") return null
                  return <StatRow key={role} label={role.toUpperCase()} value={`$${cost.toFixed(4)}`} />
                })}
                <div className="flex items-center justify-between py-3 px-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-display)]">TOTAL</span>
                  <span className="font-mono text-[13px] text-[var(--nd-text-display)]">
                    ${totalCost.toFixed(4)}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
