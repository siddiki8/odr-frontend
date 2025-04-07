"use client"

import { useResearch } from "@/hooks/use-research"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function QueryDisplay() {
  const { currentQuery, isResearching } = useResearch()

  if (!currentQuery) return null

  return (
    <motion.div
      className="w-full mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative">
        <div
          className={cn(
            "relative bg-background/30 dark:bg-[#0F2027]/80 backdrop-blur-sm rounded-lg p-4 border border-border shadow-md z-10",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">RESEARCH QUERY</h3>
              <p className="text-xl font-medium text-card-foreground">{currentQuery}</p>
            </div>
          </div>
        </div>

        {isResearching && <div className="absolute inset-0 rounded-lg z-20 glowing-border"></div>}
      </div>
    </motion.div>
  )
}

