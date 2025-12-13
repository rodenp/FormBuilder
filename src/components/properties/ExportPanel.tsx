import React, { useState } from 'react';
import { Eye, Copy } from 'lucide-react';
import { clsx } from 'clsx';
import type { FormSettings, FormElement } from '../../types';

interface ExportPanelProps {
    settings: FormSettings;
    elements: FormElement[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ settings, elements }) => {
    const [codeType, setCodeType] = useState<'html' | 'react' | 'json'>('html');
    const [copiedCode, setCopiedCode] = useState(false);

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
      
      <form onSubmit={handleSubmit}${settings.formAction ? ' action="' + settings.formAction.split(' ')[0] + '" ' : ''}${settings.formMethod ? ' method="' + settings.formMethod + '"' : (settings.formAction ? ' method="POST"' : '')}${settings.formTarget ? ' target="' + settings.formTarget + '"' : ''}>
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

    const generateFormCode = () => {
        if (codeType === 'html') {
            return generateHTMLCode();
        } else if (codeType === 'react') {
            return generateReactCode();
        } else {
            return generateJSONCode();
        }
    };

    const copyToClipboard = () => {
        const code = generateFormCode();
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
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
    );
};
