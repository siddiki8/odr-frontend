"use client"

import { useResearch } from "@/hooks/use-research"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy, FileText } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

export function ResearchReport() {
  const { report } = useResearch()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCopy = async () => {
    if (!report) return

    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The research report has been copied to your clipboard.",
        className: "bg-popover border-border",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the report to clipboard.",
        variant: "destructive",
        className: "bg-destructive border-destructive-foreground",
      })
    }
  }

  const handleDownload = () => {
    if (!report) return

    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "research-report.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report downloaded",
      description: "The research report has been downloaded as a Markdown file.",
      className: "bg-popover border-border",
    })
  }

  if (!report) {
    return null
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]"></div>
      <CardContent className="p-6">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-bold text-card-foreground">Final Research Report</h2>
          </div>

          <div className="flex space-x-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/60 border-border text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/60 border-border text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </motion.div>

        <ScrollArea className="h-[600px] pr-4">
          <motion.div
            className="bg-background/80 rounded-lg p-8 border border-border shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
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
                {report || ""} 
              </ReactMarkdown>
            </div>
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

