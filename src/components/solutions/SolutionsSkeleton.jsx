import { Skeleton } from "@/components/ui/skeleton"

/**
 * SolutionsSkeleton — geometry-matched loading (§14): header meta,
 * toolbar, and manuscript blocks that mirror the final layout.
 */
export function SolutionsSkeleton() {
  return (
    <div data-slot="solutions-skeleton" aria-hidden="true" className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <Skeleton className="h-9 w-full max-w-md rounded-md" />
        <Skeleton className="hidden h-4 w-40 sm:block" />
      </div>

      {/* Manuscript blocks */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="flex min-w-0 items-start gap-3">
                <Skeleton className="size-8 rounded-md" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-[31px] w-28 rounded-sm" />
            </div>
            <div className="p-5 sm:p-6">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="mt-2 h-3.5 w-full" />
              <Skeleton className="mt-2 h-3.5 w-5/6" />
              <Skeleton className="mt-2 h-3.5 w-2/3" />
              <div className="mt-6 flex gap-2 border-t border-border pt-4">
                <Skeleton className="h-12 w-48 rounded-md" />
                <Skeleton className="h-12 w-44 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
