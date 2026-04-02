import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full border border-[var(--nd-border-visible)] rounded-lg bg-transparent px-4 py-3 font-mono text-base text-[var(--nd-text-primary)] placeholder:text-[var(--nd-text-disabled)] focus-visible:outline-none focus-visible:border-[var(--nd-text-primary)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
