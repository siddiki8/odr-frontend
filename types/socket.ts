import type { ResearchPlan, UsageStatistics, ResearchMessage } from "./research"

// --- Base Message Structure (Matches websocket_guide.md) ---
export interface ResearchUpdateData {
  step: string
  status: string
  message: string
  details: Record<string, any> | null // Base type, specific details below
}

// --- Specific Detail Payloads ---

// Step: PLANNING, Status: END
export interface PlanningEndDetails {
  plan: ResearchPlan
  // search_task_count is mentioned but might be derivable from plan.search_queries.length
}

// Step: FINALIZING, Status: END
export interface FinalizingEndDetails {
  final_report: string
}

// Step: COMPLETE, Status: END
export interface CompleteEndDetails {
  final_report_length: number
  usage: UsageStatistics
}

// Step: ERROR, Status: ERROR | FATAL
export interface ErrorDetails {
  error_type?: string
  error_id?: string
  error?: string // From INITIALIZING/ERROR example
  source_url?: string // From PROCESSING/ERROR example
}

// Step: INITIALIZING, Status: TASK_ID
export interface TaskIdDetails {
  task_id: string
}

// --- Type Guards (Optional but recommended) ---

export function isPlanningEnd(data: ResearchUpdateData): data is ResearchUpdateData & { details: PlanningEndDetails } {
  return data.step === "PLANNING" && data.status === "END" && data.details?.plan != null
}

export function isFinalizingEnd(
  data: ResearchUpdateData,
): data is ResearchUpdateData & { details: FinalizingEndDetails } {
  return data.step === "FINALIZING" && data.status === "END" && typeof data.details?.final_report === "string"
}

export function isCompleteEnd(data: ResearchUpdateData): data is ResearchUpdateData & { details: CompleteEndDetails } {
  return (
    data.step === "COMPLETE" &&
    data.status === "END" &&
    typeof data.details?.final_report_length === "number" &&
    data.details?.usage != null
  )
}

export function isErrorDetails(data: ResearchUpdateData): data is ResearchUpdateData & { details: ErrorDetails } {
  return (
    data.step === "ERROR" ||
    (data.step === "INITIALIZING" && data.status === "ERROR") ||
    (data.step === "PROCESSING" && data.status === "ERROR")
    // Add other error conditions if necessary
  )
}

export function isTaskIdMessage(data: ResearchUpdateData): data is ResearchUpdateData & { details: TaskIdDetails } {
  return (
    data.step === "INITIALIZING" &&
    data.status === "TASK_ID" &&
    typeof data.details?.task_id === "string"
  )
} 