import { cn } from "@/lib/utils"

/**
 * Skeleton — DESIGN_SYSTEM.md §14.
 * Shimmer sweep handled by the `.skeleton` class in index.css
 * (disabled automatically under prefers-reduced-motion).
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
