import React from 'react';
import type { FormElement } from '../../../../types';
import { getComponentHtml } from '../../../../utils/componentHtml';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    // Replicating logic from componentHtml.tsx getContainerHtml

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: element.flexDirection || 'column',
                flexWrap: element.flexWrap || 'nowrap',
                justifyContent: element.justifyContent || 'flex-start',
                alignItems: element.alignItems || 'stretch',
                alignContent: element.alignContent || 'flex-start',
                rowGap: `${(element.rowGap ?? element.gap ?? 0)}px`,
                columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 12)}px` : '12px'
            }}
        >
            {element.children && element.children.length > 0 ? (
                element.children.map((child) => child ? getComponentHtml(child) : null)
            ) : (
                <div className="text-slate-400 text-sm text-center py-2">Empty container</div>
            )}
        </div>
    );
};
