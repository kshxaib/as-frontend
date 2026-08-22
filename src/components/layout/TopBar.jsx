import { MenuIcon } from "lucide-react"

import { getPageTitle } from "./nav-config"
import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { UserMenu } from "./UserMenu"

/**
 * TopBar — task 5. Quiet 60px context bar; the sidebar remains primary nav.
 */
export function TopBar({ onOpenNavigation }) {
  const activeTab = useQuestionBankStore((s) => s.activeTab)
  const title = getPageTitle(activeTab)

  return (
    <header
      data-slot="topbar"
      className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-3 border-b border-border bg-background px-4 sm:px-6 lg:px-8"
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenNavigation}
        aria-label="Open navigation menu"
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </Button>

      <h2 className="min-w-0 truncate font-serif text-title-sm text-foreground">
        {title}
      </h2>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu showName={false} />
      </div>
    </header>
  )
}
