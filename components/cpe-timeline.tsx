"use client"

import { useCpe } from "@/hooks/use-cpe"
import type { CpeMessage } from "@/types/cpe"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Check,
  AlertCircle,
  Clock,
  Info,
  Loader2,
  X,
  Layers3,
  Search,
  ScanLine,
  DraftingCompass,
  Rocket,
  Building2,
  AlertTriangle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type GlowKey =
  | "INITIALIZING"
  | "PLANNING"
  | "SEARCHING"
  | "EXTRACTING"
  | "COMPLETE"
  | "ERROR"
  | "CONNECTION"
  | "CONTROL"
  | "DEFAULT"

function stepToGlowKey(step: string): GlowKey {
  switch (step) {
    case "INITIALIZING":
      return "INITIALIZING"
    case "PLANNING":
      return "PLANNING"
    case "SEARCHING":
      return "SEARCHING"
    case "EXTRACTING":
      return "EXTRACTING"
    case "COMPLETE":
      return "COMPLETE"
    case "ERROR":
      return "ERROR"
    case "CONNECTION":
      return "CONNECTION"
    case "CONTROL":
      return "CONTROL"
    case "STARTING":
      return "INITIALIZING"
    default:
      return "DEFAULT"
  }
}

function getGlowClass(key: GlowKey): string {
  switch (key) {
    case "INITIALIZING":
      return "timeline-glow-purple"
    case "PLANNING":
      return "timeline-glow-cyan"
    case "SEARCHING":
      return "timeline-glow-blue"
    case "EXTRACTING":
      return "timeline-glow-emerald"
    case "COMPLETE":
      return "timeline-glow-green"
    case "ERROR":
      return "timeline-glow-red"
    case "CONNECTION":
      return "timeline-glow-gray"
    case "CONTROL":
      return "timeline-glow-gray"
    default:
      return "timeline-glow-indigo"
  }
}

function getStepIcon(step: string) {
  switch (step) {
    case "STARTING":
    case "INITIALIZING":
      return <Layers3 className="h-5 w-5" />
    case "PLANNING":
      return <DraftingCompass className="h-5 w-5" />
    case "SEARCHING":
      return <Search className="h-5 w-5" />
    case "EXTRACTING":
      return <ScanLine className="h-5 w-5" />
    case "COMPLETE":
      return <Check className="h-5 w-5 text-green-500" />
    case "ERROR":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case "CONNECTION":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case "CONTROL":
      return <Rocket className="h-5 w-5 text-muted-foreground" />
    default:
      return <Building2 className="h-5 w-5" />
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "END":
    case "SUCCESS":
    case "COMPLETE":
      return <Check className="h-4 w-4 text-green-400" />
    case "START":
      return <Clock className="h-4 w-4 text-blue-400" />
    case "ERROR":
    case "FATAL":
      return <X className="h-4 w-4 text-red-400" />
    case "IN_PROGRESS":
    case "ACTIVE":
      return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
    case "INFO":
      return <Info className="h-4 w-4 text-blue-400" />
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "END":
    case "SUCCESS":
    case "COMPLETE":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
    case "START":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
    case "ERROR":
    case "FATAL":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
    case "IN_PROGRESS":
    case "ACTIVE":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
    case "INFO":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700"
  }
}

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
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs text-muted-foreground mt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={faviconUrl}
        alt=""
        width={14}
        height={14}
        className="rounded-sm object-contain shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
      <span className="truncate font-mono text-[11px] max-w-[220px]" title={url}>
        {host}
      </span>
    </span>
  )
}

export function CpeTimeline() {
  const { messages, isRunning } = useCpe()

  const visible = messages.filter((m) => m.step !== "CONTROL")

  return (
    <div className="h-full">
      <TooltipProvider delayDuration={150}>
        <h3 className="text-lg font-medium text-card-foreground mb-3">Timeline</h3>
        <ScrollArea className="h-[500px] pr-4 relative">
          <AnimatePresence initial={false}>
            {visible.map((msg, index) => {
              const glowKey = stepToGlowKey(msg.step)
              const isLast = index === visible.length - 1
              const active = isLast && isRunning
              const url = pickUrl(msg.details as Record<string, unknown> | undefined)

              return (
                <motion.div
                  key={`${msg.step}-${index}-${msg.message.slice(0, 24)}`}
                  className={cn(
                    "relative flex items-start space-x-4 pb-6",
                    !isLast ? "timeline-line" : "",
                  )}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className={cn(
                      "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 z-10 mx-1",
                      "border-border bg-background/80",
                      active && "active-node",
                    )}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>{getStepIcon(msg.step)}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={6}>
                        <p>{msg.step}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div
                    className={cn(
                      "min-w-0 flex-1 overflow-hidden rounded-lg border p-4 shadow-sm",
                      "border-border bg-background/80",
                      active && getGlowClass(glowKey),
                    )}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{msg.step}</h4>
                      <Badge
                        variant="outline"
                        className={cn("font-mono text-xs", getStatusColor(msg.status))}
                      >
                        {getStatusIcon(msg.status)}
                        <span className="ml-1.5">{msg.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{msg.message}</p>
                    {url ? <UrlBadge url={url} /> : null}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {isRunning && visible.length > 0 ? (
            <motion.p
              className="pl-10 text-sm italic text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Next updates appear as the agent runs…
            </motion.p>
          ) : null}
        </ScrollArea>
      </TooltipProvider>
    </div>
  )
}
