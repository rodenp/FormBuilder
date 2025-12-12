
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
                type={element.type}
                className={clsx(
                    "w-full rounded-lg text-slate-500 text-sm",
                    isFormProject && "border border-slate-200"
                )}
                style={{
                    backgroundColor: element.backgroundColor,
                }}
                placeholder={element.placeholder}
                readOnly
            />
        </ComponentWrapper>
    );
};
