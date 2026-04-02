"use client"

import { ResearchForm } from "@/components/research-form"
import { ResearchViewer } from "@/components/research-viewer"
import { ResearchProvider } from "@/components/research-provider"
import { ResearchPlanDisplay } from "@/components/research-plan"
import { ResearchReport } from "@/components/research-report"
import { QueryDisplay } from "@/components/query-display"
import { useResearch } from "@/hooks/use-research"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DeepResearchPage() {
  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14">
      <div className="container mx-auto px-6 pb-16 max-w-[1600px]">
        {/* Page header */}
        <header className="pt-12 mb-10 flex items-end justify-between border-b border-[var(--nd-border)] pb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
              OPEN DEEP RESEARCH — AGENCY
            </p>
            <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
              Deep Research
            </h1>
            <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mt-2 max-w-xl">
              Comprehensive web analysis synthesized into a detailed report.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/reports">REPORTS</Link>
          </Button>
        </header>

        {/* Notice */}
        <div className="mb-8 border border-[var(--nd-border-visible)] rounded-lg px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
            ⚡ NOTICE — Using a small model for testing. Larger models generate significantly more powerful results.
            Contact{" "}
            <a
              href="mailto:siddiki@luminarysolutions.ai"
              className="text-[var(--nd-interactive)] hover:underline"
            >
              siddiki@luminarysolutions.ai
            </a>{" "}
            for funding or collaboration.
          </p>
        </div>

        <ResearchProvider>
          <DynamicResearchLayout />
        </ResearchProvider>
      </div>
    </main>
  )
}

function DynamicResearchLayout() {
  const { plan, report, isResearching, currentQuery, resetUIState } = useResearch()
  const [shouldShowPlan, setShouldShowPlan] = useState(false)
  const [shouldShowReport, setShouldShowReport] = useState(false)
  const [shouldShowForm, setShouldShowForm] = useState(true)

  useEffect(() => {
    if (plan && isResearching) {
      const timer = setTimeout(() => {
        setShouldShowPlan(true)
        setShouldShowForm(false)
        setShouldShowReport(false)
      }, 800)
      return () => clearTimeout(timer)
    } else if (report && !isResearching) {
      const timer = setTimeout(() => {
        setShouldShowReport(true)
        setShouldShowPlan(true)
        setShouldShowForm(false)
      }, 1200)
      return () => clearTimeout(timer)
    } else if (!plan && !report) {
      setShouldShowForm(true)
      setShouldShowPlan(false)
      setShouldShowReport(false)
    } else if (isResearching && !plan) {
      setShouldShowForm(false)
      setShouldShowPlan(false)
      setShouldShowReport(false)
    }
  }, [plan, report, isResearching])

  return (
    <>
      {currentQuery && <QueryDisplay />}

      {report && !isResearching && (
        <div className="flex justify-start mb-6">
          <Button variant="outline" onClick={resetUIState}>
            NEW REPORT
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {shouldShowPlan && plan && <ResearchPlanDisplay />}
          {shouldShowForm && <ResearchForm />}
        </div>

        <div className="space-y-6">
          {shouldShowReport && report && <ResearchReport />}
          {(isResearching || shouldShowPlan || shouldShowReport) && <ResearchViewer />}
        </div>
      </div>
    </>
  )
}
