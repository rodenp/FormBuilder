/**
 * Utility functions for theme management and smart text color calculations
 */

// Calculate luminance of a color (0-1, where 0 is darkest and 1 is lightest)
export function getLuminance(color: string): number {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Convert to linear RGB
    const toLinear = (c: number) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    // Calculate luminance using WCAG formula
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Determine if a color is dark or light
export function isColorDark(color: string): boolean {
    return getLuminance(color) < 0.5;
}

// Get optimal text color for a background color using semantic color principles
export function getOptimalTextColor(
    backgroundColor: string | undefined,
    theme: 'light' | 'dark' | 'auto' = 'auto',
    smartTextColors = true
): string {
    const effectiveTheme = getEffectiveTheme(theme);
    const themeColors = getThemeColors(theme);
    
    // If smart text colors is disabled, use semantic theme defaults
    if (!smartTextColors || !backgroundColor) {
        return effectiveTheme === 'dark' ? themeColors['text-emphasis'] : themeColors.text;
    }

    // Try to parse background color
    let bgColor = backgroundColor;
    if (!bgColor || bgColor === 'transparent') {
        // No background color, use semantic theme text color
        return effectiveTheme === 'dark' ? themeColors.text : themeColors.text;
    }

    // Ensure color is in hex format
    if (!bgColor.startsWith('#')) {
        // Handle named colors or other formats by creating a temporary element
        const div = document.createElement('div');
        div.style.color = bgColor;
        document.body.appendChild(div);
        const computedColor = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        // Convert rgb to hex
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            bgColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        } else {
            // Fallback to semantic theme text color
            return effectiveTheme === 'dark' ? themeColors.text : themeColors.text;
        }
    }

    // Calculate optimal text color using high contrast semantic colors
    const whiteContrast = getContrastRatio(bgColor, themeColors['text-emphasis']);
    const blackContrast = getContrastRatio(bgColor, '#000000');
    const themeTextContrast = getContrastRatio(bgColor, themeColors.text);
    
    // Use the color with the best contrast, prioritizing semantic colors
    if (themeTextContrast >= 4.5) {
        return themeColors.text;
    } else if (whiteContrast > blackContrast && whiteContrast >= 4.5) {
        return themeColors['text-emphasis'];
    } else if (blackContrast >= 4.5) {
        return '#000000';
    } else {
        // Fallback to highest contrast
        return whiteContrast > blackContrast ? themeColors['text-emphasis'] : '#000000';
    }
}

// Get theme-aware colors for UI elements using semantic color principles
export function getThemeColors(theme: 'light' | 'dark' | 'auto') {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
        isDark,
        // Semantic background colors
        background: isDark ? '#0f172a' : '#ffffff',     // slate-900 / white
        surface: isDark ? '#1e293b' : '#f8fafc',        // slate-800 / slate-50
        'surface-alt': isDark ? '#334155' : '#f1f5f9',  // slate-700 / slate-100
        muted: isDark ? '#475569' : '#e2e8f0',          // slate-600 / slate-200
        
        // Semantic text colors
        text: isDark ? '#f8fafc' : '#0f172a',           // slate-50 / slate-900
        'text-secondary': isDark ? '#94a3b8' : '#64748b', // slate-400 / slate-500
        'text-muted': isDark ? '#64748b' : '#94a3b8',   // slate-500 / slate-400
        'text-emphasis': isDark ? '#ffffff' : '#000000', // white / black
        
        // UI colors
        border: isDark ? '#475569' : '#e2e8f0',         // slate-600 / slate-200
        'border-subtle': isDark ? '#334155' : '#f1f5f9', // slate-700 / slate-100
        accent: isDark ? '#60a5fa' : '#2563eb',          // blue-400 / blue-600
        hover: isDark ? '#334155' : '#f1f5f9',          // slate-700 / slate-100
        focus: isDark ? '#475569' : '#e2e8f0',          // slate-600 / slate-200
    };
}

// Check if system prefers dark mode
export function getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

// Get effective theme (resolve 'auto' to actual theme)
export function getEffectiveTheme(theme: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
    if (theme === 'auto') {
        return getSystemTheme();
    }
    return theme;
}

