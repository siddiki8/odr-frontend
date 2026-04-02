"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getResearchReportById } from "@/lib/research-service"
import type { TaskResultResponse, ResearchPlan } from "@/types/research"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { ResearchPlanDisplay } from "@/components/research-plan"

const formatNumber = (num: number | undefined): string =>
  num !== undefined ? num.toLocaleString() : "N/A"

const formatCurrency = (num: number | undefined): string =>
  num !== undefined ? `$${num.toFixed(4)}` : "N/A"

function extractTitle(reportContent: string | undefined): string {
  if (!reportContent) return "Research Report"
  for (const line of reportContent.split("\n")) {
    if (line.startsWith("# ")) return line.substring(2)
  }
  return "Untitled Research Report"
}

const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--nd-border)]">
    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">{label}</span>
    <span className="font-mono text-[13px] text-[var(--nd-text-primary)]">{value}</span>
  </div>
)

export default function ReportDetailPage() {
  const { taskId } = useParams() as { taskId: string }
  const [reportData, setReportData] = useState<TaskResultResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("report")
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!taskId) return
    setLoading(true)
    getResearchReportById(taskId)
      .then((data) => {
        if (data) setReportData(data)
        else setFetchError("Task not found")
      })
      .catch(() => setFetchError("Failed to load report"))
      .finally(() => setLoading(false))
  }, [taskId])

  const handleCopy = async () => {
    if (!reportData?.report) return
    try {
      await navigator.clipboard.writeText(reportData.report)
      setCopyStatus("[COPIED]")
      setTimeout(() => setCopyStatus(null), 2000)
    } catch {
      setCopyStatus("[COPY FAILED]")
      setTimeout(() => setCopyStatus(null), 2000)
    }
  }

  const handleDownload = () => {
    if (!reportData?.report) return
    const blob = new Blob([reportData.report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${taskId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
            [LOADING REPORT...]
          </p>
        </div>
      </div>
    )
  }

  if (!reportData || fetchError) {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-accent)] mb-4">
            [REPORT NOT FOUND]
          </p>
          <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mb-6">
            No report found for ID: <code className="font-mono text-[var(--nd-text-primary)]">{taskId}</code>
          </p>
          <Button asChild variant="ghost">
            <Link href="/reports">← BACK TO REPORTS</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (reportData.status !== "COMPLETED") {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-4">
            STATUS — {reportData.status}
          </p>
          <p className="font-grotesk text-base text-[var(--nd-text-primary)] mb-2">
            &ldquo;{reportData.query}&rdquo;
          </p>
          {reportData.status === "ERROR" && reportData.error && (
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-accent)] mt-2">
              [ERROR: {reportData.error}]
            </p>
          )}
          <div className="mt-6">
            <Button asChild variant="ghost">
              <Link href="/reports">← BACK TO REPORTS</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const completedDate = reportData.updatedAt ? new Date(reportData.updatedAt) : null
  const isValidDate = completedDate && !isNaN(completedDate.getTime())

  return (
    <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Button asChild variant="ghost">
            <Link href="/reports">← REPORTS</Link>
          </Button>
          {isValidDate && (
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
              {formatDate(completedDate)}
            </p>
          )}
        </div>

        {/* Page header */}
        <header className="mb-10 border-b border-[var(--nd-border)] pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            DEEP RESEARCH — REPORT
          </p>
          <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] mb-4">
            {extractTitle(reportData.report)}
          </h1>
          <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] max-w-2xl">
            {reportData.query}
          </p>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-1 mb-8 bg-transparent p-0 border-b border-[var(--nd-border)] pb-0">
            {["report", "sources", "stats", "plan"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="font-mono text-[11px] uppercase tracking-[0.08em] px-0 pb-3 mr-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--nd-text-display)] data-[state=active]:text-[var(--nd-text-display)] text-[var(--nd-text-disabled)] bg-transparent"
              >
                {tab.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Report */}
          <TabsContent value="report" className="mt-0">
            <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
              <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)] flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">FINAL REPORT</p>
                <div className="flex items-center gap-3">
                  {copyStatus && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-success)]">{copyStatus}</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleCopy}>COPY</Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>DOWNLOAD .MD</Button>
                </div>
              </div>
              <div className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        a: ({ node, ...props }) => <a {...props} className="text-[var(--nd-accent)] hover:underline" target="_blank" rel="noopener noreferrer" />,
                        table: ({ node, ...props }) => <table {...props} className="min-w-full border border-[var(--nd-border)] my-4 font-mono text-sm" />,
                        thead: ({ node, ...props }) => <thead {...props} className="bg-[var(--nd-surface-raised)]" />,
                        th: ({ node, ...props }) => <th {...props} className="border border-[var(--nd-border)] p-2 text-left font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]" />,
                        td: ({ node, ...props }) => <td {...props} className="border border-[var(--nd-border)] p-2 font-grotesk text-sm text-[var(--nd-text-primary)]" />,
                        h1: ({ node, ...props }) => <h1 {...props} className="font-grotesk text-2xl font-medium text-[var(--nd-text-display)] mt-8 mb-4" />,
                        h2: ({ node, ...props }) => <h2 {...props} className="font-grotesk text-xl font-medium text-[var(--nd-text-display)] mt-6 mb-3" />,
                        h3: ({ node, ...props }) => <h3 {...props} className="font-grotesk text-base font-medium text-[var(--nd-text-primary)] mt-5 mb-2" />,
                        p: ({ node, ...props }) => <p {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 leading-relaxed" />,
                        code: ({ node, ...props }) => <code {...props} className="font-mono text-[12px] bg-[var(--nd-surface-raised)] border border-[var(--nd-border)] px-1.5 py-0.5 rounded" />,
                        pre: ({ node, ...props }) => <pre {...props} className="font-mono text-[12px] bg-[var(--nd-surface-raised)] border border-[var(--nd-border)] rounded-lg p-4 overflow-x-auto mb-4" />,
                        ul: ({ node, ...props }) => <ul {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 space-y-1 list-disc pl-5" />,
                        ol: ({ node, ...props }) => <ol {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 space-y-1 list-decimal pl-5" />,
                        blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-2 border-[var(--nd-border-visible)] pl-4 text-[var(--nd-text-secondary)] my-4" />,
                      }}
                    >
                      {reportData.report ?? "No report content."}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Sources */}
          <TabsContent value="sources" className="mt-0">
            <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
              <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
                  SOURCES — {reportData.sources?.length ?? 0}
                </p>
              </div>
              <div className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  {reportData.sources && reportData.sources.length > 0 ? (
                    <div className="space-y-2">
                      {reportData.sources.map((source, index) => (
                        <div key={index} className="border-b border-[var(--nd-border)] py-3 flex items-start gap-4">
                          <span className="font-mono text-[11px] text-[var(--nd-text-disabled)] shrink-0 mt-0.5">
                            {String(source.rank || source.ref_num || index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            {source.link ? (
                              <a
                                href={source.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-grotesk text-sm text-[var(--nd-text-primary)] hover:text-[var(--nd-accent)] break-words"
                              >
                                {source.title ?? source.link}
                              </a>
                            ) : (
                              <p className="font-grotesk text-sm text-[var(--nd-text-primary)]">{source.title ?? "Untitled"}</p>
                            )}
                            {source.link && (
                              <p className="font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--nd-text-disabled)] mt-1">
                                {(() => { try { return new URL(source.link).hostname } catch { return source.link } })()}
                              </p>
                            )}
                          </div>
                          {source.score !== undefined && (
                            <span className="font-mono text-[11px] text-[var(--nd-text-disabled)] shrink-0">
                              {source.score.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)] text-center py-8">
                      [NO SOURCES AVAILABLE]
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Stats */}
          <TabsContent value="stats" className="mt-0">
            <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
              <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">USAGE STATISTICS</p>
              </div>
              <div className="p-6">
                {reportData.usageStatistics ? (
                  <div className="space-y-6">
                    <section>
                      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">USAGE</p>
                      <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                        <StatRow label="SERPER QUERIES" value={formatNumber(reportData.usageStatistics.serper_queries_used)} />
                        <StatRow label="SOURCES PROCESSED" value={formatNumber(reportData.usageStatistics.sources_processed_count)} />
                        <StatRow label="REFINEMENT ITERATIONS" value={formatNumber(reportData.usageStatistics.refinement_iterations_run)} />
                      </div>
                    </section>

                    {reportData.usageStatistics.token_usage && (
                      <section>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">TOKENS</p>
                        <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                          {Object.entries(reportData.usageStatistics.token_usage).map(([role, usage]) => {
                            if (role === "total" || !usage) return null
                            return <StatRow key={role} label={role.toUpperCase()} value={formatNumber(usage.total_tokens)} />
                          })}
                          <div className="flex items-center justify-between py-3">
                            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-display)]">TOTAL</span>
                            <span className="font-mono text-[13px] text-[var(--nd-text-display)]">
                              {formatNumber(Object.values(reportData.usageStatistics.token_usage).reduce((s, u) => s + (u?.total_tokens ?? 0), 0))}
                            </span>
                          </div>
                        </div>
                      </section>
                    )}

                    {reportData.usageStatistics.estimated_cost && (
                      <section>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">ESTIMATED COST</p>
                        <div className="border border-[var(--nd-border)] rounded-lg overflow-hidden">
                          {Object.entries(reportData.usageStatistics.estimated_cost).map(([role, cost]) => {
                            if (typeof cost !== "number") return null
                            return <StatRow key={role} label={role.toUpperCase()} value={formatCurrency(cost)} />
                          })}
                        </div>
                      </section>
                    )}
                  </div>
                ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)] text-center py-8">
                    [NO STATISTICS AVAILABLE]
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Plan */}
          <TabsContent value="plan" className="mt-0">
            {reportData.plan ? (
              <ResearchPlanDisplay plan={reportData.plan} heading="Research Plan" />
            ) : (
              <div className="border border-[var(--nd-border-visible)] rounded-xl bg-[var(--nd-surface)] p-8 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
                  [NO PLAN DATA AVAILABLE]
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
