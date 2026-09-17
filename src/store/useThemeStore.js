import { create } from 'zustand';

const THEME_KEY = 'academicstack_theme';

const applyThemeToDOM = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light');
  root.classList.add('dark');
  root.setAttribute('data-theme', 'dark');
};

export const useThemeStore = create(() => ({
  theme: 'dark',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, 'dark');
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
