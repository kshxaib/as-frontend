import { useEffect, useMemo, useState } from "react"

import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useReducedMotion } from "@/lib/motion"
import { COMMUNITY_SORT_OPTIONS } from "./community-meta"
import { CommunityEmptyState } from "./CommunityEmptyState"
import { CommunityFilters } from "./CommunityFilters"
import { CommunityGrid, CommunitySkeleton } from "./CommunityGrid"
import { CommunityHeader } from "./CommunityHeader"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"

/**
 * CommunityLibrary — Phase 8 redesign of CommunityHub
 * ("The Reading Room" academic commons).
 *
 * Guest-accessible: rendered both inside the authenticated AppShell and
 * in a bare <main> for signed-out visitors, so this root stays
 * self-contained (no min-h-screen/max-width wrapper of its own).
 * Fetch strategy, filters, downloads, and store actions are preserved;
 * the previously swallowed fetch error is now surfaced via the existing
 * global error state.
 */
export function CommunityLibrary() {
  const {
    communityResources,
    communityAnswerSets,
    isLoadingCommunity,
    error,
    successMessage,
    clearFeedback,
    fetchCommunityData,
    downloadSolvedPdf,
    downloadResourceFile,
  } = useQuestionBankStore()

  const [activeSubTab, setActiveSubTab] = useState("resources") // 'resources' | 'solved_sets'
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("ALL")
  const [sortId, setSortId] = useState("newest")

  useEffect(() => {
    fetchCommunityData()
  }, [fetchCommunityData])

  const activeSortCompare = useMemo(() => {
    const sort =
      COMMUNITY_SORT_OPTIONS.find((option) => option.id === sortId) ??
      COMMUNITY_SORT_OPTIONS[0]
    return sort.compare
  }, [sortId])

  // Filter semantics preserved verbatim from the original page.
  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const filtered = communityResources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(query) ||
        r.subject.toLowerCase().includes(query) ||
        (r.chapters && r.chapters.toLowerCase().includes(query))
      const matchesSubject =
        selectedSubject === "ALL" || r.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
    return [...filtered].sort(activeSortCompare)
  }, [communityResources, searchQuery, selectedSubject, activeSortCompare])

  const filteredAnswerSets = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const filtered = communityAnswerSets.filter((s) => {
      const matchesSearch =
        s.question_bank_name.toLowerCase().includes(query) ||
        s.subject.toLowerCase().includes(query)
      const matchesSubject =
        selectedSubject === "ALL" || s.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
    return [...filtered].sort(activeSortCompare)
  }, [communityAnswerSets, searchQuery, selectedSubject, activeSortCompare])

  const subjects = useMemo(
    () =>
      Array.from(
        new Set([
          ...communityResources.map((r) => r.subject),
          ...communityAnswerSets.map((s) => s.subject),
        ].filter(Boolean))
      ),
    [communityResources, communityAnswerSets]
  )

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("ALL")
  }

  const reduceMotion = useReducedMotion()

  const bannerMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  const activeTotal =
    activeSubTab === "resources"
      ? communityResources.length
      : communityAnswerSets.length
  const activeShown =
    activeSubTab === "resources" ? filteredResources.length : filteredAnswerSets.length

  const isEmptyCollection =
    activeSubTab === "resources"
      ? communityResources.length === 0
      : communityAnswerSets.length === 0

  return (
    <div data-slot="community-library" className="flex flex-col gap-6 pb-4">
      {/* ── Feedback (global store singleton; previously not shown here) ── */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="community-error"
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
            key="community-success"
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

      <CommunityHeader
        resourcesCount={communityResources.length}
        solvedSetsCount={communityAnswerSets.length}
        isLoading={isLoadingCommunity}
        onRefresh={fetchCommunityData}
      />

      <CommunityFilters
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        resourcesCount={communityResources.length}
        solvedSetsCount={communityAnswerSets.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        sortId={sortId}
        onSelectSort={setSortId}
        shownCount={activeShown}
        totalCount={activeTotal}
      />

      {/* ── Collection ── */}
      {isLoadingCommunity ? (
        <CommunitySkeleton />
      ) : isEmptyCollection ? (
        <CommunityEmptyState variant={activeSubTab === "resources" ? "resources" : "solved_sets"} />
      ) : activeShown === 0 ? (
        <CommunityEmptyState variant="no-match" onClearFilters={handleClearFilters} />
      ) : (
        <CommunityGrid
          activeSubTab={activeSubTab}
          resources={filteredResources}
          answerSets={filteredAnswerSets}
          onDownloadResource={(id, name) =>
            downloadResourceFile(id, `${name.replace(/\s+/g, "_")}.pdf`)
          }
          onDownloadAnswerSet={(id, set) =>
            downloadSolvedPdf(
              id,
              `AcademicStack_${(set.subject || "Subject").replace(/\s+/g, "_")}_${(set.question_bank_name || "Solved_QB").replace(/\s+/g, "_")}.pdf`
            )
          }
        />
      )}
    </div>
  )
}
