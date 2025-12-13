import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { FormElement } from '../../types';
import { LayoutPanel } from '../LayoutPanel';

interface LayoutPropertiesProps {
    selectedElement: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const LayoutProperties: React.FC<LayoutPropertiesProps> = ({
    selectedElement,
    updateElement
}) => {
    // Determine if layout panel should be shown
    if (['hidden'].includes(selectedElement.type)) {
        return null;
    }

    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    Layout
                </span>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>

            {isOpen && (
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
    );
};
