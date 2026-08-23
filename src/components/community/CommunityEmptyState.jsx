import { BookOpenIcon, FileCheck2Icon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * CommunityEmptyState — DESIGN_SYSTEM.md §14.
 * Variants: resources-empty · solved-empty · no-match.
 * Original microcopy preserved ("Be the first to share your notes…",
 * "Generate solutions … publish here").
 */
export function CommunityEmptyState({
  variant = "resources", // 'resources' | 'solved_sets' | 'no-match'
  onClearFilters,
  className,
}) {
  if (variant === "no-match") {
    return (
      <div
        data-slot="community-empty-no-match"
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
          Nothing matches in the commons
        </h3>
        <p className="mt-1.5 max-w-sm text-body-base text-muted-foreground">
          Try different keywords or another subject — or clear the filters to browse
          the full collection.
        </p>
        {onClearFilters && (
          <Button variant="ghost" size="sm" className="mt-5" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  const isResources = variant === "resources"

  return (
    <div
      data-slot={isResources ? "community-empty-resources" : "community-empty-solved"}
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={
          isResources
            ? "flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
            : "flex size-14 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold"
        }
      >
        {isResources ? (
          <BookOpenIcon className="size-7" />
        ) : (
          <FileCheck2Icon className="size-7" />
        )}
      </span>

      <h2 className="mt-5 font-serif text-display-lg text-foreground">
        {isResources ? "No Community Resources Yet" : "No Solved Papers Shared Yet"}
      </h2>
      <p className="mt-2 max-w-[48ch] text-body-base leading-relaxed text-muted-foreground">
        {isResources
          ? "Be the first to share your notes with the student community from the Study Resources tab!"
          : 'Generate solutions for your question bank and click "Share with Community" to publish here.'}
      </p>

      <p className="mt-6 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        Shared by students · Open to everyone
      </p>
    </div>
  )
}
