import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle = ({ compact = false }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Reading Room (Light)' : 'Switch to Midnight Library (Dark)'}
      aria-label="Toggle visual theme"
      className="flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5 text-[var(--community)] shrink-0" />
          {!compact && <span className="font-mono text-[11px] uppercase tracking-wider">Reading Room</span>}
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
          {!compact && <span className="font-mono text-[11px] uppercase tracking-wider">Midnight</span>}
        </>
      )}
    </button>
  );
};
