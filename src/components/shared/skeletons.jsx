import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * Loading skeletons — DESIGN_SYSTEM.md §14.
 * Geometry helpers that mirror final layouts; purely presentational.
 */

export function SkeletonText({ lines = 3, className, ...props }) {
  return (
    <div data-slot="skeleton-text" className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className, ...props }) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

export function SkeletonTile({ className, ...props }) {
  return (
    <div
      data-slot="skeleton-tile"
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-card p-5",
        className
      )}
      {...props}
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonRows({ rows = 3, className, ...props }) {
  return (
    <div data-slot="skeleton-rows" className={cn("flex flex-col gap-3", className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="size-8 rounded-lg" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
