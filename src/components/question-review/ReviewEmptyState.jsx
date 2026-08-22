import { FileStackIcon, LayersIcon, PlusIcon, SearchXIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ReviewEmptyState — DESIGN_SYSTEM.md §14.
 * Variants: no-bank · no-questions · no-match. Editorial copy, no
 * generic "No data found".
 */
export function ReviewEmptyState({
  variant = "no-questions", // 'no-bank' | 'no-questions' | 'no-match'
  canExtract = false,
  onExtract,
  onAddQuestion,
  onGoToQuestionBanks,
  onClearFilters,
  className,
}) {
  if (variant === "no-bank") {
    return (
      <div
        data-slot="review-empty-no-bank"
        className={cn(
          "flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
        >
          <LayersIcon className="size-7" />
        </span>
        <h2 className="mt-5 font-serif text-display-lg text-foreground">
          No Question Bank Selected
        </h2>
        <p className="mt-2 max-w-[44ch] text-body-base leading-relaxed text-muted-foreground">
          Upload a question bank PDF or select one to begin reviewing questions.
        </p>
        {onGoToQuestionBanks && (
          <Button variant="outline" size="lg" className="mt-6" onClick={onGoToQuestionBanks}>
            Go to Question Banks
          </Button>
        )}
      </div>
    )
  }

  if (variant === "no-match") {
    return (
      <div
        data-slot="review-empty-no-match"
        className={cn(
          "flex flex-col items-center rounded-xl border border-border bg-card px-6 py-14 text-center",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground"
        >
          <SearchXIcon className="size-5" />
        </span>
        <h3 className="mt-4 font-serif text-title-lg text-foreground">
          No questions match your filters
        </h3>
        <p className="mt-1.5 max-w-sm text-body-base text-muted-foreground">
          Try a different keyword, marks value, or source — or clear the filters to see
          every question again.
        </p>
        {onClearFilters && (
          <Button variant="ghost" size="sm" className="mt-5" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="review-empty-no-questions"
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
      >
        <FileStackIcon className="size-7" />
      </span>
      <h2 className="mt-5 font-serif text-display-lg text-foreground">No Questions Yet</h2>
      <p className="mt-2 max-w-[46ch] text-body-base leading-relaxed text-muted-foreground">
        Extract the paper with AI or add your first question manually to start this
        review.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {canExtract && onExtract && (
          <Button variant="ai" size="lg" onClick={onExtract}>
            <SparklesIcon aria-hidden="true" />
            Extract Questions
          </Button>
        )}
        {onAddQuestion && (
          <Button size="lg" onClick={onAddQuestion}>
            <PlusIcon aria-hidden="true" />
            Add Question
          </Button>
        )}
      </div>
    </div>
  )
}
