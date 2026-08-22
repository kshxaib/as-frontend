import { motion } from "motion/react"

import { DURATIONS, EASINGS, useReducedMotion } from "@/lib/motion"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { MobileNavigation } from "./MobileNavigation"

/**
 * AppShell — tasks 1/10/12.
 * Fixed sidebar + TopBar + content region with responsive offsets,
 * max width and page padding. Existing pages render unchanged inside.
 */
export function AppShell({ children, navigationOpen, onNavigationOpenChange }) {
  return (
    <>
      <Sidebar />

      <MobileNavigation open={navigationOpen} onOpenChange={onNavigationOpenChange} />

      <div className="flex min-h-screen flex-col md:pl-[72px] lg:pl-[264px]">
        <TopBar onOpenNavigation={() => onNavigationOpenChange(true)} />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </>
  )
}

/** Restrained tab-change entrance (task 12); reduced motion → opacity only. */
export function ShellContent({ tabKey, children }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATIONS.base, ease: EASINGS.standard }}
    >
      {children}
    </motion.div>
  )
}
