import { motion } from "motion/react"
import { useReducedMotion } from "motion/react"

import { PIPELINE_STAGES } from "./nav-config"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { cn } from "@/lib/utils"

/**
 * PipelineSteps — DESIGN_SYSTEM.md §13 pipeline wayfinding (task 3).
 * ① Resources → ② Questions → ③ Review → ④ Solutions → ⑤ Export.
 * States derive from REAL store data only (no fake progress):
 *   current = active tab, ready = the stage's artifact exists.
 * Nodes are buttons that navigate to their stage.
 */
export function PipelineSteps({ className }) {
  const activeTab = useQuestionBankStore((s) => s.activeTab)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)
  const resources = useQuestionBankStore((s) => s.resources)
  const questionBanks = useQuestionBankStore((s) => s.questionBanks)
  const questions = useQuestionBankStore((s) => s.questions)
  const currentAnswerSet = useQuestionBankStore((s) => s.currentAnswerSet)
  const reduceMotion = useReducedMotion()

  const readiness = {
    1: resources.some((r) => r.status === "indexed"),
    2: questionBanks.length > 0,
    3: questions.length > 0,
    4: (currentAnswerSet?.answers ?? []).some(Boolean),
    5: (currentAnswerSet?.answers ?? []).length > 0,
  }

  // Export (5) lives inside Solutions; never "current" — only stage 1–4 map to tabs.
  const currentStep = PIPELINE_STAGES.find(
    (s) => s.step <= 4 && s.tabId === activeTab
  )?.step

  return (
    <div
      data-slot="pipeline-steps"
      role="navigation"
      aria-label="Academic workflow: Resources, Questions, Review, Solutions, Export"
      className={cn("px-3 pb-2", className)}
    >
      <p className="px-1 pb-2 font-mono text-meta uppercase text-muted-foreground">Pipeline</p>
      <ol className="flex items-start justify-between gap-0.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCurrent = currentStep === stage.step && !(currentStep === 4 && stage.step === 5)
          const isReady = readiness[stage.step]
          return (
            <li key={stage.step} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => setActiveTab(stage.tabId)}
                aria-current={isCurrent ? "step" : undefined}
                title={`Stage ${stage.step}: ${stage.label}`}
                aria-label={`Stage ${stage.step}: ${stage.label}${isReady ? " (ready)" : ""}`}
                className="group flex min-w-0 flex-1 flex-col items-center gap-1 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <span className="relative flex w-full items-center">
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px flex-1",
                        readiness[stage.step - 1] || isCurrent ? "bg-primary/40" : "bg-border"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-meta tabular-nums transition-colors duration-(--motion-fast) ease-standard",
                      isCurrent
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : isReady
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-border bg-muted text-muted-foreground group-hover:border-ring/40"
                      )}
                  >
                    {isCurrent && (
                      <motion.span
                        aria-hidden="true"
                        layoutId="pipeline-current-ring"
                        transition={
                          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                        }
                        className="absolute -inset-[3px] rounded-full border border-primary/50"
                      />
                    )}
                    {stage.step}
                  </span>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn("h-px flex-1", isReady ? "bg-primary/40" : "bg-border")}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "max-w-full truncate font-mono text-meta uppercase",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
