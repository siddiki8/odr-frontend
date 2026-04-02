"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useResearch } from "@/hooks/use-research"

export function ResearchForm() {
  const [query, setQuery] = useState("What are the latest advancements in quantum computing?")
  const { startResearch, isResearching } = useResearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      startResearch(query)
    }
  }

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          RESEARCH QUERY
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 pt-6 pb-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] block mb-3">
            TOPIC OR QUESTION
          </label>
          <Textarea
            placeholder="E.g., What are the latest advancements in quantum computing?"
            className="min-h-[120px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isResearching}
          />
          <p className="font-mono text-[10px] text-[var(--nd-text-disabled)] mt-2 text-right">
            {query.length} CHARACTERS
          </p>
        </div>
        <div className="px-6 pb-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isResearching || !query.trim()}
          >
            {isResearching ? "[RESEARCHING...]" : "START RESEARCH"}
          </Button>
        </div>
      </form>
    </div>
  )
}
