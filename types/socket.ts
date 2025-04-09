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
  plan: {
    writing_plan: WritingPlan // The writing plan object
    search_task_count: number // The count of initial queries
    search_queries: string[] // Add back the search queries array
  }
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

// Step: ERROR, Status: FATAL / ERROR / VALIDATION_ERROR / etc.
export interface ErrorDetails {
  error?: string // String representation of the error/exception
  error_type?: string // e.g., AgentExecutionError, ValidationError
  error_id?: string // Optional ID for correlation
  // source_url is removed as it's specific to PROCESSING/WARNING now
}

// Step: INITIALIZING, Status: TASK_ID
export interface TaskIdDetails {
  task_id: string
}

// --- Type Guards (Optional but recommended) ---

export function isPlanningEnd(data: ResearchUpdateData): data is ResearchUpdateData & { details: PlanningEndDetails } {
  return (
    data.step === "PLANNING" &&
    data.status === "END" &&
    data.details?.plan?.writing_plan != null && // Check for the nested writing_plan
    typeof data.details?.plan?.search_task_count === "number" &&
    Array.isArray(data.details?.plan?.search_queries) // Add check for search_queries array
  )
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
  // Simplify to just check if the step is ERROR, as per the new guide's structure
  return data.step === "ERROR";
}

export function isTaskIdMessage(data: ResearchUpdateData): data is ResearchUpdateData & { details: TaskIdDetails } {
  return (
    data.step === "INITIALIZING" &&
    data.status === "TASK_ID" &&
    typeof data.details?.task_id === "string"
  )
} 