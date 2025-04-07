"use client"

import { useResearch } from "@/hooks/use-research"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Clock, Database, FileText, RefreshCw, Search, Server, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function ResearchStats() {
  const { stats, messages } = useResearch()

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
        <p>No statistics available yet.</p>
      </div>
    )
  }

  // Calculate step durations
  const stepDurations: Record<string, { start: number; end: number }> = {}
  const stepTimestamps: Record<string, number[]> = {}

  messages.forEach((msg, index) => {
    const timestamp = index // Using index as a proxy for timestamp

    if (!stepTimestamps[msg.step]) {
      stepTimestamps[msg.step] = []
    }
    stepTimestamps[msg.step].push(timestamp)

    if (msg.status === "START") {
      stepDurations[msg.step] = { start: timestamp, end: timestamp }
    } else if (msg.status === "END" && stepDurations[msg.step]) {
      stepDurations[msg.step].end = timestamp
    }
  })

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-medium mb-3 text-card-foreground">Statistics</h3>
      <ScrollArea className="h-[500px] pr-4">
        <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
          <div className="grid grid-cols-2 gap-3">
            <motion.div className="bg-muted/60 p-3 rounded-lg border border-border" variants={item}>
              <div className="flex items-center mb-1">
                <Search className="h-4 w-4 mr-1 text-primary" />
                <span className="text-muted-foreground text-sm">Searches</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">{stats.usage?.serper_queries_used || 0}</p>
            </motion.div>

            <motion.div className="bg-muted/60 p-3 rounded-lg border border-border" variants={item}>
              <div className="flex items-center mb-1">
                <Server className="h-4 w-4 mr-1 text-primary" />
                <span className="text-muted-foreground text-sm">Sources</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">{stats.usage?.sources_processed_count || 0}</p>
            </motion.div>

            <motion.div className="bg-muted/60 p-3 rounded-lg border border-border" variants={item}>
              <div className="flex items-center mb-1">
                <RefreshCw className="h-4 w-4 mr-1 text-primary" />
                <span className="text-muted-foreground text-sm">Refinements</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">{stats.usage?.refinement_iterations_run || 0}</p>
            </motion.div>

            <motion.div className="bg-muted/60 p-3 rounded-lg border border-border" variants={item}>
              <div className="flex items-center mb-1">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                <span className="text-muted-foreground text-sm">Report Size</span>
              </div>
              <p className="text-xl font-medium text-card-foreground">
                {stats.final_report_length ? `${Math.round(stats.final_report_length / 1000)}K` : "N/A"}
              </p>
            </motion.div>
          </div>

          {/* Token Usage */}
          <motion.div variants={item}>
            <div className="bg-background/80 rounded-lg p-3 border border-border">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium text-card-foreground">Token Usage</h3>
              </div>
              <div className="space-y-1 text-sm">
                {stats.usage?.token_usage &&
                  Object.entries(stats.usage.token_usage).map(([role, usage]) => {
                    if (role === "total") return null
                    if (!usage || typeof usage !== "object") return null

                    return (
                      <div key={role} className="flex justify-between items-center">
                        <span className="text-foreground capitalize">{role}</span>
                        <span className="text-muted-foreground">{usage.total_tokens?.toLocaleString() || 0}</span>
                      </div>
                    )
                  })}
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <span className="text-card-foreground font-medium">Total</span>
                  <span className="text-primary font-medium">
                    {stats.usage?.token_usage?.total?.total_tokens?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div variants={item}>
            <div className="bg-background/80 rounded-lg p-3 border border-border">
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium text-card-foreground">Cost Breakdown</h3>
              </div>
              <div className="space-y-1 text-sm">
                {stats.usage?.estimated_cost &&
                  Object.entries(stats.usage.estimated_cost).map(([role, cost]) => {
                    if (role === "total") return null
                    if (typeof cost !== "number") return null
                    return (
                      <div key={role} className="flex justify-between items-center">
                        <span className="text-foreground capitalize">{role}</span>
                        <span className="text-muted-foreground">${cost.toFixed(4)}</span>
                      </div>
                    )
                  })}
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <span className="text-card-foreground font-medium">Total</span>
                  <span className="text-primary font-medium">
                    $
                    {typeof stats.usage?.estimated_cost?.total === "number"
                      ? stats.usage.estimated_cost.total.toFixed(4)
                      : "0.0000"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Timeline */}
          <motion.div variants={item}>
            <div className="bg-background/80 rounded-lg p-3 border border-border">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium text-card-foreground">Process Timeline</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(stepTimestamps).map(([step, timestamps]) => {
                  const duration = stepDurations[step] ? stepDurations[step].end - stepDurations[step].start : 0

                  // Skip steps with no meaningful duration
                  if (duration <= 0 && step !== "COMPLETE" && step !== "ERROR") return null

                  // Calculate percentage of total time
                  const totalDuration = messages.length
                  const percentage = totalDuration > 0 ? (duration / totalDuration) * 100 : 0

                  return (
                    <div key={step} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-foreground">{step}</span>
                        <span className="text-muted-foreground">
                          {duration > 0 ? `${Math.round(percentage)}%` : "—"}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/80 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getStepColor(step)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* API Calls */}
          <motion.div variants={item}>
            <div className="bg-background/80 rounded-lg p-3 border border-border">
              <div className="flex items-center mb-2">
                <Database className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium text-card-foreground">API Calls</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                  <span className="text-foreground flex items-center">
                    <Search className="h-3.5 w-3.5 mr-2 text-primary" />
                    Search API
                  </span>
                  <span className="text-muted-foreground">{stats.usage?.serper_queries_used || 0} queries</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                  <span className="text-foreground flex items-center">
                    <BarChart className="h-3.5 w-3.5 mr-2 text-primary" />
                    Reranking API
                  </span>
                  <span className="text-muted-foreground">
                    ~{Math.ceil((stats.usage?.sources_processed_count || 0) * 1.5)} calls
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                  <span className="text-foreground flex items-center">
                    <Zap className="h-3.5 w-3.5 mr-2 text-primary" />
                    LLM API Calls
                  </span>
                  <span className="text-muted-foreground">
                    {stats.usage?.token_usage
                      ? Object.keys(stats.usage.token_usage).filter((k) => k !== "total").length +
                        (stats.usage?.refinement_iterations_run || 0)
                      : 0}{" "}
                    calls
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </ScrollArea>
    </div>
  )
}

