import React from 'react';
import { useForm } from 'react-hook-form';
import { Info } from 'lucide-react';
import { clsx } from 'clsx';
import type { FormElement, FormSettings } from '../types';
import { useStore } from '../store/useStore';
import { getComponentHtml } from '../utils/componentHtml';

interface RendererProps {
    elements?: FormElement[];
    settings?: FormSettings;
    onSubmit?: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export const Renderer: React.FC<RendererProps> = ({
    elements: propElements,
    settings: propSettings,
    onSubmit,
    isLoading = false
}) => {
    const { currentProject, elements: storeElements, settings: storeSettings } = useStore();
    
    const elements = propElements || storeElements || [];
    const settings = propSettings || storeSettings || {
        title: 'Form',
        submitButtonText: 'Submit',
        primaryColor: '#3B82F6',
        buttonStyle: 'rounded',
        inputBorderStyle: 'rounded',
        submissionActions: []
    };
    
    const isFormProject = currentProject?.type === 'form';
    const { register, handleSubmit } = useForm();

    const onFormSubmit = async (data: any) => {
        if (onSubmit) {
            await onSubmit(data);
        }
    };

    // Use the centralized getComponentHtml function for consistent rendering
    const renderElement = (element: FormElement, parentId?: string): JSX.Element | null => {
        if (!element) return null;
        
        return getComponentHtml(element, {
            isFormProject,
            isSelected: false,
            parentId,
            showInteractiveElements: true, // Renderer should be interactive for forms
            register // Pass react-hook-form register function
        });
    };

    // Render hidden fields for forms
    const renderHiddenField = (element: FormElement): JSX.Element => {
        return (
            <input
                key={element.id}
                type="hidden"
                {...register(element.id)}
                value={element.value || ''}
            />
        );
    };

    // Main wrapper - exactly matching Canvas structure but with form functionality
    const content = (
        <div
            className={clsx(
                "min-h-[800px] bg-white rounded-2xl shadow-card px-8 pb-8",
                currentProject?.type !== 'form' && "pt-0",
                currentProject?.type === 'form' && "pt-8",
                elements.length === 0 && "form-builder-canvas-empty flex items-center justify-center"
            )}
            style={{
                backgroundColor: settings.formBackground || '#ffffff',
                width: settings.contentWidth ? `${settings.contentWidth}px` : '100%',
                maxWidth: settings.contentWidth ? `${settings.contentWidth}px` : 'none'
            }}
        >
            {elements.length === 0 ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-600 mb-3">No Content</h3>
                    <p className="text-slate-500 max-w-md leading-relaxed mx-auto">
                        Add elements to see the preview
                    </p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {/* Start drop zone spacing - only for form projects (matches Canvas) */}
                    {isFormProject && <div className="h-16" />}
                    
                    {/* Hidden fields */}
                    {elements.filter(el => el.type === 'hidden').map((element) => renderHiddenField(element))}

                    {/* Visible elements - exactly like Canvas: sequential rendering */}
                    {elements.filter(el => el.type !== 'hidden').map((element) =>
                        renderElement(element)
                    )}

                    {/* End drop zone spacing (matches Canvas) */}
                    <div className="h-16" />

                    {/* Submit button for form projects */}
                    {isFormProject && (
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                                    style={{
                                        backgroundColor: settings.primaryColor || '#3B82F6',
                                        borderColor: settings.primaryColor || '#3B82F6',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    {isLoading ? 'Processing...' : settings.submitButtonText}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );

    // Use exact Canvas wrapper structure
    return (
        <div className="form-builder-canvas">
            <div 
                className="form-builder-canvas-inner"
                style={{
                    display: 'flex',
                    justifyContent: settings.contentAlignment === 'center' ? 'center' : 
                                   settings.contentAlignment === 'right' ? 'flex-end' : 'flex-start'
                }}
            >
                {content}
            </div>
        </div>
    );
};