import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

/**
 * Tooltip — inverse ink chip (§19); composite wraps its own Provider
 * so it is safe to use before an app-level provider exists.
 */
function Tooltip({ children, ...props }) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

function TooltipTrigger({ className, ...props }) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

function TooltipContent({ className, children, side = "top", sideOffset = 6, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} className="z-50">
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 w-fit rounded-sm bg-foreground px-2.5 py-1 text-body-sm text-background shadow-md",
            "origin-(--transform-origin) transition-all duration-(--motion-fast) ease-standard",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[open]:scale-100 data-[open]:opacity-100",
            "data-[closed]:scale-95 data-[closed]:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
