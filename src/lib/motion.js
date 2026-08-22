import { useReducedMotion } from "motion/react"

/**
 * Motion foundation — DESIGN_SYSTEM.md §16.
 * Token mirrors of the CSS custom properties in index.css so JS-driven
 * (Motion) animations and CSS transitions stay in sync.
 */

export const DURATIONS = {
  instant: 0.1,
  fast: 0.15,
  base: 0.22,
  slow: 0.32,
  deliberate: 0.48,
}

export const EASINGS = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
}

export const SPRING = { type: "spring", stiffness: 400, damping: 40 }

/** Standard enter: fade + 8px rise. Honors reduced motion by skipping transforms. */
export function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATIONS.base,
      ease: EASINGS.standard,
      delay,
    },
  }
}

/** Staggered children container (cap total choreography at ~350ms). */
export function staggerContainer(stagger = 0.035, childCount = 8) {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: Math.min(stagger, 0.35 / Math.max(1, childCount)),
      },
    },
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.base, ease: EASINGS.standard },
  },
}

export { useReducedMotion }
