import { FileTextIcon, LayersIcon, SparklesIcon, BarChart3Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { QuestionBankStatusBadge } from "@/components/question-banks/QuestionBankStatus"
import { parseResourceIds } from "@/components/question-banks/question-bank-meta"
import { cn } from "@/lib/utils"

function StatTile({ label, icon: Icon, children, context, className }) {
  return (
    <div
      data-slot="review-stat-tile"
      className={cn("flex flex-col rounded-xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>
      {children}
      {context && <p className="mt-1 text-body-sm text-muted-foreground">{context}</p>}
    </div>
  )
}

const figureClass = "mt-2 font-serif text-figure tabular-nums text-foreground"

/**
 * ReviewStats — §9.2 stat tiles. Every figure is derived from the real
 * questions array; the bank tile shows only real bank fields.
 */
export function ReviewStats({
  currentQuestionBank,
  totalQuestions,
  totalMarks,
  explicitCount,
  aiEstimatedCount,
  userModifiedCount,
  resourcesById,
}) {
  if (!currentQuestionBank) return null

  const linkedIds = parseResourceIds(currentQuestionBank.resource_ids)
  const resolvedNames = linkedIds
    .map((id) => resourcesById.get(id)?.name)
    .filter(Boolean)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile label="Total Questions" icon={FileTextIcon} context="Questions in this bank">
        <p className={figureClass}>{totalQuestions}</p>
      </StatTile>

      <StatTile label="Total Marks" icon={BarChart3Icon} context="Sum of all question weights">
        <p className={cn(figureClass, "text-primary")}>{totalMarks}</p>
      </StatTile>

      <StatTile label="Marks Source" icon={SparklesIcon} context="Verification distribution">
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="success" title="Explicit from paper">
            {explicitCount} Explicit
          </Badge>
          <Badge variant="warning" title="Estimated by AI">
            {aiEstimatedCount} AI
          </Badge>
          <Badge variant="info" title="Modified by user">
            {userModifiedCount} Modified
          </Badge>
        </div>
      </StatTile>

      <StatTile label="Bank Context" icon={LayersIcon}>
        <p className="mt-2 truncate font-serif text-title-sm text-foreground">
          {currentQuestionBank.subject}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <QuestionBankStatusBadge status={currentQuestionBank.status} />
          {resolvedNames.length > 0 ? (
            <span
              className="truncate text-body-sm text-muted-foreground"
              title={resolvedNames.join(", ")}
            >
              {resolvedNames.length} linked resource{resolvedNames.length === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="font-mono text-meta tabular-nums text-muted-foreground">
              IDs [{currentQuestionBank.resource_ids || "none"}]
            </span>
          )}
        </div>
      </StatTile>

      {/* Screen-reader distribution summary */}
      <span className="sr-only">
        {explicitCount} explicit, {aiEstimatedCount} AI estimated,{" "}
        {userModifiedCount} user verified marks.
      </span>
    </div>
  )
}
