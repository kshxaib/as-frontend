import { useRef, useState } from "react"
import { CloudUploadIcon, FileTextIcon, GlobeIcon, Loader2Icon, LockIcon, XIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return ""
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const INITIAL_FIELDS = {
  name: "",
  subject: "",
  chapters: "",
  description: "",
}

/**
 * ResourceUploadDialog — DESIGN_SYSTEM.md §8/§11 form dialog.
 * Field state lives here; the caller receives plain values and keeps
 * full ownership of the FormData contract (upload API untouched).
 * Mount conditionally (open) so each session starts from a fresh form —
 * the same semantics as the original page's conditional modal.
 */
export function ResourceUploadDialog({ open, onOpenChange, isUploading = false, onSubmit }) {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [visibility, setVisibility] = useState("private")
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const setField = (key) => (event) => {
    const value = event.target.value
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
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
    if (!fields.name.trim()) nextErrors.name = "Resource title is required."
    if (!fields.subject.trim()) nextErrors.subject = "Subject is required."
    if (!file) nextErrors.file = "Attach a PDF to continue."
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const result = await onSubmit({
      name: fields.name,
      subject: fields.subject,
      chapters: fields.chapters,
      description: fields.description,
      visibility,
      file,
    })

    if (result?.success) {
      setFields(INITIAL_FIELDS)
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
            Add a document to your library
          </DialogTitle>
          <DialogDescription>
            PDFs are stored securely on Cloudinary and can be indexed into your
            private Qdrant vector store.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="resource-name" className="text-body-sm font-medium text-foreground">
                  Resource Title
                </label>
                <span className="font-mono text-meta uppercase text-muted-foreground">Required</span>
              </div>
              <Input
                id="resource-name"
                value={fields.name}
                onChange={setField("name")}
                placeholder="e.g., Operating Systems — Modern Concepts"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {fieldError("name")}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="resource-subject" className="text-body-sm font-medium text-foreground">
                Subject
              </label>
              <Input
                id="resource-subject"
                value={fields.subject}
                onChange={setField("subject")}
                placeholder="e.g., Operating Systems"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {fieldError("subject")}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="resource-chapters" className="text-body-sm font-medium text-foreground">
                Chapters / Modules
              </label>
              <Input
                id="resource-chapters"
                value={fields.chapters}
                onChange={setField("chapters")}
                placeholder="e.g., Ch 1–4, Memory Mgmt"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="resource-description" className="text-body-sm font-medium text-foreground">
              Description / Notes
            </label>
            <Textarea
              id="resource-description"
              rows={2}
              value={fields.description}
              onChange={setField("description")}
              placeholder="Brief description of this document…"
            />
          </div>

          {/* Visibility radio-cards — §8 special fields */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-body-sm font-medium text-foreground">Visibility</legend>
            <div className="mt-0.5 grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border border-input bg-card p-3 shadow-xs transition-all duration-(--motion-fast) ease-standard",
                  "hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5",
                  "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30"
                )}
              >
                <input
                  type="radio"
                  name="resource-visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="sr-only peer"
                />
                <LockIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground peer-checked:text-primary"
                />
                <span className="min-w-0">
                  <span className="block text-body-sm font-semibold text-foreground peer-checked:text-primary">
                    Private
                  </span>
                  <span className="block text-body-sm text-muted-foreground">
                    Only you can see this document.
                  </span>
                </span>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border border-input bg-card p-3 shadow-xs transition-all duration-(--motion-fast) ease-standard",
                  "hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5",
                  "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30"
                )}
              >
                <input
                  type="radio"
                  name="resource-visibility"
                  value="community"
                  checked={visibility === "community"}
                  onChange={() => setVisibility("community")}
                  className="sr-only peer"
                />
                <GlobeIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground peer-checked:text-primary"
                />
                <span className="min-w-0">
                  <span className="block text-body-sm font-semibold text-foreground peer-checked:text-primary">
                    Community
                  </span>
                  <span className="block text-body-sm text-muted-foreground">
                    Share with all students in Community Hub.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          {/* PDF dropzone — §8 file upload */}
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-foreground">Document (PDF)</p>
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
                "Add to Library"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
