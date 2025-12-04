import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertCircle, ExternalLink, Info, AlertTriangle, X, Star } from 'lucide-react';
import { clsx } from 'clsx';
import type { FormElement, FormSettings, SubmissionAction } from '../types';
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

// Style utility functions
const getButtonClasses = (settings: FormSettings) => {
    const baseClasses = "w-full py-3 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

    let borderClasses = "";
    switch (settings.buttonStyle) {
        case 'square':
            borderClasses = "rounded-none";
            break;
        case 'pill':
            borderClasses = "rounded-full";
            break;
        default:
            borderClasses = "rounded-lg";
    }

    return `${baseClasses} ${borderClasses}`;
};

const getInputClasses = (settings: FormSettings) => {
    const baseClasses = "custom-input w-full p-3 border border-gray-300 focus:outline-none transition-all";

    let borderClasses = "";
    switch (settings.inputBorderStyle) {
        case 'square':
            borderClasses = "rounded-none";
            break;
        case 'pill':
            borderClasses = "rounded-full";
            break;
        default:
            borderClasses = "rounded-lg";
    }

    return `${baseClasses} ${borderClasses}`;
};

const getButtonStyle = (settings: FormSettings) => {
    const primaryColor = settings.primaryColor || '#3B82F6';
    return {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        color: '#FFFFFF'
    };
};

const getCheckboxClasses = () => {
    return "custom-checkbox h-5 w-5 rounded border-gray-300 focus:outline-none transition-all";
};

const getRadioClasses = () => {
    return "custom-radio h-5 w-5 border-gray-300 focus:outline-none transition-all";
};

