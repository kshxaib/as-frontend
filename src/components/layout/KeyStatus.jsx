import { KeyRound } from "lucide-react"

import { useAuthStore } from "@/store/useAuthStore"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { cn } from "@/lib/utils"

/**
 * KeyStatus — DESIGN_SYSTEM.md §13 sidebar footer / task 7.
 * Reads existing auth profile flags only (has_gemini_key, has_groq_key,
 * has_openrouter_key, has_nvidia_key). No invented status, no API calls.
 */
export function KeyStatus({ compact = false, className }) {
  const user = useAuthStore((s) => s.user)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)

  const required = ["has_gemini_key", "has_groq_key", "has_openrouter_key", "has_nvidia_key"]
  const configured = user ? required.filter((k) => !!user[k]).length : 0
  const complete = configured === 4

  return (
    <button
      type="button"
      data-slot="key-status"
      onClick={() => setActiveTab("profile")}
      aria-label={
        complete
          ? "All 4 required API keys configured. Open Profile and Keys."
          : `${configured} of 4 required API keys configured. Open Profile and Keys to finish setup.`
      }
      className={cn(
        "flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors duration-(--motion-fast) ease-standard",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "hover:bg-muted",
        complete
          ? "border-success/25 bg-success/10 text-success"
          : "border-warning/30 bg-warning/10 text-warning",
        className
      )}
    >
      <KeyRound className="size-4 shrink-0" aria-hidden="true" />
      {!compact && (
        <span className="min-w-0 flex-1 truncate font-mono text-meta uppercase">
          {complete ? "Keys ready" : "Setup keys"} {configured}/4
        </span>
      )}
      <span className="sr-only">{configured} of 4</span>
    </button>
  )
}
