import React from 'react';
import type { FormElement } from '../../types';

interface CommonPropertiesProps {
    selectedElement: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    isFormProject: boolean;
}

export const CommonProperties: React.FC<CommonPropertiesProps> = ({
    selectedElement,
    updateElement,
    isFormProject
}) => {
    const isInputType = !['container', 'columns', 'rows', 'grid', 'rich-text', 'text-block', 'star-rating', 'button', 'menu', 'social'].includes(selectedElement.type);
    const needsFieldName = isInputType && selectedElement.type !== 'hidden';
    const needsPlaceholder = isInputType && !['hidden', 'checkbox', 'radio', 'star-rating', 'select', 'date', 'time', 'month', 'button'].includes(selectedElement.type);

    return (
        <React.Fragment>
            {/* Standard Label Input */}
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

            {/* Field Name (Data Key) for standard inputs */}
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

            {/* Placeholder Input */}
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

            {/* Hidden Field Specifics */}
            {selectedElement.type === 'hidden' && (
                <div className="space-y-4">
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
                </div>
            )}
        </React.Fragment>
    );
};
