"use client"

import { useResearch } from "@/hooks/use-research"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, Clock, Info, AlertTriangle, X, Loader2, MoreHorizontal, Layers3, BotMessageSquare, FileText, Search, ArrowDownUp, DraftingCompass, Sparkles, PackageCheck, ChevronRight, Square } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Define category names
const CATEGORIES = {
  INITIALIZING: "Initializing",
  PLANNING: "Planning",
  SEARCHING: "Searching",
  RANKING: "Ranking",
  BUILDING_CONTEXT: "Building Context",
  WRITING: "Writing",
  REFINING: "Refining",
  FINALIZING: "Finalizing",
  // Special categories / steps
  STARTING: "Starting",
  COMPLETE: "Complete",
  ERROR: "Error",
  CONNECTION: "Connection Status",
  CONTROL: "Control",
  POLLING: "Polling Status", // Add POLLING category
} as const;

type CategoryKey = keyof typeof CATEGORIES;
type CategoryName = typeof CATEGORIES[CategoryKey];

// Map raw steps to category keys
const stepToCategoryKey = (step: string): CategoryKey => {
  switch (step) {
    case "INITIALIZING": return "INITIALIZING";
    case "PLANNING": return "PLANNING";
    case "SEARCHING": return "SEARCHING";
    case "RANKING": return "RANKING";
    case "PROCESSING": return "BUILDING_CONTEXT";
    case "FILTERING": return "BUILDING_CONTEXT";
    case "WRITING": return "WRITING";
    case "REFINING": return "REFINING";
    case "FINALIZING": return "FINALIZING";
    case "STARTING": return "STARTING";
    case "COMPLETE": return "COMPLETE";
    case "ERROR": return "ERROR";
    case "CONNECTION": return "CONNECTION";
    case "CONTROL": return "CONTROL";
    case "POLLING": return "POLLING"; // Map POLLING step
    default: return "ERROR";
  }
};

// Define a type for individual messages within a group (raw update)
interface GroupUpdate {
  status: string;
  message: string;
  details?: Record<string, any> | null;
  isRefinement: boolean; // Flag for refinement messages
  timestamp: number; // Keep timestamp for sorting if needed
}

// Define a type for a Sub-Task within a Category
interface SubTask {
    id: string; // Unique identifier (e.g., source_url or generated)
    displayId: string; // Shorter display identifier (e.g., hostname or step name)
    firstTimestamp: number;
    latestStatus: string;
    latestMessage: string;
    isRefinement: boolean; // Does this sub-task belong to refinement?
    updates: GroupUpdate[]; // Keep raw updates if needed for history within sub-task
}

// Define a type for grouped messages by category
interface CategoryGroup {
  categoryName: CategoryName;
  categoryKey: CategoryKey;
  latestStatus: string; // Overall latest status for the category
  latestMessage: string; // Overall latest message for the category
  firstTimestamp: number; // Timestamp of the first message in this category
  subTasks: SubTask[]; // Contains grouped sub-tasks instead of raw updates
  isErrorState: boolean; // Flag if the category ended in error
}

