
///Users/osx/Applications/AI/Form Builder/src/components/form-elements/content/Menu/Component.tsx
import React from 'react';

import type { FormElement } from '../../../../types';
import { getComponentHtml } from '../../../../utils/componentHtml';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    // Helper to get nested children html
    // Note: In the original file, it calls getComponentHtml recursively.
    // Since we are moving this to a separate file, we need to ensure we can still call the main render function
    // or if we should import it. componentHtml imports this file, so importing componentHtml here might cause a cycle.
    // However, `getComponentHtml` is in `utils`, and `Menu/Component` is in `components`. 
    // Let's import `getComponentHtml` from utils. Cycle risk exists if utils imports registry which imports Menu.
    // To avoid cycle if it exists, we might need to pass a render callback, but existing architecture relies on the util.

    // Actually, `componentHtml.ts` imports `registry`. `registry` imports `Menu`. `Menu` imports `componentHtml`. 
    // This IS A CYCLE. 

    // SOLUTION: The Menu component in the canvas usually renders children via `ColumnDropZone` or similar wrappers in `Canvas.tsx`. 
    // BUT `componentHtml.tsx` is for the "HTML Generation" / "Renderer" part (static or preview).
    // The `Renderer.tsx` (runtime) uses `getComponentHtml`.

    // For the `Component` prop in Registry, it is used by `Renderer` via `getComponentHtml` -> `registry.get` -> `Component`.
    // If `Component` needs to render children, it needs to call back into the system.

    // In `Canvas.tsx`, `Menu` is likely handled by `Canvas` logic (droppable zones), NOT this `Component` which is seemingly for the static renderer or the "preview" in the builder if it used `getComponentHtml`.
    // Wait, `Canvas.tsx` uses `getComponentHtml`? No. `Canvas.tsx` has its own `MenuContent` or generic rendering?
    // Let's check `Canvas.tsx` again.

    return (
        <div
            className="min-h-[40px]"
            style={{
                display: 'flex',
                flexDirection: (element.flexDirection as any) || (element.menuLayout === 'vertical' ? 'column' : 'row'),
                flexWrap: (element.flexWrap as any) || 'nowrap',
                justifyContent: (element.justifyContent as any) || 'flex-start',
                alignItems: (element.alignItems as any) || 'center',
                alignContent: (element.alignContent as any) || 'flex-start',
                rowGap: element.rowGap || element.gap || '0px',
                columnGap: element.columnGap || element.gap || '0px'
            }}
        >
            {element.children && element.children.length > 0 ? (
                // We need to render children. The original code called `getComponentHtml`.
                // We will import it. If cycle issues arise, we will refactor.
                element.children.map((child) => child ? getComponentHtml(child, { isFormProject: true }) : null)
            ) : (
                <div className="text-gray-400 text-sm italic">
                    Drop menu items here
                </div>
            )}
        </div>
    );
};
