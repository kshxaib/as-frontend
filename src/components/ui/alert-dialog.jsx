import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * AlertDialog — DESIGN_SYSTEM.md §11 (confirmations).
 * Outside clicks / ESC intentionally do not dismiss; a decision is required.
 */
const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogTitle = AlertDialogPrimitive.Title
const AlertDialogDescription = AlertDialogPrimitive.Description

function AlertDialogContent({ className, children, ...props }) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        data-slot="alert-dialog-backdrop"
        className={cn(
          "fixed inset-0 z-50 bg-scrim backdrop-blur-[4px] transition-opacity duration-(--motion-base) ease-standard",
          "data-[starting-style]:opacity-0 data-[open]:opacity-100 data-[closed]:opacity-0"
        )}
      />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg sm:max-w-md",
          "transition-all duration-(--motion-base) ease-standard",
          "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
          "data-[open]:scale-100 data-[open]:opacity-100",
          "data-[closed]:scale-[0.97] data-[closed]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogCancel({ className, variant = "outline", ...props }) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button variant={variant} className={className} />}
      {...props}
    />
  )
}

function AlertDialogAction({ className, variant = "primary", ...props }) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      render={<Button variant={variant} className={className} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
}
