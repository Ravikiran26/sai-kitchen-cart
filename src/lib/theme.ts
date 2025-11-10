export type Theme = 'earthy' | 'festive' | 'minimal';

const THEME_KEY = 'srisai-theme';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'earthy';
  const stored = localStorage.getItem(THEME_KEY);
  return (stored as Theme) || 'earthy';
};

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
};

export const initTheme = (): Theme => {
  const theme = getStoredTheme();
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};
