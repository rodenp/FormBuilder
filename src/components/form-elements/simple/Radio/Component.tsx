import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const isFormProject = useStore.getState().currentProject?.type === 'form';
    const hasOptions = element.options && element.options.length > 0;
    const defaultOptions = [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }];
    const optionsToRender = hasOptions ? element.options : defaultOptions;

    return (
        <ComponentWrapper element={element} componentSettings={defaultSettings}>
            <div className={clsx(
                "space-y-2 rounded-lg",
                isFormProject && "border border-slate-200"
            )} style={{
                backgroundColor: element.backgroundColor,
            }}>
                {optionsToRender?.map((opt, idx) => (
                    <div key={idx} className="flex items-center">
                        <input
                            type="radio"
                            name={`radio-${element.id}`}
                            className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                            disabled
                        />
                        <span className="ml-3 text-sm text-slate-600">{opt.label}</span>
                    </div>
                ))}
            </div>
        </ComponentWrapper>
    );
};
