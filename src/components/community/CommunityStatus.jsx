import { DatabaseIcon, FileTextIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { getCommunityResourceStatus } from "./community-meta"
const STATUS_ICONS = {
  database: DatabaseIcon,
  file: FileTextIcon,
}

/**
 * Community resource indexing status — real `status` values from the
 * community payload only; icon + text + tone, never color alone (§12).
 */
export function CommunityResourceStatusBadge({ status, className, ...props }) {
  const config = getCommunityResourceStatus(status)
  return (
    <StatusBadge
      tone={config.tone}
      label={config.label}
      icon={STATUS_ICONS[config.iconKey]}
      className={className}
      {...props}
    />
  )
}
