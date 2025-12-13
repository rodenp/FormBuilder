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

    // Default styles logic replicated from Canvas.tsx
    const fontSizeClass = !element.fontSize && !element.headingLevel ? "text-4xl" :
        !element.fontSize && element.headingLevel === 1 ? "text-4xl" :
            !element.fontSize && element.headingLevel === 2 ? "text-3xl" :
                !element.fontSize && element.headingLevel === 3 ? "text-2xl" :
                    !element.fontSize && element.headingLevel === 4 ? "text-xl" :
                        !element.fontSize && element.headingLevel === 5 ? "text-lg" :
                            !element.fontSize && element.headingLevel === 6 ? "text-base" : "";

    const textAlignClass = element.textAlign === 'center' ? "text-center" :
        element.textAlign === 'right' ? "text-right" :
            element.textAlign === 'justify' ? "text-justify" :
                "text-left";

    // Apply default color if no element color AND no global body settings (text or background) are defined.
    // This ensures components look good by default ("Brand" look) but inherit effectively when Body styles are present.
    const useDefaultColor = !element.textColor && !settings.textColor && !settings.formBackground;

    const commonClasses = clsx(
        "p-0 m-0 border-none w-full",
        useDefaultColor && "text-slate-600",
        !element.fontWeight && "font-bold",
        fontSizeClass,
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
                    role="heading"
                    aria-level={element.headingLevel || 1}
                    className={commonClasses}
                    style={commonStyles}
                    dangerouslySetInnerHTML={{ __html: element.content || 'Heading' }}
                />
            )}
        </ComponentWrapper>
    );
};
