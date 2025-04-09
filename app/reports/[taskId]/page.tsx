"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getResearchReportById } from "@/lib/research-service" // Use getResearchReportById
import type { TaskResultResponse, SourceContextItem, UsageStatistics, ResearchPlan } from "@/types/research" // Import necessary types
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import {
  FileText,
  Calendar,
  ArrowLeft,
  Download,
  Copy,
  Activity,
  Lightbulb,
  Search,
  Clock,
  Check,
  Loader2,
  Info,
  X,
  Link as LinkIcon, // Added LinkIcon for sources
  BarChart3,      // Added BarChart3 for stats
  Sigma,          // Added Sigma for tokens
  DollarSign,     // Added DollarSign for cost
  ExternalLink,   // Re-add ExternalLink for source links
  FileQuestion,   // Added FileQuestion for query
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown" // Use react-markdown
import remarkGfm from "remark-gfm"       // Use remark-gfm
import remarkBreaks from "remark-breaks" // Import remark-breaks
import { ResearchPlanDisplay } from "@/components/research-plan"

// Helper to format numbers with commas
const formatNumber = (num: number | undefined): string => {
  return num !== undefined ? num.toLocaleString() : 'N/A';
};

// Helper to format currency
const formatCurrency = (num: number | undefined): string => {
  return num !== undefined ? `$${num.toFixed(3)}` : 'N/A';
};

// Add animation variants definition if not already present globally
const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ReportDetailPage() {
  const { taskId } = useParams() as { taskId: string } // Get taskId from params
  const [reportData, setReportData] = useState<TaskResultResponse | null>(null) // Use TaskResultResponse type
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("report")
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await getResearchReportById(taskId) // Fetch by ID
        if (data && data.status === 'COMPLETED') {
          setReportData(data)
        } else if (data) {
          // Handle cases where task exists but isn't COMPLETE
          console.warn(`Task ${taskId} found but status is ${data.status}`);
          // Keep existing toast, maybe enhance later based on status
          toast({ title: `Task Status: ${data.status}`, description: `This research task is currently ${data.status}. Detailed report is available upon completion.`, variant: "default" });
          // Set minimal data if needed for display, or null to show 'not found/incomplete'
          setReportData(data) // Keep data to potentially show query/status
        } else {
          // Handle case where task is not found
          setReportData(null);
          toast({ title: "Task Not Found", description: `No research task found with the ID: ${taskId}.`, variant: "destructive" });
        }
      } catch (error) {
        console.error("Error fetching report:", error)
        setReportData(null); // Clear data on error
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      fetchReport()
    }
  }, [taskId, toast]) // Add toast to dependencies

  const handleCopy = async () => {
    if (!reportData?.report) return

    try {
      await navigator.clipboard.writeText(reportData.report)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The research report has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the report to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!reportData?.report) return

    const blob = new Blob([reportData.report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${taskId}.md` // Use taskId for filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report downloaded",
      description: "The research report has been downloaded as a Markdown file.",
    })
  }

  // Extract title from report content (keep this utility)
  const extractTitle = (reportContent: string | undefined) => {
    if (!reportContent) return "Research Report";
    const lines = reportContent.split("\n")
    for (const line of lines) {
      if (line.startsWith("# ")) {
        return line.substring(2)
      }
    }
    return "Untitled Research Report"
  }

  // Parse the date string safely
  const completedDate = reportData?.updatedAt ? new Date(reportData.updatedAt) : null;
  const isValidDate = completedDate && !isNaN(completedDate.getTime());

  // Enhanced check for displaying the report content area
  // Show specific message if task exists but isn't 'COMPLETED'
  if (!reportData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px] text-center">
        <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
        <p className="text-muted-foreground mb-6">The report associated with ID <code className="bg-muted px-1 py-0.5 rounded">{taskId}</code> could not be found.</p>
        <Button asChild variant="outline">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
      </div>
    )
  }

  // Handle non-completed states where reportData exists but isn't COMPLETED
  if (reportData.status !== 'COMPLETED') {
     return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px] text-center">
         {reportData.status === 'ERROR' ? <X className="h-12 w-12 mx-auto mb-4 text-destructive" /> : <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />}
        <h2 className="text-2xl font-bold mb-4">Task Status: {reportData.status}</h2>
        <p className="text-muted-foreground mb-2">The research task for query:</p>
        <p className="text-lg font-medium mb-6 bg-muted/50 p-3 rounded border max-w-2xl mx-auto">"{reportData.query}"</p>
        {reportData.status === 'ERROR' && reportData.error && (
           <p className="text-destructive mb-4">Error details: {reportData.error}</p>
        )}
         {reportData.status === 'CANCELLED' && reportData.stoppedReason && (
           <p className="text-muted-foreground mb-4">Reason: {reportData.stoppedReason}</p>
        )}
        <p className="text-muted-foreground mb-6">The full report will be available once the task is successfully completed.</p>
        <Button asChild variant="outline">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
      </div>
    )
  }

  // --- Render full report page only if status is COMPLETED ---

  return (
    <div className="container mx-auto px-4 pt-16 pb-12 max-w-[1600px]">
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" asChild>
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          Completed on {isValidDate ? formatDate(completedDate) : 'N/A'} {/* Use parsed updatedAt */}
        </div>
      </div>

      <motion.h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] dark:from-gray-100 dark:to-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {extractTitle(reportData?.report)}
      </motion.h1>

      <motion.div
        className="mb-8 p-4 bg-muted/30 rounded-lg border border-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><FileQuestion className="h-4 w-4 mr-1.5"/> ORIGINAL QUERY</h3>
        <p className="text-lg font-medium">{reportData.query}</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Update Tabs: Report, Sources, Stats, Plan */}
        <TabsList className="grid grid-cols-4 mb-6 bg-muted p-1"> {/* Adjust grid-cols */}
          <TabsTrigger
            value="report"
            className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
          >
            <FileText className="h-4 w-4 mr-2" />
            Report
          </TabsTrigger>
          <TabsTrigger
            value="sources"
            className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Sources
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger
            value="plan"
            className="data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Plan
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Report Tab */}
          <TabsContent value="report" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-lg font-semibold">Final Report</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      a: ({node, ...props}) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                      table: ({node, ...props}) => <table {...props} className="min-w-full border border-border my-4" />,
                      thead: ({node, ...props}) => <thead {...props} className="bg-muted" />,
                      th: ({node, ...props}) => <th {...props} className="border border-border p-2 text-left" />,
                      td: ({node, ...props}) => <td {...props} className="border border-border p-2" />,
                      h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                      h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                      h3: ({node, ...props}) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                      p: ({node, ...props}) => <p {...props} className="mb-4" />
                    }}
                  >
                    {reportData?.report || "No report content available."}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="mt-0">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold text-card-foreground">Sources Consulted</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {reportData?.sources && reportData.sources.length > 0 ? (
                      reportData.sources.map((source, index) => (
                        <motion.div
                          key={`${source.rank || source.ref_num}-${source.link || 'no-link'}-${index}`} // Use rank or ref_num as fallback
                          className="bg-background/50 dark:bg-black/20 p-4 rounded-lg border border-border/50 shadow-sm block transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.01]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <a 
                            href={source.link || '#'} // Add fallback href just in case
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                            aria-label={`Visit source: ${source.title || 'Untitled Source'}`}
                          >
                            <div className="flex flex-col">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-primary text-base w-full break-words mr-2">
                                  <span className="text-muted-foreground mr-1">{source.rank || source.ref_num || index + 1}.</span>
                                  {source.title || 'Untitled Source'}
                                </h4>
                                {source.link && (
                                  <div className="mt-1 text-xs text-muted-foreground/70 flex items-center flex-shrink-0">
                                     <ExternalLink className="h-3 w-3 mr-1 opacity-80"/> 
                                     {new URL(source.link).hostname} 
                                  </div>
                                )}
                              </div>
                              {(source.type || source.score !== undefined) && (
                                <div className="text-xs text-muted-foreground mb-2 flex items-center justify-start gap-2 w-full">
                                  {source.type && <Badge variant="outline" className="capitalize py-0 px-1.5 text-xs">{source.type}</Badge>}
                                  {source.score !== undefined && <span className="text-xs">(Score: {source.score.toFixed(2)})</span>}
                                </div>
                              )}
                            </div>
                          </a>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No source details available.</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-0">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold text-card-foreground">Usage Statistics</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {reportData?.usageStatistics ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 text-sm" // Increased gap-y
                    variants={{ 
                      hidden: { opacity: 0 }, 
                      show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {/* General Stats */}
                    <motion.div variants={itemAnimation} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-3">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2 flex items-center"><Activity className="inline h-4 w-4 mr-2 text-primary/80"/>General</h3>
                      <p className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><Search className="inline h-3.5 w-3.5 mr-1.5 opacity-70"/> Serper Queries Used:</span> <span>{formatNumber(reportData.usageStatistics.serper_queries_used)}</span></p>
                      <p className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><FileText className="inline h-3.5 w-3.5 mr-1.5 opacity-70"/> Sources Processed:</span> <span>{formatNumber(reportData.usageStatistics.sources_processed_count)}</span></p>
                      <p className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><RefreshCw className="inline h-3.5 w-3.5 mr-1.5 opacity-70"/> Refinement Iterations:</span> <span>{formatNumber(reportData.usageStatistics.refinement_iterations_run)}</span></p>
                    </motion.div>

                    {/* Cost Estimation */}
                    <motion.div variants={itemAnimation} className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-3">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2 flex items-center"><DollarSign className="inline h-4 w-4 mr-2 text-primary/80"/>Estimated Cost</h3>
                      {/* Highlight Total Cost */} 
                      <p className="flex justify-between items-center text-base bg-primary/5 dark:bg-primary/10 p-2 rounded">
                        <span className="font-semibold text-primary/90 flex items-center"><DollarSign className="inline h-4 w-4 mr-1.5"/> Total:</span> 
                        <span className="font-bold text-lg text-primary">{formatCurrency(Object.values(reportData.usageStatistics.estimated_cost || {}).reduce((sum, cost) => sum + cost, 0))}</span>
                      </p>
                      {/* Dynamically display costs per agent/step - slightly indented/muted */} 
                      <div className="pl-3 border-l-2 border-primary/10 space-y-2 mt-3 pt-3">
                        {reportData.usageStatistics.estimated_cost && Object.entries(reportData.usageStatistics.estimated_cost).length > 1 ? (Object.entries(reportData.usageStatistics.estimated_cost).map(([key, value]) => (
                          key !== 'total' && value !== undefined && value > 0 && ( 
                            <p key={key} className="flex justify-between text-xs capitalize"><span className="text-muted-foreground">{key.replace(/_/g, ' ')}:</span> <span>{formatCurrency(value)}</span></p>
                          )
                        ))) : (<p className="text-xs text-muted-foreground italic">No detailed cost breakdown available.</p>)}
                      </div>
                    </motion.div>

                    {/* Token Usage */} 
                    <motion.div variants={itemAnimation} className="md:col-span-2 bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-4">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2 flex items-center"><Sigma className="inline h-4 w-4 mr-2 text-primary/80"/>Token Usage</h3>
                      {/* Highlight Total Tokens */} 
                      <p className="flex justify-between items-center text-base bg-primary/5 dark:bg-primary/10 p-2 rounded">
                        <span className="font-semibold text-primary/90 flex items-center"><Sigma className="inline h-4 w-4 mr-1.5"/> Total Tokens:</span> 
                        <span className="font-bold text-lg text-primary">{formatNumber(Object.values(reportData.usageStatistics.token_usage || {}).reduce((sum, usage) => sum + (usage?.total_tokens || 0), 0))}</span>
                      </p>
                      {/* Total Prompt/Completion */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="p-2 rounded bg-muted/30 border border-border/30 text-center">
                          <p className="text-xs uppercase text-muted-foreground mb-1">Total Prompt</p>
                          <p className="font-medium">{formatNumber(Object.values(reportData.usageStatistics.token_usage || {}).reduce((sum, usage) => sum + (usage?.prompt_tokens || 0), 0))}</p>
                        </div>
                        <div className="p-2 rounded bg-muted/30 border border-border/30 text-center">
                          <p className="text-xs uppercase text-muted-foreground mb-1">Total Completion</p>
                          <p className="font-medium">{formatNumber(Object.values(reportData.usageStatistics.token_usage || {}).reduce((sum, usage) => sum + (usage?.completion_tokens || 0), 0))}</p>
                        </div>
                      </div>
                      
                      {/* Token Breakdown by Step - Enhanced */} 
                      <div className="mt-5">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/30">Breakdown by Step</h4>
                        
                        {reportData.usageStatistics.token_usage && Object.entries(reportData.usageStatistics.token_usage).length > 1 ? (
                          <div className="space-y-3 mt-4">
                            {Object.entries(reportData.usageStatistics.token_usage)
                              .filter(([key, value]) => key !== 'total' && value?.total_tokens > 0)
                              .sort((a, b) => (b[1]?.total_tokens || 0) - (a[1]?.total_tokens || 0)) // Sort by total tokens descending
                              .map(([key, value]) => {
                                // Calculate percentages for the bar visualization
                                const promptPercentage = value.total_tokens ? (value.prompt_tokens / value.total_tokens) * 100 : 0;
                                const completionPercentage = 100 - promptPercentage;
                                
                                return (
                                  <div key={key} className="rounded-md p-3 bg-background/50 dark:bg-black/20 hover:bg-background/80 dark:hover:bg-black/30 transition-colors border border-border/40">
                                    <div className="flex justify-between items-center mb-1.5">
                                      <span className="font-medium capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                                      <span className="font-medium text-sm">{formatNumber(value.total_tokens)}</span>
                                    </div>
                                    
                                    {/* Visualization Bar */}
                                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                                      <div 
                                        className="h-full bg-blue-400/60 dark:bg-blue-500/30" 
                                        style={{ width: `${promptPercentage}%` }}
                                        title={`Prompt: ${formatNumber(value.prompt_tokens)} tokens (${promptPercentage.toFixed(1)}%)`}
                                      />
                                      <div 
                                        className="h-full bg-green-400/60 dark:bg-green-500/30" 
                                        style={{ width: `${completionPercentage}%` }}
                                        title={`Completion: ${formatNumber(value.completion_tokens)} tokens (${completionPercentage.toFixed(1)}%)`}
                                      />
                                    </div>
                                    
                                    {/* Legend & Counts */}
                                    <div className="flex justify-between mt-1.5 text-xs">
                                      <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-400/60 dark:bg-blue-500/30 mr-1.5"></span>
                                        <span className="text-muted-foreground">P: {formatNumber(value.prompt_tokens)}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-400/60 dark:bg-green-500/30 mr-1.5"></span>
                                        <span className="text-muted-foreground">C: {formatNumber(value.completion_tokens)}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic mt-4 text-center py-3 bg-muted/20 rounded-md">No detailed token breakdown available.</p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No usage statistics available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Tab (Conditional) */}
          <TabsContent value="plan" className="mt-0">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
              <CardContent className="p-6">
                {/* TODO: If reusing ResearchPlanDisplay, pass the plan prop: <ResearchPlanDisplay plan={reportData.plan} /> */}
                {/* For now, showing basic message if plan exists */} 
                {reportData.plan ? ( // Check for plan (using TaskResultResponse type)
                  <div>
                    <div className="flex items-center mb-6">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-xl font-bold text-card-foreground">Original Research Plan</h2>
                    </div>
                    {/* Pass plan to the display component */}
                    <ResearchPlanDisplay plan={reportData.plan} /> {/* Pass plan prop */}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Research plan data not found for this task.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </motion.div>
      </Tabs>
    </div>
  )
} 