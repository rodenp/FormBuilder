import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getEffectiveTheme, getSystemTheme } from '../utils/themeUtils';

interface ThemeContextValue {
  theme: 'light' | 'dark' | 'auto';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, setTheme: setStoreTheme, toggleTheme: toggleStoreTheme } = useStore();
  
  const theme = settings.theme || 'auto';
  const effectiveTheme = getEffectiveTheme(theme);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove any existing theme attributes
    root.removeAttribute('data-theme');
    
    // Apply the effective theme
    if (effectiveTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    }
    
    // Add class for body styling
    document.body.style.backgroundColor = effectiveTheme === 'dark' 
      ? 'var(--theme-bg-secondary)' 
      : 'var(--theme-bg-secondary)';
    document.body.style.color = effectiveTheme === 'dark'
      ? 'var(--theme-text-primary)'
      : 'var(--theme-text-primary)';
    
  }, [effectiveTheme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        // Re-trigger theme application when system preference changes
        const newEffectiveTheme = getEffectiveTheme('auto');
        const root = document.documentElement;
        
        root.removeAttribute('data-theme');
        if (newEffectiveTheme === 'dark') {
          root.setAttribute('data-theme', 'dark');
        }
        
        document.body.style.backgroundColor = newEffectiveTheme === 'dark' 
          ? 'var(--theme-bg-secondary)' 
          : 'var(--theme-bg-secondary)';
        document.body.style.color = newEffectiveTheme === 'dark'
          ? 'var(--theme-text-primary)'
          : 'var(--theme-text-primary)';
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    effectiveTheme,
    setTheme: setStoreTheme,
    toggleTheme: toggleStoreTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};