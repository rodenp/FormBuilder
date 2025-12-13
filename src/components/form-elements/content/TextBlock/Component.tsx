import React, { useRef } from 'react';
import type { FormElement } from '../../../../types';
import { ComponentWrapper } from '../../../builder/ComponentWrapper';
import { RichTextEditor, type RichTextEditorRef } from '../../../RichTextEditor';
import { useStore } from '../../../../store/useStore';
import { clsx } from 'clsx';
import { defaultSettings } from './config';

export const Component: React.FC<{ element: FormElement }> = ({ element }) => {
    const { updateElement, selectedElementId, settings } = useStore();
    const isSelected = selectedElementId === element.id;
    const editorRef = useRef<RichTextEditorRef>(null);

    const textAlignClass = element.textAlign === 'center' ? "text-center" :
        element.textAlign === 'right' ? "text-right" :
            element.textAlign === 'justify' ? "text-justify" :
                "text-left";

    const useDefaultColor = !element.textColor && !settings.textColor && !settings.formBackground;

    const commonClasses = clsx(
        "p-0 m-0 border-none w-full",
        useDefaultColor && "text-slate-600",
        fontSizeClass(element),
        textAlignClass
    );

    const commonStyles = {
        fontFamily: element.fontFamily || undefined,
        fontSize: element.fontSize || undefined,
        fontWeight: element.fontWeight || undefined,
        color: element.textColor || undefined,
        lineHeight: element.lineHeight || undefined,
        letterSpacing: element.letterSpacing || undefined,
        margin: 0
    };

    return (
        <ComponentWrapper element={element} componentSettings={defaultSettings}>
            {isSelected ? (
                <RichTextEditor
                    ref={editorRef}
                    selectedElement={element}
                    onContentChange={(content) => updateElement(element.id, { content })}
                    className={commonClasses}
                />
            ) : (
                <div
                    className={commonClasses}
                    style={commonStyles}
                    dangerouslySetInnerHTML={{ __html: element.content || '<p>Start typing...</p>' }}
                />
            )}
        </ComponentWrapper>
    );
};

// Helper to determine font size class if no explicit size set
const fontSizeClass = (element: FormElement) => {
    if (element.fontSize) return "";
    return "text-base"; // Default paragraph size
};
