
import React from 'react';
import { Plus, Trash, GripVertical, AlignLeft, AlignCenter, AlignRight, StretchHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { FormElement } from '../../../../types';

const PLATFORMS = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'website', label: 'Website' },
    { value: 'email', label: 'Email' }
];

const ALIGNMENT_OPTIONS = [
    { value: 'flex-start', label: 'Left', icon: AlignLeft },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'flex-end', label: 'Right', icon: AlignRight },
    { value: 'space-between', label: 'Space Between', icon: StretchHorizontal }
];

export const SocialProperties: React.FC<{
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}> = ({ element, updateElement }) => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(true);

    const updateLink = (index: number, field: string, value: string) => {
        const newLinks = [...(element.socialLinks || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };

        // Auto-update icon if platform changes
        if (field === 'platform') {
            newLinks[index].icon = value;
        }
        updateElement(element.id, { socialLinks: newLinks });
    };

    const addLink = () => {
        const newLinks = [...(element.socialLinks || []), { platform: 'website', url: 'https://', icon: 'website' }];
        updateElement(element.id, { socialLinks: newLinks });
    };

    const removeLink = (index: number) => {
        const newLinks = (element.socialLinks || []).filter((_, i) => i !== index);
        updateElement(element.id, { socialLinks: newLinks });
    };

    return (
        <div className="space-y-6">
            {/* Social Media Settings Collapsible */}
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        Social Media Settings
                    </span>
                    {isSettingsOpen ? (
                        <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                    )}
                </button>

                {isSettingsOpen && (
                    <div className="p-4 space-y-3 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={addLink}
                                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2 py-1 rounded transition-colors"
                            >
                                <Plus size={14} />
                                Add Link
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(element.socialLinks || []).map((link, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-3 group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GripVertical size={14} className="text-slate-300 dark:text-gray-600 cursor-move" />
                                        <div className="flex-1">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                                                className="w-full text-sm bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-gray-200"
                                            >
                                                {PLATFORMS.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => removeLink(index)}
                                            className="text-slate-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                                            title="Remove link"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                                        placeholder="https://"
                                        className="w-full text-sm bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded px-2 py-1 placeholder:text-slate-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-gray-200"
                                    />
                                </div>
                            ))}

                            {(!element.socialLinks || element.socialLinks.length === 0) && (
                                <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-lg text-slate-400 dark:text-gray-500 text-sm">
                                    No links added yet
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-slate-100 dark:border-gray-700" />

            {/* Styling Section */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Icon Styling
                </label>

                {/* Alignment */}
                <div className="mb-4">
                    <label className="block text-xs text-slate-400 dark:text-gray-500 mb-1">Alignment</label>
                    <div className="flex bg-slate-100 dark:bg-gray-800 p-1 rounded-lg">
                        {ALIGNMENT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateElement(element.id, { justifyContent: option.value as any })}
                                className={clsx(
                                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                                    (element.justifyContent || 'center') === option.value
                                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                        : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-gray-700"
                                )}
                                title={option.label}
                            >
                                <option.icon size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Button Style */}
                    <div>
                        <label className="block text-xs text-slate-400 dark:text-gray-500 mb-1">Button Style</label>
                        <select
                            value={element.buttonStyle || 'text'}
                            onChange={(e) => updateElement(element.id, { buttonStyle: e.target.value as any })}
                            className="w-full text-sm bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-gray-200"
                        >
                            <option value="text">Icon Only</option>
                            <option value="outline">Outline</option>
                            <option value="primary">Solid</option>
                        </select>
                    </div>

                    {/* Icon Size */}
                    <div>
                        <label className="block text-xs text-slate-400 dark:text-gray-500 mb-1">Size ({element.fontSize || 24}px)</label>
                        <input
                            type="range"
                            min="16"
                            max="48"
                            step="4"
                            value={element.fontSize || 24}
                            onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
