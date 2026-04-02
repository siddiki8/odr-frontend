"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCpe } from "@/hooks/use-cpe"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Search, Building2, MapPin, Gauge } from "lucide-react"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Capped search budget sent as `max_search_tasks` (API). Keep in 3–5 range to limit Serper/API spend. */
const MAX_SEARCH_TASK_OPTIONS = [3, 4, 5] as const
type MaxSearchTasksOption = (typeof MAX_SEARCH_TASK_OPTIONS)[number]

export function CpeForm() {
  const [query, setQuery] = useState("SaaS companies focused on AI-powered HR tools")
  const [location, setLocation] = useState("")
  const [maxSearchTasks, setMaxSearchTasks] = useState<MaxSearchTasksOption>(3)
  const { startCpe, isRunning, currentQuery, currentLocation } = useCpe()

  useEffect(() => {
    if (currentQuery != null && currentQuery !== "") {
      setQuery(currentQuery)
    }
  }, [currentQuery])

  useEffect(() => {
    if (currentLocation != null) {
      setLocation(currentLocation)
    }
  }, [currentLocation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      startCpe(query.trim(), location.trim() || undefined, maxSearchTasks)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
        <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground text-xl">
                Company Profile Extractor
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Describe the type of companies you want to find
              </CardDescription>
            </div>
            <Building2 className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="E.g., SaaS companies focused on AI-powered HR tools"
                className="min-h-[100px] bg-background/70 dark:bg-black/20 border-input text-foreground focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 resize-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isRunning}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {query.length} chars
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="cpe-location"
                className="text-sm text-muted-foreground flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5" />
                Location
                <span className="text-xs opacity-60">(optional)</span>
              </Label>
              <Input
                id="cpe-location"
                placeholder="E.g., San Francisco, New York, Remote..."
                className="bg-background/70 dark:bg-black/20 border-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="cpe-max-search"
                className="text-sm text-muted-foreground flex items-center gap-1.5"
              >
                <Gauge className="h-3.5 w-3.5" />
                Max search tasks
                <span className="text-xs opacity-60">(limits API / search spend)</span>
              </Label>
              <Select
                value={String(maxSearchTasks)}
                onValueChange={(v) =>
                  setMaxSearchTasks(Number(v) as MaxSearchTasksOption)
                }
                disabled={isRunning}
              >
                <SelectTrigger
                  id="cpe-max-search"
                  className="bg-background/70 dark:bg-black/20 border-input"
                >
                  <SelectValue placeholder="Choose cap" />
                </SelectTrigger>
                <SelectContent>
                  {MAX_SEARCH_TASK_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                      {n === 3 ? " — lowest cost" : n === 5 ? " — broader search" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      disabled={isRunning || !query.trim()}
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Extracting profiles...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Extract Company Profiles
                        </>
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isRunning
                    ? "Extraction in progress..."
                    : !query.trim()
                      ? "Please describe the companies to find"
                      : "Find and extract company profiles matching your criteria"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
