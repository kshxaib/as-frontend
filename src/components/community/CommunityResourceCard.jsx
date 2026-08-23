import { motion } from "motion/react"
import { CalendarIcon, DownloadIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatSharedDate } from "./community-meta"
import { CommunityResourceStatusBadge } from "./CommunityStatus"

/**
 * CommunityResourceCard — shared study material.
 * Shows ONLY real payload fields; uploader_name is the API's real
 * identity field (with its own "Anonymous Scholar" fallback).
 */
export function CommunityResourceCard({ resource, onDownload }) {
  const { name, subject, chapters, description, status, uploader_name, created_at } =
    resource

  const addedLabel = formatSharedDate(created_at)

  return (
    <Card
      data-slot="community-resource-card"
      className="h-full gap-0 p-5 transition-[box-shadow,translate,border-color] duration-(--motion-fast) ease-standard hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="max-w-[55%] truncate">
          {subject}
        </Badge>
        <CommunityResourceStatusBadge status={status} />
      </div>

      <h3 className="mt-3 line-clamp-2 text-title-sm text-card-foreground">{name}</h3>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        {chapters && <span>Ch. {chapters}</span>}
        {addedLabel && (
          <span className="inline-flex items-center gap-1 normal-case tracking-normal">
            <CalendarIcon aria-hidden="true" className="size-3" />
            {addedLabel}
          </span>
        )}
      </p>

      {description && (
        <p className="mt-2 line-clamp-2 text-body-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-4 flex min-h-[22px] items-center gap-1.5 text-body-sm text-muted-foreground">
        <UserIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">Shared by {uploader_name}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-body-sm font-medium text-muted-foreground">Study material</span>
        <Button size="sm" onClick={() => onDownload(resource.id, resource.name)}>
          <DownloadIcon aria-hidden="true" />
          Download PDF
        </Button>
      </div>
    </Card>
  )
}

/** Grid entrance wrapper — Motion stagger item (§16). */
export function CommunityCardMotion({ children, reduceMotion = false, ...props }) {
  return (
    <motion.div
      layout={!reduceMotion}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
      }
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
