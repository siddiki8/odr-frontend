"use client"

import { useCpe } from "@/hooks/use-cpe"
import { motion } from "framer-motion"
import { Building2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function CpeQueryDisplay() {
  const { currentQuery, currentLocation, isRunning } = useCpe()

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
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                COMPANY SEARCH
              </h3>
              <p className="text-xl font-medium text-card-foreground break-words">
                {currentQuery}
              </p>
              {currentLocation ? (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 opacity-80" />
                  {currentLocation}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {isRunning ? (
          <div className="absolute inset-0 rounded-lg z-20 glowing-border pointer-events-none" />
        ) : null}
      </div>
    </motion.div>
  )
}
