// Remove the problematic import and re-export from research-provider
// import type { ResearchMessage, ResearchPlan, UsageStatistics } from "@/components/research-provider"

// --- Define Core Research Types Here ---

// Message structure for the timeline/state
export interface ResearchMessage {
  step: string
  status: string
  message: string
  details?: Record<string, any> | null
}

// Structure for individual report sections in the writing plan
export interface WritingPlanSection {
  title: string
  guidance: string
}

// Structure for the overall writing plan
export interface WritingPlan {
  overall_goal: string
  desired_tone: string
  sections: WritingPlanSection[]
  additional_directives?: string[]
}

// Structure for the research plan (combines writing plan and queries)
export interface ResearchPlan {
  writing_plan: WritingPlan
  search_queries: string[]
}

// Structure for token usage per agent/step
export interface TokenUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// Structure for estimated cost per agent/step
export interface EstimatedCost {
  [key: string]: number // e.g., planner: 0.0, summarizer: 0.0, total: 0.0
}

// Structure for overall usage statistics
export interface UsageStatistics {
  token_usage: { [key: string]: TokenUsage } // e.g., planner: TokenUsage, total: TokenUsage
  estimated_cost: EstimatedCost
  serper_queries_used: number
  sources_processed_count: number
  refinement_iterations_run: number
}

// --- Original Types Below (Keep These) ---

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
// export type { ResearchMessage, ResearchPlan, UsageStatistics, WritingPlan } from "@/components/research-provider" // REMOVE THIS LINE

// Type for the data returned from the /research/result/{task_id} endpoint
// This can also represent a COMPLETED task fetched from Firestore
export interface TaskResultResponse {
  taskId: string
  query: string
  status: "PENDING" | "PROCESSING" | "PLANNING_COMPLETE" | "PROCESSING_COMPLETE" | "COMPLETED" | "ERROR" | "CANCELLED"
  createdAt: string // Assuming ISO string format from Firestore Timestamp
  startedAt?: string // Optional, when status changed to PROCESSING
  updatedAt?: string // Assuming ISO string format from Firestore Timestamp
  completedAt?: string // Present when task reached a final state
  llmProvider?: string
  
  // Plan details - added when status becomes PLANNING_COMPLETE
  plan?: ResearchPlan | null
  initialSearchTaskCount?: number // Number of searches planned initially
  
  // Sources - added when status becomes PROCESSING_COMPLETE
  sources?: {
    ref_num: number;
    title: string;
    link: string;
    rank?: number;       // For sorting/display order
    type?: "summary" | "chunk";  // More specific type definition
    score?: number;      // Relevance score
    content?: string;    // The actual text content from the source
  }[]
  sourceCount?: number
  
  // Final report and statistics - present when status is COMPLETED
  report?: string
  usageStatistics?: UsageStatistics
  
  // Error information
  error?: string // Present if status is ERROR
  stoppedReason?: string // Present if status is CANCELLED
  
  // Custom fields (not in Firestore, might be added client-side)
  slug?: string
  
  // Legacy field for backward compatibility
  result?: {
    report: string,
    usageStatistics?: UsageStatistics
  }
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

