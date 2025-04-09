"use client"

import { motion } from "framer-motion"
import { Layers, Share2, BookOpen, ArrowRight, Wrench, Brain } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ArchitectureSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Built on a Solid, Modular Foundation</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Understand the core components that make ODR-API powerful and easy to extend.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Visual Diagram Area - Increased bottom padding */}
          <motion.div 
            className="w-full lg:w-1/2 p-4 pt-0 lg:sticky lg:top-24" // Sticky for larger screens
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative p-6 pb-16 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-center mb-8 text-gray-700 dark:text-gray-300">Core Architecture Flow</h3>
              
              {/* Layer 1: Agencies */}
              <div className="flex gap-6 mb-2 justify-center">
                {/* Agency Boxes */}
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm w-40">
                  <Layers className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">Deep Research</span>
                  <div className="text-xs text-blue-500 dark:text-blue-400/80">Agency</div>
                </div>
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 shadow-sm w-40">
                  <Layers className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200 text-sm">Financial Analyzer</span>
                  <div className="text-xs text-green-500 dark:text-green-400/80">Agency</div>
                </div>
              </div>
              
              {/* Arrow 1 + Label */}
              <div className="relative flex justify-center my-3 h-8">
                <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500 rotate-90" />
                <span className="absolute top-full -mt-1 text-xs text-gray-500 dark:text-gray-400 italic">orchestrates</span>
              </div>
              
              {/* Layer 2: Agents */}
              <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                 {/* Agent Boxes */}
                 <div className="text-center p-2 bg-white dark:bg-gray-700 rounded shadow-sm flex items-center justify-center gap-1">
                   <Brain className="h-3 w-3 text-gray-500"/>
                   <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">Planner</span>
                 </div>
                 <div className="text-center p-2 bg-white dark:bg-gray-700 rounded shadow-sm flex items-center justify-center gap-1">
                   <Brain className="h-3 w-3 text-gray-500"/>
                   <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">Writer</span>
                 </div>
                 <div className="text-center p-2 bg-white dark:bg-gray-700 rounded shadow-sm flex items-center justify-center gap-1">
                   <Brain className="h-3 w-3 text-gray-500"/>
                   <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">Refiner</span>
                 </div>
                 <div className="col-span-3 text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Agents</div>
              </div>

              {/* Arrows 2 & 3 + Labels */}
              <div className="relative flex justify-between items-start h-12 mb-1 px-10">
                 {/* Arrow down to Services */}
                 <div className="flex flex-col items-center">
                   <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500 rotate-90" />
                   <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">leverages</span>
                 </div>
                 {/* Arrow down to Tools */}
                  <div className="flex flex-col items-center">
                   <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500 rotate-90" />
                   <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">invoke</span>
                 </div>
              </div>
              
              {/* Layer 3: Services & Tools (Side-by-side) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Services Box */}
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-1.5 bg-white dark:bg-indigo-900/80 rounded shadow-sm">
                      <span className="font-medium text-indigo-700 dark:text-indigo-200 text-[11px]">Search</span>
                    </div>
                     <div className="text-center p-1.5 bg-white dark:bg-indigo-900/80 rounded shadow-sm">
                      <span className="font-medium text-indigo-700 dark:text-indigo-200 text-[11px]">Scraper</span>
                    </div>
                     <div className="text-center p-1.5 bg-white dark:bg-indigo-900/80 rounded shadow-sm">
                      <span className="font-medium text-indigo-700 dark:text-indigo-200 text-[11px]">Chunking</span>
                    </div>
                     <div className="text-center p-1.5 bg-white dark:bg-indigo-900/80 rounded shadow-sm">
                      <span className="font-medium text-indigo-700 dark:text-indigo-200 text-[11px]">Ranking</span>
                    </div>
                  </div>
                   <div className="text-center text-xs text-indigo-500 dark:text-indigo-300/80 mt-2">Shared Services</div>
                </div>
                
                {/* Tools Box */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700 flex flex-col justify-center">
                   <div className="text-center p-1.5 bg-white dark:bg-purple-900/80 rounded shadow-sm mb-2">
                     <span className="font-medium text-purple-700 dark:text-purple-200 text-[11px]">Example Tool</span>
                   </div>
                   <div className="text-center text-xs text-purple-500 dark:text-purple-300/80 mt-1">LLM Tools</div>
                    <p className="text-[10px] text-center text-purple-400 dark:text-purple-500 italic mt-1">(e.g., Calculator, API Call)</p>
                </div>
              </div>

              {/* Glue: Pydantic Schemas */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 px-3 py-1 rounded-full shadow-md">
                <BookOpen className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Pydantic Schemas</span>
              </div>
            </div>
          </motion.div>

          {/* Explanations Area */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Tabs defaultValue="agencies" className="w-full">
              {/* Updated Tabs List with Tools */}
              <TabsList className="grid w-full grid-cols-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-1 mb-6">
                <TabsTrigger value="agencies" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-md py-2 text-sm font-medium">Agencies</TabsTrigger>
                <TabsTrigger value="agents" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-md py-2 text-sm font-medium">Agents</TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-md py-2 text-sm font-medium">Services</TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-md py-2 text-sm font-medium">Tools</TabsTrigger>
                {/* <TabsTrigger value="schemas" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-md py-2 text-sm font-medium">Schemas</TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="agencies">
                <Card className="bg-white dark:bg-gray-800/80 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
                      Agencies: Domain Specialization
                    </CardTitle>
                    <CardDescription>Self-contained units orchestrating research tasks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Each Agency (`app/agencies/...`) defines a specific research capability (e.g., deep research, financial analysis). It bundles its own orchestration logic (`orchestrator.py`), specialized LLM agents (`agents.py`), and data structures (`schemas.py`).</p>
                    <p>This modular approach allows focused development and easy addition of new research domains without impacting others.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Added Agents Tab Content */}
              <TabsContent value="agents">
                <Card className="bg-white dark:bg-gray-800/80 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
                      Agents: Specialized LLM Workers
                    </CardTitle>
                    <CardDescription>AI models performing specific sub-tasks within an Agency.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Agents (`agents.py`) are typically LLM-powered components with defined roles (e.g., Planner, Writer, Refiner). They execute specific parts of the agency's workflow.</p>
                    <p>They interact with Services programmatically and can be equipped with Tools (like function calling) for dynamic actions based on the context.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="bg-white dark:bg-gray-800/80 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
                      Services: Reusable Capabilities
                    </CardTitle>
                    <CardDescription>Shared components invoked programmatically by Agencies/Agents.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Services (`app/services/`) provide core, often non-LLM, functionalities like web search (Serper), content scraping (Crawl4AI), PDF processing, text chunking, and result ranking (Together AI).</p>
                    <p>Designed for code reuse, they are called directly within the orchestration logic or by helper functions, simplifying complex operations.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Added Tools Tab Content */}
              <TabsContent value="tools">
                <Card className="bg-white dark:bg-gray-800/80 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
                      Tools: LLM-Invokable Functions
                    </CardTitle>
                    <CardDescription>Functions specifically designed for LLM agents to call.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Tools (`app/tools/`) are functions exposed to LLM agents, via pydantic-ai's Tool Calling.</p>
                    <p>They allow agents to perform specific actions dynamically based on their reasoning, such as running calculations, accessing specific databases, or calling external APIs.</p>
                     {/* <p className="italic text-xs">Note: Tool implementation is planned for future agencies.</p> */}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Commented out Schemas tab for now to fit 4 tabs cleanly */}
              {/* <TabsContent value="schemas">
                <Card className="bg-white dark:bg-gray-800/80 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
                      Schemas: Reliable Data Contracts
                    </CardTitle>
                    <CardDescription>Pydantic models ensuring data consistency and validation.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Pydantic schemas (`app/core/schemas.py`, agency-specific schemas) act as the glue, defining the expected structure for data passed between agents, services, and the API.</p>
                    <p>This ensures reliable communication, enables automatic validation, and makes LLM interactions more robust by defining the required output format.</p>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>
             {/* Added Schemas explanation below tabs */}
             <motion.div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="flex items-center gap-2 text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  <BookOpen className="h-5 w-5" />
                  Pydantic Schemas: The Data Glue
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300/90">
                  Pydantic models define the data contracts between all components (Agencies, Agents, Services, Tools, API), ensuring reliable, validated communication and structured LLM interactions.
                </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 