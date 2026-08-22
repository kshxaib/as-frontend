import { useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { getStoredTheme, getSystemTheme, toggleTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"

/**
 * ThemeToggle — task 8. Reading Room (light) ↔ Midnight Library (dark).
 * Semantic tokens only; no third theme.
 */
export function ThemeToggle({ className }) {
  const [theme, setThemeState] = useState(
    () => getStoredTheme() ?? getSystemTheme()
  )

  const handleToggle = () => {
    setThemeState(toggleTheme(theme))
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleToggle}
      aria-label={
        theme === "dark"
          ? "Switch to light theme (Reading Room)"
          : "Switch to dark theme (Midnight Library)"
      }
      title={theme === "dark" ? "Reading Room (light)" : "Midnight Library (dark)"}
    >
      {theme === "dark" ? (
        <SunIcon className="size-[18px]" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-[18px]" aria-hidden="true" />
      )}
    </Button>
  )
}
