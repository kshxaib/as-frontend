import { motion } from "motion/react"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useReducedMotion } from "@/lib/motion"

/**
 * LandingCTA — closing call-to-action band (existing auth flow only).
 */
export function LandingCTA() {
  const openAuthModal = useAuthStore((s) => s.openAuthModal)
  const reduceMotion = useReducedMotion()

  return (
    <section data-slot="landing-cta" aria-labelledby="cta-heading" className="border-b border-border">
      <div className="mx-auto max-w-[1120px] px-4 py-16 text-center sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: reduceMotion ? 0.12 : 0.48,
            ease: [0.2, 0, 0, 1],
          }}
          className="mx-auto flex max-w-[40ch] flex-col items-center"
        >
          <h2 id="cta-heading" className="font-serif text-display-lg text-foreground">
            Open your Reading Room.
          </h2>
          <p className="mt-3 text-body-base leading-relaxed text-muted-foreground">
            Create a free account to index resources, extract question banks, and
            generate your first solution manuscript.
          </p>
          <Button size="lg" className="mt-6" onClick={() => openAuthModal("register")}>
            Get Started Free
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