// Get smart background color based on theme
export function getSmartBackgroundColor(
    theme: 'light' | 'dark' | 'auto',
    userBackgroundColor?: string,
    elementType?: string
): string {
    // If user provided a specific color, use it
    if (userBackgroundColor && userBackgroundColor !== 'transparent') {
        return userBackgroundColor;
    }

    const effectiveTheme = getEffectiveTheme(theme);
    
    // Ensure effectiveTheme is valid
    if (!effectiveTheme || (effectiveTheme !== 'light' && effectiveTheme !== 'dark')) {
        console.warn('Invalid effectiveTheme:', effectiveTheme, 'theme:', theme);
        return 'transparent';
    }
    
    // Semantic background colors following Tailwind best practices
    const semanticBackgrounds = {
        light: {
            // Base surfaces
            background: '#ffffff',
            surface: '#f8fafc',      // slate-50
            'surface-alt': '#f1f5f9', // slate-100
            muted: '#e2e8f0',        // slate-200
            // Form elements
            input: '#ffffff',
            textarea: '#ffffff',
            select: '#ffffff',
            button: '#e2e8f0',       // slate-200 - better contrast than white
            // Container elements
            form: '#ffffff',
            container: '#f8fafc',    // slate-50
            menu: 'transparent',
            // Text elements (transparent to inherit)
            text: 'transparent',
            heading: 'transparent',
            'text-block': 'transparent',
            paragraph: 'transparent',
            'rich-text': 'transparent',
            // Form controls
            checkbox: 'transparent',
            radio: 'transparent',
            // Input variants
            email: '#ffffff',
            password: '#ffffff',
            number: '#ffffff',
            tel: '#ffffff',
            url: '#ffffff',
            date: '#ffffff',
            time: '#ffffff',
            'datetime-local': '#ffffff',
        },
        dark: {
            // Base surfaces - following semantic color principles
            background: '#0f172a',    // slate-900
            surface: '#1e293b',      // slate-800
            'surface-alt': '#334155', // slate-700
            muted: '#475569',        // slate-600
            // Form elements - proper contrast for dark mode
            input: '#1e293b',        // slate-800
            textarea: '#1e293b',     // slate-800
            select: '#1e293b',       // slate-800
            button: '#475569',       // slate-600 - better visibility in dark mode
            // Container elements
            form: '#0f172a',         // slate-900
            container: '#1e293b',    // slate-800
            menu: 'transparent',
            // Text elements (transparent to inherit)
            text: 'transparent',
            heading: 'transparent',
            'text-block': 'transparent',
            paragraph: 'transparent',
            'rich-text': 'transparent',
            // Form controls
            checkbox: 'transparent',
            radio: 'transparent',
            // Input variants
            email: '#1e293b',        // slate-800
            password: '#1e293b',     // slate-800
            number: '#1e293b',       // slate-800
            tel: '#1e293b',          // slate-800
            url: '#1e293b',          // slate-800
            date: '#1e293b',         // slate-800
            time: '#1e293b',         // slate-800
            'datetime-local': '#1e293b', // slate-800
        }
    };

    const themeBackgrounds = semanticBackgrounds[effectiveTheme];
    if (!themeBackgrounds) {
        console.warn('No theme backgrounds found for theme:', effectiveTheme);
        return 'transparent';
    }
    
    return themeBackgrounds[elementType as keyof typeof semanticBackgrounds.light] || 
           themeBackgrounds.background;
}

// Get smart border color based on theme using semantic colors
export function getSmartBorderColor(
    theme: 'light' | 'dark' | 'auto',
    userBorderColor?: string
): string {
    if (userBorderColor) return userBorderColor;
    
    const themeColors = getThemeColors(theme);
    return themeColors.border;
}

// Get semantic text color based on theme and element type
export function getSemanticTextColor(
    theme: 'light' | 'dark' | 'auto',
    elementType?: string,
    userTextColor?: string
): string {
    // If user provided a specific color, use it
    if (userTextColor && userTextColor !== 'transparent') {
        return userTextColor;
    }
    
    const themeColors = getThemeColors(theme);
    
    // Element-specific text colors
    const semanticTextColors = {
        // Form elements need high contrast
        input: themeColors.text,
        textarea: themeColors.text,
        select: themeColors.text,
        button: themeColors.text,
        
        // Text elements
        text: themeColors.text,
        heading: themeColors['text-emphasis'],
        paragraph: themeColors.text,
        'rich-text': themeColors.text,
        'text-block': themeColors.text,
        
        // Default fallback
        default: themeColors.text
    };
    
    return semanticTextColors[elementType as keyof typeof semanticTextColors] || semanticTextColors.default;
}

