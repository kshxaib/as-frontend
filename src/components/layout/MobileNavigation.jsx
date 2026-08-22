import { useQuestionBankStore } from "@/store/useQuestionBankStore"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { SidebarNav } from "./SidebarNav"
import { KeyStatus } from "./KeyStatus"

/**
 * MobileNavigation — task 9. Sheet-based drawer (<768px).
 * Same nav config/indicators as the desktop sidebar — one system, two shells.
 * Keyboard accessibility + focus trap come from Base UI Dialog.
 */
export function MobileNavigation({ open, onOpenChange }) {
  const activeTab = useQuestionBankStore((s) => s.activeTab)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px]"
        aria-label="AcademicStack navigation"
      >
        <SheetHeader>
          <SheetTitle className="font-serif">AcademicStack</SheetTitle>
          <SheetDescription className="font-mono text-meta uppercase">
            AI Study Engine · {activeTab}
          </SheetDescription>
        </SheetHeader>

        <SidebarNav showLabels onNavigate={() => onOpenChange(false)} />

        <div className="mt-auto border-t border-border p-4">
          <KeyStatus />
        </div>
      </SheetContent>
    </Sheet>
  )
}
