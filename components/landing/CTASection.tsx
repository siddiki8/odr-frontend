"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Rocket, FileText } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your AI Research System?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto mb-10">
            Experience the power and flexibility of ODR-API. Try the interactive demo or dive straight into the source code.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-white hover:bg-gray-100 text-blue-600 border-2 border-transparent shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 rounded-xl text-lg font-semibold">
              <Link href="/deep_research">
                <Rocket className="mr-2 h-5 w-5" /> Try Demo App
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-lg transition-all duration-300 px-8 py-6 rounded-xl text-lg font-semibold">
              <a href="https://github.com/siddiki8/ODR-api" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" /> View on GitHub
              </a>
            </Button>
          </div>
          
          {/* Optional Link to Contribution Guide */}
          <div className="mt-12">
            <Link href="https://github.com/siddiki8/ODR-api/blob/main/README.md#contributing" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white underline flex items-center justify-center gap-1.5 group">
              <FileText className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[-2px]" />
              <span className="transition-transform duration-300 group-hover:translate-x-[2px]">Learn how to contribute</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 