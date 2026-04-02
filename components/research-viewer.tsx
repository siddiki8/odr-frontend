"use client"

import { useResearch } from "@/hooks/use-research"
import { ResearchTimeline } from "@/components/research-timeline"
import { ResearchStats } from "@/components/research-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ResearchViewer() {
  const { isResearching, messages, stopResearch } = useResearch()
  const [activeTab, setActiveTab] = useState("timeline")

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)] flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
            RESEARCH PROGRESS
          </p>
          <p className="font-grotesk text-xs text-[var(--nd-text-disabled)] mt-1">
            {isResearching
              ? "Live — receiving updates"
              : messages.length > 0
              ? "Complete"
              : "Waiting for query"}
          </p>
        </div>
        {isResearching && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--nd-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-accent)]">LIVE</span>
            </span>
            <Button variant="destructive" size="sm" onClick={stopResearch}>
              STOP
            </Button>
          </div>
        )}
      </div>

      <div className="p-6">
        {messages.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex gap-1 mb-6 bg-transparent p-0 border-b border-[var(--nd-border)] pb-0">
              <TabsTrigger
                value="timeline"
                className="font-mono text-[11px] uppercase tracking-[0.08em] px-0 pb-3 mr-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--nd-text-display)] data-[state=active]:text-[var(--nd-text-display)] text-[var(--nd-text-disabled)] bg-transparent"
              >
                TIMELINE
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="font-mono text-[11px] uppercase tracking-[0.08em] px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--nd-text-display)] data-[state=active]:text-[var(--nd-text-display)] text-[var(--nd-text-disabled)] bg-transparent"
              >
                STATS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-0">
              <ResearchTimeline />
            </TabsContent>
            <TabsContent value="stats" className="mt-0">
              <ResearchStats />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-grotesk text-base text-[var(--nd-text-secondary)] mb-2">Ready to research.</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
              ENTER A QUERY AND CLICK START RESEARCH
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
