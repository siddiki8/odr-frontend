"use client"

import { CpeProvider } from "@/components/cpe-provider"
import { CpeForm } from "@/components/cpe-form"
import { CpeViewer } from "@/components/cpe-viewer"
import { CpeProfiles } from "@/components/cpe-profiles"
import { CpeQueryDisplay } from "@/components/cpe-query-display"
import { CpePipelineCard } from "@/components/cpe-pipeline-card"
import { ResearchPlanDisplay } from "@/components/research-plan"
import { useCpe } from "@/hooks/use-cpe"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CpePage() {
  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14">
      <div className="container mx-auto px-6 pb-16 max-w-[1600px]">
        <header className="pt-12 mb-10 border-b border-[var(--nd-border)] pb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
              ODR-API — COMPANY PROFILE EXTRACTOR
            </p>
            <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
              Company Profile Extractor
            </h1>
            <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mt-2 max-w-xl">
              Discover and extract structured company profiles automatically.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cpe-reports">PAST RESULTS</Link>
          </Button>
        </header>

        <CpeProvider>
          <CpeLayout />
        </CpeProvider>
      </div>
    </main>
  )
}

function CpeLayout() {
  const { profiles, isRunning, messages, resetExtraction, currentQuery, plan } = useCpe()
  const hasProfiles = (profiles?.length ?? 0) > 0
  const showProgressPanel = Boolean(currentQuery) || isRunning || messages.length > 0 || Boolean(plan)

  const [shouldShowPlan, setShouldShowPlan] = useState(false)
  const [shouldShowForm, setShouldShowForm] = useState(true)

  useEffect(() => {
    if (plan && isRunning) {
      const t = setTimeout(() => {
        setShouldShowPlan(true)
        setShouldShowForm(false)
      }, 800)
      return () => clearTimeout(t)
    }
    if (plan && !isRunning) {
      setShouldShowPlan(true)
      setShouldShowForm(false)
    }
    if (!plan) {
      setShouldShowPlan(false)
      setShouldShowForm(true)
    }
  }, [plan, isRunning])

  return (
    <>
      <CpeQueryDisplay />

      {hasProfiles && !isRunning && (
        <div className="flex justify-start mb-6">
          <Button variant="outline" onClick={resetExtraction}>
            CLEAR &amp; RESTART
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {shouldShowPlan && plan && <ResearchPlanDisplay plan={plan} heading="Extraction plan" />}
          {shouldShowForm && <CpeForm />}
          <CpePipelineCard />
          {hasProfiles && <CpeProfiles />}
        </div>

        <div className="space-y-6">
          {showProgressPanel && <CpeViewer />}
        </div>
      </div>
    </>
  )
}
