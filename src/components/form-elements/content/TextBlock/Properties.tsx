import React from 'react';
import type { FormElement } from '../../../../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface PropertiesProps {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ element, updateElement }) => {
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-4">
            {/* Typography Section */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Typography
                </label>
                <div className="space-y-3">
                    {/* Font Family */}
                    <select
                        value={element.fontFamily || 'Inter'}
                        onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Merriweather">Merriweather</option>
                    </select>

                    {/* Weight & Size */}
                    <div className="grid grid-cols-2 gap-2">
                        <select
                            value={element.fontWeight || '400'}
                            onChange={(e) => updateElement(element.id, { fontWeight: e.target.value as 'normal' | 'medium' | 'semibold' | 'bold' })}
                            className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm p-2.5"
                        >
                            <option value="400">Regular</option>
                            <option value="500">Medium</option>
                            <option value="600">Semi Bold</option>
                            <option value="700">Bold</option>
                            <option value="800">Extra Bold</option>
                        </select>

                        <div className="relative">
                            <input
                                type="number"
                                value={element.fontSize || ''}
                                onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
                                placeholder="Auto (16px)"
                                className="w-full p-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm pl-8"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Type size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                type="color"
                                value={element.textColor || '#000000'}
                                onChange={(e) => updateElement(element.id, { textColor: e.target.value })}
                                className="w-full h-9 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Alignment
                </label>
                <div className="flex rounded-lg border border-slate-200 dark:border-gray-700 p-1 bg-slate-50 dark:bg-gray-800">
                    <button
                        onClick={() => updateElement(element.id, { textAlign: 'left' })}
                        className={clsx(
                            "flex-1 flex items-center justify-center py-1.5 rounded transition-all",
                            (!element.textAlign || element.textAlign === 'left') ? "bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-gray-200" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                        )}
                    >
                        <AlignLeft size={16} />
                    </button>
                    <button
                        onClick={() => updateElement(element.id, { textAlign: 'center' })}
                        className={clsx(
                            "flex-1 flex items-center justify-center py-1.5 rounded transition-all",
                            element.textAlign === 'center' ? "bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-gray-200" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                        )}
                    >
                        <AlignCenter size={16} />
                    </button>
                    <button
                        onClick={() => updateElement(element.id, { textAlign: 'right' })}
                        className={clsx(
                            "flex-1 flex items-center justify-center py-1.5 rounded transition-all",
                            element.textAlign === 'right' ? "bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-gray-200" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                        )}
                    >
                        <AlignRight size={16} />
                    </button>
                    <button
                        onClick={() => updateElement(element.id, { textAlign: 'justify' })}
                        className={clsx(
                            "flex-1 flex items-center justify-center py-1.5 rounded transition-all",
                            element.textAlign === 'justify' ? "bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-gray-200" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                        )}
                    >
                        <AlignJustify size={16} />
                    </button>
                </div>
            </div>

            {/* Spacing */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Spacing
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="text-xs text-slate-400 mb-1 block">Line Height (%)</span>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateElement(element.id, { lineHeight: Math.max(80, (element.lineHeight || 140) - 10) })}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-l-lg border-r border-slate-200 text-slate-600"
                            >
                                <Minus size={12} />
                            </button>
                            <input
                                type="number"
                                value={element.lineHeight || 140}
                                onChange={(e) => updateElement(element.id, { lineHeight: parseInt(e.target.value) })}
                                className="w-full p-2 text-center bg-slate-50 border-y border-slate-200 text-sm"
                            />
                            <button
                                onClick={() => updateElement(element.id, { lineHeight: Math.min(200, (element.lineHeight || 140) + 10) })}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-r-lg border-l border-slate-200 text-slate-600"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 mb-1 block">Letter Spacing (px)</span>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateElement(element.id, { letterSpacing: Math.max(-5, (element.letterSpacing || 0) - 0.5) })}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-l-lg border-r border-slate-200 text-slate-600"
                            >
                                <Minus size={12} />
                            </button>
                            <input
                                type="number"
                                value={element.letterSpacing || 0}
                                onChange={(e) => updateElement(element.id, { letterSpacing: parseFloat(e.target.value) })}
                                className="w-full p-2 text-center bg-slate-50 border-y border-slate-200 text-sm"
                                step="0.5"
                            />
                            <button
                                onClick={() => updateElement(element.id, { letterSpacing: Math.min(10, (element.letterSpacing || 0) + 0.5) })}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-r-lg border-l border-slate-200 text-slate-600"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
