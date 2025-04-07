"use client"

import { useContext } from "react"
import { ResearchContext } from "@/components/research-provider"

export const useResearch = () => {
  const context = useContext(ResearchContext)
  if (context === undefined) {
    throw new Error("useResearch must be used within a ResearchProvider")
  }
  return context
}

