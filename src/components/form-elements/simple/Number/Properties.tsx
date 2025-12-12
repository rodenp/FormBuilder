import React from 'react';
import type { FormElement } from '../../../../types';

interface PropertiesProps {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ element, updateElement }) => {
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Number Validation</h3>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Min Value
                    </label>
                    <input
                        type="number"
                        value={element.min || ''}
                        onChange={(e) => updateElement(element.id, { min: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        placeholder="Any"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Max Value
                    </label>
                    <input
                        type="number"
                        value={element.max || ''}
                        onChange={(e) => updateElement(element.id, { max: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        placeholder="Any"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Step Size
                </label>
                <input
                    type="number"
                    value={element.step || ''}
                    onChange={(e) => updateElement(element.id, { step: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    placeholder="1"
                />
            </div>
        </div>
    );
};
