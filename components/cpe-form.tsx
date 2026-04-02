"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useCpe } from "@/hooks/use-cpe"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MAX_SEARCH_TASK_OPTIONS = [3, 4, 5] as const
type MaxSearchTasksOption = (typeof MAX_SEARCH_TASK_OPTIONS)[number]

export function CpeForm() {
  const [query, setQuery] = useState("SaaS companies focused on AI-powered HR tools")
  const [location, setLocation] = useState("")
  const [maxSearchTasks, setMaxSearchTasks] = useState<MaxSearchTasksOption>(3)
  const { startCpe, isRunning, currentQuery, currentLocation } = useCpe()

  useEffect(() => {
    if (currentQuery != null && currentQuery !== "") setQuery(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    if (currentLocation != null) setLocation(currentLocation)
  }, [currentLocation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) startCpe(query.trim(), location.trim() || undefined, maxSearchTasks)
  }

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
          COMPANY PROFILE EXTRACTION
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 pt-6 space-y-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] block mb-3">
              COMPANY DESCRIPTION
            </label>
            <Textarea
              placeholder="E.g., SaaS companies focused on AI-powered HR tools"
              className="min-h-[100px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isRunning}
            />
            <p className="font-mono text-[10px] text-[var(--nd-text-disabled)] mt-2 text-right">
              {query.length} CHARACTERS
            </p>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] block mb-3">
              LOCATION <span className="text-[var(--nd-text-disabled)]">(OPTIONAL)</span>
            </label>
            <Input
              placeholder="E.g., San Francisco, New York, Remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] block mb-3">
              MAX SEARCH TASKS <span className="text-[var(--nd-text-disabled)]">(LIMITS API SPEND)</span>
            </label>
            <Select
              value={String(maxSearchTasks)}
              onValueChange={(v) => setMaxSearchTasks(Number(v) as MaxSearchTasksOption)}
              disabled={isRunning}
            >
              <SelectTrigger className="font-mono text-sm border-[var(--nd-border-visible)] bg-transparent">
                <SelectValue placeholder="Choose cap" />
              </SelectTrigger>
              <SelectContent>
                {MAX_SEARCH_TASK_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="font-mono text-sm">
                    {n}{n === 3 ? " — LOWEST COST" : n === 5 ? " — BROADER SEARCH" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-6 py-6">
          <Button type="submit" className="w-full" disabled={isRunning || !query.trim()}>
            {isRunning ? "[EXTRACTING...]" : "EXTRACT COMPANY PROFILES"}
          </Button>
        </div>
      </form>
    </div>
  )
}
