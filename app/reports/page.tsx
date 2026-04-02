"use client"

import { useState, useEffect } from "react"
import { getAllResearchReports } from "@/lib/research-service"
import type { ReportListItem } from "@/types/research"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllResearchReports()
      .then(setReports)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14 min-h-screen">
      <div className="container mx-auto px-6 pb-16 max-w-[1600px]">
        <header className="pt-12 mb-10 border-b border-[var(--nd-border)] pb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
              DEEP RESEARCH — ARCHIVE
            </p>
            <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
              Research Reports
            </h1>
            <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mt-2">
              Completed research tasks.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/deep_research">NEW RESEARCH</Link>
          </Button>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] py-12">
            [LOADING...]
          </p>
        ) : reports.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-grotesk text-lg text-[var(--nd-text-secondary)] mb-2">
              No reports yet.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)] mb-8">
              START A RESEARCH QUERY TO SEE RESULTS HERE
            </p>
            <Button asChild>
              <Link href="/deep_research">START RESEARCH</Link>
            </Button>
          </div>
        ) : (
          <div className="border border-[var(--nd-border)] rounded-xl overflow-hidden divide-y divide-[var(--nd-border)]">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--nd-surface-raised)]">
              <div className="col-span-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
                  #
                </span>
              </div>
              <div className="col-span-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
                  QUERY
                </span>
              </div>
              <div className="col-span-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
                  DATE
                </span>
              </div>
              <div className="col-span-1" />
            </div>

            {reports.map((report, i) => (
              <div
                key={report.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-[var(--nd-surface)] hover:bg-[var(--nd-surface-raised)] transition-colors"
              >
                <div className="col-span-1">
                  <span className="font-mono text-[11px] text-[var(--nd-text-disabled)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-7">
                  <p className="font-grotesk text-sm text-[var(--nd-text-primary)] line-clamp-1">
                    {report.query}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--nd-text-disabled)] mt-1">
                    {report.id.substring(0, 8)}...
                  </p>
                </div>
                <div className="col-span-3">
                  <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">
                    {formatDate(new Date(report.createdAt))}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/reports/${report.id}`}>VIEW</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
