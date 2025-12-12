
import React from 'react';
import { clsx } from 'clsx';
import type { FormElement } from '../../../../types';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    return (
        <div
            className={clsx(
                "relative group",
                element.imageAlign === 'center' && "flex justify-center",
                element.imageAlign === 'right' && "flex justify-end",
                element.imageAlign === 'justify' && "flex justify-center",
                (!element.imageAlign || element.imageAlign === 'left') && "flex justify-start"
            )}
            style={{
                width: `${element.imageWidthPercent || 100}%`,
                marginLeft: element.imageAlign === 'center' ? 'auto' : element.imageAlign === 'right' ? 'auto' : undefined,
                marginRight: element.imageAlign === 'center' ? 'auto' : element.imageAlign === 'right' ? undefined : element.imageAlign === 'left' ? 'auto' : undefined
            }}
        >
            <img
                src={element.imageUrl || 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image'}
                alt={element.imageAlt || 'Image'}
                className="rounded-lg block h-auto w-full"
                style={{ backgroundColor: element.backgroundColor }}
            />
        </div>
    );
};
