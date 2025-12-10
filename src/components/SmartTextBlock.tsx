import React, { useState, useEffect } from 'react';
import { Type, Palette, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { getOptimalTextColor, getEffectiveTheme } from '../utils/themeUtils';
import { useStore } from '../store/useStore';

interface SmartTextBlockProps {
  content: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  className?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

/**
 * Smart text block that automatically adjusts colors based on background
 * and theme, with live preview capabilities
 */
export const SmartTextBlock: React.FC<SmartTextBlockProps> = ({
  content,
  backgroundColor = 'transparent',
  textColor,
  fontSize = 16,
  fontWeight = 'normal',
  className,
  onChange,
  editable = false,
}) => {
  const { settings } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [showColorInfo, setShowColorInfo] = useState(false);
  
  const theme = settings.theme || 'auto';
  const effectiveTheme = getEffectiveTheme(theme);
  
  // Calculate smart text color
  const smartTextColor = textColor || getOptimalTextColor(
    backgroundColor,
    theme,
    settings.smartTextColors !== false
  );

  // Get parent background color if transparent
  const getEffectiveBackground = () => {
    if (backgroundColor && backgroundColor !== 'transparent') {
      return backgroundColor;
    }
    // Default backgrounds based on theme
    return effectiveTheme === 'dark' ? '#1f2937' : '#ffffff';
  };

  const effectiveBackground = getEffectiveBackground();
  const contrastRatio = calculateContrastRatio(smartTextColor, effectiveBackground);
  const meetsWCAG_AA = contrastRatio >= 4.5;
  const meetsWCAG_AAA = contrastRatio >= 7.0;

  // Calculate contrast ratio for display
  function calculateContrastRatio(color1: string, color2: string): number {
    // Simplified calculation for demo
    const isDark1 = color1.toLowerCase() === '#ffffff' || color1.toLowerCase() === 'white';
    const isDark2 = color2.toLowerCase() === '#000000' || color2.toLowerCase() === 'black';
    
    if (isDark1 !== isDark2) return 21; // Maximum contrast
    return 1; // Minimum contrast
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setLocalContent(newContent);
    onChange?.(newContent);
  };

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  return (
    <div className={clsx('relative group', className)}>
      {/* Smart color info overlay */}
      {showColorInfo && (
        <div className="absolute -top-20 left-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 text-xs border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: effectiveBackground }} />
              <span>Background: {effectiveBackground}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: smartTextColor }} />
              <span>Text: {smartTextColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette size={12} />
              <span>Contrast: {contrastRatio.toFixed(1)}:1</span>
              {meetsWCAG_AAA && <span className="text-green-600 dark:text-green-400">✓ AAA</span>}
              {!meetsWCAG_AAA && meetsWCAG_AA && <span className="text-yellow-600 dark:text-yellow-400">✓ AA</span>}
              {!meetsWCAG_AA && <span className="text-red-600 dark:text-red-400">✗ Fail</span>}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Theme: {effectiveTheme} | Smart Colors: {settings.smartTextColors ? 'On' : 'Off'}
            </div>
          </div>
        </div>
      )}

      {/* Text content */}
      <div
        contentEditable={editable && isEditing}
        suppressContentEditableWarning
        onBlur={() => setIsEditing(false)}
        onInput={handleContentChange}
        className={clsx(
          'outline-none transition-all duration-200',
          editable && 'cursor-text hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 rounded px-1',
          isEditing && 'ring-2 ring-blue-500'
        )}
        style={{
          color: smartTextColor,
          backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          minHeight: '1.5em',
        }}
        onClick={() => editable && setIsEditing(true)}
      >
        {localContent || 'Click to edit text...'}
      </div>

      {/* Hover controls */}
      {editable && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => setShowColorInfo(!showColorInfo)}
            className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700"
            title="Show color info"
          >
            <Eye size={12} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700"
            title="Edit text"
          >
            <Type size={12} />
          </button>
        </div>
      )}

      {/* Smart color indicator */}
      {settings.smartTextColors && (
        <div 
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: smartTextColor }}
          title="Smart color active"
        />
      )}
    </div>
  );
};

/**
 * Text block preset configurations for different contexts
 */
export const TextBlockPresets = {
  hero: {
    light: {
      fontSize: 48,
      fontWeight: 'bold',
      backgroundColor: '#ffffff',
    },
    dark: {
      fontSize: 48,
      fontWeight: 'bold', 
      backgroundColor: '#1f2937',
    }
  },
  body: {
    light: {
      fontSize: 16,
      fontWeight: 'normal',
      backgroundColor: 'transparent',
    },
    dark: {
      fontSize: 16,
      fontWeight: 'normal',
      backgroundColor: 'transparent',
    }
  },
  caption: {
    light: {
      fontSize: 14,
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      textColor: '#6b7280',
    },
    dark: {
      fontSize: 14,
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      textColor: '#9ca3af',
    }
  },
};