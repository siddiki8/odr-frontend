"use client"

import { useState, useEffect } from "react"
import { getAllResearchReports } from "@/lib/research-service"
import type { ReportListItem } from "@/types/research"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { FileText, Calendar, Search, ArrowRight, FileQuestion } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const allReports = await getAllResearchReports()
        setReports(allReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  return (
    <div className="container mx-auto px-4 pt-16 pb-12 max-w-[1600px]">
      <motion.div
        className="mb-12 text-center pt-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] dark:from-gray-100 dark:to-white">
          Completed Research Reports
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Browse your collection of completed research reports. Each card represents a finished research task.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
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
        ) : reports.length > 0 ? (
          reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden h-full flex flex-col">
                <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-card-foreground line-clamp-2">
                    <span className="flex items-center">
                      <FileQuestion className="h-5 w-5 mr-2 text-primary/80 shrink-0" />
                      {report.query}
                    </span>
                  </CardTitle>
                  <CardDescription className="pt-1 text-xs font-mono text-muted-foreground/80">ID: {report.id.substring(0, 8)}...</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <div className="flex justify-start items-center text-xs text-muted-foreground mt-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(new Date(report.createdAt))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#0F2027]/90 via-[#203A43]/90 to-[#2C5364]/90 hover:opacity-90 text-white shadow-sm border-0 transition-all duration-300"
                  >
                    <Link href={`/reports/${report.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-medium mb-2">No Completed Reports Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No research tasks have completed successfully yet. Start a new research query!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">
                <Search className="h-4 w-4 mr-2" />
                Start New Research
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

