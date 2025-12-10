import React from 'react';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const BodyPropertiesPanel: React.FC = () => {
    const { settings, updateSettings } = useStore();

    return (
        <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="p-4 space-y-6">
                {/* General Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">General</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* Text Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Text Color</label>
                        <div className="relative inline-block">
                            <div
                                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer overflow-hidden relative"
                                onClick={() => {
                                    const colorInput = document.createElement('input');
                                    colorInput.type = 'color';
                                    colorInput.value = settings.textColor || '#000000';
                                    colorInput.onchange = (e) => {
                                        const target = e.target as HTMLInputElement;
                                        updateSettings({ textColor: target.value });
                                    };
                                    colorInput.click();
                                }}
                                style={{
                                    backgroundColor: settings.textColor || 'transparent'
                                }}
                                title="Click to change text color"
                            >
                                {!settings.textColor && (
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                        <path d="M8 40L40 8" stroke="#ef4444" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                            {settings.textColor && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateSettings({ textColor: undefined });
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    title="Remove text color"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Background Color</label>
                        <div className="relative inline-block">
                            <div
                                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden relative"
                                onClick={() => {
                                    const colorInput = document.createElement('input');
                                    colorInput.type = 'color';
                                    colorInput.value = settings.formBackground || '#ffffff';
                                    colorInput.onchange = (e) => {
                                        const target = e.target as HTMLInputElement;
                                        updateSettings({ formBackground: target.value });
                                    };
                                    colorInput.click();
                                }}
                                style={{
                                    backgroundColor: settings.formBackground || 'transparent'
                                }}
                                title="Click to change background color"
                            >
                                {!settings.formBackground && (
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                        <path d="M8 40L40 8" stroke="#ef4444" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                            {settings.formBackground && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateSettings({ formBackground: undefined });
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    title="Remove background color"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Width */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Content Width</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={settings.contentWidth || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    updateSettings({
                                        contentWidth: value === '' ? undefined : parseInt(value)
                                    });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Auto (device width)"
                                min="1"
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
                        </div>
                    </div>

                    {/* Content Alignment */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Content Alignment</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => updateSettings({ contentAlignment: 'left' })}
                                className={`flex-1 p-2 border rounded text-xs ${(settings.contentAlignment || 'center') === 'left'
                                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                    <path d="M3 6h18v2H3zm0 5h12v2H3zm0 5h18v2H3z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => updateSettings({ contentAlignment: 'center' })}
                                className={`flex-1 p-2 border rounded text-xs ${(settings.contentAlignment || 'center') === 'center'
                                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                    <path d="M3 6h18v2H3zm3 5h12v2H6zm-3 5h18v2H3z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
                        <select
                            value={settings.fontFamily || 'Helvetica'}
                            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="Helvetica">Helvetica</option>
                            <option value="Arial">Arial</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                    </div>

                    {/* Font Weight */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Font Weight</label>
                        <select
                            value={settings.fontWeight || 'Regular'}
                            onChange={(e) => updateSettings({ fontWeight: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="Light">Light</option>
                            <option value="Regular">Regular</option>
                            <option value="Medium">Medium</option>
                            <option value="Bold">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Email Settings Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Settings</h3>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>

                {/* Links Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400">
                                    <path d="M10 13A5 5 0 0 0 7.54 7.54L4.93 4.93A10 10 0 0 0 4.93 19.07A10 10 0 0 0 19.07 4.93L16.46 7.54A5 5 0 0 0 13 10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M14 11A5 5 0 0 0 16.46 16.46L19.07 19.07A10 10 0 0 0 19.07 4.93A10 10 0 0 0 4.93 19.07L7.54 16.46A5 5 0 0 0 11 14" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Links</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* Link Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Color</label>
                        <div className="relative inline-block">
                            <div
                                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden relative"
                                onClick={() => {
                                    const colorInput = document.createElement('input');
                                    colorInput.type = 'color';
                                    colorInput.value = settings.linkColor || '#3B82F6';
                                    colorInput.onchange = (e) => {
                                        const target = e.target as HTMLInputElement;
                                        updateSettings({ linkColor: target.value });
                                    };
                                    colorInput.click();
                                }}
                                style={{
                                    backgroundColor: settings.linkColor || '#3B82F6'
                                }}
                                title="Click to change link color"
                            >
                            </div>
                            {settings.linkColor && settings.linkColor !== '#3B82F6' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateSettings({ linkColor: '#3B82F6' });
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    title="Reset to default color"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Link Underline */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Underline</label>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateSettings({ linkUnderline: !settings.linkUnderline })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.linkUnderline ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white dark:bg-gray-800 rounded-full absolute top-1 transition-transform ${settings.linkUnderline ? 'translate-x-7' : 'translate-x-1'
                                    }`} />
                                {settings.linkUnderline && (
                                    <div className="absolute left-1.5 top-1.5 w-2 h-2">
                                        <svg viewBox="0 0 12 12" fill="currentColor" className="w-full h-full text-white">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Accessibility Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 14V18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Accessibility</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* HTML Title */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">HTML Title</label>
                        <input
                            type="text"
                            value={settings.htmlTitle || ''}
                            onChange={(e) => updateSettings({ htmlTitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Enter HTML title"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sets the HTML &lt;title&gt; tag in the exported HTML.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};