"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useResearch } from "@/hooks/use-research"
import { Loader2, Search, Zap, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ResearchForm() {
  const [query, setQuery] = useState("What are the latest advancements in quantum computing?")
  const { startResearch, isResearching } = useResearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      startResearch(query)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground text-xl">Research Query</CardTitle>
              <CardDescription className="text-muted-foreground">Enter a topic or question to research</CardDescription>
            </div>
            <Globe className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-5">
              <div className="relative">
                <Textarea
                  placeholder="E.g., What are the latest advancements in quantum computing?"
                  className="min-h-[120px] bg-background/70 dark:bg-black/20 border-input text-foreground focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 resize-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isResearching}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">{query.length} characters</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] hover:opacity-90 text-white shadow-lg shadow-primary/10 border-0 transition-all duration-300"
                      disabled={isResearching || !query.trim()}
                    >
                      {isResearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Researching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Start Research
                        </>
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover border-border">
                  {isResearching
                    ? "Research in progress..."
                    : !query.trim()
                      ? "Please enter a research query"
                      : "Begin comprehensive research on this topic"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

