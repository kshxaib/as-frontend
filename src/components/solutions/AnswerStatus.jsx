import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { getAnswerStatus } from "./solutions-meta"

const STATUS_ICONS = {
  check: CheckCircle2Icon,
  alert: AlertCircleIcon,
}

/**
 * Answer status badge — only real backend statuses
 * ("pending" | "generating" | "completed" | "failed"); icon + text +
 * tone, never color alone (§12).
 */
export function AnswerStatusBadge({ status, className, ...props }) {
  const config = getAnswerStatus(status)
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
