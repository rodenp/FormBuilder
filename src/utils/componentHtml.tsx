import React from 'react';
import { clsx } from 'clsx';
import type { FormElement } from '../types';

interface HtmlOptions {
    isFormProject?: boolean;
    isSelected?: boolean;
    parentId?: string;
    showInteractiveElements?: boolean;
    register?: any; // react-hook-form register function for interactive forms
}

export const getComponentHtml = (element: FormElement, options: HtmlOptions = {}): React.ReactElement | null => {
    const { isFormProject = false, isSelected = false, parentId, showInteractiveElements = false } = options;

    if (!element) return null;

    // Calculate if nested (has parentId)
    const isNested = !!parentId;

    // Apply percentage width calculation exactly like Canvas
    const widthStyle = !isNested ?
        { width: `${(element.width || (element.type === 'image' ? 2 : 12)) / 12 * 100}%` } :
        {};

    return (
        <div
            key={element.id}
            className="relative flex flex-col"
            style={{
                ...widthStyle,
                // Apply margins exactly like Canvas
                marginTop: `${(element.marginTop ?? 0)}px`,
                marginRight: `${(element.marginRight ?? 0)}px`,
                marginBottom: `${(element.marginBottom ?? 0)}px`,
                marginLeft: `${(element.marginLeft ?? 0)}px`,
                // Apply horizontal alignment for non-containers exactly like Canvas
                ...(element.horizontalAlign === 'center' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ?
                    { marginLeft: 'auto', marginRight: 'auto' } : {}),
                ...(element.horizontalAlign === 'right' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ?
                    { marginLeft: 'auto' } : {})
            }}
        >
            {/* Visual wrapper around label and component - exactly like Canvas */}
            <div
                className={clsx(
                    "relative rounded-lg flex-1",
                    isSelected && showInteractiveElements && "ring-2 ring-brand-400 ring-opacity-50"
                )}
                style={{
                    // Apply background color to all elements - exactly like Canvas line 1300
                    backgroundColor: element.backgroundColor || undefined,
                    // Padding only for container types - exactly like Canvas
                    paddingTop: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingTop ?? 0)}px` : undefined,
                    paddingRight: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingRight ?? 0)}px` : undefined,
                    paddingBottom: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingBottom ?? 0)}px` : undefined,
                    paddingLeft: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingLeft ?? 0)}px` : undefined
                }}
            >
                {/* Labels for regular form elements - exactly like Canvas */}
                {isFormProject && !['hidden', 'rich-text', 'container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                    <div
                        className="flex justify-between items-start"
                        style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap}px` : '3px' }}
                    >
                        <div>
                            <label className={clsx(
                                "block text-slate-700",
                                element.labelSize === 'xs' && "text-xs",
                                element.labelSize === 'sm' && "text-sm",
                                element.labelSize === 'base' && "text-base",
                                element.labelSize === 'lg' && "text-lg",
                                !element.labelSize && "text-sm",
                                // Legacy labelWeight support
                                !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                !element.labelBold && element.labelWeight === 'medium' && "font-medium",
                                !element.labelBold && element.labelWeight === 'semibold' && "font-semibold",
                                !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                !element.labelBold && !element.labelWeight && "font-medium",
                                // New formatting system takes priority
                                element.labelBold && "font-bold",
                                element.labelItalic && "italic",
                                element.labelUnderline && "underline",
                                element.labelStrikethrough && "line-through"
                            )}>
                                {element.label}
                                {element.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>
                    </div>
                )}

                {/* Labels for container elements - exactly like Canvas */}
                {isFormProject && ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                    <div
                        className="flex justify-between items-start"
                        style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap}px` : '12px' }}
                    >
                        <div>
                            <label className={clsx(
                                "block text-slate-700",
                                element.labelSize === 'xs' && "text-xs",
                                element.labelSize === 'sm' && "text-sm",
                                element.labelSize === 'base' && "text-base",
                                element.labelSize === 'lg' && "text-lg",
                                !element.labelSize && "text-sm",
                                // Legacy labelWeight support
                                !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                !element.labelBold && element.labelWeight === 'medium' && "font-medium",
                                !element.labelBold && element.labelWeight === 'semibold' && "font-semibold",
                                !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                !element.labelBold && !element.labelWeight && "font-medium",
                                // New formatting system takes priority
                                element.labelBold && "font-bold",
                                element.labelItalic && "italic",
                                element.labelUnderline && "underline",
                                element.labelStrikethrough && "line-through"
                            )}>
                                {element.label}
                                {element.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>
                    </div>
                )}

                {/* Element Content - exactly like Canvas */}
                <div
                    style={{
                        // Apply padding to regular form elements exactly like Canvas
                        paddingTop: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingTop ?? 0)}px` : undefined,
                        paddingRight: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingRight ?? 0)}px` : undefined,
                        paddingBottom: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingBottom ?? 0)}px` : undefined,
                        paddingLeft: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingLeft ?? 0)}px` : undefined
                    }}
                >
                    {getElementContentHtml(element, options)}
                </div>
            </div>
        </div>
    );
};


