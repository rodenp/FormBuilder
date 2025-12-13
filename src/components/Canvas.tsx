
///Users/osx/Applications/AI/Form Builder/src/components/Canvas.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useStore } from '../store/useStore';
import type { FormElement } from '../types';
import { Trash2, Info, Copy, Star, EyeOff, Plus, GripVertical, Bookmark, Sun, Moon, Type } from 'lucide-react';
import { clsx } from 'clsx';
import { RichTextEditor, type RichTextEditorRef } from './RichTextEditor';
import { CategoryModal } from './CategoryModal';
import { registry } from './registry';

const ColumnPlaceholder: React.FC<{ element: FormElement; index: number }> = ({ element, index }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `column - cell - ${element.id} -${index}`,
        data: { type: 'columns', containerId: element.id, columnIndex: index }
    });

    const { currentProject, selectedElementId, elements, settings } = useStore();
    const isFormProject = currentProject?.type === 'form';
    const isDark = settings.canvasTheme === 'dark';

    // Check if this column placeholder is part of a selected container
    const isDescendantOfSelected = selectedElementId && (() => {
        // Check if the parent columns element is the selected element or a descendant of it
        const isAncestor = (currentElementId: string, targetAncestorId: string, elements: FormElement[]): boolean => {
            let currentId: string | null = currentElementId;
            while (currentId) {
                if (currentId === targetAncestorId) return true;

                // Find parent of current element
                const findParent = (id: string, elems: FormElement[]): string | null => {
                    for (const el of elems) {
                        if (el.children) {
                            for (const childEl of el.children) {
                                if (childEl && childEl.id === id) return el.id;
                            }
                            const found = findParent(id, el.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                currentId = findParent(currentId, elements);
            }
            return false;
        };

        return isAncestor(element.id, selectedElementId, elements);
    })();

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "flex-1 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer transition-all duration-200",
                isDark ? "text-gray-500" : "text-slate-400",
                isFormProject && "border-2",
                isOver
                    ? (isFormProject ? "border-solid border-blue-500 bg-blue-100 shadow-lg transform scale-105" : "bg-blue-100 shadow-lg transform scale-105")
                    : isDescendantOfSelected
                        ? "border-solid border-blue-400 hover:border-blue-500"
                        : (isFormProject ? clsx("border-dashed", isDark ? "border-gray-700" : "border-slate-300") : "")
            )}
        >
            {isOver ? (
                <div className="text-blue-600 font-bold text-sm">
                    Drop into Column {index + 1}
                </div>
            ) : (
                <div className="text-center">
                    <Plus size={20} className="mb-1 opacity-60" />
                    <p className="text-xs font-medium">Drop here to add to Column {index + 1}</p>
                </div>
            )}
        </div>
    );
};

const ColumnCellDropZone: React.FC<{ containerId: string; columnIndex: number }> = ({ containerId, columnIndex }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `column - cell - add - ${containerId}`,
        data: { type: 'container', containerId }
    });
    const { settings } = useStore();
    const isDark = settings.canvasTheme === 'dark';

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "w-full h-full flex items-center justify-center text-center text-sm transition-all",
                isDark ? "text-gray-500" : "text-slate-400",
                isOver
                    ? "bg-blue-100 text-blue-600"
                    : ""
            )}
        >
            {isOver ? (
                <div className="font-bold">
                    Drop here to add to Column {columnIndex + 1}
                </div>
            ) : (
                <div>
                    <Plus size={16} className="mx-auto mb-1 opacity-60" />
                    Drop here to add to Column {columnIndex + 1}
                </div>
            )}
        </div>
    );
};

const RowCellDropZone: React.FC<{ containerId: string }> = ({ containerId }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `row - cell - add - ${containerId}`,
        data: { type: 'container', containerId }
    });
    const { settings } = useStore();
    const isDark = settings.canvasTheme === 'dark';

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "w-full h-full flex items-center justify-center text-center text-sm transition-all",
                isDark ? "text-gray-500" : "text-slate-400",
                isOver
                    ? "bg-blue-100 text-blue-600"
                    : ""
            )}
        >
            {isOver ? (
                <div className="font-bold">
                    Drop here to add to Row
                </div>
            ) : (
                <div>
                    <Plus size={16} className="mx-auto mb-1 opacity-60" />
                    Drop here to add to Row
                </div>
            )}
        </div>
    );
};

const RowCellEndDropZone: React.FC<{ containerId: string; gap: number }> = ({ containerId, gap }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `row - cell - end - ${containerId}`,
        data: { type: 'container', containerId }
    });
    const { settings } = useStore();
    const isDark = settings.canvasTheme === 'dark';

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "w-full flex items-center justify-center text-xs transition-all",
                isDark ? "text-gray-500" : "text-slate-400",
                isOver
                    ? "bg-blue-100 min-h-[24px]"
                    : "h-0 overflow-hidden opacity-0 hover:opacity-100 hover:h-2"
            )}
            style={{ marginTop: isOver ? (gap || '16px') : 0 }}
        >
            {isOver ? (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                    Drop here to add after
                </div>
            ) : (
                <div className={clsx("h-px w-full", isDark ? "bg-gray-700" : "bg-slate-300")}></div>
            )}
        </div>
    );
};

interface ColumnDropZoneProps {
    element: FormElement;
    index: number;
    child: FormElement | undefined;
    cellEditMode: boolean;
    handleCellClick: (e: React.MouseEvent, index: number) => void;
}

interface RowDropZoneProps {
    element: FormElement;
    index: number;
    child: FormElement | undefined;
    cellEditMode: boolean;
    handleCellClick: (e: React.MouseEvent, index: number) => void;
}

