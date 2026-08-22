import { BookOpenIcon, FileTextIcon, PlusIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * SolutionsEmptyState — DESIGN_SYSTEM.md §14.
 * Variants: no-banks (full page) · no-answers · no-match.
 */
export function SolutionsEmptyState({
  variant = "no-answers", // 'no-banks' | 'no-answers' | 'no-match'
  questionBankName,
  onGoToQuestionBanks,
  onGenerate,
  onClearSearch,
  className,
}) {
  if (variant === "no-banks") {
    return (
      <div
        data-slot="solutions-empty-no-banks"
        className={cn(
          "mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-card px-8 py-14 text-center",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
        >
          <BookOpenIcon className="size-7" />
        </span>
        <h2 className="mt-5 font-serif text-title-lg text-foreground">
          No Question Banks Available
        </h2>
        <p className="mt-2 max-w-[40ch] text-body-base leading-relaxed text-muted-foreground">
          Upload a question bank PDF in the Question Banks section to extract questions
          and generate answers.
        </p>
        {onGoToQuestionBanks && (
          <Button size="lg" className="mt-6" onClick={onGoToQuestionBanks}>
            <FileTextIcon aria-hidden="true" />
            Go to Question Banks
          </Button>
        )}
      </div>
    )
  }

  if (variant === "no-match") {
    return (
      <div
        data-slot="solutions-empty-no-match"
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
          No solutions match your search
        </h3>
        <p className="mt-1.5 max-w-sm text-body-base text-muted-foreground">
          Try different keywords — or clear the search to see every solution in this
          set again.
        </p>
        {onClearSearch && (
          <Button variant="ghost" size="sm" className="mt-5" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="solutions-empty-no-answers"
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
        <BookOpenIcon className="size-7" />
      </span>

      <h2 className="mt-5 font-serif text-display-lg text-foreground">
        {questionBankName
          ? `No Answers Generated for “${questionBankName}” Yet`
          : "No Answers Generated Yet"}
      </h2>
      <p className="mt-2 max-w-[50ch] text-body-base leading-relaxed text-muted-foreground">
        Generate syllabus-grounded, citation-backed answers using your linked study
        materials.
      </p>

      {onGenerate && (
        <Button variant="ai" size="lg" className="mt-6" onClick={onGenerate}>
          <PlusIcon aria-hidden="true" />
          Generate Answers with AI
        </Button>
      )}
    </div>
  )
}
