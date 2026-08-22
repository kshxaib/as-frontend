import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  LayersIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CountChip } from "@/components/shared/status-badge"
import { PIPELINE_STAGES } from "@/components/layout/nav-config"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useReducedMotion } from "@/lib/motion"
import { AddQuestionDialog } from "./AddQuestionDialog"
import { GeneratingNotice } from "./GeneratingNotice"
import { QuestionPaperRow } from "./QuestionPaperRow"
import { ReviewEmptyState } from "./ReviewEmptyState"
import { ReviewSkeleton } from "./ReviewSkeleton"
import { ReviewStats } from "./ReviewStats"
import { ReviewToolbar } from "./ReviewToolbar"

/**
 * QuestionReviewWorkspace — Phase 4 redesign of QuestionReview
 * ("The Reading Room" quality-control stage). Binds the existing
 * store actions; every API call and payload keeps its original contract.
 */
export function QuestionReviewWorkspace() {
  const {
    questionBanks,
    currentQuestionBank,
    questions,
    isLoading,
    extractingQBs,
    isGeneratingAnswers,
    error,
    successMessage,
    fetchQuestionBanks,
    selectQuestionBank,
    extractQuestions,
    generateAnswers,
    updateQuestion,
    deleteQuestion,
    addQuestion,
    resources,
    setActiveTab,
    clearFeedback,
  } = useQuestionBankStore()

  const { isAuthenticated } = useAuthStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false)
  const [isReExtractConfirmOpen, setIsReExtractConfirmOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMarkFilter, setSelectedMarkFilter] = useState("ALL")
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("ALL")

  useEffect(() => {
    fetchQuestionBanks()
  }, [fetchQuestionBanks])

  // Auto-dismiss feedback after 4 seconds — page-specific behavior preserved.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearFeedback, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, clearFeedback])

  // Calculations for stats — identical formulas to the original page.
  const totalQuestions = questions.length
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
  const explicitCount = questions.filter((q) => q.marks_source === "explicit").length
  const aiEstimatedCount = questions.filter((q) => q.marks_source === "ai_estimated").length
  const userModifiedCount = questions.filter((q) => q.marks_source === "user_modified").length

  // Filtered questions — identical logic to the original page.
  const filteredQuestions = useMemo(
    () =>
      questions.filter((q) => {
        const matchesSearch = q.question_text
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesMarks =
          selectedMarkFilter === "ALL" || Number(q.marks) === Number(selectedMarkFilter)
        const matchesSource =
          selectedSourceFilter === "ALL" || q.marks_source === selectedSourceFilter
        return matchesSearch && matchesMarks && matchesSource
      }),
    [questions, searchQuery, selectedMarkFilter, selectedSourceFilter]
  )

  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources]
  )

  const reduceMotion = useReducedMotion()

  const bannerMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedMarkFilter("ALL")
    setSelectedSourceFilter("ALL")
  }

  const hasQuestions = questions.length > 0
  const isExtractingCurrent =
    currentQuestionBank && !!extractingQBs[currentQuestionBank.id]

  return (
    <div data-slot="question-review-workspace" className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
            <LayersIcon aria-hidden="true" className="size-3.5" />
            Quality Control · Question Review &amp; Verification
          </p>
          <h1 className="mt-2 font-serif text-title-xl text-foreground">
            Question Review &amp; Marks Tuning
          </h1>
          <p className="mt-2 max-w-2xl text-body-base leading-relaxed text-muted-foreground">
            Review extracted questions, adjust marks, and approve before triggering AI
            answer generation.
          </p>

          {/* Workflow wayfinding — static pipeline strip (§13) */}
          <ol
            aria-label="AcademicStack workflow stages"
            className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5"
          >
            {PIPELINE_STAGES.map((stage, index) => {
              const isCurrent = stage.tabId === "review"
              return (
                <li key={stage.step} className="flex items-center gap-2">
                  <span
                    aria-current={isCurrent ? "step" : undefined}
                    className={
                      "inline-flex items-center gap-1.5 font-mono text-meta uppercase tracking-wider " +
                      (isCurrent ? "text-primary" : "text-muted-foreground")
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={
                        "flex size-4.5 items-center justify-center rounded-full border text-[10px] tabular-nums " +
                        (isCurrent
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground")
                      }
                    >
                      {stage.step}
                    </span>
                    {stage.label}
                  </span>
                  {index < PIPELINE_STAGES.length - 1 && (
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="size-3 text-muted-foreground"
                    />
                  )}
                </li>
              )
            })}
          </ol>

          {!isLoading && currentQuestionBank && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CountChip label="Questions" value={totalQuestions} />
              <CountChip label="Total Marks" value={totalMarks} />
            </div>
          )}
        </div>

        {/* Bank switcher + actions — parity with original visibility rules */}
        <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
          {questionBanks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="default" className="max-w-[16rem]">
                    <FileTextIcon aria-hidden="true" className="text-muted-foreground" />
                    <span className="truncate">
                      {currentQuestionBank?.name ?? "Select a bank"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-muted-foreground"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" sideOffset={6} className="min-w-[16rem]">
                <DropdownMenuLabel>Question banks</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={currentQuestionBank ? String(currentQuestionBank.id) : undefined}
                  onValueChange={(value) => selectQuestionBank(Number(value))}
                >
                  {questionBanks.map((qb) => (
                    <DropdownMenuRadioItem key={qb.id} value={String(qb.id)}>
                      <span className="truncate">
                        {qb.name} ({qb.subject})
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {currentQuestionBank && (
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestionBank.status === "extracted") {
                  setIsReExtractConfirmOpen(true)
                } else {
                  extractQuestions(currentQuestionBank.id)
                }
              }}
              disabled={!!extractingQBs[currentQuestionBank.id]}
            >
              <SparklesIcon
                aria-hidden="true"
                className={
                  extractingQBs[currentQuestionBank.id] ? "animate-spin text-accent" : "text-accent"
                }
              />
              {extractingQBs[currentQuestionBank.id]
                ? "Extracting with AI…"
                : currentQuestionBank.status === "extracted"
                  ? "Re-extract Questions"
                  : "Extract Questions"}
            </Button>
          )}

          {currentQuestionBank && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon aria-hidden="true" />
              Add Question
            </Button>
          )}
        </div>
      </header>

      {/* ── Feedback (global store singleton; 4s auto-dismiss preserved) ── */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="review-error"
            role="alert"
            {...bannerMotion}
            className="flex items-start justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <AlertCircleIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-destructive"
              />
              <p className="text-body-sm leading-relaxed text-destructive">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFeedback}
              aria-label="Dismiss error"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Dismiss
            </Button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            key="review-success"
            role="status"
            {...bannerMotion}
            className="flex items-start justify-between gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <CheckCircle2Icon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <p className="text-body-sm leading-relaxed text-success">{successMessage}</p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFeedback}
              aria-label="Dismiss notification"
              className="text-success hover:bg-success/10 hover:text-success"
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honest non-blocking generation notice (§15.1) */}
      {isGeneratingAnswers && totalQuestions > 0 && (
        <GeneratingNotice totalQuestions={totalQuestions} totalMarks={totalMarks} />
      )}

      {/* ── Workspace body ── */}
      {!currentQuestionBank && !isLoading ? (
        <ReviewEmptyState
          variant="no-bank"
          onGoToQuestionBanks={
            isAuthenticated
              ? () => setActiveTab("question_banks")
              : undefined
          }
        />
      ) : isLoading ? (
        <ReviewSkeleton />
      ) : (
        <>
          <ReviewStats
            currentQuestionBank={currentQuestionBank}
            totalQuestions={totalQuestions}
            totalMarks={totalMarks}
            explicitCount={explicitCount}
            aiEstimatedCount={aiEstimatedCount}
            userModifiedCount={userModifiedCount}
            resourcesById={resourcesById}
          />

          {hasQuestions && filteredQuestions.length > 0 && (
            <ReviewToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedMarkFilter={selectedMarkFilter}
              onSelectMarkFilter={setSelectedMarkFilter}
              selectedSourceFilter={selectedSourceFilter}
              onSelectSourceFilter={setSelectedSourceFilter}
              shownCount={filteredQuestions.length}
              totalCount={totalQuestions}
            />
          )}

          {/* Two-region review layout: index rail + paper list */}
          {filteredQuestions.length > 0 ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
              <motion.ol
                layout={!reduceMotion}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: Math.min(0.03, 0.35 / Math.max(1, filteredQuestions.length)),
                    },
                  },
                }}
                className="flex min-w-0 flex-1 flex-col gap-4"
                aria-label="Extracted questions"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredQuestions.map((question, index) => (
                    <motion.li
                      key={question.id}
                      id={`review-question-${question.id}`}
                      layout={!reduceMotion}
                      className="scroll-mt-24"
                      variants={
                        reduceMotion
                          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                          : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
                      }
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] }}
                    >
                      <QuestionPaperRow
                        question={question}
                        displayNumber={index + 1}
                        onSave={updateQuestion}
                        onQuickMark={(id, marks) => updateQuestion(id, { marks })}
                        onDelete={deleteQuestion}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ol>
            </div>
          ) : hasQuestions ? (
            <ReviewEmptyState variant="no-match" onClearFilters={handleClearFilters} />
          ) : (
            <ReviewEmptyState
              variant="no-questions"
              canExtract={!isExtractingCurrent}
              onExtract={() => extractQuestions(currentQuestionBank.id)}
              onAddQuestion={() => setIsAddDialogOpen(true)}
            />
          )}
        </>
      )}

      {/* Spacer so the sticky action bar never covers the last rows */}
      {currentQuestionBank && hasQuestions && <div aria-hidden="true" className="h-20" />}

      {/* ── Sticky review bar: the real continue-to-generation action ── */}
      {currentQuestionBank && hasQuestions && (
        <div
          data-slot="review-action-bar"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="font-mono text-meta uppercase tracking-wider tabular-nums text-foreground">
                {totalQuestions} Questions · {totalMarks} Marks
              </p>
              <p className="mt-0.5 truncate text-body-sm text-muted-foreground">
                Ready for answer generation using your linked study materials.
              </p>
            </div>

            <Button
              variant="ai"
              size="lg"
              onClick={() => setIsGenerateConfirmOpen(true)}
              disabled={isGeneratingAnswers}
              aria-busy={isGeneratingAnswers || undefined}
            >
              {isGeneratingAnswers ? (
                "Generating…"
              ) : (
                <>
                  Approve &amp; Generate Answers
                  <ArrowRightIcon aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Re-extract confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={isReExtractConfirmOpen}
        onOpenChange={(open) => !open && setIsReExtractConfirmOpen(false)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
            >
              <SparklesIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>Re-extract Question Bank?</AlertDialogTitle>
              <AlertDialogDescription>
                Existing extracted questions for “{currentQuestionBank?.name}” will be
                replaced with fresh AI extraction. Any custom edits will be lost.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="ai"
              onClick={() => {
                setIsReExtractConfirmOpen(false)
                if (currentQuestionBank) extractQuestions(currentQuestionBank.id)
              }}
            >
              Yes, Re-extract Questions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Generate confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={isGenerateConfirmOpen}
        onOpenChange={(open) => !open && setIsGenerateConfirmOpen(false)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
            >
              <SparklesIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>Generate AI Solutions &amp; Academic Review?</AlertDialogTitle>
              <AlertDialogDescription>
                AcademicStack will retrieve grounded notes from Qdrant, draft complete
                examination answers for all {totalQuestions} questions ({totalMarks}{" "}
                marks total), and run an Academic AI Review pass with LaTeX math
                verification.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="ai"
              onClick={() => {
                setIsGenerateConfirmOpen(false)
                if (currentQuestionBank) generateAnswers(currentQuestionBank.id)
              }}
            >
              Start Solution Generation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Add-question dialog (mounted only while open → fresh form) ── */}
      {isAddDialogOpen && currentQuestionBank && (
        <AddQuestionDialog
          open
          onOpenChange={setIsAddDialogOpen}
          onSubmit={(payload) => addQuestion(currentQuestionBank.id, payload)}
        />
      )}
    </div>
  )
}
