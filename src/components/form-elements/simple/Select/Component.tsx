import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const isFormProject = useStore.getState().currentProject?.type === 'form';
    const hasOptions = element.options && element.options.length > 0;

    return (
        <ComponentWrapper element={element} componentSettings={defaultSettings}>
            <select
                id={element.name}
                name={element.name}
                required={element.required}
                className={clsx(
                    "w-full p-2 rounded-lg text-slate-500 text-sm",
                    isFormProject && "border border-slate-200"
                )}
                style={{
                    backgroundColor: element.backgroundColor,
                }}
            >
                <option value="">Select an option</option>
                {hasOptions ? element.options?.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                )) : null}
            </select>
        </ComponentWrapper>
    );
};
