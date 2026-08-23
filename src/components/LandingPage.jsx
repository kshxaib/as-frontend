import { LandingPageComposition } from "./landing";

/**
 * LandingPage — Phase 10 entry point.
 * The public experience now lives in `components/landing/*`
 * ("The Reading Room" editorial landing).
 * Guest affordances (auth modal, community tab) are unchanged.
 */
export const LandingPage = ({ justLoggedOut }) => (
  <LandingPageComposition justLoggedOut={justLoggedOut} />
);

export default LandingPage;
