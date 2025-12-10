import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

/**
 * Hook for getting theme-aware CSS classes
 */
export const useThemeClasses = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return useMemo(() => ({
    // Background classes
    bgPrimary: isDark ? 'bg-gray-800' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-900' : 'bg-gray-50',
    bgTertiary: isDark ? 'bg-gray-950' : 'bg-gray-100',
    bgAccent: isDark ? 'bg-gray-700' : 'bg-blue-50',
    bgCanvas: isDark ? 'bg-gray-800' : 'bg-slate-100',
    bgInput: isDark ? 'bg-gray-700' : 'bg-white',
    bgHover: isDark ? 'bg-gray-700' : 'bg-gray-100',
    bgActive: isDark ? 'bg-gray-600' : 'bg-gray-200',

    // Text classes
    textPrimary: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-400' : 'text-gray-500',
    textAccent: isDark ? 'text-blue-400' : 'text-blue-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-500',

    // Border classes
    borderPrimary: isDark ? 'border-gray-600' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-500' : 'border-gray-300',
    borderFocus: isDark ? 'border-blue-400' : 'border-blue-500',

    // Combined utility classes
    panel: clsx(
      isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
      'border'
    ),
    card: clsx(
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      'border rounded-lg shadow-sm'
    ),
    input: clsx(
      isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
      'border rounded-md'
    ),
    button: clsx(
      isDark ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
      'border rounded-md transition-colors'
    ),

    // Theme indicator
    isDark,
    isLight: !isDark,
    theme: effectiveTheme,
  }), [isDark, effectiveTheme]);
};

/**
 * Component-specific theme class generators
 */
export const getComponentThemeClasses = (effectiveTheme: 'light' | 'dark') => {
  const isDark = effectiveTheme === 'dark';

  return {
    // Form Builder specific components
    canvas: {
      background: isDark ? 'bg-gray-800' : 'bg-slate-100',
      text: isDark ? 'text-gray-100' : 'text-gray-900',
    },
    sidebar: {
      background: isDark ? 'bg-gray-900' : 'bg-white',
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      text: isDark ? 'text-gray-100' : 'text-gray-900',
    },
    properties: {
      background: isDark ? 'bg-gray-900' : 'bg-white',
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      text: isDark ? 'text-gray-100' : 'text-gray-900',
      accent: isDark ? 'bg-gray-800' : 'bg-gray-50',
    },
    modal: {
      background: isDark ? 'bg-gray-800' : 'bg-white',
      overlay: isDark ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-30',
      border: isDark ? 'border-gray-600' : 'border-gray-200',
    },
    element: {
      background: isDark ? 'bg-gray-700' : 'bg-white',
      border: isDark ? 'border-gray-600' : 'border-gray-200',
      text: isDark ? 'text-gray-100' : 'text-gray-900',
      hover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-50',
    },
  };
};