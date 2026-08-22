import { motion } from "motion/react"
import {
  ArrowRightIcon,
  BookOpenIcon,
  DatabaseIcon,
  DownloadIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatAddedDate,
  parseResourceIds,
} from "./question-bank-meta"
import {
  QuestionBankExtractionOverlay,
  QuestionBankStatusBadge,
} from "./QuestionBankStatus"

/**
 * QuestionBankCard — DESIGN_SYSTEM.md §9.1 entity card.
 * Presentation only: store actions arrive via props.
 *
 * Real data shown: name, subject, status, created_at, and the linked
 * resource relationship resolved against the user's already-loaded
 * resources (never fabricated). Question counts/marks are NOT available
 * on the bank list payload, so they are intentionally not displayed.
 */
export function QuestionBankCard({
  questionBank,
  isExtracting = false,
  isUploading = false,
  resourcesById,
  onExtract,
  onDownload,
  onReview,
  className,
}) {
  const { name, subject, status, created_at, resource_ids } = questionBank

  // Disabled semantics preserved from the original page.
  const extractDisabled = isExtracting || isUploading

  const addedLabel = formatAddedDate(created_at)

  // Resolve the comma-separated resource_ids string against loaded resources.
  const linkedIds = parseResourceIds(resource_ids)
  const resolved = linkedIds
    .map((id) => resourcesById.get(id))
    .filter(Boolean)
  const orphanIds = linkedIds.filter((id) => !resourcesById.has(id))
  const visibleResources = resolved.slice(0, 2)
  const remainingCount = resolved.length - visibleResources.length

  return (
    <Card
      data-slot="question-bank-card"
      className={
        "relative h-full gap-0 overflow-hidden p-5 transition-[box-shadow,translate,border-color] duration-(--motion-fast) ease-standard hover:-translate-y-0.5 hover:shadow-sm" +
        (isExtracting ? " border-accent/40 shadow-glow-ai" : "") +
        (className ? ` ${className}` : "")
      }
    >
      {/* Header row: subject left · extraction status right (§9.1) */}
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="max-w-[55%] truncate">
          {subject}
        </Badge>
        <QuestionBankStatusBadge status={status} isExtracting={isExtracting} />
      </div>

      {/* Title — serif voice sanctioned for QB names (§9.1) */}
      <h3 className="mt-3 line-clamp-2 font-serif text-title-sm text-card-foreground">
        {name}
      </h3>

      {addedLabel && (
        <p className="mt-1.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
          Added {addedLabel}
        </p>
      )}

      {/* Linked-resources relationship — real data only */}
      <div className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <p className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
          RAG Sources{resolved.length > 0 ? ` · ${resolved.length}` : ""}
        </p>

        {visibleResources.length > 0 || orphanIds.length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {visibleResources.map((resource) => (
              <li key={resource.id}>
                <span
                  title={resource.name}
                  className="inline-flex max-w-full items-center gap-1 rounded-sm border border-border bg-card px-2 py-0.5 text-body-sm text-foreground"
                >
                  <BookOpenIcon aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
                  <span className="max-w-[11rem] truncate">{resource.name}</span>
                  {resource.status === "indexed" && (
                    <DatabaseIcon
                      aria-hidden="true"
                      className="size-3 shrink-0 text-success"
                    />
                  )}
                </span>
              </li>
            ))}

            {orphanIds.map((id) => (
              <li key={`orphan-${id}`}>
                <span className="inline-flex items-center rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-meta tabular-nums text-muted-foreground">
                  #{id}
                </span>
              </li>
            ))}

            {remainingCount > 0 && (
              <li className="font-mono text-meta tabular-nums text-muted-foreground">
                +{remainingCount}
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-1 text-body-sm text-muted-foreground">
            No linked study materials.
          </p>
        )}
      </div>

      {/* Footer rule + actions row (§9.1) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3 border-t border-border pt-4">
        <Button
          variant="ai"
          size="sm"
          onClick={() => onExtract(questionBank)}
          disabled={extractDisabled}
        >
          {isExtracting ? (
            <>
              <Loader2Icon aria-hidden="true" className="animate-spin" />
              Extracting…
            </>
          ) : (
            <>
              <SparklesIcon aria-hidden="true" />
              {status === "extracted" ? "Re-extract" : "Extract Questions"}
            </>
          )}
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="link" size="sm" onClick={() => onReview(questionBank.id)}>
            Review &amp; Solve
            <ArrowRightIcon aria-hidden="true" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={`More actions for ${name}`}>
                  <MoreHorizontalIcon aria-hidden="true" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" sideOffset={6}>
              <DropdownMenuItem
                onSelect={() => onDownload(questionBank.id, name)}
              >
                <DownloadIcon aria-hidden="true" />
                Download Original Paper
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Honest card-local AI processing state (§15.2); live flag only */}
      {isExtracting && <QuestionBankExtractionOverlay />}
    </Card>
  )
}

/** Grid entrance wrapper — Motion stagger item (§16). */
export function QuestionBankCardMotion({ children, reduceMotion = false, ...props }) {
  return (
    <motion.div
      layout={!reduceMotion}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }
      }
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
