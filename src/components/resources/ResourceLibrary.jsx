import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { AlertCircleIcon, BookOpenIcon, CheckCircle2Icon, PlusIcon, Trash2Icon } from "lucide-react"

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
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useReducedMotion } from "@/lib/motion"
import { ResourceEmptyState } from "./ResourceEmptyState"
import { RESOURCE_SORT_OPTIONS } from "./resource-meta"
import { ResourceFilters } from "./ResourceFilters"
import { ResourceGrid, ResourceGridSkeleton } from "./ResourceGrid"
import { ResourceUploadDialog } from "./ResourceUploadDialog"

/**
 * ResourceLibrary — Phase 2 redesign of ResourceManager ("The Reading Room").
 * Owns page state (filters, dialogs) and binds the existing store actions;
 * every store/API call keeps its original contract.
 */
export function ResourceLibrary() {
  const {
    resources,
    isLoading,
    isUploadingResource,
    isIndexingResource,
    error,
    successMessage,
    fetchResources,
    uploadResource,
    indexResource,
    deleteResource,
    toggleResourceShare,
    downloadResourceFile,
    clearFeedback,
  } = useQuestionBankStore()

  const { user, isAuthenticated, openAuthModal } = useAuthStore()

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("ALL")
  const [sortId, setSortId] = useState("newest")

  useEffect(() => {
    fetchResources()
  }, [fetchResources, user])

  /** FormData contract preserved verbatim from the original page. */
  const handleUploadSubmit = async (fields) => {
    const formData = new FormData()
    formData.append("user_id", user?.id || 1)
    formData.append("name", fields.name)
    formData.append("subject", fields.subject)
    if (fields.chapters) formData.append("chapters", fields.chapters)
    if (fields.description) formData.append("description", fields.description)
    formData.append("visibility", fields.visibility)
    formData.append("file", fields.file)

    return uploadResource(formData)
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
    () => Array.from(new Set(resources.map((r) => r.subject).filter(Boolean))),
    [resources]
  )

  const visibleResources = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const filtered = resources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(query) ||
        r.subject.toLowerCase().includes(query) ||
        (r.chapters && r.chapters.toLowerCase().includes(query))
      const matchesSubject =
        selectedSubject === "ALL" || r.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
    const sort =
      RESOURCE_SORT_OPTIONS.find((option) => option.id === sortId) ??
      RESOURCE_SORT_OPTIONS[0]
    return [...filtered].sort(sort.compare)
  }, [resources, searchQuery, selectedSubject, sortId])

  const indexedCount = useMemo(
    () => resources.filter((r) => r.status === "indexed").length,
    [resources]
  )

  const reduceMotion = useReducedMotion()

  const bannerMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  const hasLibrary = resources.length > 0
  const showFilters = !isLoading && hasLibrary

  return (
    <div data-slot="resource-library" className="flex flex-col gap-6 pb-4">
      {/* ── Page header ── */}
      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
            <BookOpenIcon aria-hidden="true" className="size-3.5" />
            Personal Library · Study Materials &amp; Knowledge Base
          </p>
          <h1 className="mt-2 font-serif text-title-xl text-foreground">
            Study Resources &amp; Vector Store
          </h1>
          <p className="mt-2 max-w-2xl text-body-base leading-relaxed text-muted-foreground">
            Upload course notes &amp; textbooks. Index them into Qdrant to power
            syllabus-grounded RAG answers.
          </p>

          {/* Collection figures — real counts only */}
          {!isLoading && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CountChip label="Documents" value={resources.length} />
              <CountChip label="Subjects" value={subjects.length} />
              <CountChip label="RAG-ready" value={indexedCount} />
            </div>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleOpenUpload}
          className="w-full shrink-0 lg:w-auto"
        >
          <PlusIcon aria-hidden="true" />
          Add Resource
        </Button>
      </header>

      {/* ── Feedback (global store singleton, manual dismiss preserved) ── */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="resource-error"
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
            key="resource-success"
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
        <ResourceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          sortId={sortId}
          onSelectSort={setSortId}
          shownCount={visibleResources.length}
          totalCount={resources.length}
        />
      )}

      {/* ── Collection ── */}
      {isLoading ? (
        <ResourceGridSkeleton />
      ) : !hasLibrary ? (
        <ResourceEmptyState variant="library" onAddResource={handleOpenUpload} />
      ) : visibleResources.length === 0 ? (
        <ResourceEmptyState
          variant="no-results"
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <ResourceGrid
          resources={visibleResources}
          isIndexingResource={isIndexingResource}
          isUploadingResource={isUploadingResource}
          onIndex={indexResource}
          onToggleShare={toggleResourceShare}
          onDownload={(id, name) =>
            downloadResourceFile(id, `${name.replace(/\s+/g, "_")}.pdf`)
          }
          onDelete={setDeleteCandidate}
        />
      )}

      {/* ── Upload dialog (mounted only while open → fresh form each time) ── */}
      {isUploadOpen && (
        <ResourceUploadDialog
          open
          onOpenChange={setIsUploadOpen}
          isUploading={isUploadingResource}
          onSubmit={handleUploadSubmit}
        />
      )}

      {/* ── Delete confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-destructive/25 bg-destructive/10 text-destructive"
            >
              <Trash2Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>Delete Study Resource?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete “{deleteCandidate?.name}”? Its vector
                embeddings in Qdrant will also be deleted.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteCandidate) {
                  deleteResource(deleteCandidate.id)
                  setDeleteCandidate(null)
                }
              }}
              className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-transparent focus-visible:ring-destructive/20"
            >
              Yes, Delete Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
