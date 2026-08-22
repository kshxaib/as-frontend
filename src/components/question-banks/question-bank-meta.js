/**
 * Non-component metadata for the question-banks feature.
 * Kept out of JSX files so they stay fast-refresh friendly
 * and presentation-only.
 *
 * Real backend states (app/question_banks/service.py):
 *   "uploaded" → "extracting" → "extracted" | "extraction_failed"
 * (a persisted "extracting" can also exist after an interrupted job).
 */

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export function formatAddedDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

/**
 * Maps ONLY real states to the StatusBadge grammar (DESIGN_SYSTEM.md §2.3).
 * `icon` is a symbolic key resolved to a Lucide component in QuestionBankStatus.jsx.
 */
export function getQuestionBankStatus({ status, isExtracting }) {
  if (isExtracting || status === "extracting") {
    // §2.3: QB extracting = Manuscript Amber, spark/pulse treatment
    return { tone: "accent", label: "Extracting", dot: true, pulse: true }
  }
  if (status === "extracted") {
    return { tone: "success", label: "Extracted", iconKey: "check" }
  }
  if (status === "extraction_failed") {
    return { tone: "destructive", label: "Extraction Failed", iconKey: "alert" }
  }
  return { tone: "neutral", label: "Uploaded · Ready to Extract", iconKey: "file" }
}

/** Mirrors the backend's resource_ids parsing (answers/service.py). */
export function parseResourceIds(resourceIdsString) {
  if (!resourceIdsString) return []
  return resourceIdsString
    .split(",")
    .map((part) => part.trim())
    .filter((part) => /^\d+$/.test(part))
    .map(Number)
}

/** Client-side sort options operating on real backend fields. */
export const QUESTION_BANK_SORT_OPTIONS = [
  {
    id: "newest",
    label: "Newest first",
    compare: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  },
  {
    id: "oldest",
    label: "Oldest first",
    compare: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    id: "title",
    label: "Title A–Z",
    compare: (a, b) => a.name.localeCompare(b.name),
  },
]
