import { useAuthStore } from "@/store/useAuthStore"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"

/**
 * LandingFooter — quiet editorial footer.
 * The previous "OpenAI Edition" branding (an audit-flagged
 * inconsistency) is removed; links keep the existing flows only.
 */
export function LandingFooter() {
  const openAuthModal = useAuthStore((s) => s.openAuthModal)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)

  return (
    <footer data-slot="landing-footer" className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-serif text-body-base font-semibold text-primary"
          >
            A
          </span>
          <span className="font-serif text-body-base font-semibold tracking-tight text-foreground">
            AcademicStack
          </span>
          <span className="hidden font-mono text-meta uppercase text-muted-foreground sm:inline">
            Academic Workspace
          </span>
        </div>

        <p className="text-center font-mono text-meta uppercase tracking-wider text-muted-foreground">
          Resources · Question Banks · Solutions
        </p>

        <nav aria-label="Footer" className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="rounded-sm text-body-sm text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            className="rounded-sm text-body-sm text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className="rounded-sm text-body-sm text-muted-foreground outline-none transition-colors hover:text-gold focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            Community
          </button>
        </nav>
      </div>
    </footer>
  )
}