export function ResearchTimeline() {
  const { messages, isResearching, stopResearch } = useResearch()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showGhost, setShowGhost] = useState(false)
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])

  // Group messages by CATEGORY and then by SUB-TASK
  useEffect(() => {
    const groupedByCategory: Partial<Record<CategoryName, CategoryGroup>> = {}
    const categoryOrder: CategoryName[] = []
    let timestampCounter = Date.now() // Assign unique timestamps for sorting

    messages.forEach((message, messageIndex) => {
      const categoryKey = stepToCategoryKey(message.step)
      // Don't skip POLLING messages anymore
      // if (categoryKey === "CONTROL") return;

      const categoryName = CATEGORIES[categoryKey]
      const isRefinement = message.message.includes("[Refinement") || message.step === "REFINING" // Simple check for now
      const currentTimestamp = timestampCounter++

      const update: GroupUpdate = {
        status: message.status,
        message: message.message,
        details: message.details,
        isRefinement: isRefinement,
        timestamp: currentTimestamp
      }

      // --- Sub-task Identification --- 
      let subTaskId: string;
      let subTaskDisplayId: string;
      // Try using source_url for PROCESSING steps
      if (message.step === "PROCESSING" && message.details?.source_url) {
          subTaskId = message.details.source_url;
          try {
              // Attempt to create a shorter display ID (hostname)
              subTaskDisplayId = new URL(subTaskId).hostname.replace(/^www\./, '');
          } catch { 
              subTaskDisplayId = subTaskId; // Fallback to full URL if parsing fails
          }
      // Treat POLLING as its own subtask for now
      } else if (message.step === "POLLING") {
          subTaskId = `${categoryName}::${message.step}`;
          subTaskDisplayId = "Status Check";
      } else {
          // Fallback: Use category name + message step as a simple subtask identifier within the category
          // This might group START/END of the same category step together
          subTaskId = `${categoryName}::${message.step}`;
          subTaskDisplayId = message.step; // Display the step name
      }
      // --- End Sub-task Identification ---

      let categoryGroup = groupedByCategory[categoryName]

      // Initialize Category Group if it doesn't exist
      if (!categoryGroup) {
        categoryGroup = {
          categoryName,
          categoryKey,
          latestStatus: message.status,
          latestMessage: message.message,
          firstTimestamp: currentTimestamp,
          subTasks: [], // Initialize subTasks array
          isErrorState: message.status === "ERROR" || message.status === "FATAL"
        }
        groupedByCategory[categoryName] = categoryGroup
        categoryOrder.push(categoryName)
      } else {
        // Update category's latest status/message
        categoryGroup.latestStatus = message.status
        categoryGroup.latestMessage = message.message
        if (message.status === "ERROR" || message.status === "FATAL") {
          categoryGroup.isErrorState = true
        }
      }

      // Find or Create SubTask within the Category Group
      let subTask = categoryGroup.subTasks.find(st => st.id === subTaskId)
      if (!subTask) {
          subTask = {
              id: subTaskId,
              displayId: subTaskDisplayId,
              firstTimestamp: currentTimestamp,
              latestStatus: message.status,
              latestMessage: message.message,
              isRefinement: isRefinement, // Mark if subtask relates to refinement
              updates: [update]
          }
          categoryGroup.subTasks.push(subTask)
      } else {
          // Update existing subTask
          subTask.updates.push(update)
          subTask.latestStatus = message.status
          subTask.latestMessage = message.message
          // If any update within the subtask is refinement, mark the whole subtask as refinement
          if (isRefinement) subTask.isRefinement = true
      }
    })

    // Sort subtasks within each category group by their first appearance
    Object.values(groupedByCategory).forEach(group => {
        if (group) { // Check if group exists
            group.subTasks.sort((a, b) => a.firstTimestamp - b.firstTimestamp)
        }
    })

    const groupedArray = categoryOrder.map(catName => groupedByCategory[catName]).filter(Boolean) as CategoryGroup[]

    // Sort groups primarily by first appearance timestamp, keeping STARTING/CONNECTION first and COMPLETE last
    groupedArray.sort((a, b) => {
      // Add POLLING to the top group if present
      if (a.categoryKey === "POLLING") return -1;
      if (b.categoryKey === "POLLING") return 1;
      if (a.categoryKey === "STARTING" || a.categoryKey === "CONNECTION") return -1
      if (b.categoryKey === "STARTING" || b.categoryKey === "CONNECTION") return 1
      if (a.categoryKey === "COMPLETE") return 1
      if (b.categoryKey === "COMPLETE") return -1
      return a.firstTimestamp - b.firstTimestamp
    })

    setCategoryGroups(groupedArray)

  }, [messages])

  // Update refs array when category groups change
  useEffect(() => {
    timelineItemsRef.current = timelineItemsRef.current.slice(0, categoryGroups.length)
  }, [categoryGroups.length])

  // Set active index and handle ghost task visibility
  useEffect(() => {
    if (categoryGroups.length > 0) {
      // Active index is the last non-COMPLETE group, or the last group if only COMPLETE exists
      const lastNonCompleteIndex = categoryGroups.findLastIndex(g => g.categoryKey !== 'COMPLETE')
      setActiveIndex(lastNonCompleteIndex !== -1 ? lastNonCompleteIndex : categoryGroups.length - 1)
      setShowGhost(isResearching)
    } else {
      setActiveIndex(null)
      setShowGhost(false)
    }
  }, [categoryGroups, isResearching])

  // Function to find the actual scrollable element
  const getScrollableElement = () => {
    if (!scrollAreaRef.current) return null

    // The ScrollArea component from shadcn/ui creates a div with data-radix-scroll-area-viewport
    // This is the actual scrollable element we need to target
    const scrollViewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
    return scrollViewport as HTMLElement
  }

  // Improved scrollToActiveItem function that targets the correct scrollable element
  const scrollToActiveItem = () => {
    requestAnimationFrame(() => {
      const scrollElement = getScrollableElement()
      if (!scrollElement || activeIndex === null || !timelineItemsRef.current[activeIndex]) return

      const activeItem = timelineItemsRef.current[activeIndex]
      if (!activeItem) return

      const firstItem = timelineItemsRef.current[0]
      const itemHeight = firstItem ? firstItem.offsetHeight : 100

      const scrollPosition = activeItem.offsetTop - itemHeight - 16

      scrollElement.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: "smooth",
      })
    })
  }

  // Handle auto-scrolling whenever messages change or active index changes
  useEffect(() => {
    if (categoryGroups.length > 0 && activeIndex !== null) {
      const timer = setTimeout(() => {
        // Only scroll if the user hasn't manually scrolled away recently
        // (We'll skip the complex scroll detection for now and just rely on this trigger)
        scrollToActiveItem()
      }, 100) // Short delay for DOM updates
      return () => clearTimeout(timer)
    }
  }, [categoryGroups.length, activeIndex]) // Scroll when active group changes

  // Status icon mapping
  const getStatusIcon = (status: string, isErrorState?: boolean) => {
    if (isErrorState) return <X className="h-4 w-4 text-red-400" />; 
    switch (status) {
      case "ACTIVE": // Used by POLLING
         return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case "START":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "END":
        return <Check className="h-4 w-4 text-green-400" />
      case "SUCCESS":
        return <Check className="h-4 w-4 text-green-400" />
      case "ERROR":
        return <X className="h-4 w-4 text-red-400" />
      case "FATAL":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "INFO":
        return <Info className="h-4 w-4 text-blue-400" />
      case "IN_PROGRESS":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
      case "STOPPED":
        return <Square className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": // Used by POLLING
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700";
      case "START":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
      case "END":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
      case "SUCCESS":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
      case "ERROR":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
      case "FATAL":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700"
      case "INFO":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700"
      case "STOPPED":
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700"
    }
  }

  // Get glow color class based on category key
  const getGlowClass = (categoryKey: CategoryKey): string => {
    switch (categoryKey) {
      case "INITIALIZING": return "timeline-glow-purple";
      case "PLANNING": return "timeline-glow-cyan";
      case "SEARCHING": return "timeline-glow-blue";
      case "RANKING": return "timeline-glow-teal";
      case "BUILDING_CONTEXT": return "timeline-glow-emerald";
      case "WRITING": return "timeline-glow-amber";
      case "REFINING": return "timeline-glow-orange";
      case "FINALIZING": return "timeline-glow-rose";
      case "STARTING": return "timeline-glow-indigo";
      case "COMPLETE": return "timeline-glow-green";
      case "ERROR": return "timeline-glow-red";
      case "CONNECTION": return "timeline-glow-gray";
      case "CONTROL": return "";
      case "POLLING": return "timeline-glow-gray"; // Add POLLING glow
      default: return "";
    }
  }

  // Step color mapping - adapt to categories or remove if not used for main display
  const getCategoryColorClasses = (categoryKey: CategoryKey, isErrorState: boolean) => {
    if (isErrorState) return "border-red-500/50 dark:border-red-500/40 bg-red-50 dark:bg-red-900/10";
    // Use the glow class for background/border nuances if active, otherwise default
    // We'll apply the main glow via conditional class application below
    return "border-border bg-background/80"; // Default appearance
  }

  // Get the next step based on the current active step
  const getNextStep = () => {
    if (!categoryGroups.length || !isResearching || activeIndex === null || activeIndex < 0 || activeIndex >= categoryGroups.length ) return null

    const currentCategoryKey = categoryGroups[activeIndex].categoryKey

    // Don't show next step if polling or terminal
    if (currentCategoryKey === 'POLLING' || currentCategoryKey === 'COMPLETE' || currentCategoryKey === 'ERROR') return null;

    // Define the typical sequence of category keys
    const categorySequence: CategoryKey[] = [
      "STARTING",
      "INITIALIZING",
      "PLANNING",
      "SEARCHING",
      "RANKING",
      "BUILDING_CONTEXT",
      "WRITING",
      "REFINING",
      "FINALIZING",
      "COMPLETE",
    ]

    const currentIndex = categorySequence.indexOf(currentCategoryKey)
    if (currentIndex === -1 || currentIndex >= categorySequence.length - 1) return null

    const nextCategoryKey = categorySequence[currentIndex + 1]
    return CATEGORIES[nextCategoryKey]; 
  }

  // Check if a step is active
  const isStepActive = (index: number) => {
    if (!isResearching) return false
    return index === activeIndex
  }

  // Category Icon Mapping
  const getCategoryIcon = (categoryKey: CategoryKey) => {
    switch(categoryKey) {
      case "STARTING": return <Clock className="h-5 w-5" />;
      case "INITIALIZING": return <Layers3 className="h-5 w-5" />;
      case "PLANNING": return <DraftingCompass className="h-5 w-5" />;
      case "SEARCHING": return <Search className="h-5 w-5" />;
      case "RANKING": return <ArrowDownUp className="h-5 w-5" />;
      case "BUILDING_CONTEXT": return <FileText className="h-5 w-5" />;
      case "WRITING": return <BotMessageSquare className="h-5 w-5" />;
      case "REFINING": return <Sparkles className="h-5 w-5" />;
      case "FINALIZING": return <PackageCheck className="h-5 w-5" />;
      case "COMPLETE": return <Check className="h-5 w-5 text-green-500" />;
      case "ERROR": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "CONNECTION": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "CONTROL": return <Square className="h-5 w-5 text-muted-foreground" />;
      case "POLLING": return <Clock className="h-5 w-5 text-blue-500" />; // Add POLLING icon
      default: return <MoreHorizontal className="h-5 w-5" />;
    }
  }

  return (
    <div className="h-full">
      <TooltipProvider delayDuration={150}>
        <h3 className="text-lg font-medium text-card-foreground mb-3">Timeline</h3>
        <ScrollArea className="h-[500px] pr-4 relative" ref={scrollAreaRef}>
          <AnimatePresence initial={false}>
              {categoryGroups.map((group, index) => {
                const isActive = index === activeIndex && isResearching

                // --- START: Logic to find active sub-task for Building Context ---
                let activeBuildingContextDisplay: React.ReactNode = null;
                let activeSubTask: SubTask | undefined = undefined; // Store the active subtask itself
                if (group.categoryKey === 'BUILDING_CONTEXT') {
                  activeSubTask = 
                    group.subTasks.find(st => st.latestStatus === 'IN_PROGRESS') || 
                    group.subTasks.find(st => st.latestStatus === 'START');

                  if (activeSubTask) {
                    const faviconUrl = `https://icons.duckduckgo.com/ip3/${activeSubTask.displayId}.ico`;
                    const processingText = `${activeSubTask.latestStatus === 'START' ? 'Starting' : 'Processing'}: ${activeSubTask.displayId}`; 
                    activeBuildingContextDisplay = (
                      <span className="flex items-center">
                        <img
                          src={faviconUrl}
                          alt="" // Decorative favicon
                          width={16}
                          height={16}
                          className="w-4 h-4 mr-1.5 inline-block flex-shrink-0 object-contain" // Adjusted margin
                          // Basic error handling: hide if fails to load
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="truncate" title={activeSubTask.latestMessage}> {/* Show full message on hover */}
                           {processingText}...
                        </span>
                      </span>
                    );
                  }
                }
                // --- END: Logic to find active sub-task --- 

              return (
                <motion.div
                    key={group.categoryName}
                    ref={(el: HTMLDivElement | null) => { timelineItemsRef.current[index] = el; }}
                    className={cn(
                      "relative flex items-start space-x-4 pb-6",
                      index < categoryGroups.length - 1 ? 'timeline-line' : '',
                    )}
                    layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Category Node (Icon) */}
                    <div className={cn(
                      "mt-1 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10",
                      "mx-1",
                      getCategoryColorClasses(group.categoryKey, group.isErrorState),
                      isActive && "active-node" 
                    )}>
                        <Tooltip>
                        <TooltipTrigger asChild>
                          {getCategoryIcon(group.categoryKey)}
                          </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                          <p>{group.categoryName}</p>
                          </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Category Content Box */}
                    <div className={cn(
                      "flex-1 min-w-0 p-4 rounded-lg border shadow-sm overflow-hidden",
                      getCategoryColorClasses(group.categoryKey, group.isErrorState),
                      isActive && getGlowClass(group.categoryKey) 
                    )}>
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground flex items-center">
                          {group.categoryName}
                        </h4>
                        <Badge variant="outline" className={`${getStatusColor(group.latestStatus)} font-mono text-xs`}>
                          {getStatusIcon(group.latestStatus, group.isErrorState)} 
                          <span className="ml-1.5">{group.latestStatus}</span>
                        </Badge>
                      </div>

                      {/* Latest Message / Summary - MODIFIED */}
                      <p className="text-sm text-muted-foreground mb-3 break-words min-h-[20px]"> {/* Added min-height */}
                         {/* Render specific active task info OR the default latest message */} 
                         {activeBuildingContextDisplay !== null ? activeBuildingContextDisplay : group.latestMessage}
                      </p>

                      {/* MODIFIED: Expandable Details Section for Sub-Tasks */} 
                      {group.subTasks.length > 0 && (
                        <details className="group/details mt-3 pt-3 border-t border-border/50 w-full">
                          <summary className="text-xs text-muted-foreground hover:text-primary cursor-pointer flex items-center group-open/details:mb-2">
                            <ChevronRight className="h-3 w-3 mr-1 transform transition-transform duration-200 group-open/details:rotate-90" />
                            Show {group.subTasks.length} {group.subTasks.length === 1 ? 'sub-task' : 'sub-tasks'}
                          </summary>
                          <div className="space-y-3 pt-2 max-h-[250px] overflow-y-auto pr-1 mr-[-4px] w-full overflow-x-hidden">
                            {group.subTasks.map((subTask) => {
                               // Determine if this subtask is the active one
                               const isSubTaskActive = 
                                 group.categoryKey === 'BUILDING_CONTEXT' && 
                                 activeSubTask?.id === subTask.id;

                               return (
                                <div 
                                  key={subTask.id}
                                  className={cn(
                                    `text-xs p-3 rounded-md border bg-muted/30 flex items-start gap-3`,
                                    subTask.isRefinement ? 'border-primary/20' : 'border-border/50',
                                    // Add glow class if this subtask is active
                                    isSubTaskActive && getGlowClass('BUILDING_CONTEXT') // Reuse category glow
                                  )}
                                >
                                  {/* Sub-task Icon (Optional - could map based on subtask type if identifiable) */}
                                  {/* <div className="mt-0.5 text-muted-foreground"> <Info size={14}/> </div> */} 
                                  <div className="flex-1 min-w-0">
                                    {/* Sub-task Header: Identifier + Latest Status */}
                                    <div className="flex justify-between items-center mb-1">
                                      <span 
                                        title={subTask.id} // Full ID on hover
                                        className="font-medium text-muted-foreground truncate pr-2"
                                      >
                                        {subTask.displayId}
                                      </span>
                                      <Badge variant="outline" className={`${getStatusColor(subTask.latestStatus)} text-[10px] px-1.5 py-0 leading-tight`}>
                                        {getStatusIcon(subTask.latestStatus)} 
                                        <span className="ml-1">{subTask.latestStatus}</span>
                                    </Badge>
                                    </div>
                                    {/* Sub-task Latest Message */}
                                    <p className="text-muted-foreground/80 break-words">
                                      {subTask.latestMessage}
                                    </p>
                                    {/* Optional: Expand to see all updates for this specific sub-task */}
                                    {/* 
                                    {subTask.updates.length > 1 && (
                                       <details className="group/subdetails mt-1">
                                           <summary className="text-[10px] ...">Show history</summary>
                                           <div className="...">
                                               {subTask.updates.map(...)}
                                           </div>
                                       </details>
                                    )}
                                    */}
                                  </div>
                                </div>
                              )
                             })}
                          </div>
                        </details>
                      )}
                      </div>
                </motion.div>
              )
            })}

              {/* Simplified Next Step Indicator */} 
              {isResearching && getNextStep() && (
                <motion.div
                  key="next-step-indicator"
                  className={`relative flex items-start space-x-4 pb-6`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {/* Placeholder for alignment - empty div matching icon size/margin */} 
                  <div className="mt-1 flex-shrink-0 h-6 w-6 mx-1"></div> 
                  
                  {/* Text indicating next step */}
                  <div className="flex-1 min-w-0 mt-1">
                    <p className="text-sm text-muted-foreground italic">
                      Next: {getNextStep()}
                    </p>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
      </ScrollArea>
      </TooltipProvider>
    </div>
  )
}

