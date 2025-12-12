import React from 'react';
import { Plus, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { FormElement } from '../../../../types';

export const MenuProperties: React.FC<{
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}> = ({ element, updateElement }) => {
    const [isItemsOpen, setIsItemsOpen] = React.useState(true);

    return (
        <div className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <button
                onClick={() => setIsItemsOpen(!isItemsOpen)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    Menu Items
                </span>
                {isItemsOpen ? (
                    <ChevronUp size={16} className="text-slate-400" />
                ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                )}
            </button>

            {isItemsOpen && (
                <div className="p-4 space-y-3 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700">
                    <div className="space-y-2">
                        {element.menuItems?.map((item, index) => (
                            <div key={index} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg group overflow-hidden">
                                <div className="flex items-center gap-2 p-3">
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => {
                                            const newItems = [...(element.menuItems || [])];
                                            newItems[index] = { ...item, label: e.target.value };
                                            updateElement(element.id, { menuItems: newItems });
                                        }}
                                        className="flex-1 bg-transparent text-sm text-slate-700 dark:text-gray-200 border-none p-0 focus:ring-0 placeholder-slate-400"
                                        placeholder="Menu Label"
                                    />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                const newItems = element.menuItems?.filter((_, i) => i !== index);
                                                updateElement(element.id, { menuItems: newItems });
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete item"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newId = uuidv4();
                                const newItems = [...(element.menuItems || []), { id: newId, label: 'New Menu Item', href: '#' }];
                                updateElement(element.id, { menuItems: newItems });
                            }}
                            className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                        >
                            <Plus size={16} /> Add Menu Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
