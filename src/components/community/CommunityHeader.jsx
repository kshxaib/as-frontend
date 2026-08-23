import { GlobeIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CountChip } from "@/components/shared/status-badge"

/**
 * CommunityHeader — editorial commons header (§5).
 * Figures shown are real array lengths only; no community-size claims.
 */
export function CommunityHeader({
  resourcesCount,
  solvedSetsCount,
  isLoading,
  onRefresh,
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-gold">
          <GlobeIcon aria-hidden="true" className="size-3.5" />
          The Commons · Shared Academic Resources
        </p>
        <h1 className="mt-2 font-serif text-title-xl text-foreground">
          Shared Academic Knowledge &amp; Solved Papers
        </h1>
        <p className="mt-2 max-w-2xl text-body-base leading-relaxed text-muted-foreground">
          Open to all students. Browse and download textbooks, verified notes, and
          AI-reviewed solved question banks.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CountChip label="Study materials" value={resourcesCount} />
          <CountChip label="Solved papers" value={solvedSetsCount} />
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
        className="w-full shrink-0 sm:w-auto"
      >
        <RefreshCwIcon
          aria-hidden="true"
          className={isLoading ? "animate-spin" : undefined}
        />
        Refresh Hub
      </Button>
    </header>
  )
}
