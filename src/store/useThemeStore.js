import { create } from 'zustand';

const THEME_KEY = 'academicstack_theme';

const applyThemeToDOM = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('dark');
  root.classList.add('light');
  root.setAttribute('data-theme', 'light');
};

export const useThemeStore = create(() => ({
  theme: 'light',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, 'light');
    }
    applyThemeToDOM();
  },
  toggleTheme: () => {
    applyThemeToDOM();
  },
  setTheme: () => {
    applyThemeToDOM();
  },
}));
