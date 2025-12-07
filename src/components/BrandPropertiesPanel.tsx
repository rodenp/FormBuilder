import React from 'react';
import { useStore } from '../store/useStore';
import { Palette } from 'lucide-react';

export const BrandPropertiesPanel: React.FC = () => {
    const { settings, updateSettings } = useStore();

    return (
        <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gray-100 rounded">
                        <Palette size={16} className="text-gray-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                </div>

                {/* Primary Color */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Primary Color
                    </label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="color"
                            value={settings.primaryColor || '#3B82F6'}
                            onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                            className="w-12 h-12 border border-slate-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={settings.primaryColor || '#3B82F6'}
                                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Used for buttons, focus states, and accents</p>
                </div>
                
                {/* Button Style */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Button Style
                    </label>
                    <select
                        value={settings.buttonStyle || 'rounded'}
                        onChange={(e) => updateSettings({ buttonStyle: e.target.value as any })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="rounded">Rounded Corners</option>
                        <option value="square">Square Corners</option>
                        <option value="pill">Pill Shape</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Style applied to submit buttons</p>
                </div>

                {/* Input Border Style */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Input Border Style
                    </label>
                    <select
                        value={settings.inputBorderStyle || 'rounded'}
                        onChange={(e) => updateSettings({ inputBorderStyle: e.target.value as any })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="rounded">Rounded Corners</option>
                        <option value="square">Square Corners</option>
                        <option value="pill">Pill Shape</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Style applied to form inputs</p>
                </div>

            </div>
        </div>
    );
};