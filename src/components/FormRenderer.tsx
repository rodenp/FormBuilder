import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertCircle, ExternalLink, Info, AlertTriangle, X, Star, Plus, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import type { FormElement, FormSettings } from '../types';
import { useStore } from '../store/useStore';

interface FormRendererProps {
    schema?: {
        elements: FormElement[];
        settings: FormSettings;
    };
    elements?: FormElement[];
    settings?: FormSettings;
    onSubmit?: (data: any) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
    schema,
    elements: propElements,
    settings: propSettings,
    onSubmit: propOnSubmit,
    isLoading = false,
    className
}) => {
    const { currentProject } = useStore();
    const isFormProject = currentProject?.type === 'form';
    
    const elements = schema?.elements || propElements || [];
    const settings = schema?.settings || propSettings || {
        title: 'Untitled Form',
        submitButtonText: 'Submit',
        primaryColor: '#3B82F6',
        buttonStyle: 'rounded',
        inputBorderStyle: 'rounded',
        submissionActions: []
    };

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleFormSubmit = async (data: any) => {
        if (propOnSubmit) {
            await propOnSubmit(data);
        }
    };

    // Canvas-to-HTML rendering function - exact copy of Canvas logic without editor features
    const renderElement = (element: FormElement, isRootLevel = true, parentType?: string): JSX.Element | null => {
        if (!element) return null;
        
        // Calculate width and layout - match Canvas logic exactly
        const isNested = !isRootLevel;
        const widthPercentage = (!isNested || ['columns', 'menu'].includes(parentType || '') ? 
            (element.width || (element.type === 'image' ? 2 : 12)) / 12 * 100 : 100);

        // Main element wrapper - match Canvas structure exactly
        return (
            <div
                key={element.id}
                className={clsx(
                    "relative flex flex-col",
                    isNested && !['columns', 'menu'].includes(parentType || '') && "w-full"
                )}
                style={{
                    // Apply percentage width for root level elements, elements in columns, and elements in menu containers
                    ...(!isNested || ['columns', 'menu'].includes(parentType || '') ? 
                        (parentType === 'menu' ? 
                            { flex: '0 0 auto', alignSelf: 'stretch' } : 
                            { width: `${widthPercentage}%` }) : {}),
                    // Apply margins
                    marginTop: `${(element.marginTop ?? 0) * 0.25}rem`,
                    marginRight: `${(element.marginRight ?? 0) * 0.25}rem`,
                    marginBottom: `${(element.marginBottom ?? 0) * 0.25}rem`,
                    marginLeft: `${(element.marginLeft ?? 0) * 0.25}rem`,
                    // Apply horizontal alignment for non-containers
                    ...(element.horizontalAlign === 'center' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ? 
                        { marginLeft: 'auto', marginRight: 'auto' } : {}),
                    ...(element.horizontalAlign === 'right' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ? 
                        { marginLeft: 'auto' } : {})
                }}
            >
                {/* Visual wrapper around label and component */}
                <div 
                    className="relative rounded-lg flex-1"
                    style={{
                        backgroundColor: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? element.backgroundColor : undefined,
                        // Only apply padding for container, columns, rows, grid, and menu
                        paddingTop: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingTop ?? 0) * 0.25}rem` : undefined,
                        paddingRight: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingRight ?? 0) * 0.25}rem` : undefined,
                        paddingBottom: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingBottom ?? 0) * 0.25}rem` : undefined,
                        paddingLeft: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? `${(element.paddingLeft ?? 0) * 0.25}rem` : undefined
                    }}
                >
                    {/* Labels for regular form elements */}
                    {isFormProject && !['hidden', 'rich-text', 'container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                        <div 
                            className="flex justify-between items-start"
                            style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap * 0.25}rem` : '0.75rem' }}
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

                    {/* Labels for container elements */}
                    {isFormProject && ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                        <div 
                            className="flex justify-between items-start"
                            style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap * 0.25}rem` : '0.75rem' }}
                        >
                            <div>
                                <label 
                                    className={clsx(
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
                                    )}
                                >
                                    {element.label}
                                    {element.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Element Content */}
                    <div 
                        style={{
                            // Apply padding to regular form elements (not containers/columns/buttons) only if padding values are set
                            paddingTop: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingTop ?? 0) * 0.25}rem` : undefined,
                            paddingRight: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingRight ?? 0) * 0.25}rem` : undefined,
                            paddingBottom: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingBottom ?? 0) * 0.25}rem` : undefined,
                            paddingLeft: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio'].includes(element.type)) ? `${(element.paddingLeft ?? 0) * 0.25}rem` : undefined
                        }}
                    >
                        {renderElementContent(element)}
                    </div>
                </div>
            </div>
        );
    };

    // Render element content - exact copy of Canvas element rendering logic
    const renderElementContent = (element: FormElement): JSX.Element | null => {
        if (element.type === 'textarea') {
            return (
                <textarea
                    {...register(element.id, { required: element.required })}
                    className={clsx(
                        "w-full rounded-lg text-slate-500 text-sm resize-none",
                        isFormProject && "border border-slate-200"
                    )}
                    style={{
                        backgroundColor: element.backgroundColor,
                        paddingTop: `${(element.paddingTop ?? 3) * 0.25}rem`,
                        paddingRight: `${(element.paddingRight ?? 3) * 0.25}rem`,
                        paddingBottom: `${(element.paddingBottom ?? 3) * 0.25}rem`,
                        paddingLeft: `${(element.paddingLeft ?? 3) * 0.25}rem`
                    }}
                    placeholder={element.placeholder}
                    rows={3}
                />
            );
        } else if (element.type === 'select') {
            return (
                <div className="relative">
                    <select 
                        {...register(element.id, { required: element.required })}
                        className={clsx(
                            "w-full rounded-lg text-slate-500 text-sm appearance-none",
                            isFormProject && "border border-slate-200"
                        )} 
                        style={{
                            backgroundColor: element.backgroundColor,
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '0.75rem',
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '0.75rem',
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '0.75rem',
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '0.75rem'
                        }}
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
        } else if (element.type === 'checkbox') {
            return (
                <div className={clsx(
                    "flex items-center rounded-lg",
                    isFormProject && "border border-slate-200"
                )} style={{
                    backgroundColor: element.backgroundColor || '#f8fafc',
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '0.75rem',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '0.75rem',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '0.75rem',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '0.75rem'
                }}>
                    <input 
                        type="checkbox" 
                        {...register(element.id, { required: element.required })}
                        className="h-4 w-4 text-brand-600 rounded border-slate-300" 
                    />
                    <span className="ml-3 text-sm text-slate-600">{element.placeholder || 'Checkbox option'}</span>
                </div>
            );
        } else if (element.type === 'radio') {
            return (
                <div className={clsx(
                    "space-y-2 rounded-lg",
                    isFormProject && "border border-slate-200"
                )} style={{
                    backgroundColor: element.backgroundColor || '#f8fafc',
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '0.75rem',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '0.75rem',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '0.75rem',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '0.75rem'
                }}>
                    {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                        <div key={idx} className="flex items-center">
                            <input 
                                type="radio" 
                                {...register(element.id, { required: element.required })}
                                name={element.id} 
                                value={opt.value}
                                className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500" 
                            />
                            <span className="ml-3 text-sm text-slate-600">{opt.label}</span>
                        </div>
                    ))}
                </div>
            );
        } else if (element.type === 'star-rating') {
            return (
                <div className="flex gap-1 items-center">
                    {[...Array(element.maxStars || 5)].map((_, i) => (
                        <Star key={i} size={24} className="text-slate-300 fill-slate-100" />
                    ))}
                </div>
            );
        } else if (element.type === 'container') {
            return renderContainer(element);
        } else if (element.type === 'columns') {
            return renderColumns(element);
        } else if (element.type === 'rows') {
            return renderRows(element);
        } else if (element.type === 'grid') {
            return renderContainer(element);
        } else if (element.type === 'hidden') {
            return (
                <input
                    type="hidden"
                    {...register(element.id)}
                    value={element.value || ''}
                />
            );
        } else if (element.type === 'rich-text') {
            return (
                <div className="rounded-lg" style={{
                    backgroundColor: element.backgroundColor || 'transparent',
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '0',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '0',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '0',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '0'
                }}>
                    <div 
                        className={clsx(
                            "prose prose-sm max-w-none text-slate-600",
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
                        dangerouslySetInnerHTML={{ __html: element.content || '<p>Rich text content</p>' }}
                    />
                </div>
            );
        } else if (element.type === 'button') {
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
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : undefined,
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : undefined,
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : undefined,
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : undefined,
                            marginTop: element.marginTop !== undefined ? `${element.marginTop * 0.25}rem` : undefined,
                            marginRight: element.marginRight !== undefined ? `${element.marginRight * 0.25}rem` : undefined,
                            marginBottom: element.marginBottom !== undefined ? `${element.marginBottom * 0.25}rem` : undefined,
                            marginLeft: element.marginLeft !== undefined ? `${element.marginLeft * 0.25}rem` : undefined
                        }}
                    >
                        {element.buttonText || element.label || 'Button'}
                    </button>
                </div>
            );
        } else if (element.type === 'text-block') {
            return (
                <div style={{
                    backgroundColor: element.backgroundColor || 'transparent'
                }}>
                    <div 
                        className={clsx(
                            "prose prose-sm max-w-none text-slate-600",
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
                        dangerouslySetInnerHTML={{ __html: element.content || '<p>Text block content</p>' }}
                    />
                </div>
            );
        } else if (element.type === 'heading') {
            const HeadingTag = element.headingLevel === 'h1' ? 'h1' : 
                               element.headingLevel === 'h2' ? 'h2' : 
                               element.headingLevel === 'h3' ? 'h3' : 
                               element.headingLevel === 'h4' ? 'h4' : 
                               element.headingLevel === 'h5' ? 'h5' : 
                               element.headingLevel === 'h6' ? 'h6' : 'h2';
            
            return (
                <HeadingTag
                    className={clsx(
                        "font-bold text-slate-800",
                        element.headingLevel === 'h1' && "text-4xl",
                        element.headingLevel === 'h2' && "text-3xl",
                        element.headingLevel === 'h3' && "text-2xl",
                        element.headingLevel === 'h4' && "text-xl",
                        element.headingLevel === 'h5' && "text-lg",
                        element.headingLevel === 'h6' && "text-base",
                        !element.headingLevel && "text-3xl",
                        element.textAlign === 'left' && "text-left",
                        element.textAlign === 'center' && "text-center",
                        element.textAlign === 'right' && "text-right",
                        element.textAlign === 'justify' && "text-justify",
                        !element.textAlign && "text-left"
                    )}
                    style={{
                        backgroundColor: element.backgroundColor,
                        fontFamily: element.fontFamily || undefined,
                        fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                        fontWeight: element.fontWeight || undefined,
                        color: element.textColor || undefined,
                        lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined
                    }}
                >
                    {element.content || 'Heading'}
                </HeadingTag>
            );
        } else if (element.type === 'menu') {
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
                        rowGap: `${(element.rowGap || element.gap || 0) * 0.25}rem`,
                        columnGap: `${(element.columnGap || element.gap || 16) * 0.25}rem`
                    }}
                >
                    {element.children && element.children.length > 0 ? (
                        element.children.map((child) => (
                            <div key={child.id}>
                                {renderElement(child, false, 'menu')}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm italic">
                            No menu items
                        </div>
                    )}
                </div>
            );
        } else if (element.type === 'social') {
            return (
                <div className={clsx(
                    "rounded-lg",
                    isFormProject && "border border-slate-200"
                )} style={{
                    backgroundColor: element.backgroundColor,
                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '1rem',
                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '1rem',
                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '1rem',
                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '1rem'
                }}>
                    <div className={clsx(
                        "flex gap-3",
                        element.socialLayout === 'vertical' ? "flex-col" : "flex-row"
                    )}>
                        {(element.socialLinks || [
                            { platform: 'Facebook', url: '#', icon: '📘' },
                            { platform: 'Twitter', url: '#', icon: '🐦' },
                            { platform: 'LinkedIn', url: '#', icon: '💼' }
                        ]).map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <span>{social.icon || '🔗'}</span>
                                {social.platform}
                            </a>
                        ))}
                    </div>
                </div>
            );
        } else if (element.type === 'image') {
            return (
                <div 
                    className={clsx(
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
                        style={{
                            backgroundColor: element.backgroundColor
                        }}
                    />
                </div>
            );
        } else {
            // Default input rendering for text, email, password, number, tel, url, date, time, datetime-local
            return (
                <input
                    type={element.type}
                    {...register(element.id, { required: element.required })}
                    className={clsx(
                        "w-full rounded-lg text-slate-500 text-sm",
                        isFormProject && "border border-slate-200"
                    )}
                    style={{
                        backgroundColor: element.backgroundColor,
                        paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : '0.75rem',
                        paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : '0.75rem',
                        paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : '0.75rem',
                        paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : '0.75rem'
                    }}
                    placeholder={element.placeholder}
                />
            );
        }
    };

    // Container rendering - copy Canvas container logic
    const renderContainer = (element: FormElement) => {
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
                    className="min-h-[40px]"
                    style={{
                        display: 'flex',
                        flexDirection: element.flexDirection || 'column',
                        flexWrap: element.flexWrap || 'nowrap',
                        justifyContent: element.justifyContent || 'flex-start',
                        alignItems: element.alignItems || 'stretch',
                        alignContent: element.alignContent || 'flex-start',
                        rowGap: `${(element.rowGap ?? element.gap ?? 0) * 0.25}rem`,
                        columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 12) * 0.25}rem` : '0.75rem'
                    }}
                >
                    {element.children && element.children.length > 0 ? (
                        element.children.map((child) => (
                            renderElement(child, false, 'container')
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm italic p-4">
                            Container content will appear here
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Columns rendering - copy Canvas columns logic
    const renderColumns = (element: FormElement) => {
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
                        gap: `${(element.columnGap || element.gap || 12) * 0.25}rem`
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
                                {child ? renderElement(child, false, 'columns') : (
                                    <div className="text-gray-400 text-sm italic p-4 text-center">
                                        Column {index + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Rows rendering - copy Canvas rows logic  
    const renderRows = (element: FormElement) => {
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
                        rowGap: `${(element.rowGap ?? element.gap ?? 0) * 0.25}rem`,
                        columnGap: `${(element.columnGap ?? element.gap ?? 0) * 0.25}rem`
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
                                {child ? renderElement(child, false, 'rows') : (
                                    <div className="text-gray-400 text-sm italic p-4 text-center">
                                        Row {index + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Match Canvas structure exactly
    const content = (
        <div
            className={clsx(
                "min-h-[800px] bg-white rounded-2xl shadow-card px-8 pb-8",
                currentProject?.type !== 'form' && "pt-0",
                currentProject?.type === 'form' && "pt-8",
                elements.length === 0 && "flex items-center justify-center"
            )}
            style={{
                backgroundColor: settings.formBackground || '#ffffff',
                width: settings.contentWidth ? `${settings.contentWidth}px` : '100%',
                maxWidth: settings.contentWidth ? `${settings.contentWidth}px` : 'none'
            }}
        >
            {elements.length === 0 ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-600 mb-3">No Content</h3>
                    <p className="text-slate-500 max-w-md leading-relaxed mx-auto">
                        This preview will show your content once you add elements to the canvas.
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex flex-col"
                >
                    {/* Hidden fields */}
                    {elements.filter(el => el.type === 'hidden').map((element) => (
                        <input
                            key={element.id}
                            type="hidden"
                            {...register(element.id)}
                            value={element.value || ''}
                        />
                    ))}

                    {/* Render elements exactly like Canvas */}
                    {elements.filter(el => el.type !== 'hidden').map((element) =>
                        renderElement(element, true)
                    )}

                    {/* Submit button only for form projects */}
                    {isFormProject && (
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                                style={{
                                    backgroundColor: settings.primaryColor || '#3B82F6',
                                    borderColor: settings.primaryColor || '#3B82F6',
                                    color: '#FFFFFF'
                                }}
                            >
                                {isLoading ? 'Processing...' : settings.submitButtonText}
                            </button>
                        </div>
                    )}
                </form>
            )}
        </div>
    );

    // Use exact Canvas structure and CSS classes
    return (
        <div className="form-builder-canvas">
            <div 
                className="form-builder-canvas-inner"
                style={{
                    display: 'flex',
                    justifyContent: settings.contentAlignment === 'center' ? 'center' : 
                                   settings.contentAlignment === 'right' ? 'flex-end' : 'flex-start'
                }}
            >
                {content}
            </div>
        </div>
    );
};