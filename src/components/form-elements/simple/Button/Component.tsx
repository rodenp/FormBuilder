
import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings as localDefaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const isFormProject = useStore.getState().currentProject?.type === 'form';

    // Theme fallback logic for colors
    // "When background colour or text colour are transparent or not defined then use the color from the theme and the light or dark mode."
    // Note: The actual "theme" color (e.g. brand primary) is often handled by CSS classes (bg-blue-600 etc) if no inline style is present.
    // However, if we need to explicitly set it to "theme default" when undefined, we rely on the class logic below.

    // Determine button classes based on style
    const style = element.buttonStyle || 'primary';
    const variantClasses = {
        primary: "bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] border-transparent hover:opacity-90",
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


    const buttonClasses = clsx(
        "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        // Button Size
        element.buttonSize === 'sm' && "text-sm",
        element.buttonSize === 'lg' && "text-lg",
        (!element.buttonSize || element.buttonSize === 'md') && "text-base",

        // Apply variant background/border styles if no custom background is set
        !element.backgroundColor && (variantClasses[style as keyof typeof variantClasses] || variantClasses.primary),

        // Apply variant text styles ONLY if we don't have a custom text color AND we want to enforce variant defaults.
        // But user requested: "If i remove the text colour then then the button text colour should be derived from the theme"
        // This implies we should defaulting to standard text colors when undefined.
        // So we add a base text color class that adapts to theme, which will be overridden by custom styles if present.


        // Alignment
        element.buttonWidthType === 'full' && "w-full",

        // Base border if no granular borders defined
        !element.borderStyleTop && "border"
    );

    const buttonStyle: React.CSSProperties = {
        // Width
        width: element.buttonWidthType === 'custom' ? `${element.buttonWidth}%` : element.buttonWidthType === 'full' ? '100%' : 'auto',

        // Colors - Explicit overrides
        backgroundColor: element.backgroundColor || undefined,
        color: element.textColor || undefined,

        // Typography
        fontFamily: element.fontFamily || undefined,
        fontWeight: element.fontWeight || undefined,
        fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
        lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,

        // Borders - Granular
        borderTopWidth: element.borderWidthTop !== undefined ? `${element.borderWidthTop}px` : undefined,
        borderRightWidth: element.borderWidthRight !== undefined ? `${element.borderWidthRight}px` : undefined,
        borderBottomWidth: element.borderWidthBottom !== undefined ? `${element.borderWidthBottom}px` : undefined,
        borderLeftWidth: element.borderWidthLeft !== undefined ? `${element.borderWidthLeft}px` : undefined,

        borderTopStyle: element.borderStyleTop as any || undefined,
        borderRightStyle: element.borderStyleRight as any || undefined,
        borderBottomStyle: element.borderStyleBottom as any || undefined,
        borderLeftStyle: element.borderStyleLeft as any || undefined,

        // Border Colors - Default to transparent if undefined to avoid currentColor bleed
        // Border Colors 
        // If we are using valid variant classes (!backgroundColor), we leave border color undefined so the class rules apply.
        // If we have a custom background, we default to transparent to avoid 'currentColor' bleeding.
        borderTopColor: element.borderColorTop || (!element.backgroundColor ? undefined : 'transparent'),
        borderRightColor: element.borderColorRight || (!element.backgroundColor ? undefined : 'transparent'),
        borderBottomColor: element.borderColorBottom || (!element.backgroundColor ? undefined : 'transparent'),
        borderLeftColor: element.borderColorLeft || (!element.backgroundColor ? undefined : 'transparent'),

        // Radius
        borderTopLeftRadius: element.borderRadiusTopLeft !== undefined ? `${element.borderRadiusTopLeft}px` : undefined,
        borderTopRightRadius: element.borderRadiusTopRight !== undefined ? `${element.borderRadiusTopRight}px` : undefined,
        borderBottomRightRadius: element.borderRadiusBottomRight !== undefined ? `${element.borderRadiusBottomRight}px` : undefined,
        borderBottomLeftRadius: element.borderRadiusBottomLeft !== undefined ? `${element.borderRadiusBottomLeft}px` : undefined,

        // Padding - Applied internally to the button
        paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
        paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
        paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
        paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined,
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
