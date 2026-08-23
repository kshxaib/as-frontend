import { useState } from "react"
import { LogOutIcon } from "lucide-react"

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
import { useAuthStore } from "@/store/useAuthStore"

/**
 * AccountActions — real account actions only.
 * Sign-out mirrors the existing UserMenu behavior (confirm, then store
 * logout()); account deletion does not exist in the backend and is
 * therefore NOT offered.
 */
export function AccountActions() {
  const logout = useAuthStore((s) => s.logout)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <section
      data-slot="account-actions"
      aria-labelledby="account-heading"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h2 id="account-heading" className="font-serif text-title-sm text-foreground">
        Account
      </h2>
      <p className="mt-1.5 max-w-[52ch] text-body-sm leading-relaxed text-muted-foreground">
        Sign out of this device. Your configured API keys remain securely stored on
        AcademicStack servers.
      </p>

      <Button variant="destructive" className="mt-4" onClick={() => setConfirmOpen(true)}>
        <LogOutIcon aria-hidden="true" />
        Sign Out
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(false)}>
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-warning/30 bg-warning/10 text-warning"
            >
              <LogOutIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialogTitle>Sign Out of AcademicStack?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? Your configured API keys will remain
                securely encrypted on your account.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Signed In</AlertDialogCancel>
            <AlertDialogAction variant="primary" onClick={() => logout()}>
              Yes, Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
