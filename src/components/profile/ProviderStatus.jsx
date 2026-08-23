import { CheckCircle2Icon, CircleIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"

/**
 * ProviderStatus — safe configuration state only (§8).
 * The backend exposes boolean has_*_key flags; actual key values are
 * never returned, so none can ever be shown here.
 */
export function ProviderStatus({ configured }) {
  return configured ? (
    <StatusBadge tone="success" label="Configured" icon={CheckCircle2Icon} />
  ) : (
    <StatusBadge tone="neutral" label="Not configured" icon={CircleIcon} />
  )
}
