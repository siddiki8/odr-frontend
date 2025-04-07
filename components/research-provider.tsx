"use client"

import { createContext, useState, type ReactNode, useEffect, useCallback, useRef } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
// Remove import for saveResearchReport if no longer used anywhere else in this file
// import { saveResearchReport } from "@/lib/research-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type {
  ResearchUpdateData,
  PlanningEndDetails,
  FinalizingEndDetails,
  CompleteEndDetails,
  ErrorDetails,
  TaskIdDetails,
} from "@/types/socket"
import {
  isPlanningEnd,
  isFinalizingEnd,
  isCompleteEnd,
  isErrorDetails,
  isTaskIdMessage,
} from "@/types/socket"
import type {
  ResearchMessage,
  ResearchPlan,
  UsageStatistics,
  WritingPlan,
  TaskResultResponse
} from "@/types/research"

// --- Constants ---
const LOCAL_STORAGE_TASK_ID_KEY = "researchTaskId"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const POLLING_INTERVAL_MS = 60000; // 60 seconds

// Define research context type
interface ResearchContextType {
  isResearching: boolean
  isConnected: boolean
  messages: ResearchMessage[]
  report: string | null
  plan: ResearchPlan | null
  stats: {
    final_report_length?: number
    usage?: UsageStatistics
  } | null
  startResearch: (query: string) => void
  currentQuery: string | null
  stopResearch: () => void
  taskId: string | null
  clearTask: () => void
  isPollingForTaskResult: boolean
}

