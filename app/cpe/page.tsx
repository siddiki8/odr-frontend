"use client"

import { CpeProvider } from "@/components/cpe-provider"
import { CpeForm } from "@/components/cpe-form"
import { CpeViewer } from "@/components/cpe-viewer"
import { CpeProfiles } from "@/components/cpe-profiles"
import { CpeQueryDisplay } from "@/components/cpe-query-display"
import { CpePipelineCard } from "@/components/cpe-pipeline-card"
import { ResearchPlanDisplay } from "@/components/research-plan"
import { motion, AnimatePresence } from "framer-motion"
import { useCpe } from "@/hooks/use-cpe"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText } from "lucide-react"

export default function CpePage() {
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
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background dark:to-[#0a1f2e] z-10" />
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
                Company Profile Extractor
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Automatically discover and extract structured company profiles.
                Describe the type of businesses you're looking for and let the
                agent do the rest.
              </p>
            </div>

            <div className="w-[120px] shrink-0 hidden md:flex md:items-center md:justify-center">
              <Button variant="outline" asChild>
                <Link href="/cpe-reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Past Results
                </Link>
              </Button>
            </div>
          </div>
        </motion.header>

        <CpeProvider>
          <CpeLayout />
        </CpeProvider>
      </div>
    </main>
  )
}

function CpeLayout() {
  const {
    profiles,
    isRunning,
    messages,
    resetExtraction,
    currentQuery,
    plan,
  } = useCpe()
  const hasProfiles = (profiles?.length ?? 0) > 0
  const showProgressPanel =
    Boolean(currentQuery) ||
    isRunning ||
    messages.length > 0 ||
    Boolean(plan)

  const [shouldShowPlan, setShouldShowPlan] = useState(false)
  const [shouldShowForm, setShouldShowForm] = useState(true)

  useEffect(() => {
    if (plan && isRunning) {
      const t = setTimeout(() => {
        setShouldShowPlan(true)
        setShouldShowForm(false)
      }, 800)
      return () => clearTimeout(t)
    }
    if (plan && !isRunning) {
      setShouldShowPlan(true)
      setShouldShowForm(false)
    }
    if (!plan) {
      setShouldShowPlan(false)
      setShouldShowForm(true)
    }
  }, [plan, isRunning])

  const handleReset = () => {
    resetExtraction()
  }

  return (
    <>
      <CpeQueryDisplay />

      <AnimatePresence>
        {hasProfiles && !isRunning && (
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleReset}
              variant="secondary"
              className="shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear results and start over
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 relative">
          <AnimatePresence>
            {shouldShowPlan && plan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="mb-2"
              >
                <ResearchPlanDisplay plan={plan} heading="Extraction plan" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {shouldShowForm && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="relative z-0"
              >
                <CpeForm />
              </motion.div>
            )}
          </AnimatePresence>

          <CpePipelineCard />

          <AnimatePresence>
            {hasProfiles && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <CpeProfiles />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6 relative">
          {showProgressPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CpeViewer />
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
