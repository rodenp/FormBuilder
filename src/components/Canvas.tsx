import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store/useStore';
import type { FormElement } from '../types';
import { Trash2, Info, Copy, Star, EyeOff, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface SortableElementProps {
    element: FormElement;
    parentId?: string;
}

const ContainerContent: React.FC<{ element: FormElement }> = ({ element }) => {
    const { setNodeRef } = useDroppable({
        id: `container-${element.id}`,
        data: { type: 'container', containerId: element.id }
    });
    const { selectElement } = useStore();

    return (
        <div
            ref={setNodeRef}
            className="container-content min-h-[120px] border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/30 p-4 hover:border-brand-300 hover:bg-brand-50/20 transition-all"
        >
            {(!element.children || element.children.length === 0) ? (
                <div 
                    className="container-empty-area flex flex-col items-center justify-center h-28 text-slate-400 cursor-pointer"
                >
                    <Plus size={24} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Drop elements here</p>
                    <p className="text-xs">Container is empty</p>
                </div>
            ) : (
                <div className="container-grid space-y-3">
                    {element.children.map((child) => (
                        <SortableElement key={child.id} element={child} parentId={element.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ColumnsContent: React.FC<{ element: FormElement }> = ({ element }) => {
    const [isMobile, setIsMobile] = useState(false);
    const { setNodeRef } = useDroppable({
        id: `columns-${element.id}`,
        data: { type: 'columns', containerId: element.id }
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div
            ref={setNodeRef}
            className="p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[100px]"
        >
            <div className="grid" 
                 style={{
                     gridTemplateColumns: isMobile ? '1fr' : `repeat(${element.columnCount || 2}, 1fr)`,
                     gap: `${(element.gap ?? 4) * 0.25}rem`
                 }}>
                {(!element.children || element.children.length === 0) ? (
                    Array.from({ length: element.columnCount || 2 }).map((_, index) => (
                        <div key={index} className="border-2 border-dashed border-slate-300 rounded p-4 text-center text-slate-400 text-sm min-h-[80px] flex items-center justify-center">
                            Drop element here
                        </div>
                    ))
                ) : (
                    element.children.map((child, index) => (
                        <div key={child.id} className="w-full">
                            <SortableElement element={child} parentId={element.id} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const SortableElement: React.FC<SortableElementProps> = React.memo(({ element, parentId }) => {
    const { selectElement, selectedElementId, removeElement, duplicateElement, updateElement, moveElementUp, moveElementDown, elements } = useStore();
    const isSelected = selectedElementId === element.id;

    // Check if parent is a columns or container component
    const parentInfo = parentId && (() => {
        const findParent = (elements: any[]): any => {
            for (const el of elements) {
                if (el.id === parentId) return el;
                if (el.children) {
                    const found = findParent(el.children);
                    if (found) return found;
                }
            }
            return null;
        };
        const parent = findParent(elements);
        return {
            isInColumns: parent?.type === 'columns',
            isInContainer: parent?.type === 'container',
            parentType: parent?.type
        };
    })();

    const isInColumns = parentInfo?.isInColumns || false;
    const isInContainer = parentInfo?.isInContainer || false;
    const isNested = parentInfo ? true : false;

    const colSpanMap: Record<number, string> = {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6',
        7: 'col-span-7',
        8: 'col-span-8',
        9: 'col-span-9',
        10: 'col-span-10',
        11: 'col-span-11',
        12: 'col-span-12',
    };

    // Use only element.width, no local state
    const [isResizing, setIsResizing] = React.useState(false);

    const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
        e.stopPropagation();
        e.preventDefault();
        
        setIsResizing(true);
        
        // Store initial state
        const startX = e.clientX;
        const startWidth = element.width || 12;
        
        console.log('Resize started:', { direction, startX, startWidth, parentId, elementId: element.id });
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            
            const deltaX = moveEvent.clientX - startX;
            // Adjust pixels per column based on container context
            const pixelsPerColumn = parentId ? 60 : 80; // Smaller columns in containers
            const columnDelta = Math.round(deltaX / pixelsPerColumn);
            
            let newWidth = startWidth;
            
            if (direction === 'right') {
                newWidth = startWidth + columnDelta;
            } else {
                newWidth = startWidth - columnDelta;
            }
            
            // Clamp to valid range
            newWidth = Math.min(12, Math.max(1, newWidth));
            
            console.log('Resize move:', { deltaX, columnDelta, newWidth, currentWidth: element.width, inContainer: !!parentId });
            
            if (newWidth !== element.width) {
                updateElement(element.id, { width: newWidth });
            }
        };
        
        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        // Add listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Prevent text selection
        document.body.style.userSelect = 'none';
        document.body.style.cursor = direction === 'right' ? 'e-resize' : 'w-resize';
    };


    return (
        <div
            data-element-id={element.id}
            {...(element.type !== 'container' && {
                onClick: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    selectElement(element.id);
                    console.log('Element selected:', element.id, 'parentId:', parentId);
                }
            })}
            className={clsx(
                "group relative bg-white rounded-xl border flex flex-col",
                isNested && "w-full", // Full width inside any container or columns
                "opacity-100",
                isSelected
                    ? "border-brand-500 ring-4 ring-brand-500/10 shadow-md"
                    : "border-transparent hover:border-slate-200 hover:shadow-sm",
                isResizing && "z-50 ring-2 ring-brand-500 select-none",
                parentId && "z-20", // Higher z-index for nested elements
                "transition-[border,box-shadow,opacity] duration-200 ease-in-out"
            )}
            style={{
                ...(parentId ? { pointerEvents: 'auto', position: 'relative' } : {}),
                // Only apply percentage width for root level elements
                ...(!isNested ? { width: `${(element.width || 12) / 12 * 100}%` } : {}),
                // Apply margins
                marginTop: element.marginTop ? `${element.marginTop * 0.25}rem` : undefined,
                marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
                marginBottom: element.marginBottom ? `${element.marginBottom * 0.25}rem` : undefined,
                marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined
            }}
        >
            {/* Resize indicator */}
            {isResizing && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white text-xs px-2 py-1 rounded font-medium z-20 pointer-events-none">
                    {element.width}/12
                </div>
            )}

            {/* Move Up/Down Buttons */}
            <div className="absolute left-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        moveElementUp(element.id, parentId);
                    }}
                    className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    title="Move up"
                    disabled={(() => {
                        if (parentId) {
                            // Find parent and check if this is the first child
                            const findParent = (elements: any[]): any => {
                                for (const el of elements) {
                                    if (el.id === parentId) return el;
                                    if (el.children) {
                                        const found = findParent(el.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };
                            const parent = findParent(elements);
                            return parent?.children?.[0]?.id === element.id;
                        } else {
                            return elements[0]?.id === element.id;
                        }
                    })()}
                >
                    <ChevronUp size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        moveElementDown(element.id, parentId);
                    }}
                    className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    title="Move down"
                    disabled={(() => {
                        if (parentId) {
                            // Find parent and check if this is the last child
                            const findParent = (elements: any[]): any => {
                                for (const el of elements) {
                                    if (el.id === parentId) return el;
                                    if (el.children) {
                                        const found = findParent(el.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };
                            const parent = findParent(elements);
                            const lastIndex = (parent?.children?.length || 1) - 1;
                            return parent?.children?.[lastIndex]?.id === element.id;
                        } else {
                            const lastIndex = elements.length - 1;
                            return elements[lastIndex]?.id === element.id;
                        }
                    })()}
                >
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Resize Handles - Hide for elements inside containers or columns */}
            {!isNested && (
                <>
                    <div className={clsx(
                        "absolute right-0 top-0 bottom-0 w-4 cursor-e-resize flex items-center justify-center z-30 transition-all",
                        isResizing ? "opacity-100 bg-brand-100/80" : 
                        isSelected ? "opacity-80 hover:opacity-100 hover:bg-brand-50/50" :
                        "opacity-0 group-hover:opacity-100 hover:bg-brand-50/50"
                    )}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            handleResizeStart(e, 'right');
                        }}
                        title="Drag to resize"
                    >
                        <div className={clsx(
                            "w-1 rounded-full transition-colors",
                            parentId ? "h-6" : "h-8", // Smaller handles in containers
                            isResizing ? "bg-brand-500" : 
                            isSelected ? "bg-brand-400" : "bg-slate-300"
                        )}></div>
                    </div>
                    <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-4 cursor-w-resize flex items-center justify-center z-30 transition-all",
                        isResizing ? "opacity-100 bg-brand-100/80" : 
                        isSelected ? "opacity-80 hover:opacity-100 hover:bg-brand-50/50" :
                        "opacity-0 group-hover:opacity-100 hover:bg-brand-50/50"
                    )}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            handleResizeStart(e, 'left');
                        }}
                        title="Drag to resize"
                    >
                        <div className={clsx(
                            "w-1 rounded-full transition-colors",
                            parentId ? "h-6" : "h-8", // Smaller handles in containers
                            isResizing ? "bg-brand-500" : 
                            isSelected ? "bg-brand-400" : "bg-slate-300"
                        )}></div>
                    </div>
                </>
            )}


            <div 
                className={`${element.type === 'hidden' || element.type === 'rich-text' ? 'p-6' : 'p-6 pl-10'} flex-1`}
                style={{
                    paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25 + (element.type === 'hidden' || element.type === 'rich-text' ? 1.5 : 2.5)}rem` : undefined,
                    paddingRight: element.paddingRight ? `${element.paddingRight * 0.25 + 1.5}rem` : undefined,
                    paddingTop: element.paddingTop ? `${element.paddingTop * 0.25 + 1.5}rem` : undefined,
                    paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25 + 1.5}rem` : undefined
                }}
            >
                {element.type !== 'hidden' && element.type !== 'rich-text' && element.type !== 'container' && element.type !== 'columns' && (
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <label className={clsx(
                                "block text-slate-700",
                                element.labelSize === 'xs' && "text-xs",
                                element.labelSize === 'sm' && "text-sm",
                                element.labelSize === 'base' && "text-base",
                                element.labelSize === 'lg' && "text-lg",
                                !element.labelSize && "text-sm",
                                // Legacy labelWeight support (only if no new formatting is used)
                                !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                !element.labelBold && element.labelWeight === 'medium' && "font-medium", 
                                !element.labelBold && element.labelWeight === 'semibold' && "font-semibold",
                                !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                !element.labelBold && !element.labelWeight && "font-medium",
                                // New formatting system takes priority
                                element.labelBold && "font-bold",
                                element.labelItalic && "italic",
                                element.labelUnderline && "underline",
                                element.labelStrikethrough && "line-through"
                            )}>
                                {element.label}
                                {element.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {!['star-rating'].includes(element.type) && (
                                <span className="text-[10px] text-slate-400 font-mono">{element.name}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateElement(element.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Duplicate"
                            >
                                <Copy size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeElement(element.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {(element.type === 'container' || element.type === 'columns') && (
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <label 
                                className={clsx(
                                    "block text-slate-700 cursor-pointer hover:text-brand-600",
                                    element.labelSize === 'xs' && "text-xs",
                                    element.labelSize === 'sm' && "text-sm",
                                    element.labelSize === 'base' && "text-base",
                                    element.labelSize === 'lg' && "text-lg",
                                    !element.labelSize && "text-sm",
                                    // Legacy labelWeight support (only if no new formatting is used)
                                    !element.labelBold && element.labelWeight === 'normal' && "font-normal",
                                    !element.labelBold && element.labelWeight === 'medium' && "font-medium",
                                    !element.labelBold && element.labelWeight === 'semibold' && "font-semibold", 
                                    !element.labelBold && element.labelWeight === 'bold' && "font-bold",
                                    !element.labelBold && !element.labelWeight && "font-medium",
                                    // New formatting system takes priority
                                    element.labelBold && "font-bold",
                                    element.labelItalic && "italic",
                                    element.labelUnderline && "underline",
                                    element.labelStrikethrough && "line-through"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectElement(element.id);
                                }}
                            >
                                {element.label}
                                {element.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateElement(element.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Duplicate"
                            >
                                <Copy size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeElement(element.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
                
                {(element.type === 'hidden' || element.type === 'rich-text') && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                duplicateElement(element.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all"
                            title="Duplicate"
                        >
                            <Copy size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeElement(element.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                {/* Element Content */}
                <div className="pointer-events-none">
                    {element.type === 'textarea' ? (
                        <textarea
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm resize-none"
                            placeholder={element.placeholder}
                            rows={3}
                            readOnly
                        />
                    ) : element.type === 'select' ? (
                        <div className="relative">
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm appearance-none" disabled>
                                {element.options?.map((opt, idx) => (
                                    <option key={idx}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    ) : element.type === 'checkbox' ? (
                        <div className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <input type="checkbox" className="h-4 w-4 text-brand-600 rounded border-slate-300" disabled />
                            <span className="ml-3 text-sm text-slate-600">{element.placeholder || 'Checkbox option'}</span>
                        </div>
                    ) : element.type === 'radio' ? (
                        <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                                <div key={idx} className="flex items-center">
                                    <input type="radio" name={`radio-${element.id}`} className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500" disabled />
                                    <span className="ml-3 text-sm text-slate-600">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    ) : element.type === 'star-rating' ? (
                        <div className="flex gap-1 items-center">
                            {[...Array(element.maxStars || 5)].map((_, i) => (
                                <Star key={i} size={24} className="text-slate-300 fill-slate-100" />
                            ))}
                        </div>
                    ) : element.type === 'container' ? (
                        <ContainerContent element={element} />
                    ) : element.type === 'columns' ? (
                        <ColumnsContent element={element} />
                    ) : element.type === 'hidden' ? (
                        <div className="flex items-center p-3 bg-slate-100 border border-slate-300 rounded-lg opacity-60">
                            <div className="flex items-center gap-2 text-slate-500">
                                <EyeOff size={16} />
                                <span className="text-sm font-mono">Hidden: {element.value || 'No value'}</span>
                            </div>
                        </div>
                    ) : element.type === 'rich-text' ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[100px]">
                            <div 
                                className="prose prose-sm max-w-none text-slate-600"
                                dangerouslySetInnerHTML={{ __html: element.content || '<p>Your rich text content here</p>' }}
                            />
                        </div>
                    ) : (
                        <input
                            type={element.type}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm"
                            placeholder={element.placeholder}
                            readOnly
                        />
                    )}
                </div>
            </div>
        </div >
    );
});

export const Canvas: React.FC = () => {
    const { elements, selectElement, settings } = useStore();
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div
            className="form-builder-canvas"
            onClick={() => selectElement(null)}
        >
            <div className="form-builder-canvas-inner">
                <div
                    ref={setNodeRef}
                    className={clsx(
                        "min-h-[800px] bg-white rounded-2xl shadow-card p-16 transition-all duration-300",
                        elements.length === 0 && "form-builder-canvas-empty flex items-center justify-center"
                    )}
                >
                    {elements.length === 0 ? (
                        <div className="form-builder-canvas-empty-content">
                            <div className="form-builder-canvas-empty-icon">
                                <Info size={24} />
                            </div>
                            <h3 className="form-builder-canvas-empty-title">Start Building</h3>
                            <p className="form-builder-canvas-empty-text">
                                Drag elements from the sidebar to start constructing your form. Use the up/down arrows to reorder elements.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="mb-8 border-b border-slate-100 pb-6">
                                <div className="h-8 w-3/4 bg-slate-100 rounded-lg animate-pulse mb-3"></div>
                                <div className="h-4 w-1/2 bg-slate-50 rounded-lg animate-pulse"></div>
                            </div>

                            <div
                                className="flex flex-col"
                                style={{ gap: `${settings.gap || 4}px` }}
                            >
                                {elements.map((element) => (
                                    <SortableElement key={element.id} element={element} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};