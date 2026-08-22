import { LibraryBigIcon, PlusIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ResourceEmptyState — DESIGN_SYSTEM.md §14.
 * Two variants: first-run library and no-search-results.
 * Original microcopy preserved ("No Study Resources Found",
 * "Upload your textbooks…", "Upload First Resource").
 */
export function ResourceEmptyState({
  variant = "library", // 'library' | 'no-results'
  searchQuery = "",
  onAddResource,
  onClearFilters,
  className,
}) {
  if (variant === "no-results") {
    return (
      <div
        data-slot="resource-empty-no-results"
        className={cn(
          "flex flex-col items-center rounded-xl border border-border bg-card px-6 py-14 text-center",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground"
        >
          <SearchXIcon className="size-5" />
        </span>
        <h3 className="mt-4 font-serif text-title-lg text-foreground">
          No matches for “{searchQuery.trim()}”
        </h3>
        <p className="mt-1.5 max-w-sm text-body-base text-muted-foreground">
          Try a different title, subject, or chapter — or clear the filters to see
          your whole shelf again.
        </p>
        {onClearFilters && (
          <Button variant="ghost" size="sm" className="mt-5" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="resource-empty-library"
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-20",
        className
      )}
    >
      {/* Faint shelf rule texture — static decoration (§16 ambient budget respected) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-10 hidden border-t border-border/70 sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-16 hidden border-t border-border/50 sm:block"
      />

      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
      >
        <LibraryBigIcon className="size-7" />
      </span>

      <h2 className="mt-5 font-serif text-display-lg text-foreground">
        No Study Resources Found
      </h2>
      <p className="mt-2 max-w-[44ch] text-body-base leading-relaxed text-muted-foreground">
        Upload your textbooks, lecture notes, or syllabus PDFs to create searchable
        vector knowledge.
      </p>

      {onAddResource && (
        <Button size="lg" className="mt-6" onClick={onAddResource}>
          <PlusIcon aria-hidden="true" />
          Upload First Resource
        </Button>
      )}

      <p className="mt-6 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        PDF · Cloudinary · Qdrant vector store
      </p>
    </div>
  )
}
