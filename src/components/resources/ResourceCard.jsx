import { motion } from "motion/react"
import {
  CheckCircle2Icon,
  DownloadIcon,
  GlobeIcon,
  Loader2Icon,
  LockIcon,
  MoreHorizontalIcon,
  Share2Icon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatAddedDate } from "./resource-meta"
import { ResourceIndexingOverlay, ResourceStatusBadge } from "./ResourceStatus"

/**
 * ResourceCard — DESIGN_SYSTEM.md §9.1 entity card.
 * Presentation only: all store actions arrive via props.
 */
export function ResourceCard({
  resource,
  isIndexing = false,
  anyIndexing = false,
  isUploading = false,
  onIndex,
  onToggleShare,
  onDownload,
  onDelete,
  className,
}) {
  const { name, subject, chapters, description, visibility, status, created_at } =
    resource

  // Disabled semantics preserved from the original page:
  // index waits for any in-flight indexing job or an upload;
  // share waits for this card's own indexing or an upload.
  const indexDisabled = isIndexing || anyIndexing || isUploading
  const shareDisabled = isIndexing || isUploading

  const metaParts = []
  if (chapters) metaParts.push(`Ch. ${chapters}`)
  const addedLabel = formatAddedDate(created_at)
  if (addedLabel) metaParts.push(`Added ${addedLabel}`)

  return (
    <Card
      data-slot="resource-card"
      className={
        "group relative h-full gap-0 overflow-hidden p-5 transition-[box-shadow,translate,border-color] duration-(--motion-fast) ease-standard hover:-translate-y-0.5 hover:shadow-sm " +
        (isIndexing ? "border-accent/40 shadow-glow-ai" : "") +
        (className ? ` ${className}` : "")
      }
    >
      {/* Header row: subject left · visibility right (§9.1) */}
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="max-w-[60%] truncate">
          {subject}
        </Badge>
        {visibility === "community" ? (
          <Badge variant="gold">
            <GlobeIcon aria-hidden="true" />
            Community
          </Badge>
        ) : (
          <Badge variant="outline">
            <LockIcon aria-hidden="true" />
            Private
          </Badge>
        )}
      </div>

      {/* Title + mono meta voice (§3.1) */}
      <h3 className="mt-3 line-clamp-2 text-title-sm text-card-foreground">{name}</h3>

      {metaParts.length > 0 && (
        <p className="mt-1.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
          {metaParts.join(" · ")}
        </p>
      )}

      {description && (
        <p className="mt-2 line-clamp-2 text-body-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {/* Status zone — StatusBadge grammar, never color alone (§12) */}
      <div className="mt-4 flex min-h-[22px] items-center gap-2">
        <ResourceStatusBadge status={status} isIndexing={isIndexing} />
      </div>

      {/* Footer rule + actions row (§9.1) */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex min-h-[31px] items-center">
          {status === "indexed" && !isIndexing ? (
            <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-success">
              <CheckCircle2Icon aria-hidden="true" className="size-4" />
              Ready for RAG
            </span>
          ) : (
            <Button
              variant="ai"
              size="sm"
              onClick={() => onIndex(resource.id)}
              disabled={indexDisabled}
            >
              {isIndexing ? (
                <>
                  <Loader2Icon aria-hidden="true" className="animate-spin" />
                  Vectorizing…
                </>
              ) : (
                <>
                  <SparklesIcon aria-hidden="true" />
                  {status === "indexing_failed" ? "Retry Index" : "Index with AI"}
                </>
              )}
            </Button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`More actions for ${name}`}
              >
                <MoreHorizontalIcon aria-hidden="true" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuItem onSelect={() => onDownload(resource.id, name)}>
              <DownloadIcon aria-hidden="true" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={shareDisabled}
              onSelect={() => onToggleShare(resource.id)}
            >
              {visibility === "community" ? (
                <LockIcon aria-hidden="true" />
              ) : (
                <Share2Icon aria-hidden="true" />
              )}
              {visibility === "community" ? "Make Private" : "Share with Community"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus-visible:text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
              onSelect={() => onDelete(resource)}
            >
              <Trash2Icon aria-hidden="true" />
              Delete Resource
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Honest card-local AI processing state (§15.2); real flag only */}
      {isIndexing && <ResourceIndexingOverlay />}
    </Card>
  )
}

/** Grid entrance wrapper — Motion stagger item (§16). */
export function ResourceCardMotion({ children, reduceMotion = false, ...props }) {
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