import { registry } from '../components/registry';

// ... imports

const getElementContentHtml = (element: FormElement, options: HtmlOptions): React.ReactElement | null => {
    const { isFormProject, showInteractiveElements, register } = options;

    // CHECK REGISTRY FIRST
    // If the component is migrated and registered, use it.
    const registered = registry.get(element.type);
    if (registered) {
        const Component = registered.Component;
        return <Component element={element} />;
    }

    switch (element.type) {
        case 'textarea':
            return (
                <textarea
                    {...(register && showInteractiveElements ? register(element.id, { required: element.required }) : {})}
                    className={clsx(
                        "w-full rounded-lg text-slate-500 text-sm resize-none",
                        isFormProject && "border border-slate-200"
                    )}
                    style={{
                        backgroundColor: element.backgroundColor,
                        paddingTop: `${(element.paddingTop ?? 12)}px`,
                        paddingRight: `${(element.paddingRight ?? 12)}px`,
                        paddingBottom: `${(element.paddingBottom ?? 12)}px`,
                        paddingLeft: `${(element.paddingLeft ?? 12)}px`
                    }}
                    placeholder={element.placeholder}
                    rows={3}
                    readOnly={!showInteractiveElements}
                />
            );

        case 'select':
            return (
                <div className="relative">
                    <select
                        {...(register && showInteractiveElements ? register(element.id, { required: element.required }) : {})}
                        className={clsx(
                            "w-full rounded-lg text-slate-500 text-sm appearance-none",
                            isFormProject && "border border-slate-200"
                        )}
                        style={{
                            backgroundColor: element.backgroundColor,
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                        }}
                        disabled={!showInteractiveElements}
                    >
                        {element.options?.map((opt, idx) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            );

        case 'checkbox':
            return (
                <div className={clsx(
                    "flex items-center rounded-lg",
                    isFormProject && "border border-slate-200"
                )} style={{
                    backgroundColor: element.backgroundColor || '#f8fafc',
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                }}>
                    <input
                        type="checkbox"
                        {...(register && showInteractiveElements ? register(element.id, { required: element.required }) : {})}
                        className="h-4 w-4 text-brand-600 rounded border-slate-300"
                        disabled={!showInteractiveElements}
                    />
                    <span className="ml-3 text-sm text-slate-600">{element.placeholder || 'Checkbox option'}</span>
                </div>
            );

        case 'radio':
            return (
                <div className={clsx(
                    "space-y-2 rounded-lg",
                    isFormProject && "border border-slate-200"
                )} style={{
                    backgroundColor: element.backgroundColor || '#f8fafc',
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                }}>
                    {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                        <div key={idx} className="flex items-center">
                            <input
                                type="radio"
                                {...(register && showInteractiveElements ? register(element.id, { required: element.required }) : {})}
                                name={element.id}
                                value={opt.value}
                                className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                                disabled={!showInteractiveElements}
                            />
                            <span className="ml-3 text-sm text-slate-600">{opt.label}</span>
                        </div>
                    ))}
                </div>
            );

        case 'button':
            return (
                <div className="relative">
                    <button
                        type={element.buttonType || 'button'}
                        className={clsx(
                            "font-medium rounded-lg border",
                            element.buttonSize === 'sm' && "text-sm",
                            element.buttonSize === 'lg' && "text-lg",
                            (!element.buttonSize || element.buttonSize === 'md') && "text-base",
                            element.buttonStyle === 'primary' && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                            element.buttonStyle === 'secondary' && "bg-gray-600 border-gray-600 text-white hover:bg-gray-700",
                            element.buttonStyle === 'outline' && "bg-transparent border-gray-300 text-gray-700",
                            element.buttonStyle === 'text' && "bg-transparent border-transparent text-blue-600 hover:bg-blue-50",
                            element.buttonStyle === 'link' && "bg-transparent border-transparent text-blue-600 hover:text-blue-800 hover:underline",
                            (!element.buttonStyle || element.buttonStyle === 'primary') && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                        )}
                        style={{
                            backgroundColor: element.backgroundColor && element.buttonStyle !== 'text' && element.buttonStyle !== 'outline' && element.buttonStyle !== 'link' ?
                                element.backgroundColor : undefined,
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined
                        }}
                        disabled={!showInteractiveElements}
                    >
                        {element.buttonText || element.label || 'Button'}
                    </button>
                </div>
            );

        case 'rich-text':
            if (!element.content || element.content.includes('Click to edit')) {
                return showInteractiveElements ? (
                    <div className="text-slate-400 text-sm p-2 border border-dashed border-slate-300 rounded">
                        Click to edit rich text...
                    </div>
                ) : null;
            }
            return (
                <div
                    className={clsx(
                        "rounded-lg",
                        showInteractiveElements && isFormProject && "border border-slate-200"
                    )}
                    style={{
                        backgroundColor: element.backgroundColor || 'transparent',
                        paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '0',
                        paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '0',
                        paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '0',
                        paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '0'
                    }}
                >
                    <div
                        className={clsx(
                            "prose prose-sm max-w-none",
                            !element.textColor && "text-slate-600",
                            element.textAlign === 'left' && "text-left",
                            element.textAlign === 'center' && "text-center",
                            element.textAlign === 'right' && "text-right",
                            element.textAlign === 'justify' && "text-justify",
                            !element.textAlign && "text-left"
                        )}
                        style={{
                            fontFamily: element.fontFamily || undefined,
                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                            fontWeight: element.fontWeight || undefined,
                            color: element.textColor || undefined,
                            lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined
                        }}
                        dangerouslySetInnerHTML={{ __html: element.content }}
                    />
                </div>
            );

        case 'text-block':
            if (!element.content || element.content.includes('Click to edit')) {
                return showInteractiveElements ? (
                    <div className="text-slate-400 text-sm p-2 border border-dashed border-slate-300 rounded">
                        Click to edit this text block
                    </div>
                ) : null;
            }
            return (
                <div className="rounded-lg" style={{ backgroundColor: element.backgroundColor }}>
                    <div
                        className={clsx(
                            "prose prose-sm max-w-none",
                            !element.textColor && "text-slate-600",
                            element.textAlign === 'left' && "text-left",
                            element.textAlign === 'center' && "text-center",
                            element.textAlign === 'right' && "text-right",
                            element.textAlign === 'justify' && "text-justify",
                            !element.textAlign && "text-left"
                        )}
                        style={{
                            fontFamily: element.fontFamily || undefined,
                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                            fontWeight: element.fontWeight || undefined,
                            color: element.textColor || undefined,
                            lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined
                        }}
                        dangerouslySetInnerHTML={{ __html: element.content }}
                    />
                </div>
            );

        case 'heading':
            return (
                <div style={{ backgroundColor: element.backgroundColor }}>
                    {React.createElement(
                        `h${element.headingLevel || 1}`,
                        {
                            className: clsx(
                                !element.textColor && "text-gray-800",
                                !element.fontWeight && "font-bold",
                                !element.fontSize && element.headingLevel === 1 && "text-4xl",
                                !element.fontSize && element.headingLevel === 2 && "text-3xl",
                                !element.fontSize && element.headingLevel === 3 && "text-2xl",
                                !element.fontSize && element.headingLevel === 4 && "text-xl",
                                !element.fontSize && element.headingLevel === 5 && "text-lg",
                                !element.fontSize && element.headingLevel === 6 && "text-base",
                                !element.fontSize && !element.headingLevel && "text-4xl",
                                element.textAlign === 'left' && "text-left",
                                element.textAlign === 'center' && "text-center",
                                element.textAlign === 'right' && "text-right",
                                element.textAlign === 'justify' && "text-justify",
                                !element.textAlign && "text-left"
                            ),
                            style: {
                                fontFamily: element.fontFamily || undefined,
                                fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                                fontWeight: element.fontWeight || undefined,
                                color: element.textColor || undefined,
                                lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                                letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined
                            },
                            dangerouslySetInnerHTML: { __html: element.content || 'Heading' }
                        }
                    )}
                </div>
            );

        case 'image':
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

        case 'container':
            return getContainerHtml(element, options);

        case 'columns':
            return getColumnsHtml(element, options);

        case 'rows':
            return getRowsHtml(element, options);

        case 'grid':
            return getContainerHtml(element, options);

        case 'menu':
            return getMenuHtml(element, options);

        // Default case for text inputs
        default:
            if (['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local'].includes(element.type)) {
                return (
                    <input
                        type={element.type}
                        {...(register && showInteractiveElements ? register(element.id, { required: element.required }) : {})}
                        className={clsx(
                            "w-full rounded-lg text-slate-500 text-sm",
                            isFormProject && "border border-slate-200"
                        )}
                        style={{
                            backgroundColor: element.backgroundColor,
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                        }}
                        placeholder={element.placeholder}
                        readOnly={!showInteractiveElements}
                    />
                );
            }
            return null;
    }
};

