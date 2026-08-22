import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DropdownMenu — DESIGN_SYSTEM.md §9/§11 overflow pattern.
 * Wraps Base UI Menu; styled Content assembles Portal + Positioner + Popup.
 */
const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger
const DropdownMenuGroup = MenuPrimitive.Group
const DropdownMenuSubmenuRoot = MenuPrimitive.SubmenuRoot
const DropdownMenuSubmenuTrigger = MenuPrimitive.SubmenuTrigger
const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

function DropdownMenuContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset,
  children,
  ...props
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "origin-(--transform-origin) transition-all duration-(--motion-fast) ease-standard",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[open]:scale-100 data-[open]:opacity-100",
            "data-[closed]:scale-95 data-[closed]:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, inset, ...props }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm outline-none transition-colors",
        "focus-visible:bg-muted data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-body-sm outline-none transition-colors",
        "focus-visible:bg-muted data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioItem({ className, children, ...props }) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-body-sm outline-none transition-colors",
        "focus-visible:bg-muted data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({ className, ...props }) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 font-mono text-meta uppercase text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSubmenuRoot,
  DropdownMenuSubmenuTrigger,
}
