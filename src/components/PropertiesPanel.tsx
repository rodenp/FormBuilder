import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash, Settings, Sliders, ExternalLink, Webhook, MessageCircle, Globe, X, Bold, Italic, Strikethrough, Underline, Code, Link, FileX, Image, Eye, Copy, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, ChevronUp, Type, Minus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';
import type { SubmissionAction, WebhookAction, FormElement, GalleryImage } from '../types';
import { LayoutPanel } from './LayoutPanel';
import { ImagePicker } from './ImagePicker';


export const PropertiesPanel: React.FC = () => {
    const {
        selectedElementId,
        elements,
        updateElement,
        settings,
        updateSettings,
        currentProject
    } = useStore();

    const [showActionSelector, setShowActionSelector] = useState(false);
    const [activeFormTab, setActiveFormTab] = useState<'settings' | 'actions' | 'code'>('settings');
    const [codeType, setCodeType] = useState<'html' | 'react' | 'json'>('html');
    const [copiedCode, setCopiedCode] = useState(false);
    const [textPropsOpen, setTextPropsOpen] = useState(false);

    const hasUserAction = settings.submissionActions.some(action => action.type === 'redirect' || action.type === 'message');
    const hasFormAction = !!settings.formAction;
    const isFormProject = currentProject?.type === 'form';

    const generateFormCode = () => {
        if (codeType === 'html') {
            return generateHTMLCode();
        } else if (codeType === 'react') {
            return generateReactCode();
        } else {
            return generateJSONCode();
        }
    };


    const generateHTMLCode = () => {
        const formStyle = `
            ${settings.primaryColor ? `--primary-color: ${settings.primaryColor};` : ''}
            ${settings.formBackground ? `background-color: ${settings.formBackground};` : ''}
        `.trim();

        const renderElement = (element: FormElement, indent = '    '): string => {
            const labelClasses = [
                'form-label',
                element.labelSize === 'xs' ? 'text-xs' : element.labelSize === 'sm' ? 'text-sm' : 
                element.labelSize === 'lg' ? 'text-lg' : 'text-base',
                element.labelBold ? 'font-bold' : '',
                element.labelItalic ? 'font-italic' : '',
                element.labelUnderline ? 'text-underline' : '',
                element.labelStrikethrough ? 'text-line-through' : ''
            ].filter(Boolean).join(' ');

            switch (element.type) {
                case 'text':
                case 'email':
                case 'number':
                    return `${indent}<div class="form-field">
${indent}  <label for="${element.name}" class="${labelClasses}">${element.label}${element.required ? ' *' : ''}</label>
${indent}  <input type="${element.type}" id="${element.name}" name="${element.name}" ${element.placeholder ? `placeholder="${element.placeholder}"` : ''} ${element.required ? 'required' : ''} class="form-input">
${indent}</div>`;
                case 'textarea':
                    return `${indent}<div class="form-field">
${indent}  <label for="${element.name}" class="${labelClasses}">${element.label}${element.required ? ' *' : ''}</label>
${indent}  <textarea id="${element.name}" name="${element.name}" ${element.placeholder ? `placeholder="${element.placeholder}"` : ''} ${element.required ? 'required' : ''} rows="4" class="form-input"></textarea>
${indent}</div>`;
                case 'select':
                    return `${indent}<div class="form-field">
${indent}  <label for="${element.name}" class="${labelClasses}">${element.label}${element.required ? ' *' : ''}</label>
${indent}  <select id="${element.name}" name="${element.name}" ${element.required ? 'required' : ''} class="form-input">
${indent}    <option value="">Select an option</option>
${element.options?.map(opt => `${indent}    <option value="${opt.value}">${opt.label}</option>`).join('\n') || ''}
${indent}  </select>
${indent}</div>`;
                case 'checkbox':
                    return `${indent}<div class="form-field">
${indent}  <label class="form-checkbox">
${indent}    <input type="checkbox" name="${element.name}" value="true" ${element.required ? 'required' : ''}>
${indent}    <span class="${labelClasses}">${element.label}${element.required ? ' *' : ''}</span>
${indent}  </label>
${indent}</div>`;
                case 'radio':
                    return `${indent}<div class="form-field">
${indent}  <fieldset>
${indent}    <legend class="${labelClasses}">${element.label}${element.required ? ' *' : ''}</legend>
${element.options?.map(opt => `${indent}    <label class="form-radio">
${indent}      <input type="radio" name="${element.name}" value="${opt.value}" ${element.required ? 'required' : ''}>
${indent}      <span>${opt.label}</span>
${indent}    </label>`).join('\n') || ''}
${indent}  </fieldset>
${indent}</div>`;
                default:
                    return '';
            }
        };

        const formElements = elements.map(element => renderElement(element)).join('\n');
        
        return `<!DOCTYPE html>
<html>
<head>
    <title>${settings.title}</title>
    <style>
        .form-container { max-width: 600px; margin: 0 auto; padding: 20px; ${formStyle} }
        .form-title { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .form-description { color: #666; margin-bottom: 2rem; }
        .form-field { margin-bottom: 1.5rem; }
        .form-label { display: block; font-weight: 500; margin-bottom: 0.25rem; }
        .form-input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
        .form-submit { width: 100%; padding: 0.75rem 1.5rem; background-color: var(--primary-color, #3b82f6); color: white; border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer; }
        .form-checkbox, .form-radio { display: flex; align-items-center; gap: 0.5rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .font-bold { font-weight: bold; }
        .font-italic { font-style: italic; }
        .text-underline { text-decoration: underline; }
        .text-line-through { text-decoration: line-through; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1 class="form-title">${settings.title}</h1>
        ${settings.description ? `<p class="form-description">${settings.description}</p>` : ''}
        <form action="${settings.formAction || settings.submissionActions.find(a => a.type === 'webhook')?.webhook?.url || '/submit'}" method="${settings.formMethod || 'POST'}"${settings.formTarget ? ` target="${settings.formTarget}"` : ''}>
${formElements}
            <button type="submit" class="form-submit">${settings.submitButtonText}</button>
        </form>
    </div>
</body>
</html>`;
    };

    const generateReactCode = () => {
        const renderElement = (element: FormElement, indent = '      '): string => {
            const labelClasses = [
                element.labelSize === 'xs' ? 'text-xs' : element.labelSize === 'sm' ? 'text-sm' : 
                element.labelSize === 'lg' ? 'text-lg' : 'text-base',
                element.labelBold ? 'font-bold' : '',
                element.labelItalic ? 'italic' : '',
                element.labelUnderline ? 'underline' : '',
                element.labelStrikethrough ? 'line-through' : ''
            ].filter(Boolean);

            switch (element.type) {
                case 'text':
                case 'email':
                case 'number':
                    return `${indent}<div className="mb-6">
${indent}  <label htmlFor="${element.name}" className="block ${labelClasses.join(' ')} text-gray-700 mb-1">
${indent}    ${element.label}${element.required ? ' *' : ''}
${indent}  </label>
${indent}  <input
${indent}    type="${element.type}"
${indent}    id="${element.name}"
${indent}    name="${element.name}"
${indent}    ${element.placeholder ? `placeholder="${element.placeholder}"` : ''}
${indent}    ${element.required ? 'required' : ''}
${indent}    className="w-full p-3 border border-gray-300 rounded-lg"
${indent}  />
${indent}</div>`;
                case 'textarea':
                    return `${indent}<div className="mb-6">
${indent}  <label htmlFor="${element.name}" className="block ${labelClasses.join(' ')} text-gray-700 mb-1">
${indent}    ${element.label}${element.required ? ' *' : ''}
${indent}  </label>
${indent}  <textarea
${indent}    id="${element.name}"
${indent}    name="${element.name}"
${indent}    ${element.placeholder ? `placeholder="${element.placeholder}"` : ''}
${indent}    ${element.required ? 'required' : ''}
${indent}    rows={4}
${indent}    className="w-full p-3 border border-gray-300 rounded-lg"
${indent}  />
${indent}</div>`;
                case 'select':
                    return `${indent}<div className="mb-6">
${indent}  <label htmlFor="${element.name}" className="block ${labelClasses.join(' ')} text-gray-700 mb-1">
${indent}    ${element.label}${element.required ? ' *' : ''}
${indent}  </label>
${indent}  <select
${indent}    id="${element.name}"
${indent}    name="${element.name}"
${indent}    ${element.required ? 'required' : ''}
${indent}    className="w-full p-3 border border-gray-300 rounded-lg"
${indent}  >
${indent}    <option value="">Select an option</option>
${element.options?.map(opt => `${indent}    <option value="${opt.value}">${opt.label}</option>`).join('\n') || ''}
${indent}  </select>
${indent}</div>`;
                case 'checkbox':
                    return `${indent}<div className="mb-6">
${indent}  <label className="flex items-center gap-3">
${indent}    <input type="checkbox" name="${element.name}" ${element.required ? 'required' : ''} />
${indent}    <span className="${labelClasses.join(' ')} text-gray-700">${element.label}${element.required ? ' *' : ''}</span>
${indent}  </label>
${indent}</div>`;
                case 'radio':
                    return `${indent}<div className="mb-6">
${indent}  <fieldset>
${indent}    <legend className="${labelClasses.join(' ')} text-gray-700 mb-3">${element.label}${element.required ? ' *' : ''}</legend>
${element.options?.map(opt => `${indent}    <label className="flex items-center gap-3 mb-2">
${indent}      <input type="radio" name="${element.name}" value="${opt.value}" ${element.required ? 'required' : ''} />
${indent}      <span className="text-gray-600">${opt.label}</span>
${indent}    </label>`).join('\n') || ''}
${indent}  </fieldset>
${indent}</div>`;
                default:
                    return '';
            }
        };

        const formElements = elements.map(element => renderElement(element)).join('\n');

        return `import React from 'react';

const MyForm = () => {
  const handleSubmit = async (e) => {
    ${settings.formAction ? `
    // Form has custom action - let it submit normally
    // Remove e.preventDefault() to allow normal form submission
    console.log('Form submitting to:', '${settings.formAction}');` : `
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Handle form submission
    console.log('Form data:', data);
    ${settings.submissionActions.find(a => a.type === 'webhook') ? `
    // Send to webhook
    try {
      const response = await fetch('${settings.submissionActions.find(a => a.type === 'webhook')?.webhook?.url}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Webhook response:', response);
    } catch (error) {
      console.error('Webhook error:', error);
    }` : ''}`}
  };

  return (
    <div className="max-w-2xl mx-auto p-8" ${settings.formBackground ? `style={{ backgroundColor: '${settings.formBackground}' }}` : ''}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">${settings.title}</h1>
        ${settings.description ? `<p className="text-gray-600">${settings.description}</p>` : ''}
      </div>
      
      <form onSubmit={handleSubmit}${settings.formAction ? ' action="' + settings.formAction.split(' ')[0] + '" ' + settings.formAction.split(' ').slice(1).join(' ') : ''}${settings.formMethod ? ' method="' + settings.formMethod + '"' : (settings.formAction ? ' method="POST"' : '')}${settings.formTarget ? ' target="' + settings.formTarget + '"' : ''}>
${formElements}
        <button
          type="submit"
          className="w-full py-3 px-6 font-medium text-white rounded-lg transition-all"
          style={{ backgroundColor: '${settings.primaryColor || '#3b82f6'}' }}
        >
          ${settings.submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default MyForm;`;
    };

    const generateJSONCode = () => {
        const formSchema = {
            id: 'form-' + Date.now(),
            settings: settings,
            elements: elements
        };
        return JSON.stringify(formSchema, null, 2);
    };

    const copyToClipboard = () => {
        const code = generateFormCode();
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const actionTypes = [
        {
            type: 'webhook',
            label: 'Webhook',
            description: 'Send data to external API',
            icon: <Webhook size={24} />,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            hoverBg: 'hover:bg-green-100',
            disabled: false
        },
        {
            type: 'redirect',
            label: 'Redirect',
            description: 'Redirect to another page',
            icon: <ExternalLink size={24} />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverBg: 'hover:bg-blue-100',
            disabled: hasFormAction || hasUserAction
        },
        {
            type: 'message',
            label: 'Message',
            description: 'Show custom message',
            icon: <MessageCircle size={24} />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            hoverBg: 'hover:bg-purple-100',
            disabled: hasFormAction || hasUserAction
        }
    ];

    const addSubmissionAction = (type: string) => {
        const newAction: SubmissionAction = {
            id: uuidv4(),
            type: type as any,
            enabled: true,
            ...(type === 'redirect' && { redirectUrl: 'https://example.com/success', openInNewTab: false }),
            ...(type === 'webhook' && { webhook: { id: uuidv4(), url: 'https://api.example.com/webhook', method: 'POST', enabled: true } }),
            ...(type === 'message' && { message: 'Thank you for your submission!', messageType: 'success' })
        };
        updateSettings({ submissionActions: [...settings.submissionActions, newAction] });
        setShowActionSelector(false);
    };

    // Helper function to find element recursively (including nested elements)
    const findElementById = (elements: FormElement[], id: string): FormElement | undefined => {
        for (const element of elements) {
            if (!element) continue; // Skip undefined/null elements
            if (element.id === id) {
                return element;
            }
            if (element.children) {
                const found = findElementById(element.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const selectedElement = selectedElementId ? findElementById(elements, selectedElementId) : undefined;

    if (!selectedElement) {
        return (
            <div className="form-builder-properties">
                <div className="properties-header">
                    <div style={{padding: 'var(--spacing-2)', backgroundColor: 'var(--color-slate-50)', color: 'var(--color-slate-500)', borderRadius: 'var(--radius-lg)'}}>
                        <Settings size={18} />
                    </div>
                    <div>
                        <h2 className="properties-header-title">Form Settings</h2>
                        <p style={{fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0}}>Global configuration</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        onClick={() => setActiveFormTab('settings')}
                        className={clsx("tab", activeFormTab === 'settings' && "active")}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveFormTab('actions')}
                        className={clsx("tab", activeFormTab === 'actions' && "active")}
                        >
                            Actions
                        </button>
                        <button
                        onClick={() => setActiveFormTab('code')}
                        className={clsx("tab", activeFormTab === 'code' && "active")}
                    >
                        Code
                    </button>
                </div>

                <div style={{padding: '24px 32px', gap: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
                    {activeFormTab === 'settings' && (
                        <>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Form Title
                        </label>
                        <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => updateSettings({ title: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            value={settings.description || ''}
                            onChange={(e) => updateSettings({ description: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Submit Button Text
                        </label>
                        <input
                            type="text"
                            value={settings.submitButtonText}
                            onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                        </>
                    )}


                    {activeFormTab === 'actions' && (
                        <div className="space-y-6">
                            {/* Form Action Configuration */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Form Action
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-2">
                                            Action URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.formAction || ''}
                                            onChange={(e) => updateSettings({ formAction: e.target.value })}
                                            placeholder="https://your-domain.com/submit"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Submit form directly to your server endpoint</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-2">
                                                Method
                                            </label>
                                            <select
                                                value={settings.formMethod || 'POST'}
                                                onChange={(e) => updateSettings({ formMethod: e.target.value as any })}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            >
                                                <option value="POST">POST</option>
                                                <option value="GET">GET</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-2">
                                                Target
                                            </label>
                                            <select
                                                value={settings.formTarget || '_self'}
                                                onChange={(e) => updateSettings({ formTarget: e.target.value })}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            >
                                                <option value="_self">Same Window</option>
                                                <option value="_blank">New Tab</option>
                                                <option value="_parent">Parent Frame</option>
                                                <option value="_top">Top Frame</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {settings.formAction && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-xs text-blue-700">
                                                <strong>Note:</strong> When form action is set, only webhook submission actions are available. 
                                                Form data will be submitted directly to your endpoint.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                    Additional Submission Actions
                                </label>
                            </div>

                        <div className="space-y-3">
                            {settings.submissionActions.map((action, index) => (
                                <div key={action.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "p-2 rounded-lg",
                                                action.type === 'redirect' && "bg-blue-50 text-blue-500",
                                                action.type === 'webhook' && "bg-green-50 text-green-500",
                                                action.type === 'message' && "bg-purple-50 text-purple-500"
                                            )}>
                                                {action.type === 'redirect' && <ExternalLink size={16} />}
                                                {action.type === 'webhook' && <Webhook size={16} />}
                                                {action.type === 'message' && <MessageCircle size={16} />}
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-slate-700 capitalize">{action.type}</span>
                                                {action.type === 'webhook' && action.webhook && (
                                                    <p 
                                                        className="text-xs text-slate-400 font-mono truncate max-w-[140px] cursor-help"
                                                        title={action.webhook.url}
                                                    >
                                                        {action.webhook.url}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                                <input
                                                    type="checkbox"
                                                    checked={action.enabled}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { ...action, enabled: e.target.checked };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-500 right-5 border-slate-300"
                                                />
                                                <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${action.enabled ? 'bg-brand-500' : 'bg-slate-300'}`}></label>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newActions = settings.submissionActions.filter((_, i) => i !== index);
                                                    updateSettings({ submissionActions: newActions });
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {action.type === 'redirect' && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    Redirect URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={action.redirectUrl || ''}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { ...action, redirectUrl: e.target.value };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    placeholder="https://example.com/success"
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <label className="text-sm font-medium text-slate-700">
                                                    Open in new tab
                                                </label>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input
                                                        type="checkbox"
                                                        checked={action.openInNewTab || false}
                                                        onChange={(e) => {
                                                            const newActions = [...settings.submissionActions];
                                                            newActions[index] = { ...action, openInNewTab: e.target.checked };
                                                            updateSettings({ submissionActions: newActions });
                                                        }}
                                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-500 right-5 border-slate-300"
                                                    />
                                                    <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${action.openInNewTab ? 'bg-brand-500' : 'bg-slate-300'}`}></label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {action.type === 'webhook' && action.webhook && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    Method
                                                </label>
                                                <select
                                                    value={action.webhook.method}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { 
                                                            ...action, 
                                                            webhook: { ...action.webhook!, method: e.target.value as any }
                                                        };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                                >
                                                    <option value="POST">POST</option>
                                                    <option value="PUT">PUT</option>
                                                    <option value="PATCH">PATCH</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    Webhook URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={action.webhook.url}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { 
                                                            ...action, 
                                                            webhook: { ...action.webhook!, url: e.target.value }
                                                        };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    placeholder="https://api.example.com/webhook"
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {action.type === 'message' && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    Message Type
                                                </label>
                                                <select
                                                    value={action.messageType || 'success'}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { ...action, messageType: e.target.value as any };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                                >
                                                    <option value="success">Success</option>
                                                    <option value="info">Info</option>
                                                    <option value="warning">Warning</option>
                                                    <option value="error">Error</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    Message Content
                                                </label>
                                                <textarea
                                                    value={action.message || ''}
                                                    onChange={(e) => {
                                                        const newActions = [...settings.submissionActions];
                                                        newActions[index] = { ...action, message: e.target.value };
                                                        updateSettings({ submissionActions: newActions });
                                                    }}
                                                    placeholder="Thank you for your submission!"
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Action Button */}
                        <div className="mt-4">
                            {!showActionSelector ? (
                                <button
                                    onClick={() => setShowActionSelector(true)}
                                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
                                >
                                    <Plus size={20} />
                                    <span className="font-medium">Add Submission Action</span>
                                </button>
                            ) : (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-semibold text-slate-700">Choose Action Type</h4>
                                        <button
                                            onClick={() => setShowActionSelector(false)}
                                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {actionTypes.map((actionType) => (
                                            <button
                                                key={actionType.type}
                                                onClick={() => {
                                                    if (!actionType.disabled) {
                                                        addSubmissionAction(actionType.type);
                                                        setShowActionSelector(false);
                                                    }
                                                }}
                                                disabled={actionType.disabled}
                                                className={clsx(
                                                    "flex flex-col items-center gap-1 p-1.5 border rounded transition-all text-center",
                                                    actionType.disabled 
                                                        ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100"
                                                        : `${actionType.borderColor} ${actionType.bgColor} ${actionType.hoverBg} hover:shadow-sm`
                                                )}
                                            >
                                                <div className={`p-1 rounded ${actionType.bgColor} ${actionType.color}`}>
                                                    <div className="w-3 h-3 flex items-center justify-center">
                                                        {React.cloneElement(actionType.icon, { size: 12 })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-slate-700" style={{ fontSize: '10px' }}>{actionType.label}</h5>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {settings.submissionActions.length === 0 && !showActionSelector && (
                            <div className="text-center py-4 text-slate-400">
                                <Globe size={20} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No submission actions configured</p>
                            </div>
                        )}
                        </div>
                    )}

                    {activeFormTab === 'code' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye size={20} className="text-slate-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Form Code</h3>
                                    <p className="text-sm text-slate-600">Generated code for your form</p>
                                </div>
                            </div>

                            {/* Code Type Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Code Type
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCodeType('html')}
                                        className={clsx(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            codeType === 'html'
                                                ? "bg-brand-100 text-brand-700 border border-brand-300"
                                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        HTML
                                    </button>
                                    <button
                                        onClick={() => setCodeType('react')}
                                        className={clsx(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            codeType === 'react'
                                                ? "bg-brand-100 text-brand-700 border border-brand-300"
                                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        React
                                    </button>
                                    <button
                                        onClick={() => setCodeType('json')}
                                        className={clsx(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            codeType === 'json'
                                                ? "bg-brand-100 text-brand-700 border border-brand-300"
                                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        JSON
                                    </button>
                                </div>
                            </div>

                            {/* Code Preview */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Generated {codeType === 'html' ? 'HTML' : codeType === 'react' ? 'React' : 'JSON'} Code
                                    </label>
                                    <button
                                        onClick={copyToClipboard}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1 text-xs rounded-md transition-colors",
                                            copiedCode
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        )}
                                    >
                                        <Copy size={14} />
                                        {copiedCode ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed max-h-96 overflow-y-auto">
                                        <code>{generateFormCode()}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Usage Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2">Usage Instructions</h4>
                                <div className="text-xs text-blue-700 space-y-1">
                                    {codeType === 'html' ? (
                                        <>
                                            <p>• Copy the HTML code and save it as a .html file</p>
                                            <p>• The form includes embedded CSS styling</p>
                                            <p>• Update the form action URL to your server endpoint</p>
                                            <p>• Webhook URLs are automatically included if configured</p>
                                        </>
                                    ) : codeType === 'react' ? (
                                        <>
                                            <p>• Copy the React code into your component</p>
                                            <p>• Ensure you have Tailwind CSS configured</p>
                                            <p>• The handleSubmit function handles form data</p>
                                            <p>• Webhook integration is included if configured</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>• This JSON contains your complete form configuration</p>
                                            <p>• Use it to render forms dynamically in your app</p>
                                            <p>• Import and parse in your backend or frontend</p>
                                            <p>• Perfect for form builders and dynamic forms</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="form-builder-properties">
            <div className="properties-header">
                <div className="properties-header-icon">
                    <Sliders size={18} />
                </div>
                <div>
                    <h2 className="properties-header-title">Properties</h2>
                    <p style={{fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0}}>Edit {selectedElement.type} field</p>
                </div>
            </div>

            <div style={{padding: '24px 32px', gap: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
                {/* Define input types that need field name and placeholder */}
                {(() => {
                    const isInputType = !['container', 'columns', 'rich-text', 'text-block', 'star-rating', 'button'].includes(selectedElement.type);
                    const needsFieldName = isInputType && selectedElement.type !== 'hidden';
                    const needsPlaceholder = isInputType && !['hidden', 'checkbox', 'radio', 'star-rating', 'select', 'date', 'time', 'month', 'button'].includes(selectedElement.type);

                    return (
                        <>
                            {isFormProject && selectedElement.type !== 'hidden' && selectedElement.type !== 'rich-text' && selectedElement.type !== 'text-block' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Label
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.label}
                                        onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            )}

                            {isFormProject && needsFieldName && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Field Name (Data Key)
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.name}
                                        onChange={(e) => updateElement(selectedElement.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Unique key for this field in the submitted data.</p>
                                </div>
                            )}

                            {isFormProject && needsPlaceholder && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Placeholder
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.placeholder || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            )}
                        </>
                    );
                })()}


                {selectedElement.type === 'hidden' ? (
                    <>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Field Name (Data Key)
                            </label>
                            <input
                                type="text"
                                value={selectedElement.name}
                                onChange={(e) => updateElement(selectedElement.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                            />
                            <p className="text-xs text-slate-400 mt-1">Unique key for this field in the submitted data.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Hidden Value
                            </label>
                            <input
                                type="text"
                                value={selectedElement.value || ''}
                                onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                placeholder="Enter hidden value"
                            />
                            <p className="text-xs text-slate-400 mt-1">This value will be submitted with the form but not visible to users.</p>
                        </div>
                    </>
                ) : null}



                {/* Collapsible Text Properties for text components */}
                {(selectedElement.type === 'rich-text' || selectedElement.type === 'text-block' || selectedElement.type === 'heading') && (
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setTextPropsOpen(!textPropsOpen)}
                                className="flex items-center justify-between w-full p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Type size={16} className="text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">Text Styling</span>
                                </div>
                                {textPropsOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>
                            
                            {textPropsOpen && (
                                <div className="mt-3 space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
                                    {/* Font Family */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Font Family</label>
                                        <select
                                            value={selectedElement.fontFamily || ''}
                                            onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value || undefined })}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Arial, sans-serif">Arial</option>
                                            <option value="Helvetica, sans-serif">Helvetica</option>
                                            <option value="Georgia, serif">Georgia</option>
                                            <option value="Times New Roman, serif">Times New Roman</option>
                                            <option value="Courier New, monospace">Courier New</option>
                                            <option value="Verdana, sans-serif">Verdana</option>
                                            <option value="Impact, sans-serif">Impact</option>
                                        </select>
                                    </div>
                                    
                                    {/* Font Weight */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Font Weight</label>
                                        <select
                                            value={selectedElement.fontWeight || 'normal'}
                                            onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value as any })}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        >
                                            <option value="normal">Regular</option>
                                            <option value="medium">Medium</option>
                                            <option value="semibold">Semi Bold</option>
                                            <option value="bold">Bold</option>
                                        </select>
                                    </div>
                                    
                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Font Size</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="8"
                                                max="96"
                                                value={selectedElement.fontSize || 16}
                                                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <span className="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5">px</span>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { fontSize: Math.max(8, (selectedElement.fontSize || 16) - 1) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { fontSize: Math.min(96, (selectedElement.fontSize || 16) + 1) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Color */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={selectedElement.textColor || '#000000'}
                                                onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })}
                                                className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={selectedElement.textColor || '#000000'}
                                                onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })}
                                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                                placeholder="#000000"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { textColor: undefined })}
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Reset color"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Text Alignment */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Text Align</label>
                                        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                                                className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                                    (selectedElement.textAlign ?? 'left') === 'left'
                                                        ? 'bg-gray-800 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <AlignLeft size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                                                className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                                    selectedElement.textAlign === 'center'
                                                        ? 'bg-gray-800 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <AlignCenter size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                                                className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                                    selectedElement.textAlign === 'right'
                                                        ? 'bg-gray-800 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <AlignRight size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { textAlign: 'justify' })}
                                                className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                                    selectedElement.textAlign === 'justify'
                                                        ? 'bg-gray-800 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <AlignJustify size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Line Height */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Line Height</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="80"
                                                max="200"
                                                step="10"
                                                value={selectedElement.lineHeight || 140}
                                                onChange={(e) => updateElement(selectedElement.id, { lineHeight: parseInt(e.target.value) || 140 })}
                                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <span className="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5">%</span>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { lineHeight: Math.max(80, (selectedElement.lineHeight || 140) - 10) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { lineHeight: Math.min(200, (selectedElement.lineHeight || 140) + 10) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Letter Spacing */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Letter Spacing</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="-5"
                                                max="10"
                                                step="0.5"
                                                value={selectedElement.letterSpacing || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <span className="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5">px</span>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { letterSpacing: Math.max(-5, (selectedElement.letterSpacing || 0) - 0.5) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateElement(selectedElement.id, { letterSpacing: Math.min(10, (selectedElement.letterSpacing || 0) + 0.5) })}
                                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                )}

                {isFormProject && selectedElement.type !== 'hidden' && selectedElement.type !== 'rich-text' && selectedElement.type !== 'text-block' && (
                    <>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Label Size
                            </label>
                            <select
                                value={selectedElement.labelSize || 'sm'}
                                onChange={(e) => updateElement(selectedElement.id, { labelSize: e.target.value as any })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="xs">Extra Small</option>
                                <option value="sm">Small</option>
                                <option value="base">Normal</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Label Formatting
                            </label>
                            <div className="flex gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { labelBold: !selectedElement.labelBold })}
                                    className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                                        selectedElement.labelBold
                                            ? "bg-brand-100 text-brand-700 border border-brand-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    )}
                                    title="Bold"
                                >
                                    <Bold size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { labelItalic: !selectedElement.labelItalic })}
                                    className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                                        selectedElement.labelItalic
                                            ? "bg-brand-100 text-brand-700 border border-brand-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    )}
                                    title="Italic"
                                >
                                    <Italic size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { labelUnderline: !selectedElement.labelUnderline })}
                                    className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                                        selectedElement.labelUnderline
                                            ? "bg-brand-100 text-brand-700 border border-brand-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    )}
                                    title="Underline"
                                >
                                    <Underline size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { labelStrikethrough: !selectedElement.labelStrikethrough })}
                                    className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                                        selectedElement.labelStrikethrough
                                            ? "bg-brand-100 text-brand-700 border border-brand-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    )}
                                    title="Strikethrough"
                                >
                                    <Strikethrough size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Label to Content Gap
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="12"
                                value={selectedElement.labelGap ?? 3}
                                onChange={(e) => updateElement(selectedElement.id, { labelGap: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0 (No gap)</span>
                                <span className="font-medium">{selectedElement.labelGap ?? 3}</span>
                                <span>12 (Max gap)</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Background Color Control */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Background Color
                    </label>
                    <div className="flex gap-3 items-center">
                        <div 
                            className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                            style={{
                                backgroundColor: selectedElement.backgroundColor || '#ffffff'
                            }}
                            onClick={() => {
                                // Create a color input element and trigger click
                                const colorInput = document.createElement('input');
                                colorInput.type = 'color';
                                colorInput.value = selectedElement.backgroundColor || '#ffffff';
                                colorInput.onchange = (e) => {
                                    const target = e.target as HTMLInputElement;
                                    updateElement(selectedElement.id, { backgroundColor: target.value });
                                };
                                colorInput.click();
                            }}
                        >
                            {!selectedElement.backgroundColor && (
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                    <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2"/>
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={selectedElement.backgroundColor || '#ffffff'}
                                onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                                placeholder="#ffffff"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                            />
                        </div>
                        <button
                            onClick={() => updateElement(selectedElement.id, { backgroundColor: undefined })}
                            className="px-3 py-2 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reset to default"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                
                {/* Image Width and Alignment - positioned after background color */}
                {selectedElement.type === 'image' && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        {/* Width Percentage */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Width: <span className="font-semibold">{selectedElement.imageWidthPercent || 100}%</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={selectedElement.imageWidthPercent || 100}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidthPercent: parseInt(e.target.value) })}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={selectedElement.imageWidthPercent || 100}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidthPercent: parseInt(e.target.value) || 100 })}
                                    className="w-16 px-2 py-1 text-xs border border-slate-200 rounded"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>10%</span>
                                <span>100% (Full width)</span>
                            </div>
                        </div>

                        {/* Image Alignment */}
                        <div>
                            <h3 className="text-xs font-medium text-gray-600 mb-3">Align</h3>
                            <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'left' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                        (selectedElement.imageAlign ?? 'left') === 'left'
                                            ? 'bg-gray-800 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="Align Left"
                                >
                                    <AlignLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'center' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                        selectedElement.imageAlign === 'center'
                                            ? 'bg-gray-800 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="Align Center"
                                >
                                    <AlignCenter size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'right' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                        selectedElement.imageAlign === 'right'
                                            ? 'bg-gray-800 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="Align Right"
                                >
                                    <AlignRight size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'justify' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                        selectedElement.imageAlign === 'justify'
                                            ? 'bg-gray-800 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="Justify"
                                >
                                    <AlignJustify size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Layout Panel */}
                {!['hidden'].includes(selectedElement.type) && (
                    <LayoutPanel 
                        selectedElement={selectedElement} 
                        updateElement={updateElement} 
                    />
                )}
                
                {/* Spacing Controls - Option 6: Clean Visual Editor */}
                {false && !['hidden'].includes(selectedElement.type) && (() => {
                    // Calculate actual container constraints by measuring the real element
                    const getActualConstraints = () => {
                        const elementInCanvas = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
                        if (elementInCanvas) {
                            const rect = elementInCanvas.getBoundingClientRect();
                            // Allow much higher margin limits with minimum fallback
                            const maxMarginX = Math.max(48, Math.floor(rect.width / 8)); // More generous calculation
                            const maxMarginY = Math.max(32, Math.floor(rect.height / 8));
                            return {
                                maxMarginX: Math.max(0, maxMarginX),
                                maxMarginY: Math.max(0, maxMarginY),
                                elementWidth: rect.width,
                                elementHeight: rect.height
                            };
                        }
                        // Fallback to reasonable defaults with higher limits
                        return { maxMarginX: 48, maxMarginY: 32, elementWidth: 300, elementHeight: 80 };
                    };

                    const constraints = getActualConstraints();
                    
                    return (
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Spacing
                            </label>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 relative">
                                <div className="group relative w-full h-36">
                                {/* Margin Layer */}
                                <div 
                                    className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-dashed border-orange-400 rounded-lg opacity-90 transition-all duration-200 hover:opacity-100"
                                    style={{
                                        borderColor: '#f59e0b'
                                    }}
                                >
                                    {/* Margin Handles */}
                                    <div 
                                        className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-amber-100 border-2 border-orange-400 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-orange-500 hover:bg-amber-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startY = e.clientY;
                                            const startMargin = selectedElement.marginTop ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaY = e.clientY - startY;
                                                // Use actual element constraints
                                                const currentConstraints = getActualConstraints();
                                                const maxMarginTop = Math.floor(currentConstraints.maxMarginY / 2); // Half the height for margin
                                                const newMargin = Math.max(0, Math.min(maxMarginTop, startMargin + Math.round(deltaY / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { marginTop: newMargin });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust top margin"
                                    />
                                    
                                    <div 
                                        className="absolute right-[-7px] top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 bg-amber-100 border-2 border-orange-400 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-orange-500 hover:bg-amber-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startX = e.clientX;
                                            const startMargin = selectedElement.marginRight ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaX = startX - e.clientX;
                                                // Use actual element constraints
                                                const currentConstraints = getActualConstraints();
                                                const maxMarginRight = Math.floor(currentConstraints.maxMarginX / 2); // Half the width for margin
                                                const newMargin = Math.max(0, Math.min(maxMarginRight, startMargin + Math.round(deltaX / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { marginRight: newMargin });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust right margin"
                                    />
                                    
                                    <div 
                                        className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-amber-100 border-2 border-orange-400 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-orange-500 hover:bg-amber-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startY = e.clientY;
                                            const startMargin = selectedElement.marginBottom ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaY = startY - e.clientY;
                                                // Use actual element constraints
                                                const currentConstraints = getActualConstraints();
                                                const maxMarginBottom = Math.floor(currentConstraints.maxMarginY / 2); // Half the height for margin
                                                // Much more sensitive - allow fractional changes and round to integer
                                                const rawChange = deltaY / 2; // Very sensitive
                                                const newMargin = Math.max(0, Math.min(maxMarginBottom, Math.round(startMargin + rawChange)));
                                                updateElement(selectedElement.id, { marginBottom: newMargin });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust bottom margin"
                                    />
                                    
                                    <div 
                                        className="absolute left-[-7px] top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 bg-amber-100 border-2 border-orange-400 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-orange-500 hover:bg-amber-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startX = e.clientX;
                                            const startMargin = selectedElement.marginLeft ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaX = e.clientX - startX;
                                                // Use actual element constraints
                                                const currentConstraints = getActualConstraints();
                                                const maxMarginLeft = Math.floor(currentConstraints.maxMarginX / 2); // Half the width for margin
                                                const newMargin = Math.max(0, Math.min(maxMarginLeft, startMargin + Math.round(deltaX / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { marginLeft: newMargin });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust left margin"
                                    />
                                </div>
                                
                                {/* Padding Layer */}
                                <div 
                                    className="absolute bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-dashed border-blue-400 rounded-md opacity-90 transition-all duration-200 hover:opacity-100"
                                    style={{
                                        top: `${(selectedElement.marginTop ?? 0) * 2 + 20}px`,
                                        left: `${(selectedElement.marginLeft ?? 0) * 2 + 20}px`,
                                        right: `${(selectedElement.marginRight ?? 0) * 2 + 20}px`,
                                        bottom: `${(selectedElement.marginBottom ?? 0) * 2 + 20}px`,
                                        borderColor: '#3b82f6'
                                    }}
                                >
                                    {/* Padding Handles */}
                                    <div 
                                        className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-blue-100 border-2 border-blue-400 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-blue-500 hover:bg-blue-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startY = e.clientY;
                                            const startPadding = selectedElement.paddingTop ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaY = e.clientY - startY;
                                                // Use actual element constraints, padding should be more conservative
                                                const currentConstraints = getActualConstraints();
                                                const maxPaddingTop = Math.floor(currentConstraints.maxMarginY / 4); // Quarter the height for padding
                                                const newPadding = Math.max(0, Math.min(maxPaddingTop, startPadding + Math.round(deltaY / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { paddingTop: newPadding });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust top padding"
                                    />
                                    
                                    <div 
                                        className="absolute right-[-7px] top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 bg-blue-100 border-2 border-blue-400 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-blue-500 hover:bg-blue-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startX = e.clientX;
                                            const startPadding = selectedElement.paddingRight ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaX = startX - e.clientX;
                                                // Use actual element constraints, padding should be more conservative
                                                const currentConstraints = getActualConstraints();
                                                const maxPaddingRight = Math.floor(currentConstraints.maxMarginX / 4); // Quarter the width for padding
                                                const newPadding = Math.max(0, Math.min(maxPaddingRight, startPadding + Math.round(deltaX / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { paddingRight: newPadding });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust right padding"
                                    />
                                    
                                    <div 
                                        className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-blue-100 border-2 border-blue-400 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-blue-500 hover:bg-blue-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startY = e.clientY;
                                            const startPadding = selectedElement.paddingBottom ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaY = startY - e.clientY;
                                                // Use actual element constraints, padding should be more conservative
                                                const currentConstraints = getActualConstraints();
                                                const maxPaddingBottom = Math.floor(currentConstraints.maxMarginY / 4); // Quarter the height for padding
                                                // Much more sensitive - allow fractional changes and round to integer
                                                const rawChange = deltaY / 2; // Very sensitive
                                                const newPadding = Math.max(0, Math.min(maxPaddingBottom, Math.round(startPadding + rawChange)));
                                                updateElement(selectedElement.id, { paddingBottom: newPadding });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust bottom padding"
                                    />
                                    
                                    <div 
                                        className="absolute left-[-7px] top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 bg-blue-100 border-2 border-blue-400 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:border-blue-500 hover:bg-blue-200 hover:shadow-lg z-10"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startX = e.clientX;
                                            const startPadding = selectedElement.paddingLeft ?? 0;
                                            
                                            const handleMouseMove = (e: MouseEvent) => {
                                                const deltaX = e.clientX - startX;
                                                // Use actual element constraints, padding should be more conservative
                                                const currentConstraints = getActualConstraints();
                                                const maxPaddingLeft = Math.floor(currentConstraints.maxMarginX / 4); // Quarter the width for padding
                                                const newPadding = Math.max(0, Math.min(maxPaddingLeft, startPadding + Math.round(deltaX / 4))); // More sensitive dragging
                                                updateElement(selectedElement.id, { paddingLeft: newPadding });
                                            };
                                            
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };
                                            
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        title="Drag to adjust left padding"
                                    />
                                </div>
                                
                                {/* Content Layer */}
                                <div 
                                    className="absolute bg-white border-2 border-gray-300 rounded flex items-center justify-center shadow-sm"
                                    style={{
                                        top: `${(selectedElement.marginTop ?? 0) * 2 + (selectedElement.paddingTop ?? 0) * 2 + 36}px`,
                                        left: `${(selectedElement.marginLeft ?? 0) * 2 + (selectedElement.paddingLeft ?? 0) * 2 + 36}px`,
                                        right: `${(selectedElement.marginRight ?? 0) * 2 + (selectedElement.paddingRight ?? 0) * 2 + 36}px`,
                                        bottom: `${(selectedElement.marginBottom ?? 0) * 2 + (selectedElement.paddingBottom ?? 0) * 2 + 36}px`
                                    }}
                                >
                                    <div className="text-xs text-slate-500 font-medium select-none text-center px-2">
                                        Component
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-xs text-slate-400 text-center mt-3 italic">
                                Hover to reveal handles • Drag to adjust spacing
                            </div>

                            {/* Direct Input Controls for Precise Values */}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Precise Values
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="text-xs font-medium text-amber-600 mb-2">Margin</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Top</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.marginTop ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { marginTop: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Bottom</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.marginBottom ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { marginBottom: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Left</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.marginLeft ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { marginLeft: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Right</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.marginRight ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { marginRight: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs font-medium text-blue-600 mb-2">Padding</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Top</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.paddingTop ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { paddingTop: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Bottom</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.paddingBottom ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { paddingBottom: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Left</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.paddingLeft ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { paddingLeft: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500 w-8">Right</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={selectedElement.paddingRight ?? 0}
                                                    onChange={(e) => updateElement(selectedElement.id, { paddingRight: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-1 text-xs border border-slate-200 rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })()}

                {selectedElement.type === 'container' && (
                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Container Elements
                        </label>
                        {selectedElement.children && selectedElement.children.length > 0 ? (
                            <div className="space-y-2">
                                {selectedElement.children.map((child, index) => (
                                    <div key={child.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-700">{child.label}</span>
                                                <span className="text-xs text-slate-400 ml-2 font-mono">({child.type})</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newChildren = selectedElement.children?.filter((_, i) => i !== index);
                                                updateElement(selectedElement.id, { children: newChildren });
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            title="Remove from container"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Plus size={20} />
                                </div>
                                <p className="text-sm font-medium">Empty Container</p>
                                <p className="text-xs">Drag elements into this container</p>
                            </div>
                        )}
                    </div>
                )}

                {selectedElement.type === 'star-rating' && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Max Stars
                            </label>
                            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                                {selectedElement.maxStars || 5}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="10"
                            step="1"
                            value={selectedElement.maxStars || 5}
                            onChange={(e) => updateElement(selectedElement.id, { maxStars: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                    </div>
                )}

                {selectedElement.type === 'button' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Button Text
                            </label>
                            <input
                                type="text"
                                value={selectedElement.buttonText || ''}
                                onChange={(e) => updateElement(selectedElement.id, { buttonText: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                placeholder="Button text"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Button Type
                            </label>
                            <select
                                value={selectedElement.buttonType || 'button'}
                                onChange={(e) => updateElement(selectedElement.id, { buttonType: e.target.value as 'button' | 'submit' | 'reset' })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="button">Button</option>
                                <option value="submit">Submit</option>
                                <option value="reset">Reset</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Button Style
                            </label>
                            <select
                                value={selectedElement.buttonStyle || 'primary'}
                                onChange={(e) => updateElement(selectedElement.id, { buttonStyle: e.target.value as 'primary' | 'secondary' | 'outline' | 'text' })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="outline">Outline</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Button Size
                            </label>
                            <select
                                value={selectedElement.buttonSize || 'md'}
                                onChange={(e) => updateElement(selectedElement.id, { buttonSize: e.target.value as 'sm' | 'md' | 'lg' })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>
                        {selectedElement.buttonType === 'submit' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        value={selectedElement.buttonUrl || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonUrl: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Target
                                    </label>
                                    <select
                                        value={selectedElement.buttonTarget || '_self'}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonTarget: e.target.value as '_blank' | '_self' })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="_self">Same Tab</option>
                                        <option value="_blank">New Tab</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {selectedElement.type === 'columns' && (
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Column Count
                                </label>
                                <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                                    {selectedElement.columnCount || 2}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                step="1"
                                value={selectedElement.columnCount || 2}
                                onChange={(e) => updateElement(selectedElement.id, { columnCount: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                            />
                            <p className="text-xs text-slate-400 mt-1">Number of columns (1-4). Note: On mobile, columns stack vertically.</p>
                        </div>
                        
                        {/* Column Cell Backgrounds */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Column Cell Backgrounds
                            </label>
                            <div className="space-y-2">
                                {Array.from({ length: selectedElement.columnCount || 2 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-600 w-20">Cell {index + 1}:</span>
                                        <input
                                            type="color"
                                            value={selectedElement.columnBackgrounds?.[index] || '#f8fafc'}
                                            onChange={(e) => {
                                                const newBackgrounds = [...(selectedElement.columnBackgrounds || Array(selectedElement.columnCount || 2).fill(null))];
                                                newBackgrounds[index] = e.target.value;
                                                updateElement(selectedElement.id, { columnBackgrounds: newBackgrounds });
                                            }}
                                            className="w-12 h-8 border border-slate-300 rounded cursor-pointer"
                                        />
                                        <button
                                            onClick={() => {
                                                const newBackgrounds = [...(selectedElement.columnBackgrounds || Array(selectedElement.columnCount || 2).fill(null))];
                                                newBackgrounds[index] = null;
                                                updateElement(selectedElement.id, { columnBackgrounds: newBackgrounds });
                                            }}
                                            className="px-2 py-1 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'rows' && (
                    <div className="p-3 border border-slate-200 rounded-lg">
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Row Cell Backgrounds
                            </label>
                            <div className="space-y-2">
                                {Array.from({ length: selectedElement.rowCount || 1 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-600 w-20">Row {index + 1}:</span>
                                        <input
                                            type="color"
                                            value={selectedElement.rowBackgrounds?.[index] || '#ffffff'}
                                            onChange={(e) => {
                                                const newBackgrounds = [...(selectedElement.rowBackgrounds || Array(selectedElement.rowCount || 1).fill(null))];
                                                newBackgrounds[index] = e.target.value === '#ffffff' ? null : e.target.value;
                                                updateElement(selectedElement.id, { rowBackgrounds: newBackgrounds });
                                            }}
                                            className="w-12 h-8 border border-slate-300 rounded cursor-pointer"
                                        />
                                        <button
                                            onClick={() => {
                                                const newBackgrounds = [...(selectedElement.rowBackgrounds || Array(selectedElement.rowCount || 1).fill(null))];
                                                newBackgrounds[index] = null;
                                                updateElement(selectedElement.id, { rowBackgrounds: newBackgrounds });
                                            }}
                                            className="px-2 py-1 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {isFormProject && !['container', 'columns', 'rich-text', 'text-block', 'star-rating', 'hidden', 'button', 'image', 'heading'].includes(selectedElement.type) && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <label htmlFor="required" className="text-sm font-medium text-slate-700">
                            Required Field
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                id="required"
                                checked={selectedElement.required}
                                onChange={(e) => updateElement(selectedElement.id, { required: e.target.checked })}
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-500 right-5 border-slate-300"
                            />
                            <label htmlFor="required" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${selectedElement.required ? 'bg-brand-500' : 'bg-slate-300'}`}></label>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'image' && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image Properties</h3>
                        
                        {/* Image Selection */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Image
                            </label>
                            <div className="space-y-3">
                                {/* Image Picker */}
                                <ImagePicker
                                    selectedImageUrl={selectedElement.imageUrl}
                                    onImageSelect={(imageUrl, image) => {
                                        updateElement(selectedElement.id, { 
                                            imageUrl: imageUrl,
                                            imageAlt: image?.alt || selectedElement.imageAlt || 'Image',
                                            imageWidth: image?.width || selectedElement.imageWidth,
                                            imageHeight: image?.height || selectedElement.imageHeight
                                        });
                                    }}
                                    className="w-full h-32"
                                />
                                
                                {/* Manual URL input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Or enter URL manually
                                    </label>
                                    <input
                                        type="url"
                                        value={selectedElement.imageUrl || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { imageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Alt Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                value={selectedElement.imageAlt || ''}
                                onChange={(e) => updateElement(selectedElement.id, { imageAlt: e.target.value })}
                                placeholder="Description of the image"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            />
                            <p className="text-xs text-slate-400 mt-1">Describe the image for accessibility and SEO.</p>
                        </div>
                        
                        {/* Image Dimensions */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Width (px)
                                </label>
                                <input
                                    type="number"
                                    min="50"
                                    max="1200"
                                    value={selectedElement.imageWidth || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidth: parseInt(e.target.value) || undefined })}
                                    placeholder="400"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Height (px)
                                </label>
                                <input
                                    type="number"
                                    min="50"
                                    max="800"
                                    value={selectedElement.imageHeight || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { imageHeight: parseInt(e.target.value) || undefined })}
                                    placeholder="200"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Leave dimensions empty for auto-sizing. Aspect ratio will be maintained.</p>
                    </div>
                )}

                {selectedElement.type === 'select' && (
                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Options
                        </label>
                        <div className="space-y-2">
                            {selectedElement.options?.map((option, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedElement.options || [])];
                                            newOptions[index] = { ...option, label: e.target.value, value: e.target.value };
                                            updateElement(selectedElement.id, { options: newOptions });
                                        }}
                                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                        placeholder="Option Label"
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = selectedElement.options?.filter((_, i) => i !== index);
                                            updateElement(selectedElement.id, { options: newOptions });
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newOptions = [...(selectedElement.options || []), { label: 'New Option', value: 'new_option' }];
                                    updateElement(selectedElement.id, { options: newOptions });
                                }}
                                className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'radio' && (
                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Options
                        </label>
                        <div className="space-y-2">
                            {selectedElement.options?.map((option, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedElement.options || [])];
                                            newOptions[index] = { ...option, label: e.target.value, value: e.target.value };
                                            updateElement(selectedElement.id, { options: newOptions });
                                        }}
                                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                        placeholder="Option Label"
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = selectedElement.options?.filter((_, i) => i !== index);
                                            updateElement(selectedElement.id, { options: newOptions });
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newOptions = [...(selectedElement.options || []), { label: 'New Option', value: 'new_option' }];
                                    updateElement(selectedElement.id, { options: newOptions });
                                }}
                                className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'menu' && (
                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Menu Items
                        </label>
                        <div className="space-y-2">
                            {selectedElement.menuItems?.map((item, index) => (
                                <div key={index} className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => {
                                                const newItems = [...(selectedElement.menuItems || [])];
                                                newItems[index] = { ...item, label: e.target.value };
                                                updateElement(selectedElement.id, { menuItems: newItems });
                                            }}
                                            className="flex-1 p-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                            placeholder="Menu Label"
                                        />
                                        <button
                                            onClick={() => {
                                                const newItems = selectedElement.menuItems?.filter((_, i) => i !== index);
                                                updateElement(selectedElement.id, { menuItems: newItems });
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item.href}
                                            onChange={(e) => {
                                                const newItems = [...(selectedElement.menuItems || [])];
                                                newItems[index] = { ...item, href: e.target.value };
                                                updateElement(selectedElement.id, { menuItems: newItems });
                                            }}
                                            className="flex-1 p-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                            placeholder="URL or path (e.g., /about, https://example.com)"
                                        />
                                        <select
                                            value={item.target || '_self'}
                                            onChange={(e) => {
                                                const newItems = [...(selectedElement.menuItems || [])];
                                                newItems[index] = { ...item, target: e.target.value as '_blank' | '_self' };
                                                updateElement(selectedElement.id, { menuItems: newItems });
                                            }}
                                            className="p-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                        >
                                            <option value="_self">Same Tab</option>
                                            <option value="_blank">New Tab</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newItems = [...(selectedElement.menuItems || []), { label: 'New Menu Item', href: '#' }];
                                    updateElement(selectedElement.id, { menuItems: newItems });
                                }}
                                className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                            >
                                <Plus size={16} /> Add Menu Item
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
