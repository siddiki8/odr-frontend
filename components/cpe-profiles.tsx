"use client"

import { useCpe } from "@/hooks/use-cpe"
import type { CompanyProfile } from "@/types/cpe"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

function ProfileCard({ profile, index }: { profile: CompanyProfile; index: number }) {
  const domain = profile.website
    ? (() => {
        try {
          return new URL(
            profile.website.startsWith("http") ? profile.website : `https://${profile.website}`,
          ).hostname
        } catch {
          return profile.website
        }
      })()
    : null

  const known = new Set(["name", "website", "description", "industry", "location", "size", "founded", "linkedin", "email", "phone"])
  const extras = Object.entries(profile).filter(
    ([k, v]) => !known.has(k) && v !== undefined && v !== null && v !== "",
  )

  return (
    <div className="border border-[var(--nd-border)] rounded-lg bg-[var(--nd-surface)] p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-1">
            {String(index + 1).padStart(2, "0")} — COMPANY
          </p>
          <h3 className="font-grotesk text-base font-medium text-[var(--nd-text-display)]">
            {profile.name ?? "Unknown Company"}
          </h3>
        </div>
        {profile.website && (
          <a
            href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-secondary)] hover:text-[var(--nd-text-primary)] border-b border-[var(--nd-border-visible)] shrink-0"
            aria-label={`Visit ${profile.name ?? "company"} website`}
          >
            {domain ?? "VISIT"}
          </a>
        )}
      </div>

      {profile.description && (
        <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mb-3 line-clamp-3">
          {profile.description}
        </p>
      )}

      {/* Metadata rows */}
      <div className="space-y-1 border-t border-[var(--nd-border)] pt-3">
        {profile.location && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">LOCATION</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.location}</span>
          </div>
        )}
        {profile.industry && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">INDUSTRY</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.industry}</span>
          </div>
        )}
        {profile.size && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">SIZE</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{profile.size}</span>
          </div>
        )}
        {profile.founded && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--nd-text-disabled)]">FOUNDED</span>
            <span className="font-mono text-[11px] text-[var(--nd-text-secondary)]">{String(profile.founded)}</span>
          </div>
        )}
      </div>

      {extras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {extras.slice(0, 6).map(([k, v]) => (
            <span
              key={k}
              className="font-mono text-[10px] uppercase tracking-[0.04em] border border-[var(--nd-border-visible)] text-[var(--nd-text-disabled)] px-2 py-0.5 rounded-full"
            >
              {k.replace(/_/g, " ")}: {String(v)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function CpeProfiles() {
  const { profiles, currentQuery, currentLocation, profileCount } = useCpe()
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null)

  const handleDownload = () => {
    if (!profiles || profiles.length === 0) return
    const json = JSON.stringify(profiles, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "company-profiles.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadStatus("[DOWNLOADED]")
    setTimeout(() => setDownloadStatus(null), 2000)
  }

  if (!profiles || profiles.length === 0) return null

  return (
    <div className="border border-[var(--nd-border-visible)] rounded-xl overflow-hidden bg-[var(--nd-surface)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--nd-border)] bg-[var(--nd-surface-raised)] flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)]">
            EXTRACTED PROFILES
          </p>
          <p className="font-grotesk text-xs text-[var(--nd-text-disabled)] mt-1">
            {profileCount || profiles.length} companies found
            {currentQuery && ` for "${currentQuery}"`}
            {currentLocation && ` in ${currentLocation}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {downloadStatus && (
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--nd-success)]">
              {downloadStatus}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            EXPORT JSON
          </Button>
        </div>
      </div>

      <div className="p-6">
        <ScrollArea className="h-[640px] pr-3">
          <div className="grid grid-cols-1 gap-3">
            {profiles.map((profile, i) => (
              <ProfileCard key={i} profile={profile} index={i} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
