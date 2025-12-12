import React from 'react';
import type { FormElement } from '../../../../types';
import { Trash, Plus } from 'lucide-react';

interface PropertiesProps {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ element, updateElement }) => {
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Options
            </label>
            <div className="space-y-2">
                {element.options?.map((option, index) => (
                    <div key={index} className="flex gap-2 group">
                        <input
                            type="text"
                            value={option.label}
                            onChange={(e) => {
                                const newOptions = [...(element.options || [])];
                                newOptions[index] = { ...option, label: e.target.value, value: e.target.value };
                                updateElement(element.id, { options: newOptions });
                            }}
                            className="flex-1 p-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                            placeholder="Option Label"
                        />
                        <button
                            onClick={() => {
                                const newOptions = element.options?.filter((_, i) => i !== index);
                                updateElement(element.id, { options: newOptions });
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => {
                        const newOptions = [...(element.options || []), { label: 'New Option', value: 'new_option' }];
                        updateElement(element.id, { options: newOptions });
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 dark:text-brand-400 rounded-lg transition-colors border border-brand-200 dark:border-brand-800"
                >
                    <Plus size={16} /> Add Option
                </button>
            </div>
        </div>
    );
};
