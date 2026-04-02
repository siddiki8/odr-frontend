"use client"

/**
 * Run overview for CPE. Deep Research shows a real writing plan from the API; CPE streams phase steps instead.
 * This card maps those steps to a familiar pipeline UI (front-end only).
 */

import { useCpe } from "@/hooks/use-cpe"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  DraftingCompass,
  Search,
  ScanLine,
  CheckCircle2,
  Rocket,
  Loader2,
} from "lucide-react"

const PHASES = [
  { step: "PLANNING", label: "Plan", minRank: 2, Icon: DraftingCompass },
  { step: "SEARCHING", label: "Search", minRank: 3, Icon: Search },
  { step: "EXTRACTING", label: "Extract", minRank: 4, Icon: ScanLine },
  { step: "COMPLETE", label: "Done", minRank: 5, Icon: CheckCircle2 },
] as const

const RANK: Record<string, number> = {
  STARTING: 0,
  INITIALIZING: 1,
  PLANNING: 2,
  SEARCHING: 3,
  EXTRACTING: 4,
  COMPLETE: 5,
  ERROR: -1,
}

export function CpePipelineCard() {
  const { messages, isRunning, currentQuery } = useCpe()

  if (!currentQuery && messages.length === 0) return null

  let maxRank = 0
  let sawComplete = false
  let sawError = false
  for (const m of messages) {
    if (m.step === "COMPLETE") sawComplete = true
    if (m.step === "ERROR") sawError = true
    maxRank = Math.max(maxRank, RANK[m.step] ?? 0)
  }
  if (sawComplete) maxRank = Math.max(maxRank, 5)

  const activePhaseIdx = (() => {
    if (sawError) return -1
    if (sawComplete) return PHASES.length - 1
    if (!isRunning && messages.length === 0) return -1
    for (let i = 0; i < PHASES.length; i++) {
      const done = maxRank > PHASES[i].minRank || (PHASES[i].step === "COMPLETE" && sawComplete)
      if (!done) return i
    }
    return PHASES.length - 1
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90 border-primary/10">
        <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]" />
        <CardHeader className="space-y-0 px-6 pb-3 pt-5">
          <div className="flex gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-lg bg-primary/10"
              aria-hidden
            >
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <CardTitle className="text-lg leading-snug text-card-foreground">
                Extraction pipeline
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Live phases from the agent. The detailed extraction plan (goal, search queries, sections) shows above when
                the backend sends it—same contract as Deep Research.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-0">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-0">
            {PHASES.map((phase, i) => {
              const done =
                sawComplete ||
                (!sawError && maxRank > phase.minRank) ||
                (phase.step === "COMPLETE" && sawComplete)
              const active =
                isRunning && !sawComplete && !sawError && i === activePhaseIdx

              return (
                <div
                  key={phase.step}
                  className="flex min-h-[2.25rem] items-center gap-x-1 sm:gap-x-2"
                >
                  <motion.div
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors",
                      done &&
                        "border-primary/40 bg-primary/10 text-card-foreground shadow-sm",
                      active &&
                        "border-primary ring-2 ring-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.25)]",
                      !done &&
                        !active &&
                        "border-border/60 bg-muted/30 text-muted-foreground",
                    )}
                    animate={active ? { scale: [1, 1.02, 1] } : {}}
                    transition={
                      active
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : {}
                    }
                  >
                    {active ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    ) : (
                      <phase.Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          done ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    )}
                    <span className="font-medium whitespace-nowrap">{phase.label}</span>
                  </motion.div>
                  {i < PHASES.length - 1 ? (
                    <span
                      className="inline-flex h-9 shrink-0 items-center justify-center px-0.5 text-sm leading-none text-muted-foreground/60 sm:px-1"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