// Container HTML generators exactly matching Canvas layout logic
const getContainerHtml = (element: FormElement, options: HtmlOptions): React.ReactElement => {
    const { isFormProject } = options;

    return (
        <div
            className={clsx(
                "rounded-lg relative",
                isFormProject && "border border-slate-200"
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: element.flexDirection || 'column',
                    flexWrap: element.flexWrap || 'nowrap',
                    justifyContent: element.justifyContent || 'flex-start',
                    alignItems: element.alignItems || 'stretch',
                    alignContent: element.alignContent || 'flex-start',
                    rowGap: `${(element.rowGap ?? element.gap ?? 0)}px`,
                    columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 12)}px` : '12px'
                }}
            >
                {element.children && element.children.length > 0 ? (
                    element.children.map((child) => child ? getComponentHtml(child, { ...options, parentId: element.id }) : null)
                ) : (
                    <div className="text-slate-400 text-sm text-center py-2">Empty container</div>
                )}
            </div>
        </div>
    );
};

const getColumnsHtml = (element: FormElement, options: HtmlOptions): React.ReactElement => {
    const { isFormProject } = options;

    return (
        <div
            className={clsx(
                "rounded-lg relative",
                isFormProject && "border border-slate-200"
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent'
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${element.columnCount || 2}, 1fr)`,
                    gap: `${(element.columnGap || element.gap || 12)}px`
                }}
            >
                {Array.from({ length: element.columnCount || 2 }).map((_, index) => {
                    const child = element.children?.[index];
                    return (
                        <div
                            key={index}
                            className="min-h-[32px]"
                            style={{
                                backgroundColor: element.columnBackgrounds?.[index] || 'transparent'
                            }}
                        >
                            {child ? getComponentHtml(child, { ...options, parentId: element.id }) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const getRowsHtml = (element: FormElement, options: HtmlOptions): React.ReactElement => {
    const { isFormProject } = options;

    return (
        <div
            className={clsx(
                "rounded-lg relative",
                isFormProject && "border border-slate-200"
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: element.flexWrap || 'nowrap',
                    justifyContent: element.justifyContent || 'flex-start',
                    alignItems: element.alignItems || 'stretch',
                    alignContent: element.alignContent || 'flex-start',
                    rowGap: `${(element.rowGap ?? element.gap ?? 0)}px`,
                    columnGap: `${(element.columnGap ?? element.gap ?? 0)}px`
                }}
            >
                {Array.from({ length: element.rowCount || 1 }).map((_, index) => {
                    const child = element.children?.[index];
                    return (
                        <div
                            key={index}
                            className="min-h-[32px]"
                            style={{
                                backgroundColor: element.rowBackgrounds?.[index] || 'transparent'
                            }}
                        >
                            {child ? getComponentHtml(child, { ...options, parentId: element.id }) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const getMenuHtml = (element: FormElement, options: HtmlOptions): React.ReactElement => {
    return (
        <div
            className="min-h-[40px]"
            style={{
                display: 'flex',
                flexDirection: element.flexDirection || (element.menuLayout === 'vertical' ? 'column' : 'row'),
                flexWrap: element.flexWrap || 'nowrap',
                justifyContent: element.justifyContent || 'flex-start',
                alignItems: element.alignItems || 'center',
                alignContent: element.alignContent || 'flex-start',
                rowGap: `${(element.rowGap || element.gap || 0)}px`,
                columnGap: `${(element.columnGap || element.gap || 16)}px`
            }}
        >
            {element.children && element.children.length > 0 ? (
                element.children.map((child) => child ? getComponentHtml(child, { ...options, parentId: element.id }) : null)
            ) : (
                <div className="text-gray-400 text-sm italic">
                    Drop menu items here
                </div>
            )}
        </div>
    );
};