/* eslint-disable react-refresh/only-export-components -- shadcn convention: variants exported alongside component */
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge — DESIGN_SYSTEM.md §12.
 * Pill grammar by default; pair with StatusBadge (shared) for live states.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none tracking-wide transition-colors [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-primary/25 bg-primary/10 text-primary",
        secondary: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        accent: "border-accent/30 bg-accent/10 text-accent",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        info: "border-info/25 bg-info/10 text-info",
        gold: "border-gold/30 bg-gold/15 text-gold",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
