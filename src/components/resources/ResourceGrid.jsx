import { AnimatePresence, motion } from "motion/react"

import { Skeleton } from "@/components/ui/skeleton"
import { useReducedMotion } from "@/lib/motion"
import { ResourceCard, ResourceCardMotion } from "./ResourceCard"

/**
 * ResourceGrid — DESIGN_SYSTEM.md §16 list choreography.
 * Stagger capped at ~350ms; filter/search reflows via layout animation;
 * reduced motion degrades to opacity-only.
 */
export function ResourceGrid({
  resources,
  isIndexingResource,
  isUploadingResource,
  onIndex,
  onToggleShare,
  onDownload,
  onDelete,
}) {
  const reduceMotion = useReducedMotion()
  const anyIndexing = Object.values(isIndexingResource).some(Boolean)

  return (
    <motion.div
      layout={!reduceMotion}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: Math.min(0.035, 0.35 / Math.max(1, resources.length)),
          },
        },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {resources.map((resource) => (
          <ResourceCardMotion key={resource.id} reduceMotion={reduceMotion}>
            <ResourceCard
              resource={resource}
              isIndexing={!!isIndexingResource[resource.id]}
              anyIndexing={anyIndexing}
              isUploading={isUploadingResource}
              onIndex={onIndex}
              onToggleShare={onToggleShare}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          </ResourceCardMotion>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/** Geometry-matched loading state — DESIGN_SYSTEM.md §14 (no spinner-only screens). */
export function ResourceGridSkeleton({ count = 6 }) {
  return (
    <div
      data-slot="resource-grid-skeleton"
      aria-hidden="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-5 w-36 rounded-full" />
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Skeleton className="h-[31px] w-28 rounded-md" />
            <Skeleton className="size-[31px] rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
