import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { CheckCircle, AlertCircle, ExternalLink, Info, AlertTriangle, X, Star, Smartphone, Tablet, Laptop, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';
import type { SubmissionAction, FormSettings } from '../types';

import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

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

const getInputStyle = (settings: FormSettings) => {
    const primaryColor = settings.primaryColor || '#3B82F6';
    return {
        '--tw-ring-color': primaryColor,
        '--tw-border-opacity': '1'
    } as any;
};

const getButtonStyle = (settings: FormSettings) => {
    const primaryColor = settings.primaryColor || '#3B82F6';
    return {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        color: '#FFFFFF'
    };
};

const getCheckboxClasses = (settings: FormSettings) => {
    return "custom-checkbox h-5 w-5 rounded border-gray-300 focus:outline-none transition-all";
};

const getRadioClasses = (settings: FormSettings) => {
    return "custom-radio h-5 w-5 border-gray-300 focus:outline-none transition-all";
};

const getCheckboxStyle = (settings: FormSettings) => {
    const primaryColor = settings.primaryColor || '#3B82F6';
    return {
        accentColor: primaryColor
    };
};

export const Preview: React.FC = () => {
    const { elements, settings } = useStore();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [executedActions, setExecutedActions] = useState<SubmissionAction[]>([]);
    const [actionMessages, setActionMessages] = useState<{ type: string; message: string; messageType?: string }[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<'iPhone X' | 'MacBook Pro' | 'iPad Mini'>('MacBook Pro');
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        // Update isMobile based on selected device
        setIsMobile(selectedDevice === 'iPhone X');

        // Default to landscape for iPad Mini, portrait for others
        if (selectedDevice === 'iPad Mini') {
            setIsLandscape(true);
        } else {
            setIsLandscape(false);
        }
    }, [selectedDevice]);

    useEffect(() => {
        // Update isMobile based on selected device
        setIsMobile(selectedDevice === 'iPhone X');
    }, [selectedDevice]);

    const executeSubmissionActions = async (formData: any) => {
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

                    if (response.ok) {
                        executed.push(action);
                    } else {
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

    const onSubmit = async (data: any) => {
        console.log('Form Data:', data);
        setSubmitStatus('submitting');

        try {
            await executeSubmissionActions(data);
            setSubmitStatus('success');
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        }
    };

    const renderFormContent = () => {
        if (submitStatus === 'success') {
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

        return (
            <div 
                className={clsx(
                    "rounded-xl shadow-sm border border-gray-200 p-8",
                    selectedDevice === 'iPhone X' ? 'min-h-full' : ''
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
                    onSubmit={handleSubmit(onSubmit)}
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
                    <div className="flex flex-col gap-4 mb-6">
                        {elements.filter(el => el.type !== 'hidden').map((element) => {
                            // Calculate width percentage
                            const widthPercentage = (element.width || 12) / 12 * 100;

                        if (element.type === 'rich-text') {
                            return (
                                <div
                                    key={element.id}
                                    className="prose prose-gray max-w-none mb-6"
                                    style={{ width: `${widthPercentage}%` }}
                                    dangerouslySetInnerHTML={{ __html: element.content || '<p>Your rich text content here</p>' }}
                                />
                            );
                        }

                        if (element.type === 'container') {
                            return (
                                <div key={element.id} className="p-6 border border-gray-200 rounded-xl bg-gray-50/50 mb-6" style={{ width: `${widthPercentage}%` }}>
                                    {element.label && element.label.trim() && !element.label.toLowerCase().includes('container') && (
                                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-4">
                                            {element.label}
                                        </h3>
                                    )}
                                    {element.children && element.children.length > 0 && (
                                        <div className="space-y-4">
                                            {element.children.map((childElement) => {
                                                return (
                                                    <div key={childElement.id}>
                                                        {childElement.label && childElement.label.trim() && childElement.type !== 'rich-text' && (
                                                            <label className={clsx(
                                                                "block text-gray-700 mb-1",
                                                                childElement.labelSize === 'xs' && "text-xs",
                                                                childElement.labelSize === 'sm' && "text-sm",
                                                                childElement.labelSize === 'base' && "text-base",
                                                                childElement.labelSize === 'lg' && "text-lg",
                                                                !childElement.labelSize && "text-sm",
                                                                // Legacy labelWeight support (only if no new formatting is used)
                                                                !childElement.labelBold && childElement.labelWeight === 'normal' && "font-normal",
                                                                !childElement.labelBold && childElement.labelWeight === 'medium' && "font-medium",
                                                                !childElement.labelBold && childElement.labelWeight === 'semibold' && "font-semibold",
                                                                !childElement.labelBold && childElement.labelWeight === 'bold' && "font-bold",
                                                                !childElement.labelBold && !childElement.labelWeight && "font-medium", 
                                                                // New formatting system takes priority
                                                                childElement.labelBold && "font-bold",
                                                                childElement.labelItalic && "italic",
                                                                childElement.labelUnderline && "underline",
                                                                childElement.labelStrikethrough && "line-through"
                                                            )}>
                                                                {childElement.label}
                                                                {childElement.required && <span className="text-red-500 ml-1">*</span>}
                                                            </label>
                                                        )}

                                                        {childElement.type === 'textarea' ? (
                                                            <textarea
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                placeholder={childElement.placeholder}
                                                                className={getInputClasses(settings)}
                                                                rows={4}
                                                            />
                                                        ) : childElement.type === 'select' ? (
                                                            <select
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                className={getInputClasses(settings)}
                                                            >
                                                                <option value="">Select an option</option>
                                                                {childElement.options?.map((opt, idx) => (
                                                                    <option key={idx} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        ) : childElement.type === 'checkbox' ? (
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    {...register(childElement.id, { required: childElement.required })}
                                                                    className={getCheckboxClasses(settings)} style={getCheckboxStyle(settings)}
                                                                />
                                                                <span className="text-sm text-gray-600">
                                                                    {childElement.placeholder || 'Checkbox option'}
                                                                </span>
                                                            </div>
                                                        ) : childElement.type === 'radio' ? (
                                                            <div className="space-y-3">
                                                                {(childElement.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3">
                                                                        <input
                                                                            type="radio"
                                                                            {...register(childElement.id, { required: childElement.required })}
                                                                            value={opt.value}
                                                                            className={getRadioClasses(settings)} style={getCheckboxStyle(settings)}
                                                                        />
                                                                        <span className="text-sm text-gray-600">{opt.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : childElement.type === 'rich-text' ? (
                                                            <div
                                                                className="prose prose-gray max-w-none p-3 border border-gray-300 rounded-lg bg-gray-50"
                                                                dangerouslySetInnerHTML={{ __html: childElement.content || '<p>Your rich text content here</p>' }}
                                                            />
                                                        ) : (
                                                            <input
                                                                type={childElement.type}
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                placeholder={childElement.placeholder}
                                                                className={getInputClasses(settings)}
                                                            />
                                                        )}

                                                        {errors[childElement.id] && (
                                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                                <AlertCircle size={12} />
                                                                This field is required
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (element.type === 'columns') {
                            return (
                                <div key={element.id} className="mb-6" style={{ width: `${widthPercentage}%` }}>
                                    {element.label && element.label.trim() && !element.label.toLowerCase().includes('columns') && (
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            {element.label}
                                        </h3>
                                    )}
                                    {element.children && element.children.length > 0 && (
                                        <div className="grid gap-4"
                                            style={{
                                                gridTemplateColumns: isMobile ? '1fr' : `repeat(${element.columnCount || 2}, 1fr)`
                                            }}
                                        >
                                            {element.children.map((childElement) => {
                                                return (
                                                    <div key={childElement.id}>
                                                        {childElement.label && childElement.label.trim() && childElement.type !== 'rich-text' && (
                                                            <label className={clsx(
                                                                "block text-gray-700 mb-1",
                                                                childElement.labelSize === 'xs' && "text-xs",
                                                                childElement.labelSize === 'sm' && "text-sm",
                                                                childElement.labelSize === 'base' && "text-base",
                                                                childElement.labelSize === 'lg' && "text-lg",
                                                                !childElement.labelSize && "text-sm",
                                                                // Legacy labelWeight support (only if no new formatting is used)
                                                                !childElement.labelBold && childElement.labelWeight === 'normal' && "font-normal",
                                                                !childElement.labelBold && childElement.labelWeight === 'medium' && "font-medium",
                                                                !childElement.labelBold && childElement.labelWeight === 'semibold' && "font-semibold",
                                                                !childElement.labelBold && childElement.labelWeight === 'bold' && "font-bold",
                                                                !childElement.labelBold && !childElement.labelWeight && "font-medium", 
                                                                // New formatting system takes priority
                                                                childElement.labelBold && "font-bold",
                                                                childElement.labelItalic && "italic",
                                                                childElement.labelUnderline && "underline",
                                                                childElement.labelStrikethrough && "line-through"
                                                            )}>
                                                                {childElement.label}
                                                                {childElement.required && <span className="text-red-500 ml-1">*</span>}
                                                            </label>
                                                        )}

                                                        {childElement.type === 'textarea' ? (
                                                            <textarea
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                placeholder={childElement.placeholder}
                                                                className={getInputClasses(settings)}
                                                                rows={4}
                                                            />
                                                        ) : childElement.type === 'select' ? (
                                                            <select
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                className={getInputClasses(settings)}
                                                            >
                                                                <option value="">Select an option</option>
                                                                {childElement.options?.map((opt, idx) => (
                                                                    <option key={idx} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        ) : childElement.type === 'checkbox' ? (
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    {...register(childElement.id, { required: childElement.required })}
                                                                    className={getCheckboxClasses(settings)} style={getCheckboxStyle(settings)}
                                                                />
                                                                <span className="text-sm text-gray-600">
                                                                    {childElement.placeholder || 'Checkbox option'}
                                                                </span>
                                                            </div>
                                                        ) : childElement.type === 'radio' ? (
                                                            <div className="space-y-3">
                                                                {(childElement.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3">
                                                                        <input
                                                                            type="radio"
                                                                            {...register(childElement.id, { required: childElement.required })}
                                                                            value={opt.value}
                                                                            className={getRadioClasses(settings)} style={getCheckboxStyle(settings)}
                                                                        />
                                                                        <span className="text-sm text-gray-600">{opt.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : childElement.type === 'star-rating' ? (
                                                            <div className="flex gap-1 items-center">
                                                                {[...Array(childElement.maxStars || 5)].map((_, i) => (
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
                                                        ) : childElement.type === 'rich-text' ? (
                                                            <div
                                                                className="prose prose-gray max-w-none p-3 border border-gray-300 rounded-lg bg-gray-50"
                                                                dangerouslySetInnerHTML={{ __html: childElement.content || '<p>Your rich text content here</p>' }}
                                                            />
                                                        ) : (
                                                            <input
                                                                type={childElement.type}
                                                                {...register(childElement.id, { required: childElement.required })}
                                                                placeholder={childElement.placeholder}
                                                                className={getInputClasses(settings)}
                                                            />
                                                        )}

                                                        {errors[childElement.id] && (
                                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                                <AlertCircle size={12} />
                                                                This field is required
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Regular form elements (text, email, number, etc.)
                        return (
                            <div key={element.id} className="mb-6" style={{ width: `${widthPercentage}%` }}>
                                {element.label && element.label.trim() && (
                                    <label className={clsx(
                                        "block text-gray-700 mb-1",
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
                                        {element.options?.map((opt, idx) => (
                                            <option key={idx} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : element.type === 'checkbox' ? (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            {...register(element.id, { required: element.required })}
                                            className={getCheckboxClasses(settings)} style={getCheckboxStyle(settings)}
                                        />
                                        <span className="text-sm text-gray-600">
                                            {element.placeholder || 'Checkbox option'}
                                        </span>
                                    </div>
                                ) : element.type === 'radio' ? (
                                    <div className="space-y-3">
                                        {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    {...register(element.id, { required: element.required })}
                                                    value={opt.value}
                                                    className={getRadioClasses(settings)} style={getCheckboxStyle(settings)}
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
                        );
                    })}
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitStatus === 'submitting'}
                            className={getButtonClasses(settings)}
                            style={getButtonStyle(settings)}
                        >
                            {submitStatus === 'submitting' ? 'Processing...' : settings.submitButtonText}
                        </button>
                    </div>
                </form>
            </div>
        );
    };



    return (
        <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
            {/* Device Selector Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setSelectedDevice('iPhone X')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'iPhone X'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Mobile"
                        >
                            <Smartphone size={18} />
                            <span className="text-xs font-medium">Mobile</span>
                        </button>
                        <button
                            onClick={() => setSelectedDevice('iPad Mini')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'iPad Mini'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Tablet"
                        >
                            <Tablet size={18} />
                            <span className="text-xs font-medium">Tablet</span>
                        </button>
                        <button
                            onClick={() => setSelectedDevice('MacBook Pro')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'MacBook Pro'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Desktop"
                        >
                            <Laptop size={18} />
                            <span className="text-xs font-medium">Desktop</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLandscape(!isLandscape)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            isLandscape
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-slate-600 hover:bg-slate-100 border border-transparent"
                        )}
                        title="Rotate Device"
                    >
                        <RotateCw size={16} />
                        <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
                    </button>
                </div>
            </div>

            {/* Device Preview Area */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-slate-100/50">
                <div className={clsx(
                    "transition-all duration-500 ease-in-out origin-top",
                    selectedDevice === 'MacBook Pro' ? "scale-[0.65] 2xl:scale-[0.8]" :
                        selectedDevice === 'iPad Mini' ? "scale-[0.85]" : "scale-100"
                )}>
                    <DeviceFrameset device={selectedDevice} color="black" landscape={isLandscape}>
                        <div className="w-full h-full bg-slate-50 overflow-y-auto custom-scrollbar">
                            <div className={clsx(
                                "min-h-full",
                                selectedDevice === 'MacBook Pro' ? "p-8" : "p-4"
                            )}>
                                {renderFormContent()}
                            </div>
                        </div>
                    </DeviceFrameset>
                </div>
            </div>
        </div>
    );
};
