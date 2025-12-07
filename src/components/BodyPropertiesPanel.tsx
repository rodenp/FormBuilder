import React from 'react';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const BodyPropertiesPanel: React.FC = () => {
    const { settings, updateSettings } = useStore();

    return (
        <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
                {/* General Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">General</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* Text Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Text Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.textColor || '#000000'}
                                onChange={(e) => updateSettings({ textColor: e.target.value })}
                                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            />
                            <button
                                onClick={() => updateSettings({ textColor: undefined })}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-500 text-xs"
                                title="Reset"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Background Color</label>
                        <div className="flex items-center gap-2">
                            {settings.formBackground ? (
                                // Show color picker if background color is set
                                <input
                                    type="color"
                                    value={settings.formBackground}
                                    onChange={(e) => updateSettings({ formBackground: e.target.value })}
                                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                />
                            ) : (
                                // Show transparent icon if no background color is set
                                <div 
                                    className="w-8 h-8 bg-white rounded border border-gray-300 relative overflow-hidden cursor-pointer"
                                    onClick={() => {
                                        const colorInput = document.createElement('input');
                                        colorInput.type = 'color';
                                        colorInput.value = '#ffffff';
                                        colorInput.onchange = (e) => {
                                            const target = e.target as HTMLInputElement;
                                            updateSettings({ formBackground: target.value });
                                        };
                                        colorInput.click();
                                    }}
                                    title="Set background color"
                                >
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                                        <path d="M4 28L28 4" stroke="#ef4444" strokeWidth="2"/>
                                    </svg>
                                </div>
                            )}
                            <button
                                onClick={() => updateSettings({ formBackground: undefined })}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-500 text-xs"
                                title="Remove background color"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Content Width */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Content Width</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={settings.contentWidth || 700}
                                onChange={(e) => updateSettings({ contentWidth: parseInt(e.target.value) })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="700"
                            />
                            <span className="text-sm text-gray-500">px</span>
                            <button className="p-2 border border-gray-300 rounded text-gray-400 hover:text-gray-600">−</button>
                            <button className="p-2 border border-gray-300 rounded text-gray-400 hover:text-gray-600">+</button>
                        </div>
                    </div>

                    {/* Content Alignment */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Content Alignment</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => updateSettings({ contentAlignment: 'left' })}
                                className={`flex-1 p-2 border rounded text-xs ${
                                    (settings.contentAlignment || 'center') === 'left' 
                                        ? 'bg-gray-900 text-white border-gray-900' 
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                    <path d="M3 6h18v2H3zm0 5h12v2H3zm0 5h18v2H3z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => updateSettings({ contentAlignment: 'center' })}
                                className={`flex-1 p-2 border rounded text-xs ${
                                    (settings.contentAlignment || 'center') === 'center' 
                                        ? 'bg-gray-900 text-white border-gray-900' 
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                    <path d="M3 6h18v2H3zm3 5h12v2H6zm-3 5h18v2H3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Font Family</label>
                        <select
                            value={settings.fontFamily || 'Helvetica'}
                            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
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
                        <label className="block text-sm text-gray-700 mb-2">Font Weight</label>
                        <select
                            value={settings.fontWeight || 'Regular'}
                            onChange={(e) => updateSettings({ fontWeight: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
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
                            <div className="p-1.5 bg-gray-100 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Email Settings</h3>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>

                {/* Links Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                    <path d="M10 13A5 5 0 0 0 7.54 7.54L4.93 4.93A10 10 0 0 0 4.93 19.07A10 10 0 0 0 19.07 4.93L16.46 7.54A5 5 0 0 0 13 10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M14 11A5 5 0 0 0 16.46 16.46L19.07 19.07A10 10 0 0 0 19.07 4.93A10 10 0 0 0 4.93 19.07L7.54 16.46A5 5 0 0 0 11 14" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Links</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* Link Color */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Color</label>
                        <input
                            type="color"
                            value={settings.linkColor || '#3B82F6'}
                            onChange={(e) => updateSettings({ linkColor: e.target.value })}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                    </div>

                    {/* Link Underline */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">Underline</label>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateSettings({ linkUnderline: !settings.linkUnderline })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${
                                    settings.linkUnderline ? 'bg-gray-900' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                    settings.linkUnderline ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                                {settings.linkUnderline && (
                                    <div className="absolute left-1.5 top-1.5 w-2 h-2">
                                        <svg viewBox="0 0 12 12" fill="currentColor" className="w-full h-full text-white">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
                            <div className="p-1.5 bg-gray-100 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 14V18" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Accessibility</h3>
                        </div>
                        <ChevronUp size={16} className="text-gray-400" />
                    </div>

                    {/* HTML Title */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">HTML Title</label>
                        <input
                            type="text"
                            value={settings.htmlTitle || ''}
                            onChange={(e) => updateSettings({ htmlTitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter HTML title"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Sets the HTML &lt;title&gt; tag in the exported HTML.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};