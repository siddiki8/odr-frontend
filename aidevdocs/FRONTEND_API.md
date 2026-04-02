# Frontend API reference (ODR-api)

Base URL: your deployed API origin (e.g. `https://api.example.com` or `http://127.0.0.1:8000`).

Machine-readable OpenAPI: **`GET /openapi.json`** (Swagger UI: **`/docs`**).

CORS is currently permissive (`*`) for development; tighten for production.

---

## Conventions

| Item | Value |
|------|--------|
| Auth | None on these routes today (add API keys or JWT at the gateway if needed) |
| Content-Type (REST) | `application/json` |
| WebSocket protocol | First message from client is JSON text; server sends JSON objects |

---

## Deep Research Agency

Prefix: **`/deep_research`**

### WebSocket — start a research job

- **URL:** `ws://{host}/deep_research/ws/research` (TLS: `wss://`)
- **First message (client → server):** JSON string

```json
{
  "query": "Your research question (min length enforced by API, typically ≥10 chars)",
  "max_search_tasks": null
}
```

`max_search_tasks` is optional; omit or set `null` to use server defaults.

- **Server → client:** Repeated JSON objects:

```json
{
  "step": "PLANNING | SEARCHING | ... | COMPLETE | ERROR | ...",
  "status": "START | END | ERROR | ...",
  "message": "human-readable",
  "details": {}
}
```

Notable `details` keys (non-exhaustive):

- After connect: `details.task_id` — **persist this** to poll REST or correlate Firestore.
- Near end: `details.final_report`, `details.usage` (when step/status indicate finalization — see `ws_client.py`).

- **Origin header (browser):** If you hit CORS issues on WS, some clients set `Origin`; the app allows broad origins.

### REST — fetch persisted result

- **GET** `/deep_research/result/{task_id}`
- **200:** Firestore document as JSON (see `firestore_schema.md` — collection `research_tasks`).
- **404:** Unknown task id.
- **503:** Firestore not configured or unavailable.

### REST — request cancellation

- **POST** `/deep_research/stop/{task_id}`
- **200:** `{ "message": "..." }`
- **400:** Task not in a stoppable state.
- **404:** Unknown task id.

---

## Company Profile Extractor (CPE)

Prefix: **`/cpe`**

### WebSocket — start a CPE job

- **URL:** `ws://{host}/cpe/ws/cpe`
- **First message (client → server):** JSON string

```json
{
  "query": "What kind of companies to find",
  "location": "Optional city/region",
  "max_search_tasks": 5
}
```

`location` and `max_search_tasks` are optional. **`max_search_tasks`** is a **hard cap** on how many search tasks run (default **5** on the server; allowed range **1–20**). The planner’s list is truncated to the first **N** tasks before search, WebSocket updates, and Firestore. The frontend may send a lower value (e.g. 3–5) to save cost.

- **Server → client:** Same envelope as deep research:

```json
{
  "step": "STARTING | PLANNING | SEARCHING | EXTRACTING | COMPLETE | ERROR | ...",
  "status": "START | END | IN_PROGRESS | ERROR | ...",
  "message": "string",
  "details": {}
}
```

CPE does **not** include a **RANKING** step (Deep Research may). Notable `details`:

- **`task_id`** — often on `INITIALIZING` / `TASK_ID` (persist for REST / Firestore).
- **`PLANNING` / `END`** — **`details.plan`** matches Deep Research: `writing_plan` (shared schema), **`search_task_count`**, **`search_queries`** (query strings after the cap). Use this to render the extraction plan in the UI.
- **`COMPLETE` / `END`** — may include `profiles_extracted` and `usage` in `details`.

**Browser WebSocket note:** `cpe_client.py` sends `Origin: http://localhost:8000` when connecting; mirror that if your browser blocks the upgrade.

### REST — fetch persisted result

- **GET** `/cpe/result/{task_id}`
- **200:** Full Firestore document for the task (collection `cpe_tasks`). See `FIRESTORE_CPE.md`. When planning has completed, the document may include **`plan`** (same structure as WebSocket `details.plan`) for hydration after refresh; **`searchTasks`** / **`initialSearchTaskCount`** may appear alongside.
- **404 / 503:** Same semantics as deep research.

### REST — request cancellation

- **POST** `/cpe/stop/{task_id}`
- Stoppable statuses include: `PENDING`, `PROCESSING`, `PLANNING_COMPLETE`, `SEARCH_COMPLETE`, `EXTRACTING` (see route handler).

---

## Root

- **GET** `/` → `{ "message": "ODR Multi-Agency API is running." }`

---

## Who persists “reports”?

The **backend** writes to **Firestore** when `FIREBASE_SERVICE_ACCOUNT_KEY_JSON` points to a valid service account and the SDK initializes successfully. That includes:

- **Deep Research:** final report and usage under `research_tasks/{taskId}`.
- **CPE:** profiles and status under `cpe_tasks/{taskId}`.

The **frontend does not have to** save the same payload again unless you want a **second copy** in a user-specific collection (e.g. “my saved reports”) — that would be **your** Firebase client app + **your** security rules, separate from this API’s Admin writes.

Typical frontend patterns:

1. **WebSocket for live progress** → capture `task_id` → **GET** `/…/result/{task_id}` when complete, or  
2. **Firestore client SDK** read-only on the same collections (with rules allowing read), if you prefer real-time listeners.

Do **not** expose the service account JSON in the frontend; use the Firebase **client** config + **rules** for any direct browser access.
