import { useMediaQuery } from "@/hooks/use-media-query"
import { SidebarNav } from "./SidebarNav"
import { PipelineSteps } from "./PipelineSteps"
import { KeyStatus } from "./KeyStatus"

/**
 * Sidebar — DESIGN_SYSTEM.md §13 "The Stacks".
 * Tablet (768–1023): 72px icon rail with tooltips.
 * Desktop (≥1024): full 264px editorial sidebar with labels + pipeline.
 */
export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <aside
      data-slot="sidebar"
      aria-label="AcademicStack navigation"
      className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex lg:w-[264px]"
    >
      {/* Brand */}
      <div className="flex h-[60px] shrink-0 items-center gap-2.5 border-b border-sidebar-border px-3 lg:px-4">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-serif text-body-base font-semibold text-primary"
        >
          A
        </span>
        {isDesktop && (
          <span className="min-w-0">
            <span className="block truncate font-serif text-body-base font-semibold tracking-tight">
              AcademicStack
            </span>
            <span className="block font-mono text-meta uppercase text-muted-foreground">
              AI Study Engine
            </span>
          </span>
        )}
      </div>

      <SidebarNav showLabels={isDesktop} />


      {/* Footer zone */}
      <div className="shrink-0 border-t border-sidebar-border p-3 lg:p-4">
        <KeyStatus compact={!isDesktop} />
      </div>
    </aside>
  )
}
