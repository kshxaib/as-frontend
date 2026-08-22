import { motion } from "motion/react"
import { useReducedMotion } from "motion/react"

import { NAV_GROUPS } from "./nav-config"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { cn } from "@/lib/utils"

/**
 * SidebarNav — DESIGN_SYSTEM.md §13 + task 4.
 * Motion `layoutId` indicator slides between items; disabled under
 * reduced motion. Rail mode swaps labels for tooltips.
 */
export function SidebarNav({ showLabels = true, onNavigate }) {
  const activeTab = useQuestionBankStore((s) => s.activeTab)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)
  const currentAnswerSet = useQuestionBankStore((s) => s.currentAnswerSet)
  const reduceMotion = useReducedMotion()

  const handleSelect = (tabId) => {
    setActiveTab(tabId)
    onNavigate?.(tabId)
  }

  return (
    <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          {showLabels && (
            <p
              id={`nav-group-${group.id}`}
              className="px-3 pb-1 font-mono text-meta uppercase text-muted-foreground"
            >
              {group.label}
            </p>
          )}
          {!showLabels && <span className="sr-only">{group.label}</span>}
          <ul role="list" aria-labelledby={showLabels ? `nav-group-${group.id}` : undefined}>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              const badge =
                item.id === "solutions" && currentAnswerSet?.completed_questions > 0
                  ? currentAnswerSet.completed_questions
                  : null

              const itemButton = (
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 w-full items-center gap-3 rounded-md px-3 text-body-sm font-medium outline-none transition-colors duration-(--motion-fast) ease-standard",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/30",
                    showLabels ? "justify-start" : "justify-center px-0",
                    isActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      layoutId="stacks-active-indicator"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 500, damping: 40 }
                      }
                      className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
                    />
                  )}
                  <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                  {showLabels && (
                    <>
                      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                      {badge != null && (
                        <span className="shrink-0 rounded-full bg-success/15 px-1.5 py-0.5 font-mono text-meta tabular-nums text-success">
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {!showLabels && <span className="sr-only">{item.label}</span>}
                </button>
              )

              return (
                <li key={item.id}>
                  {showLabels ? (
                    itemButton
                  ) : (
                    <Tooltip>
                      <TooltipTrigger render={<span className="block">{itemButton}</span>} />
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
