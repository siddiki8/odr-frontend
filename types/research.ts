import type { ResearchMessage, ResearchPlan, UsageStatistics } from "@/components/research-provider"

// Type for saved reports in the research-service
export interface SavedReport {
  id: string
  slug: string
  query: string
  report: string
  plan: ResearchPlan | null
  messages: ResearchMessage[]
  stats: {
    final_report_length?: number
    usage?: UsageStatistics
  } | null
  createdAt: number
  updatedAt: number
}

// Re-exporting common types for convenience - keep these
export type { ResearchMessage, ResearchPlan, UsageStatistics, WritingPlan } from "@/components/research-provider"

// Type for the data returned from the /research/result/{task_id} endpoint
// This can also represent a COMPLETED task fetched from Firestore
export interface TaskResultResponse {
  taskId: string
  query: string
  status: "PENDING" | "PROCESSING" | "COMPLETE" | "ERROR" | "STOPPED" // Added STOPPED
  createdAt: string // Assuming ISO string format from Firestore Timestamp
  updatedAt: string // Assuming ISO string format from Firestore Timestamp
  llmProvider?: string
  plan?: ResearchPlan | null // Keep optional plan at top level
  result?: { // Present only if status is COMPLETE
    finalReport: string
    sources: SourceContextItem[] // Use a more specific type
    usageStatistics: UsageStatistics
  }
  error?: string // Present only if status is ERROR or STOPPED
  slug?: string // Optional: Can be added client-side if needed
}

// Specific type for a source item as stored in the result
export interface SourceContextItem {
  type: "summary" | "chunk"
  content: string
  link: string
  title: string
  rank: number
  score?: number // Optional, only for chunks
}

// Type specifically for the data needed by the reports list page
export interface ReportListItem {
  id: string // This will be the taskId
  query: string
  createdAt: string // Or Date object if preferred after parsing
  // Add any other fields needed for the card, e.g.:
  // title?: string // If we extract it during mapping
  // status?: string // Should always be COMPLETE here
}

