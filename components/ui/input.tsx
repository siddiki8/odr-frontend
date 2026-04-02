import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full border-0 border-b border-[var(--nd-border-visible)] bg-transparent px-0 py-2 font-mono text-base text-[var(--nd-text-primary)] placeholder:text-[var(--nd-text-disabled)] focus-visible:outline-none focus-visible:border-[var(--nd-text-primary)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
