import React from 'react';
import type { FormElement } from '../../../../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../../../../store/useStore';

interface PropertiesProps {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ element, updateElement }) => {
    const { settings } = useStore();
    const displayColor = element.textColor || settings.textColor || 'transparent';
    return (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-4">
            {/* Heading Level */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Heading Level
                </label>
                <select
                    value={element.headingLevel || 1}
                    onChange={(e) => updateElement(element.id, { headingLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                >
                    <option value={1}>H1 (Largest)</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                    <option value={5}>H5</option>
                    <option value={6}>H6 (Smallest)</option>
                </select>
            </div>

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
                            value={element.fontWeight || '700'}
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
                                value={element.fontSize ? parseInt(element.fontSize) : ''}
                                onChange={(e) => updateElement(element.id, { fontSize: e.target.value ? `${parseInt(e.target.value)}px` : undefined })}
                                placeholder="Auto"
                                className="w-full p-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm pl-8"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Type size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Text Color</label>
                        <div className="relative inline-block">
                            <div
                                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden relative"
                                onClick={() => {
                                    const colorInput = document.createElement('input');
                                    colorInput.type = 'color';
                                    colorInput.value = element.textColor || '#000000';
                                    colorInput.onchange = (e) => {
                                        const target = e.target as HTMLInputElement;
                                        updateElement(element.id, { textColor: target.value });
                                    };
                                    colorInput.click();
                                }}
                                style={{
                                    backgroundColor: displayColor
                                }}
                                title={element.textColor ? "Click to change text color" : "Inherited from Body (Click to override)"}
                            >
                                {!element.textColor && !settings.textColor && (
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                        <path d="M8 40L40 8" stroke="#ef4444" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                            {element.textColor && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateElement(element.id, { textColor: undefined });
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    title="Remove text color"
                                >
                                    ×
                                </button>
                            )}
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
            <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Spacing
                </label>

                {/* Line Height */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Line Height</label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                            <input
                                type="number"
                                value={parseInt(String(element.lineHeight || '100'), 10)}
                                onChange={(e) => updateElement(element.id, { lineHeight: `${parseInt(e.target.value) || 100}%` })}
                                className="w-16 p-1.5 text-center text-sm bg-transparent outline-none border-r border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200"
                            />
                            <div className="bg-slate-50 dark:bg-gray-800 px-2 py-1.5 text-sm text-slate-500 dark:text-gray-400">%</div>
                        </div>
                        <div className="flex border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                            <button
                                onClick={() => {
                                    const current = parseInt(String(element.lineHeight || '100'), 10);
                                    updateElement(element.id, { lineHeight: `${Math.max(80, current - 10)}%` });
                                }}
                                className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 border-r border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    const current = parseInt(String(element.lineHeight || '100'), 10);
                                    updateElement(element.id, { lineHeight: `${Math.min(200, current + 10)}%` });
                                }}
                                className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Letter Spacing */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Letter Spacing</label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                            <input
                                type="number"
                                step="0.5"
                                value={parseFloat(String(element.letterSpacing || '0'))}
                                onChange={(e) => updateElement(element.id, { letterSpacing: `${parseFloat(e.target.value) || 0}px` })}
                                className="w-16 p-1.5 text-center text-sm bg-transparent outline-none border-r border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200"
                            />
                            <div className="bg-slate-50 dark:bg-gray-800 px-2 py-1.5 text-sm text-slate-500 dark:text-gray-400">px</div>
                        </div>
                        <div className="flex border border-slate-200 dark:border-gray-600 rounded overflow-hidden">
                            <button
                                onClick={() => {
                                    const current = parseFloat(String(element.letterSpacing || '0'));
                                    updateElement(element.id, { letterSpacing: `${Math.max(-5, current - 0.5)}px` });
                                }}
                                className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 border-r border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    const current = parseFloat(String(element.letterSpacing || '0'));
                                    updateElement(element.id, { letterSpacing: `${Math.min(10, current + 0.5)}px` });
                                }}
                                className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
