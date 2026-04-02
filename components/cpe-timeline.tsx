"use client"

import { useCpe } from "@/hooks/use-cpe"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

function pickUrl(details: Record<string, unknown> | null | undefined): string | null {
  if (!details) return null
  const raw =
    details.source_url ??
    details.url ??
    details.link ??
    details.domain ??
    details.website
  if (typeof raw === "string" && raw.length > 0) return raw
  return null
}

function hostnameFromUrl(raw: string): string {
  try {
    const u = raw.includes("://") ? new URL(raw) : new URL(`https://${raw}`)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return raw
  }
}

function UrlBadge({ url }: { url: string }) {
  const host = hostnameFromUrl(url)
  const faviconUrl = `https://icons.duckduckgo.com/ip3/${host}.ico`
  return (
    <span className="inline-flex items-center gap-1.5 border border-[var(--nd-border-visible)] bg-[var(--nd-surface-raised)] px-2 py-1 rounded font-mono text-[10px] text-[var(--nd-text-secondary)] mt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={faviconUrl}
        alt=""
        width={12}
        height={12}
        className="rounded-sm object-contain shrink-0"
        onError={(e) => { e.currentTarget.style.display = "none" }}
      />
      <span className="truncate max-w-[200px]" title={url}>{host}</span>
    </span>
  )
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "END":
    case "SUCCESS":
    case "COMPLETE":
      return "border-[var(--nd-success)] text-[var(--nd-success)]"
    case "ERROR":
    case "FATAL":
      return "border-[var(--nd-accent)] text-[var(--nd-accent)]"
    default:
      return "border-[var(--nd-border-visible)] text-[var(--nd-text-secondary)]"
  }
}

export function CpeTimeline() {
  const { messages, isRunning } = useCpe()

  const visible = messages.filter((m) => m.step !== "CONTROL")

  if (visible.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
          [NO EVENTS YET]
        </p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-4">TIMELINE</p>
      <ScrollArea className="h-[500px] pr-4 relative">
        <div className="space-y-0">
          {visible.map((msg, index) => {
            const isLast = index === visible.length - 1
            const isActive = isLast && isRunning
            const isError = msg.status === "ERROR" || msg.status === "FATAL"
            const isComplete = msg.status === "END" || msg.status === "SUCCESS" || msg.status === "COMPLETE"
            const url = pickUrl(msg.details as Record<string, unknown> | undefined)

            return (
              <div
                key={`${msg.step}-${index}-${msg.message.slice(0, 24)}`}
                className="relative flex items-start gap-4 pb-6"
              >
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="absolute left-[19px] top-6 bottom-0 w-px bg-[var(--nd-border)]" />
                )}

                {/* Dot node */}
                <div
                  className={cn(
                    "mt-1 flex-shrink-0 h-3 w-3 rounded-full border-2 z-10 ml-2",
                    isError
                      ? "bg-[var(--nd-accent)] border-[var(--nd-accent)]"
                      : isComplete
                      ? "bg-[var(--nd-success)] border-[var(--nd-success)]"
                      : isActive
                      ? "bg-[var(--nd-accent)] border-[var(--nd-accent)]"
                      : "bg-transparent border-[var(--nd-border-visible)]"
                  )}
                />

                {/* Content */}
                <div
                  className={cn(
                    "min-w-0 flex-1 rounded-lg border p-4",
                    "border-[var(--nd-border)] bg-[var(--nd-surface-raised)]",
                    isActive && "border-l-2 border-l-[var(--nd-accent)]",
                    isError && "border-l-2 border-l-[var(--nd-accent)]",
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-display)]">
                      {msg.step}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-[0.06em] border px-2 py-0.5 rounded-full",
                        getStatusBadgeClass(msg.status)
                      )}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] break-words">{msg.message}</p>
                  {url ? <UrlBadge url={url} /> : null}
                </div>
              </div>
            )
          })}
        </div>

        {isRunning && visible.length > 0 && (
          <p className="pl-10 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">
            [RECEIVING UPDATES...]
          </p>
        )}
      </ScrollArea>
    </div>
  )
}
