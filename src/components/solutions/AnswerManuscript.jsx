import { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import { ChevronDownIcon, ChevronUpIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatMarkdownMath } from "./solutions-meta"
import { AnswerReviewNote } from "./AnswerReviewNote"
import { AnswerStatusBadge } from "./AnswerStatus"
import { SourceList } from "./SourceList"

/**
 * AnswerManuscript — the scholarly solution reader (replaces AnswerCard).
 *
 * Behavior preserved exactly:
 *  - the verbatim 7-pass LaTeX/markdown normalizer + same plugin pipeline
 *  - collapsible body (expanded by default)
 *  - header "Regenerate" opens a confirmation; the inline failed-state
 *    "Retry Question" retries directly (both paths as before)
 */
export function AnswerManuscript({ answer, displayNumber, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false)

  const handleRetry = async () => {
    setIsRetryConfirmOpen(false)
    setIsRetrying(true)
    await onRetry(answer.id)
    setIsRetrying(false)
  }

  const sources = answer.sources || []

  const formattedContent = useMemo(
    () => formatMarkdownMath(answer.content),
    [answer.content]
  )

  return (
    <>
      <article
        data-slot="answer-manuscript"
        aria-label={`Solution for question ${answer.question_number || displayNumber}`}
        className="relative rounded-lg border border-border bg-card transition-[box-shadow,border-color] duration-(--motion-fast) ease-standard hover:border-ring/40 hover:shadow-xs"
      >
        {/* Manuscript header */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-border p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-mono text-meta font-semibold tabular-nums text-primary"
            >
              {answer.question_number || displayNumber}
            </span>
            <div className="min-w-0">
              <h3 className="font-serif text-title-sm leading-snug text-foreground">
                {answer.question_text}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-meta tabular-nums text-muted-foreground">
                  {answer.marks} marks
                </span>
                <AnswerStatusBadge status={answer.status} />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRetryConfirmOpen(true)}
              disabled={isRetrying}
              aria-label={`Regenerate solution for question ${answer.question_number || displayNumber}`}
            >
              <RotateCwIcon
                aria-hidden="true"
                className={isRetrying ? "animate-spin text-accent" : "text-accent"}
              />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-expanded={!isCollapsed}
              aria-label={
                isCollapsed
                  ? `Expand solution for question ${answer.question_number || displayNumber}`
                  : `Collapse solution for question ${answer.question_number || displayNumber}`
              }
            >
              {isCollapsed ? (
                <ChevronDownIcon aria-hidden="true" />
              ) : (
                <ChevronUpIcon aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Manuscript body */}
        {!isCollapsed && (
          <div className="animate-in fade-in duration-150 p-5 sm:p-6">
            {answer.status === "failed" ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 p-4"
              >
                <p className="text-body-sm font-semibold text-destructive">
                  Failed to generate answer:
                </p>
                <p className="mt-1 text-body-sm leading-relaxed text-destructive">
                  {answer.error_message || "Unknown error occurred."}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-transparent focus-visible:ring-destructive/20"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  aria-busy={isRetrying || undefined}
                >
                  <RotateCwIcon
                    aria-hidden="true"
                    className={isRetrying ? "animate-spin" : undefined}
                  />
                  {isRetrying ? "Retrying…" : "Retry Question"}
                </Button>
              </div>
            ) : (
              <div className="answer-manuscript max-w-[72ch]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {formattedContent || "_No answer generated yet._"}
                </ReactMarkdown>
              </div>
            )}

            {/* Real pipeline provenance — completed answers only */}
            {answer.status === "completed" && <AnswerReviewNote />}

            <SourceList sources={sources} />
          </div>
        )}
      </article>

      {/* Regenerate confirmation — copy preserved verbatim */}
      <AlertDialog
        open={isRetryConfirmOpen}
        onOpenChange={(open) => !open && setIsRetryConfirmOpen(false)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
            >
              <RotateCwIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>
                Regenerate Solution for Q{answer.question_number || displayNumber}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                AcademicStack will perform a fresh RAG query on your study notes and
                generate a new verified answer with AI review.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="ai"
              onClick={handleRetry}
              className="min-w-[11rem]"
            >
              Yes, Regenerate Answer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
