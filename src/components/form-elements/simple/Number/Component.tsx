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
            <input
                type="number"
                className={clsx(
                    "w-full p-2.5 rounded-lg text-slate-500 text-sm",
                    isFormProject && "border border-slate-200"
                )}
                style={{
                    backgroundColor: element.backgroundColor,
                }}
                placeholder={element.placeholder}
                min={element.min}
                max={element.max}
                step={element.step}
                readOnly
            />
        </ComponentWrapper>
    );
};
