import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * AiProcessingIndicator — DESIGN_SYSTEM.md §15.
 * Generic staged AI-progress display (amber = AI provenance).
 * Presentational only: callers supply steps + current step; no store/API wiring.
 *
 * Props:
 *  - steps: [{ label, description? }]
 *  - currentStep: index of the active step (steps.length => all done)
 *  - elapsedSeconds?: shown as mono timer when provided
 *  - progress?: 0–100 determinate percentage when known
 *  - title?, subtitle?, compact?: presentation variants
 */
export function AiProcessingIndicator({
  steps = [],
  currentStep = 0,
  elapsedSeconds,
  progress,
  title,
  subtitle,
  compact = false,
  className,
  ...props
}) {
  return (
    <div
      data-slot="ai-processing-indicator"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-accent/30 bg-card p-5 shadow-glow-ai",
        compact && "gap-3 p-4",
        className
      )}
      {...props}
    >
      {(title || subtitle || Number.isFinite(elapsedSeconds)) && (
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent"
            >
              <SparklesIcon className="size-5 animate-pulse" />
            </span>
            <div className="min-w-0">
              {title && (
                <p className="truncate font-serif text-title-sm text-foreground">{title}</p>
              )}
              {subtitle && (
                <p className="mt-0.5 truncate text-body-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {Number.isFinite(elapsedSeconds) && (
            <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-meta tabular-nums text-muted-foreground">
              {elapsedSeconds}s
            </span>
          )}
        </div>
      )}

      {Number.isFinite(progress) && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-(--motion-slow) ease-standard"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      <ol className={cn("flex flex-col", compact ? "gap-2" : "gap-2.5")}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep
          return (
            <li
              key={step.label ?? idx}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-(--motion-fast) ease-standard",
                isCurrent && "border-accent/40 bg-accent/10",
                isDone && "border-border bg-muted/50",
                !isDone && !isCurrent && "border-border bg-transparent opacity-60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md border",
                    isDone && "border-success/25 bg-success/10 text-success",
                    isCurrent && "border-accent/40 bg-accent text-accent-foreground",
                    !isDone && !isCurrent && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <CheckCircle2Icon className="size-4" />
                  ) : isCurrent ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <span className="font-mono text-meta tabular-nums">{idx + 1}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-body-sm font-semibold",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && !compact && (
                    <p className="truncate text-body-sm text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 font-mono text-meta uppercase",
                  isDone && "text-success",
                  isCurrent && "animate-pulse text-accent",
                  !isDone && !isCurrent && "text-muted-foreground"
                )}
              >
                {isDone ? "Done" : isCurrent ? "Working" : "Pending"}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
