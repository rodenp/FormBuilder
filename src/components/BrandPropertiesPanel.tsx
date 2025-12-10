import React from 'react';
import { useStore } from '../store/useStore';
import { Palette } from 'lucide-react';

export const BrandPropertiesPanel: React.FC = () => {
    const { settings, updateSettings } = useStore();

    return (
        <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                        <Palette size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Brand</h3>
                </div>

                {/* Primary Color */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Primary Color
                    </label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="color"
                            value={settings.primaryColor || '#3B82F6'}
                            onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                            className="w-12 h-12 border border-slate-200 dark:border-gray-600 rounded-lg cursor-pointer"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={settings.primaryColor || '#3B82F6'}
                                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Used for buttons, focus states, and accents</p>
                </div>

                {/* Button Style */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Button Style
                    </label>
                    <select
                        value={settings.buttonStyle || 'rounded'}
                        onChange={(e) => updateSettings({ buttonStyle: e.target.value as any })}
                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="rounded">Rounded Corners</option>
                        <option value="square">Square Corners</option>
                        <option value="pill">Pill Shape</option>
                    </select>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Style applied to submit buttons</p>
                </div>

                {/* Input Border Style */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Input Border Style
                    </label>
                    <select
                        value={settings.inputBorderStyle || 'rounded'}
                        onChange={(e) => updateSettings({ inputBorderStyle: e.target.value as any })}
                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="rounded">Rounded Corners</option>
                        <option value="square">Square Corners</option>
                        <option value="pill">Pill Shape</option>
                    </select>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Style applied to form inputs</p>
                </div>

            </div>
        </div>
    );
};