import { useRef, useState } from "react"
import {
  BookOpenIcon,
  CheckCircle2Icon,
  CloudUploadIcon,
  DatabaseIcon,
  FileTextIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react"

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
import { cn } from "@/lib/utils"

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return ""
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const INITIAL_FIELDS = {
  name: "",
  subject: "",
}

/**
 * QuestionBankUploadDialog — DESIGN_SYSTEM.md §8/§11 form dialog.
 * Field state lives here; the caller receives plain values and keeps
 * full ownership of the FormData contract (upload API untouched).
 *
 * Resource linking preserves the original multi-select checkbox flow:
 * zero, one, or many resources may be linked; nothing is auto-selected.
 */
export function QuestionBankUploadDialog({
  open,
  onOpenChange,
  isUploading = false,
  resources = [],
  onSubmit,
}) {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [selectedResourceIds, setSelectedResourceIds] = useState([])
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const setField = (key) => (event) => {
    const value = event.target.value
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleToggleResourceId = (id) => {
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const acceptFile = (candidate) => {
    if (!candidate) return
    const isPdf =
      candidate.type === "application/pdf" ||
      candidate.name?.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      setFile(null)
      setErrors((prev) => ({ ...prev, file: "Only PDF files are accepted." }))
      return
    }
    setFile(candidate)
    setErrors((prev) => ({ ...prev, file: undefined }))
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!fields.name.trim()) nextErrors.name = "Paper title is required."
    if (!fields.subject.trim()) nextErrors.subject = "Subject is required."
    if (!file) nextErrors.file = "Attach a PDF to continue."
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const result = await onSubmit({
      name: fields.name,
      subject: fields.subject,
      resourceIds: selectedResourceIds,
      file,
    })

    if (result?.success) {
      setFields(INITIAL_FIELDS)
      setSelectedResourceIds([])
      setFile(null)
      onOpenChange(false)
    }
  }

  const fieldError = (key) =>
    errors[key] ? (
      <p
        id={`${key}-error`}
        role="alert"
        className="flex items-center gap-1.5 text-body-sm text-destructive"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-destructive" />
        {errors[key]}
      </p>
    ) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Create a question bank
          </DialogTitle>
          <DialogDescription>
            The exam paper PDF is stored on Cloudinary. Link study materials to
            ground AI extraction and answers in your own notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="qb-name" className="text-body-sm font-medium text-foreground">
                  Paper Title
                </label>
                <span className="font-mono text-meta uppercase text-muted-foreground">Required</span>
              </div>
              <Input
                id="qb-name"
                value={fields.name}
                onChange={setField("name")}
                placeholder="e.g., End Semester Exam 2025"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {fieldError("name")}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="qb-subject" className="text-body-sm font-medium text-foreground">
                Subject
              </label>
              <Input
                id="qb-subject"
                value={fields.subject}
                onChange={setField("subject")}
                placeholder="e.g., Database Management Systems"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {fieldError("subject")}
            </div>
          </div>

          {/* Linked resources — original multi-select flow, restyled (§8) */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="flex items-baseline justify-between gap-3 text-body-sm font-medium text-foreground">
              Link Study Resources
              <span className="font-mono text-meta font-normal uppercase text-muted-foreground tabular-nums">
                {selectedResourceIds.length} selected
              </span>
            </legend>

            <div className="max-h-44 overflow-y-auto rounded-md border border-input bg-muted/30 p-2">
              {resources.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {resources.map((resource) => {
                    const checked = selectedResourceIds.includes(resource.id)
                    return (
                      <li key={resource.id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-sm border bg-card px-3 py-2 transition-all duration-(--motion-fast) ease-standard",
                            checked
                              ? "border-primary/60 bg-primary/5"
                              : "border-transparent hover:bg-muted/60",
                            "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleResourceId(resource.id)}
                            className="sr-only peer"
                          />
                          <BookOpenIcon
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground peer-checked:text-primary"
                          />
                          <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
                            {resource.name}
                          </span>
                          <span className="shrink-0 font-mono text-meta uppercase text-muted-foreground">
                            {resource.subject}
                          </span>
                          {resource.status === "indexed" && (
                            <DatabaseIcon
                              aria-label="Indexed"
                              role="img"
                              className="size-3.5 shrink-0 text-success"
                            />
                          )}
                          {checked && (
                            <CheckCircle2Icon
                              aria-hidden="true"
                              className="size-4 shrink-0 text-primary"
                            />
                          )}
                        </label>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="px-2 py-1.5 text-body-sm italic text-muted-foreground">
                  No resources available. You can link them later.
                </p>
              )}
            </div>
          </fieldset>

          {/* PDF dropzone — §8 file upload */}
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-foreground">Question Bank PDF</p>
            <div
              data-dragging={dragging || undefined}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                acceptFile(event.dataTransfer.files?.[0])
              }}
              className={cn(
                "rounded-lg border border-dashed transition-all duration-(--motion-fast) ease-standard",
                dragging
                  ? "border-ring bg-primary/5"
                  : errors.file
                    ? "border-destructive/60"
                    : "border-input hover:border-ring hover:bg-muted/40"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  acceptFile(event.target.files?.[0])
                  event.target.value = ""
                }}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer flex-col items-center gap-1.5 px-4 py-7 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <CloudUploadIcon
                  aria-hidden="true"
                  className={cn(
                    "size-6",
                    dragging ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-body-base font-medium text-foreground">
                  Drop your PDF here, or{" "}
                  <span className="underline decoration-border underline-offset-4">
                    browse files
                  </span>
                </span>
                <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
                  PDF only · stored on Cloudinary
                </span>
              </button>
            </div>

            {file && (
              <div className="flex items-center gap-2.5 rounded-md border border-border bg-muted/50 px-3 py-2">
                <FileTextIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
                  {file.name}
                </span>
                <span className="shrink-0 font-mono text-meta tabular-nums text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${file.name}`}
                  onClick={clearFile}
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </div>
            )}
            {fieldError("file")}
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="min-w-[11rem]"
              aria-busy={isUploading || undefined}
            >
              {isUploading ? (
                <>
                  <Loader2Icon aria-hidden="true" className="animate-spin" />
                  Uploading…
                </>
              ) : (
                "Create Question Bank"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
