/**
 * Full Hello World Component Example (Strict Data-Driven Styling)
 * 
 * STRICT RULE: Components do NOT hardcode ANY visual styles (border, padding, colors).
 * All styling comes from `element` (instance props) or `defaultSettings` (defaults).
 */

import React from 'react';
import { registry } from '../../components/registry';
import { useStore } from '../../store/useStore';
import type { FormElement } from '../../types';

// --- 1. CONFIGURATION ---
const config = {
    label: 'Hello World',
    category: 'custom',
    icon: 'Globe'
};

// --- 2. THE COMPONENT (View) ---
const HelloWorldComponent: React.FC<{ element: FormElement }> = ({ element }) => {
    const { settings } = useStore();
    const isDark = settings.canvasTheme === 'dark';

    // Fallbacks provided by defaultSettings, but safe guards here too
    const borderColor = element.borderColor || (isDark ? '#334155' : '#e2e8f0');
    const textColor = element.textColor || (isDark ? '#f1f5f9' : '#1e293b');

    return (
        <div 
            className= "w-full h-full transition-colors overflow-hidden"
    style = {{
        // BORDERS - Fully Data Driven
        borderWidth: element.borderWidth,        // e.g. '2px'
            borderStyle: element.borderStyle,        // e.g. 'dashed'
                borderColor: borderColor,
                    borderRadius: element.borderRadius,      // e.g. '8px'

                        // BACKGROUND
                        backgroundColor: element.backgroundColor || 'transparent',

                            // TYPOGRAPHY
                            color: textColor,
                                textAlign: element.textAlign as any || 'center',

                                    // INTERNAL PADDING
                                    paddingTop: element.paddingTop,
                                        paddingBottom: element.paddingBottom,
                                            paddingLeft: element.paddingLeft,
                                                paddingRight: element.paddingRight,
            }
}
        >
    <h3 className="text-xl font-bold" > Hello World! </h3>
        < p className = "opacity-80" >
            { element.customMessage || "No custom message set" }
            </p>
            </div>
    );
};

// --- 3. THE PROPERTIES PANEL (Editor) ---
const HelloWorldProperties: React.FC<{ element: FormElement, updateElement: Function }> = ({ element, updateElement }) => {
    return (
        <div className= "space-y-4" >
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-md" >
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2" >
                Custom Message
                    </label>
                    < input
    type = "text"
    value = { element.customMessage || '' }
    onChange = {(e) => updateElement(element.id, { customMessage: e.target.value })}
className = "w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
    />
    </div>

{/* Note: 
                - Border Width/Style/Color
                - Border Radius
                - Background Color
                - Padding / Margin
                
                These are ALL handled by the generic `StyleProperties` and `LayoutProperties` panels
                which read/write to `element.borderWidth`, `element.paddingTop`, etc.
                
                We DO NOT need to implement them here.
            */}
</div>
    );
};

// --- 4. DEFAULT SETTINGS ---
// Defines the "Initial Look" entirely via data.
const defaultSettings = {
    // Layout
    width: '100%',
    marginTop: '10px',

    // Internal Spacing
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',

    // Style (Data-driven Border!)
    borderWidth: '2px',           // No longer hardcoded in className
    borderStyle: 'dashed',        // No longer hardcoded
    borderColor: '#bfdbfe',       // blue-200
    borderRadius: '12px',         // rounded-xl

    // Colors
    backgroundColor: '#eff6ff',   // blue-50
    textColor: '#1e40af'          // blue-800
};

// --- 5. REGISTRATION ---
registry.register('hello-world', {
    Component: HelloWorldComponent,
    Properties: HelloWorldProperties,
    config: config,
    defaultSettings: defaultSettings
});

export const HelloWorld = {
    Component: HelloWorldComponent,
    Properties: HelloWorldProperties
};
