import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-mono text-[13px] uppercase tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--nd-border-visible)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] px-6",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--nd-text-display)] text-[var(--nd-bg)] hover:opacity-80",
        destructive:
          "bg-transparent border border-[var(--nd-accent)] text-[var(--nd-accent)] hover:bg-[var(--nd-accent-subtle)]",
        outline:
          "bg-transparent border border-[var(--nd-border-visible)] text-[var(--nd-text-primary)] hover:border-[var(--nd-text-primary)]",
        secondary:
          "bg-transparent border border-[var(--nd-border-visible)] text-[var(--nd-text-primary)] hover:border-[var(--nd-text-primary)]",
        ghost:
          "bg-transparent text-[var(--nd-text-secondary)] hover:text-[var(--nd-text-primary)] rounded-none px-0",
        link:
          "bg-transparent text-[var(--nd-interactive)] underline-offset-4 hover:underline rounded-none px-0 min-h-0",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-12 px-8 text-[14px]",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
