import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MARK_PRESETS } from "./question-review-meta"
import { cn } from "@/lib/utils"

/**
 * AddQuestionDialog — examination-item entry (replaces AddQuestionModal).
 * Payload preserved exactly: `{question_text, marks}` — the backend
 * assigns the question number and marks_source. Fresh state per mount
 * (conditionally rendered by the workspace).
 */
export function AddQuestionDialog({ open, onOpenChange, onSubmit }) {
  const [questionText, setQuestionText] = useState("")
  const [marks, setMarks] = useState(5)

  const canSubmit = !!questionText.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return

    // Same fire-and-forget contract as the original modal; failures
    // surface through the global error banner.
    onSubmit({
      question_text: questionText.trim(),
      marks: Number(marks),
    })

    setQuestionText("")
    setMarks(5)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Add an examination item</DialogTitle>
          <DialogDescription>
            The question is appended to this bank and numbered by AcademicStack.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-question-text" className="text-body-sm font-medium text-foreground">
              Question Text
            </label>
            <Textarea
              id="add-question-text"
              rows={4}
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              placeholder="e.g., Explain ACID properties with a real-world banking example…"
              aria-describedby={!canSubmit ? "add-question-hint" : undefined}
            />
            {!canSubmit && (
              <p id="add-question-hint" className="text-body-sm text-muted-foreground">
                Question text is required.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="text-body-sm font-medium text-foreground">Marks</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2 sm:w-72 sm:grid-cols-3">
              {MARK_PRESETS.map((preset) => (
                <label
                  key={preset}
                  className={cn(
                    "cursor-pointer rounded-md border border-input bg-card px-3 py-2 text-center shadow-xs transition-all duration-(--motion-fast) ease-standard",
                    "hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5",
                    "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30"
                  )}
                >
                  <input
                    type="radio"
                    name="add-question-marks"
                    value={preset}
                    checked={marks === preset}
                    onChange={() => setMarks(preset)}
                    className="sr-only peer"
                  />
                  <span className="block font-mono text-body-sm font-semibold tabular-nums text-muted-foreground peer-checked:text-primary">
                    {preset}
                    <span className="ml-0.5 text-meta uppercase tracking-wider">marks</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <label htmlFor="add-question-marks-custom" className="text-body-sm text-muted-foreground">
                Custom:
              </label>
              <Input
                id="add-question-marks-custom"
                type="number"
                min="1"
                max="100"
                value={marks}
                onChange={(event) => setMarks(Number(event.target.value))}
                className="w-20 text-center tabular-nums"
              />
            </div>
          </fieldset>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit} className="min-w-[9rem]">
              <PlusIcon aria-hidden="true" />
              Add Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
