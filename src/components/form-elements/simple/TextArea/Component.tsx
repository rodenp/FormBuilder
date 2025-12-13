
import React from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';
import { defaultSettings as localDefaultSettings } from './config';
import { defaultSettings } from '../../../../settings/defaultSettings';

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
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px"
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
                    paddingTop: element.paddingTop || (defaultSettings.types.textarea?.paddingTop || '16px'),
                    paddingRight: element.paddingRight || (defaultSettings.types.textarea?.paddingRight || '16px'),
                    paddingBottom: element.paddingBottom || (defaultSettings.types.textarea?.paddingBottom || '16px'),
                    paddingLeft: element.paddingLeft || (defaultSettings.types.textarea?.paddingLeft || '16px')
                }}
                placeholder={element.placeholder}
                rows={3}
                readOnly
            />
        </ComponentWrapper>
    );
};
