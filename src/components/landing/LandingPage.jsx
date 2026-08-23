import { BookOpenIcon } from "lucide-react"

import { CommunitySection } from "./CommunitySection"
import { FeatureSection } from "./FeatureSection"
import { LandingCTA } from "./LandingCTA"
import { LandingFooter } from "./LandingFooter"
import { LandingHero } from "./LandingHero"
import { WorkflowSection } from "./WorkflowSection"

/**
 * LandingPage — Phase 10 composition ("The Reading Room").
 * Public-facing: explains the real product pipeline and routes guests
 * into the existing auth modal / community flows only.
 */
export function LandingPageComposition({ justLoggedOut }) {
  return (
    <div data-slot="landing-page" className="bg-background text-foreground">
      {/* Slim brand strip (guests see GuestBar above for actions) */}
      <div className="mx-auto flex max-w-[1120px] items-center gap-2.5 px-4 pt-8 sm:px-6">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-serif text-body-base font-semibold text-primary"
        >
          <BookOpenIcon className="size-4" />
        </span>
        <span className="font-serif text-body-base font-semibold tracking-tight text-foreground">
          AcademicStack
        </span>
      </div>

      <LandingHero justLoggedOut={justLoggedOut} />
      <WorkflowSection />
      <FeatureSection />
      <CommunitySection />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
