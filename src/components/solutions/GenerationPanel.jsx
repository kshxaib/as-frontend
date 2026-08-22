import { Loader2Icon, SparklesIcon } from "lucide-react"

/**
 * GenerationPanel — honest in-flight generation state.
 *
 * The generate endpoint is a single synchronous request that returns the
 * completed set; no answer-set id (and therefore no pollable progress)
 * exists on the client while it runs. Per DESIGN_SYSTEM.md §15 and the
 * honest-AI-states rule, this panel states the real situation only:
 * work is running, counts are real, completion updates automatically.
 */
export function GenerationPanel({ totalQuestions }) {
  return (
    <div
      data-slot="generation-panel"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="animate-in fade-in flex flex-col items-center rounded-xl border border-accent/30 bg-card px-6 py-14 text-center duration-200"
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent shadow-glow-ai"
      >
        <Loader2Icon className="size-6 animate-spin" />
      </span>

      <h2 className="mt-4 font-serif text-title-lg text-foreground">
        Generating your solved paper…
      </h2>
      <p className="mt-2 max-w-[52ch] text-body-base leading-relaxed text-muted-foreground">
        AcademicStack is retrieving grounded contexts from your linked study
        materials, drafting answers, and passing them through academic AI review.
        {typeof totalQuestions === "number" && totalQuestions > 0 && (
          <>
            {" "}
            <span className="font-mono tabular-nums text-foreground">
              {totalQuestions}
            </span>{" "}
            questions are queued.
          </>
        )}
      </p>
      <p className="mt-3 flex items-center gap-1.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        <SparklesIcon aria-hidden="true" className="size-3.5 text-accent" />
        This page updates automatically when generation completes
      </p>
    </div>
  )
}
