import { AlertCircleIcon, CheckCircle2Icon, FileTextIcon, Loader2Icon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { getQuestionBankStatus } from "./question-bank-meta"
import { cn } from "@/lib/utils"

const STATUS_ICONS = {
  check: CheckCircle2Icon,
  alert: AlertCircleIcon,
  file: FileTextIcon,
}

export function QuestionBankStatusBadge({ status, isExtracting, className, ...props }) {
  const config = getQuestionBankStatus({ status, isExtracting })
  return (
    <StatusBadge
      tone={config.tone}
      label={config.label}
      icon={config.iconKey ? STATUS_ICONS[config.iconKey] : undefined}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
      {...props}
    />
  )
}

/**
 * Card-local extraction overlay — DESIGN_SYSTEM.md §15.2.
 * Indeterminate by design: the extract endpoint returns no progress data,
 * so nothing fake is animated. Rendered only while
 * `extractingQBs[bank.id]` is true (live store flag).
 */
export function QuestionBankExtractionOverlay({ className }) {
  return (
    <div
      data-slot="qb-extraction-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "animate-in fade-in absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/85 p-4 backdrop-blur-[2px] duration-150",
        className
      )}
    >
      <div className="flex max-w-[28ch] flex-col items-center gap-2 rounded-lg border border-accent/40 bg-card px-6 py-5 text-center shadow-glow-ai">
        <Loader2Icon aria-hidden="true" className="size-5 animate-spin text-accent" />
        <p className="font-serif text-title-sm text-foreground">Extracting questions</p>
        <p className="text-body-sm text-muted-foreground">
          Reading the paper layout, parsing questions and resolving marks.
        </p>
      </div>
    </div>
  )
}
