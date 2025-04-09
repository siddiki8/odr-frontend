"use client"

import { useResearch } from "@/hooks/use-research"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Search, Lightbulb, List, Target, MessageSquare, Flag } from "lucide-react"
import type { ResearchPlan as ResearchPlanType } from "@/types/research"
import type { WritingPlanSection } from "@/types/research"

// Define props for the component
interface ResearchPlanDisplayProps {
  plan?: ResearchPlanType | null // Allow passing an optional plan
}

export function ResearchPlanDisplay({ plan: planProp }: ResearchPlanDisplayProps) {
  // Use the hook only if no plan is passed via props
  const { plan: planFromHook } = useResearch()

  // Determine which plan to use: prioritize the prop
  const planToDisplay = planProp !== undefined ? planProp : planFromHook

  const typedPlan = planToDisplay as ResearchPlanType | null;

  if (!typedPlan) {
    return null
  }

  const { writing_plan, search_queries } = typedPlan

  // --- Add Defensive Check --- 
  if (!writing_plan) {
    // Handle the case where writing_plan itself is missing within the plan object
    console.warn("ResearchPlanDisplay received plan object without writing_plan.", typedPlan);
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
        <CardContent className="p-6 text-center text-muted-foreground">
          Plan details are missing or incomplete.
        </CardContent>
      </Card>
    );
  }
  // --- End Check ---

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden dark:bg-[#111921]/90">
      <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground">Research Plan</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Research Goal (Original) */}
          <motion.div variants={item} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border">
            <div className="flex gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground pt-1">Research Goal</h3>
            </div>
            <div className="ml-11">
              <p className="text-foreground break-words">{writing_plan.overall_goal}</p>
            </div>
          </motion.div>

          {/* Desired Tone (Original) */}
          <motion.div variants={item} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border">
            <div className="flex gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground pt-1">Desired Tone</h3>
            </div>
            <div className="ml-11">
              <p className="text-foreground break-words">{writing_plan.desired_tone}</p>
            </div>
          </motion.div>
          
          {/* Search Queries */}
          <motion.div variants={item} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border">
            <div className="flex gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground pt-1">Search Queries</h3>
            </div>
            <div className="ml-11 space-y-3">
              {search_queries.map((query: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {index + 1}
                  </div>
                  <div className="bg-muted/60 dark:bg-black/30 p-3 rounded-lg border border-border flex-grow">
                    <p className="text-foreground break-words">{query}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Report Sections */}
          <motion.div variants={item} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border">
            <div className="flex gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <List className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground pt-1">Report Sections</h3>
            </div>
            <div className="ml-11 space-y-4">
              {writing_plan.sections.map((section: WritingPlanSection, index: number) => (
                <motion.div
                  key={index}
                  className="bg-muted/60 dark:bg-black/30 p-4 rounded-lg border border-border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <h4 className="font-medium text-primary mb-2">{section.title}</h4>
                  <p className="text-foreground text-sm break-words">{section.guidance}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Directives (Original) */}
          {writing_plan.additional_directives && writing_plan.additional_directives.length > 0 && (
            <motion.div variants={item} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border">
              <div className="flex gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground pt-1">Additional Directives</h3>
              </div>
              <div className="ml-11 space-y-4">
                {writing_plan.additional_directives.map((directive: string, index: number) => (
                  <div key={index} className="bg-muted/60 dark:bg-black/30 p-4 rounded-lg border border-border">
                    <p className="text-foreground text-sm break-words">{directive}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}

