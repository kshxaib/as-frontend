import { MoonIcon, SunIcon } from "lucide-react"

import { getStoredTheme, getSystemTheme, setTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  {
    value: "light",
    label: "Reading Room",
    description: "Paper-bright study environment.",
    icon: SunIcon,
  },
  {
    value: "dark",
    label: "Midnight Library",
    description: "Low-light workspace for long sessions.",
    icon: MoonIcon,
  },
]

/**
 * WorkspacePreferences — the one real preference that exists (theme).
 * Reuses lib/theme.js directly; no second theme implementation.
 */
export function WorkspacePreferences() {
  const current = getStoredTheme() ?? getSystemTheme()

  return (
    <section
      data-slot="workspace-preferences"
      aria-labelledby="preferences-heading"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h2 id="preferences-heading" className="font-serif text-title-sm text-foreground">
        Workspace Preferences
      </h2>

      <fieldset className="mt-4">
        <legend className="text-body-sm font-medium text-foreground">Theme</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = current === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border border-input bg-card p-3.5 shadow-xs transition-all duration-(--motion-fast) ease-standard",
                  "hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5",
                  "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30"
                )}
              >
                <input
                  type="radio"
                  name="workspace-theme"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => setTheme(option.value)}
                  className="sr-only peer"
                />
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground peer-checked:text-primary"
                />
                <span className="min-w-0">
                  <span className="block text-body-sm font-semibold text-foreground peer-checked:text-primary">
                    {option.label}
                  </span>
                  <span className="block text-body-sm text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
