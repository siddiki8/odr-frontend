import type { ResearchPlan, WritingPlan } from "@/types/research"
import type { CpeUpdateData } from "@/types/cpe"
import type { ResearchUpdateData } from "@/types/socket"
import { isPlanningEnd } from "@/types/socket"

function buildResearchPlan(
  writingPlan: WritingPlan,
  searchQueries: string[],
): ResearchPlan {
  if (
    writingPlan.overall_goal &&
    writingPlan.desired_tone &&
    Array.isArray(writingPlan.sections)
  ) {
    return { writing_plan: writingPlan, search_queries: searchQueries }
  }
  return {
    writing_plan: {
      overall_goal: writingPlan.overall_goal || "Extraction plan",
      desired_tone: writingPlan.desired_tone || "N/A",
      sections: Array.isArray(writingPlan.sections) ? writingPlan.sections : [],
      ...(Array.isArray(writingPlan.additional_directives)
        ? { additional_directives: writingPlan.additional_directives }
        : {}),
    },
    search_queries: searchQueries,
  }
}

/** Resolve query strings from plan: prefer `search_queries`; else derive from `search_tasks` / `searchTasks` objects. */
function searchQueriesFromPlanObject(o: Record<string, unknown>): string[] | null {
  const sq = o.search_queries ?? o.searchQueries
  if (Array.isArray(sq)) {
    const strings = sq.filter((q): q is string => typeof q === "string")
    if (strings.length > 0) return strings
  }
  const tasks = o.search_tasks ?? o.searchTasks
  if (Array.isArray(tasks)) {
    const out: string[] = []
    for (const t of tasks) {
      if (t && typeof t === "object" && "query" in t && typeof (t as { query: unknown }).query === "string") {
        out.push((t as { query: string }).query)
      }
    }
    if (out.length > 0) return out
  }
  return null
}

/** Parse nested plan object (WebSocket `details.plan` or Firestore `plan`). */
export function parsePlanObject(raw: unknown): ResearchPlan | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const queries = searchQueriesFromPlanObject(o)
  if (!queries || queries.length === 0) return null
  const wp = (o.writing_plan ?? o.writingPlan) as WritingPlan | undefined
  if (wp && typeof wp === "object") {
    return buildResearchPlan(wp, queries)
  }
  // Some payloads only send search_tasks / search_queries without writing_plan
  return buildResearchPlan(
    {
      overall_goal: "Extraction plan",
      desired_tone: "N/A",
      sections: [],
    },
    queries,
  )
}

/**
 * Pull plan from `details` — backend may use `plan`, `plan_details`, or camelCase.
 */
export function extractPlanFromMessageDetails(
  details: Record<string, unknown> | null | undefined,
): ResearchPlan | null {
  if (!details) return null
  const raw =
    details.plan ??
    details.plan_details ??
    details.planDetails
  if (!raw) return null
  return parsePlanObject(raw)
}

/** `details.plan` or top-level `plan` on the WS envelope (some servers omit nesting). */
function extractPlanFromCpeEnvelope(data: CpeUpdateData): ResearchPlan | null {
  const fromDetails = extractPlanFromMessageDetails(
    data.details as Record<string, unknown> | undefined,
  )
  if (fromDetails) return fromDetails
  const root = data as unknown as Record<string, unknown>
  const raw = root.plan ?? root.plan_details ?? root.planDetails
  if (raw && typeof raw === "object") {
    return parsePlanObject(raw)
  }
  return null
}

function hasPlanPayload(
  details: Record<string, unknown> | null,
  data: CpeUpdateData,
): boolean {
  if (
    details &&
    (details.plan || details.plan_details || details.planDetails)
  ) {
    return true
  }
  const root = data as unknown as Record<string, unknown>
  return Boolean(root.plan || root.plan_details || root.planDetails)
}

/**
 * Parses PLANNING completion: same shape as Deep Research (`details.plan`), or `plan_details`.
 * Uses strict `isPlanningEnd` when possible; otherwise flexible parsing (search_tasks-only plans, alternate statuses).
 */
export function planningPlanFromCpeMessage(data: CpeUpdateData): ResearchPlan | null {
  const asResearch = data as unknown as ResearchUpdateData
  if (isPlanningEnd(asResearch)) {
    const writingPlan = asResearch.details.plan.writing_plan
    const searchQueries = asResearch.details.plan.search_queries
    return buildResearchPlan(writingPlan, searchQueries)
  }

  const step = String(data.step || "").toUpperCase()
  const status = String(data.status || "").toUpperCase()

  const isPlanningStep =
    step === "PLANNING" || step === "PLANNING_COMPLETE"

  const planningFinished =
    status === "END" ||
    status === "COMPLETE" ||
    status === "SUCCESS" ||
    status === "DONE"

  const details =
    data.details && typeof data.details === "object"
      ? (data.details as Record<string, unknown>)
      : null

  const extracted = extractPlanFromCpeEnvelope(data)
  if (!extracted) return null

  if (isPlanningStep && planningFinished) return extracted
  if (isPlanningStep && hasPlanPayload(details, data)) return extracted
  if (step === "SEARCHING" && hasPlanPayload(details, data)) return extracted
  // Plan sometimes only echoed on the final COMPLETE payload
  if (step === "COMPLETE" && hasPlanPayload(details, data)) return extracted

  return null
}

/** If the API persists a `plan` object on the CPE task document (optional). */
export function planningPlanFromRestDocument(
  data: Record<string, unknown>,
): ResearchPlan | null {
  const raw =
    data.plan ??
    data.plan_details ??
    data.planDetails
  if (raw && typeof raw === "object") {
    return parsePlanObject(raw)
  }
  return null
}
