"use client"

import { useCpe } from "@/hooks/use-cpe"
import type { CompanyProfile } from "@/types/cpe"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Globe,
  MapPin,
  Users,
  ExternalLink,
  Download,
  Briefcase,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

function ProfileCard({
  profile,
  index,
}: {
  profile: CompanyProfile
  index: number
}) {
  const domain = profile.website
    ? (() => {
        try {
          return new URL(
            profile.website.startsWith("http")
              ? profile.website
              : `https://${profile.website}`,
          ).hostname
        } catch {
          return profile.website
        }
      })()
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-background/50 dark:bg-black/20 rounded-lg border border-border/50 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base text-card-foreground truncate">
          {profile.name ?? "Unknown Company"}
        </h3>
        {profile.website && (
          <a
            href={
              profile.website.startsWith("http")
                ? profile.website
                : `https://${profile.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-primary hover:text-primary/80 transition-colors"
            aria-label={`Visit ${profile.name ?? "company"} website`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {profile.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {profile.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {domain && (
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {domain}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {profile.location}
          </span>
        )}
        {profile.industry && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {profile.industry}
          </span>
        )}
        {profile.size && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {profile.size}
          </span>
        )}
      </div>

      {/* Extra fields rendered as badges */}
      {(() => {
        const known = new Set([
          "name",
          "website",
          "description",
          "industry",
          "location",
          "size",
          "founded",
          "linkedin",
          "email",
          "phone",
        ])
        const extras = Object.entries(profile).filter(
          ([k, v]) => !known.has(k) && v !== undefined && v !== null && v !== "",
        )
        if (extras.length === 0) return null
        return (
          <div className="mt-3 flex flex-wrap gap-1">
            {extras.slice(0, 6).map(([k, v]) => (
              <Badge key={k} variant="secondary" className="text-[10px]">
                {k.replace(/_/g, " ")}: {String(v)}
              </Badge>
            ))}
          </div>
        )
      })()}
    </motion.div>
  )
}

export function CpeProfiles() {
  const { profiles, currentQuery, currentLocation, profileCount, isRunning } = useCpe()
  const { toast } = useToast()

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
    toast({ title: "Downloaded", description: "Profiles saved as JSON." })
  }

  if (!profiles || profiles.length === 0) return null

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl text-card-foreground">
                Extracted Profiles
              </CardTitle>
              <CardDescription>
                {profileCount || profiles.length} companies found
                {currentQuery && ` for "${currentQuery}"`}
                {currentLocation && ` in ${currentLocation}`}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[640px] pr-3">
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence initial={false}>
              {profiles.map((profile, i) => (
                <ProfileCard key={i} profile={profile} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
