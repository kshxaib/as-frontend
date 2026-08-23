import { motion } from "motion/react"

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
 * AcademicPreview — illustrative product visualization.
 * A static composition of a solved question in the Reading Room style;
 * content is illustrative only and labelled as such (§6).
 */
export function AcademicPreview() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.figure
      {...rise(reduceMotion, reduceMotion ? 0 : 0.2)}
      className="relative"
      aria-label="Illustrative preview of a solved question"
    >
      {/* Sheet */}
      <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Folio head */}
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <span className="font-mono text-meta font-semibold uppercase tracking-wider text-primary">
            Q01
          </span>
          <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
            5 marks
          </span>
        </div>

        <p className="pt-5 font-serif text-title-lg leading-snug text-foreground">
          State the three axioms of probability for events in a sample space.
        </p>

        <p className="mt-6 font-mono text-meta uppercase tracking-wider text-muted-foreground">
          Answer
        </p>
        <div className="mt-2 space-y-2.5" aria-hidden="true">
          <div className="h-2 w-full rounded-full bg-muted" />
          <div className="h-2 w-[92%] rounded-full bg-muted" />
          <div className="h-2 w-[78%] rounded-full bg-muted" />
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
            Sources
          </p>
          <ol className="mt-2 space-y-1.5 text-body-sm text-muted-foreground">
            <li className="flex gap-2">
              <span aria-hidden="true" className="font-mono tabular-nums text-gold">[1]</span>
              Probability Notes — pg. 42
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="font-mono tabular-nums text-gold">[2]</span>
              Set Theory Textbook — Ch. 3
            </li>
          </ol>
        </div>

        {/* Provenance stamp */}
        <figcaption className="mt-6 inline-flex items-center gap-2 rounded-r-md border-l-2 border-accent/50 bg-accent/5 px-3 py-1.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
          Refined by the academic AI reviewer pass
        </figcaption>
      </div>

      {/* Illustrative label */}
      <motion.span
        initial={false}
        className="absolute -bottom-3 right-4 rounded-full border border-border bg-background px-3 py-1 font-mono text-meta uppercase tracking-wider text-muted-foreground"
      >
        Illustrated example
      </motion.span>

      {/* Shelf rule texture */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-10 hidden h-px w-16 bg-border lg:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-16 hidden h-px w-16 bg-border lg:block"
      />
    </motion.figure>
  )
}
