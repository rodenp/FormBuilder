///Users/osx/Applications/AI/Form Builder/src/components/properties/StyleProperties.tsx
import React, { useState } from 'react';
import {
    Type, ChevronUp, ChevronDown, Minus, Plus, X,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import type { FormElement } from '../../types';

interface StylePropertiesProps {
    selectedElement: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}

export const StyleProperties: React.FC<StylePropertiesProps> = ({
    selectedElement,
    updateElement
}) => {
    // Only show for specific text-based components
    if (!['rich-text', 'text-block', 'heading'].includes(selectedElement.type)) {
        return null;
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pt-4 border-t border-slate-100">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-lg transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Type size={16} className="text-slate-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Text Styling</span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-gray-400" /> : <ChevronDown size={16} className="text-slate-500 dark:text-gray-400" />}
            </button>

            {isOpen && (
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
    );
};
