"use client"

import { motion } from "framer-motion"
import { Users, Target, Zap, Construction } from "lucide-react"
import Image from "next/image"

export function ValuePropositionSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Stop Reinventing the Wheel for AI Research</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Building robust AI research systems is complex. ODR-API provides the structured, reusable foundation you need to focus on innovation, not infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Problem Card */}
          <motion.div 
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 mr-4">
                <Construction className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The Challenge</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Building sophisticated research agents often means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>Duplicated effort for common tasks (search, scraping).</li>
              <li>Complex agent coordination and data flow.</li>
              <li>Difficulty adapting to new domains or tools.</li>
              <li>Scalability and maintainability issues.</li>
            </ul>
          </motion.div>

          {/* Arrow or Visual Divider */}
          <div className="hidden md:flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Zap className="h-16 w-16 text-blue-500 dark:text-blue-400 opacity-80" />
            </motion.div>
          </div>

          {/* Solution Card */}
          <motion.div 
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mr-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The ODR-API Solution</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our framework provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>Modular `Agencies` for domain specialization.</li>
              <li>Reusable `Services` for core functionalities.</li>
              <li>Clear `Agent` orchestration patterns.</li>
              <li>Reliable data flow with `Pydantic`.</li>
            </ul>
          </motion.div>
        </div>
        
        {/* Optional: Image illustrating the transformation */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Placeholder for an image or diagram */}
        </motion.div>

      </div>
    </section>
  )
} 