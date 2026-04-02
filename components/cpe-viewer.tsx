"use client"

import { useCpe } from "@/hooks/use-cpe"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CpeTimeline } from "@/components/cpe-timeline"
import { CpeStats } from "@/components/cpe-stats"
import {
  Activity,
  BarChart2,
  Building2,
  Square,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CpeViewer() {
  const { isRunning, messages, stopCpe } = useCpe()
  const [activeTab, setActiveTab] = useState("timeline")

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-card-foreground text-xl">
                Extraction progress
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isRunning
                  ? "Live WebSocket updates from the CPE agent"
                  : messages.length > 0
                    ? "Run finished — timeline below matches Deep Research-style steps"
                    : "Submit a query to start"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isRunning && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="h-2 w-2 rounded-full bg-primary mr-2"
                />
              )}
              {isRunning && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={stopCpe}
                        className="h-7 w-7 flex-shrink-0"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop extraction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {messages.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-muted p-1">
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="timeline" className="mt-0">
                  <CpeTimeline />
                </TabsContent>
                <TabsContent value="stats" className="mt-0">
                  <CpeStats />
                </TabsContent>
              </motion.div>
            </Tabs>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Building2 className="h-20 w-20 mb-6 opacity-20 text-primary" />
              <h3 className="text-xl font-medium mb-3 text-card-foreground">
                Ready to extract
              </h3>
              <p className="max-w-md text-muted-foreground">
                After you submit, this panel shows a glowing timeline like Deep Research. URL-style
                favicons appear when the backend includes a source URL in message details.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
