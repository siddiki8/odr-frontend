# Backend Changes for Research Task Persistence & Retrieval

This document outlines the changes made to the FastAPI backend to support persistent research tasks and allow retrieval after page refreshes or disconnections.

## Summary of Changes

1.  **Task ID Generation & Transmission:** Each new research request initiated via the WebSocket (`/ws/research`) now generates a unique UUID (`task_id`). This ID is immediately sent back to the connected client over the WebSocket.
2.  **Firestore Integration:**
    *   The backend now connects to a Firebase Firestore database upon startup (requires environment variables to be set).
    *   A new Firestore collection named `research_tasks` is used.
    *   When a task starts, a document is created in this collection using the `task_id` as the document ID. It stores the initial query and sets the status to `PENDING`.
    *   The document status is updated to `PROCESSING` when the agent starts work.
    *   Upon successful completion, the status is updated to `COMPLETE`, and the final report, source list (`final_context`), and usage statistics are stored within the document.
    *   If any error occurs during the process (agent error, server error, etc.), the status is updated to `ERROR`, and an error message is stored.
3.  **New HTTP Endpoint:** A new HTTP GET endpoint `/research/result/{task_id}` has been added.

## Frontend Engineer Actions

1.  **Receive Task ID:** Modify the WebSocket message handler on the client-side.
    *   Listen for a specific message structure immediately after the connection is established and the initial request is sent.
    *   **Expected Message:**
        ```json
        {
          "step": "INITIALIZING",
          "status": "TASK_ID",
          "message": "Task ID assigned.",
          "details": {
            "task_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // UUID string
          }
        }
        ```
    *   When this message is received, extract the `task_id` from `details.task_id`.

2.  **Store Task ID:** Persist the received `task_id` in the browser's `localStorage` or `sessionStorage`. This allows the ID to survive page refreshes.
    *   Example: `localStorage.setItem('researchTaskId', receivedTaskId);`

3.  **Check for Task ID on Page Load:** When the relevant page/component loads:
    *   Check if a `researchTaskId` exists in local/session storage.
    *   Example: `const storedTaskId = localStorage.getItem('researchTaskId');`
    *   If `storedTaskId` exists, it means a research task might have been running before a refresh or disconnection.

4.  **Fetch Task Status/Result:** If a `storedTaskId` is found on load:
    *   Make an HTTP GET request to the new backend endpoint: `/research/result/{storedTaskId}` (replace `{storedTaskId}` with the actual ID).
    *   Handle the response:
        *   **Success (200 OK):** The response body will be a JSON object representing the Firestore document.
            *   Check the `status` field in the response (`PENDING`, `PROCESSING`, `COMPLETE`, `ERROR`).
            *   If `status` is `COMPLETE`, the final data is available in the `result` field (containing `finalReport`, `sources`, `usageStatistics`). Display this data.
            *   If `status` is `ERROR`, display an appropriate error message based on the `error` field in the response.
            *   If `status` is `PENDING` or `PROCESSING`, you can display an appropriate loading/processing state. You might consider implementing polling (calling the endpoint again after a delay) to check for completion.
            *   **Recommendation:** Once a `COMPLETE` or `ERROR` status is fetched, consider removing the `researchTaskId` from local storage to avoid fetching it again unnecessarily on subsequent loads, unless the user explicitly re-opens a specific task history.
        *   **Not Found (404 Not Found):** The task ID is invalid or expired (if cleanup implemented later). Clear the ID from local storage and show an appropriate message.
        *   **Server Error (5xx):** Handle potential server-side errors during retrieval.

5.  **WebSocket Interaction (Optional Enhancement):** While the primary goal is handled by the HTTP endpoint, you could potentially enhance the WebSocket logic:
    *   When re-establishing a WebSocket connection *after* finding a `storedTaskId` on load, you *could* send the `task_id` back to the server. The server *could* then potentially \"re-subscribe\" that WebSocket connection to receive any *future* updates for that specific ongoing task (if it\'s still processing). This is more complex and may not be necessary if HTTP polling for status is sufficient.

## Firestore Document Structure (`research_tasks` collection)

The documents in the `research_tasks` collection will generally have the following structure:

```json
// Document ID: {task_id}
{
  "taskId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // string (matches doc ID)
  "query": "Original user research query",          // string
  "status": "PENDING" | "PROCESSING" | "COMPLETE" | "ERROR", // string
  "createdAt": Timestamp,                          // Firestore Timestamp
  "updatedAt": Timestamp,                          // Firestore Timestamp

  // --- Optional fields ---
  "llmProvider": "google" | "openrouter",         // string (provider used)
  "plannerConfigOverride": { ... },               // object (if provided)
  "summarizerConfigOverride\": { ... },            // object (if provided)
  "writerConfigOverride": { ... },                // object (if provided)
  "maxSearchTasksOverride": 10,                   // number (if provided)

  // --- Fields added on completion/error ---
  "result": {                                      // object (only if status=COMPLETE)
    "finalReport": "The final generated report...",  // string
    "sources": [                                   // array (list of context items)
      {
        "type": "summary" | "chunk",
        "content": "...",
        "link": "...",
        "title": "...",
        "rank": 1,
        // "score": 0.8 (only for chunks)
      }
      // ... more sources
    ],
    "usageStatistics": { ... }                   // object (structure from UsageStatistics schema)
  },
  "error": "Details about the error that occurred" // string (only if status=ERROR)
}
```

## Important Notes

*   Ensure the frontend makes requests to the correct backend URL where the FastAPI app is deployed.
*   Handle CORS if the frontend and backend are on different origins (already configured server-side to allow all `*`).
*   Remember to install the `firebase-admin` package (`pip install firebase-admin`) and set the `FIREBASE_SERVICE_ACCOUNT_KEY_JSON` environment variable on the server.