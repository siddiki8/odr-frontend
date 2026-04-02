import type { ResearchPlan } from "./research"

// --- CPE WebSocket message envelope (matches deep_research envelope shape) ---
export interface CpeUpdateData {
  step: string
  status: string
  message: string
  details: Record<string, any> | null
}

// --- Details for INITIALIZING / TASK_ID ---
export interface CpeTaskIdDetails {
  task_id: string
}

// --- Details for COMPLETE / END ---
export interface CpeCompleteDetails {
  profiles_extracted?: number
  usage?: CpeUsageStatistics
}

// --- Company profile as stored in Firestore cpe_tasks.profiles ---
export interface CompanyProfile {
  name?: string
  website?: string
  description?: string
  industry?: string
  location?: string
  size?: string
  founded?: string | number
  linkedin?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

// --- Usage statistics returned by the CPE backend ---
export interface CpeUsageStatistics {
  token_usage?: {
    [agent: string]: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
  estimated_cost?: { [key: string]: number }
  serper_queries_used?: number
  domains_processed?: number
  profiles_extracted?: number
}

// --- Firestore document shape for cpe_tasks/{taskId} ---
export interface CpeTaskResult {
  taskId: string
  query: string
  location?: string
  maxSearchTasks?: number
  /** Same shape as Deep Research plan when backend persists it after PLANNING (writing_plan + search_queries, etc.). */
  plan?: ResearchPlan | null
  status: string
  createdAt: string
  startedAt?: string
  updatedAt?: string
  completedProcessingAt?: string
  completedAt?: string
  profiles?: CompanyProfile[]
  profileCount?: number
  processedDomainCount?: number
  usageStatistics?: CpeUsageStatistics
  error?: string
  stoppedReason?: string
}

// --- Simplified list item for the CPE reports page ---
export interface CpeListItem {
  id: string
  query: string
  location?: string
  createdAt: string
  profileCount?: number
}

// --- Message used by the CPE progress timeline ---
export interface CpeMessage {
  step: string
  status: string
  message: string
  details?: Record<string, any> | null
}

// --- Type guards ---

export function isCpeTaskIdMessage(
  data: CpeUpdateData,
): data is CpeUpdateData & { details: CpeTaskIdDetails } {
  return (
    data.step === "INITIALIZING" &&
    data.status === "TASK_ID" &&
    typeof data.details?.task_id === "string"
  )
}

export function isCpeCompleteEnd(
  data: CpeUpdateData,
): data is CpeUpdateData & { details: CpeCompleteDetails } {
  if (data.step !== "COMPLETE" || data.status === "ERROR") return false
  return (
    data.status === "END" ||
    data.status === "COMPLETE" ||
    data.details?.profiles_extracted != null ||
    data.details?.usage != null
  )
}

/** True when the run has finished successfully (persisted result should be available via REST). */
export function isCpeRunSuccessfullyFinished(data: CpeUpdateData): boolean {
  if (data.status === "ERROR") return false
  return isCpeCompleteEnd(data)
}

export function isCpeError(data: CpeUpdateData): boolean {
  return data.step === "ERROR"
}
