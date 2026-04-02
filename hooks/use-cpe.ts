"use client"

import { useContext } from "react"
import { CpeContext } from "@/components/cpe-provider"

export const useCpe = () => {
  const context = useContext(CpeContext)
  if (context === undefined) {
    throw new Error("useCpe must be used within a CpeProvider")
  }
  return context
}
