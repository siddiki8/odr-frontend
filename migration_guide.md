**Migration Plan: `react-use-websocket` Integration**

1.  **Environment Variable:** **[DONE]**
    *   Ensure an environment variable exists for the **base WebSocket URL**, e.g., `NEXT_PUBLIC_WS_RESEARCH_URL` (value like `ws://localhost:8000` or `wss://your-api.com`). This should *not* include the `/ws/research` path itself.

2.  **Install/Uninstall Libraries:** **[DONE]**
    *   Uninstall the Socket.IO client: `pnpm remove socket.io-client` (or npm/yarn equivalent).
    *   Install `react-use-websocket`: `pnpm add react-use-websocket` (or npm/yarn equivalent).

3.  **Type Definitions:** **[DONE]**
    *   Review `types/research.ts` and `types/socket.ts`. The message structure interfaces defined in `types/socket.ts` (like `ResearchUpdateData`, `PlanningEndDetails`, etc.) based on `websocket_guide.md` are likely still perfectly valid and should be kept, as they describe the *content* of the messages, regardless of the transport library. Ensure they accurately reflect `websocket_guide.md`.

4.  **Refactor `ResearchProvider`:** **[DONE]**
    *   **Import:** **[DONE]**
        *   Import `useWebSocket` from `react-use-websocket`.
        *   Import necessary React hooks (`useState`, `useEffect`, `useCallback`).
        *   Import the message types from `types/socket.ts` (e.g., `ResearchUpdateData`, `isPlanningEnd`, etc.) and other necessary types (`ResearchMessage`, `ResearchPlan`, etc. from `types/research.ts`).
        *   Remove imports related to `socket.io-client`.
    *   **State:** **[DONE]**
        *   Remove the `socket` state (`useState<Socket | null>`).
        *   Keep the `isConnected` state (can be useful).
        *   Add state to control when the WebSocket connection attempt should start, e.g., `const [socketUrl, setSocketUrl] = useState<string | null>(null);`. The `useWebSocket` hook will only connect when this URL is not null.
        *   Keep other core state (`plan`, `report`, `messages`, `isResearching`, `currentQuery`, `stats`, `isSaving`).
    *   **WebSocket Hook (`useWebSocket`):** **[DONE]**
        *   Call `useWebSocket(socketUrl, { ...options... }, !!socketUrl);`. The third argument (`connect`) ensures it only connects when `socketUrl` is set.
        *   **Options:**
            *   `onOpen`: Log connection success, set `isConnected(true)`. Consider if the initial query needs to be sent here or later.
            *   `onClose`: Log connection closure, set `isConnected(false)`. Handle potential unexpected closures during research.
            *   `onError`: Log errors, potentially show a toast, set `isConnected(false)`, `isResearching(false)`.
            *   `onMessage`: Point to the `handleWebSocketMessage` function.
            *   `shouldReconnect`: Configure reconnection behavior (e.g., `(closeEvent) => true`).
            *   `reconnectAttempts`, `reconnectInterval`: Fine-tune reconnection.
            *   `share`: Consider if `true` is needed if multiple components were to use the same hook instance (likely `false` or default here as it's centralized in the provider).
            *   `filter`: Return `false` to ignore messages if needed (e.g., empty messages), default is usually fine.
    *   **`startResearch` Function Modification:** **[DONE]**
        *   Clear previous state (`messages`, `report`, `plan`, `stats`).
        *   Set `currentQuery` and `isResearching(true)`.
        *   **Set the WebSocket URL state:** `setSocketUrl(process.env.NEXT_PUBLIC_WS_RESEARCH_URL + "/ws/research");` This will trigger the `useWebSocket` hook to connect.
        *   **Send Initial Query:** Use the `sendJsonMessage` function returned by `useWebSocket`. Send the initial query payload immediately after setting the URL. **Assumption:** The backend expects a JSON message like `{"type": "start_research", "query": researchQuery}`. Adapt this structure if your backend expects something different (e.g., just the query string, though JSON is safer). Example: `sendJsonMessage({ type: "start_research", query: query });` (Note: `sendJsonMessage` might not be available *immediately* after setting the URL; might need a slight delay or send in `onOpen`, needs testing). *Alternative:* Send in `onOpen` handler. Let's plan to send immediately and refine if needed.
    *   **`handleWebSocketMessage` Function:** **[DONE]**
        *   Receives `MessageEvent`.
        *   Parse `event.data` (expecting a JSON string). Add `try...catch` for safety.
        *   Use the type guards (e.g., `isPlanningEnd`) and logic very similar to the previous Socket.IO implementation to update state (`messages`, `plan`, `report`, `stats`, `isResearching`) based on the parsed data's `step` and `status`.
    *   **Cleanup:** **[DONE]** `useWebSocket` handles connection closure when the component unmounts or the URL becomes null. Add logic in `startResearch` to `setSocketUrl(null)` before setting a new one if reconnecting for a *new* query is desired, or rely on component remount. Let's plan to set URL to null first.

5.  **Trigger Saving (`saveResearchReport`):** **[DONE]**
    *   The existing `useEffect` hook watching `report`, `stats`, `currentQuery`, `isResearching`, `isSaving` to call `saveReportInternal` should still work correctly and requires no changes.

6.  **UI Components:** **[DONE]**
    *   No changes anticipated, but verify `ResearchForm` calls the updated `startResearch` and other components display data correctly from the context.
