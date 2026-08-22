import { Loader2Icon, SparklesIcon } from "lucide-react"

/**
 * GeneratingNotice — honest, non-blocking generation state (§15.1).
 * The generate endpoint exposes no step/percentage data to this page,
 * so nothing fake is animated: a simple live-region notice while
 * `isGeneratingAnswers` is true. The store navigates to Solutions
 * on completion (existing behavior).
 */
export function GeneratingNotice({ totalQuestions, totalMarks }) {
  return (
    <div
      data-slot="generating-notice"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="animate-in fade-in flex items-start gap-3 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 duration-200"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-card text-accent shadow-glow-ai"
      >
        <Loader2Icon className="size-4 animate-spin" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-body-sm font-semibold text-foreground">
          <SparklesIcon aria-hidden="true" className="size-3.5 text-accent" />
          Preparing your solved paper…
        </p>
        <p className="mt-0.5 text-body-sm leading-relaxed text-muted-foreground">
          Grounded retrieval, drafting and academic review are running for all{" "}
          <span className="font-mono tabular-nums">{totalQuestions}</span> questions (
          <span className="font-mono tabular-nums">{totalMarks}</span> marks). You will
          move to Solutions automatically when it completes.
        </p>
      </div>
    </div>
  )
}
