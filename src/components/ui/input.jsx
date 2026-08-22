import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Input — DESIGN_SYSTEM.md §8.
 * Visible labels live in the caller; this is the field surface only.
 */
function Input({ className, type = "text", ...props }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-body-base text-foreground shadow-xs transition-all duration-(--motion-fast) ease-standard outline-none",
        "placeholder:text-muted-foreground selection:bg-primary/20 selection:text-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
