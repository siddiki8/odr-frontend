"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getCpeTaskById } from "@/lib/cpe-service"
import type { CpeTaskResult, CompanyProfile } from "@/types/cpe"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  Globe,
  Info,
  Loader2,
  MapPin,
  Briefcase,
  Users,
  X,
  DollarSign,
  Sigma,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

function formatNumber(n: number | undefined): string {
  return n !== undefined ? n.toLocaleString() : "N/A"
}

function formatCurrency(n: number | undefined): string {
  return n !== undefined ? `$${n.toFixed(4)}` : "N/A"
}

function ProfileCard({ profile, index }: { profile: CompanyProfile; index: number }) {
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

  const known = new Set([
    "name", "website", "description", "industry",
    "location", "size", "founded", "linkedin", "email", "phone",
  ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="bg-background/50 dark:bg-black/20 rounded-lg border border-border/50 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base text-card-foreground">
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
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {profile.description && (
        <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {domain && (
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />{domain}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{profile.location}
          </span>
        )}
        {profile.industry && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />{profile.industry}
          </span>
        )}
        {profile.size && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />{profile.size}
          </span>
        )}
        {profile.founded && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />Est. {profile.founded}
          </span>
        )}
      </div>

      {/* Extra fields */}
      {(() => {
        const extras = Object.entries(profile).filter(
          ([k, v]) => !known.has(k) && v !== undefined && v !== null && v !== "",
        )
        if (!extras.length) return null
        return (
          <div className="mt-3 flex flex-wrap gap-1">
            {extras.slice(0, 8).map(([k, v]) => (
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

export default function CpeDetailPage() {
  const { taskId } = useParams() as { taskId: string }
  const [task, setTask] = useState<CpeTaskResult | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!taskId) return
    getCpeTaskById(taskId)
      .then(setTask)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [taskId])

  const handleDownload = () => {
    if (!task?.profiles) return
    const blob = new Blob([JSON.stringify(task.profiles, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${taskId}-profiles.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: "Downloaded", description: "Profiles saved as JSON." })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-[1600px] space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px] text-center">
        <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Result Not Found</h2>
        <p className="text-muted-foreground mb-6">
          No CPE task found with ID{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{taskId}</code>.
        </p>
        <Button asChild variant="outline">
          <Link href="/cpe-reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Link>
        </Button>
      </div>
    )
  }

  if (task.status !== "COMPLETED") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px] text-center">
        {task.status === "ERROR" ? (
          <X className="h-12 w-12 mx-auto mb-4 text-destructive" />
        ) : (
          <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
        )}
        <h2 className="text-2xl font-bold mb-4">Status: {task.status}</h2>
        <p className="text-muted-foreground mb-2">Query:</p>
        <p className="text-lg font-medium mb-6 bg-muted/50 p-3 rounded border max-w-2xl mx-auto">
          "{task.query}"
        </p>
        {task.error && (
          <p className="text-destructive mb-4">Error: {task.error}</p>
        )}
        <Button asChild variant="outline">
          <Link href="/cpe-reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Link>
        </Button>
      </div>
    )
  }

  const completedDate = task.completedAt ? new Date(task.completedAt) : null
  const profiles = task.profiles ?? []

  return (
    <div className="container mx-auto px-4 pt-16 pb-12 max-w-[1600px]">
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" asChild>
          <Link href="/cpe-reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          {completedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(completedDate)}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={profiles.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#1a3a4a] via-[#1e4d6b] to-[#1a6b8a] dark:from-gray-100 dark:to-white">
          {task.query}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {task.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {task.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {task.profileCount ?? profiles.length} profiles extracted
          </span>
          {task.processedDomainCount !== undefined && (
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {task.processedDomainCount} domains processed
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats summary */}
      {task.usageStatistics && (
        <motion.div
          className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Serper Queries
                </p>
                <p className="font-semibold">
                  {formatNumber(task.usageStatistics.serper_queries_used)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Sigma className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Tokens
                </p>
                <p className="font-semibold">
                  {formatNumber(
                    Object.values(task.usageStatistics.token_usage ?? {}).reduce(
                      (s, u) => s + (u?.total_tokens ?? 0),
                      0,
                    ),
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Est. Cost
                </p>
                <p className="font-semibold">
                  {formatCurrency(
                    Object.values(task.usageStatistics.estimated_cost ?? {}).reduce(
                      (s, v) => s + v,
                      0,
                    ),
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Profiles grid */}
      {profiles.length > 0 ? (
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#1a3a4a] via-[#1e4d6b] to-[#1a6b8a]" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-card-foreground">
                Company Profiles ({profiles.length})
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[700px] pr-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profiles.map((profile, i) => (
                  <ProfileCard key={i} profile={profile} index={i} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No profile data stored for this task.</p>
        </div>
      )}
    </div>
  )
}
