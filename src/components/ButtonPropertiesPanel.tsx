import React from 'react';
import type { FormElement } from '../types';
import { LayoutPanel } from './LayoutPanel';

interface ButtonPropertiesPanelProps {
    buttonElement: FormElement;
    updateButtonProperty: (property: string, value: any) => void;
    isMenuItemButton?: boolean;
    menuItemIndex?: number;
}

export const ButtonPropertiesPanel: React.FC<ButtonPropertiesPanelProps> = ({ 
    buttonElement, 
    updateButtonProperty, 
    isMenuItemButton = false, 
    menuItemIndex 
}) => {
    return (
        <div className="space-y-4">
            {isMenuItemButton && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                        Editing Menu Item {(menuItemIndex || 0) + 1}: "{buttonElement.buttonText}"
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Configure button properties for this menu item
                    </p>
                </div>
            )}
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Button Text
                </label>
                <input
                    type="text"
                    value={buttonElement.buttonText || ''}
                    onChange={(e) => updateButtonProperty('buttonText', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    placeholder="Button text"
                />
            </div>
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Button Type
                </label>
                <select
                    value={buttonElement.buttonType || 'button'}
                    onChange={(e) => updateButtonProperty('buttonType', e.target.value as 'button' | 'submit' | 'reset')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                >
                    <option value="button">Button</option>
                    <option value="submit">Submit</option>
                    <option value="reset">Reset</option>
                </select>
            </div>
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Button Style
                </label>
                <select
                    value={buttonElement.buttonStyle || 'primary'}
                    onChange={(e) => updateButtonProperty('buttonStyle', e.target.value as 'primary' | 'secondary' | 'outline' | 'text')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="text">Text</option>
                </select>
            </div>
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Button Size
                </label>
                <select
                    value={buttonElement.buttonSize || 'md'}
                    onChange={(e) => updateButtonProperty('buttonSize', e.target.value as 'sm' | 'md' | 'lg')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
            </div>
            
            {buttonElement.buttonType === 'submit' && (
                <>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            URL
                        </label>
                        <input
                            type="url"
                            value={buttonElement.buttonUrl || ''}
                            onChange={(e) => updateButtonProperty('buttonUrl', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Target
                        </label>
                        <select
                            value={buttonElement.buttonTarget || '_self'}
                            onChange={(e) => updateButtonProperty('buttonTarget', e.target.value as '_blank' | '_self')}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="_self">Same Tab</option>
                            <option value="_blank">New Tab</option>
                        </select>
                    </div>
                </>
            )}
            
            {/* Background Color Control */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Background Color
                </label>
                <div className="relative inline-block">
                    <div 
                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                        style={{
                            backgroundColor: buttonElement.backgroundColor || '#ffffff'
                        }}
                        onClick={() => {
                            // Create a color input element and trigger click
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.value = buttonElement.backgroundColor || '#ffffff';
                            colorInput.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                updateButtonProperty('backgroundColor', target.value);
                            };
                            colorInput.click();
                        }}
                    >
                        {!buttonElement.backgroundColor && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2"/>
                            </svg>
                        )}
                    </div>
                    {buttonElement.backgroundColor && (
                        <button
                            onClick={() => updateButtonProperty('backgroundColor', undefined)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                            title="Remove background color"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            
            {/* Text Color Control */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Text Color
                </label>
                <div className="relative inline-block">
                    <div 
                        className="w-12 h-12 rounded-lg border border-slate-200 relative overflow-hidden cursor-pointer"
                        style={{
                            backgroundColor: buttonElement.textColor || '#000000'
                        }}
                        onClick={() => {
                            // Create a color input element and trigger click
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.value = buttonElement.textColor || '#000000';
                            colorInput.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                updateButtonProperty('textColor', target.value);
                            };
                            colorInput.click();
                        }}
                    >
                        {!buttonElement.textColor && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                <path d="M6 42L42 6" stroke="#ef4444" strokeWidth="2"/>
                            </svg>
                        )}
                    </div>
                    {buttonElement.textColor && (
                        <button
                            onClick={() => updateButtonProperty('textColor', undefined)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                            title="Remove text color"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            
            {/* Layout Panel */}
            <LayoutPanel 
                selectedElement={buttonElement} 
                updateElement={updateButtonProperty} 
            />
        </div>
    );
};