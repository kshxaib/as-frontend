import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonTile } from "@/components/shared/skeletons"

/**
 * ReviewSkeleton — geometry-matched loading (§14): stat tiles, toolbar,
 * and paper rows that mirror the final layout. No spinner-only screens.
 */
export function ReviewSkeleton() {
  return (
    <div data-slot="review-skeleton" aria-hidden="true" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonTile key={i} />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 xl:flex-row xl:items-center">
        <Skeleton className="h-9 w-full max-w-md rounded-md" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[26px] w-12 rounded-sm" />
          ))}
          <Skeleton className="ml-auto h-[26px] w-28 rounded-sm" />
        </div>
      </div>

      {/* Paper rows */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="size-[31px] rounded-sm" />
                <Skeleton className="size-[31px] rounded-sm" />
              </div>
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-[26px] w-10 rounded-sm" />
                <Skeleton className="h-[26px] w-10 rounded-sm" />
                <Skeleton className="h-[26px] w-10 rounded-sm" />
              </div>
              <Skeleton className="h-11 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
