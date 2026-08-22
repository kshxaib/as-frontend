/**
 * Non-component metadata for the resources feature.
 * Kept out of JSX files so they stay fast-refresh friendly
 * and presentation-only.
 */

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

/** Client-side sort options operating on real backend fields. */
export const RESOURCE_SORT_OPTIONS = [
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

export function formatAddedDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

/**
 * Maps ONLY real states to the StatusBadge grammar (DESIGN_SYSTEM.md §2.3):
 * backend `status` ("uploaded" | "indexed", plus store-local
 * "indexing_failed") and the live per-id indexing flag.
 * `icon` is a symbolic key resolved to a Lucide component in ResourceStatus.jsx.
 */
export function getResourceStatus({ status, isIndexing }) {
  if (isIndexing) {
    return { tone: "info", label: "Vectorizing", dot: true, pulse: true }
  }
  if (status === "indexed") {
    return { tone: "success", label: "Indexed · RAG-ready", iconKey: "database" }
  }
  if (status === "indexing_failed") {
    return { tone: "destructive", label: "Indexing Failed", iconKey: "alert" }
  }
  return { tone: "neutral", label: "Uploaded · Unindexed", iconKey: "file" }
}
