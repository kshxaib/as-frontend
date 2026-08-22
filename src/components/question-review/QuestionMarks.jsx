import { FileTextIcon, UserCheckIcon, Wand2Icon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { getMarksSourceConfig } from "./question-review-meta"
import { cn } from "@/lib/utils"

const SOURCE_ICONS = {
  file: FileTextIcon,
  wand: Wand2Icon,
  userCheck: UserCheckIcon,
}

/** Marks-source badge — icon + text + tone, never color alone (§12). */
export function MarksSourceBadge({ source, className, ...props }) {
  const config = getMarksSourceConfig(source)
  return (
    <StatusBadge
      tone={config.tone}
      label={config.label}
      icon={SOURCE_ICONS[config.iconKey]}
      className={className}
      {...props}
    />
  )
}

/**
 * Assigned-marks figure — JetBrains Mono numerals (§3.1),
 * prominent but not oversized (§ task 7).
 */
export function AssignedMarksBlock({ marks, className, ...props }) {
  return (
    <div
      data-slot="assigned-marks"
      className={cn(
        "flex flex-col items-end gap-0.5 rounded-md border border-border bg-muted/40 px-3 py-1.5",
        className
      )}
      {...props}
    >
      <span className="font-mono text-body-lg font-semibold tabular-nums leading-none text-foreground">
        {marks}
        <span className="ml-1 text-meta font-medium uppercase tracking-wider text-muted-foreground">
          marks
        </span>
      </span>
      <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
        Assigned
      </span>
    </div>
  )
}
