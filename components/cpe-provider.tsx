"use client"

import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useToast } from "@/hooks/use-toast"
import type { CpeMessage, CpeTaskResult, CpeUpdateData } from "@/types/cpe"
import {
  isCpeTaskIdMessage,
  isCpeError,
  isCpeRunSuccessfullyFinished,
} from "@/types/cpe"
import type { ResearchPlan } from "@/types/research"
import {
  planningPlanFromCpeMessage,
  planningPlanFromRestDocument,
} from "@/lib/cpe-planning"

const LOCAL_STORAGE_CPE_TASK_ID_KEY = "cpeTaskId"
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

interface CpeContextType {
  isRunning: boolean
  isConnected: boolean
  messages: CpeMessage[]
  profiles: CpeTaskResult["profiles"]
  stats: CpeTaskResult["usageStatistics"] | null
  /** Set from PLANNING/END WebSocket (same shape as Deep Research) or REST `plan` if present. */
  plan: ResearchPlan | null
  startCpe: (query: string, location?: string, maxSearchTasks?: number) => void
  currentQuery: string | null
  currentLocation: string | null
  stopCpe: () => void
  taskId: string | null
  clearTask: () => void
  profileCount: number
  /** Clears run output and task id but keeps the current query/location (for “new extraction”). */
  resetExtraction: () => void
}

export const CpeContext = createContext<CpeContextType>({
  isRunning: false,
  isConnected: false,
  messages: [],
  profiles: [],
  stats: null,
  plan: null,
  startCpe: () => {},
  currentQuery: null,
  currentLocation: null,
  stopCpe: () => {},
  taskId: null,
  clearTask: () => {},
  profileCount: 0,
  resetExtraction: () => {},
})

