
///Users/osx/Applications/AI/Form Builder/src/components/builder/ComponentWrapper.tsx
import React from 'react';
import type { FormElement } from '../../types';
import { defaultSettings, type ComponentSettings } from '../../settings/defaultSettings';
import { clsx } from 'clsx';

interface ComponentWrapperProps {
    element: FormElement;
    children: React.ReactNode;
    componentSettings?: Partial<ComponentSettings>; // Component-level overrides (from the registered component file)
    className?: string; // Additional classes passed from the component
    style?: React.CSSProperties; // Additional styles
    ignorePadding?: boolean; // If true, padding props are ignored by the wrapper (useful for buttons/inputs where padding applies internally)
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
    element,
    children,
    componentSettings = {},
    className,
    style,
    ignorePadding = false
}) => {
    // 1. Global Defaults
    const globalDefaults = defaultSettings.global;

    // 2. Type Defaults (safe access)
    const typeDefaults = defaultSettings.types[element.type] || {};

    // 3. User Instance Props (from element)
    // We only take the specific styling props found in ComponentSettings
    // 3. User Instance Props (from element)
    // We only take the specific styling props found in ComponentSettings if they are defined
    const instanceProps: Partial<ComponentSettings> = {};

    if (element.marginTop !== undefined) instanceProps.marginTop = element.marginTop;
    if (element.marginRight !== undefined) instanceProps.marginRight = element.marginRight;
    if (element.marginBottom !== undefined) instanceProps.marginBottom = element.marginBottom;
    if (element.marginLeft !== undefined) instanceProps.marginLeft = element.marginLeft;

    if (!ignorePadding) {
        if (element.paddingTop !== undefined) instanceProps.paddingTop = element.paddingTop;
        if (element.paddingRight !== undefined) instanceProps.paddingRight = element.paddingRight;
        if (element.paddingBottom !== undefined) instanceProps.paddingBottom = element.paddingBottom;
        if (element.paddingLeft !== undefined) instanceProps.paddingLeft = element.paddingLeft;
    }

    // Merge: Global < Type < Component-File < Instance
    const finalSettings = {
        ...globalDefaults,
        ...typeDefaults,
        ...componentSettings,
        ...instanceProps
    };



    // The user constraint: "Do NOT modify the handling of the canvas including the setting of borders around components added to the canvas."
    // So ComponentWrapper effectively replaces the "Element Content" div or becomes the direct child of it.
    // It should handle the INNER padding/styling that varies per component.

    const finalStyle: React.CSSProperties = {
        ...style,
        paddingTop: !ignorePadding && finalSettings.paddingTop !== undefined ? finalSettings.paddingTop : undefined,
        paddingRight: !ignorePadding && finalSettings.paddingRight !== undefined ? finalSettings.paddingRight : undefined,
        paddingBottom: !ignorePadding && finalSettings.paddingBottom !== undefined ? finalSettings.paddingBottom : undefined,
        paddingLeft: !ignorePadding && finalSettings.paddingLeft !== undefined ? finalSettings.paddingLeft : undefined,
        marginTop: finalSettings.marginTop !== undefined ? finalSettings.marginTop : undefined,
        marginRight: finalSettings.marginRight !== undefined ? finalSettings.marginRight : undefined,
        marginBottom: finalSettings.marginBottom !== undefined ? finalSettings.marginBottom : undefined,
        marginLeft: finalSettings.marginLeft !== undefined ? finalSettings.marginLeft : undefined,
    };

    return (
        <div
            className={clsx(className)}
            style={finalStyle}
        >
            {children}
        </div>
    );
};
