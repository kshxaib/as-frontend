import { BookOpenIcon } from "lucide-react"

import { formatSourceMeta } from "./solutions-meta"
import { cn } from "@/lib/utils"

/**
 * SourceList — numbered RAG citations (§9.3).
 * Renders ONLY the fields the API provides (resource_name, page,
 * chapter); gold = scholarly provenance, never decoration.
 */
export function SourceList({ sources, className }) {
  if (!sources || sources.length === 0) return null

  return (
    <section
      data-slot="source-list"
      aria-label="Verified study material sources"
      className={cn("mt-6 border-t border-border pt-4", className)}
    >
      <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        <BookOpenIcon aria-hidden="true" className="size-3.5 text-gold" />
        Verified Study Material Sources ({sources.length})
      </p>

      <ol className="mt-3 flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <li key={index}>
            <div className="flex items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1.5">
              <span
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-gold/25 font-mono text-meta font-bold tabular-nums text-gold-foreground"
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block max-w-[16rem] truncate text-body-sm font-medium text-foreground">
                  {source.resource_name}
                </span>
                <span className="block font-mono text-meta tabular-nums text-muted-foreground">
                  {formatSourceMeta(source)}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
