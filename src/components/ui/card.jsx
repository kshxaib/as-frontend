import { cn } from "@/lib/utils"

/**
 * Card — DESIGN_SYSTEM.md §9.
 * Hairline-ruled surface; elevation stays quiet (shadow only on hover by callers).
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-5 pt-5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-title-sm text-card-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 py-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center gap-3 border-t border-border px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
