import { Component } from './Component';
import { config } from './config';

// We can reuse the generic LayoutPanel for now, or create a specific one if needed later
// For now, passing Properties as undefined or null will make the registry use default properties/layout panel
// But we should likely export *something* if we want to customize it. 
// Given the task explicitly mentions "Migrate Columns" and we did specific properties for others:
// For Columns, the "Layout" panel in PropertiesPanel.tsx (which we just fixed overflow for)
// handles most things (Alignment, Gap, Box Model).
// So strictly speaking, we might not need a specialized "properties.tsx" YET unless we want to control distinct column widths.
// Let's export standard items.

export const Columns = {
    Component,
    config,
    // Use default LayoutPanel logic for now by not exporting specific Properties
    // or we can export a pass-through if the registry expects it.
    Properties: undefined
};
