import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  FileCheck2Icon,
  FileTextIcon,
  LayersIcon,
  RotateCwIcon,
  SearchIcon,
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
import { Input } from "@/components/ui/input"
import { PdfExportActions } from "@/components/pdf-export"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useReducedMotion } from "@/lib/motion"
import { parseResourceIds } from "@/components/question-banks/question-bank-meta"
import { AnswerManuscript } from "./AnswerManuscript"
import { GenerationPanel } from "./GenerationPanel"
import { SolutionsEmptyState } from "./SolutionsEmptyState"
import { SolutionsSkeleton } from "./SolutionsSkeleton"

/**
 * SolutionsWorkspace — Phase 5 redesign of SolutionViewer
 * ("The Reading Room" answer manuscript workspace).
 * All four original effects, fetch strategies, and store actions are
 * preserved; only presentation is rebuilt.
 */
export function SolutionsWorkspace() {
  const {
    questionBanks,
    currentQuestionBank,
    currentAnswerSet,
    isGeneratingAnswers,
    isLoading,
    resources,
    error,
    successMessage,
    fetchQuestionBanks,
    selectQuestionBank,
    generateAnswers,
    downloadSolvedPdf,
    toggleAnswerSetShare,
    retryAnswer,
    setActiveTab,
    clearFeedback,
  } = useQuestionBankStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false)

  // 1. On mount: Fetch question banks if list is empty or ensure current is selected
  useEffect(() => {
    fetchQuestionBanks()
  }, [fetchQuestionBanks])

  // 2. If question banks exist but none selected, select the first one
  useEffect(() => {
    if (questionBanks.length > 0 && !currentQuestionBank) {
      selectQuestionBank(questionBanks[0].id)
    }
  }, [questionBanks, currentQuestionBank, selectQuestionBank])

  // 3. If currentQuestionBank is set but currentAnswerSet is missing or stale, refresh it
  useEffect(() => {
    if (
      currentQuestionBank &&
      (!currentAnswerSet ||
        currentAnswerSet.question_bank_id !== currentQuestionBank.id)
    ) {
      selectQuestionBank(currentQuestionBank.id)
    }
    // Dependency array preserved verbatim from the original implementation.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- parity with legacy behavior
  }, [currentQuestionBank?.id])

  // 4. Auto dismiss feedback — page-specific behavior preserved.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearFeedback, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, clearFeedback])

  const reduceMotion = useReducedMotion()

  const answers = (currentAnswerSet?.answers || []).filter(Boolean)
  const completedCount = answers.filter((a) => a.status === "completed").length
  const totalMarksSolved = answers
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (Number(a.marks) || 0), 0)

  const filteredAnswers = answers.filter(
    (a) =>
      a.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const totalSources = useMemo(
    () =>
      answers.reduce((sum, a) => sum + ((a.sources && a.sources.length) || 0), 0),
    [answers]
  )

  const isShared = currentAnswerSet?.visibility === "community"

  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources]
  )

  const linkedIds = currentQuestionBank
    ? parseResourceIds(currentQuestionBank.resource_ids)
    : []
  const resolvedScopeNames = linkedIds
    .map((id) => resourcesById.get(id)?.name)
    .filter(Boolean)

  const reduceMotionBanner = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  /* ── Full-page early return: no question banks at all (parity) ── */
  if (!isLoading && questionBanks.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <SolutionsEmptyState
          variant="no-banks"
          onGoToQuestionBanks={() => setActiveTab("question_banks")}
        />
      </div>
    )
  }

  return (
    <div data-slot="solutions-workspace" className="flex flex-col gap-6">
      {/* ── Feedback banners (4s auto-dismiss preserved in the effect above) ── */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="solutions-error"
            role="alert"
            {...reduceMotionBanner}
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
            key="solutions-success"
            role="status"
            {...reduceMotionBanner}
            className="flex items-start justify-between gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <CheckCircle2Icon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <p className="text-body-sm leading-relaxed text-success">
                {successMessage}
              </p>
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

      {/* ── Manuscript header ── */}
      <header className="flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
            <FileCheck2Icon aria-hidden="true" className="size-3.5" />
            Solved Question Banks · Solutions
          </p>
          <h1 className="mt-2 truncate font-serif text-title-xl text-foreground">
            {currentQuestionBank ? currentQuestionBank.name : "Select a Question Bank"}
          </h1>
          {currentQuestionBank && (
            <p className="mt-1.5 text-body-base text-muted-foreground">
              Subject:{" "}
              <span className="font-semibold text-foreground">
                {currentQuestionBank.subject}
              </span>{" "}
              • RAG Verified Answers
            </p>
          )}

          {/* Real figures only */}
          {answers.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CountChip label="Solved" value={`${completedCount} / ${answers.length}`} />
              <CountChip label="Total Solved Marks" value={totalMarksSolved} />
              <CountChip label="Sources Cited" value={totalSources} />
            </div>
          )}
          {currentQuestionBank && (
            <p className="mt-2.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
              RAG scope:{" "}
              {resolvedScopeNames.length > 0
                ? resolvedScopeNames.join(" · ")
                : linkedIds.length > 0
                  ? `IDs [${currentQuestionBank.resource_ids}]`
                  : "No linked study materials"}
            </p>
          )}
        </div>

        {/* Bank switcher + review navigation — parity visibility rules */}
        <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">
          {questionBanks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="default" className="max-w-[16rem]">
                    <FileTextIcon aria-hidden="true" className="text-muted-foreground" />
                    <span className="truncate">
                      {currentQuestionBank?.name ?? "Select Bank"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-muted-foreground"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" sideOffset={6} className="min-w-[16rem]">
                <DropdownMenuRadioGroup
                  value={currentQuestionBank ? String(currentQuestionBank.id) : undefined}
                  onValueChange={(value) => selectQuestionBank(Number(value))}
                >
                  <DropdownMenuLabel>Question banks</DropdownMenuLabel>
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
            <Button variant="outline" onClick={() => setActiveTab("review")}>
              <LayersIcon aria-hidden="true" className="text-primary" />
              Review Questions
            </Button>
          )}
        </div>
      </header>

      {/* ── Quick bank tabs strip (>1 banks) — restyled, same behavior ── */}
      {questionBanks.length > 1 && (
        <nav aria-label="Quick bank selection">
          <ol className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {questionBanks.map((qb) => {
              const isSelected = currentQuestionBank?.id === qb.id
              return (
                <li key={qb.id} className="shrink-0">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => selectQuestionBank(qb.id)}
                  >
                    <span className="max-w-[12rem] truncate">{qb.name}</span>
                    <span className="rounded-full bg-background/15 px-1.5 py-px font-mono text-meta uppercase text-current opacity-80">
                      {qb.subject}
                    </span>
                  </Button>
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      {/* ── Action row — parity visibility rules ── */}
      {currentQuestionBank && (
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {currentAnswerSet && answers.length > 0 && (
            <PdfExportActions
              answerSetId={currentAnswerSet.id}
              questionBankName={currentQuestionBank?.name}
              subject={currentQuestionBank?.subject}
              isShared={isShared}
              onDownload={(filename) =>
                downloadSolvedPdf(currentAnswerSet.id, filename)
              }
              onToggleShare={() => toggleAnswerSetShare(currentAnswerSet.id)}
            />
          )}

          <Button
            variant="ai"
            onClick={() => {
              if (answers.length > 0) {
                setIsRegenerateConfirmOpen(true)
              } else {
                generateAnswers(currentQuestionBank.id)
              }
            }}
            disabled={isGeneratingAnswers}
            aria-busy={isGeneratingAnswers || undefined}
          >
            <RotateCwIcon
              aria-hidden="true"
              className={isGeneratingAnswers ? "animate-spin" : undefined}
            />
            {isGeneratingAnswers
              ? "Generating Answers…"
              : answers.length > 0
                ? "Regenerate Answers"
                : "Generate Answers with AI"}
          </Button>
        </div>
      )}

      {/* ── Search bar ── */}
      {answers.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search solutions and key concepts…"
              aria-label="Search solutions and key concepts"
              className="border-transparent bg-muted/70 pl-9 focus-visible:border-ring focus-visible:bg-card"
            />
          </div>
          <p
            aria-live="polite"
            className="shrink-0 font-mono text-meta uppercase tracking-wider tabular-nums text-muted-foreground sm:mr-2"
          >
            Showing {filteredAnswers.length} of {answers.length} Solutions
          </p>
        </div>
      )}

      {/* ── Body states (priority preserved: loading → generating → list → empty) ── */}
      {isLoading ? (
        <SolutionsSkeleton />
      ) : isGeneratingAnswers ? (
        <GenerationPanel totalQuestions={answers.length || undefined} />
      ) : filteredAnswers.length > 0 ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">

          <motion.ol
            layout={!reduceMotion}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: Math.min(
                    0.04,
                    0.35 / Math.max(1, filteredAnswers.length)
                  ),
                },
              },
            }}
            className="flex min-w-0 flex-1 flex-col gap-6"
            aria-label="Generated solutions"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredAnswers.map((answer, index) => (
                <motion.li
                  key={answer.id}
                  id={`solutions-answer-${answer.id}`}
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
                  <AnswerManuscript
                    answer={answer}
                    displayNumber={index + 1}
                    onRetry={retryAnswer}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        </div>
      ) : answers.length === 0 ? (
        <SolutionsEmptyState
          variant="no-answers"
          questionBankName={currentQuestionBank?.name}
          onGenerate={
            currentQuestionBank && !isGeneratingAnswers
              ? () => generateAnswers(currentQuestionBank.id)
              : undefined
          }
        />
      ) : (
        <SolutionsEmptyState
          variant="no-match"
          onClearSearch={() => setSearchQuery("")}
        />
      )}

      {/* ── Regenerate confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={isRegenerateConfirmOpen}
        onOpenChange={(open) => !open && setIsRegenerateConfirmOpen(false)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
            >
              <RotateCwIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>Regenerate All Exam Solutions?</AlertDialogTitle>
              <AlertDialogDescription>
                All existing answers for “{currentQuestionBank?.name}” will be
                regenerated from scratch using Qdrant vector retrieval and Academic AI
                Review.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="ai"
              className="min-w-[11rem]"
              onClick={() => {
                setIsRegenerateConfirmOpen(false)
                if (currentQuestionBank) generateAnswers(currentQuestionBank.id)
              }}
            >
              Yes, Regenerate Answers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
