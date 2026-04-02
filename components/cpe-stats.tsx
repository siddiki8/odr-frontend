"use client"

import { useCpe } from "@/hooks/use-cpe"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Globe, Search, Sigma, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export function CpeStats() {
  const { stats, profileCount } = useCpe()

  if (!stats) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p>Statistics appear when the run finishes and usage is returned.</p>
      </div>
    )
  }

  const tokenUsage = stats.token_usage ?? {}
  const totalTokens = Object.values(tokenUsage).reduce(
    (s, u) => s + (u?.total_tokens ?? 0),
    0,
  )
  const totalCost = Object.values(stats.estimated_cost ?? {}).reduce(
    (s, v) => s + v,
    0,
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="h-full">
      <h3 className="mb-3 text-lg font-medium text-card-foreground">Statistics</h3>
      <ScrollArea className="h-[500px] pr-4">
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={item}
            className="grid grid-cols-2 gap-3"
          >
            <div className="rounded-lg border border-border bg-muted/60 p-3">
              <div className="mb-1 flex items-center">
                <Search className="mr-1 h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Serper queries</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">
                {stats.serper_queries_used ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/60 p-3">
              <div className="mb-1 flex items-center">
                <Globe className="mr-1 h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Profiles</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">{profileCount}</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg border border-border bg-muted/60 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Sigma className="h-4 w-4 text-primary" />
              <span className="font-medium text-card-foreground">Tokens</span>
            </div>
            <p className="text-2xl font-semibold text-primary">{totalTokens.toLocaleString()}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg border border-border bg-muted/60 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-medium text-card-foreground">Est. cost</span>
            </div>
            <p className="text-2xl font-semibold text-primary">
              ${totalCost.toFixed(4)}
            </p>
          </motion.div>
        </motion.div>
      </ScrollArea>
    </div>
  )
}
