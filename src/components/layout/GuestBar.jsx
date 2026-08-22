import { GlobeIcon } from "lucide-react"

import { useAuthStore } from "@/store/useAuthStore"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { Button } from "@/components/ui/button"

/**
 * GuestBar — slim guest variant of the shell bar.
 * Preserves the old navbar's guest affordances exactly:
 * Browse Community, Sign In, Get Started (opens existing AuthModal).
 */
export function GuestBar() {
  const openAuthModal = useAuthStore((s) => s.openAuthModal)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)

  return (
    <header
      data-slot="guest-bar"
      className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6 lg:px-8"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-serif text-body-base font-semibold text-primary"
        >
          A
        </span>
        <span className="truncate font-serif text-body-base font-semibold tracking-tight">
          AcademicStack
        </span>
        <span className="hidden font-mono text-meta uppercase text-muted-foreground sm:inline">
          AI Study Engine
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("community")}
        >
          <GlobeIcon aria-hidden="true" />
          Community
        </Button>
        <Button variant="outline" size="sm" onClick={() => openAuthModal("login")}>
          Sign In
        </Button>
        <Button variant="primary" size="sm" onClick={() => openAuthModal("register")}>
          Get Started
        </Button>
      </div>
    </header>
  )
}
