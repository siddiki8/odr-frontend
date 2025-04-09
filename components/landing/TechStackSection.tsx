"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Bot, Cloud, Link, Search } from "lucide-react"

const tech = {
  backend: [
    { name: "FastAPI", icon: <Code className="h-4 w-4" /> },
    { name: "Python 3.10+", icon: <Code className="h-4 w-4" /> },
    { name: "Pydantic V2", icon: <Database className="h-4 w-4" /> },
    { name: "Pydantic-AI", icon: <Bot className="h-4 w-4" /> },
  ],
  ai_services: [
    { name: "Crawl4AI", icon: <Bot className="h-4 w-4" /> },
    { name: "Serper API", icon: <Search className="h-4 w-4" /> },
    { name: "Together AI", icon: <Bot className="h-4 w-4" /> },
    { name: "OpenRouter", icon: <Bot className="h-4 w-4" /> }, // Placeholder
    // Add OpenAI, Anthropic etc. if directly used or configurable
  ],
  // Add frontend if relevant (Next.js, Tailwind, Shadcn)
}

export function TechStackSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Built with a Modern, Robust Stack</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Leveraging powerful libraries and services for optimal performance and developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Backend Tech */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center md:text-left text-gray-800 dark:text-gray-200">Backend Framework</h3>
            <div className="grid grid-cols-2 gap-4">
              {tech.backend.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-300">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI & Services Tech */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center md:text-left text-gray-800 dark:text-gray-200">AI & Core Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {tech.ai_services.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md text-green-600 dark:text-green-300">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Optional: Mention Frontend if displaying this on the Next.js site */}
         <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Frontend Demo</h3>
             <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1 shadow-sm bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                  Next.js
                </Badge>
                 <Badge variant="secondary" className="text-sm px-3 py-1 shadow-sm bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                  TailwindCSS
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1 shadow-sm bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                  Shadcn/ui
                </Badge>
                 <Badge variant="secondary" className="text-sm px-3 py-1 shadow-sm bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                  Framer Motion
                </Badge>
             </div>
         </motion.div>

      </div>
    </section>
  )
} 