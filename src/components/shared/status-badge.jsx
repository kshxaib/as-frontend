import { cn } from "@/lib/utils"

/**
 * StatusBadge — DESIGN_SYSTEM.md §12.
 * Generic status grammar: dot / pulse / icon + label, semantic tones only.
 * Not connected to any application state — callers pass tone + label.
 */
const TONES = {
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/25 bg-primary/10 text-primary",
  info: "border-info/25 bg-info/10 text-info",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/25 bg-destructive/10 text-destructive",
  accent: "border-accent/30 bg-accent/10 text-accent",
  gold: "border-gold/30 bg-gold/15 text-gold",
}

export function StatusBadge({
  tone = "neutral",
  label,
  icon: Icon,
  dot = false,
  pulse = false,
  className,
  ...props
}) {
  return (
    <span
      data-slot="status-badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none tracking-wide transition-colors [&_svg]:size-3 [&_svg]:shrink-0",
        TONES[tone] ?? TONES.neutral,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "relative flex size-1.5 rounded-full bg-current",
            pulse && "animate-pulse"
          )}
        />
      )}
      {Icon && <Icon aria-hidden="true" />}
      <span>{label}</span>
    </span>
  )
}

/**
 * CountChip — mono metadata chip for counts/ids (§12 grammar #3).
 */
export function CountChip({ label, value, className, ...props }) {
  return (
    <span
      data-slot="count-chip"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-meta text-muted-foreground",
        className
      )}
      {...props}
    >
      {label && <span>{label}</span>}
      <span className="font-bold text-foreground tabular-nums">{value}</span>
    </span>
  )
}
