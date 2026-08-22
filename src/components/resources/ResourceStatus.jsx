import { AlertCircleIcon, DatabaseIcon, FileTextIcon, Loader2Icon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { getResourceStatus } from "./resource-meta"
import { cn } from "@/lib/utils"

const STATUS_ICONS = {
  database: DatabaseIcon,
  alert: AlertCircleIcon,
  file: FileTextIcon,
}

export function ResourceStatusBadge({ status, isIndexing, className, ...props }) {
  const config = getResourceStatus({ status, isIndexing })
  return (
    <StatusBadge
      tone={config.tone}
      label={config.label}
      icon={config.iconKey ? STATUS_ICONS[config.iconKey] : undefined}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
      {...props}
    />
  )
}

/**
 * Card-local indexing overlay — DESIGN_SYSTEM.md §15.2.
 * Indeterminate by design: the API exposes no step/progress data,
 * so nothing fake is animated. Rendered only while
 * `isIndexingResource[resource.id]` is true.
 */
export function ResourceIndexingOverlay({ className }) {
  return (
    <div
      data-slot="resource-indexing-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "animate-in fade-in absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/85 p-4 backdrop-blur-[2px] duration-150",
        className
      )}
    >
      <div className="flex max-w-[26ch] flex-col items-center gap-2 rounded-lg border border-accent/30 bg-card px-6 py-5 text-center shadow-glow-ai">
        <Loader2Icon aria-hidden="true" className="size-5 animate-spin text-accent" />
        <p className="font-serif text-title-sm text-foreground">Vectorizing document</p>
        <p className="text-body-sm text-muted-foreground">
          Chunking text & computing Gemini embeddings for Qdrant.
        </p>
      </div>
    </div>
  )
}
