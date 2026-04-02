import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--nd-border-visible)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--nd-border-visible)] bg-transparent text-[var(--nd-text-secondary)]",
        secondary:
          "border-[var(--nd-border)] bg-[var(--nd-surface-raised)] text-[var(--nd-text-disabled)]",
        destructive:
          "border-[var(--nd-accent)] bg-transparent text-[var(--nd-accent)]",
        outline:
          "border-[var(--nd-text-display)] bg-transparent text-[var(--nd-text-display)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
