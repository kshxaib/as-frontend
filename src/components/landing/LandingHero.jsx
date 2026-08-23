import { motion } from "motion/react"
import { ArrowRightIcon, GlobeIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useReducedMotion } from "@/lib/motion"
import { AcademicPreview } from "./AcademicPreview"
import { HERO_TRUST_ITEMS } from "./landing-meta"

/**
 * LandingHero — editorial two-column hero.
 * The manuscript panel is clearly illustrative static content
 * (labelled as a preview), not live user data.
 */
export function LandingHero({ justLoggedOut }) {
  const openAuthModal = useAuthStore((s) => s.openAuthModal)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.12 : 0.48,
      ease: [0.2, 0, 0, 1],
      delay: reduceMotion ? 0 : delay,
    },
  })

  return (
    <section
      data-slot="landing-hero"
      className="relative border-b border-border"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:pb-24 lg:pt-20">
        <div>
          {justLoggedOut && (
            <motion.p
              role="status"
              {...rise(0)}
              className="mb-8 inline-flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3.5 py-2 text-body-sm text-success"
            >
              You've been signed out successfully. See you next time!
            </motion.p>
          )}

          <motion.p
            {...rise(reduceMotion ? 0 : 0.05)}
            className="font-mono text-meta uppercase tracking-wider text-primary"
          >
            Academic Workspace
          </motion.p>

          <motion.h1
            id="hero-heading"
            {...rise(reduceMotion ? 0 : 0.12)}
            className="mt-3 max-w-[18ch] font-serif text-display-xl text-foreground"
          >
            From study material to solution manuscript.
          </motion.h1>

          <motion.p
            {...rise(reduceMotion ? 0 : 0.2)}
            className="mt-5 max-w-[52ch] text-body-lg leading-relaxed text-muted-foreground"
          >
            AcademicStack organizes your resources, extracts question banks,
            retrieves the relevant study material, generates cited answers, and
            produces a polished academic solution document.
          </motion.p>

          <motion.div
            {...rise(reduceMotion ? 0 : 0.28)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button size="lg" onClick={() => openAuthModal("register")}>
              <SparklesIcon aria-hidden="true" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => openAuthModal("login")}>
              Sign In
              <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setActiveTab("community")}>
              <GlobeIcon aria-hidden="true" className="text-gold" />
              Browse Community
            </Button>
          </motion.div>

          <motion.ul
            {...rise(reduceMotion ? 0 : 0.36)}
            aria-label="Product facts"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5"
          >
            {HERO_TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 font-mono text-meta uppercase tracking-wider text-muted-foreground"
              >
                <span aria-hidden="true" className="size-1 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <AcademicPreview />
      </div>
    </section>
  )
}
