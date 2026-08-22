import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Sheet — DESIGN_SYSTEM.md §13 (mobile drawer) built on Base UI Dialog.
 * Side variants slide in with the standard easing; scrim per §2.5.
 */
const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

function SheetContent({
  className,
  children,
  side = "left",
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop
        data-slot="sheet-backdrop"
        className={cn(
          "fixed inset-0 z-50 bg-scrim backdrop-blur-[4px] transition-opacity duration-(--motion-base) ease-standard",
          "data-[starting-style]:opacity-0 data-[open]:opacity-100 data-[closed]:opacity-0"
        )}
      />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 border-border bg-card text-card-foreground shadow-lg transition-all duration-(--motion-slow) ease-standard",
          // left / right rails
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[starting-style]:-translate-x-full data-[open]:translate-x-0 data-[closed]:-translate-x-full",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[starting-style]:translate-x-full data-[open]:translate-x-0 data-[closed]:translate-x-full",
          // top / bottom panels (mobile filters, etc.)
          side === "top" &&
            "inset-x-0 top-0 border-b data-[starting-style]:-translate-y-full data-[open]:translate-y-0 data-[closed]:-translate-y-full",
          side === "bottom" &&
            "inset-x-0 bottom-0 rounded-t-xl border-t data-[starting-style]:translate-y-full data-[open]:translate-y-0 data-[closed]:translate-y-full",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground opacity-80 transition-colors hover:bg-muted hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/30 outline-none"
          >
            <XIcon className="size-4" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 px-5 pt-5", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex items-center gap-2 border-t border-border px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-title-lg text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
