"use client"

import { motion } from "framer-motion"
import { Search, FileText, Cpu, DatabaseZap, Combine, CheckCircle2 } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "1. Define & Plan",
    description: "Provide a research query. The Planner agent generates a structured plan, including search queries and an outline.",
    details: ["Input: User Query", "Output: WritingPlan, SearchTasks"]
  },
  {
    icon: <DatabaseZap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "2. Gather & Process",
    description: "The system executes searches, scrapes web content (Crawl4AI), handles PDFs, chunks text, and ranks information for relevance (Together AI).",
    details: ["Services: Search, Scraper, Chunking, Ranking"]
  },
  {
    icon: <Combine className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "3. Synthesize & Write",
    description: "The Writer agent drafts the report using the processed context, structuring it according to the plan and citing sources.",
    details: ["Input: Processed Content, Plan", "Output: Draft Report"]
  },
  {
    icon: <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "4. Refine & Iterate",
    description: "The Refiner agent iteratively enhances the draft, incorporating only new information from further searches if needed, ensuring comprehensive coverage.",
    details: ["Loop: Search -> Process -> Refine", "Output: Refined Report"]
  },
  {
    icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "5. Finalize & Deliver",
    description: "The system assembles the final report, formats citations, adds references, and delivers it via WebSocket stream.",
    details: ["Output: Final Report, Usage Stats"]
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">How the Deep Research Agency Works</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See the orchestrated flow of agents and services in action within the example `deep_research` agency.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-300 dark:via-blue-700 to-transparent -ml-[0.5px] hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="md:flex items-center relative"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, delay: 0.1 }
                  }
                }}
              >
                {/* Icon and Line Connector */}
                <div className={`flex-shrink-0 w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:order-last'} mb-6 md:mb-0`}>
                  <div className={`md:relative flex justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-300 dark:via-blue-700 to-transparent -ml-[0.5px] md:hidden"></div>
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-700 mx-auto md:mx-0">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/70 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/80">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{step.description}</p>
                    <div className="text-xs space-y-1 text-gray-500 dark:text-gray-500">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 