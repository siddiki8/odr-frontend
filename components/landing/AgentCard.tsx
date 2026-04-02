import React from "react"

interface AgentCardProps {
  title: string
  forAudience: string
  getBenefit: string
  howItWorks: { step: number; description: string }[]
  youReceive: string[]
  icon?: React.ReactNode
}

export const AgentCard: React.FC<AgentCardProps> = ({
  title,
  forAudience,
  getBenefit,
  howItWorks,
  youReceive,
}) => {
  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
        <h3 className="font-grotesk text-lg font-medium text-[var(--nd-text-display)]">{title}</h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] mt-1" style={{ color: "var(--nd-interactive)" }}>
          FOR: {forAudience}
        </p>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            BENEFIT
          </p>
          <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed mb-6">{getBenefit}</p>

          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            HOW IT WORKS
          </p>
          <div className="space-y-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex gap-3">
                <span className="font-mono text-[11px] shrink-0" style={{ color: "var(--nd-interactive)" }}>
                  {String(item.step).padStart(2, "0")}
                </span>
                <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            YOU RECEIVE
          </p>
          <div className="space-y-2">
            {youReceive.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[var(--nd-accent)] text-sm leading-relaxed shrink-0">◈</span>
                <p className="font-grotesk text-sm text-[var(--nd-text-primary)] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
