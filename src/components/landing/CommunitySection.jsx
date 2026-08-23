import { motion } from "motion/react"
import { GlobeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useReducedMotion } from "@/lib/motion"

const rise = (reduceMotion, delay) => ({
  initial: { opacity: 0, y: reduceMotion ? 0 : 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: {
    duration: reduceMotion ? 0.12 : 0.48,
    ease: [0.2, 0, 0, 1],
    delay: reduceMotion ? 0 : delay,
  },
})

/**
 * CommunitySection — "The Commons" (§10).
 * Explanatory copy only; no community-size or engagement metrics exist
 * in the public API, so none are claimed.
 */
export function CommunitySection() {
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)
  const reduceMotion = useReducedMotion()

  return (
    <section
      data-slot="landing-community"
      aria-labelledby="community-heading"
      className="border-b border-border bg-muted/40"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <motion.div {...rise(reduceMotion, 0)} className="max-w-[56ch]">
          <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-gold">
            <GlobeIcon aria-hidden="true" className="size-3.5" />
            The Commons
          </p>
          <h2
            id="community-heading"
            className="mt-2 font-serif text-display-lg text-foreground"
          >
            A shared study archive.
          </h2>
          <p className="mt-3 max-w-[54ch] text-body-base leading-relaxed text-muted-foreground">
            AcademicStack users can share their notes, textbooks, and solved question
            banks with the community — openly browsable and downloadable by every
            student, signed in or not.
          </p>
        </motion.div>

        <motion.div {...rise(reduceMotion, 0.08)}>
          <Button variant="outline" size="lg" onClick={() => setActiveTab("community")}>
            Browse the Commons
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
