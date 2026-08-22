import { ChevronRightIcon, FileStackIcon, PlusIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PIPELINE_STAGES } from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"

/**
 * QuestionBankEmptyState — DESIGN_SYSTEM.md §14.
 * Two variants: first-run archive and no-search-results.
 * Original microcopy preserved ("No Question Banks Found",
 * "Upload your semester question paper…", "Upload First Paper").
 */
export function QuestionBankEmptyState({
  variant = "library", // 'library' | 'no-results'
  searchQuery = "",
  onCreateQuestionBank,
  onClearFilters,
  className,
}) {
  if (variant === "no-results") {
    return (
      <div
        data-slot="qb-empty-no-results"
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
          No matches for “{searchQuery.trim()}”
        </h3>
        <p className="mt-1.5 max-w-sm text-body-base text-muted-foreground">
          Try a different title or subject — or clear the filters to see your whole
          archive again.
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
      data-slot="qb-empty-library"
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-20",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-10 hidden border-t border-border/70 sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-16 hidden border-t border-border/50 sm:block"
      />

      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
      >
        <FileStackIcon className="size-7" />
      </span>

      <h2 className="mt-5 font-serif text-display-lg text-foreground">
        No Question Banks Found
      </h2>
      <p className="mt-2 max-w-[46ch] text-body-base leading-relaxed text-muted-foreground">
        Upload your semester question paper or assignment PDF to extract structured
        questions with AI.
      </p>
      <p className="mt-1.5 max-w-[48ch] text-body-sm leading-relaxed text-muted-foreground">
        A question bank is stage two of your workflow — upload the exam paper, link
        your study materials, then extract and review its questions.
      </p>

      {onCreateQuestionBank && (
        <Button size="lg" className="mt-6" onClick={onCreateQuestionBank}>
          <PlusIcon aria-hidden="true" />
          Upload First Paper
        </Button>
      )}

      {/* Pipeline wayfinding (§13) — static, current stage highlighted */}
      <ol
        aria-label="AcademicStack workflow stages"
        className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5"
      >
        {PIPELINE_STAGES.map((stage, index) => {
          const isCurrent = stage.tabId === "question_banks"
          return (
            <li key={stage.step} className="flex items-center gap-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 font-mono text-meta uppercase tracking-wider",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4.5 items-center justify-center rounded-full border text-[10px] tabular-nums",
                    isCurrent
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {stage.step}
                </span>
                {stage.label}
              </span>
              {index < PIPELINE_STAGES.length - 1 && (
                <ChevronRightIcon aria-hidden="true" className="size-3 text-muted-foreground" />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
