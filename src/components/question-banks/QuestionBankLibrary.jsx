import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
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
import { CountChip } from "@/components/shared/status-badge"
import { PIPELINE_STAGES } from "@/components/layout/nav-config"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useReducedMotion } from "@/lib/motion"
import { QuestionBankEmptyState } from "./QuestionBankEmptyState"
import { QUESTION_BANK_SORT_OPTIONS } from "./question-bank-meta"
import { QuestionBankFilters } from "./QuestionBankFilters"
import { QuestionBankGrid, QuestionBankGridSkeleton } from "./QuestionBankGrid"
import { QuestionBankUploadDialog } from "./QuestionBankUploadDialog"

/**
 * QuestionBankLibrary — Phase 3 redesign of QuestionBankManager
 * ("The Reading Room" examination archive). Owns page state
 * (filters, dialogs) and binds the existing store actions; every
 * store/API call keeps its original contract.
 */
export function QuestionBankLibrary() {
  const {
    questionBanks,
    resources,
    isLoading,
    isUploadingQuestionBank,
    extractingQBs,
    error,
    successMessage,
    fetchQuestionBanks,
    fetchResources,
    uploadQuestionBank,
    selectQuestionBank,
    extractQuestions,
    setActiveTab,
    downloadQuestionBankFile,
    clearFeedback,
  } = useQuestionBankStore()

  const { user, isAuthenticated, openAuthModal } = useAuthStore()

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [reExtractCandidate, setReExtractCandidate] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("ALL")
  const [sortId, setSortId] = useState("newest")

  useEffect(() => {
    fetchQuestionBanks()
    fetchResources()
  }, [fetchQuestionBanks, fetchResources, user])

  /** FormData contract preserved verbatim from the original page. */
  const handleUploadSubmit = async ({ name, subject, resourceIds, file }) => {
    const formData = new FormData()
    formData.append("user_id", user?.id || 1)
    formData.append("name", name)
    formData.append("subject", subject)
    formData.append("resource_ids", resourceIds.join(","))
    formData.append("file", file)

    return uploadQuestionBank(formData)
  }

  /** Extraction decision preserved: extracted banks confirm before re-extract. */
  const handleExtract = (questionBank) => {
    if (questionBank.status === "extracted") {
      setReExtractCandidate(questionBank)
      return
    }
    extractQuestions(questionBank.id)
  }

  /** Navigation behavior preserved: hydrate bank, then move to Review. */
  const handleReviewBank = async (bankId) => {
    await selectQuestionBank(bankId)
    setActiveTab("review")
  }

  const handleOpenUpload = () => {
    if (!isAuthenticated) {
      openAuthModal("login")
      return
    }
    setIsUploadOpen(true)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("ALL")
  }

  const subjects = useMemo(
    () => Array.from(new Set(questionBanks.map((qb) => qb.subject).filter(Boolean))),
    [questionBanks]
  )

  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources]
  )

  const visibleBanks = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const filtered = questionBanks.filter((qb) => {
      const matchesSearch =
        qb.name.toLowerCase().includes(query) ||
        qb.subject.toLowerCase().includes(query)
      const matchesSubject =
        selectedSubject === "ALL" || qb.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
    const sort =
      QUESTION_BANK_SORT_OPTIONS.find((option) => option.id === sortId) ??
      QUESTION_BANK_SORT_OPTIONS[0]
    return [...filtered].sort(sort.compare)
  }, [questionBanks, searchQuery, selectedSubject, sortId])

  const extractedCount = useMemo(
    () => questionBanks.filter((qb) => qb.status === "extracted").length,
    [questionBanks]
  )

  const reduceMotion = useReducedMotion()

  const bannerMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  const hasArchive = questionBanks.length > 0
  const showFilters = !isLoading && hasArchive

  return (
    <div data-slot="question-bank-library" className="flex flex-col gap-6 pb-4">
      {/* ── Page header ── */}
      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
            <LayersIcon aria-hidden="true" className="size-3.5" />
            Examination Archive · Exam Paper Management
          </p>
          <h1 className="mt-2 font-serif text-title-xl text-foreground">
            Question Banks &amp; AI Extraction
          </h1>
          <p className="mt-2 max-w-2xl text-body-base leading-relaxed text-muted-foreground">
            Upload university previous year question papers. Link them to indexed
            study materials and extract questions.
          </p>

          {/* Collection figures — real counts only */}
          {!isLoading && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CountChip label="Banks" value={questionBanks.length} />
              <CountChip label="Subjects" value={subjects.length} />
              <CountChip label="Extracted" value={extractedCount} />
            </div>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleOpenUpload}
          className="w-full shrink-0 lg:w-auto"
        >
          <PlusIcon aria-hidden="true" />
          Add Question Bank
        </Button>
      </header>

      {/* ── Workflow wayfinding — static pipeline strip (§13) ── */}
      <nav aria-label="AcademicStack workflow stages">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {PIPELINE_STAGES.map((stage, index) => {
            const isCurrent = stage.tabId === "question_banks"
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
      </nav>

      {/* ── Feedback (global store singleton, manual dismiss preserved) ── */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="qb-error"
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
            key="qb-success"
            role="status"
            {...bannerMotion}
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

      {/* ── Toolbar ── */}
      {showFilters && (
        <QuestionBankFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          sortId={sortId}
          onSelectSort={setSortId}
          shownCount={visibleBanks.length}
          totalCount={questionBanks.length}
        />
      )}

      {/* ── Collection ── */}
      {isLoading ? (
        <QuestionBankGridSkeleton />
      ) : !hasArchive ? (
        <QuestionBankEmptyState variant="library" onCreateQuestionBank={handleOpenUpload} />
      ) : visibleBanks.length === 0 ? (
        <QuestionBankEmptyState
          variant="no-results"
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <QuestionBankGrid
          questionBanks={visibleBanks}
          extractingQBs={extractingQBs}
          isUploadingQuestionBank={isUploadingQuestionBank}
          resourcesById={resourcesById}
          onExtract={handleExtract}
          onDownload={(id, name) =>
            downloadQuestionBankFile(id, `${name.replace(/\s+/g, "_")}.pdf`)
          }
          onReview={handleReviewBank}
        />
      )}

      {/* ── Upload dialog (mounted only while open → fresh form each time) ── */}
      {isUploadOpen && (
        <QuestionBankUploadDialog
          open
          onOpenChange={setIsUploadOpen}
          isUploading={isUploadingQuestionBank}
          resources={resources}
          onSubmit={handleUploadSubmit}
        />
      )}

      {/* ── Re-extract confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={!!reExtractCandidate}
        onOpenChange={(open) => !open && setReExtractCandidate(null)}
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
                Existing extracted questions for “{reExtractCandidate?.name}” will be
                replaced with fresh AI extraction. Any custom modifications will be
                reset.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="ai"
              onClick={() => {
                if (reExtractCandidate) {
                  extractQuestions(reExtractCandidate.id)
                  setReExtractCandidate(null)
                }
              }}
            >
              Yes, Re-extract Questions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
