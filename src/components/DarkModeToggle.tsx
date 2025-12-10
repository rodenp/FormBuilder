import React from 'react';
import { Sun, Moon, Palette, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { clsx } from 'clsx';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'mini' | 'dropdown';
  showLabel?: boolean;
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  size = 'md',
  variant = 'button',
  showLabel = false,
  className
}) => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  const themeClasses = useThemeClasses();

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={iconSize} />;
      case 'dark':
        return <Moon size={iconSize} />;
      case 'auto':
      default:
        return <Palette size={iconSize} />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'auto':
      default:
        return `Auto (${effectiveTheme})`;
    }
  };

  if (variant === 'mini') {
    return (
      <button
        onClick={toggleTheme}
        className={clsx(
          'p-1 rounded-md transition-colors',
          themeClasses.textSecondary,
          'hover:' + themeClasses.textPrimary,
          'hover:' + themeClasses.bgHover,
          className
        )}
        title={`Current: ${getThemeLabel()}. Click to toggle.`}
      >
        {getThemeIcon()}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={clsx('relative', className)}>
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 mb-2">Theme</div>
          {(['light', 'dark', 'auto'] as const).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                theme === themeOption
                  ? clsx(themeClasses.bgAccent, themeClasses.textAccent, 'font-medium')
                  : clsx(themeClasses.textSecondary, 'hover:' + themeClasses.bgHover, 'hover:' + themeClasses.textPrimary)
              )}
            >
              {themeOption === 'light' && <Sun size={14} />}
              {themeOption === 'dark' && <Moon size={14} />}
              {themeOption === 'auto' && <Palette size={14} />}
              <span className="capitalize">
                {themeOption === 'auto' ? `Auto (${effectiveTheme})` : themeOption}
              </span>
              {theme === themeOption && (
                <div className="ml-auto">
                  <Eye size={12} className="opacity-60" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-colors',
        size === 'sm' ? 'px-2 py-1 text-xs' : size === 'md' ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base',
        themeClasses.button,
        className
      )}
      title={`Current: ${getThemeLabel()}. Click to toggle.`}
    >
      {getThemeIcon()}
      {showLabel && (
        <span>
          {theme === 'auto' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};