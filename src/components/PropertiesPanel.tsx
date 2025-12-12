import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash, Settings, Sliders, ExternalLink, MessageCircle, Globe, X, Bold, Italic, Strikethrough, Underline, Eye, Copy, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, ChevronUp, Type, Minus, Webhook } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';
import type { SubmissionAction, FormElement } from '../types';
import { LayoutPanel } from './LayoutPanel';
import { ImagePicker } from './ImagePicker';
import { ComponentRegistry } from './form-elements/index';


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
    const [buttonOptionsOpen, setButtonOptionsOpen] = useState(true);
    const [buttonBorderOpen, setButtonBorderOpen] = useState(false);
    const [buttonRoundedOpen, setButtonRoundedOpen] = useState(false);
    const [buttonActionsOpen, setButtonActionsOpen] = useState(true);
    const [layoutOpen, setLayoutOpen] = React.useState(true);

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
            <div className="form-builder-properties bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-800 h-full flex flex-col">
                <div className="properties-header bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800">
                    <div style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-lg)' }} className="bg-slate-50 text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                        <Settings size={18} />
                    </div>
                    <div>
                        <h2 className="properties-header-title text-slate-800 dark:text-gray-100">Form Settings</h2>
                        <p style={{ fontSize: '0.75rem', margin: 0 }} className="text-slate-500 dark:text-gray-500">Global configuration</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs border-b border-slate-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveFormTab('settings')}
                        className={clsx("tab flex-1 py-3 text-sm font-medium transition-colors relative",
                            activeFormTab === 'settings'
                                ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                        )}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveFormTab('actions')}
                        className={clsx("tab flex-1 py-3 text-sm font-medium transition-colors relative",
                            activeFormTab === 'actions'
                                ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                        )}
                    >
                        Actions
                    </button>
                    <button
                        onClick={() => setActiveFormTab('code')}
                        className={clsx("tab flex-1 py-3 text-sm font-medium transition-colors relative",
                            activeFormTab === 'code'
                                ? "text-brand-600 dark:text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                        )}
                    >
                        Code
                    </button>
                </div>

                <div style={{ padding: '24px 32px 80px 32px', gap: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {activeFormTab === 'settings' && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Form Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.title}
                                    onChange={(e) => updateSettings({ title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={settings.description || ''}
                                    onChange={(e) => updateSettings({ description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Submit Button Text
                                </label>
                                <input
                                    type="text"
                                    value={settings.submitButtonText}
                                    onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            {/* Primary Color Control */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Primary Color
                                </label>
                                <div className="relative inline-block">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                                        style={{
                                            backgroundColor: settings.primaryColor || '#3b82f6'
                                        }}
                                        onClick={() => {
                                            // Create a color input element and trigger click
                                            const colorInput = document.createElement('input');
                                            colorInput.type = 'color';
                                            colorInput.value = settings.primaryColor || '#3b82f6';
                                            colorInput.onchange = (e) => {
                                                const target = e.target as HTMLInputElement;
                                                updateSettings({ primaryColor: target.value });
                                            };
                                            colorInput.click();
                                        }}
                                    >
                                        {!settings.primaryColor && (
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                                            </svg>
                                        )}
                                    </div>
                                    {settings.primaryColor && (
                                        <button
                                            onClick={() => updateSettings({ primaryColor: undefined })}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                            title="Remove primary color"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Form Background Color Control */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Form Background
                                </label>
                                <div className="relative inline-block">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                                        style={{
                                            backgroundColor: settings.formBackground || '#ffffff'
                                        }}
                                        onClick={() => {
                                            // Create a color input element and trigger click
                                            const colorInput = document.createElement('input');
                                            colorInput.type = 'color';
                                            colorInput.value = settings.formBackground || '#ffffff';
                                            colorInput.onchange = (e) => {
                                                const target = e.target as HTMLInputElement;
                                                updateSettings({ formBackground: target.value });
                                            };
                                            colorInput.click();
                                        }}
                                    >
                                        {!settings.formBackground && (
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                                            </svg>
                                        )}
                                    </div>
                                    {settings.formBackground && (
                                        <button
                                            onClick={() => updateSettings({ formBackground: undefined })}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                            title="Remove form background"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                        </>
                    )}


                    {activeFormTab === 'actions' && (
                        <div className="space-y-6">
                            {/* Form Action Configuration */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Form Action
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                            Action URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.formAction || ''}
                                            onChange={(e) => updateSettings({ formAction: e.target.value })}
                                            placeholder="https://your-domain.com/submit"
                                            className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                        />
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Submit form directly to your server endpoint</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                                Method
                                            </label>
                                            <select
                                                value={settings.formMethod || 'POST'}
                                                onChange={(e) => updateSettings({ formMethod: e.target.value as any })}
                                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            >
                                                <option value="POST">POST</option>
                                                <option value="GET">GET</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                                Target
                                            </label>
                                            <select
                                                value={settings.formTarget || '_self'}
                                                onChange={(e) => updateSettings({ formTarget: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
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

                            <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
                                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                    Additional Submission Actions
                                </label>
                            </div>

                            <div className="space-y-3">
                                {settings.submissionActions.map((action, index) => (
                                    <div key={action.id} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
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
                                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
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
                                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
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
                                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
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
                                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
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
                                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
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
                                        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-xl text-slate-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                    >
                                        <Plus size={20} />
                                        <span className="font-medium">Add Submission Action</span>
                                    </button>
                                ) : (
                                    <div className="border border-slate-200 dark:border-gray-700 rounded-xl p-4 bg-slate-50 dark:bg-gray-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-slate-700 dark:text-gray-200">Choose Action Type</h4>
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
        <div className="form-builder-properties h-full flex flex-col">
            <div className="properties-header">
                <div className="properties-header-icon">
                    <Sliders size={18} />
                </div>
                <div>
                    <h2 className="properties-header-title">Properties</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0 }}>Edit {selectedElement.type} field</p>
                </div>
            </div>

            <div style={{ padding: '24px 32px 80px 32px', gap: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Define input types that need field name and placeholder */}
                {(() => {
                    const isInputType = !['container', 'columns', 'rich-text', 'text-block', 'star-rating', 'button'].includes(selectedElement.type);
                    const needsFieldName = isInputType && selectedElement.type !== 'hidden';
                    const needsPlaceholder = isInputType && !['hidden', 'checkbox', 'radio', 'star-rating', 'select', 'date', 'time', 'month', 'button'].includes(selectedElement.type);

                    return (
                        <>
                            {isFormProject && selectedElement.type !== 'hidden' && selectedElement.type !== 'rich-text' && selectedElement.type !== 'text-block' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Label
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.label}
                                        onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            )}

                            {isFormProject && needsFieldName && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Field Name (Data Key)
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.name}
                                        onChange={(e) => updateElement(selectedElement.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Unique key for this field in the submitted data.</p>
                                </div>
                            )}

                            {isFormProject && needsPlaceholder && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Placeholder
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.placeholder || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            )}
                        </>
                    );
                })()}


                {selectedElement.type === 'hidden' ? (
                    <>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Field Name (Data Key)
                            </label>
                            <input
                                type="text"
                                value={selectedElement.name}
                                onChange={(e) => updateElement(selectedElement.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                            />
                            <p className="text-xs text-slate-400 mt-1">Unique key for this field in the submitted data.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Hidden Value
                            </label>
                            <input
                                type="text"
                                value={selectedElement.value || ''}
                                onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
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
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Type size={16} className="text-slate-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Text Styling</span>
                            </div>
                            {textPropsOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {textPropsOpen && (
                            <div className="mt-3 space-y-4 p-4 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                {/* Font Family */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Font Family</label>
                                    <select
                                        value={selectedElement.fontFamily || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value || undefined })}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
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
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Font Weight</label>
                                    <select
                                        value={selectedElement.fontWeight || 'normal'}
                                        onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value as any })}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="normal">Regular</option>
                                        <option value="medium">Medium</option>
                                        <option value="semibold">Semi Bold</option>
                                        <option value="bold">Bold</option>
                                    </select>
                                </div>

                                {/* Font Size */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Font Size</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="8"
                                            max="96"
                                            value={selectedElement.fontSize || 16}
                                            onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                                            className="flex-1 p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        />
                                        <span className="text-sm text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2.5">px</span>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { fontSize: Math.max(8, (selectedElement.fontSize || 16) - 1) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { fontSize: Math.min(96, (selectedElement.fontSize || 16) + 1) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={selectedElement.textColor || '#000000'}
                                            onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })}
                                            className="w-12 h-10 border border-slate-200 dark:border-gray-600 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={selectedElement.textColor || '#000000'}
                                            onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })}
                                            className="flex-1 p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                            placeholder="#000000"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { textColor: undefined })}
                                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Reset color"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Text Alignment */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Text Align</label>
                                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-900">
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${(selectedElement.textAlign ?? 'left') === 'left'
                                                ? 'bg-gray-800 dark:bg-gray-700 text-white shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <AlignLeft size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'center'
                                                ? 'bg-gray-800 dark:bg-gray-700 text-white shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <AlignCenter size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'right'
                                                ? 'bg-gray-800 dark:bg-gray-700 text-white shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <AlignRight size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { textAlign: 'justify' })}
                                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'justify'
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
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Line Height</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="80"
                                            max="200"
                                            step="10"
                                            value={selectedElement.lineHeight || 140}
                                            onChange={(e) => updateElement(selectedElement.id, { lineHeight: parseInt(e.target.value) || 140 })}
                                            className="flex-1 p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        />
                                        <span className="text-sm text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2.5">%</span>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { lineHeight: Math.max(80, (selectedElement.lineHeight || 140) - 10) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { lineHeight: Math.min(200, (selectedElement.lineHeight || 140) + 10) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Letter Spacing */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Letter Spacing</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="-5"
                                            max="10"
                                            step="0.5"
                                            value={selectedElement.letterSpacing || 0}
                                            onChange={(e) => updateElement(selectedElement.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                                            className="flex-1 p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        />
                                        <span className="text-sm text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2.5">px</span>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { letterSpacing: Math.max(-5, (selectedElement.letterSpacing || 0) - 0.5) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateElement(selectedElement.id, { letterSpacing: Math.min(10, (selectedElement.letterSpacing || 0) + 0.5) })}
                                            className="p-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 transition-colors"
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
                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Label Size
                            </label>
                            <select
                                value={selectedElement.labelSize || 'sm'}
                                onChange={(e) => updateElement(selectedElement.id, { labelSize: e.target.value as any })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="xs">Extra Small</option>
                                <option value="sm">Small</option>
                                <option value="base">Normal</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Label Formatting
                            </label>
                            <div className="flex gap-1 p-1 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg">
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
                {selectedElement.type !== 'button' && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Background Color
                        </label>
                        <div className="relative inline-block">
                            <div
                                className="w-12 h-12 rounded-lg border border-slate-200 dark:border-gray-700 relative overflow-hidden cursor-pointer"
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
                                        <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                            {selectedElement.backgroundColor && (
                                <button
                                    onClick={() => updateElement(selectedElement.id, { backgroundColor: undefined })}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    title="Remove background color"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Image Width and Alignment - positioned after background color */}
                {selectedElement.type === 'image' && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        {/* Width Percentage */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Width: <span className="font-semibold text-gray-900 dark:text-white">{selectedElement.imageWidthPercent || 100}%</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={selectedElement.imageWidthPercent || 100}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidthPercent: parseInt(e.target.value) })}
                                    className="flex-1 h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={selectedElement.imageWidthPercent || 100}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidthPercent: parseInt(e.target.value) || 100 })}
                                    className="w-16 px-2 py-1 text-xs border border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>10%</span>
                                <span>100% (Full width)</span>
                            </div>
                        </div>

                        {/* Image Alignment */}
                        <div>
                            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">Align</h3>
                            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'left' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${(selectedElement.imageAlign ?? 'left') === 'left'
                                        ? 'bg-gray-800 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    title="Align Left"
                                >
                                    <AlignLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { imageAlign: 'center' })}
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.imageAlign === 'center'
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
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.imageAlign === 'right'
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
                                    className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.imageAlign === 'justify'
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

                {/* Dynamic Properties from Registry (Moved for priority) */}
                {(() => {
                    const RegisteredProperties = ComponentRegistry.get(selectedElement.type)?.Properties;
                    if (RegisteredProperties) {
                        return (
                            <div className="mb-4">
                                <RegisteredProperties element={selectedElement} updateElement={updateElement} />
                            </div>
                        );
                    }
                    return null;
                })()}



                {/* Generic Layout Panel - Collapsible */}
                {!['hidden', 'button'].includes(selectedElement.type) && (
                    <div className="border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-4">
                        <button
                            type="button"
                            onClick={() => setLayoutOpen(!layoutOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                                Layout
                            </span>
                            {layoutOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>

                        {layoutOpen && (
                            <div className="p-4 border-t border-slate-200 dark:border-gray-700">
                                <LayoutPanel
                                    selectedElement={selectedElement}
                                    updateElement={updateElement}
                                    hideHeader={true}
                                    boxModelOnly={['social', 'menu', 'columns'].includes(selectedElement.type)}
                                />
                            </div>
                        )}
                    </div>
                )}


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

                {/* Button Actions */}
                {selectedElement.type === 'button' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setButtonActionsOpen(!buttonActionsOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 border border-slate-400 rounded-sm w-5 h-4 flex items-center justify-center">
                                    <div className="w-3 h-0.5 bg-slate-600 dark:bg-slate-300"></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">Button Actions</span>
                            </div>
                            {buttonActionsOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {buttonActionsOpen && (
                            <div className="mt-3 space-y-4 p-4 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedElement.buttonText || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonText: e.target.value })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Button text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Button Type
                                    </label>
                                    <select
                                        value={selectedElement.buttonType || 'button'}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonType: e.target.value as 'button' | 'submit' | 'reset' })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="button">Button</option>
                                        <option value="submit">Submit</option>
                                        <option value="reset">Reset</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Button Style
                                    </label>
                                    <select
                                        value={selectedElement.buttonStyle || 'primary'}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonStyle: e.target.value as 'primary' | 'secondary' | 'outline' | 'text' })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="secondary">Secondary</option>
                                        <option value="outline">Outline</option>
                                        <option value="text">Text</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Button Size
                                    </label>
                                    <select
                                        value={selectedElement.buttonSize || 'md'}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonSize: e.target.value as 'sm' | 'md' | 'lg' })}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="sm">Small</option>
                                        <option value="md">Medium</option>
                                        <option value="lg">Large</option>
                                    </select>
                                </div>
                                {selectedElement.buttonType === 'submit' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                URL
                                            </label>
                                            <input
                                                type="url"
                                                value={selectedElement.buttonUrl || ''}
                                                onChange={(e) => updateElement(selectedElement.id, { buttonUrl: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
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
                                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                            >
                                                <option value="_self">Same Tab</option>
                                                <option value="_blank">New Tab</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Button Options */}
                {selectedElement.type === 'button' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-700 mt-4">
                        <button
                            type="button"
                            onClick={() => setButtonOptionsOpen(!buttonOptionsOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 border border-slate-400 rounded-sm w-5 h-4"></div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">Button Options</span>
                            </div>
                            {buttonOptionsOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {buttonOptionsOpen && (
                            <div className="mt-3 space-y-6 p-4 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                {/* Background Color */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Background Color</label>
                                    <div className="relative inline-block">
                                        <div
                                            className="w-10 h-10 rounded border border-slate-200 dark:border-gray-600 cursor-pointer overflow-hidden relative"
                                            style={{ backgroundColor: (selectedElement.backgroundColor && selectedElement.backgroundColor !== 'transparent') ? selectedElement.backgroundColor : (selectedElement.backgroundColor === 'transparent' ? 'transparent' : 'var(--theme-button-bg)') }}
                                            onClick={() => {
                                                const colorInput = document.createElement('input');
                                                colorInput.type = 'color';
                                                colorInput.value = (selectedElement.backgroundColor && selectedElement.backgroundColor !== 'transparent') ? selectedElement.backgroundColor : '#0f172a';
                                                colorInput.onchange = (e) => updateElement(selectedElement.id, { backgroundColor: (e.target as HTMLInputElement).value });
                                                colorInput.click();
                                            }}
                                        >
                                            {selectedElement.backgroundColor === 'transparent' && (
                                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                                    <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                                                </svg>
                                            )}

                                            {(selectedElement.backgroundColor && selectedElement.backgroundColor !== 'transparent') && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateElement(selectedElement.id, { backgroundColor: undefined });
                                                    }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 text-white rounded-full flex items-center justify-center text-[10px]"
                                                >
                                                    <X size={8} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Color */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Text Color</label>
                                    <div className="relative inline-block">
                                        <div
                                            className="w-10 h-10 rounded border border-slate-200 dark:border-gray-600 cursor-pointer overflow-hidden relative"
                                            style={{ backgroundColor: selectedElement.textColor || 'transparent' }}
                                            onClick={() => {
                                                const colorInput = document.createElement('input');
                                                colorInput.type = 'color';
                                                colorInput.value = selectedElement.textColor || '#ffffff';
                                                colorInput.onchange = (e) => updateElement(selectedElement.id, { textColor: (e.target as HTMLInputElement).value });
                                                colorInput.click();
                                            }}
                                        >
                                            {!selectedElement.textColor && (
                                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                                    <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                                                </svg>
                                            )}
                                            {selectedElement.textColor && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateElement(selectedElement.id, { textColor: undefined });
                                                    }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 text-white rounded-full flex items-center justify-center text-[10px]"
                                                >
                                                    <X size={8} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Width Toggle */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Width</label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500 font-medium">Auto On</span>
                                        <div className="relative inline-block w-12 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                checked={selectedElement.buttonWidthType === 'auto' || !selectedElement.buttonWidthType}
                                                onChange={(e) => updateElement(selectedElement.id, { buttonWidthType: e.target.checked ? 'auto' : 'custom' })}
                                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-600 right-6 border-slate-400"
                                            />
                                            <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${selectedElement.buttonWidthType === 'auto' || !selectedElement.buttonWidthType ? 'bg-brand-600' : 'bg-slate-400 dark:bg-gray-600'}`}></label>
                                        </div>
                                    </div>
                                </div>
                                {selectedElement.buttonWidthType === 'custom' && (
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={selectedElement.buttonWidth || 100}
                                        onChange={(e) => updateElement(selectedElement.id, { buttonWidth: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                )}

                                {/* Font Family */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Font Family</label>
                                    <div className="relative w-40">
                                        <select
                                            value={selectedElement.fontFamily || ''}
                                            onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                                            className="w-full p-2 pr-8 text-sm bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg outline-none focus:border-brand-500 transition-colors appearance-none text-right"
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
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-gray-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* Font Weight */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Font Weight</label>
                                    <div className="relative w-40">
                                        <select
                                            value={selectedElement.fontWeight || 'normal'}
                                            onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value as any })}
                                            className="w-full p-2 pr-8 text-sm bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-lg outline-none focus:border-brand-500 transition-colors appearance-none text-right"
                                        >
                                            <option value="normal">Regular</option>
                                            <option value="medium">Medium</option>
                                            <option value="semibold">Semi Bold</option>
                                            <option value="bold">Bold</option>
                                        </select>
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-gray-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* Font Size */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Font Size</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                                            <input
                                                type="number"
                                                value={selectedElement.fontSize || 16}
                                                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                                className="w-12 p-1.5 text-center text-sm bg-transparent outline-none border-r border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200"
                                            />
                                            <div className="bg-slate-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-slate-500 border-r border-slate-200 dark:border-gray-600">px</div>
                                            <button onClick={() => updateElement(selectedElement.id, { fontSize: (selectedElement.fontSize || 16) - 1 })} className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-gray-700 border-r border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 transition-colors"><Minus size={14} /></button>
                                            <button onClick={() => updateElement(selectedElement.id, { fontSize: (selectedElement.fontSize || 16) + 1 })} className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 transition-colors"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Line Height */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Line Height</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                                            <input
                                                type="number"
                                                value={selectedElement.lineHeight || 120}
                                                onChange={(e) => updateElement(selectedElement.id, { lineHeight: parseInt(e.target.value) })}
                                                className="w-16 p-1.5 text-center text-sm bg-transparent outline-none border-r border-slate-200 dark:border-gray-600"
                                            />
                                            <div className="bg-slate-50 dark:bg-gray-800 px-2 py-1.5 text-sm text-slate-500">%</div>
                                        </div>
                                        <div className="flex border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                                            <button onClick={() => updateElement(selectedElement.id, { lineHeight: (selectedElement.lineHeight || 120) - 10 })} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 border-r border-slate-200 dark:border-gray-600"><Minus size={14} /></button>
                                            <button onClick={() => updateElement(selectedElement.id, { lineHeight: (selectedElement.lineHeight || 120) + 10 })} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Letter Spacing */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Letter Spacing</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                                            <input
                                                type="number"
                                                value={selectedElement.letterSpacing || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { letterSpacing: parseFloat(e.target.value) })}
                                                className="w-16 p-1.5 text-center text-sm bg-transparent outline-none border-r border-slate-200 dark:border-gray-600"
                                            />
                                            <div className="bg-slate-50 dark:bg-gray-800 px-2 py-1.5 text-sm text-slate-500">px</div>
                                        </div>
                                        <div className="flex border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                                            <button onClick={() => updateElement(selectedElement.id, { letterSpacing: (selectedElement.letterSpacing || 0) - 0.5 })} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 border-r border-slate-200 dark:border-gray-600"><Minus size={14} /></button>
                                            <button onClick={() => updateElement(selectedElement.id, { letterSpacing: (selectedElement.letterSpacing || 0) + 0.5 })} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Layout Section (Moved for Button) */}
                {selectedElement.type === 'button' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-700 mt-4">
                        <button
                            type="button"
                            onClick={() => setLayoutOpen(!layoutOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 border border-slate-400 rounded-sm w-5 h-4 flex items-center justify-center">
                                    <div className="w-3 h-3 border border-slate-600 dark:border-slate-300 border-dashed"></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">Layout</span>
                            </div>
                            {layoutOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {layoutOpen && (
                            <div className="mt-3 p-4 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <LayoutPanel
                                    selectedElement={selectedElement}
                                    updateElement={updateElement}
                                    hideHeader={true}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Border Settings */}
                {selectedElement.type === 'button' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-700 mt-4">
                        <button
                            type="button"
                            onClick={() => setButtonBorderOpen(!buttonBorderOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 border border-slate-400 rounded-sm w-5 h-5 flex items-center justify-center">
                                    <div className="w-3 h-3 border border-slate-600 dark:border-slate-300"></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">Border</span>
                            </div>
                            {buttonBorderOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {buttonBorderOpen && (
                            <div className="mt-3 p-6 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                {/* Visual Border Editor */}
                                <div className="relative w-full h-48 flex items-center justify-center select-none py-2">
                                    {/* Central Box */}
                                    <div className="relative w-14 h-9 bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded flex items-center justify-center z-10">
                                        <div className="w-6 h-6 border border-slate-300 dark:border-gray-500 rounded-sm opacity-50"></div>
                                    </div>

                                    {/* Controls Wrapper */}
                                    {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                                        const sideKey = side as 'Top' | 'Right' | 'Left' | 'Bottom';
                                        // @ts-ignore
                                        const width = selectedElement[`borderWidth${sideKey}`] || 0;
                                        // @ts-ignore
                                        const color = selectedElement[`borderColor${sideKey}`];
                                        // @ts-ignore
                                        const style = selectedElement[`borderStyle${sideKey}`] || 'None';

                                        const positionClasses = {
                                            Top: 'top-0 left-1/2 -translate-x-1/2 flex-col-reverse mb-1 pt-1',
                                            Right: 'right-0 top-1/2 -translate-y-1/2 flex-row ml-1 pl-1',
                                            Bottom: 'bottom-0 left-1/2 -translate-x-1/2 flex-col mt-1 pb-1',
                                            Left: 'left-0 top-1/2 -translate-y-1/2 flex-row-reverse mr-1 pr-1'
                                        }[side];

                                        return (
                                            <div key={side} className={`absolute ${positionClasses} flex items-center gap-1.5 z-20`}>
                                                {/* Width Input */}
                                                <div className="relative group">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={width}
                                                        onChange={(e) => updateElement(selectedElement.id, { [`borderWidth${sideKey}`]: parseInt(e.target.value) || 0 })}
                                                        className="w-10 h-6 text-center text-[10px] font-medium border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>

                                                {/* Color Picker */}
                                                <div className="relative">
                                                    <div
                                                        className="w-5 h-5 rounded-full border border-slate-200 dark:border-gray-600 cursor-pointer shadow-sm hover:scale-110 transition-transform overflow-hidden relative"
                                                        style={{ backgroundColor: color || 'transparent' }}
                                                        onClick={() => {
                                                            const i = document.createElement('input');
                                                            i.type = 'color';
                                                            i.value = color || '#000000';
                                                            // @ts-ignore
                                                            i.onchange = e => updateElement(selectedElement.id, { [`borderColor${sideKey}`]: (e.target as HTMLInputElement).value });
                                                            i.click();
                                                        }}
                                                        title={`${side} Color`}
                                                    >
                                                        {!color && (
                                                            <svg className="absolute inset-0 w-full h-full p-0.5" viewBox="0 0 48 48">
                                                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="4" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Style Selector (Compact) */}
                                                <div className="relative">
                                                    <select
                                                        value={style}
                                                        // @ts-ignore
                                                        onChange={(e) => updateElement(selectedElement.id, { [`borderStyle${sideKey}`]: e.target.value })}
                                                        className="appearance-none w-5 h-5 p-0 border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 cursor-pointer text-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm hover:border-slate-300 dark:hover:border-gray-500 active:bg-slate-50 relative z-10"
                                                        title="Border Style"
                                                    >
                                                        <option value="None">None</option>
                                                        <option value="Solid">Solid</option>
                                                        <option value="Dashed">Dash</option>
                                                        <option value="Dotted">Dot</option>
                                                    </select>
                                                    {/* Custom Icon for Style */}
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                                        {style === 'None' && <span className="block w-2.5 h-2.5 border border-slate-300 dark:border-gray-500 rounded-full opacity-50"></span>}
                                                        {style === 'Solid' && <span className="block w-2.5 h-[1.5px] bg-slate-600 dark:bg-slate-300"></span>}
                                                        {style === 'Dashed' && <span className="block w-2.5 h-[1.5px] border-b-[1.5px] border-dashed border-slate-600 dark:border-slate-300"></span>}
                                                        {style === 'Dotted' && <span className="block w-2.5 h-[1.5px] border-b-[1.5px] border-dotted border-slate-600 dark:border-slate-300"></span>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Rounded Border Settings */}
                {selectedElement.type === 'button' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-700 mt-4">
                        <button
                            type="button"
                            onClick={() => setButtonRoundedOpen(!buttonRoundedOpen)}
                            className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1 border border-slate-400 rounded-sm w-5 h-5 flex items-center justify-center">
                                    <div className="w-3 h-3 border border-slate-600 dark:border-slate-300 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">Rounded Border</span>
                            </div>
                            {buttonRoundedOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
                        </button>

                        {buttonRoundedOpen && (
                            <div className="mt-3 p-6 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                {/* Visual Radius Editor */}
                                <div className="relative w-full h-32 flex items-center justify-center bg-slate-50 dark:bg-gray-900/50 rounded-lg border border-slate-100 dark:border-gray-800/50">
                                    <div className="w-32 h-16 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center relative shadow-sm">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Radius</span>

                                        {/* Top Left */}
                                        <div className="absolute -top-3 -left-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={selectedElement.borderRadiusTopLeft || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { borderRadiusTopLeft: parseInt(e.target.value) || 0 })}
                                                className="w-10 h-8 text-center text-xs font-medium border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            />
                                        </div>

                                        {/* Top Right */}
                                        <div className="absolute -top-3 -right-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={selectedElement.borderRadiusTopRight || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { borderRadiusTopRight: parseInt(e.target.value) || 0 })}
                                                className="w-10 h-8 text-center text-xs font-medium border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            />
                                        </div>

                                        {/* Bottom Left */}
                                        <div className="absolute -bottom-3 -left-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={selectedElement.borderRadiusBottomLeft || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { borderRadiusBottomLeft: parseInt(e.target.value) || 0 })}
                                                className="w-10 h-8 text-center text-xs font-medium border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            />
                                        </div>

                                        {/* Bottom Right */}
                                        <div className="absolute -bottom-3 -right-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={selectedElement.borderRadiusBottomRight || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { borderRadiusBottomRight: parseInt(e.target.value) || 0 })}
                                                className="w-10 h-8 text-center text-xs font-medium border border-slate-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                    <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Image Properties</h3>

                        {/* Image Selection */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
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
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Or enter URL manually
                                    </label>
                                    <input
                                        type="url"
                                        value={selectedElement.imageUrl || ''}
                                        onChange={(e) => updateElement(selectedElement.id, { imageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded text-sm text-slate-700 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Alt Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                value={selectedElement.imageAlt || ''}
                                onChange={(e) => updateElement(selectedElement.id, { imageAlt: e.target.value })}
                                placeholder="Description of the image"
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            />
                            <p className="text-xs text-slate-400 mt-1">Describe the image for accessibility and SEO.</p>
                        </div>

                        {/* Image Dimensions */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Width (px)
                                </label>
                                <input
                                    type="number"
                                    min="50"
                                    max="1200"
                                    value={selectedElement.imageWidth || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { imageWidth: parseInt(e.target.value) || undefined })}
                                    placeholder="400"
                                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Height (px)
                                </label>
                                <input
                                    type="number"
                                    min="50"
                                    max="800"
                                    value={selectedElement.imageHeight || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { imageHeight: parseInt(e.target.value) || undefined })}
                                    placeholder="200"
                                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Leave dimensions empty for auto-sizing. Aspect ratio will be maintained.</p>
                    </div>
                )}






            </div>
        </div>
    );
};
