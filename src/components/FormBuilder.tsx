import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    type DragStartEvent,
    type DragEndEvent,
    defaultDropAnimationSideEffects,
    type DropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useStore } from '../store/useStore';
import type { FormElementType, FormElement } from '../types';
import { Eye, Layout, Share2, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Preview } from './Preview';

export const FormBuilder: React.FC = () => {
    const { elements, addElement, reorderElements, moveElementToContainer, updateElement, settings } = useStore();
    
    // Helper function to find element recursively
    const findElementById = (elements: FormElement[], id: string): FormElement | undefined => {
        for (const element of elements) {
            if (element.id === id) {
                return element;
            }
            if (element.children) {
                const found = findElementById(element.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    // Helper function to find parent container of an element
    const findParentContainer = (elements: FormElement[], targetId: string): FormElement | undefined => {
        for (const element of elements) {
            if (element.children) {
                // Check if target is a direct child of this element
                if (element.children.some(child => child.id === targetId)) {
                    return element;
                }
                // Recursively search in nested containers
                const found = findParentContainer(element.children, targetId);
                if (found) return found;
            }
        }
        return undefined; // Element is at root level
    };
    const [activeDragType, setActiveDragType] = useState<FormElementType | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Reduced distance for more responsive drag
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.isSidebar) {
            setActiveDragType(active.data.current.type as FormElementType);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragType(null);

        if (!over) return;

        // Dropping a sidebar item into the canvas
        if (active.data.current?.isSidebar && over.id === 'canvas') {
            const type = active.data.current.type as FormElementType;
            addElement(type);
            return;
        }

        // Dropping a sidebar item into a container
        if (active.data.current?.isSidebar && over.data.current?.type === 'container') {
            const type = active.data.current.type as FormElementType;
            const containerId = over.data.current.containerId;
            addElement(type, containerId);
            return;
        }

        // Dropping a sidebar item into columns
        if (active.data.current?.isSidebar && over.data.current?.type === 'columns') {
            const type = active.data.current.type as FormElementType;
            const containerId = over.data.current.containerId;
            addElement(type, containerId);
            return;
        }

        // Reordering logic
        if (!active.data.current?.isSidebar) {
            const activeId = active.id as string;
            const overId = over.id as string;

            if (activeId !== overId) {
                const activeElement = findElementById(elements, activeId);
                const overElement = findElementById(elements, overId);

                if (activeElement && overElement) {
                    // Check if both elements are in the same container
                    const activeParent = findParentContainer(elements, activeId);
                    const overParent = findParentContainer(elements, overId);

                    // Moving into a container
                    if (over.data.current?.type === 'container' && activeId !== over.data.current.containerId) {
                        moveElementToContainer(activeId, over.data.current.containerId);
                    } 
                    // Moving into columns
                    else if (over.data.current?.type === 'columns' && activeId !== over.data.current.containerId) {
                        moveElementToContainer(activeId, over.data.current.containerId);
                    }
                    // Both elements in same parent (or both at root)
                    else if (activeParent === overParent) {
                        if (activeParent) {
                            // Reordering within a container
                            const containerChildren = activeParent.children || [];
                            const oldIndex = containerChildren.findIndex((el) => el.id === activeId);
                            const newIndex = containerChildren.findIndex((el) => el.id === overId);
                            
                            if (oldIndex !== -1 && newIndex !== -1) {
                                const newChildren = arrayMove(containerChildren, oldIndex, newIndex);
                                updateElement(activeParent.id, { children: newChildren });
                            }
                        } else {
                            // Reordering at root level
                            const oldIndex = elements.findIndex((el) => el.id === activeId);
                            const newIndex = elements.findIndex((el) => el.id === overId);
                            
                            if (oldIndex !== -1 && newIndex !== -1) {
                                reorderElements(arrayMove(elements, oldIndex, newIndex));
                            }
                        }
                    }
                }
            }
        }
    };

    const dropAnimation: DropAnimation = {
        duration: 150, // Faster animation
        easing: 'ease-out',
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

    if (isPreviewMode) {
        return (
            <div style={{ height: '100vh', backgroundColor: 'var(--color-slate-50)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--color-slate-200)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-brand-50)', color: 'var(--color-brand-600)', borderRadius: 'var(--radius-lg)' }}>
                            <Eye size={20} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-800)', margin: 0 }}>Preview Mode</h1>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0 }}>Testing your form</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsPreviewMode(false)}
                        className="btn btn-secondary"
                    >
                        Back to Editor
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Preview />
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-screen flex flex-col bg-gray-50">
                {/* Header Bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Layout className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">My Form</h1>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Saved just now
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsPreviewMode(true)}
                            className="btn btn-secondary"
                        >
                            <Eye size={16} />
                            Preview
                        </button>
                        <button className="btn btn-primary">
                            <Share2 size={16} />
                            Publish
                        </button>
                    </div>
                </div>

                {/* Main 3-column grid layout */}
                <div className="grid grid-cols-[360px_1fr_420px] gap-0 h-full">
                    <Sidebar />
                    <Canvas />
                    <PropertiesPanel />
                </div>

                {/* Drag Overlay */}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeDragType ? (
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: 'white', 
                            border: '1px solid var(--color-brand-500)', 
                            borderRadius: 'var(--radius-xl)', 
                            boxShadow: 'var(--shadow-xl)', 
                            width: '256px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px' 
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-brand-500)' }}></div>
                            <span style={{ fontWeight: 600, color: 'var(--color-slate-700)' }}>
                                {activeDragType.charAt(0).toUpperCase() + activeDragType.slice(1)} Component
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};