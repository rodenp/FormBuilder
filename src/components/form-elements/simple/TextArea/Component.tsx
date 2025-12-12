
import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const isFormProject = useStore.getState().currentProject?.type === 'form';

    // Strip padding from element passed to wrapper, so wrapper acts as specific styling/margin container only
    const wrapperElement = {
        ...element,
        paddingTop: undefined,
        paddingRight: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined
    };

    // Force zero padding on wrapper to prevent defaults
    const wrapperSettings = {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
    };

    return (
        <ComponentWrapper element={wrapperElement} componentSettings={wrapperSettings}>
            <textarea
                className={clsx(
                    "w-full rounded-lg text-slate-500 text-sm resize-none",
                    isFormProject && "border border-slate-200"
                )}
                style={{
                    backgroundColor: element.backgroundColor,
                    paddingTop: `${(element.paddingTop ?? defaultSettings.paddingTop ?? 12)}px`,
                    paddingRight: `${(element.paddingRight ?? defaultSettings.paddingRight ?? 12)}px`,
                    paddingBottom: `${(element.paddingBottom ?? defaultSettings.paddingBottom ?? 12)}px`,
                    paddingLeft: `${(element.paddingLeft ?? defaultSettings.paddingLeft ?? 12)}px`
                }}
                placeholder={element.placeholder}
                rows={3}
                readOnly
            />
        </ComponentWrapper>
    );
};
