import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const isFormProject = useStore.getState().currentProject?.type === 'form';

    return (
        <ComponentWrapper element={element} componentSettings={defaultSettings}>
            <div className={clsx(
                "flex items-center rounded-lg",
                isFormProject && "border border-slate-200"
            )} style={{
                backgroundColor: element.backgroundColor, // Remove default #f8fafc to allow transparent/dark mode
            }}>
                <input type="checkbox" className="h-4 w-4 text-brand-600 rounded border-slate-300" disabled />
                <span className="ml-3 text-sm text-slate-600">{element.placeholder || 'Checkbox option'}</span>
            </div>
        </ComponentWrapper>
    );
};