const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({ element, index, child, cellEditMode, handleCellClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `column - cell - ${element.id} -${index}`,
        data: {
            type: 'columns',
            containerId: element.id,
            columnIndex: index
        }
    });

    const { selectElement, currentProject, selectedElementId, elements } = useStore();
    const isFormProject = currentProject?.type === 'form';

    // Check if this column cell is a descendant of the selected element
    const isDescendantOfSelected = selectedElementId && child && (() => {
        // Walk up the parent chain to see if we're a descendant of the selected element
        const isAncestor = (currentElementId: string, targetAncestorId: string, elements: FormElement[]): boolean => {
            let currentId: string | null = currentElementId;
            while (currentId) {
                if (currentId === targetAncestorId) return true;

                // Find parent of current element
                const findParent = (id: string, elems: FormElement[]): string | null => {
                    for (const el of elems) {
                        if (el.children) {
                            for (const childEl of el.children) {
                                if (childEl && childEl.id === id) return el.id;
                            }
                            const found = findParent(id, el.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                currentId = findParent(currentId, elements);
            }
            return false;
        };

        return isAncestor(child.id, selectedElementId, elements);
    })();


    const handleColumnClick = (e: React.MouseEvent) => {
        // If clicking on column cell with container child, select the child container
        if (child && child.type === 'container' && !cellEditMode) {
            selectElement(child.id);
            e.stopPropagation();
            return;
        }
        // If clicking on empty column area and not in cell edit mode
        if (!child && !cellEditMode) {
            // Select the parent container (the columns element) when clicking empty areas
            selectElement(element.id);
            e.stopPropagation();
            return;
        }
        // For cell edit mode, handle cell click
        if (cellEditMode) {
            handleCellClick(e, index);
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={setNodeRef}
            key={index}
            className={clsx(
                "relative flex-1 transition-all duration-200",
                (!child || !child.children || child.children.length === 0) && "min-h-[50px]",
                cellEditMode && "border-orange-400 bg-orange-50 hover:border-orange-600 hover:bg-orange-100 cursor-pointer border-2 border-dashed",
                isOver && !cellEditMode && (isFormProject ? "border-4 border-solid border-blue-500 bg-blue-100 rounded-lg shadow-lg transform scale-105" : "bg-blue-100 rounded-lg shadow-lg transform scale-105"),
                !cellEditMode && !isOver && isDescendantOfSelected && "border-2 border-blue-400 border-dashed rounded-lg hover:border-blue-500",
                !cellEditMode && !isOver && !isDescendantOfSelected && isFormProject && "border-2 border-dashed border-slate-300 dark:border-gray-700 hover:border-blue-400 rounded-lg",
                !cellEditMode && !isOver && !isDescendantOfSelected && !isFormProject && "hover:border-2 hover:border-dashed hover:border-blue-400 rounded-lg"
            )}
            style={{
                backgroundColor: element.columnBackgrounds?.[index] || child?.backgroundColor || element.backgroundColor || 'transparent'
            }}
            onClick={handleColumnClick}
        >
            {cellEditMode && (
                <div className="absolute top-1 right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium z-40">
                    Cell {index + 1}
                </div>
            )}

            {/* Drop indicator */}
            {
                isOver && !cellEditMode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm">
                        <div className="bg-blue-500 text-white text-lg px-4 py-2 rounded-lg font-bold shadow-lg border-2 border-blue-300 animate-pulse">
                            Drop into Column {index + 1}
                        </div>
                    </div>
                )
            }

            {/* Content area */}
            <div
                className={clsx(
                    "relative w-full transition-all duration-200",
                    child && child.type === 'container' && isDescendantOfSelected && "border border-blue-400 border-dashed rounded-lg"
                )}
                style={{
                    pointerEvents: cellEditMode ? 'none' : 'auto',
                    backgroundColor: 'transparent',
                    display: child && child.type === 'container' ? (child.display || 'flex') : 'flex',
                    flexDirection: child && child.type === 'container' ? (child.flexDirection || 'column') : 'column',
                    flexWrap: child && child.type === 'container' ? (child.flexWrap || 'wrap') : 'wrap',
                    justifyContent: child && child.type === 'container' ? (child.justifyContent || 'flex-start') : 'flex-start',
                    alignItems: child && child.type === 'container' ? (child.alignItems || 'flex-start') : 'flex-start',
                    alignContent: child && child.type === 'container' ? (child.alignContent || 'flex-start') : 'flex-start',
                    gap: child && child.type === 'container' ? (child.gap || '0px') : '0px',
                    gridTemplateColumns: child && child.type === 'container' && child.display === 'grid' ?
                        `repeat(${child.gridColumns || 3}, auto)` : undefined,
                    paddingTop: child?.paddingTop !== undefined ? child.paddingTop : undefined,
                    paddingRight: child?.paddingRight !== undefined ? child.paddingRight : undefined,
                    paddingBottom: child?.paddingBottom !== undefined ? child.paddingBottom : undefined,
                    paddingLeft: child?.paddingLeft !== undefined ? child.paddingLeft : undefined
                }}
            >
                {child && child.type === 'container' ? (
                    child.children && child.children.length > 0 ? (
                        // Column cell has content - render all children
                        <>
                            {child.children.map((cellChild) => (
                                <SortableElement
                                    key={cellChild.id}
                                    element={cellChild}
                                    parentId={child.id}
                                />
                            ))}
                        </>
                    ) : (
                        // Empty column cell container - show drop zone
                        !cellEditMode && (
                            <ColumnCellDropZone
                                containerId={child.id}
                                columnIndex={index}
                            />
                        )
                    )
                ) : (
                    // Fallback - should not happen with new structure
                    !cellEditMode && (
                        <div className="w-full h-full flex items-center justify-center text-center text-slate-400 dark:text-gray-500 text-sm transition-all">
                            <div>
                                <Plus size={16} className="mx-auto mb-1 opacity-60" />
                                Drop here to add to Column {index + 1}
                            </div>
                        </div>
                    )
                )}

                {/* Click overlay when in cell edit mode */}
                {cellEditMode && (
                    <div
                        className="absolute inset-0 z-50 cursor-pointer bg-transparent"
                        onClick={(e) => handleCellClick(e, index)}
                        onMouseDown={(e) => e.preventDefault()}
                        title={`Click to edit Cell ${index + 1} background`}
                        style={{ pointerEvents: 'auto' }}
                    />
                )}
            </div>
        </div >
    );
};

const RowDropZone: React.FC<RowDropZoneProps> = ({ element, index, child, cellEditMode, handleCellClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `row - cell - ${element.id} -${index}`,
        data: {
            type: child && child.type === 'container' ? 'container' : 'rows',
            containerId: child && child.type === 'container' ? child.id : element.id,
            rowIndex: index
        }
    });

    const { selectElement, currentProject, selectedElementId, elements } = useStore();
    const isFormProject = currentProject?.type === 'form';

    // Check if this row cell is a descendant of the selected element
    const isDescendantOfSelected = selectedElementId && child && (() => {
        // Walk up the parent chain to see if we're a descendant of the selected element
        const isAncestor = (currentElementId: string, targetAncestorId: string, elements: FormElement[]): boolean => {
            let currentId: string | null = currentElementId;
            while (currentId) {
                if (currentId === targetAncestorId) return true;

                // Find parent of current element
                const findParent = (id: string, elems: FormElement[]): string | null => {
                    for (const el of elems) {
                        if (el.children) {
                            for (const childEl of el.children) {
                                if (childEl && childEl.id === id) return el.id;
                            }
                            const found = findParent(id, el.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                currentId = findParent(currentId, elements);
            }
            return false;
        };

        return isAncestor(child.id, selectedElementId, elements);
    })();

    const handleRowClick = (e: React.MouseEvent) => {
        // If clicking on row cell with container child, select the child container
        if (child && child.type === 'container' && !cellEditMode) {
            selectElement(child.id);
            e.stopPropagation();
            return;
        }
        // If clicking on empty row area and not in cell edit mode
        if (!child && !cellEditMode) {
            // Select the parent container (the rows element) when clicking empty areas
            selectElement(element.id);
            e.stopPropagation();
            return;
        }
        // For cell edit mode, handle cell click
        if (cellEditMode) {
            handleCellClick(e, index);
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={setNodeRef}
            key={index}
            className={clsx(
                "relative w-full transition-all duration-200",
                (!child || !child.children || child.children.length === 0) && "min-h-[50px]",
                cellEditMode && "border-orange-400 hover:border-orange-600 cursor-pointer border-2 border-dashed",
                cellEditMode && !element.rowBackgrounds?.[index] && "bg-orange-50 hover:bg-orange-100",
                isOver && !cellEditMode && (isFormProject ? "border-4 border-solid border-blue-500 rounded-lg shadow-lg transform scale-105" : "rounded-lg shadow-lg transform scale-105"),
                isOver && !cellEditMode && !element.rowBackgrounds?.[index] && "bg-blue-100",
                !cellEditMode && !isOver && isDescendantOfSelected && "border-2 border-blue-400 border-dashed bg-blue-50/20 rounded-lg",
                !cellEditMode && !isOver && !isDescendantOfSelected && isFormProject && "border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-lg"
            )}
            style={{
                backgroundColor: element.rowBackgrounds?.[index] || element.backgroundColor || 'transparent'
            }}
            onClick={handleRowClick}
        >
            {cellEditMode && (
                <div className="absolute top-1 right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium z-40">
                    Row {index + 1}
                </div>
            )}

            {/* Drop indicator */}
            {isOver && !cellEditMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm">
                    <div className="bg-blue-500 text-white text-lg px-4 py-2 rounded-lg font-bold shadow-lg border-2 border-blue-300 animate-pulse">
                        Drop into Row {index + 1}
                    </div>
                </div>
            )}

            {/* Content area */}
            <div
                className={clsx(
                    "relative w-full transition-all duration-200",
                    child && child.type === 'container' && isDescendantOfSelected && "border border-blue-400 border-dashed bg-blue-50/20 rounded-lg"
                )}
                style={{
                    pointerEvents: cellEditMode ? 'none' : 'auto',
                    display: child && child.type === 'container' ? (child.display || 'flex') : 'flex',
                    flexDirection: child && child.type === 'container' ? (child.flexDirection || 'column') : 'column',
                    flexWrap: child && child.type === 'container' ? (child.flexWrap || 'nowrap') : 'nowrap',
                    justifyContent: child && child.type === 'container' ? (child.justifyContent || 'flex-start') : 'flex-start',
                    alignItems: child && child.type === 'container' ? (child.alignItems || 'flex-start') : 'flex-start',
                    alignContent: child && child.type === 'container' ? (child.alignContent || 'flex-start') : 'flex-start',
                    gap: child && child.type === 'container' ? (child.gap || '0px') : '0px',
                    gridTemplateColumns: child && child.type === 'container' && child.display === 'grid' ?
                        `repeat(${child.gridColumns || 3}, auto)` : undefined,
                    paddingTop: child?.paddingTop !== undefined ? child.paddingTop : undefined,
                    paddingRight: child?.paddingRight !== undefined ? child.paddingRight : undefined,
                    paddingBottom: child?.paddingBottom !== undefined ? child.paddingBottom : undefined,
                    paddingLeft: child?.paddingLeft !== undefined ? child.paddingLeft : undefined
                }}
            >
                {child && child.type === 'container' ? (
                    child.children && child.children.length > 0 ? (
                        // Row cell has content - render all children with drop zones
                        <>
                            {child.children.map((cellChild) => (
                                <SortableElement
                                    key={cellChild.id}
                                    element={cellChild}
                                    parentId={child.id}
                                />
                            ))}
                            <RowCellEndDropZone containerId={child.id} gap={parseInt(element.gap || '0', 10)} />
                        </>
                    ) : (
                        // Empty row cell container - show drop zone
                        !cellEditMode && (
                            <RowCellDropZone
                                containerId={child.id}
                            />
                        )
                    )
                ) : (
                    // Fallback - should not happen with new structure
                    !cellEditMode && (
                        <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500 text-sm">
                            <div className="text-center">
                                <Plus size={20} className="mx-auto mb-2 opacity-60" />
                                <p>Empty Row {index + 1}</p>
                                <p className="text-xs opacity-75">No container</p>
                            </div>
                        </div>
                    )
                )}

                {/* Click overlay when in cell edit mode */}
                {cellEditMode && (
                    <div
                        className="absolute inset-0 z-50 cursor-pointer bg-transparent"
                        onClick={(e) => handleCellClick(e, index)}
                        onMouseDown={(e) => e.preventDefault()}
                        title={`Click to edit Row ${index + 1} background`}
                        style={{ pointerEvents: 'auto' }}
                    />
                )}
            </div>
        </div>
    );
};


interface SortableElementProps {
    element: FormElement;
    parentId?: string;
}

const ContainerContent: React.FC<{ element: FormElement }> = ({ element }) => {
    const { setNodeRef } = useDroppable({
        id: `container - ${element.id}`,
        data: { type: element.type, containerId: element.id }
    });
    const { currentProject, settings } = useStore();
    const isFormProject = currentProject?.type === 'form';
    const isDark = settings.canvasTheme === 'dark';

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "container-content rounded-lg",
                isFormProject && clsx("border-2 border-dashed", isDark ? "border-gray-700" : "border-slate-200"),
                false
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent'
            }}
        >
            {(!element.children || element.children.length === 0) ? (
                element.type === 'columns' ? (
                    // Show placeholder drop zones for columns
                    <div className="flex gap-4 w-full">
                        {Array.from({ length: element.columnCount || 2 }).map((_, index) => (
                            <ColumnPlaceholder
                                key={`placeholder - ${index}`}
                                element={element}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    // Default empty state for other containers
                    <div
                        className={clsx(
                            "container-empty-area flex flex-col items-center justify-center h-28 cursor-pointer",
                            isDark ? "text-gray-500" : "text-slate-400"
                        )}
                    >
                        <Plus size={24} className="mb-2 opacity-50" />
                        <p className="text-sm font-medium">Drop elements here</p>
                        <p className="text-xs">Container is empty</p>
                    </div>
                )
            ) : (
                <div
                    className="container-grid"
                    style={{
                        // Auto-set layout for rows, columns, grid, and menu containers
                        display: element.type === 'rows' ? 'flex' : element.type === 'columns' ? 'flex' : element.type === 'menu' ? 'flex' : element.type === 'grid' ? 'grid' : (element.display || 'flex'),
                        flexDirection: element.type === 'rows' ? 'column' : element.type === 'columns' ? 'row' :
                            element.type === 'menu' ? (element.flexDirection || 'row') :
                                element.type === 'container' ? (element.flexDirection || 'column') :
                                    (element.display === 'flex' ? (element.flexDirection || 'column') : undefined),
                        flexWrap: (element.type === 'rows' || element.type === 'columns' || element.type === 'menu' || element.display === 'flex') ?
                            (element.flexWrap || (element.type === 'menu' ? 'nowrap' : 'wrap')) : undefined,
                        justifyContent: (element.display === 'flex' || element.display === 'grid' || element.type === 'rows' || element.type === 'columns' || element.type === 'menu') ? element.justifyContent : undefined,
                        alignItems: (element.display === 'flex' || element.display === 'grid' || element.type === 'rows' || element.type === 'columns' || element.type === 'menu') ? element.alignItems : undefined,
                        alignContent: (element.type === 'rows' || element.type === 'columns' || element.type === 'menu' || element.display === 'flex') ? (element.alignContent || 'flex-start') : 'start',
                        gridTemplateColumns: (element.display === 'grid' || element.type === 'grid') && element.type !== 'rows' ? `repeat(${element.gridColumns || 3}, auto)` : undefined,
                        gap: (element.display !== 'block' || element.type === 'rows' || element.type === 'grid' || element.type === 'menu') && element.type !== 'columns' ? (element.gap || '0px') : undefined,
                        // Add minimum height only when needed for spacing to work in column direction
                        minHeight: (element.display === 'flex' && element.flexDirection === 'column') ||
                            element.type === 'rows' ||
                            (element.display === 'flex' && !element.flexDirection && element.type !== 'menu' && element.type !== 'columns') ?
                            undefined : undefined
                    }}
                >
                    {element.children.map((child, index) => {
                        if (!child) {
                            // Return droppable placeholder for removed elements in columns
                            if (element.type === 'columns') {
                                return <ColumnPlaceholder key={`empty - ${index}`} element={element} index={index} />;
                            } else {
                                // For non-column containers, just maintain structure
                                return (
                                    <div key={`empty - ${index}`} className="flex-1 min-h-[32px]">
                                        {/* Empty slot to maintain structure */}
                                    </div>
                                );
                            }
                        }
                        return <SortableElement key={child.id} element={child} parentId={element.id} />;
                    })}
                </div>
            )}
        </div>
    );
};

const ColumnsContent: React.FC<{ element: FormElement }> = ({ element }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [cellEditMode, setCellEditMode] = useState(false);
    const { setNodeRef } = useDroppable({
        id: `columns - ${element.id}`,
        data: { type: 'columns', containerId: element.id }
    });
    const { selectElement, updateElement, currentProject } = useStore();
    const isFormProject = currentProject?.type === 'form';

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt' || e.key === 'Option') {
                setCellEditMode(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt' || e.key === 'Option') {
                setCellEditMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleCellClick = (e: React.MouseEvent, cellIndex: number) => {
        if (cellEditMode) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Cell background edit mode - cell clicked:', cellIndex, 'element.id:', element.id);
            updateElement(element.id, { selectedColumnIndex: cellIndex });
            selectElement(element.id);
            console.log('Updated element with selectedColumnIndex:', cellIndex);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "rounded-lg relative",
                isFormProject && "border border-slate-200"
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent'
            }}
        >
            {cellEditMode && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium z-50">
                    Cell Edit Mode - Click any cell to edit background
                </div>
            )}

            <div
                style={{
                    // Auto-set layout based on container type
                    display: element.type === 'columns' || element.type === 'rows' ? 'flex' :
                        element.type === 'grid' ? 'grid' : (element.display || 'grid'),
                    flexDirection: element.type === 'columns' ? 'row' : element.type === 'rows' ? 'column' :
                        (element.display === 'flex' ? (element.flexDirection || 'row') : undefined),
                    flexWrap: (element.type === 'columns' || element.type === 'rows' || element.display === 'flex') ?
                        (element.flexWrap || 'wrap') : undefined,
                    justifyContent: (element.display !== 'block' || element.type === 'columns' || element.type === 'rows') ?
                        element.justifyContent : undefined,
                    alignItems: (element.display !== 'block' || element.type === 'columns' || element.type === 'rows') ?
                        element.alignItems : undefined,
                    alignContent: (element.type === 'columns' || element.type === 'rows' || element.display === 'flex') ?
                        (element.alignContent || 'flex-start') : 'start',
                    gridTemplateColumns: (element.display === 'grid' || element.type === 'grid') && element.type !== 'columns' && element.type !== 'rows' ?
                        (isMobile ? '1fr' : `repeat(${element.gridColumns || element.columnCount || 3}, 1fr)`) : undefined,
                    gap: (element.display !== 'block' || element.type === 'rows' || element.type === 'grid') && element.type !== 'columns' ?
                        (element.gap || '0px') : undefined
                }}
            >
                {(element.type === 'columns') ? (
                    // For columns, use individual drop zones for each column
                    Array.from({ length: element.columnCount || 2 }).map((_, index) => {
                        const child = element.children?.[index];
                        return (
                            <ColumnDropZone
                                key={index}
                                element={element}
                                index={index}
                                child={child}
                                cellEditMode={cellEditMode}
                                handleCellClick={handleCellClick}
                            />
                        );
                    })
                ) : ((element.type === 'rows' || element.type === 'grid' || element.display === 'flex') ? (
                    // For flex layout (rows/grid) or dedicated grid, render all children directly
                    element.children?.map((child: any, index) => {
                        if (!child) {
                            return <div key={`empty - ${index}`} className="flex-1 min-h-[32px]" />;
                        }
                        return <SortableElement key={child.id} element={child} parentId={element.id} />;
                    })
                ) : (
                    // For legacy grid layout in columns, use the original column-based layout  
                    Array.from({ length: element.columnCount || 2 }).map((_, index) => {
                        const child = element.children?.[index];
                        // If no child, create a mock placeholder element
                        const displayChild = child || {
                            id: `placeholder - ${element.id} -${index}`,
                            type: 'text' as const,
                            label: '',
                            name: `placeholder - ${index}`,
                            placeholder: 'Drop element here',
                            required: false,
                            width: "12",
                            isPlaceholder: true // Mark this as a placeholder
                        };

                        return (
                            <div
                                key={index}
                                className={`relative ${cellEditMode
                                    ? 'border-orange-400 bg-orange-50 hover:border-orange-600 hover:bg-orange-100 cursor-pointer border-2 border-dashed'
                                    : ''
                                    }`}
                                style={{
                                    backgroundColor: element.columnBackgrounds?.[index] || element.backgroundColor || 'transparent'
                                }}
                                data-debug-legacy-cell={`index - ${index} -bg - ${element.columnBackgrounds?.[index] || 'none'}`}
                            >
                                {cellEditMode && (
                                    <div className="absolute top-1 right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium z-40">
                                        Cell {index + 1}
                                    </div>
                                )}

                                {/* Always render content - either real child or placeholder */}
                                <div
                                    className="relative w-full h-full"
                                    style={{ pointerEvents: cellEditMode ? 'none' : 'auto' }}
                                >
                                    {child ? (
                                        <SortableElement element={child} parentId={element.id} />
                                    ) : (
                                        <SortableElement element={displayChild} parentId={element.id} />
                                    )}

                                    {/* Click overlay when in cell edit mode - above content */}
                                    {cellEditMode && (
                                        <div
                                            className="absolute inset-0 z-50 cursor-pointer bg-transparent"
                                            onClick={(e) => handleCellClick(e, index)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            title={`Click to edit Cell ${index + 1} background`}
                                            style={{ pointerEvents: 'auto' }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

const RowsContent: React.FC<{ element: FormElement }> = ({ element }) => {
    const [cellEditMode, setCellEditMode] = useState(false);
    const { setNodeRef } = useDroppable({
        id: `rows - ${element.id}`,
        data: { type: 'rows', containerId: element.id }
    });
    const { selectElement, updateElement, currentProject } = useStore();
    const isFormProject = currentProject?.type === 'form';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt' || e.key === 'Option') {
                setCellEditMode(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt' || e.key === 'Option') {
                setCellEditMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleCellClick = (e: React.MouseEvent, cellIndex: number) => {
        if (cellEditMode) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Row background edit mode - cell clicked:', cellIndex, 'element.id:', element.id);
            updateElement(element.id, { selectedRowIndex: cellIndex });
            selectElement(element.id);
            console.log('Updated element with selectedRowIndex:', cellIndex);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "rounded-lg relative",
                isFormProject && "border border-slate-200"
            )}
            style={{
                backgroundColor: element.backgroundColor || 'transparent',
                paddingTop: element.paddingTop !== undefined ? element.paddingTop : undefined,
                paddingRight: element.paddingRight !== undefined ? element.paddingRight : undefined,
                paddingBottom: element.paddingBottom !== undefined ? element.paddingBottom : undefined,
                paddingLeft: element.paddingLeft !== undefined ? element.paddingLeft : undefined,
                marginTop: element.marginTop !== undefined ? element.marginTop : undefined,
                marginRight: element.marginRight !== undefined ? element.marginRight : undefined,
                marginBottom: element.marginBottom !== undefined ? element.marginBottom : undefined,
                marginLeft: element.marginLeft !== undefined ? element.marginLeft : undefined
            }}
        >
            {cellEditMode && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium z-50">
                    Cell Edit Mode - Click any row to edit background
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: element.flexWrap || 'nowrap',
                    justifyContent: element.justifyContent || 'flex-start',
                    alignItems: element.alignItems || 'stretch',
                    alignContent: element.alignContent || 'flex-start',
                    gap: (element.gap || '0px')
                }}
            >
                {/* For rows, use individual drop zones for each row */}
                {Array.from({ length: element.rowCount || 1 }).map((_, index) => {
                    const child = element.children?.[index];
                    return (
                        <RowDropZone
                            key={index}
                            element={element}
                            index={index}
                            child={child}
                            cellEditMode={cellEditMode}
                            handleCellClick={handleCellClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const SortableElement: React.FC<SortableElementProps> = ({ element, parentId }) => {
    const { selectElement, selectedElementId, removeElement, duplicateElement, updateElement, elements, currentProject, saveElementAsBlock, isElementSavedAsBlock } = useStore();

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isEditingText, setIsEditingText] = useState(false);
    const editorRef = useRef<RichTextEditorRef>(null);
    const isTextElement = ['text-block', 'rich-text', 'heading'].includes(element.type);

    // Add draggable functionality
    const { attributes, listeners, setNodeRef: setDragNodeRef, isDragging } = useDraggable({
        id: element.id,
        data: {
            type: element.type,
            element: element,
            parentId: parentId
        }
    });

    // Add droppable functionality for "insert before" drop zones
    const { setNodeRef: setDropBeforeNodeRef, isOver: isOverBefore } = useDroppable({
        id: `drop - before - ${element.id}`,
        data: {
            type: element.type,
            element: element,
            parentId: parentId,
            insertPosition: 'before'
        }
    });

    // Add droppable functionality for "insert after" drop zones  
    const { setNodeRef: setDropAfterNodeRef, isOver: isOverAfter } = useDroppable({
        id: `drop - after - ${element.id}`,
        data: {
            type: element.type,
            element: element,
            parentId: parentId,
            insertPosition: 'after'
        }
    });
    const isSelected = selectedElementId === element.id;
    const hasAnySelection = selectedElementId !== null;
    const isFormProject = currentProject?.type === 'form';

    // Check if this element is a descendant of the selected element (for showing nested borders)
    const isDescendantOfSelected = selectedElementId && (() => {
        // Walk up the parent chain to see if we're a descendant of the selected element
        const isAncestor = (currentElementId: string, targetAncestorId: string, elements: FormElement[]): boolean => {
            // Find the current element in the tree
            const findElementWithParent = (id: string, elems: FormElement[], parentId?: string): { element: FormElement; parent?: FormElement } | null => {
                for (const el of elems) {
                    if (!el) continue;
                    if (el.id === id) {
                        return { element: el, parent: parentId ? elems.find(p => p.id === parentId) : undefined };
                    }
                    if (el.children) {
                        const found = findElementWithParent(id, el.children, el.id);
                        if (found) return found;
                    }
                }
                return null;
            };

            let currentId: string | null = currentElementId;
            while (currentId) {
                if (currentId === targetAncestorId) return true;

                // Find parent of current element
                const findParent = (id: string, elems: FormElement[]): string | null => {
                    for (const el of elems) {
                        if (el.children) {
                            for (const child of el.children) {
                                if (child && child.id === id) return el.id;
                            }
                            const found = findParent(id, el.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                currentId = findParent(currentId, elements);
            }
            return false;
        };

        return isAncestor(element.id, selectedElementId, elements);
    })();

    const parentInfo = parentId ? (() => {
        const findParent = (elements: any[]): FormElement | null => {
            for (const el of elements) {
                if (!el) continue; // Skip undefined/null elements
                if (el.id === parentId) return el;
                if (el.children) {
                    const found = findParent(el.children);
                    if (found) return found;
                }
            }
            return null;
        };
        const parent = findParent(elements);
        return parent ? {
            isInColumns: parent.type === 'columns',
            isInContainer: parent.type === 'container',
            isInRows: parent.type === 'rows',
            parentType: parent.type,
            parent: parent
        } : null;
    })() : null;

    const isNested = parentInfo ? true : false;

    // Save-as-block logic
    const hasChildren = element.children && element.children.length > 0;
    const isContainerType = ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type);
    const canSaveAsBlock = isContainerType && hasChildren && !parentId; // Only for root level containers with children
    const isAlreadySavedAsBlock = canSaveAsBlock && isElementSavedAsBlock(element);

    // Use only element.width, no local state
    const [isResizing, setIsResizing] = React.useState(false);

    const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
        e.stopPropagation();
        e.preventDefault();

        setIsResizing(true);

        // Store initial state
        const startX = e.clientX;
        const startWidth = parseInt(String(element.width || 12), 10);

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

            if (String(newWidth) !== element.width) {
                updateElement(element.id, { width: String(newWidth) });
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

    const handleImageResize = (e: React.MouseEvent, direction: 'nw' | 'ne' | 'sw' | 'se') => {
        e.stopPropagation();
        e.preventDefault();

        setIsResizing(true);

        // Store initial state
        const startX = e.clientX;
        const startWidth = parseInt(String(element.width || 2), 10); // Default ~17% (2 of 12 columns)

        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();

            const deltaX = moveEvent.clientX - startX;
            const pixelsPerColumn = 80; // Approximate pixels per column
            let columnDelta = Math.round(deltaX / pixelsPerColumn);

            // Adjust for left-side handles
            if (direction === 'nw' || direction === 'sw') {
                columnDelta = -columnDelta;
            }

            const newWidth = Math.max(1, Math.min(12, startWidth + columnDelta));

            if (String(newWidth) !== element.width) {
                updateElement(element.id, { width: String(newWidth) });
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
        document.body.style.cursor = `${direction} -resize`;
    };


    // Set drag ref for the main element (drop refs are handled separately for before/after zones)
    const setMainElementRef = (node: HTMLElement | null) => {
        setDragNodeRef(node);
    };

    return (
        <div
            ref={setMainElementRef}
            data-element-id={element.id}
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                selectElement(element.id);
                console.log('Element selected:', element.id, 'parentId:', parentId);
            }}
            {...(isSelected && !['rich-text', 'text-block', 'heading'].includes(element.type) ? { ...listeners, ...attributes } : {})}
            className={clsx(
                "group relative flex flex-col",
                !isSelected || !['rich-text', 'text-block', 'heading'].includes(element.type) ? "cursor-pointer" : "cursor-auto",
                isNested && !['columns', 'menu'].includes(parentInfo?.parent?.type || '') && "w-full", // Full width inside any container but not columns or menu
                "opacity-100",
                isSelected && "z-[999]",
                isResizing && "z-50 select-none",
                parentId && "z-20", // Higher z-index for nested elements
                isDragging && "opacity-50",
                // Special highlighting for column cells
                element.type === 'container' && element.name?.startsWith('column_') && "ring-2 ring-purple-200 ring-opacity-50",
                // Default transparent border to prevent layout shift on hover (maintained when selected to prevent jump)
                !isDescendantOfSelected && "border border-transparent",
                // Show border when element is descendant of selected container
                isDescendantOfSelected && !isSelected && "border border-blue-400 border-dashed rounded-lg",
                // Hover highlighting - dashed for nested components
                !isSelected && !isDragging && !isDescendantOfSelected && parentId && "hover:border-brand-500 hover:border-dashed rounded-lg",
                // Hover highlighting - solid for outermost components (no parentId)
                !isSelected && !isDragging && !isDescendantOfSelected && !parentId && "hover:border-brand-500 hover:border-solid rounded-lg"
            )}
            style={{
                ...(parentId ? { pointerEvents: 'auto', position: 'relative' } : {}),
                // Apply percentage width for root level elements, elements in columns, and elements in menu containers
                ...(!isNested || ['columns', 'menu'].includes(parentInfo?.parent?.type || '') ?
                    (parentInfo?.parent?.type === 'menu' ?
                        // For menu items, remove fixed width and let flex container control layout
                        { flex: '0 0 auto', alignSelf: 'stretch' } :
                        { width: `${(parseInt(String(element.width || (element.type === 'image' ? 2 : 12)), 10)) / 12 * 100}%` }) : {}),
                // Apply margins
                marginTop: element.marginTop || '0px',
                marginRight: element.marginRight || '0px',
                marginBottom: element.marginBottom || '0px',
                marginLeft: element.marginLeft || '0px',
                // Apply horizontal alignment for non-containers
                ...(element.horizontalAlign === 'center' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ?
                    { marginLeft: 'auto', marginRight: 'auto' } : {}),
                ...(element.horizontalAlign === 'right' && !['container', 'columns', 'rows', 'grid'].includes(element.type) ?
                    { marginLeft: 'auto' } : {}),
                // Apply stretch behavior when parent has alignItems: 'stretch'
                ...(parentInfo?.parent?.alignItems === 'stretch' && parentInfo?.parent?.display !== 'block' &&
                    !['container', 'columns', 'menu', 'social'].includes(element.type) ?
                    { minHeight: 'fit-content' } : {})
            }}
        >
            {/* Resize indicator */}
            {isResizing && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white text-xs px-2 py-1 rounded font-medium z-20 pointer-events-none">
                    {element.width}/12
                </div>
            )}

            {/* Drop Before Zone - positioned above element */}
            <div
                ref={setDropBeforeNodeRef}
                className={clsx(
                    "absolute -top-2 left-0 right-0 h-4 flex items-center justify-center z-40",
                    isOverBefore && "bg-blue-500/20"
                )}
            >
                {isOverBefore && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                        Drop before
                    </div>
                )}
            </div>

            {/* Drop After Zone - positioned below element */}
            <div
                ref={setDropAfterNodeRef}
                className={clsx(
                    "absolute -bottom-2 left-0 right-0 h-4 flex items-center justify-center z-40",
                    isOverAfter && "bg-blue-500/20"
                )}
            >
                {isOverAfter && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                        Drop after
                    </div>
                )}
            </div>


            {/* Selected Element Toolbar - Only show for selected element when NOT editing text */}
            {isSelected && !isEditingText && (
                <div
                    className="absolute bottom-full left-0 mb-0 opacity-100 z-[9999] flex gap-1 bg-white rounded-md shadow-lg p-1 border border-slate-200"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div
                        className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600 cursor-grab active:cursor-grabbing"
                        title="Drag to move"
                    >
                        <GripVertical size={12} />
                    </div>

                    {/* Text Edit Trigger */}
                    {isTextElement && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (editorRef.current) {
                                    editorRef.current.focus();
                                    setIsEditingText(true);
                                }
                            }}
                            className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-blue-600"
                            title="Edit Text"
                        >
                            <Type size={12} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            duplicateElement(element.id);
                        }}
                        className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-green-600"
                        title="Duplicate"
                    >
                        <Copy size={12} />
                    </button>
                    {/* Save as block button - only for containers with children at root level */}
                    {canSaveAsBlock && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCategoryModal(true);
                            }}
                            className={clsx(
                                "p-1 bg-white border border-slate-300 rounded shadow-sm transition-colors",
                                isAlreadySavedAsBlock
                                    ? "text-white bg-purple-600 border-purple-600 hover:bg-purple-700"
                                    : "text-slate-600 hover:text-white hover:bg-purple-600"
                            )}
                            title={isAlreadySavedAsBlock ? "Component saved as block" : "Save as reusable block"}
                        >
                            <Bookmark size={12} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeElement(element.id);
                        }}
                        className="p-1 bg-white border border-slate-300 rounded shadow-sm text-slate-600 hover:text-white hover:bg-red-600"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}

            {/* Resize Handles - Hide for elements inside containers, columns, or non-form projects */}
            {!isNested && isFormProject && (
                <>
                    <div className={clsx(
                        "absolute right-0 top-0 bottom-0 w-4 cursor-e-resize flex items-center justify-center z-30",
                        isResizing ? "opacity-100 bg-brand-100/80" :
                            isSelected ? "opacity-80 hover:opacity-100 hover:bg-brand-50/50" :
                                hasAnySelection ? "opacity-0" : "opacity-0"
                    )}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            handleResizeStart(e, 'right');
                        }}
                        title="Drag to resize"
                    >
                        <div className={clsx(
                            "w-1 rounded-full",
                            parentId ? "h-6" : "h-8", // Smaller handles in containers
                            isResizing ? "bg-brand-500" :
                                isSelected ? "bg-brand-400" : "bg-slate-300"
                        )}></div>
                    </div>
                </>
            )}


            {/* Visual wrapper around label and component */}
            <div
                className={clsx(
                    "relative rounded-lg flex-1",
                    isSelected && "ring-2 ring-brand-400 ring-opacity-50"
                )}
                style={{
                    backgroundColor: element.type === 'button' ? undefined : (element.backgroundColor || undefined),
                    // Only apply padding for container, columns, rows, grid, and menu - regular elements handle their own spacing
                    paddingTop: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? (element.paddingTop || '0px') : undefined,
                    paddingRight: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? (element.paddingRight || '0px') : undefined,
                    paddingBottom: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? (element.paddingBottom || '0px') : undefined,
                    paddingLeft: ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) ? (element.paddingLeft || '0px') : undefined
                }}
            >
                {isFormProject && !['hidden', 'rich-text', 'container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                    <div
                        className="flex justify-between items-start"
                        style={{ marginBottom: element.labelGap !== undefined ? element.labelGap : '0.75rem' }}
                    >
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
                        </div>
                    </div>
                )}

                {isFormProject && ['container', 'columns', 'rows', 'grid', 'menu'].includes(element.type) && element.label && element.label.trim() && (
                    <div
                        className="flex justify-between items-start"
                        style={{ marginBottom: element.labelGap !== undefined ? element.labelGap : '0.75rem' }}
                    >
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
                                    element.labelStrikethrough && "line-through",
                                    // Special styling for column cells
                                    element.type === 'container' && element.name?.startsWith('column_') && "text-purple-600"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectElement(element.id);
                                }}
                            >
                                {element.label}
                                {element.type === 'container' && element.name?.startsWith('column_') && <span className="ml-1 text-xs opacity-60">(Cell)</span>}
                                {element.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>
                    </div>
                )}

                {/* Element Content */}
                <div
                    className={clsx(
                        "pointer-events-none",
                        isSelected && ['rich-text', 'text-block', 'heading'].includes(element.type) && "pointer-events-auto"
                    )}
                    style={{
                        // Apply padding to regular form elements (not containers/columns/buttons) only if padding values are set
                        paddingTop: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio', 'text-block', 'heading', 'rich-text'].includes(element.type)) ? `${(element.paddingTop ?? 0)}px` : undefined,
                        paddingRight: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio', 'text-block', 'heading', 'rich-text'].includes(element.type)) ? `${(element.paddingRight ?? 0)}px` : undefined,
                        paddingBottom: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio', 'text-block', 'heading', 'rich-text'].includes(element.type)) ? `${(element.paddingBottom ?? 0)}px` : undefined,
                        paddingLeft: (!['container', 'columns', 'rows', 'button', 'textarea', 'select', 'checkbox', 'radio', 'text-block', 'heading', 'rich-text'].includes(element.type)) ? `${(element.paddingLeft ?? 0)}px` : undefined
                    }}
                    data-padding-debug={JSON.stringify({
                        type: element.type,
                        paddingTop: element.paddingTop,
                        appliedPaddingTop: (!['container', 'columns', 'rows', 'button'].includes(element.type)) ? `${(element.paddingTop ?? 0)}px` : 'excluded'
                    })}
                >
                    {(() => {
                        const RegistryComponent = registry.get(element.type)?.Component;
                        if (RegistryComponent) {
                            return <RegistryComponent element={element} />;
                        }

                        return element.type === 'textarea' ? (
                            <textarea
                                className={clsx(
                                    "w-full rounded-lg text-slate-500 text-sm resize-none",
                                    isFormProject && "border border-slate-200"
                                )}
                                style={{
                                    backgroundColor: element.backgroundColor,
                                    paddingTop: `${(element.paddingTop ?? 12)}px`,
                                    paddingRight: `${(element.paddingRight ?? 12)}px`,
                                    paddingBottom: `${(element.paddingBottom ?? 12)}px`,
                                    paddingLeft: `${(element.paddingLeft ?? 12)}px`
                                }}
                                placeholder={element.placeholder}
                                rows={3}
                                readOnly
                            />
                        ) : element.type === 'select' ? (
                            <div className="relative">
                                <select className={clsx(
                                    "w-full rounded-lg text-slate-500 text-sm appearance-none",
                                    isFormProject && "border border-slate-200"
                                )} style={{
                                    backgroundColor: element.backgroundColor,
                                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                                }} disabled>
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
                            <div className={clsx(
                                "flex items-center rounded-lg",
                                isFormProject && "border border-slate-200"
                            )} style={{
                                backgroundColor: element.backgroundColor, // Remove default #f8fafc to allow transparent/dark mode
                                paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
                                paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
                                paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
                                paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined
                            }}>
                                <input type="checkbox" className="h-4 w-4 text-brand-600 rounded border-slate-300" disabled />
                                <span className="ml-3 text-sm text-slate-600">{element.placeholder || 'Checkbox option'}</span>
                            </div>
                        ) : element.type === 'radio' ? (
                            <div className={clsx(
                                "space-y-2 rounded-lg",
                                isFormProject && "border border-slate-200"
                            )} style={{
                                backgroundColor: element.backgroundColor,
                                paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
                                paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
                                paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
                                paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined
                            }}>
                                {(element.options || [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }]).map((opt, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <input type="radio" name={`radio - ${element.id}`} className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500" disabled />
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
                        ) : element.type === 'rows' ? (
                            <RowsContent element={element} />
                        ) : element.type === 'grid' ? (
                            <ContainerContent element={element} />
                        ) : element.type === 'hidden' ? (
                            <div className={clsx(
                                "flex items-center bg-slate-100 rounded-lg opacity-60",
                                isFormProject && "border border-slate-300"
                            )} style={{
                                paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '12px',
                                paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '12px',
                                paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '12px',
                                paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '12px'
                            }}>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <EyeOff size={16} />
                                    <span className="text-sm font-mono">Hidden: {element.value || 'No value'}</span>
                                </div>
                            </div>
                        ) : element.type === 'rich-text' ? (
                            <div
                                className={clsx(
                                    "rounded-lg",
                                    isFormProject && "border border-slate-200"
                                )}
                                style={{
                                    backgroundColor: element.backgroundColor || 'transparent',
                                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : '0',
                                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : '0',
                                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : '0',
                                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : '0'
                                }}
                            >
                                {isSelected ? (
                                    <RichTextEditor
                                        selectedElement={element}
                                        onContentChange={(content) => updateElement(element.id, { content })}
                                        className={clsx(
                                            "p-0 m-0 border-none", // No internal padding/margin/border
                                            !element.textColor && "text-slate-600",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                    />
                                ) : (
                                    <div
                                        className={clsx(
                                            !element.textColor && "text-slate-600",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                        style={{
                                            fontFamily: element.fontFamily || undefined,
                                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                                            fontWeight: element.fontWeight || undefined,
                                            color: element.textColor || undefined,
                                            lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                                            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
                                            margin: 0 // Ensure no margins
                                        }}
                                        dangerouslySetInnerHTML={{ __html: element.content || '<p>Click to edit rich text...</p>' }}
                                    />
                                )}
                            </div>
                        ) : element.type === 'button' ? (
                            <div className="relative">
                                <button
                                    type={element.buttonType || 'button'}
                                    className={clsx(
                                        "font-medium rounded-lg border",
                                        element.buttonSize === 'sm' && "text-sm",
                                        element.buttonSize === 'lg' && "text-lg",
                                        (!element.buttonSize || element.buttonSize === 'md') && "text-base",
                                        element.buttonStyle === 'primary' && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                                        element.buttonStyle === 'secondary' && "bg-gray-600 border-gray-600 text-white hover:bg-gray-700",
                                        element.buttonStyle === 'outline' && "bg-transparent border-gray-300 text-gray-700",
                                        element.buttonStyle === 'text' && "bg-transparent border-transparent text-blue-600 hover:bg-blue-50",
                                        element.buttonStyle === 'link' && "bg-transparent border-transparent text-blue-600 hover:text-blue-800 hover:underline",
                                        (!element.buttonStyle || element.buttonStyle === 'primary') && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                                    )}
                                    style={{
                                        backgroundColor: element.backgroundColor && element.buttonStyle !== 'text' && element.buttonStyle !== 'outline' && element.buttonStyle !== 'link' ?
                                            element.backgroundColor : undefined,
                                        paddingTop: element.paddingTop !== undefined ? element.paddingTop : undefined,
                                        paddingRight: element.paddingRight !== undefined ? element.paddingRight : undefined,
                                        paddingBottom: element.paddingBottom !== undefined ? element.paddingBottom : undefined,
                                        paddingLeft: element.paddingLeft !== undefined ? element.paddingLeft : undefined,
                                        marginTop: element.marginTop !== undefined ? element.marginTop : undefined,
                                        marginRight: element.marginRight !== undefined ? element.marginRight : undefined,
                                        marginBottom: element.marginBottom !== undefined ? element.marginBottom : undefined,
                                        marginLeft: element.marginLeft !== undefined ? element.marginLeft : undefined,
                                        boxSizing: 'border-box',
                                        lineHeight: 'normal',
                                        minHeight: 'unset',
                                        height: 'auto'
                                    }}
                                    disabled
                                >
                                    {element.buttonText || element.label || 'Button'}
                                </button>
                                {element.buttonType === 'submit' && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                        ) : element.type === 'text-block' ? (
                            <div
                                className={clsx(
                                    "rounded-lg",
                                    isFormProject && "border border-slate-200"
                                )}
                                style={{
                                    backgroundColor: element.backgroundColor || 'transparent',
                                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
                                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
                                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
                                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined
                                }}
                            >
                                {isSelected ? (
                                    <RichTextEditor
                                        ref={editorRef}
                                        selectedElement={element}
                                        onContentChange={(content) => updateElement(element.id, { content })}
                                        onEditingStart={() => setIsEditingText(true)}
                                        onEditingEnd={() => setIsEditingText(false)}
                                        className={clsx(
                                            "p-0 m-0 border-none", // No internal padding/margin/border
                                            !element.textColor && "text-slate-600",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                    />
                                ) : (
                                    <div
                                        className={clsx(
                                            !element.textColor && "text-slate-600",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                        style={{
                                            fontFamily: element.fontFamily || undefined,
                                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                                            fontWeight: element.fontWeight || undefined,
                                            color: element.textColor || undefined,
                                            lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                                            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
                                            margin: 0
                                        }}
                                        dangerouslySetInnerHTML={{ __html: element.content || '<p>Click to edit this text block</p>' }}
                                    />
                                )}
                            </div>
                        ) : element.type === 'heading' ? (
                            <div
                                className={clsx(
                                    "rounded-lg",
                                    isFormProject && "border border-slate-200"
                                )}
                                style={{
                                    backgroundColor: element.backgroundColor || 'transparent',
                                    paddingTop: element.paddingTop !== undefined ? `${element.paddingTop}px` : undefined,
                                    paddingRight: element.paddingRight !== undefined ? `${element.paddingRight}px` : undefined,
                                    paddingBottom: element.paddingBottom !== undefined ? `${element.paddingBottom}px` : undefined,
                                    paddingLeft: element.paddingLeft !== undefined ? `${element.paddingLeft}px` : undefined
                                }}
                            >
                                {isSelected ? (
                                    <RichTextEditor
                                        ref={editorRef}
                                        selectedElement={element}
                                        onContentChange={(content) => updateElement(element.id, { content })}
                                        onEditingStart={() => setIsEditingText(true)}
                                        onEditingEnd={() => setIsEditingText(false)}
                                        className={clsx(
                                            "p-0 m-0 border-none", // No internal padding/margin/border
                                            !element.textColor && "text-slate-600",
                                            !element.fontWeight && "font-bold",
                                            !element.fontSize && element.headingLevel === 1 && "text-4xl",
                                            !element.fontSize && element.headingLevel === 2 && "text-3xl",
                                            !element.fontSize && element.headingLevel === 3 && "text-2xl",
                                            !element.fontSize && element.headingLevel === 4 && "text-xl",
                                            !element.fontSize && element.headingLevel === 5 && "text-lg",
                                            !element.fontSize && element.headingLevel === 6 && "text-base",
                                            !element.fontSize && !element.headingLevel && "text-4xl",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                    />
                                ) : (
                                    <div
                                        role="heading"
                                        aria-level={element.headingLevel || 1}
                                        className={clsx(
                                            "p-0 m-0 border-none w-full", // Matches RichTextEditor's internal styles exactly
                                            !element.textColor && "text-slate-600",
                                            !element.fontWeight && "font-bold",
                                            !element.fontSize && element.headingLevel === 1 && "text-4xl",
                                            !element.fontSize && element.headingLevel === 2 && "text-3xl",
                                            !element.fontSize && element.headingLevel === 3 && "text-2xl",
                                            !element.fontSize && element.headingLevel === 4 && "text-xl",
                                            !element.fontSize && element.headingLevel === 5 && "text-lg",
                                            !element.fontSize && element.headingLevel === 6 && "text-base",
                                            !element.fontSize && !element.headingLevel && "text-4xl",
                                            element.textAlign === 'left' && "text-left",
                                            element.textAlign === 'center' && "text-center",
                                            element.textAlign === 'right' && "text-right",
                                            element.textAlign === 'justify' && "text-justify",
                                            !element.textAlign && "text-left"
                                        )}
                                        style={{
                                            fontFamily: element.fontFamily || undefined,
                                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                                            fontWeight: element.fontWeight || undefined,
                                            color: element.textColor || undefined,
                                            lineHeight: element.lineHeight ? `${element.lineHeight}%` : undefined,
                                            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
                                            margin: 0
                                        }}
                                        dangerouslySetInnerHTML={{ __html: element.content || 'Heading' }}
                                    />
                                )}
                            </div>
                        ) : element.type === 'menu' ? (
                            (() => {
                                const { setNodeRef } = useDroppable({
                                    id: `menu - ${element.id}`,
                                    data: { type: 'menu', containerId: element.id }
                                });

                                return (
                                    <div
                                        ref={setNodeRef}
                                        className="min-h-[40px]"
                                        style={{
                                            display: 'flex',
                                            flexDirection: element.flexDirection || (element.menuLayout === 'vertical' ? 'column' : 'row'),
                                            flexWrap: element.flexWrap || 'nowrap',
                                            justifyContent: element.justifyContent || 'flex-start',
                                            alignItems: element.alignItems || 'center',
                                            alignContent: element.alignContent || 'flex-start',
                                            gap: element.gap || '0px'
                                        }}
                                    >
                                        {element.children && element.children.length > 0 ? (
                                            element.children.map((child) => (
                                                <SortableElement
                                                    key={child.id}
                                                    element={child}
                                                    parentId={element.id}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-gray-400 text-sm italic">
                                                Drop menu items here
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        ) : element.type === 'social' ? (
                            <div className={clsx(
                                "rounded-lg",
                                isFormProject && "border border-slate-200"
                            )} style={{
                                backgroundColor: element.backgroundColor,
                                paddingTop: element.paddingTop !== undefined ? element.paddingTop : undefined,
                                paddingRight: element.paddingRight !== undefined ? element.paddingRight : undefined,
                                paddingBottom: element.paddingBottom !== undefined ? element.paddingBottom : undefined,
                                paddingLeft: element.paddingLeft !== undefined ? element.paddingLeft : undefined
                            }}>
                                <div className={clsx(
                                    "flex gap-3",
                                    element.socialLayout === 'vertical' ? "flex-col" : "flex-row"
                                )}>
                                    {(element.socialLinks || [
                                        { platform: 'Facebook', url: '#', icon: '📘' },
                                        { platform: 'Twitter', url: '#', icon: '🐦' },
                                        { platform: 'LinkedIn', url: '#', icon: '💼' }
                                    ]).map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <span>{social.icon || '🔗'}</span>
                                            {social.platform}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : element.type === 'image' ? (
                            <div
                                className={clsx(
                                    "relative group",
                                    element.imageAlign === 'center' && "flex justify-center",
                                    element.imageAlign === 'right' && "flex justify-end",
                                    element.imageAlign === 'justify' && "flex justify-center",
                                    (!element.imageAlign || element.imageAlign === 'left') && "flex justify-start"
                                )}
                                style={{
                                    width: `${element.imageWidthPercent || 100}%`,
                                    marginLeft: element.imageAlign === 'center' ? 'auto' : element.imageAlign === 'right' ? 'auto' : undefined,
                                    marginRight: element.imageAlign === 'center' ? 'auto' : element.imageAlign === 'right' ? undefined : element.imageAlign === 'left' ? 'auto' : undefined
                                }}
                            >
                                <img
                                    src={element.imageUrl || 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image'}
                                    alt={element.imageAlt || 'Image'}
                                    className="rounded-lg block h-auto w-full"
                                    style={{
                                        backgroundColor: element.backgroundColor
                                    }}
                                />
                                {/* Corner resize handles for professional image editing */}
                                {isSelected && (
                                    <>
                                        {/* Top-left corner */}
                                        <div
                                            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-sm cursor-nw-resize shadow-md opacity-100 z-40"
                                            onMouseDown={(e) => handleImageResize(e, 'nw')}
                                            title="Resize from top-left corner"
                                        />
                                        {/* Top-right corner */}
                                        <div
                                            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-sm cursor-ne-resize shadow-md opacity-100 z-40"
                                            onMouseDown={(e) => handleImageResize(e, 'ne')}
                                            title="Resize from top-right corner"
                                        />
                                        {/* Bottom-left corner */}
                                        <div
                                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-sm cursor-sw-resize shadow-md opacity-100 z-40"
                                            onMouseDown={(e) => handleImageResize(e, 'sw')}
                                            title="Resize from bottom-left corner"
                                        />
                                        {/* Bottom-right corner */}
                                        <div
                                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-sm cursor-se-resize shadow-md opacity-100 z-40"
                                            onMouseDown={(e) => handleImageResize(e, 'se')}
                                            title="Resize from bottom-right corner"
                                        />
                                    </>
                                )}
                            </div>
                        ) : (
                            <input
                                type={element.type}
                                className={clsx(
                                    "w-full rounded-lg text-slate-500 text-sm",
                                    isFormProject && "border border-slate-200"
                                )}
                                style={{
                                    backgroundColor: element.backgroundColor,
                                    paddingTop: element.paddingTop !== undefined ? element.paddingTop : undefined,
                                    paddingRight: element.paddingRight !== undefined ? element.paddingRight : undefined,
                                    paddingBottom: element.paddingBottom !== undefined ? element.paddingBottom : undefined,
                                    paddingLeft: element.paddingLeft !== undefined ? element.paddingLeft : undefined
                                }}
                                placeholder={element.placeholder}
                                readOnly
                            />
                        )
                    })()}
                </div>
            </div >

            {/* Category Modal */}
            < CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSelectCategory={(category) => {
                    saveElementAsBlock(element, category);
                    setShowCategoryModal(false);
                }}
            />
        </div >
    );
};

const CanvasStartDropZone: React.FC = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-start',
        data: { type: 'canvas-start' }
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "h-16 flex items-center justify-center transition-all",
                isOver ? "bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg" : "bg-transparent border-2 border-dashed border-transparent"
            )}
        >
            {isOver && (
                <div className="text-blue-600 text-sm font-medium">
                    Drop here
                </div>
            )}
        </div>
    );
};

const CanvasEndDropZone: React.FC = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-end',
        data: { type: 'canvas-end' }
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "h-16 flex items-center justify-center transition-all",
                isOver ? "bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg" : "bg-transparent border-2 border-dashed border-transparent"
            )}
        >
            {isOver && (
                <div className="text-blue-600 text-sm font-medium">
                    Drop here
                </div>
            )}
        </div>
    );
};

export const Canvas: React.FC = () => {
    const { elements, selectElement, settings, currentProject, toggleCanvasTheme } = useStore();
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div
            className="form-builder-canvas flex flex-col h-full"
            onClick={() => selectElement(null)}
        >
            {/* Canvas Toolbar - Always visible against App Theme */}
            <div className="flex justify-end items-center px-4 py-2 bg-transparent">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 px-3 py-1.5">
                    <span className="text-xs font-medium text-slate-600 dark:text-gray-400">Canvas Theme:</span>
                    <button
                        onClick={toggleCanvasTheme}
                        className={clsx(
                            "p-1.5 rounded-md transition-colors",
                            "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
                            "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                        )}
                        title={`Switch to ${settings.canvasTheme === 'dark' ? 'light' : 'dark'} canvas`}
                    >
                        {settings.canvasTheme !== 'dark' && <Sun size={14} />}
                        {settings.canvasTheme === 'dark' && <Moon size={14} />}
                    </button>
                    <div className="w-px h-3 bg-slate-200 dark:bg-gray-700 mx-1"></div>
                    <span className="text-xs text-slate-400 dark:text-gray-500 capitalize">
                        {settings.canvasTheme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                </div>
            </div>

            <div
                className="form-builder-canvas-inner flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: settings.contentAlignment === 'center' ? 'center' :
                        settings.contentAlignment === 'right' ? 'flex-end' : 'flex-start'
                }}
            >
                <div
                    ref={setNodeRef}
                    className={clsx(
                        "flex-1 rounded-2xl shadow-card transition-colors duration-300",
                        currentProject?.type !== 'form' && "pt-0",
                        currentProject?.type === 'form' && "pt-8",
                        // Empty state alignment
                        elements.length === 0 && "form-builder-canvas-empty flex items-center justify-center",
                        // Apply canvas theme locally - independent of Main App Theme
                        settings.canvasTheme === 'dark' ? "bg-gray-900 text-gray-100 dark" : "bg-white text-gray-900"
                    )}
                    style={{
                        backgroundColor: settings.formBackground || (
                            settings.canvasTheme === 'dark' ? '#111827' : '#ffffff'
                        ),
                        color: settings.textColor || undefined,
                        width: settings.contentWidth ? `${settings.contentWidth}px` : '100%',
                        maxWidth: settings.contentWidth ? `${settings.contentWidth}px` : 'none',
                        // Ensure padding for empty state
                        paddingBottom: '2rem'
                    }}
                >
                    {elements.length === 0 ? (
                        <div className={clsx(
                            "form-builder-canvas-empty-content text-center max-w-md mx-auto p-8 rounded-xl border-2 border-dashed",
                            settings.canvasTheme === 'dark'
                                ? "border-gray-700 bg-gray-800/50"
                                : "border-slate-200 bg-slate-50/50"
                        )}>
                            <div className={clsx(
                                "form-builder-canvas-empty-icon w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
                                settings.canvasTheme === 'dark' ? "bg-gray-800 text-gray-400" : "bg-white text-slate-400 shadow-sm"
                            )}>
                                <Info size={32} />
                            </div>
                            <h3 className={clsx(
                                "form-builder-canvas-empty-title text-lg font-semibold mb-2",
                                settings.canvasTheme === 'dark' ? "text-gray-200" : "text-slate-800"
                            )}>
                                Start Building
                            </h3>
                            <p className={clsx(
                                "form-builder-canvas-empty-text text-sm",
                                settings.canvasTheme === 'dark' ? "text-gray-400" : "text-slate-500"
                            )}>
                                Drag elements from the sidebar to start constructing your form. Use the up/down arrows to reorder elements.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col px-8"
                        >
                            {/* Start of canvas drop zone - only for form projects */}
                            {currentProject?.type === 'form' && <CanvasStartDropZone />}
                            {elements.map((element) => (
                                <SortableElement key={element.id} element={element} />
                            ))}
                            {/* End of canvas drop zone */}
                            <CanvasEndDropZone />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};