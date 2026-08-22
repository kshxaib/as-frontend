import { AnimatePresence, motion } from "motion/react"

import { Skeleton } from "@/components/ui/skeleton"
import { useReducedMotion } from "@/lib/motion"
import {
  QuestionBankCard,
  QuestionBankCardMotion,
} from "./QuestionBankCard"

/**
 * QuestionBankGrid — DESIGN_SYSTEM.md §16 list choreography.
 * Stagger capped at ~350ms; filter/search reflows via layout animation;
 * reduced motion degrades to opacity-only.
 */
export function QuestionBankGrid({
  questionBanks,
  extractingQBs,
  isUploadingQuestionBank,
  resourcesById,
  onExtract,
  onDownload,
  onReview,
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      layout={!reduceMotion}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: Math.min(0.035, 0.35 / Math.max(1, questionBanks.length)),
          },
        },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {questionBanks.map((questionBank) => (
          <QuestionBankCardMotion key={questionBank.id} reduceMotion={reduceMotion}>
            <QuestionBankCard
              questionBank={questionBank}
              isExtracting={!!extractingQBs[questionBank.id]}
              isUploading={isUploadingQuestionBank}
              resourcesById={resourcesById}
              onExtract={onExtract}
              onDownload={onDownload}
              onReview={onReview}
            />
          </QuestionBankCardMotion>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/** Geometry-matched loading state — DESIGN_SYSTEM.md §14 (no spinner-only screens). */
export function QuestionBankGridSkeleton({ count = 6 }) {
  return (
    <div
      data-slot="qb-grid-skeleton"
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
          <Skeleton className="h-3 w-32" />
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
            <Skeleton className="h-3 w-24" />
            <div className="mt-2 flex gap-1.5">
              <Skeleton className="h-6 w-28 rounded-sm" />
              <Skeleton className="h-6 w-20 rounded-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Skeleton className="h-[31px] w-36 rounded-md" />
            <Skeleton className="h-[31px] w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
