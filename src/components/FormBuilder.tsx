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
import { Canvas } from './Canvas';
import { SidePanel } from './SidePanel';
import { useStore } from '../store/useStore';
import type { FormElementType, FormElement } from '../types';
import { clsx } from 'clsx';
import { Eye, Share2, ArrowLeft, Save, FileText, Mail, Globe, Edit2, Image as ImageIcon } from 'lucide-react';
import { Preview } from './Preview';
import { ImageGallery } from './ImageGallery';
import { DarkModeToggle } from './DarkModeToggle';

export const FormBuilder: React.FC = () => {
    const {
        elements,
        addElement,
        addElementAtStart,
        reorderElements,
        moveElementToContainer,
        moveElementToColumnPosition,
        moveElementToRowPosition,
        insertElementBefore,
        insertElementAfter,
        addElementBefore,
        addElementAfter,
        addElementToColumnPosition,
        removeElementFromContainer,
        updateElement,
        settings,
        currentProject,
        saveCurrentProject,
        clearCurrentProject,
        updateProjectName,
        addElementFromBlock
    } = useStore();

    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState(currentProject?.name || '');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Update editing name and last saved when current project changes
    React.useEffect(() => {
        if (!isEditingName) { // Only update if not currently editing
            setEditingName(currentProject?.name || '');
        }
        if (currentProject?.updatedAt) {
            setLastSaved(new Date(currentProject.updatedAt));
        }
    }, [currentProject, isEditingName]);

    // Auto-save when elements or settings change (but not when project name changes)
    React.useEffect(() => {
        if (currentProject) {
            setIsSaving(true);
            const timeoutId = setTimeout(async () => {
                saveCurrentProject();
                setLastSaved(new Date());
                setIsSaving(false);
            }, 1000); // Auto-save after 1 second of inactivity

            return () => {
                clearTimeout(timeoutId);
                setIsSaving(false);
            };
        }
    }, [elements, settings, saveCurrentProject]);

    // Manual save function with feedback
    const handleManualSave = async () => {
        if (currentProject) {
            setIsSaving(true);
            saveCurrentProject();
            setLastSaved(new Date());
            setTimeout(() => setIsSaving(false), 500); // Show saving for half second
        }
    };

    // Helper function to format time ago
    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

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
    const [showImageGallery, setShowImageGallery] = useState(false);

    // State to track original position for drag cancellation
    const [dragStartSnapshot, setDragStartSnapshot] = useState<{
        elements: FormElement[];
        draggedElementId: string;
    } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Even smaller distance for better responsiveness
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        console.log('Drag start triggered:', {
            activeId: active.id,
            activeData: active.data.current,
            isSidebar: active.data.current?.isSidebar,
            element: active.data.current?.element
        });

        if (active.data.current?.isSidebar) {
            setActiveDragType(active.data.current.type as FormElementType);
            setDragStartSnapshot(null); // Clear snapshot for sidebar items
        } else {
            // For existing components (any drag that's not from sidebar), capture the current state
            const currentElements = useStore.getState().elements;
            setDragStartSnapshot({
                elements: JSON.parse(JSON.stringify(currentElements)), // Deep copy
                draggedElementId: active.id as string
            });
            console.log('Captured drag start snapshot for element:', active.id);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragType(null);

        if (!over) {
            console.log('No drop target found - drag operation cancelled');

            // If we have a drag start snapshot for an existing component, restore it
            if (dragStartSnapshot) {
                console.log('Restoring element position from snapshot for element:', dragStartSnapshot.draggedElementId);
                reorderElements(dragStartSnapshot.elements);
            }

            // Clear the snapshot
            setDragStartSnapshot(null);
            return;
        }

        console.log('=== DRAG END DEBUG ===');
        console.log('Drop target ID:', over.id);
        console.log('Drop target data:', over.data.current);
        console.log('Active item data:', active.data.current);
        console.log('Is sidebar item:', active.data.current?.isSidebar);
        console.log('Has element:', !!active.data.current?.element);
        console.log('Target type:', over.data.current?.type);
        console.log('Column index:', over.data.current?.columnIndex);
        console.log('===================');

        // Dropping a sidebar item into the canvas
        if (active.data.current?.isSidebar && (over.id === 'canvas' || over.id === 'canvas-end' || over.id === 'canvas-start')) {
            const type = active.data.current.type as FormElementType;

            if (over.id === 'canvas-start') {
                // Use the dedicated function to add at start

                addElementAtStart(type);
            } else {
                // Regular canvas or canvas-end drops

                addElement(type);
            }
            return;
        }

        // Dropping a custom block into the canvas
        if (active.data.current?.type === 'custom-block' && (over.id === 'canvas' || over.id === 'canvas-end' || over.id === 'canvas-start')) {
            const block = active.data.current.block as FormElement;
            addElementFromBlock(block);
            return;
        }

        // Dropping a sidebar item on drop zones (before/after existing elements)
        if (active.data.current?.isSidebar && (over.id.toString().startsWith('drop-before-') || over.id.toString().startsWith('drop-after-'))) {
            const type = active.data.current.type as FormElementType;
            const targetElement = over.data.current?.element;
            const targetParentId = over.data.current?.parentId;
            const insertPosition = over.data.current?.insertPosition;

            console.log('Dropping sidebar item on drop zone:', {
                type,
                targetElementId: targetElement?.id,
                targetParentId,
                insertPosition
            });

            if (targetElement) {
                if (insertPosition === 'before') {
                    console.log('Adding sidebar element before target');
                    addElementBefore(type, targetElement.id, targetParentId);
                } else if (insertPosition === 'after') {
                    console.log('Adding sidebar element after target');
                    addElementAfter(type, targetElement.id, targetParentId);
                }
                return;
            }
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
            const columnIndex = over.data.current.columnIndex;

            if (columnIndex !== undefined) {
                // Use the dedicated function for adding to specific column position
                addElementToColumnPosition(type, containerId, columnIndex);
            } else {
                // Fallback to general add
                addElement(type, containerId);
            }
            return;
        }

        // Dropping a sidebar item into rows
        if (active.data.current?.isSidebar && over.data.current?.type === 'rows') {
            const type = active.data.current.type as FormElementType;
            const containerId = over.data.current.containerId;
            const rowIndex = over.data.current.rowIndex;

            if (rowIndex !== undefined) {
                // Add to container first, then move to specific row position
                addElement(type, containerId);

                // Get the newly added element and move it to the correct row position
                setTimeout(() => {
                    const state = useStore.getState();
                    const container = state.elements.find(el => el.id === containerId);
                    if (container && container.children && container.children.length > 0) {
                        // Find the last element (the one we just added)
                        const lastElement = container.children[container.children.length - 1];
                        if (lastElement) {
                            moveElementToRowPosition(lastElement.id, containerId, rowIndex);
                        }
                    }
                }, 0);
            } else {
                // Fallback to general add
                addElement(type, containerId);
            }
            return;
        }

        // Dropping a sidebar item into grid
        if (active.data.current?.isSidebar && over.data.current?.type === 'grid') {
            const type = active.data.current.type as FormElementType;
            const containerId = over.data.current.containerId;
            addElement(type, containerId);
            return;
        }

        // Handle dragging existing components
        if (active.data.current?.element && !active.data.current?.isSidebar) {
            console.log('✓ Handling existing component drag');
            const draggedElement = active.data.current.element;
            const draggedElementId = draggedElement.id;
            const originalParentId = active.data.current.parentId;

            console.log('Component details:', {
                draggedElement: draggedElement.type,
                draggedElementId,
                originalParentId,
                overId: over.id
            });

            // Dropping onto canvas (root level) - check this FIRST
            if (over.id === 'canvas' || over.id === 'canvas-end' || over.id === 'canvas-start') {
                console.log('✓ Canvas drop detected:', { draggedElementId, originalParentId, elementType: draggedElement.type });

                if (originalParentId) {
                    console.log('Moving from container to root');
                    // Create a copy of the element for root level with full width
                    const elementToAdd = { ...draggedElement, width: 12 };

                    // Remove from container first
                    removeElementFromContainer(draggedElementId, originalParentId);

                    // Add to root level
                    const state = useStore.getState();
                    const currentElements = [...state.elements];

                    if (over.id === 'canvas-end') {
                        // Add to end
                        currentElements.push(elementToAdd);
                    } else if (over.id === 'canvas-start') {
                        // Add to beginning
                        currentElements.unshift(elementToAdd);
                    } else {
                        // Add to end by default for now
                        currentElements.push(elementToAdd);
                    }

                    reorderElements(currentElements);
                } else {
                    console.log('Element already at root level');
                    // If dropping on canvas-start/end and element is already at root, move to start/end
                    if (over.id === 'canvas-end' || over.id === 'canvas-start') {
                        const state = useStore.getState();
                        const currentElements = [...state.elements];
                        const elementIndex = currentElements.findIndex(el => el.id === draggedElementId);

                        if (elementIndex !== -1) {
                            const [elementToMove] = currentElements.splice(elementIndex, 1);
                            if (over.id === 'canvas-start') {
                                currentElements.unshift(elementToMove);
                            } else {
                                currentElements.push(elementToMove);
                            }
                            reorderElements(currentElements);
                        }
                    }
                }
                return;
            }

            // Dropping into a column cell
            if (over.data.current?.type === 'columns') {
                console.log('✓ Dropping into column cell', {
                    containerId: over.data.current.containerId,
                    columnIndex: over.data.current.columnIndex
                });

                if (over.data.current.columnIndex !== undefined) {
                    // Drop into specific column position
                    moveElementToColumnPosition(draggedElementId, over.data.current.containerId, over.data.current.columnIndex);
                } else {
                    // Fallback to general container move
                    moveElementToContainer(draggedElementId, over.data.current.containerId);
                }
                return;
            }

            // Dropping into a row cell
            if (over.data.current?.type === 'rows') {
                console.log('✓ Dropping into row cell', {
                    containerId: over.data.current.containerId,
                    rowIndex: over.data.current.rowIndex
                });

                if (over.data.current.rowIndex !== undefined) {
                    // Drop into specific row position
                    moveElementToRowPosition(draggedElementId, over.data.current.containerId, over.data.current.rowIndex);
                } else {
                    // Fallback to general container move
                    moveElementToContainer(draggedElementId, over.data.current.containerId);
                }
                return;
            }

            // Dropping into other containers
            if (over.data.current?.type === 'container' || over.data.current?.type === 'grid') {
                console.log('✓ Dropping into container');
                moveElementToContainer(draggedElementId, over.data.current.containerId);
                return;
            }

            // Handle dropping on drop zones (elements with "drop-before-" or "drop-after-" prefix)
            if (over.id.toString().startsWith('drop-before-') || over.id.toString().startsWith('drop-after-')) {
                console.log('✓ Dropping on drop zone:', over.id);
                const targetElement = over.data.current?.element;
                const targetParentId = over.data.current?.parentId;
                const insertPosition = over.data.current?.insertPosition;

                console.log('Dropping on drop zone:', {
                    targetElementId: targetElement?.id,
                    targetParentId,
                    insertPosition
                });

                if (targetElement && targetElement.type !== 'columns') {
                    if (insertPosition === 'before') {
                        console.log('Inserting element before target');
                        insertElementBefore(draggedElementId, targetElement.id, targetParentId);
                    } else if (insertPosition === 'after') {
                        console.log('Inserting element after target');
                        insertElementAfter(draggedElementId, targetElement.id, targetParentId);
                    }
                    return;
                }
            }

            // Dropping after another element (non-column) - legacy support
            if (over.data.current?.element && over.data.current?.element.type !== 'columns') {
                console.log('✓ Legacy drop on element');
                const targetElement = over.data.current.element;
                const targetParentId = over.data.current?.parentId;

                // Insert after the target element using the new function
                console.log('Legacy: Inserting element after target:', {
                    draggedElementId,
                    targetElementId: targetElement.id,
                    targetParentId
                });
                insertElementBefore(draggedElementId, targetElement.id, targetParentId);
                return;
            }

            console.log('⚠️ No drop condition matched for existing component');

            // If we have a snapshot and no condition was matched, restore the original state
            if (dragStartSnapshot) {
                console.log('No valid drop target found, restoring original state');
                reorderElements(dragStartSnapshot.elements);
            }
        } else {
            console.log('⚠️ Not handling this drag type:', {
                hasElement: !!active.data.current?.element,
                isSidebar: active.data.current?.isSidebar
            });
        }

        // Reordering logic (legacy)
        if (!active.data.current?.isSidebar && !active.data.current?.element) {
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

        // Clear the drag start snapshot after successful operations
        setDragStartSnapshot(null);
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
        <>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={clsx(
                    "h-screen flex flex-col",
                    settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                )}>
                    {/* Header Bar */}
                    <div className={clsx(
                        "border-b px-6 py-4 flex items-center justify-between shadow-sm",
                        settings.theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-slate-200'
                    )}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearCurrentProject}
                                className={clsx(
                                    "p-2 rounded-lg transition-colors",
                                    settings.theme === 'dark'
                                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                )}
                                title="Back to projects"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                {currentProject?.type === 'form' && <FileText className="w-4 h-4 text-white" />}
                                {currentProject?.type === 'email' && <Mail className="w-4 h-4 text-white" />}
                                {currentProject?.type === 'website' && <Globe className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    {isEditingName ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onBlur={() => {
                                                if (editingName.trim()) {
                                                    updateProjectName(editingName.trim());
                                                    setLastSaved(new Date());
                                                } else {
                                                    setEditingName(currentProject?.name || '');
                                                }
                                                setIsEditingName(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (editingName.trim()) {
                                                        updateProjectName(editingName.trim());
                                                        setLastSaved(new Date());
                                                    } else {
                                                        setEditingName(currentProject?.name || '');
                                                    }
                                                    setIsEditingName(false);
                                                }
                                                if (e.key === 'Escape') {
                                                    setEditingName(currentProject?.name || '');
                                                    setIsEditingName(false);
                                                }
                                            }}
                                            className={clsx(
                                                "text-lg font-semibold bg-transparent border rounded px-2 py-1 min-w-0",
                                                settings.theme === 'dark' ? "text-gray-100 border-gray-600" : "text-slate-900 border-gray-300"
                                            )}
                                            autoFocus
                                        />
                                    ) : (
                                        <h1
                                            className={clsx(
                                                "text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                                                settings.theme === 'dark' ? 'text-gray-100' : 'text-slate-900'
                                            )}
                                            onClick={() => {
                                                setEditingName(currentProject?.name || '');
                                                setIsEditingName(true);
                                            }}
                                            title="Click to edit project name"
                                        >
                                            {currentProject?.name || 'Untitled Project'}
                                        </h1>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditingName(currentProject?.name || '');
                                            setIsEditingName(true);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                        title="Edit project name"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                                <div className={clsx("flex items-center gap-1 text-xs", settings.theme === 'dark' ? "text-gray-400" : "text-slate-500")}>
                                    <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    {isSaving ? 'Saving...' : lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Not saved'} •
                                    {currentProject?.type ? (currentProject.type.charAt(0).toUpperCase() + currentProject.type.slice(1)) : 'Project'} •
                                    {elements.length} elements
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleManualSave}
                                disabled={isSaving}
                                className={clsx(
                                    "btn flex items-center gap-2",
                                    settings.theme === 'dark'
                                        ? "bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800"
                                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <DarkModeToggle variant="button" size="md" showLabel />
                            <button
                                onClick={() => setShowImageGallery(true)}
                                className={clsx(
                                    "btn flex items-center gap-2",
                                    settings.theme === 'dark'
                                        ? "bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <ImageIcon size={16} />
                                Gallery
                            </button>
                            <button
                                onClick={() => setIsPreviewMode(true)}
                                className={clsx(
                                    "btn flex items-center gap-2",
                                    settings.theme === 'dark'
                                        ? "bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                                )}
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

                    {/* Main 2-panel layout */}
                    <div className="flex flex-1 min-h-0">
                        <div className="flex-1 overflow-hidden">
                            <Canvas />
                        </div>
                        <SidePanel />
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

            {/* Image Gallery Modal - Outside DndContext to avoid conflicts */}
            <ImageGallery
                isOpen={showImageGallery}
                onClose={() => setShowImageGallery(false)}
                mode="manage"
            />
        </>
    );
};