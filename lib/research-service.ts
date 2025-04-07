import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore"
import type { Firestore } from "firebase/firestore"
import type { TaskResultResponse, ReportListItem } from "@/types/research"

// Define the collection name used by the backend
const TASKS_COLLECTION = "research_tasks"

// Helper to convert Firestore Timestamps in fetched data
function convertTimestamps<T>(data: T): T {
  if (!data || typeof data !== 'object') return data;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value instanceof Timestamp) {
        // Convert Firestore Timestamp to ISO string
        (data as any)[key] = value.toDate().toISOString();
      } else if (typeof value === 'object') {
        // Recursively convert nested objects/arrays
        convertTimestamps(value);
      }
    }
  }
  return data;
}

// Get a research task by ID (task ID)
export async function getResearchReportById(id: string): Promise<TaskResultResponse | null> {
  if (typeof window === "undefined" || !db) {
    console.error("Firestore not available in this environment.");
    return null;
  }
  const firestoreDb: Firestore = db;

  try {
    const docRef = doc(firestoreDb, TASKS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log(`No task found with ID: ${id}`);
      return null
    }

    const data = docSnap.data() as TaskResultResponse; // Assume basic type
    const convertedData = convertTimestamps(data); // Convert timestamps

    // Validate updatedAt after conversion
    let validUpdatedAt = '1970-01-01T00:00:00.000Z'; // Default fallback date
    if (typeof convertedData.updatedAt === 'string') {
      const dateCheck = new Date(convertedData.updatedAt);
      if (!isNaN(dateCheck.getTime())) {
        validUpdatedAt = convertedData.updatedAt;
      } else {
        console.warn(`Invalid updatedAt date string found for task ${id}: ${convertedData.updatedAt}. Using default.`);
      }
    } else {
       console.warn(`Missing or non-string updatedAt for task ${id}. Using default.`);
    }
    convertedData.updatedAt = validUpdatedAt; // Overwrite with validated or default date

    // Optionally, ensure it's complete before returning, or let the component handle status
    // if (convertedData.status !== 'COMPLETE') {
    //    console.log(`Task ${id} found but status is ${convertedData.status}`);
    //    return null; // Or return the data and let caller decide
    // }

    return convertedData;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
}

// Get all COMPLETED research tasks for the list page
export async function getAllResearchReports(): Promise<ReportListItem[]> {
  if (typeof window === "undefined" || !db) {
    console.error("Firestore not available in this environment.");
    return [];
  }
  const firestoreDb: Firestore = db;

  try {
    const tasksRef = collection(firestoreDb, TASKS_COLLECTION)
    // Query for completed tasks, order by creation date descending
    const q = query(
      tasksRef,
      where("status", "==", "COMPLETE"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as TaskResultResponse; // Basic type assumption
      const convertedData = convertTimestamps(data); // Convert timestamps

      // Validate createdAt after conversion
      let validCreatedAt = '1970-01-01T00:00:00.000Z'; // Default fallback date
      if (typeof convertedData.createdAt === 'string') {
        const dateCheck = new Date(convertedData.createdAt);
        if (!isNaN(dateCheck.getTime())) {
          validCreatedAt = convertedData.createdAt;
        } else {
          console.warn(`Invalid date string found for task ${doc.id}: ${convertedData.createdAt}. Using default.`);
        }
      } else {
         console.warn(`Missing or non-string createdAt for task ${doc.id}. Using default.`);
      }

      // Map to the simplified ReportListItem type
      return {
        id: doc.id, // Use Firestore doc ID which is the taskId
        query: convertedData.query,
        createdAt: validCreatedAt, // Use validated or default date
      };
    });
  } catch (error) {
     console.error("Error fetching completed tasks:", error);
     return []; // Return empty array on error
  }
}

