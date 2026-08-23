import { ArrowRightIcon, CheckCircle2Icon, KeyRoundIcon } from "lucide-react"

import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { useAuthStore } from "@/store/useAuthStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"

/**
 * ApiKeyRequiredModal — Phase 11 rebuild on shared primitives.
 * Gate logic, provider list, and copy preserved; presentation is now
 * token-based and consistent with every other dialog.
 */
export const ApiKeyRequiredModal = () => {
  const { isKeyModalOpen, keyModalFeature, closeKeyModal, setActiveTab } =
    useQuestionBankStore()
  const { user } = useAuthStore()

  const handleGoToProfile = () => {
    closeKeyModal()
    setActiveTab("profile")
  }

  const keyList = [
    { name: "Google Gemini", isSet: !!user?.has_gemini_key, role: "Vector Embeddings & RAG" },
    { name: "Groq Cloud", isSet: !!user?.has_groq_key, role: "Fast RAG Generation" },
    {
      name: "OpenRouter",
      isSet: !!user?.has_openrouter_key,
      role: "Question Extraction (free models)",
    },
    { name: "NVIDIA NIM", isSet: !!user?.has_nvidia_key, role: "Academic Reviewer (10k RPD)" },
  ]

  const configuredCount = keyList.filter((k) => k.isSet).length

  return (
    <Dialog open={isKeyModalOpen} onOpenChange={(open) => !open && closeKeyModal()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 font-serif">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-warning/30 bg-warning/10 text-warning"
            >
              <KeyRoundIcon className="size-5" />
            </span>
            4 Required Free API Keys
          </DialogTitle>
          <DialogDescription>
            Blocked action:{" "}
            <span className="font-semibold text-foreground">
              {keyModalFeature || "AI Feature"}
            </span>
            . To ensure zero downtime, high speed, and prevent quota exhaustion, all 4
            free API providers are required:
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3.5">
          {keyList.map((k) => (
            <li
              key={k.name}
              className="flex items-center justify-between gap-3 border-b border-border py-1.5 last:border-0"
            >
              <div className="min-w-0">
                <span className="text-body-sm font-semibold text-foreground">{k.name}</span>
                <span className="ml-2 text-body-sm text-muted-foreground">({k.role})</span>
              </div>
              {k.isSet ? (
                <StatusBadge tone="success" label="Active" icon={CheckCircle2Icon} />
              ) : (
                <StatusBadge tone="destructive" label="Missing" dot />
              )}
            </li>
          ))}
        </ul>

        <p className="font-mono text-meta uppercase tracking-wider tabular-nums text-muted-foreground">
          {configuredCount} / 4 keys configured · Keys are free — no credit card required
        </p>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" onClick={closeKeyModal}>
            Cancel
          </Button>
          <Button onClick={handleGoToProfile}>
            Add Missing Keys in Profile
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
