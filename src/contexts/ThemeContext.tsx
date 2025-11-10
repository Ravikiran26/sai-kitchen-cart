import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, initTheme, setStoredTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('earthy');

  useEffect(() => {
    const initialTheme = initTheme();
    setThemeState(initialTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
