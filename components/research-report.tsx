"use client"

import { useResearch } from "@/hooks/use-research"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

export function ResearchReport() {
  const { report } = useResearch()
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const router = useRouter()

  const handleCopy = async () => {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report)
      setCopyStatus("[COPIED]")
      setTimeout(() => setCopyStatus(null), 2000)
    } catch {
      setCopyStatus("[COPY FAILED]")
      setTimeout(() => setCopyStatus(null), 2000)
    }
  }

  const handleDownload = () => {
    if (!report) return
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "research-report.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!report) return null

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)] flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          FINAL RESEARCH REPORT
        </p>
        <div className="flex items-center gap-3">
          {copyStatus && (
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-success)]">
              {copyStatus}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            COPY
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            DOWNLOAD .MD
          </Button>
        </div>
      </div>

      <div className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-[var(--nd-accent)] hover:underline" target="_blank" rel="noopener noreferrer" />
                ),
                table: ({ node, ...props }) => (
                  <table {...props} className="min-w-full border border-[var(--nd-border)] my-4 font-mono text-sm" />
                ),
                thead: ({ node, ...props }) => (
                  <thead {...props} className="bg-[var(--nd-surface-raised)]" />
                ),
                th: ({ node, ...props }) => (
                  <th {...props} className="border border-[var(--nd-border)] p-2 text-left font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)]" />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="border border-[var(--nd-border)] p-2 font-grotesk text-sm text-[var(--nd-text-primary)]" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="font-grotesk text-2xl font-medium text-[var(--nd-text-display)] mt-8 mb-4" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="font-grotesk text-xl font-medium text-[var(--nd-text-display)] mt-6 mb-3" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="font-grotesk text-base font-medium text-[var(--nd-text-primary)] mt-5 mb-2" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 leading-relaxed" />
                ),
                code: ({ node, ...props }) => (
                  <code {...props} className="font-mono text-[12px] bg-[var(--nd-surface-raised)] border border-[var(--nd-border)] px-1.5 py-0.5 rounded text-[var(--nd-text-primary)]" />
                ),
                pre: ({ node, ...props }) => (
                  <pre {...props} className="font-mono text-[12px] bg-[var(--nd-surface-raised)] border border-[var(--nd-border)] rounded-lg p-4 overflow-x-auto mb-4" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 space-y-1 list-disc pl-5" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="font-grotesk text-sm text-[var(--nd-text-primary)] mb-4 space-y-1 list-decimal pl-5" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote {...props} className="border-l-2 border-[var(--nd-border-visible)] pl-4 text-[var(--nd-text-secondary)] my-4" />
                ),
              }}
            >
              {report}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
