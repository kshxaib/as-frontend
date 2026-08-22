import { StampIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * AnswerReviewNote — DESIGN_SYSTEM.md §15.4 provenance grammar.
 *
 * Documents the REAL server-side pipeline truthfully:
 *   1. RAG retrieval + draft generation (multi-provider router)
 *   2. Academic reviewer refinement pass (app/rag/service.py
 *      `review_rag_answer`, enabled for every generated answer)
 *   3. The refined result is stored as the answer's final content
 *
 * The backend exposes NO structured review output (no score, verdict,
 * issues, suggestions, or review status — answers/schemas.py), so this
 * note describes the pipeline only and makes NO per-answer claims about
 * what the reviewer changed or verified. Amber marks AI provenance.
 */
export function AnswerReviewNote({ className }) {
  return (
    <aside
      data-slot="answer-review-note"
      aria-label="Academic AI review provenance"
      className={cn(
        "mt-6 rounded-r-md border-l-2 border-accent/50 bg-accent/5 py-2.5 pl-3 pr-3",
        className
      )}
    >
      <details className="group/note">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-body-sm font-medium text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 [&::-webkit-details-marker]:hidden">
          <StampIcon aria-hidden="true" className="size-4 shrink-0 text-accent" />
          Refined by the academic AI reviewer pass
          <span
            aria-hidden="true"
            className="font-mono text-meta uppercase tracking-wider text-muted-foreground group-open/note:hidden"
          >
            · How it works
          </span>
          <span
            aria-hidden="true"
            className="hidden font-mono text-meta uppercase tracking-wider text-muted-foreground group-open/note:inline"
          >
            · Hide
          </span>
        </summary>

        <div className="mt-2.5 border-t border-accent/20 pt-2.5">
          <p className="max-w-[64ch] text-body-sm leading-relaxed text-muted-foreground">
            During generation, each answer is drafted against your retrieved study
            material, then passed to a senior academic reviewer model that refines
            accuracy, mathematical formatting, and mark-appropriate depth before the
            result is stored. Regenerating an answer re-runs this full pipeline.
          </p>
        </div>
      </details>
    </aside>
  )
}
