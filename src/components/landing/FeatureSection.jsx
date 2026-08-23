import { motion } from "motion/react"
import {
  BookOpenIcon,
  FileCheck2Icon,
  FileStackIcon,
  GlobeIcon,
  LayersIcon,
  SparklesIcon,
} from "lucide-react"

import { useReducedMotion } from "@/lib/motion"
import { FEATURES } from "./landing-meta"

const ICONS = {
  book: BookOpenIcon,
  fileStack: FileStackIcon,
  layers: LayersIcon,
  sparkles: SparklesIcon,
  globe: GlobeIcon,
  fileCheck: FileCheck2Icon,
}

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
 * FeatureSection — actual product capabilities only (§8).
 * Calm icon chips; no per-feature rainbow coloring.
 */
export function FeatureSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      data-slot="landing-features"
      aria-labelledby="features-heading"
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:py-20">
        <motion.div {...rise(reduceMotion, 0)}>
          <p className="font-mono text-meta uppercase tracking-wider text-primary">
            Capabilities
          </p>
          <h2
            id="features-heading"
            className="mt-2 max-w-[26ch] font-serif text-display-lg text-foreground"
          >
            Built around how studying actually works.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.iconKey]
            return (
              <motion.article
                key={feature.title}
                {...rise(reduceMotion, reduceMotion ? 0 : 0.06 * (index % 3))}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-[box-shadow,border-color] duration-(--motion-fast) ease-standard hover:border-ring/40 hover:shadow-xs"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="font-serif text-title-sm text-foreground">
                  {feature.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
