import React from 'react';
import type { FormSettings } from '../../types';

interface FormSettingsPanelProps {
    settings: FormSettings;
    updateSettings: (settings: Partial<FormSettings>) => void;
}

export const FormSettingsPanel: React.FC<FormSettingsPanelProps> = ({ settings, updateSettings }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Form Title
                </label>
                <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Description
                </label>
                <textarea
                    value={settings.description || ''}
                    onChange={(e) => updateSettings({ description: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                    rows={4}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Submit Button Text
                </label>
                <input
                    type="text"
                    value={settings.submitButtonText}
                    onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                />
            </div>

            {/* Primary Color Control */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Primary Color
                </label>
                <div className="relative inline-block">
                    <div
                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                        style={{
                            backgroundColor: settings.primaryColor || '#3b82f6'
                        }}
                        onClick={() => {
                            // Create a color input element and trigger click
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.value = settings.primaryColor || '#3b82f6';
                            colorInput.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                updateSettings({ primaryColor: target.value });
                            };
                            colorInput.click();
                        }}
                    >
                        {!settings.primaryColor && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                            </svg>
                        )}
                    </div>
                    {settings.primaryColor && (
                        <button
                            onClick={() => updateSettings({ primaryColor: undefined })}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                            title="Remove primary color"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Form Background Color Control */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Form Background
                </label>
                <div className="relative inline-block">
                    <div
                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                        style={{
                            backgroundColor: settings.formBackground || '#ffffff'
                        }}
                        onClick={() => {
                            // Create a color input element and trigger click
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.value = settings.formBackground || '#ffffff';
                            colorInput.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                updateSettings({ formBackground: target.value });
                            };
                            colorInput.click();
                        }}
                    >
                        {!settings.formBackground && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2" />
                            </svg>
                        )}
                    </div>
                    {settings.formBackground && (
                        <button
                            onClick={() => updateSettings({ formBackground: undefined })}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                            title="Remove form background"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
