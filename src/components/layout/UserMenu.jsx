import { useState } from "react"
import { ChevronDownIcon, KeyRoundIcon, LogOutIcon } from "lucide-react"

import { useAuthStore } from "@/store/useAuthStore"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

/**
 * UserMenu — task 6. Existing actions only: Profile & Keys, Sign out.
 * Logout keeps its original confirmation step, now on the shared
 * AlertDialog primitive (Phase 11 consolidation).
 */
export function UserMenu({ showName = true }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const initial = (user?.name?.[0] || "U").toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          data-slot="user-menu-trigger"
          render={
            <Button
              variant="ghost"
              aria-label="Account menu"
              className="h-9 gap-2 px-2"
            >
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-serif text-body-sm font-semibold text-primary"
              >
                {initial}
              </span>
              {showName && (
                <span className="hidden min-w-0 max-w-[10rem] truncate sm:inline">
                  {user?.name?.split(" ")[0] ?? "Account"}
                </span>
              )}
              <ChevronDownIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="normal-case tracking-normal">
              <span className="block truncate font-sans text-body-sm font-semibold text-foreground">
                {user?.name ?? "Signed in"}
              </span>
              <span className="block truncate font-mono text-meta">
                @{user?.username ?? "user"}
              </span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setActiveTab("profile")}>
            <KeyRoundIcon aria-hidden="true" />
            Profile & Keys
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setConfirmOpen(true)
            }}
          >
            <LogOutIcon aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            <AlertDialogAction
              variant="primary"
              onClick={() => {
                setConfirmOpen(false)
                logout()
              }}
            >
              Yes, Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
