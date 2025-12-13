import React from 'react';
import type { FormElement } from '../../../../types';
import { getComponentHtml } from '../../../../utils/componentHtml';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    // Replicating logic from componentHtml.tsx getColumnsHtml for backward compatibility
    const columnCount = element.columnCount || 2;
    const gap = element.columnGap || element.gap || '0px';

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: gap,
                // Allow style overrides
                ...((element.display === 'flex') ? { display: 'flex' } : {})
            }}
        >
            {Array.from({ length: columnCount }).map((_, index) => {
                const child = element.children?.[index];
                return (
                    <div
                        key={index}
                        className="min-h-[32px]"
                        style={{
                            backgroundColor: element.columnBackgrounds?.[index] || 'transparent'
                        }}
                    >
                        {child ? getComponentHtml(child) : null}
                    </div>
                );
            })}
        </div>
    );
};
