import { AnimatePresence, motion } from "motion/react"

import { Skeleton } from "@/components/ui/skeleton"
import { useReducedMotion } from "@/lib/motion"
import {
  CommunityResourceCard,
  CommunityCardMotion,
} from "./CommunityResourceCard"
import { CommunitySolvedSetCard } from "./CommunitySolvedSetCard"

/**
 * CommunityGrid — §16 list choreography over the ACTIVE collection.
 * Stagger capped ~350ms; reduced motion degrades to opacity-only.
 */
export function CommunityGrid({
  activeSubTab,
  resources,
  answerSets,
  onDownloadResource,
  onDownloadAnswerSet,
}) {
  const reduceMotion = useReducedMotion()
  const isResources = activeSubTab === "resources"

  return (
    <motion.div
      layout={!reduceMotion}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: Math.min(
              0.035,
              0.35 /
                Math.max(1, isResources ? resources.length : answerSets.length)
            ),
          },
        },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isResources
          ? resources.map((resource) => (
              <CommunityCardMotion key={resource.id} reduceMotion={reduceMotion}>
                <CommunityResourceCard
                  resource={resource}
                  onDownload={onDownloadResource}
                />
              </CommunityCardMotion>
            ))
          : answerSets.map((answerSet) => (
              <CommunityCardMotion key={answerSet.id} reduceMotion={reduceMotion}>
                <CommunitySolvedSetCard
                  answerSet={answerSet}
                  onDownload={onDownloadAnswerSet}
                />
              </CommunityCardMotion>
            ))}
      </AnimatePresence>
    </motion.div>
  )
}

/** Geometry-matched loading state (§14). */
export function CommunitySkeleton({ count = 6 }) {
  return (
    <div
      data-slot="community-skeleton"
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
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-[31px] w-32 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