// Generate complete element styling based on theme using semantic colors
export function generateElementStyling(
    element: any,
    elements: any[],
    settings: any,
    canvasTheme: 'light' | 'dark'
) {
    // Ensure canvasTheme is valid
    if (!canvasTheme || (canvasTheme !== 'light' && canvasTheme !== 'dark')) {
        console.warn('Invalid canvasTheme in generateElementStyling:', canvasTheme);
        canvasTheme = 'light'; // Default fallback
    }
    
    // Use EXACT text-block inheritance logic - copied verbatim for backward compatibility
    const bodyBackground = settings?.formBackground || settings?.bodyBackground;
    const inheritedBg = getInheritedBackgroundColor(elements, element.id, bodyBackground);
    const darkModeDisabled = shouldDisableDarkMode(elements, element.id, bodyBackground, settings);
    const calculatedTextColor = getEffectiveTextColor(elements, element, bodyBackground, canvasTheme, settings);
    
    // Get semantic theme colors
    const themeColors = getThemeColors(canvasTheme);
    
    // Get semantic background color
    const semanticBackgroundColor = getSmartBackgroundColor(
        canvasTheme, 
        element.backgroundColor, 
        element.type
    );
    
    // Get semantic text color with fallback to calculated color
    let semanticTextColor = getSemanticTextColor(
        canvasTheme,
        element.type,
        element.textColor
    );
    
    // Use calculated text color if available (for inheritance logic compatibility)
    if (calculatedTextColor) {
        semanticTextColor = calculatedTextColor;
    }
    
    // For elements with explicit background, calculate optimal text color
    if (element.backgroundColor && element.backgroundColor !== 'transparent') {
        semanticTextColor = getOptimalTextColor(element.backgroundColor, canvasTheme, true);
    }
    
    // Get semantic border color
    const semanticBorderColor = getSmartBorderColor(canvasTheme, element.borderColor);
    
    // Use inherited or element background for display (backward compatibility)
    const displayBg = element.backgroundColor || inheritedBg || 'transparent';
    
    // Determine final background - prioritize semantic color unless explicitly overridden
    const finalBackgroundColor = element.backgroundColor || semanticBackgroundColor;
    
    return {
        // Container styling with semantic colors
        containerStyle: {
            backgroundColor: finalBackgroundColor,
            color: semanticTextColor,
            borderColor: semanticBorderColor,
            padding: `${(element.paddingTop ?? 3) * 0.25}rem ${(element.paddingRight ?? 3) * 0.25}rem ${(element.paddingBottom ?? 3) * 0.25}rem ${(element.paddingLeft ?? 3) * 0.25}rem`
        },
        // Text styling
        textStyle: {
            color: semanticTextColor
        },
        // Individual values for direct use
        backgroundColor: finalBackgroundColor,
        textColor: semanticTextColor,
        borderColor: semanticBorderColor,
        padding: `${(element.paddingTop ?? 3) * 0.25}rem ${(element.paddingRight ?? 3) * 0.25}rem ${(element.paddingBottom ?? 3) * 0.25}rem ${(element.paddingLeft ?? 3) * 0.25}rem`,
        // Semantic theme colors for advanced usage
        themeColors,
        // Raw values for debugging and backward compatibility
        effectiveTextColor: semanticTextColor,
        displayBg,
        isDarkTheme: canvasTheme === 'dark',
        inheritedBg,
        calculatedTextColor,
        semanticBackgroundColor,
        semanticTextColor,
        semanticBorderColor
    };
}

// Get inherited background color following the inheritance chain
export function getInheritedBackgroundColor(
    elements: any[],
    targetElementId: string,
    bodyBackground?: string
): string | null {
    // Start with body background if set
    if (bodyBackground && bodyBackground !== 'transparent') {
        return bodyBackground;
    }

    // Find the element and traverse up the parent chain
    const findElementPath = (elements: any[], targetId: string): any[] => {
        for (const element of elements) {
            if (!element) continue; // Skip null/undefined elements
            if (element.id === targetId) {
                return [element];
            }
            if (element.children) {
                for (const child of element.children) {
                    if (child && child.id === targetId) {
                        return [element, child];
                    }
                    // Recursively search deeper - only pass non-null children
                    if (child) {
                        const path = findElementPath([child], targetId);
                        if (path.length > 0) {
                            return [element, ...path];
                        }
                    }
                }
            }
        }
        return [];
    };

    const path = findElementPath(elements, targetElementId);
    
    // Walk up the path to find the first parent with a background
    for (let i = 0; i < path.length - 1; i++) {
        const parent = path[i];
        if (parent.backgroundColor && parent.backgroundColor !== 'transparent') {
            // For columns type, check column-specific backgrounds
            if (parent.type === 'columns' && parent.columnBackgrounds) {
                const childIndex = parent.children?.findIndex((child: any) => {
                    if (i + 1 < path.length) {
                        return child && child.id === path[i + 1].id;
                    }
                    return false;
                });
                if (childIndex !== -1 && parent.columnBackgrounds[childIndex]) {
                    return parent.columnBackgrounds[childIndex];
                }
            }
            return parent.backgroundColor;
        }
    }

    return null;
}

// Check if dark mode should be disabled based on inheritance
export function shouldDisableDarkMode(
    elements: any[],
    targetElementId: string,
    bodyBackground?: string,
    settings?: any
): boolean {
    // If body background is set, disable dark mode entirely
    if (bodyBackground && bodyBackground !== 'transparent') {
        return true;
    }

    // Check if any parent in the inheritance chain has a background
    const inheritedBg = getInheritedBackgroundColor(elements, targetElementId, bodyBackground);
    return inheritedBg !== null;
}

// Get effective text color considering inheritance and dark mode rules
export function getEffectiveTextColor(
    elements: any[],
    element: any,
    bodyBackground?: string,
    canvasTheme?: 'light' | 'dark',
    settings?: any
): string | null {
    // Get inherited background
    const inheritedBg = getInheritedBackgroundColor(elements, element.id, bodyBackground);
    
    // If element has explicit text color, use it
    if (element.textColor) {
        return element.textColor;
    }
    
    // If there's an inherited background, choose optimal color for that background
    if (inheritedBg) {
        return getOptimalTextColor(inheritedBg, 'light', true); // Force light theme logic when bg is set
    }
    
    // Return null to indicate that theme defaults should be used
    // This preserves theme property references instead of hardcoding colors
    return null;
}