// Create context with default values
export const ResearchContext = createContext<ResearchContextType>({
  isResearching: false,
  isConnected: false,
  messages: [],
  report: null,
  plan: null,
  stats: null,
  startResearch: () => {},
  currentQuery: null,
  stopResearch: () => {},
  taskId: null,
  clearTask: () => {},
  isPollingForTaskResult: false,
})

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [isResearching, setIsResearching] = useState(false)
  const [messages, setMessages] = useState<ResearchMessage[]>([])
  const [report, setReport] = useState<string | null>(null)
  const [plan, setPlan] = useState<ResearchPlan | null>(null)
  const [stats, setStats] = useState<{ final_report_length?: number; usage?: UsageStatistics } | null>(null)
  const [currentQuery, setCurrentQuery] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [isPollingForTaskResult, setIsPollingForTaskResult] = useState(false)
  const pollingIntervalIdRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // --- WebSocket State ---
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const initialMessageSentRef = useRef(false);

  // --- Function to Stop Polling ---
  const stopPolling = useCallback(() => {
    if (pollingIntervalIdRef.current) {
      console.log("Stopping polling interval.");
      clearInterval(pollingIntervalIdRef.current);
      pollingIntervalIdRef.current = null;
    }
    setIsPollingForTaskResult(false);
  }, []);

  // --- Function to clear task ID from state and storage ---
  const clearTask = useCallback(() => {
    console.log("Clearing task ID from state and localStorage.");
    stopPolling();
    setTaskId(null);
    localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
  }, [stopPolling]);

  // --- handleWebSocketMessage Function ---
  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      let updateData: ResearchUpdateData;
      try {
        const parsedData = JSON.parse(event.data);
        if (typeof parsedData !== "object" || parsedData === null || !parsedData.step || !parsedData.status || !parsedData.message) {
            throw new Error("Invalid message structure");
        }
        updateData = parsedData as ResearchUpdateData;
      } catch (error) {
        console.error("Failed to parse WebSocket message or invalid structure:", error);
        console.error("Raw message data:", event.data);
        return;
      }

      console.log(`WS Received: ${updateData.step} - ${updateData.status}`, updateData.details)

      // Handle TASK_ID message
      if (isTaskIdMessage(updateData)) {
        const receivedTaskId = updateData.details.task_id;
        console.log("Received Task ID:", receivedTaskId);
        setTaskId(receivedTaskId);
        localStorage.setItem(LOCAL_STORAGE_TASK_ID_KEY, receivedTaskId);
        // Don't add this specific message to the visual timeline, just store the ID
        return; // Stop further processing for this message
      }

      // Add other messages to the timeline
       const newMessage: ResearchMessage = {
          step: updateData.step,
          status: updateData.status,
          message: updateData.message,
          details: updateData.details
      };
      // Stop polling if we receive any message while polling (means connection re-established or something else happened)
      if (isPollingForTaskResult) {
        console.warn("Received WebSocket message while polling was active. Stopping polling.");
        stopPolling();
      }
      setMessages((prev) => [...prev, newMessage]);

      // Handle specific steps/statuses based on websocket_guide.md
       if (isPlanningEnd(updateData)) {
        console.log("Setting research plan:", updateData.details.plan)
        setPlan(updateData.details.plan)
      } else if (isFinalizingEnd(updateData)) {
        console.log("Setting final report...")
        setReport(updateData.details.final_report)
      } else if (isCompleteEnd(updateData)) {
        console.log("Research complete message received via WS. Setting stats, marking done.");
        setStats({
          final_report_length: updateData.details.final_report_length,
          usage: updateData.details.usage,
        })
        setIsResearching(false)
        setSocketUrl(null); // Disconnect after completion
        initialMessageSentRef.current = false; // Reset for next potential research
        // Clear task ID from storage once completed via WebSocket
        localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
        console.log("Cleared task ID from localStorage (WebSocket completion).");
      } else if (isErrorDetails(updateData)) {
        console.error(`Error in step ${updateData.step}:`, updateData.details)
        toast({
          title: `Error: ${updateData.step}`,
          description: updateData.message || "An error occurred during the research process.",
          variant: "destructive",
        })
        setIsResearching(false)
        setSocketUrl(null); // Disconnect on error
        initialMessageSentRef.current = false; // Reset for next potential research
        // Clear task ID from storage on error via WebSocket
        localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
        console.log("Cleared task ID from localStorage (WebSocket error).");
      }
    },
    [toast, isPollingForTaskResult, stopPolling],
  )

  // --- WebSocket Hook Setup (onOpen needs modification) ---
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("WebSocket connection established");
      toast({ title: "Connected", description: "Real-time connection established." });
      // Stop polling if WebSocket connects successfully (means we might get live updates)
      if (isPollingForTaskResult) {
        console.log("WebSocket connected, stopping polling.");
        stopPolling();
      }
       if (currentQuery && !initialMessageSentRef.current) {
         console.log("Connection open, sending start_research for:", currentQuery);
         sendJsonMessage({ type: "start_research", query: currentQuery });
         initialMessageSentRef.current = true;
       }
    },
    onClose: (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
       if (!event.wasClean && socketUrl != null) { // Only show toast if not manually closed (socketUrl set to null)
           toast({ title: "Disconnected", description: `Connection closed unexpectedly: ${event.reason || event.code}`, variant: "destructive" });
       }
       initialMessageSentRef.current = false;
       if (isResearching && event.code !== 1000) {
           console.warn("WebSocket closed unexpectedly during research.");
           setIsResearching(false);
           // Don't automatically clear localStorage here, let the fetch logic handle it
           setMessages((prev) => [...prev, { step: "CONNECTION", status: "ERROR", message: "Connection lost unexpectedly. Check status or refresh."}]);
       }
    },
    onError: (event: Event) => {
      console.error("WebSocket error observed:", event);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the research server.",
        variant: "destructive"
      });
      setMessages((prev) => [
          ...prev,
          { step: "CONNECTION", status: "ERROR", message: "Failed to connect to the research server." },
      ]);
      setIsResearching(false);
      initialMessageSentRef.current = false;
      setSocketUrl(null);
      // If we fail to connect and were polling, continue polling.
    },
    onMessage: handleWebSocketMessage,
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  }, !!socketUrl);

  const isConnected = readyState === ReadyState.OPEN;

  // --- startResearch Function ---
  const startResearch = useCallback(
    (query: string) => {
      console.log("Attempting to start research for query:", query);
      stopPolling();
      clearTask();
    setMessages([])
    setReport(null)
    setPlan(null)
    setStats(null)
    setCurrentQuery(query)
      setIsResearching(true)
      initialMessageSentRef.current = false;

      // Construct the full WebSocket URL
      const wsBaseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000";
      const wsPath = "/ws/research"; // Define the specific path
      const fullWsUrl = `${wsBaseUrl}${wsPath}`;
      console.log("Setting socket URL to:", fullWsUrl);
      setSocketUrl(fullWsUrl);

      if (readyState === ReadyState.OPEN) {
        console.log("Already connected, sending start_research immediately for:", query);
        sendJsonMessage({ type: "start_research", query: query });
        initialMessageSentRef.current = true;
      }
    },
    [sendJsonMessage, readyState, toast, clearTask, stopPolling]
  );

  // --- stopResearch Function (Modified for HTTP request) ---
  const stopResearch = useCallback(async () => {
    const currentTaskId = taskId;
    console.log(`Stopping research... (Task ID: ${currentTaskId})`);
    stopPolling(); // Stop polling if active
    setIsResearching(false);

    let httpStopSuccess = false;
    if (currentTaskId) {
      console.log(`Sending HTTP POST to stop task ${currentTaskId}`);
      try {
        const response = await fetch(`${API_BASE_URL}/research/stop/${currentTaskId}`, {
          method: "POST",
        });
        if (response.ok) {
          console.log(`Successfully requested stop for task ${currentTaskId}`);
          httpStopSuccess = true;
          // Backend will update Firestore status, no need to add STOPPED message here
          // We might receive a final message via WS if backend sends one before closing connection
        } else {
          console.error(`Failed to request stop for task ${currentTaskId}: ${response.status} ${response.statusText}`);
          const errorBody = await response.text();
          console.error("Error body:", errorBody);
        }
      } catch (error) {
        console.error(`Network error trying to stop task ${currentTaskId}:`, error);
      }
    }

    // Close WebSocket connection regardless of HTTP success
    console.log("Closing WebSocket connection and clearing client state.");
    setSocketUrl(null);
    initialMessageSentRef.current = false;

    // Add a client-side message only if HTTP stop failed or no task ID
    if (!httpStopSuccess) {
         setMessages((prev) => [
           ...prev,
           { step: "CONTROL", status: "STOPPED", message: "Client stopped research. Backend stop request might have failed." },
         ]);
    }

    // Clear task ID from state and storage
    // Note: clearTask also calls stopPolling
    clearTask();

      toast({
        title: "Research Stopped",
        description: httpStopSuccess
          ? "Stop request sent to backend."
          : "Research stopped locally. Backend stop request may have failed.",
        variant: httpStopSuccess ? "default" : "default",
    });

  }, [taskId, readyState, toast, clearTask, stopPolling]);

  // --- pollTaskStatus function ---
  const pollTaskStatus = useCallback(async () => {
    const currentTaskId = taskId || localStorage.getItem(LOCAL_STORAGE_TASK_ID_KEY);
    if (!currentTaskId) {
      console.warn("Polling attempted without a task ID.");
      stopPolling();
      return;
    }

    console.log(`Polling status for Task ID: ${currentTaskId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/research/result/${currentTaskId}`);

      if (response.ok) {
        // Assumption: API returns TaskResultResponse & includes 'slug' on COMPLETE
        const data: TaskResultResponse & { slug?: string } = await response.json();
        console.log("Poll received task data:", data);

        if (data.status === "COMPLETE") {
          console.log("Polling found COMPLETE status.");
          stopPolling();
          localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
          if (data.slug) {
            toast({ title: "Research Complete", description: "Previous research finished. Redirecting to report..." });
            router.push(`/reports/${data.slug}`);
          } else {
            // Fallback if slug isn't provided (shouldn't happen ideally)
            toast({ title: "Research Complete", description: "Previous research finished. Please check the reports page.", duration: 5000 });
             // Optionally update state to show completion message locally
            setCurrentQuery(data.query);
            setReport(data.result?.finalReport || null);
            // Set plan/stats if needed
          }
        } else if (data.status === "ERROR") {
          console.log("Polling found ERROR status.");
          stopPolling();
          localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
          setMessages([
              { step: "POLLING", status: "ERROR", message: `Previous research task (${data.taskId.substring(0, 8)}) failed.` },
              { step: "ERROR", status: "FATAL", message: data.error || "An unspecified error occurred previously." },
          ]);
          toast({ title: "Research Failed", description: data.error || "The previous research task encountered an error.", variant: "destructive" });
        } else {
          // PENDING or PROCESSING - continue polling
          console.log(`Task ${currentTaskId} is still ${data.status}. Continuing poll.`);
          // Optionally update a message to show last checked time
          setMessages((prev) => [
            ...prev.filter(m => m.step !== "POLLING"), // Remove old polling message
            { step: "POLLING", status: "ACTIVE", message: `Checking status... Previous task is ${data.status}. Last checked: ${new Date().toLocaleTimeString()}` }
          ]);
        }
      } else if (response.status === 404) {
        console.error(`Polling failed: Task ID ${currentTaskId} not found (404).`);
        stopPolling();
        localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
        toast({ title: "Task Not Found", description: "The previous research task could not be found.", variant: "destructive" });
         setMessages([
            { step: "POLLING", status: "ERROR", message: `Could not find previous research task (${currentTaskId.substring(0, 8)}).` },
        ]);
      } else {
        // Handle other non-OK responses during polling
        console.error(`Polling failed: ${response.status} ${response.statusText}`);
        // Keep polling for now, might be a temporary server issue
      toast({
          title: "Polling Error",
          description: `Failed to check task status (${response.status}). Will retry.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error during pollTaskStatus fetch:", error);
      // Keep polling on network errors
      toast({
        title: "Network Error",
        description: "Could not connect to check task status. Will retry.",
        variant: "default"
      });
    }
  }, [taskId, router, toast, stopPolling]);

  // --- fetchTaskResult Function (needs modification) ---
  const fetchTaskResult = useCallback(async (idToFetch: string) => {
    console.log(`Fetching result for stored Task ID: ${idToFetch}`);
    // Don't set isResearching true immediately, only if polling starts
    setMessages([{ step: "INITIALIZING", status: "INFO", message: `Looking for previous research task: ${idToFetch.substring(0, 8)}...` }]);
    stopPolling(); // Ensure no old polling is running

    try {
      const response = await fetch(`${API_BASE_URL}/research/result/${idToFetch}`);

      if (response.ok) {
        const data: TaskResultResponse = await response.json();
        console.log("Fetched task data:", data);

        setCurrentQuery(data.query);
        setTaskId(data.taskId); // Ensure taskId state matches fetched task

        if (data.status === "COMPLETE" && data.result) {
          setReport(data.result.finalReport);
          const fetchedPlan = (data as any).plan || {}; 
          setPlan({
             writing_plan: fetchedPlan.writing_plan || {overall_goal:'N/A', desired_tone:'N/A', sections:[]},
             search_queries: fetchedPlan.search_queries || []
           });
          setStats({
            final_report_length: data.result.finalReport.length,
            usage: data.result.usageStatistics,
          });
          setMessages([
              { step: "INITIALIZING", status: "SUCCESS", message: `Loaded completed research for query: ${data.query}` },
              { step: "COMPLETE", status: "END", message: "Research process was previously completed." },
          ]);
          setIsResearching(false);
          toast({ title: "Research Loaded", description: "Successfully loaded previous research results." });
          localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
          console.log("Cleared task ID from localStorage (Fetch COMPLETE).");

        } else if (data.status === "ERROR") {
          setMessages([
              { step: "INITIALIZING", status: "ERROR", message: `Previous research task (${data.taskId.substring(0, 8)}) failed.` },
              { step: "ERROR", status: "FATAL", message: data.error || "An unspecified error occurred previously." },
          ]);
          setIsResearching(false);
          toast({ title: "Research Error", description: "Previous research task failed.", variant: "destructive" });
          localStorage.removeItem(LOCAL_STORAGE_TASK_ID_KEY);
          console.log("Cleared task ID from localStorage (Fetch ERROR).");

        } else { // PENDING or PROCESSING - Start Polling!
          console.log(`Task ${idToFetch} is ${data.status}. Starting polling.`);
          setIsPollingForTaskResult(true);
          setIsResearching(false); // Explicitly set researching to false
          setMessages([
              { step: "POLLING", status: "ACTIVE", message: `Checking status... Previous task (${data.taskId.substring(0, 8)}) is ${data.status}.` }
          ]);
          toast({ title: "Research In Progress", description: `Previous research is ${data.status}. Checking periodically...` });
          // Clear previous interval just in case, then start new one
          if (pollingIntervalIdRef.current) clearInterval(pollingIntervalIdRef.current);
          pollingIntervalIdRef.current = setInterval(pollTaskStatus, POLLING_INTERVAL_MS);
        }

      } else if (response.status === 404) {
        console.log(`Task ID ${idToFetch} not found.`);
        toast({ title: "Not Found", description: "Previous research task could not be found.", variant: "destructive" });
        clearTask(); // Clear invalid ID
        setIsResearching(false);
      } else {
        console.error("Failed to fetch task result:", response.status, response.statusText);
        toast({ title: "Fetch Error", description: "Failed to retrieve previous research status.", variant: "destructive" });
        setIsResearching(false);
         setMessages([
              { step: "INITIALIZING", status: "ERROR", message: `Failed to fetch status for task ${idToFetch.substring(0, 8)}.` },
          ]);
      }
    } catch (error) {
      console.error("Error during fetchTaskResult:", error);
      toast({ title: "Network Error", description: "Could not connect to server to check previous research.", variant: "destructive" });
      setIsResearching(false); 
       setMessages([
            { step: "INITIALIZING", status: "ERROR", message: `Network error while fetching status for task ${idToFetch.substring(0, 8)}.` },
        ]);
    }
  }, [toast, clearTask, pollTaskStatus, stopPolling]);

  // --- useEffect to Check for Stored Task ID on Load (remains the same logic) ---
  useEffect(() => {
    const storedTaskId = localStorage.getItem(LOCAL_STORAGE_TASK_ID_KEY);
    if (storedTaskId) {
      console.log("Found stored Task ID on load:", storedTaskId);
      // Fetch only if we don't have a task ID in state *and* aren't already polling
      if (!taskId && !isPollingForTaskResult) {
         fetchTaskResult(storedTaskId);
      }
    } else {
        console.log("No stored Task ID found on load.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // --- useEffect for Cleanup ---
  useEffect(() => {
    // Cleanup function to stop polling when the component unmounts
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // --- Provide context value ---
  const contextValue = {
        isResearching,
        isConnected,
        messages,
        report,
        plan,
        stats,
        startResearch,
        currentQuery,
        stopResearch,
        taskId,
        clearTask,
        isPollingForTaskResult
  }

  return <ResearchContext.Provider value={contextValue}>{children}</ResearchContext.Provider>
}

