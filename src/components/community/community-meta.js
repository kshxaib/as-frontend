/**
 * Non-component metadata for the community feature.
 * Kept out of JSX files so they stay fast-refresh friendly.
 *
 * Real backend fields (app/community/routes.py):
 *   resources:    { id, user_id, uploader_name, name, subject, chapters?,
 *                   description?, cloudinary_url, status, visibility, created_at }
 *   answer_sets:  { id, question_bank_id, question_bank_name, subject, user_id,
 *                   author_name, total_questions, completed_questions,
 *                   visibility, created_at }
 * Server orders both feeds newest-first. No pagination, no engagement
 * metrics — none are invented here. Solved-set items carry NO status
 * field, so no status badge is shown for them.
 */

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export function formatSharedDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

export const COMMUNITY_SORT_OPTIONS = [
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
    // Resources sort by `name`; solved sets by their question bank name.
    id: "title",
    label: "Title A–Z",
    titleOf: (item) => item.name ?? item.question_bank_name ?? "",
    compare: (a, b) =>
      String(a.name ?? a.question_bank_name ?? "").localeCompare(
        String(b.name ?? b.question_bank_name ?? "")
      ),
  },
]

/**
 * Resource indexing status — real `status` values from the community
 * resources payload ("uploaded" | "indexed"). Solved sets have no such
 * field and intentionally get no badge.
 */
export function getCommunityResourceStatus(status) {
  if (status === "indexed") {
    return { tone: "success", label: "Indexed · RAG-ready", iconKey: "database" }
  }
  return { tone: "neutral", label: "Uploaded", iconKey: "file" }
}
