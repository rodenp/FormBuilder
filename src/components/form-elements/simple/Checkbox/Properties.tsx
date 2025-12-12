import React from 'react';
import type { FormElement } from '../../../../types';

interface PropertiesProps {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ element, updateElement }) => {
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Checkbox Text
            </label>
            <input
                type="text"
                value={element.placeholder || ''}
                onChange={(e) => updateElement(element.id, { placeholder: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                placeholder="Option text (e.g., I agree to terms)"
            />
        </div>
    );
};
