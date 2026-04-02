import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore"
import type { Firestore } from "firebase/firestore"
import type { CpeTaskResult, CpeListItem } from "@/types/cpe"

const CPE_COLLECTION = "cpe_tasks"

function convertTimestamps<T>(data: T): T {
  if (!data || typeof data !== "object") return data
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = (data as any)[key]
      if (value instanceof Timestamp) {
        ;(data as any)[key] = value.toDate().toISOString()
      } else if (typeof value === "object") {
        convertTimestamps(value)
      }
    }
  }
  return data
}

export async function getCpeTaskById(id: string): Promise<CpeTaskResult | null> {
  if (typeof window === "undefined" || !db) {
    console.error("Firestore not available.")
    return null
  }
  const firestoreDb: Firestore = db

  try {
    const docRef = doc(firestoreDb, CPE_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    const data = docSnap.data()
    if (!data) return null

    const converted = convertTimestamps(data) as CpeTaskResult

    let validUpdatedAt = "1970-01-01T00:00:00.000Z"
    if (typeof converted.updatedAt === "string") {
      const d = new Date(converted.updatedAt)
      if (!isNaN(d.getTime())) validUpdatedAt = converted.updatedAt
    }
    converted.updatedAt = validUpdatedAt

    return converted
  } catch (error) {
    console.error(`Error fetching CPE task ${id}:`, error)
    return null
  }
}

export async function getAllCpeTasks(): Promise<CpeListItem[]> {
  if (typeof window === "undefined" || !db) {
    console.error("Firestore not available.")
    return []
  }
  const firestoreDb: Firestore = db

  try {
    const tasksRef = collection(firestoreDb, CPE_COLLECTION)
    const q = query(
      tasksRef,
      where("status", "==", "COMPLETED"),
      orderBy("createdAt", "desc"),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((d) => {
      const data = convertTimestamps(d.data()) as CpeTaskResult

      let validCreatedAt = "1970-01-01T00:00:00.000Z"
      if (typeof data.createdAt === "string") {
        const dt = new Date(data.createdAt)
        if (!isNaN(dt.getTime())) validCreatedAt = data.createdAt
      }

      return {
        id: d.id,
        query: data.query,
        location: data.location,
        createdAt: validCreatedAt,
        profileCount: data.profileCount,
      } satisfies CpeListItem
    })
  } catch (error) {
    console.error("Error fetching CPE tasks:", error)
    return []
  }
}
