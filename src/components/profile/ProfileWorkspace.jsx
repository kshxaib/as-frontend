import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  KeyRoundIcon,
  Trash2Icon,
  UserIcon,
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
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/useAuthStore"
import { useReducedMotion } from "@/lib/motion"
import { AccountActions } from "./AccountActions"
import { ProviderCard } from "./ProviderCard"
import {
  PROVIDERS,
  REQUIRED_PROVIDER_COUNT,
  validateKeyFormat,
} from "./profile-meta"
import { WorkspacePreferences } from "./WorkspacePreferences"

const EMPTY_INPUTS = Object.fromEntries(PROVIDERS.map((p) => [p.id, ""]))
const EMPTY_FLAGS = Object.fromEntries(PROVIDERS.map((p) => [p.id, false]))

/**
 * ProfileWorkspace — Phase 9 redesign of ProfileSettings
 * ("The Reading Room" control room).
 *
 * Security posture preserved exactly: typed keys live only in local
 * component state, are cleared after successful save, are never
 * prefilled/persisted/logged, and the backend never returns stored
 * values (only has_*_key booleans drive status display).
 */
export function ProfileWorkspace() {
  const {
    user,
    isAuthenticated,
    error,
    updateGeminiKey,
    deleteGeminiKey,
    updateGroqKey,
    deleteGroqKey,
    updateOpenRouterKey,
    deleteOpenRouterKey,
    updateNvidiaKey,
    deleteNvidiaKey,
    updateOpenAIKey,
    deleteOpenAIKey,
    openAuthModal,
    clearError,
  } = useAuthStore()

  const [keysInput, setKeysInput] = useState(EMPTY_INPUTS)
  const [showKey, setShowKey] = useState(EMPTY_FLAGS)
  const [actionLoading, setActionLoading] = useState(EMPTY_FLAGS)
  const [deleteKeyCandidate, setDeleteKeyCandidate] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const reduceMotion = useReducedMotion()

  /* ── Guest gate — parity with the original page ── */
  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center py-14">
        <div className="flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-card px-8 py-14 text-center">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
          >
            <UserIcon className="size-7" />
          </span>
          <h1 className="mt-5 font-serif text-title-lg text-foreground">
            Sign In to Manage Your Profile
          </h1>
          <p className="mt-2 max-w-[42ch] text-body-base leading-relaxed text-muted-foreground">
            Create an account or login to configure your API keys and unlock
            high-speed RAG and Question Bank tools.
          </p>
          <Button size="lg" className="mt-6" onClick={() => openAuthModal("login")}>
            Sign In / Register
          </Button>
        </div>
      </div>
    )
  }

  /* ── Handlers — flows preserved verbatim from the original page ── */

  const handleInputChange = (provider, value) => {
    setKeysInput((prev) => ({ ...prev, [provider]: value }))
    setValidationError(null)
  }

  const toggleShowKey = (provider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  const handleSaveSingleKey = async (providerConfig) => {
    const provider = providerConfig.id
    const val = keysInput[provider]?.trim()
    if (!val) return

    // Instant format validation (rules unchanged)
    const formatErr = validateKeyFormat(provider, val)
    if (formatErr) {
      setValidationError(formatErr)
      return
    }

    setValidationError(null)
    setSuccessMsg(null)
    clearError()
    setActionLoading((prev) => ({ ...prev, [provider]: true }))

    let res
    if (provider === "gemini") res = await updateGeminiKey(val)
    else if (provider === "groq") res = await updateGroqKey(val)
    else if (provider === "openrouter") res = await updateOpenRouterKey(val)
    else if (provider === "nvidia") res = await updateNvidiaKey(val)
    else if (provider === "openai") res = await updateOpenAIKey(val)

    setActionLoading((prev) => ({ ...prev, [provider]: false }))

    if (res?.success) {
      setKeysInput((prev) => ({ ...prev, [provider]: "" }))
      setShowKey((prev) => ({ ...prev, [provider]: false }))
      setSuccessMsg(`${providerConfig.name} API key saved successfully!`)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteKeyCandidate) return
    const { id, name } = deleteKeyCandidate
    setDeleteKeyCandidate(null)

    setSuccessMsg(null)
    clearError()
    setActionLoading((prev) => ({ ...prev, [id]: true }))

    let res
    if (id === "gemini") res = await deleteGeminiKey()
    else if (id === "groq") res = await deleteGroqKey()
    else if (id === "openrouter") res = await deleteOpenRouterKey()
    else if (id === "nvidia") res = await deleteNvidiaKey()
    else if (id === "openai") res = await deleteOpenAIKey()

    setActionLoading((prev) => ({ ...prev, [id]: false }))

    if (res?.success) {
      setSuccessMsg(`${name} API key removed.`)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  /* ── Setup progress (logic + copy preserved) ── */
  const requiredCount = [
    user.has_gemini_key,
    user.has_groq_key,
    user.has_openrouter_key,
    user.has_nvidia_key,
  ].filter(Boolean).length
  const isFullyConfigured = requiredCount === REQUIRED_PROVIDER_COUNT

  const bannerMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.22, ease: [0.2, 0, 0, 1] },
  }

  return (
    <div data-slot="profile-workspace" className="flex flex-col gap-6 pb-4">
      {/* ── Header ── */}
      <header className="border-b border-border pb-6">
        <p className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
          <UserIcon aria-hidden="true" className="size-3.5" />
          Control Room · Account &amp; AI Provider Configuration
        </p>
        <h1 className="mt-2 font-serif text-title-xl text-foreground">
          Profile &amp; Keys
        </h1>
        <p className="mt-2 max-w-2xl text-body-base leading-relaxed text-muted-foreground">
          Configure your individual AI API keys with automatic failover. Modify each
          provider separately.
        </p>
      </header>

      {/* ── Feedback banners ── */}
      <AnimatePresence initial={false}>
        {validationError && (
          <motion.div
            key="profile-validation"
            role="alert"
            {...bannerMotion}
            className="flex items-start justify-between gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <AlertCircleIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-warning"
              />
              <p className="text-body-sm font-medium leading-relaxed text-warning">
                {validationError}
              </p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setValidationError(null)}
              aria-label="Dismiss validation message"
              className="text-warning hover:bg-warning/10 hover:text-warning"
            >
              Dismiss
            </Button>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="profile-error"
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
              onClick={clearError}
              aria-label="Dismiss error"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Dismiss
            </Button>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            key="profile-success"
            role="status"
            {...bannerMotion}
            className="flex items-start justify-between gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <CheckCircle2Icon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-success"
              />
              <p className="text-body-sm font-medium leading-relaxed text-success">
                {successMsg}
              </p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSuccessMsg(null)}
              aria-label="Dismiss notification"
              className="text-success hover:bg-success/10 hover:text-success"
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Identity ── */}
      <section aria-labelledby="identity-heading" className="rounded-xl border border-border bg-card p-5">
        <h2 id="identity-heading" className="font-serif text-title-sm text-foreground">
          Profile Details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
              Full Name
            </span>
            <p className="mt-1 truncate font-serif text-title-sm text-foreground">
              {user.name}
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
              Username
            </span>
            <p className="mt-1 truncate font-mono text-title-sm text-primary">
              @{user.username}
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <span className="font-mono text-meta uppercase tracking-wider text-muted-foreground">
              Member Since
            </span>
            <p className="mt-1 font-serif text-title-sm text-foreground">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Active Member"}
            </p>
          </div>
        </div>
      </section>

      {/* ── AI Providers ── */}
      <section aria-labelledby="providers-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="providers-heading"
              className="flex items-center gap-2 font-serif text-title-lg text-foreground"
            >
              <KeyRoundIcon aria-hidden="true" className="size-5 text-primary" />
              AI Provider API Keys
            </h2>
            {/* Truthful security copy — Fernet symmetric encryption at rest */}
            <p className="mt-1 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
              Keys are validated for format, stored encrypted on AcademicStack servers,
              and never displayed again after saving. Add, update, or remove each
              provider individually.
            </p>
          </div>
          <Badge variant={isFullyConfigured ? "success" : "warning"} className="shrink-0 tabular-nums">
            {requiredCount} / {REQUIRED_PROVIDER_COUNT} required keys
          </Badge>
        </div>

        {/* Setup status — logic and copy preserved from the original page */}
        <div
          role="status"
          className={
            "flex items-start justify-between gap-3 rounded-md border px-4 py-3 " +
            (isFullyConfigured
              ? "border-success/30 bg-success/10"
              : "border-warning/30 bg-warning/10")
          }
        >
          <div className="flex min-w-0 items-start gap-2.5">
            {isFullyConfigured ? (
              <CheckCircle2Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <AlertCircleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
            )}
            <div className="min-w-0">
              <span
                className={
                  "text-body-sm font-semibold " +
                  (isFullyConfigured ? "text-success" : "text-warning")
                }
              >
                {isFullyConfigured
                  ? "All 4 Required AI Keys Active — Full AI Pipeline Unlocked!"
                  : `Setup Incomplete (${requiredCount}/${REQUIRED_PROVIDER_COUNT} Required Keys Configured)`}
              </span>
              <p className="mt-0.5 text-body-sm leading-relaxed text-muted-foreground">
                {isFullyConfigured
                  ? "Multi-provider failover is active. You can now extract questions, index notes, and generate answers."
                  : "Please add all 4 free provider keys below (Gemini, Groq, OpenRouter, and NVIDIA NIM) to unlock AI pipeline features."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {PROVIDERS.map((providerConfig) => (
            <ProviderCard
              key={providerConfig.id}
              provider={providerConfig}
              value={keysInput[providerConfig.id]}
              onValueChange={(value) => handleInputChange(providerConfig.id, value)}
              isShowing={showKey[providerConfig.id]}
              onToggleShow={() => toggleShowKey(providerConfig.id)}
              isProcessing={actionLoading[providerConfig.id]}
              configured={!!user[providerConfig.keyFlag]}
              onSave={() => handleSaveSingleKey(providerConfig)}
              onRemoveRequest={() =>
                setDeleteKeyCandidate({
                  id: providerConfig.id,
                  name: providerConfig.name,
                })
              }
            />
          ))}
        </div>
      </section>

      {/* ── Preferences & account ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WorkspacePreferences />
        <AccountActions />
      </div>

      {/* ── Remove-key confirmation — copy preserved verbatim ── */}
      <AlertDialog
        open={!!deleteKeyCandidate}
        onOpenChange={(open) => !open && setDeleteKeyCandidate(null)}
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
              <AlertDialogTitle>
                Remove {deleteKeyCandidate?.name} API Key?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove your stored{" "}
                {deleteKeyCandidate?.name} API key? Tasks relying on this provider will
                fall back to other configured keys.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-transparent focus-visible:ring-destructive/20"
            >
              Yes, Remove Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
