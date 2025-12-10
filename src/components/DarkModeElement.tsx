import React, { useMemo } from 'react';
import type { FormElement } from '../types';
import { generateElementStyling, getOptimalTextColor, getSmartBackgroundColor } from '../utils/themeUtils';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

interface DarkModeElementProps {
  element: FormElement;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  forceTheme?: 'light' | 'dark' | 'auto';
}

/**
 * Smart dark mode aware element wrapper that automatically
 * applies appropriate colors based on theme
 */
export const DarkModeElement: React.FC<DarkModeElementProps> = ({
  element,
  children,
  className,
  style,
  forceTheme,
}) => {
  const { settings } = useStore();
  const theme = forceTheme || settings.theme || 'auto';
  
  const elementStyling = useMemo(() => {
    // Generate smart styling based on element type and theme
    const styling = generateElementStyling(element, theme, settings, settings.canvasTheme || 'light');
    
    // Additional element-specific styling
    const elementStyles: React.CSSProperties = {
      ...styling,
      ...style,
    };

    // Handle specific element types
    switch (element.type) {
      case 'container':
      case 'columns':
      case 'rows':
        // Containers remain transparent unless explicitly set
        if (!element.backgroundColor) {
          elementStyles.backgroundColor = 'transparent';
        }
        break;
        
      case 'button':
        // Buttons should have transparent wrapper - button handles its own styling
        elementStyles.backgroundColor = 'transparent';
        break;
        
      case 'text':
      case 'email':
      case 'number':
      case 'select':
      case 'textarea':
        // Form inputs
        if (!element.backgroundColor) {
          const bgColor = getSmartBackgroundColor(theme, undefined, 'input');
          elementStyles.backgroundColor = bgColor;
          elementStyles.color = getOptimalTextColor(bgColor, theme, true);
          elementStyles.borderColor = styling.borderColor;
        }
        break;
        
      case 'heading':
      case 'paragraph':
      case 'rich-text':
        // Text elements inherit container colors
        if (!element.backgroundColor) {
          elementStyles.backgroundColor = 'transparent';
          // Use inherited color unless specified
          if (!element.textColor) {
            elementStyles.color = 'inherit';
          }
        }
        break;
      case 'text-block':
        // Text-block should not override colors - it handles its own color calculation
        if (!element.backgroundColor) {
          elementStyles.backgroundColor = 'transparent';
        }
        break;
    }

    return elementStyles;
  }, [element, theme, settings.smartTextColors, style]);

  // Generate class names based on element type and theme
  const themeClasses = useMemo(() => {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const classes = [];
    
    // Base classes for all elements
    classes.push('transition-colors duration-200');
    
    // Element-specific classes
    switch (element.type) {
      case 'container':
        classes.push(
          isDark ? 'dark:border-gray-700' : 'border-gray-200',
          'rounded-lg'
        );
        break;
        
      case 'button':
        classes.push(
          'rounded-md font-medium',
          isDark ? 'hover:brightness-110' : 'hover:brightness-95'
        );
        break;
        
      case 'text':
      case 'email':
      case 'number':
      case 'select':
      case 'textarea':
        classes.push(
          'rounded-md border',
          isDark ? 'focus:border-blue-400 focus:ring-blue-400' : 'focus:border-blue-500 focus:ring-blue-500'
        );
        break;
    }
    
    return classes.join(' ');
  }, [element.type, theme]);

  return (
    <div
      className={clsx(themeClasses, className)}
      style={elementStyling}
      data-theme-element={element.type}
      data-theme={theme}
    >
      {children}
    </div>
  );
};

/**
 * Hook to get dark mode aware styles for an element
 */
export const useDarkModeElementStyles = (element: FormElement, forceTheme?: 'light' | 'dark' | 'auto') => {
  const { settings } = useStore();
  const theme = forceTheme || settings.theme || 'auto';
  
  return useMemo(() => {
    return generateElementStyling(element, theme, settings.smartTextColors);
  }, [element, theme, settings.smartTextColors]);
};