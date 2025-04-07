"use client"

import { ResearchForm } from "@/components/research-form"
import { ResearchViewer } from "@/components/research-viewer"
import { ResearchProvider } from "@/components/research-provider"
import { ResearchPlan } from "@/components/research-plan"
import { ResearchReport } from "@/components/research-report"
import { QueryDisplay } from "@/components/query-display"
import { motion, AnimatePresence } from "framer-motion"
import { useResearch } from "@/hooks/use-research"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background dark:bg-[#0F2027] dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] to-[#2C5364] text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-[1600px]">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-[120px] h-[120px] overflow-hidden rounded-full shrink-0">
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background dark:to-[#0F2027] z-10"></div>
              <Image
                src="/logo.png"
                alt="ODR-API Logo"
                width={120}
                height={120}
                className="object-contain relative z-0"
              />
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] dark:from-gray-100 dark:to-white">
                Deep Research
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                An advanced research tool that performs comprehensive analysis on any topic, searching the web and
                synthesizing information into a detailed report.
              </p>
            </div>

            {/* Empty div to balance the layout */}
            <div className="w-[120px] shrink-0 hidden md:flex md:items-center md:justify-center">
              <Button variant="outline" asChild>
                <Link href="/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
            </div>
          </div>
        </motion.header>

        <ResearchProvider>
          <DynamicResearchLayout />
        </ResearchProvider>
      </div>
    </main>
  )
}

// Update the DynamicResearchLayout function to use currentQuery
function DynamicResearchLayout() {
  const { plan, report, isResearching, messages, currentQuery } = useResearch()
  const [showPlan, setShowPlan] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showForm, setShowForm] = useState(true)

  // Show plan when it becomes available
  useEffect(() => {
    if (plan && !showPlan) {
      // Small delay to make the animation feel natural
      const timer = setTimeout(() => {
        setShowPlan(true)
        // Hide the form when plan is shown
        setShowForm(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [plan, showPlan])

  // Show report when it becomes available and research is complete
  useEffect(() => {
    if (report && !isResearching && !showReport) {
      // Small delay to make the animation feel natural
      const timer = setTimeout(() => setShowReport(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [report, isResearching, showReport])

  return (
    <>
      {/* Query Display - spans full width above the grid */}
      {currentQuery && <QueryDisplay />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form and Plan */}
        <div className="space-y-6 relative">
          {/* Research Plan */}
          <AnimatePresence>
            {showPlan && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <ResearchPlan />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Research Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="relative z-0"
              >
                <ResearchForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Research Viewer and Report */}
        <div className="space-y-6 relative">
          {/* Final Report - slides out ABOVE the progress component */}
          <AnimatePresence>
            {showReport && (
              <motion.div
                initial={{ opacity: 0, y: 50, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 50, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden mb-6"
              >
                <ResearchReport />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Research Viewer */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ResearchViewer />
          </motion.div>
        </div>
      </div>
    </>
  )
}

