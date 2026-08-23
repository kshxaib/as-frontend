import { motion } from "motion/react"

import { useReducedMotion } from "@/lib/motion"
import { WORKFLOW_STEPS } from "./landing-meta"

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
 * WorkflowSection — the real five-stage pipeline (§7).
 * Stage numbering uses JetBrains Mono; copy states only what exists.
 */
export function WorkflowSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      data-slot="landing-workflow"
      aria-labelledby="workflow-heading"
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:py-20">
        <motion.div {...rise(reduceMotion, 0)}>
          <p className="font-mono text-meta uppercase tracking-wider text-primary">
            The Workflow
          </p>
          <h2
            id="workflow-heading"
            className="mt-2 max-w-[24ch] font-serif text-display-lg text-foreground"
          >
            One pipeline, five stages.
          </h2>
        </motion.div>

        <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0">
          {WORKFLOW_STEPS.map((stage, index) => (
            <motion.li
              key={stage.step}
              {...rise(reduceMotion, reduceMotion ? 0 : 0.08 * index)}
              className="relative border-t border-border pt-4"
            >
              <span
                aria-hidden="true"
                className="font-mono text-body-lg font-semibold tabular-nums text-primary"
              >
                {stage.step}
              </span>
              <h3 className="mt-2 font-serif text-title-sm text-foreground">
                {stage.title}
              </h3>
              <p className="mt-1.5 max-w-[34ch] text-body-sm leading-relaxed text-muted-foreground">
                {stage.description}
              </p>

              {/* Connector — desktop only */}
              {index < WORKFLOW_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-[26px] hidden h-px w-6 bg-border lg:block"
                />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
