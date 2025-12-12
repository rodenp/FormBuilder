import React from 'react';
import type { FormElement } from '../../../../types';
import { getComponentHtml } from '../../../../utils/componentHtml';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    // Replicating logic from componentHtml.tsx getRowsHtml for backward compatibility
    // Rows typically use flex column layout
    const rowCount = element.rowCount || 1;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: element.flexWrap || 'nowrap',
                justifyContent: element.justifyContent || 'flex-start',
                alignItems: element.alignItems || 'stretch',
                alignContent: element.alignContent || 'flex-start',
                rowGap: `${(element.rowGap ?? element.gap ?? 0)}px`,
                columnGap: `${(element.columnGap ?? element.gap ?? 0)}px`
            }}
        >
            {Array.from({ length: rowCount }).map((_, index) => {
                const child = element.children?.[index];
                return (
                    <div
                        key={index}
                        className="min-h-[32px]"
                        style={{
                            backgroundColor: element.rowBackgrounds?.[index] || 'transparent'
                        }}
                    >
                        {child ? getComponentHtml(child) : null}
                    </div>
                );
            })}
        </div>
    );
};
