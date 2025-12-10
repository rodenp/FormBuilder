import React, { useState } from 'react';
import { Sun, Moon, Monitor, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { generateElementStyling, getEffectiveTheme } from '../utils/themeUtils';

interface DarkModePreviewProps {
  element: any;
  children: React.ReactNode;
  className?: string;
  showToggle?: boolean;
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void;
}

/**
 * Component wrapper that adds a dark mode toggle for previewing
 * how content looks in different themes
 */
export const DarkModePreview: React.FC<DarkModePreviewProps> = ({
  element,
  children,
  className,
  showToggle = true,
  onThemeChange,
}) => {
  const [localTheme, setLocalTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const effectiveTheme = getEffectiveTheme(localTheme);
  const styling = generateElementStyling(element, localTheme, true);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setLocalTheme(theme);
    onThemeChange?.(theme);
  };

  const ThemeButton = ({ theme, icon, label }: { theme: 'light' | 'dark' | 'auto'; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => handleThemeChange(theme)}
      className={clsx(
        'p-1.5 rounded-md transition-all duration-200',
        localTheme === theme
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
      )}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div 
      className={clsx('relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview controls - only show on hover */}
      {showToggle && isHovered && (
        <div className="absolute top-0 right-0 z-[9999] flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-1 border border-gray-200 dark:border-gray-700 pointer-events-auto"
             style={{ position: 'absolute', top: '0px', right: '0px' }}>
          <ThemeButton theme="light" icon={<Sun size={14} />} label="Light mode" />
          <ThemeButton theme="dark" icon={<Moon size={14} />} label="Dark mode" />
          <ThemeButton theme="auto" icon={<Monitor size={14} />} label="Auto (system)" />
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={clsx(
              'p-1.5 rounded-md transition-all duration-200',
              showPreview
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                : 'bg-orange-500 text-white'
            )}
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            {showPreview ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {effectiveTheme === 'dark' ? '🌙' : '☀️'} {effectiveTheme}
          </div>
        </div>
      )}

      {/* Content wrapper with theme styling */}
      <div
        style={showPreview ? styling : undefined}
        className={clsx(
          'transition-all duration-300',
          showPreview && effectiveTheme === 'dark' && 'dark'
        )}
      >
        {children}
      </div>

    </div>
  );
};