"use client"

import { useState, useEffect } from "react"
import { getAllCpeTasks } from "@/lib/cpe-service"
import type { CpeListItem } from "@/types/cpe"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import {
  Building2,
  Calendar,
  ArrowRight,
  Search,
  MapPin,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function CpeReportsPage() {
  const [tasks, setTasks] = useState<CpeListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCpeTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto px-4 pt-16 pb-12 max-w-[1600px]">
      <motion.div
        className="mb-12 text-center pt-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1a3a4a] via-[#1e4d6b] to-[#1a6b8a] dark:from-gray-100 dark:to-white">
          CPE Results
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Browse completed Company Profile Extraction results.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden"
            >
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3 mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden h-full flex flex-col">
                <div className="h-1 bg-gradient-to-r from-[#1a3a4a] via-[#1e4d6b] to-[#1a6b8a]" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-card-foreground line-clamp-2">
                    <span className="flex items-start gap-2">
                      <Building2 className="h-5 w-5 text-primary/80 shrink-0 mt-0.5" />
                      {task.query}
                    </span>
                  </CardTitle>
                  {task.location && (
                    <CardDescription className="flex items-center gap-1 text-xs pt-1">
                      <MapPin className="h-3 w-3" />
                      {task.location}
                    </CardDescription>
                  )}
                  <CardDescription className="text-xs font-mono text-muted-foreground/80">
                    ID: {task.id.substring(0, 8)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(new Date(task.createdAt))}
                    </div>
                    {task.profileCount !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {task.profileCount} profiles
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#1a3a4a]/90 via-[#1e4d6b]/90 to-[#1a6b8a]/90 hover:opacity-90 text-white shadow-sm border-0 transition-all duration-300"
                  >
                    <Link href={`/cpe-reports/${task.id}`}>
                      <Building2 className="h-4 w-4 mr-2" />
                      View Profiles
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-medium mb-2">No CPE Results Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No completed Company Profile Extraction tasks found. Run your
              first extraction!
            </p>
            <Button asChild className="mt-6">
              <Link href="/cpe">
                <Search className="h-4 w-4 mr-2" />
                Start Extraction
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