export function CpeProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false)
  const [messages, setMessages] = useState<CpeMessage[]>([])
  const [profiles, setProfiles] = useState<CpeTaskResult["profiles"]>([])
  const [stats, setStats] = useState<CpeTaskResult["usageStatistics"] | null>(null)
  const [currentQuery, setCurrentQuery] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [profileCount, setProfileCount] = useState(0)
  const [plan, setPlan] = useState<ResearchPlan | null>(null)
  const { toast } = useToast()

  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const initialMessageSentRef = useRef(false)
  const pendingPayloadRef = useRef<{
    query: string
    location?: string
    maxSearchTasks?: number
  } | null>(null)
  const taskIdRef = useRef<string | null>(null)
  const resultFetchedForRunRef = useRef<string | null>(null)

  const clearTask = useCallback(() => {
    setTaskId(null)
    taskIdRef.current = null
    localStorage.removeItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
  }, [])

  const fetchCpeResult = useCallback(
    async (id: string) => {
      if (resultFetchedForRunRef.current === id) return
      resultFetchedForRunRef.current = id
      try {
        const res = await fetch(`${API_BASE_URL}/cpe/result/${id}`)
        if (!res.ok) {
          console.warn("CPE result fetch failed:", res.status)
          resultFetchedForRunRef.current = null
          return
        }
        const data = (await res.json()) as Record<string, unknown>
        const rawProfiles = data.profiles
        const list = Array.isArray(rawProfiles) ? rawProfiles : []
        setProfiles(list as CpeTaskResult["profiles"])

        const count =
          (typeof data.profileCount === "number" ? data.profileCount : null) ??
          (typeof data.profile_count === "number" ? data.profile_count : null) ??
          list.length
        setProfileCount(count)

        const usage =
          (data.usageStatistics as CpeTaskResult["usageStatistics"]) ??
          (data.usage_statistics as CpeTaskResult["usageStatistics"]) ??
          null
        setStats(usage)

        if (typeof data.query === "string") setCurrentQuery(data.query)
        if (data.location !== undefined)
          setCurrentLocation(
            typeof data.location === "string" ? data.location : null,
          )

        const restPlan = planningPlanFromRestDocument(data)
        if (restPlan) setPlan(restPlan)

        toast({
          title: "Extraction Complete",
          description: `${count} company profiles loaded.`,
        })
      } catch (e) {
        console.error("fetchCpeResult:", e)
        resultFetchedForRunRef.current = null
      }
    },
    [toast],
  )

  const resetExtraction = useCallback(() => {
    setMessages([])
    setProfiles([])
    setStats(null)
    setProfileCount(0)
    setPlan(null)
    resultFetchedForRunRef.current = null
    clearTask()
  }, [clearTask])

  useEffect(() => {
    taskIdRef.current = taskId
  }, [taskId])

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      let data: CpeUpdateData
      try {
        const parsed = JSON.parse(event.data)
        if (!parsed || typeof parsed !== "object" || !parsed.step || !parsed.status) {
          throw new Error("Invalid message structure")
        }
        data = parsed as CpeUpdateData
      } catch (err) {
        console.error("Failed to parse CPE WS message:", err, event.data)
        return
      }

      console.log(`CPE WS: ${data.step} - ${data.status}`, data.details)

      if (typeof data.details?.task_id === "string") {
        const receivedId = data.details.task_id
        taskIdRef.current = receivedId
        setTaskId(receivedId)
        localStorage.setItem(LOCAL_STORAGE_CPE_TASK_ID_KEY, receivedId)
      }

      if (isCpeTaskIdMessage(data)) {
        return
      }

      const newMsg: CpeMessage = {
        step: data.step,
        status: data.status,
        message: data.message,
        details: data.details,
      }
      setMessages((prev) => [...prev, newMsg])

      const extractedPlan = planningPlanFromCpeMessage(data)
      if (extractedPlan) {
        console.log("CPE: plan received from PLANNING/END")
        setPlan(extractedPlan)
      }

      if (isCpeRunSuccessfullyFinished(data)) {
        console.log("CPE run finished; loading persisted result from API.")
        setIsRunning(false)
        setSocketUrl(null)
        initialMessageSentRef.current = false
        const id = taskIdRef.current
        if (id) {
          void fetchCpeResult(id)
        } else {
          console.warn("CPE complete but no task id available for result fetch.")
        }
        setStats((data.details?.usage as CpeTaskResult["usageStatistics"]) ?? null)
        setProfileCount(
          typeof data.details?.profiles_extracted === "number"
            ? data.details.profiles_extracted
            : 0,
        )
        localStorage.removeItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
      } else if (isCpeError(data)) {
        console.error("CPE error:", data.details)
        toast({
          title: `Error: ${data.step}`,
          description: data.message || "An error occurred.",
          variant: "destructive",
        })
        setIsRunning(false)
        setSocketUrl(null)
        initialMessageSentRef.current = false
        resultFetchedForRunRef.current = null
        localStorage.removeItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
      }
    },
    [toast, fetchCpeResult],
  )

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("CPE WebSocket connected")
      toast({ title: "Connected", description: "CPE connection established." })
      if (pendingPayloadRef.current && !initialMessageSentRef.current) {
        sendJsonMessage(pendingPayloadRef.current)
        initialMessageSentRef.current = true
      }
    },
    onClose: (event) => {
      console.log("CPE WS closed:", event.code, event.reason)
      if (!event.wasClean && socketUrl != null) {
        toast({
          title: "Disconnected",
          description: `Connection closed: ${event.reason || event.code}`,
          variant: "destructive",
        })
      }
      initialMessageSentRef.current = false
      if (isRunning && event.code !== 1000) {
        setIsRunning(false)
        setMessages((prev) => [
          ...prev,
          { step: "CONNECTION", status: "ERROR", message: "Connection lost unexpectedly." },
        ])
      }
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the CPE server.",
        variant: "destructive",
      })
      setIsRunning(false)
      setSocketUrl(null)
      initialMessageSentRef.current = false
    },
    onMessage: handleWebSocketMessage,
    shouldReconnect: () => true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  }, !!socketUrl)

  const isConnected = readyState === ReadyState.OPEN

  const startCpe = useCallback(
    (query: string, location?: string, maxSearchTasks?: number) => {
      clearTask()
      resultFetchedForRunRef.current = null
      setMessages([])
      setProfiles([])
      setStats(null)
      setProfileCount(0)
      setPlan(null)
      setCurrentQuery(query)
      setCurrentLocation(location ?? null)
      setIsRunning(true)
      initialMessageSentRef.current = false

      const payload: Record<string, unknown> = { query }
      if (location) payload.location = location
      if (maxSearchTasks !== undefined) payload.max_search_tasks = maxSearchTasks
      pendingPayloadRef.current = payload as { query: string; location?: string; maxSearchTasks?: number }

      const wsBase =
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000"
      const fullUrl = `${wsBase}/cpe/ws/cpe`
      console.log("CPE WS URL:", fullUrl)
      setSocketUrl(fullUrl)

      if (readyState === ReadyState.OPEN && !initialMessageSentRef.current) {
        sendJsonMessage(payload)
        initialMessageSentRef.current = true
      }
    },
    [sendJsonMessage, readyState, clearTask],
  )

  const stopCpe = useCallback(async () => {
    const currentId = taskId
    console.log("Stopping CPE task:", currentId)
    setIsRunning(false)

    if (currentId) {
      try {
        const res = await fetch(`${API_BASE_URL}/cpe/stop/${currentId}`, {
          method: "POST",
        })
        if (res.ok) {
          toast({ title: "CPE Stopped", description: "Stop request sent." })
        } else {
          console.error("CPE stop failed:", res.status)
        }
      } catch (err) {
        console.error("CPE stop network error:", err)
      }
    }

    setSocketUrl(null)
    initialMessageSentRef.current = false
    clearTask()
    setMessages((prev) => [
      ...prev,
      { step: "CONTROL", status: "STOPPED", message: "Extraction stopped by user." },
    ])
  }, [taskId, toast, clearTask])

  // On mount, check for a stored CPE task ID and fetch its result
  useEffect(() => {
    const storedId = localStorage.getItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
    if (storedId && !taskId) {
      setTaskId(storedId)
      fetch(`${API_BASE_URL}/cpe/result/${storedId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (!data) return
          if (data.status === "COMPLETED") {
            setProfiles(data.profiles ?? [])
            setProfileCount(data.profileCount ?? 0)
            setStats(data.usageStatistics ?? null)
            setCurrentQuery(data.query)
            setCurrentLocation(data.location ?? null)
            localStorage.removeItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
            toast({ title: "CPE Loaded", description: "Previous CPE results loaded." })
          } else if (data.status === "ERROR" || data.status === "CANCELLED") {
            localStorage.removeItem(LOCAL_STORAGE_CPE_TASK_ID_KEY)
            setTaskId(null)
          }
        })
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CpeContext.Provider
      value={{
        isRunning,
        isConnected,
        messages,
        profiles,
        stats,
        plan,
        startCpe,
        currentQuery,
        currentLocation,
        stopCpe,
        taskId,
        clearTask,
        profileCount,
        resetExtraction,
      }}
    >
      {children}
    </CpeContext.Provider>
  )
}
