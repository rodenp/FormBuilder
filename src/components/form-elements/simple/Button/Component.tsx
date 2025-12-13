//Users/osx/Applications/AI/Form Builder/src/components/form-elements/simple/Button/Component.tsx
import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings as localDefaultSettings } from './config';
import { defaultSettings } from '../../../../settings/defaultSettings';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    // const isFormProject = useStore.getState().currentProject?.type === 'form'; // Accessing state directly might not trigger re-renders on settings change?
    // useStore() hook is better.
    const { currentProject, settings } = useStore();
    const isFormProject = currentProject?.type === 'form';

    // Logic: If no element color is set, and no global body colors are set, 
    // we enforce the "Brand" default colors for buttons (e.g. White text on Primary).
    // If global body colors ARE set, we allow the button to inherit them (so Red Body -> Red Button Text unless overridden).
    const useDefaultTheme = !element.textColor && !settings.textColor && !settings.formBackground;

    // Determine button classes based on style
    const style = element.buttonStyle || 'primary';
    const variantClasses = {
        primary: "bg-[var(--theme-button-bg)] border-transparent hover:opacity-90",
        secondary: "bg-gray-600 border-gray-600 hover:bg-gray-700",
        outline: "bg-transparent border-gray-300 hover:bg-gray-50",
        text: "bg-transparent border-transparent hover:bg-blue-50",
        link: "bg-transparent border-transparent hover:underline"
    };

    // Default text colors for variants (only used if text color is NOT manually set)
    // AND if the user hasn't requested "theme" behavior (which effectively means we shouldn't force these).
    // However, for Primary (blue bg), we typically need white text. 
    // If the user clears the text color, they want "theme" text. 
    // So we will NOT apply these text classes if textColor is explicitly undefined (cleared), 
    // relying instead on the "text-slate-900 dark:text-white" fallback.


    // Separate checks for logic clarity - though they are similar, the user might set Text but not BG.
    // However, "Brand" usually implies a coherent set.
    // The previous prompt said: "if no colours have been set for the body text and background".
    // This implies a holistic "Default Mode" vs "Custom Mode".
    // I will stick to the holistic check `useDefaultTheme` derived earlier, or split if needed?
    // "background colour is not reflected".
    // Let's use specific checks for granular control if possible, or stick to the robust global check.
    // If I use `useDefaultTheme` (which checks both), then setting Text Color would disable Background Default.
    // That might be unexpected. "I set Text to Black, why did my Button Background disappear?"
    // So I should probably split them.
    const useDefaultBg = !element.backgroundColor && !settings.formBackground;

    const buttonClasses = clsx(
        "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        // Button Size
        element.buttonSize === 'sm' && "text-sm",
        element.buttonSize === 'lg' && "text-lg",
        (!element.buttonSize || element.buttonSize === 'md') && "text-base",

        // Apply variant background/border styles
        // Only apply default variant background if NO global background is set.
        useDefaultBg && !element.backgroundColor && (variantClasses[style as keyof typeof variantClasses] || variantClasses.primary),

        // If we are NOT using default bg (because global is set), we might need to ensure border is handled?
        // variantClasses also included border colors/styles.
        // If we remove the class, we lose border styles too?
        // variantClasses.primary: "bg-... border-transparent".
        // If we remove it, border is default (none).
        // This seems correct for "Inherit everything".

        // Apply variant text styles ONLY if we are in "Default Mode"
        useDefaultTheme && style === 'primary' && "text-[var(--theme-button-text)]",
        useDefaultTheme && style === 'secondary' && "text-white",

        // Alignment
        element.buttonWidthType === 'full' && "w-full",

        // Base border if no granular borders defined
        !element.borderStyleTop && "border"
    );

    const defaults = defaultSettings.types.button || {};

    const buttonStyle: React.CSSProperties = {
        // Width
        width: element.buttonWidthType === 'custom' ? `${element.buttonWidth}%` : element.buttonWidthType === 'full' ? '100%' : 'auto',

        // Colors - Explicit overrides
        backgroundColor: element.backgroundColor || undefined,
        color: element.textColor || undefined,

        // Typography
        fontFamily: element.fontFamily || undefined,
        fontWeight: element.fontWeight || undefined,
        fontSize: element.fontSize || defaults.fontSize,
        lineHeight: element.lineHeight || defaults.lineHeight,
        letterSpacing: element.letterSpacing || defaults.letterSpacing,

        // Borders - Granular
        borderTopWidth: element.borderWidthTop || defaults.borderWidthTop,
        borderRightWidth: element.borderWidthRight || defaults.borderWidthRight,
        borderBottomWidth: element.borderWidthBottom || defaults.borderWidthBottom,
        borderLeftWidth: element.borderWidthLeft || defaults.borderWidthLeft,

        borderTopStyle: element.borderStyleTop as any || defaults.borderStyleTop,
        borderRightStyle: element.borderStyleRight as any || defaults.borderStyleRight,
        borderBottomStyle: element.borderStyleBottom as any || defaults.borderStyleBottom,
        borderLeftStyle: element.borderStyleLeft as any || defaults.borderStyleLeft,

        // Border Colors - Default to transparent if undefined to avoid currentColor bleed
        // Border Colors 
        // If we are using valid variant classes (!backgroundColor), we leave border color undefined so the class rules apply.
        // If we have a custom background, we default to transparent to avoid 'currentColor' bleeding.
        borderTopColor: element.borderColorTop || (!element.backgroundColor ? undefined : 'transparent'),
        borderRightColor: element.borderColorRight || (!element.backgroundColor ? undefined : 'transparent'),
        borderBottomColor: element.borderColorBottom || (!element.backgroundColor ? undefined : 'transparent'),
        borderLeftColor: element.borderColorLeft || (!element.backgroundColor ? undefined : 'transparent'),

        // Radius
        borderTopLeftRadius: element.borderRadiusTopLeft || defaults.borderRadiusTopLeft,
        borderTopRightRadius: element.borderRadiusTopRight || defaults.borderRadiusTopRight,
        borderBottomRightRadius: element.borderRadiusBottomRight || defaults.borderRadiusBottomRight,
        borderBottomLeftRadius: element.borderRadiusBottomLeft || defaults.borderRadiusBottomLeft,

        // Padding - Applied internally to the button
        paddingTop: element.paddingTop || defaults.paddingTop,
        paddingRight: element.paddingRight || defaults.paddingRight,
        paddingBottom: element.paddingBottom || defaults.paddingBottom,
        paddingLeft: element.paddingLeft || defaults.paddingLeft,
    };

    // Debug logging
    console.log('Button Classes:', buttonClasses, 'Element:', element);

    return (
        <ComponentWrapper element={element} componentSettings={localDefaultSettings} ignorePadding={true}>
            <div className={clsx(
                "relative",
                // Alignment container logic if needed, but usually ComponentWrapper handles strict layout?
                // Actually ComponentWrapper handles margin/padding. Alignment within the cell/container is handled by parent grid/flex.
                // However, for 'auto' width buttons, we might want them left/center/right aligned in their slot.
                // This seems to be handled by 'horizontalAlign' on the element in other components.
                // Buttons have 'horizontalAlign' property available in FormElement interface.
                element.horizontalAlign === 'center' && "flex justify-center",
                element.horizontalAlign === 'right' && "flex justify-end",
            )}>
                <button
                    type={element.buttonType || 'button'}
                    className={buttonClasses}
                    style={buttonStyle}
                    disabled={!isFormProject} // Or logic for interactive mode
                    onClick={(e) => {
                        if (!isFormProject) e.preventDefault();
                        // Handle button action
                        if (element.buttonAction === 'url' && element.buttonUrl) {
                            window.open(element.buttonUrl, element.buttonTarget || '_self');
                        }
                    }}
                >
                    {element.buttonText || 'Button'}
                </button>
            </div>
        </ComponentWrapper>
    );
};
