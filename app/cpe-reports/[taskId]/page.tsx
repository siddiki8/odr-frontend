"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getCpeTaskById } from "@/lib/cpe-service"
import type { CpeTaskResult, CompanyProfile } from "@/types/cpe"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const formatNumber = (n: number | undefined): string =>
  n !== undefined ? n.toLocaleString() : "N/A"

const formatCurrency = (n: number | undefined): string =>
  n !== undefined ? `$${n.toFixed(4)}` : "N/A"

const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--nd-border)]">
    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">{label}</span>
    <span className="font-mono text-[13px] text-[var(--nd-text-primary)]">{value}</span>
  </div>
)

function ProfileCard({ profile, index }: { profile: CompanyProfile; index: number }) {
  const domain = profile.website
    ? (() => {
        try {
          return new URL(
            profile.website.startsWith("http") ? profile.website : `https://${profile.website}`,
          ).hostname
        } catch {
          return profile.website
        }
      })()
    : null

  const known = new Set(["name", "website", "description", "industry", "location", "size", "founded", "linkedin", "email", "phone"])
  const extras = Object.entries(profile).filter(([k, v]) => !known.has(k) && v !== undefined && v !== null && v !== "")

  return (
    <div className="border border-[var(--nd-border)] rounded-lg bg-[var(--nd-surface)] p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-1">
            {String(index + 1).padStart(2, "0")} — COMPANY
          </p>
          <h3 className="font-grotesk text-base font-medium text-[var(--nd-text-display)]">
            {profile.name ?? "Unknown Company"}
          </h3>
        </div>
        {profile.website && (
          <a
            href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)] hover:text-[var(--nd-text-primary)] border-b border-[var(--nd-border-visible)] shrink-0"
          >
            {domain ?? "VISIT"}
          </a>
        )}
      </div>

      {profile.description && (
        <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mb-3 line-clamp-3">
          {profile.description}
        </p>
      )}

      <div className="space-y-1 border-t border-[var(--nd-border)] pt-3">
        {profile.location && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">LOCATION</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.location}</span>
          </div>
        )}
        {profile.industry && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">INDUSTRY</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.industry}</span>
          </div>
        )}
        {profile.size && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">SIZE</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.size}</span>
          </div>
        )}
        {profile.founded && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">FOUNDED</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{String(profile.founded)}</span>
          </div>
        )}
      </div>

      {extras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {extras.slice(0, 6).map(([k, v]) => (
            <span
              key={k}
              className="font-mono text-[10px] uppercase tracking-[0.04em] border border-[var(--nd-border-visible)] text-[var(--nd-text-disabled)] px-2 py-0.5 rounded-full"
            >
              {k.replace(/_/g, " ")}: {String(v)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CpeDetailPage() {
  const { taskId } = useParams() as { taskId: string }
  const [task, setTask] = useState<CpeTaskResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!taskId) return
    getCpeTaskById(taskId)
      .then((data) => {
        if (data) setTask(data)
        else setFetchError(true)
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [taskId])

  const handleDownload = () => {
    if (!task?.profiles) return
    const blob = new Blob([JSON.stringify(task.profiles, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${taskId}-profiles.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadStatus("[DOWNLOADED]")
    setTimeout(() => setDownloadStatus(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">
            [LOADING...]
          </p>
        </div>
      </div>
    )
  }

  if (!task || fetchError) {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-accent)] mb-4">
            [RESULT NOT FOUND]
          </p>
          <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mb-6">
            No CPE task found for ID: <code className="font-mono text-[var(--nd-text-primary)]">{taskId}</code>
          </p>
          <Button asChild variant="ghost">
            <Link href="/cpe-reports">← BACK TO RESULTS</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (task.status !== "COMPLETED") {
    return (
      <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-4">
            STATUS — {task.status}
          </p>
          <p className="font-grotesk text-base text-[var(--nd-text-primary)] mb-2">&ldquo;{task.query}&rdquo;</p>
          {task.status === "ERROR" && task.error && (
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-accent)] mt-2">
              [ERROR: {task.error}]
            </p>
          )}
          <div className="mt-6">
            <Button asChild variant="ghost">
              <Link href="/cpe-reports">← BACK TO RESULTS</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const completedDate = task.completedAt ? new Date(task.completedAt) : null
  const profiles = task.profiles ?? []
  const totalTokens = Object.values(task.usageStatistics?.token_usage ?? {}).reduce((s, u) => s + (u?.total_tokens ?? 0), 0)
  const totalCost = Object.values(task.usageStatistics?.estimated_cost ?? {}).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0)

  return (
    <div className="min-h-screen bg-[var(--nd-bg)] pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Button asChild variant="ghost">
            <Link href="/cpe-reports">← CPE RESULTS</Link>
          </Button>
          <div className="flex items-center gap-4">
            {completedDate && (
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
                {formatDate(completedDate)}
              </p>
            )}
            {downloadStatus && (
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-success)]">
                {downloadStatus}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={profiles.length === 0}>
              EXPORT JSON
            </Button>
          </div>
        </div>

        {/* Page header */}
        <header className="mb-10 border-b border-[var(--nd-border)] pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            COMPANY PROFILE EXTRACTION — RESULT
          </p>
          <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] mb-3">
            {task.query}
          </h1>
          <div className="flex flex-wrap gap-6">
            {task.location && (
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">
                LOCATION — {task.location}
              </p>
            )}
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">
              PROFILES — {task.profileCount ?? profiles.length}
            </p>
            {task.processedDomainCount !== undefined && (
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]">
                DOMAINS — {task.processedDomainCount}
              </p>
            )}
          </div>
        </header>

        {/* Stats summary */}
        {task.usageStatistics && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: "SERPER QUERIES", value: formatNumber(task.usageStatistics.serper_queries_used) },
              { label: "TOTAL TOKENS", value: formatNumber(totalTokens) },
              { label: "EST. COST", value: formatCurrency(totalCost) },
            ].map((stat) => (
              <div key={stat.label} className="border border-[var(--nd-border)] rounded-lg p-4 bg-[var(--nd-surface)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-2">{stat.label}</p>
                <p className="font-mono text-lg text-[var(--nd-text-display)]">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Profiles grid */}
        {profiles.length > 0 ? (
          <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
            <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
                COMPANY PROFILES — {profiles.length}
              </p>
            </div>
            <div className="p-6">
              <ScrollArea className="h-[700px] pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profiles.map((profile, i) => (
                    <ProfileCard key={i} profile={profile} index={i} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="border border-[var(--nd-border-visible)] rounded-xl bg-[var(--nd-surface)] p-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
              [NO PROFILE DATA STORED FOR THIS TASK]
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
