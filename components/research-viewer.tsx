"use client"

import { useResearch } from "@/hooks/use-research"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResearchTimeline } from "@/components/research-timeline"
import { ResearchStats } from "@/components/research-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BarChart2, FileSearch, Square } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ResearchViewer() {
  const { isResearching, messages, stopResearch } = useResearch()
  const [activeTab, setActiveTab] = useState("timeline")

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-card-foreground text-xl">Research Progress</CardTitle>
              <CardDescription className="text-muted-foreground">
                {isResearching
                  ? "Real-time updates on the research process"
                  : messages.length > 0
                    ? "Research complete"
                    : "Submit a query to start researching"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isResearching && (
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
              {isResearching && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={stopResearch}
                        className="h-7 w-7 flex-shrink-0"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop Research</p>
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
                  <ResearchTimeline />
                </TabsContent>
                <TabsContent value="stats" className="mt-0">
                  <ResearchStats />
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
              <FileSearch className="h-20 w-20 mb-6 opacity-20 text-primary" />
              <h3 className="text-xl font-medium mb-3 text-card-foreground">Ready to Research</h3>
              <p className="max-w-md text-muted-foreground">
                Enter a research query and click "Start Research" to begin the process. You'll see real-time updates as
                the AI explores and synthesizes information.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