// Helper function to get step color
function getStepColor(step: string) {
  switch (step) {
    case "INITIALIZING":
      return "bg-gradient-to-r from-[#0F2027] to-[#203A43]"
    case "STARTING":
      return "bg-gradient-to-r from-[#203A43] to-[#2C5364]"
    case "PLANNING":
      return "bg-gradient-to-r from-[#0F2027] to-[#2C5364]"
    case "SEARCHING":
      return "bg-gradient-to-r from-[#0F2027] to-[#203A43]"
    case "RANKING":
      return "bg-gradient-to-r from-[#203A43] to-[#2C5364]"
    case "PROCESSING":
      return "bg-gradient-to-r from-[#0F2027] to-[#2C5364]"
    case "FILTERING":
      return "bg-gradient-to-r from-[#0F2027] to-[#203A43]"
    case "WRITING":
      return "bg-gradient-to-r from-[#203A43] to-[#2C5364]"
    case "REFINING":
      return "bg-gradient-to-r from-[#0F2027] to-[#2C5364]"
    case "FINALIZING":
      return "bg-gradient-to-r from-[#0F2027] to-[#203A43]"
    case "COMPLETE":
      return "bg-gradient-to-r from-[#203A43] to-[#2C5364]"
    case "ERROR":
      return "bg-gradient-to-r from-red-600 to-red-500"
    default:
      return "bg-gradient-to-r from-[#0F2027] to-[#2C5364]"
  }
}

