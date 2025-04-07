import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a URL-friendly slug from a string
export function generateSlug(text: string): string {
  // Create a base slug from the text
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length

  // Add a short unique ID
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6)
  const uniqueId = nanoid()

  return `${baseSlug}-${uniqueId}`
}

// Format date for display
export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

