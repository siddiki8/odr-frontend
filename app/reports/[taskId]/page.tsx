"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getResearchReportById } from "@/lib/research-service" // Use getResearchReportById
import type { TaskResultResponse, SourceContextItem, UsageStatistics } from "@/types/research" // Use TaskResultResponse
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
  FileQuestion    // Added FileQuestion for query
} from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown" // Use react-markdown
import remarkGfm from "remark-gfm"       // Use remark-gfm
import remarkBreaks from "remark-breaks" // Import remark-breaks
import { ResearchPlan } from "@/components/research-plan" // Reuse plan component if structure matches
import { ResearchStats } from "@/components/research-stats" // Reuse stats component? Or create new

// Helper to format numbers with commas
const formatNumber = (num: number | undefined): string => {
  return num !== undefined ? num.toLocaleString() : 'N/A';
};

// Helper to format currency
const formatCurrency = (num: number | undefined): string => {
  return num !== undefined ? `$${num.toFixed(3)}` : 'N/A';
};

export default function ReportDetailPage() {
  const { taskId } = useParams() as { taskId: string } // Get taskId from params
  const [reportData, setReportData] = useState<TaskResultResponse | null>(null) // Use TaskResultResponse
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
        if (data && data.status === 'COMPLETE') {
          setReportData(data)
        } else if (data) {
          // Handle cases where task exists but isn't COMPLETE (e.g., redirect or show message)
          console.warn(`Task ${taskId} found but status is ${data.status}`);
          toast({ title: "Task Not Complete", description: `This research task is currently ${data.status}.`, variant: "default" });
          // Optionally redirect back to reports list
          // router.push("/reports"); 
          setReportData(null); // Ensure no partial data is shown
        } else {
          // Handle case where task is not found
          setReportData(null);
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
    if (!reportData?.result?.finalReport) return

    try {
      await navigator.clipboard.writeText(reportData.result.finalReport)
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
    if (!reportData?.result?.finalReport) return

    const blob = new Blob([reportData.result.finalReport], { type: "text/markdown" })
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

  // --- Remove the custom renderMarkdown function --- 
  if (loading) {
    // ... (keep loading skeleton) ...
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px]">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    )
  }

  if (!reportData) {
    // ... (keep report not found message) ...
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1600px] text-center">
        <h2 className="text-2xl font-bold mb-4">Report Not Found or Incomplete</h2>
        <p className="text-muted-foreground mb-6">The report associated with this ID might not exist, hasn't completed, or encountered an error.</p>
        <Button asChild>
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1600px]">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          Completed on {formatDate(new Date(reportData.updatedAt))} {/* Use updatedAt for completion */}
        </div>
      </div>

      <motion.h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] dark:from-gray-100 dark:to-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {extractTitle(reportData.result?.finalReport)}
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
        {/* Update Tabs: Report, Sources, Stats, Plan (Optional) */}
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
            disabled={!reportData.plan} // Disable if plan doesn't exist
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
          <TabsContent value="report" className="mt-0">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-xl font-bold text-card-foreground">Research Report</h2>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <Button variant="outline" size="sm" onClick={handleCopy}>{/* ... Copy Button ... */}<Copy className="h-4 w-4 mr-2" />{copied ? "Copied" : "Copy"}</Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>{/* ... Download Button ... */}<Download className="h-4 w-4 mr-2" />Download</Button>
                  </div>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="bg-background/80 rounded-lg p-8 border border-border shadow-md">
                    <div className="markdown">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          // Style links with proper color
                          a: ({node, ...props}) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                          
                          // Style tables to be more visible
                          table: ({node, ...props}) => <table {...props} className="min-w-full border border-border my-4" />,
                          thead: ({node, ...props}) => <thead {...props} className="bg-muted" />,
                          th: ({node, ...props}) => <th {...props} className="border border-border p-2 text-left" />,
                          td: ({node, ...props}) => <td {...props} className="border border-border p-2" />,
                          
                          // Style headers for better visibility
                          h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                          h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                          h3: ({node, ...props}) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                          
                          // Add spacing for paragraphs
                          p: ({node, ...props}) => <p {...props} className="mb-4" />
                        }}
                      >
                        {reportData.result?.finalReport || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                </ScrollArea>
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
                    {reportData.result?.sources && reportData.result.sources.length > 0 ? (
                      reportData.result.sources.map((source, index) => (
                        <motion.div 
                          key={`${index}-${source.link || 'no-link'}`}
                          className="bg-background/50 dark:bg-black/20 p-4 rounded-lg border border-border/50 shadow-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-primary text-base mb-1 mr-4"><span className="text-muted-foreground">{source.rank}.</span> {source.title || 'Untitled Source'}</h4>
                            <a href={source.link} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4 mr-1"/>Visit</Button>
                            </a>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1"><Badge variant="secondary" className="capitalize">{source.type}</Badge> {source.score && <span className="ml-2 text-xs">(Score: {source.score.toFixed(2)})</span>}</div>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{source.content}</p>
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
                {reportData.result?.usageStatistics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {/* General Stats */}
                    <div className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-3">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2">General</h3>
                      <p className="flex justify-between"><span className="text-muted-foreground"><Search className="inline h-4 w-4 mr-1"/> Serper Queries:</span> <span>{formatNumber(reportData.result.usageStatistics.serper_queries_used)}</span></p>
                      <p className="flex justify-between"><span className="text-muted-foreground"><FileText className="inline h-4 w-4 mr-1"/> Sources Processed:</span> <span>{formatNumber(reportData.result.usageStatistics.sources_processed_count)}</span></p>
                      <p className="flex justify-between"><span className="text-muted-foreground"><Activity className="inline h-4 w-4 mr-1"/> Refinement Iterations:</span> <span>{formatNumber(reportData.result.usageStatistics.refinement_iterations_run)}</span></p>
                    </div>

                    {/* Cost Estimation */}
                    <div className="bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-3">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2">Estimated Cost</h3>
                      <p className="flex justify-between"><span className="text-muted-foreground"><DollarSign className="inline h-4 w-4 mr-1"/> Total:</span> <span className="font-semibold text-primary">{formatCurrency(reportData.result.usageStatistics.estimated_cost?.total)}</span></p>
                      {reportData.result.usageStatistics.estimated_cost?.planner !== undefined && <p className="flex justify-between"><span className="text-muted-foreground">Planner:</span> <span>{formatCurrency(reportData.result.usageStatistics.estimated_cost.planner)}</span></p>}
                      {reportData.result.usageStatistics.estimated_cost?.summarizer !== undefined && <p className="flex justify-between"><span className="text-muted-foreground">Summarizer:</span> <span>{formatCurrency(reportData.result.usageStatistics.estimated_cost.summarizer)}</span></p>}
                      {reportData.result.usageStatistics.estimated_cost?.writer !== undefined && <p className="flex justify-between"><span className="text-muted-foreground">Writer:</span> <span>{formatCurrency(reportData.result.usageStatistics.estimated_cost.writer)}</span></p>}
                      {reportData.result.usageStatistics.estimated_cost?.refiner !== undefined && <p className="flex justify-between"><span className="text-muted-foreground">Refiner:</span> <span>{formatCurrency(reportData.result.usageStatistics.estimated_cost.refiner)}</span></p>}
                    </div>

                    {/* Token Usage (Details - potentially long) */}
                    <div className="md:col-span-2 bg-background/30 dark:bg-black/20 rounded-lg p-4 border border-border/50 space-y-3">
                      <h3 className="font-medium text-base mb-3 border-b border-border pb-2">Token Usage</h3>
                      <p className="flex justify-between"><span className="text-muted-foreground"><Sigma className="inline h-4 w-4 mr-1"/> Total Tokens:</span> <span className="font-semibold text-primary">{formatNumber(reportData.result.usageStatistics.token_usage?.total?.total_tokens)}</span></p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-2 pt-2 border-t border-border/30">
                        <p className="flex justify-between"><span className="text-muted-foreground">Total Prompt:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage?.total?.prompt_tokens)}</span></p>
                        <p className="flex justify-between"><span className="text-muted-foreground">Total Completion:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage?.total?.completion_tokens)}</span></p>
                        
                        {reportData.result.usageStatistics.token_usage?.planner && <p className="flex justify-between"><span className="text-muted-foreground">Planner:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage.planner.total_tokens)}</span></p>}
                        {reportData.result.usageStatistics.token_usage?.summarizer && <p className="flex justify-between"><span className="text-muted-foreground">Summarizer:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage.summarizer.total_tokens)}</span></p>}
                        {reportData.result.usageStatistics.token_usage?.writer && <p className="flex justify-between"><span className="text-muted-foreground">Writer:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage.writer.total_tokens)}</span></p>}
                        {reportData.result.usageStatistics.token_usage?.refiner && <p className="flex justify-between"><span className="text-muted-foreground">Refiner:</span> <span>{formatNumber(reportData.result.usageStatistics.token_usage.refiner.total_tokens)}</span></p>}
                      </div>
                    </div>
                  </div>
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
                {/* Reuse ResearchPlan component? Needs modification if structure differs */}
                {/* For now, showing basic message if plan exists */}
                {reportData.plan ? (
                  <div>
                    <div className="flex items-center mb-6">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-xl font-bold text-card-foreground">Original Research Plan</h2>
                    </div>
                    <pre className="text-xs bg-muted/50 p-4 rounded overflow-x-auto">{JSON.stringify(reportData.plan, null, 2)}</pre>
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