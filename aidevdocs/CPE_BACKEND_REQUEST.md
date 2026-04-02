# CPE — backend contract (implemented)

The following was implemented on the API side; this file is kept as a short contract summary for frontend/backend alignment.

1. **`PLANNING` / `END` — `details.plan` (Deep Research shape)**  
   `writing_plan` (shared `WritingPlan` model), `search_task_count`, `search_queries` (strings after cap). Emitted via `CpeWebSocketUpdateHandler.planning_end`.

2. **Firestore `cpe_tasks.plan`**  
   Same plan object stored on the task when planning completes. **`GET /cpe/result/{task_id}`** returns the full document; clients read **`plan`** when present for hydration.

3. **`max_search_tasks` hard cap**  
   Request field (default 5, **1–20**). Truncates planner `search_tasks` before search, WS payload, and Firestore.

4. **Steps**  
   CPE has **no RANKING** step vs Deep Research.

Frontend: `lib/cpe-planning.ts`, `cpe-provider`, CPE page plan card, and `aidevdocs/FRONTEND_API.md` reflect this.
