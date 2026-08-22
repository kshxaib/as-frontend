/**
 * Theme foundation — DESIGN_SYSTEM.md §1/§18.
 * Two themes only: Reading Room (light) / Midnight Library (dark).
 * Default: stored preference > system preference. Applied as `.dark` class.
 */
const STORAGE_KEY = 'academicstack_theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — session-only */
  }
  applyTheme(theme);
}

export function toggleTheme(current) {
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
