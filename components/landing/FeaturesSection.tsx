"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, Share2, BrainCircuit, Database, Puzzle, Network } from "lucide-react"

const coreFeatures = [
  {
    icon: <LayoutGrid className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Modular Agency Design",
    description: "Create specialized research domains as independent 'Agencies', each orchestrating their own workflow and agents for specific tasks (e.g., finance, legal, deep web)."
  },
  {
    icon: <Share2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Reusable Core Services",
    description: "Leverage a shared library of powerful components for search, advanced scraping (Crawl4AI), chunking, PDF handling, ranking, and more across any agency."
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Multi-Agent Orchestration",
    description: "Coordinate multiple specialized LLM agents (like Planner, Writer, Refiner) within each agency using customizable workflow logic for complex research processes."
  },
  {
    icon: <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Structured Data Flow",
    description: "Ensure reliable data transfer and validation between agents and services using Pydantic V2 schemas, enabling robust and predictable interactions."
  },
  {
    icon: <Puzzle className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Extensible Architecture",
    description: "Built for growth. Easily add new agencies, integrate custom LLM tools, swap out services, or configure LLM providers and parameters via environment or API."
  },
  {
    icon: <Network className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Real-time Progress Streaming",
    description: "Monitor the research process live with detailed step-by-step updates streamed via WebSockets, providing transparency into the agent's execution."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features Out-of-the-Box</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ODR-API provides a comprehensive toolkit for building sophisticated AI research applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/70 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700/80 rounded-xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-1">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white leading-snug">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 