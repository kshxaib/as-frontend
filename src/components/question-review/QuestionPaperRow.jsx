import { useState } from "react"
import {
  CheckIcon,
  Edit3Icon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MARK_PRESETS } from "./question-review-meta"
import { AssignedMarksBlock, MarksSourceBadge } from "./QuestionMarks"
import { cn } from "@/lib/utils"

/**
 * QuestionPaperRow — editorial examination-paper row (replaces QuestionCard).
 *
 * Behavior preserved exactly from the original card:
 *  - inline edit (text + custom marks) saving `{question_text, marks}`;
 *    save is blocked when text is empty
 *  - quick-marks presets apply immediately via the store
 *  - delete opens a destructive confirmation first
 * Store actions arrive via props (no API logic here).
 */
export function QuestionPaperRow({
  question,
  displayNumber,
  onSave,
  onQuickMark,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editText, setEditText] = useState(question.question_text)
  const [editMarks, setEditMarks] = useState(question.marks)

  const canSave = !!editText.trim()

  const handleSave = () => {
    if (!editText.trim()) return
    onSave(question.id, {
      question_text: editText.trim(),
      marks: Number(editMarks),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(question.question_text)
    setEditMarks(question.marks)
    setIsEditing(false)
  }

  // Preserved from the original card: quick marks apply immediately
  // AND keep any open editor's marks field in sync.
  const handleQuickMark = (preset) => {
    onQuickMark(question.id, preset)
    setEditMarks(preset)
  }

  return (
    <>
      <article
        data-slot="question-paper-row"
        aria-label={`Question ${question.question_number || displayNumber}`}
        className="relative rounded-lg border border-border bg-card p-5 transition-[box-shadow,border-color] duration-(--motion-fast) ease-standard hover:border-ring/40 hover:shadow-xs"
      >
        {/* Header: folio number + source · row actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-mono text-meta font-semibold tabular-nums text-primary"
            >
              {question.question_number || displayNumber}
            </span>
            <MarksSourceBadge source={question.marks_source} />
          </div>

          {isEditing ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <Button size="sm" onClick={handleSave} disabled={!canSave}>
                <CheckIcon aria-hidden="true" />
                Save
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleCancel} aria-label="Cancel editing">
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                aria-label={`Edit question ${question.question_number || displayNumber}`}
              >
                <Edit3Icon aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive"
                onClick={() => setIsDeleteConfirmOpen(true)}
                aria-label={`Delete question ${question.question_number || displayNumber}`}
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {/* Body: reading text or editor */}
        {isEditing ? (
          <div className="animate-in fade-in mt-4 flex flex-col gap-3 duration-150">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`question-text-${question.id}`}
                className="text-body-sm font-medium text-foreground"
              >
                Question Text
              </label>
              <Textarea
                id={`question-text-${question.id}`}
                rows={3}
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                placeholder="Enter question text…"
              />
              {!canSave && (
                <p className="text-body-sm text-muted-foreground">
                  Question text is required before saving.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor={`question-marks-${question.id}`}
                className="text-body-sm font-medium text-foreground"
              >
                Marks
              </label>
              <Input
                id={`question-marks-${question.id}`}
                type="number"
                min="1"
                max="100"
                value={editMarks}
                onChange={(event) => setEditMarks(event.target.value)}
                className="w-20 tabular-nums"
              />
              <p className="text-body-sm text-muted-foreground">
                Changing marks marks them as user verified.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 select-text font-serif text-body-lg leading-relaxed text-foreground">
            {question.question_text}
          </p>
        )}

        {/* Footer rule: quick marks · assigned figure */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label={`Quick marks for question ${question.question_number || displayNumber}`}
          >
            <span className="mr-1 text-body-sm font-medium text-muted-foreground">Quick Marks:</span>
            {MARK_PRESETS.map((preset) => {
              const isSelected = Number(question.marks) === preset
              return (
                <Button
                  key={preset}
                  variant={isSelected ? "primary" : "outline"}
                  size="xs"
                  aria-pressed={isSelected}
                  onClick={() => handleQuickMark(preset)}
                  className="tabular-nums"
                >
                  {preset}M
                </Button>
              )
            })}
          </div>

          <AssignedMarksBlock marks={question.marks} />
        </div>
      </article>

      {/* Delete confirmation — copy preserved verbatim */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => !open && setIsDeleteConfirmOpen(false)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg border border-destructive/25 bg-destructive/10 text-destructive"
              )}
            >
              <Trash2Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>
                Delete Question {question.question_number || displayNumber}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this question ({question.marks} marks)?
                It will be removed from this question bank.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setIsDeleteConfirmOpen(false)
                onDelete(question.id)
              }}
              className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-transparent focus-visible:ring-destructive/20"
            >
              Yes, Delete Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
