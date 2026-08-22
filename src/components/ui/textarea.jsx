import { cn } from "@/lib/utils"

/**
 * Textarea — DESIGN_SYSTEM.md §8.
 * Styled native textarea (shadcn convention; Base UI ships no textarea part).
 */
function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full field-sizing-content rounded-md border border-input bg-card px-3 py-2 text-body-base text-foreground shadow-xs transition-all duration-(--motion-fast) ease-standard outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
