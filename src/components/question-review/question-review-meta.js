/**
 * Non-component metadata for the question-review feature.
 * Kept out of JSX files so they stay fast-refresh friendly
 * and presentation-only.
 *
 * Real backend values (questions/schemas.py + question_banks/service.py):
 *   marks_source ∈ "explicit" | "ai_estimated" | "user_modified"
 * The backend never exposes a per-question review/approval state, so
 * none is invented here. Changing marks server-side flips the source
 * to "user_modified" automatically.
 */

export const MARK_PRESETS = [2, 5, 10]

/** Marks-source presentation map — DESIGN_SYSTEM.md §2.3 / §12. */
export const MARKS_SOURCE_CONFIG = {
  explicit: { tone: "success", label: "Explicit · Paper", iconKey: "file" },
  ai_estimated: { tone: "warning", label: "AI Estimated", iconKey: "wand" },
  user_modified: { tone: "info", label: "User Verified", iconKey: "userCheck" },
}

/** Unknown sources fall back to the same treatment as the original page. */
export function getMarksSourceConfig(source) {
  return MARKS_SOURCE_CONFIG[source] ?? MARKS_SOURCE_CONFIG.user_modified
}

export const MARK_FILTER_VALUES = ["ALL", 2, 5, 10]

export const SOURCE_FILTER_OPTIONS = [
  { value: "ALL", label: "All Sources" },
  { value: "explicit", label: "Explicit" },
  { value: "ai_estimated", label: "AI Estimated" },
  { value: "user_modified", label: "User Verified" },
]
