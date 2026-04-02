"use client"

import { useState, useEffect } from "react"
import { getAllCpeTasks } from "@/lib/cpe-service"
import type { CpeListItem } from "@/types/cpe"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function CpeReportsPage() {
  const [tasks, setTasks] = useState<CpeListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCpeTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14 min-h-screen">
      <div className="container mx-auto px-6 pb-16 max-w-[1600px]">
        <header className="pt-12 mb-10 border-b border-[var(--nd-border)] pb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
              CPE — ARCHIVE
            </p>
            <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
              CPE Results
            </h1>
            <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mt-2">
              Completed company profile extraction tasks.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cpe">NEW EXTRACTION</Link>
          </Button>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] py-12">
            [LOADING...]
          </p>
        ) : tasks.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-grotesk text-lg text-[var(--nd-text-secondary)] mb-2">
              No extractions yet.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)] mb-8">
              RUN YOUR FIRST COMPANY PROFILE EXTRACTION
            </p>
            <Button asChild>
              <Link href="/cpe">START EXTRACTION</Link>
            </Button>
          </div>
        ) : (
          <div className="border border-[var(--nd-border)] rounded-xl overflow-hidden divide-y divide-[var(--nd-border)]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--nd-surface-raised)]">
              <div className="col-span-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">#</span>
              </div>
              <div className="col-span-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">QUERY</span>
              </div>
              <div className="col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">LOCATION</span>
              </div>
              <div className="col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">PROFILES</span>
              </div>
              <div className="col-span-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)]">DATE</span>
              </div>
              <div className="col-span-1" />
            </div>

            {tasks.map((task, i) => (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-[var(--nd-surface)] hover:bg-[var(--nd-surface-raised)] transition-colors"
              >
                <div className="col-span-1">
                  <span className="font-mono text-[11px] text-[var(--nd-text-disabled)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-5">
                  <p className="font-grotesk text-sm text-[var(--nd-text-primary)] line-clamp-1">{task.query}</p>
                  <p className="font-mono text-[10px] text-[var(--nd-text-disabled)] mt-1">{task.id.substring(0, 8)}...</p>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">
                    {task.location ?? "—"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[11px] text-[var(--nd-text-primary)]">
                    {task.profileCount !== undefined ? `${task.profileCount}` : "—"}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">
                    {formatDate(new Date(task.createdAt))}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/cpe-reports/${task.id}`}>VIEW</Link>
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
