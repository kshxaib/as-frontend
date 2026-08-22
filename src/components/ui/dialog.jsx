import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Dialog — DESIGN_SYSTEM.md §11.
 * Base UI Dialog parts; scrim per §2.5; transitions via data attributes (§16).
 */
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-backdrop"
        className={cn(
          "fixed inset-0 z-50 bg-scrim backdrop-blur-[4px] transition-opacity duration-(--motion-base) ease-standard",
          "data-[starting-style]:opacity-0 data-[open]:opacity-100 data-[closed]:opacity-0"
        )}
      />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg sm:max-w-lg",
          "transition-all duration-(--motion-base) ease-standard",
          "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
          "data-[open]:scale-100 data-[open]:opacity-100",
          "data-[closed]:scale-[0.97] data-[closed]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground opacity-80 transition-colors hover:bg-muted hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/30 outline-none"
          >
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 pr-8", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