const getCheckboxStyle = (settings: FormSettings) => {
    const primaryColor = settings.primaryColor || '#3B82F6';
    return {
        accentColor: primaryColor
    };
};

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
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [executedActions, setExecutedActions] = useState<SubmissionAction[]>([]);
    const [actionMessages, setActionMessages] = useState<{ type: string; message: string; messageType?: string }[]>([]);

    // Reset status when isLoading changes
    React.useEffect(() => {
        if (isLoading) {
            setSubmitStatus('submitting');
        } else if (submitStatus === 'submitting' && !isLoading) {
            // If we were submitting and now loading is done, we don't necessarily know if it was success or error
            // The parent component should handle the success state or we should have a prop for it
            // For now, we'll assume if propOnSubmit is provided, the parent handles the state
        }
    }, [isLoading]);

    const executeSubmissionActions = async (formData: any) => {
        if (!settings.submissionActions) return;

        const enabledActions = settings.submissionActions.filter(action => action.enabled);
        const executed: SubmissionAction[] = [];
        const messages: { type: string; message: string; messageType?: string }[] = [];

        for (const action of enabledActions) {
            try {
                if (action.type === 'webhook' && action.webhook) {
                    // Use CORS proxy for testing - in production, this should go through your backend
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(action.webhook.url)}`;

                    const webhookPayload = {
                        formData,
                        metadata: {
                            formTitle: settings.title,
                            submittedAt: new Date().toISOString()
                        }
                    };

                    let response;
                    try {
                        // Try direct request first
                        response = await fetch(action.webhook.url, {
                            method: action.webhook.method,
                            headers: {
                                'Content-Type': 'application/json',
                                ...(action.webhook.headers || {})
                            },
                            body: JSON.stringify(webhookPayload),
                        });
                    } catch (corsError) {
                        console.warn('Direct webhook failed (CORS), trying proxy...', corsError);
                        // Fallback to proxy for GET requests only (most proxies don't support POST)
                        if (action.webhook.method === 'POST') {
                            // For POST requests, simulate success for demo purposes
                            console.log('Webhook payload (simulated):', webhookPayload);
                            executed.push(action);
                            continue;
                        } else {
                            response = await fetch(proxyUrl);
                        }
                    }

                    if (response && response.ok) {
                        executed.push(action);
                    } else if (response) {
                        throw new Error(`Webhook failed with status ${response.status}`);
                    }
                } else if (action.type === 'redirect' && action.redirectUrl) {
                    if (action.openInNewTab) {
                        window.open(action.redirectUrl, '_blank');
                    } else {
                        window.location.href = action.redirectUrl;
                        return; // Don't continue if redirecting
                    }
                    executed.push(action);
                } else if (action.type === 'message' && action.message) {
                    messages.push({
                        type: action.type,
                        message: action.message,
                        messageType: action.messageType || 'success'
                    });
                    executed.push(action);
                }
            } catch (error) {
                console.error(`Action failed:`, error);
                // Continue with other actions even if one fails
            }
        }

        setExecutedActions(executed);
        setActionMessages(messages);

        // Legacy webhook support
        if (settings.webhookUrl) {
            try {
                await fetch(settings.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } catch (error) {
                console.error('Legacy webhook error:', error);
            }
        }
    };

    const handleFormSubmit = async (data: any) => {
        console.log('Form Data:', data);
        setSubmitStatus('submitting');

        try {
            if (propOnSubmit) {
                await propOnSubmit(data);
            } else {
                await executeSubmissionActions(data);
            }
            setSubmitStatus('success');
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        }
    };

    // Recursive function to render form elements
    const renderElement = (element: any, isRootLevel = true): JSX.Element | null => {
        // Handle null/undefined elements
        if (!element) {
            return null;
        }
        
        // Calculate width percentage for root level elements
        const widthPercentage = isRootLevel ? (element.width || (element.type === 'image' ? 2 : 12)) / 12 * 100 : 100;

        if (element.type === 'rich-text') {
            return (
                <div
                    key={element.id}
                    className={clsx(
                        "prose prose-gray max-w-none mb-6", 
                        element.backgroundColor && "p-4 rounded-lg"
                    )}
                    style={{
                        ...(isRootLevel ? { width: `${widthPercentage}%` } : {}),
                        backgroundColor: element.backgroundColor
                    }}
                    dangerouslySetInnerHTML={{ __html: element.content || '<p>Your rich text content here</p>' }}
                />
            );
        }

        if (element.type === 'container') {
            return (
                <div
                    key={element.id}
                    style={{
                        ...(isRootLevel ? { width: `${widthPercentage}%` } : {}),
                        // Apply margins
                        marginTop: element.marginTop ? `${element.marginTop * 0.25}rem` : undefined,
                        marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
                        marginBottom: element.marginBottom !== undefined ? `${element.marginBottom * 0.25}rem` : undefined,
                        marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined
                    }}
                >
                    <div 
                        className="rounded-lg"
                        style={{
                            backgroundColor: element.backgroundColor,
                            // Only apply padding for container when values are explicitly set
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : undefined,
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : undefined,
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : undefined,
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : undefined
                        }}
                    >
                        {isFormProject && element.label && element.label.trim() && (
                            <div
                                style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap * 0.25}rem` : '0.75rem' }}
                            >
                                <h3 className={clsx(
                                    "text-gray-800",
                                    element.labelSize === 'xs' && "text-xs",
                                    element.labelSize === 'sm' && "text-sm",
                                    element.labelSize === 'base' && "text-base",
                                    element.labelSize === 'lg' && "text-lg",
                                    !element.labelSize && "text-lg",
                                    element.labelBold && "font-bold",
                                    !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                    !element.labelBold && element.labelWeight === 'medium' && "font-medium",
                                    !element.labelBold && element.labelWeight === 'semibold' && "font-semibold",
                                    !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                    !element.labelBold && !element.labelWeight && "font-semibold",
                                    element.labelItalic && "italic",
                                    element.labelUnderline && "underline",
                                    element.labelStrikethrough && "line-through"
                                )}>
                                    {element.label}
                                </h3>
                            </div>
                        )}
                        {element.children && element.children.length > 0 && (
                            <div 
                                style={{
                                    display: element.display || 'flex',
                                    flexDirection: element.display === 'flex' ? (element.flexDirection || 'column') : undefined,
                                    flexWrap: element.display === 'flex' ? (element.flexWrap || 'wrap') : undefined,
                                    justifyContent: element.display !== 'block' ? element.justifyContent : undefined,
                                    alignItems: element.display !== 'block' ? element.alignItems : undefined,
                                    alignContent: element.display === 'flex' ? (element.alignContent || 'flex-start') : 'start',
                                    gridTemplateColumns: element.display === 'grid' ? `repeat(${element.gridColumns || 3}, auto)` : undefined,
                                    rowGap: element.display !== 'block' ? `${(element.rowGap || element.gap || 0) * 0.25}rem` : undefined,
                                    columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 0) * 0.25}rem` : undefined
                                }}
                            >
                                {element.children.map((childElement: any) =>
                                    renderElement(childElement, false)
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (element.type === 'columns' || element.type === 'rows' || element.type === 'grid') {
            return (
                <div
                    key={element.id}
                    style={{
                        ...(isRootLevel ? { width: `${widthPercentage}%` } : {}),
                        // Apply margins
                        marginTop: element.marginTop ? `${element.marginTop * 0.25}rem` : undefined,
                        marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
                        marginBottom: element.marginBottom !== undefined ? `${element.marginBottom * 0.25}rem` : undefined,
                        marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined
                    }}
                >
                    <div 
                        className="rounded-lg"
                        style={{
                            backgroundColor: element.backgroundColor,
                            // Only apply padding for columns when values are explicitly set
                            paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : undefined,
                            paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : undefined,
                            paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : undefined,
                            paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : undefined
                        }}
                    >
                        {isFormProject && element.label && element.label.trim() && (
                            <div
                                style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap * 0.25}rem` : '0.75rem' }}
                            >
                                <h3 className={clsx(
                                    "text-gray-800",
                                    element.labelSize === 'xs' && "text-xs",
                                    element.labelSize === 'sm' && "text-sm",
                                    element.labelSize === 'base' && "text-base",
                                    element.labelSize === 'lg' && "text-lg",
                                    !element.labelSize && "text-lg",
                                    element.labelBold && "font-bold",
                                    !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                    !element.labelBold && element.labelWeight === 'medium' && "font-medium",
                                    !element.labelBold && element.labelWeight === 'semibold' && "font-semibold",
                                    !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                    !element.labelBold && !element.labelWeight && "font-semibold",
                                    element.labelItalic && "italic",
                                    element.labelUnderline && "underline",
                                    element.labelStrikethrough && "line-through"
                                )}>
                                    {element.label}
                                </h3>
                            </div>
                        )}
                        {element.children && element.children.length > 0 && (
                            <div 
                                style={{
                                    // Auto-set layout based on container type
                                    display: element.type === 'columns' || element.type === 'rows' ? 'flex' : 
                                             element.type === 'grid' ? 'grid' : (element.display || 'grid'),
                                    flexDirection: element.type === 'columns' ? 'row' : element.type === 'rows' ? 'column' : 
                                        (element.display === 'flex' ? (element.flexDirection || 'row') : undefined),
                                    flexWrap: (element.type === 'columns' || element.type === 'rows' || element.display === 'flex') ? 
                                        (element.flexWrap || 'wrap') : undefined,
                                    justifyContent: (element.display !== 'block' || element.type === 'columns' || element.type === 'rows') ? 
                                        element.justifyContent : undefined,
                                    alignItems: (element.display !== 'block' || element.type === 'columns' || element.type === 'rows') ? 
                                        element.alignItems : undefined,
                                    alignContent: (element.type === 'columns' || element.type === 'rows' || element.display === 'flex') ? 
                                        (element.alignContent || 'flex-start') : 'start',
                                    gridTemplateColumns: (element.display === 'grid' || element.type === 'grid') && element.type !== 'columns' && element.type !== 'rows' ? 
                                        `repeat(${element.gridColumns || element.columnCount || 3}, 1fr)` : undefined,
                                    rowGap: (element.display !== 'block' || element.type === 'rows' || element.type === 'grid') ? 
                                        `${(element.rowGap || element.gap || 0) * 0.25}rem` : undefined,
                                    columnGap: (element.display !== 'block' || element.type === 'columns' || element.type === 'grid') ? 
                                        `${(element.columnGap || element.gap || 0) * 0.25}rem` : undefined
                                }}
                            >
                                {(element.type === 'columns' || element.type === 'rows' || element.type === 'grid' || element.display === 'flex') ? (
                                    // For flex layout (including columns/rows) or grid, render children directly without column wrappers
                                    element.children.map((childElement: any) => (
                                        renderElement(childElement, false)
                                    ))
                                ) : (
                                    // For grid layout, use column wrappers with background colors
                                    element.children.map((childElement: any, index: number) => (
                                        <div
                                            key={childElement.id}
                                            style={{
                                                backgroundColor: element.columnBackgrounds?.[index] || 'transparent',
                                                background: element.columnBackgrounds?.[index] || 'none'
                                            }}
                                            className="rounded"
                                        >
                                            {renderElement(childElement, false)}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Regular form elements and nested input handling
        return (
            <div 
                key={element.id} 
                style={{
                    ...(isRootLevel ? { width: `${widthPercentage}%` } : {}),
                    // Apply margins - include default marginBottom like canvas
                    marginTop: element.marginTop ? `${element.marginTop * 0.25}rem` : undefined,
                    marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
                    marginBottom: element.marginBottom !== undefined ? `${element.marginBottom * 0.25}rem` : undefined,
                    marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
                    // Apply horizontal alignment for non-containers
                    ...(element.horizontalAlign === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
                    ...(element.horizontalAlign === 'right' ? { marginLeft: 'auto' } : {})
                }}
            >
                <div 
                    className="rounded-lg"
                    style={{
                        backgroundColor: element.backgroundColor
                    }}
                >
                    <div style={{
                        // Apply padding only if values are explicitly set
                        paddingTop: element.paddingTop !== undefined ? `${element.paddingTop * 0.25}rem` : undefined,
                        paddingRight: element.paddingRight !== undefined ? `${element.paddingRight * 0.25}rem` : undefined,
                        paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom * 0.25}rem` : undefined,
                        paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft * 0.25}rem` : undefined
                    }}>
                {isFormProject && element.label && element.label.trim() && element.type !== 'rich-text' && (
                    <div
                        style={{ marginBottom: element.labelGap !== undefined ? `${element.labelGap * 0.25}rem` : '0.25rem' }}
                    >
                    <label className={clsx(
                        "block text-gray-700",
                        element.labelSize === 'xs' && "text-xs",
                        element.labelSize === 'sm' && "text-sm",
                        element.labelSize === 'base' && "text-base",
                        element.labelSize === 'lg' && "text-lg",
                        !element.labelSize && "text-sm",
                        // Legacy labelWeight support (only if no new formatting is used)
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
                )}

                {element.type === 'textarea' ? (
                    <textarea
                        {...register(element.id, { required: element.required })}
                        placeholder={element.placeholder}
                        className={getInputClasses(settings)}
                        rows={4}
                    />
                ) : element.type === 'select' ? (
                    <select
                        {...register(element.id, { required: element.required })}
                        className={getInputClasses(settings)}
                    >
                        <option value="">Select an option</option>
                        {element.options?.map((opt: any, idx: number) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : element.type === 'checkbox' ? (
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(element.id, { required: element.required })}
                            className={getCheckboxClasses()}
                            style={getCheckboxStyle(settings)}
                        />
                        <span className="text-sm text-gray-600">
                            {element.placeholder || 'Checkbox option'}
                        </span>
                    </div>
                ) : element.type === 'radio' ? (
                    <div className="space-y-3">
                        {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    {...register(element.id, { required: element.required })}
                                    value={opt.value}
                                    className={getRadioClasses()}
                                    style={getCheckboxStyle(settings)}
                                />
                                <span className="text-sm text-gray-600">{opt.label}</span>
                            </div>
                        ))}
                    </div>
                ) : element.type === 'star-rating' ? (
                    <div className="flex gap-1 items-center">
                        {[...Array(element.maxStars || 5)].map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400 transition-colors"
                                onClick={() => { }}
                            >
                                <Star size={24} className="fill-current" />
                            </button>
                        ))}
                    </div>
                ) : element.type === 'button' ? (
                    element.buttonType === 'submit' && element.buttonUrl ? (
                        <a
                            href={element.buttonUrl}
                            target={element.buttonTarget || '_self'}
                            rel={element.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                            className={clsx(
                                "inline-block font-medium transition-all rounded-lg border text-center cursor-pointer no-underline",
                                element.buttonSize === 'sm' && "px-3 py-1.5 text-sm",
                                element.buttonSize === 'lg' && "px-6 py-3 text-lg",
                                (!element.buttonSize || element.buttonSize === 'md') && "px-4 py-2 text-base",
                                element.buttonStyle === 'primary' && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                                element.buttonStyle === 'secondary' && "bg-gray-600 border-gray-600 text-white hover:bg-gray-700",
                                element.buttonStyle === 'outline' && "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50",
                                element.buttonStyle === 'text' && "bg-transparent border-transparent text-blue-600 hover:bg-blue-50",
                                (!element.buttonStyle || element.buttonStyle === 'primary') && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                            )}
                            style={getButtonStyle(settings)}
                        >
                            {element.buttonText || element.label || 'Button'}
                        </a>
                    ) : (
                        <button
                            type={element.buttonType || 'button'}
                            className={clsx(
                                "font-medium transition-all rounded-lg border",
                                element.buttonSize === 'sm' && "px-3 py-1.5 text-sm",
                                element.buttonSize === 'lg' && "px-6 py-3 text-lg",
                                (!element.buttonSize || element.buttonSize === 'md') && "px-4 py-2 text-base",
                                element.buttonStyle === 'primary' && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                                element.buttonStyle === 'secondary' && "bg-gray-600 border-gray-600 text-white hover:bg-gray-700",
                                element.buttonStyle === 'outline' && "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50",
                                element.buttonStyle === 'text' && "bg-transparent border-transparent text-blue-600 hover:bg-blue-50",
                                (!element.buttonStyle || element.buttonStyle === 'primary') && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                            )}
                            style={getButtonStyle(settings)}
                        >
                            {element.buttonText || element.label || 'Button'}
                        </button>
                    )
                ) : element.type === 'text-block' ? (
                    <div className="rounded-lg" style={{
                        backgroundColor: element.backgroundColor
                    }}>
                        <div 
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: element.content || '<p>Your text content here</p>' }}
                        />
                    </div>
                ) : element.type === 'heading' ? (
                    <div className="rounded-lg" style={{
                        backgroundColor: element.backgroundColor,
                        padding: '1rem'
                    }}>
                        {React.createElement(
                            `h${element.headingLevel || 1}`,
                            {
                                className: clsx(
                                    "text-gray-800 font-bold",
                                    element.headingLevel === 1 && "text-4xl",
                                    element.headingLevel === 2 && "text-3xl",
                                    element.headingLevel === 3 && "text-2xl",
                                    element.headingLevel === 4 && "text-xl",
                                    element.headingLevel === 5 && "text-lg",
                                    element.headingLevel === 6 && "text-base",
                                    !element.headingLevel && "text-4xl"
                                )
                            },
                            element.content || 'Your heading here'
                        )}
                    </div>
                ) : element.type === 'menu' ? (
                    <div className="border border-gray-200 rounded-lg" style={{
                        backgroundColor: element.backgroundColor,
                        padding: '1rem'
                    }}>
                        <nav 
                            style={{
                                display: element.display || 'flex',
                                flexDirection: element.display === 'flex' ? (element.flexDirection || (element.menuLayout === 'vertical' ? 'column' : 'row')) : undefined,
                                flexWrap: element.display === 'flex' ? (element.flexWrap || 'wrap') : undefined,
                                justifyContent: element.display !== 'block' ? element.justifyContent : undefined,
                                alignItems: element.display !== 'block' ? element.alignItems : undefined,
                                alignContent: element.display === 'flex' ? (element.alignContent || 'flex-start') : 'start',
                                gridTemplateColumns: element.display === 'grid' ? `repeat(${element.gridColumns || 3}, auto)` : undefined,
                                rowGap: element.display !== 'block' ? `${(element.rowGap || element.gap || 16) * 0.25}rem` : '1rem',
                                columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 16) * 0.25}rem` : '1rem'
                            }}
                        >
                            {(element.menuItems || [{ label: 'Home', href: '#' }, { label: 'About', href: '#' }, { label: 'Contact', href: '#' }]).map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    target={item.target || '_self'}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                ) : element.type === 'social' ? (
                    <div className="border border-gray-200 rounded-lg" style={{
                        backgroundColor: element.backgroundColor,
                        padding: '1rem'
                    }}>
                        <div 
                            style={{
                                display: element.display || 'flex',
                                flexDirection: element.display === 'flex' ? (element.flexDirection || (element.socialLayout === 'vertical' ? 'column' : 'row')) : undefined,
                                flexWrap: element.display === 'flex' ? (element.flexWrap || 'wrap') : undefined,
                                justifyContent: element.display !== 'block' ? element.justifyContent : undefined,
                                alignItems: element.display !== 'block' ? element.alignItems : undefined,
                                alignContent: element.display === 'flex' ? (element.alignContent || 'flex-start') : 'start',
                                gridTemplateColumns: element.display === 'grid' ? `repeat(${element.gridColumns || 3}, auto)` : undefined,
                                rowGap: element.display !== 'block' ? `${(element.rowGap || element.gap || 12) * 0.25}rem` : '0.75rem',
                                columnGap: element.display !== 'block' ? `${(element.columnGap || element.gap || 12) * 0.25}rem` : '0.75rem'
                            }}
                        >
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
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    <span>{social.icon || '🔗'}</span>
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                ) : element.type === 'image' ? (
                    <img
                        src={element.imageUrl || 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image'}
                        alt={element.imageAlt || 'Image'}
                        className="rounded-lg border border-gray-200 block w-full h-auto"
                        style={{
                            backgroundColor: element.backgroundColor
                        }}
                    />
                ) : (
                    <input
                        type={element.type}
                        {...register(element.id, { required: element.required })}
                        placeholder={element.placeholder}
                        className={getInputClasses(settings)}
                    />
                )}

                {errors[element.id] && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        This field is required
                    </p>
                )}
                    </div>
                </div>
            </div>
        );
    };

    if (submitStatus === 'success' && !propOnSubmit) {
        return (
            <div className="p-4">
                {/* Custom Messages */}
                {actionMessages.map((msg, index) => (
                    <div key={index} className={`p-4 rounded-lg mb-4 flex items-start gap-3 ${msg.messageType === 'success' ? 'bg-green-50 border border-green-200' :
                        msg.messageType === 'info' ? 'bg-blue-50 border border-blue-200' :
                            msg.messageType === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                                'bg-red-50 border border-red-200'
                        }`}>
                        <div className={`flex-shrink-0 ${msg.messageType === 'success' ? 'text-green-500' :
                            msg.messageType === 'info' ? 'text-blue-500' :
                                msg.messageType === 'warning' ? 'text-yellow-500' :
                                    'text-red-500'
                            }`}>
                            {msg.messageType === 'success' ? <CheckCircle size={20} /> :
                                msg.messageType === 'info' ? <Info size={20} /> :
                                    msg.messageType === 'warning' ? <AlertTriangle size={20} /> :
                                        <X size={20} />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm ${msg.messageType === 'success' ? 'text-green-800' :
                                msg.messageType === 'info' ? 'text-blue-800' :
                                    msg.messageType === 'warning' ? 'text-yellow-800' :
                                        'text-red-800'
                                }`}>
                                {msg.message}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Default success message if no custom messages */}
                {actionMessages.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-6">Your form has been successfully submitted.</p>
                    </div>
                )}

                {/* Action Status Summary */}
                {executedActions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Actions Executed</h3>
                        <div className="space-y-2">
                            {executedActions.map((action, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">
                                        {action.type === 'webhook' ? `Webhook: ${action.webhook?.url} (simulated)` :
                                            action.type === 'redirect' ? `Redirect: ${action.redirectUrl}` :
                                                action.type === 'message' ? 'Message displayed' :
                                                    action.type}
                                    </span>
                                    {action.type === 'redirect' && action.openInNewTab && (
                                        <ExternalLink size={12} className="text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-6">
                    <button
                        onClick={() => {
                            setSubmitStatus('idle');
                            setExecutedActions([]);
                            setActionMessages([]);
                        }}
                        className={getButtonClasses(settings).replace('w-full', 'px-6 py-2')}
                        style={getButtonStyle(settings)}
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return isFormProject ? (
        <div
            className={clsx(
                "rounded-xl shadow-sm border border-gray-200 px-8 pt-8 pb-8",
                className
            )}
            style={{
                backgroundColor: settings.formBackground || '#FFFFFF'
            }}
        >
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{settings.title}</h1>
                {settings.description && (
                    <p className="text-gray-600">{settings.description}</p>
                )}
            </div>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                action={settings.formAction || undefined}
                method={settings.formMethod || 'POST'}
                target={settings.formTarget || undefined}
            >
                {/* Custom CSS for dynamic theming */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .custom-input:focus {
                            --tw-ring-color: ${settings.primaryColor || '#3B82F6'};
                            border-color: ${settings.primaryColor || '#3B82F6'};
                            box-shadow: 0 0 0 2px ${settings.primaryColor || '#3B82F6'}33;
                        }
                        .custom-checkbox:focus,
                        .custom-radio:focus {
                            --tw-ring-color: ${settings.primaryColor || '#3B82F6'};
                            box-shadow: 0 0 0 2px ${settings.primaryColor || '#3B82F6'}33;
                        }
                    `
                }} />

                {/* Hidden fields */}
                {elements.filter(el => el.type === 'hidden').map((element) => (
                    <input
                        key={element.id}
                        type="hidden"
                        {...register(element.id)}
                        value={element.value || ''}
                    />
                ))}

                {/* Form elements layout */}
                <div className="flex flex-col mb-6">
                    {elements.filter(el => el.type !== 'hidden').map((element) =>
                        renderElement(element, true)
                    )}
                </div>

                {isFormProject && (
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitStatus === 'submitting' || isLoading}
                            className={getButtonClasses(settings)}
                            style={getButtonStyle(settings)}
                        >
                            {submitStatus === 'submitting' || isLoading ? 'Processing...' : settings.submitButtonText}
                        </button>
                    </div>
                )}
            </form>
        </div>
    ) : (
        // Non-form projects: render full width like canvas
        <div 
            className={className}
            style={{
                backgroundColor: settings.formBackground || '#FFFFFF',
                minHeight: '100vh'
            }}
        >
            <div className="flex flex-col">
                {elements.filter(el => el.type !== 'hidden').map((element) =>
                    renderElement(element, true)
                )}
            </div>
        </div>
    );
};
