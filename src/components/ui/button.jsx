/* eslint-disable react-refresh/only-export-components -- shadcn convention: variants exported alongside component */
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

/**
 * AcademicStack Button — DESIGN_SYSTEM.md §7.
 * Semantic tokens only; `ai` is reserved for AI verbs
 * (Extract / Generate / Regenerate), `gold` for export moments.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-clip-padding text-body-sm font-medium transition-all duration-(--motion-fast) ease-standard outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm",
        ai: "bg-accent text-accent-foreground shadow-glow-ai hover:bg-accent/90",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "border-destructive/40 text-destructive hover:bg-destructive/10 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline px-0",
        gold: "bg-gold text-gold-foreground shadow-xs hover:bg-gold/90 hover:shadow-sm",
      },
      size: {
        default: "h-9 px-4",
        xs: "h-[26px] gap-1 rounded-sm px-2 text-meta [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-[31px] gap-1.5 rounded-sm px-2.5",
        lg: "h-[42px] gap-2 rounded-lg px-5 text-body-base [&_svg:not([class*='size-'])]:size-[18px]",
        icon: "size-9",
        "icon-xs":
          "size-[26px] rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-[31px] rounded-sm",
        "icon-lg": "size-[42px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
