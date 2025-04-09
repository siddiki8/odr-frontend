"use client"

import { ResearchForm } from "@/components/research-form"
import { ResearchViewer } from "@/components/research-viewer"
import { ResearchProvider } from "@/components/research-provider"
import { ResearchPlanDisplay } from "@/components/research-plan"
import { ResearchReport } from "@/components/research-report"
import { QueryDisplay } from "@/components/query-display"
import { motion, AnimatePresence } from "framer-motion"
import { useResearch } from "@/hooks/use-research"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  return (
    <main className="bg-background dark:bg-[#0F2027] dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] to-[#2C5364] text-foreground pt-16">
      <div className="container mx-auto px-4 pb-12 max-w-[1600px]">
        <motion.header
          className="mb-8 pt-12"
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


        <Alert variant="default" className="mb-8 border-yellow-500/50 text-yellow-700 dark:border-yellow-500/60 dark:text-yellow-300 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-2 [&>svg]:top-3 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold text-yellow-800 dark:text-yellow-200">Warning!</AlertTitle>
          <AlertDescription>
            Currently using a small model for writing completions for testing and stability. Larger and more intelligent models generate significantly more powerful results. Tokens aren't free though :D. Interested in funding or collaboration? Contact <a href="mailto:a.siddiki@proton.me" className="font-medium underline hover:text-yellow-900 dark:hover:text-yellow-100">a.siddiki@proton.me</a>
          </AlertDescription>
        </Alert>


        <ResearchProvider>
          <DynamicResearchLayout />
        </ResearchProvider>
      </div>
    </main>
  )
}

// Update the DynamicResearchLayout function to use currentQuery
function DynamicResearchLayout() {
  const { plan, report, isResearching, messages, currentQuery, resetUIState } = useResearch()
  const [shouldShowPlan, setShouldShowPlan] = useState(false)
  const [shouldShowReport, setShouldShowReport] = useState(false)
  const [shouldShowForm, setShouldShowForm] = useState(true)

  useEffect(() => {
    if (plan && isResearching) {
      const timer = setTimeout(() => {
        setShouldShowPlan(true)
        setShouldShowForm(false)
        setShouldShowReport(false)
      }, 800)
      return () => clearTimeout(timer)
    } else if (report && !isResearching) {
      const timer = setTimeout(() => {
        setShouldShowReport(true),
        setShouldShowPlan(true),
        setShouldShowForm(false)
      }, 1200)
      return () => clearTimeout(timer)
    } else if (!plan && !report) {
      setShouldShowForm(true)
      setShouldShowPlan(false)
      setShouldShowReport(false)
    } else if (isResearching && !plan) {
      setShouldShowForm(false)
      setShouldShowPlan(false)
      setShouldShowReport(false)
    }
  }, [plan, report, isResearching])

  const handleNewReportClick = () => {
    resetUIState();
  };

  return (
    <>
      {/* Query Display - spans full width above the grid */}
      {currentQuery && <QueryDisplay />}

      <AnimatePresence>
        {report && !isResearching && (
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              onClick={handleNewReportClick} 
              variant="secondary"
              className="shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Start New Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form and Plan */}
        <div className="space-y-6 relative">
          {/* Plan Display Area */}
          <AnimatePresence>
            {shouldShowPlan && plan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ResearchPlanDisplay />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Research Form */}
          <AnimatePresence>
            {shouldShowForm && (
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
            {shouldShowReport && report && (
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
          { (isResearching || shouldShowPlan || shouldShowReport) && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <ResearchViewer />
            </motion.div>
           )}
        </div>
      </div>
    </>
  )
} 