import { create } from 'zustand';

const THEME_KEY = 'academicstack_theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // Midnight Library by default
};

const applyThemeToDOM = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  }
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  initTheme: () => {
    const current = get().theme;
    applyThemeToDOM(current);
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyThemeToDOM(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
}));
