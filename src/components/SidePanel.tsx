import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { BodyPropertiesPanel } from './BodyPropertiesPanel';
import { BrandPropertiesPanel } from './BrandPropertiesPanel';
import { ChevronRight, ChevronLeft, Bookmark, Trash2, Folder, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { FormElement } from '../types';
import { getComponentHtml } from '../utils/componentHtml';
import { CategoryModal } from './CategoryModal';

type ActiveTab = 'content' | 'blocks' | 'body' | 'brand';

// Helper function to find current version of a component in the canvas
const findCurrentElement = (blockTemplate: FormElement, canvasElements: FormElement[]): FormElement | null => {
    // Calculate a structural score to find the best match
    const calculateStructuralScore = (element: FormElement, template: FormElement): number => {
        let score = 0;

        // Type match is crucial
        if (element.type === template.type) score += 10;

        // Label match is important
        if (element.label === template.label) score += 5;

        // Child count similarity
        const elementChildCount = element.children?.filter(Boolean).length || 0;
        const templateChildCount = template.children?.filter(Boolean).length || 0;
        if (elementChildCount === templateChildCount) score += 3;

        // Background color match (if set)
        if (element.backgroundColor && template.backgroundColor &&
            element.backgroundColor === template.backgroundColor) score += 2;

        // Width match
        if (element.width === template.width) score += 1;

        return score;
    };

    const findBestMatch = (elements: FormElement[], bestMatch = { element: null as FormElement | null, score: 0 }): FormElement | null => {
        for (const element of elements) {
            const score = calculateStructuralScore(element, blockTemplate);
            if (score > bestMatch.score && score >= 10) { // Minimum threshold
                bestMatch = { element, score };
            }

            // Search recursively in children
            if (element.children) {
                findBestMatch(element.children.filter(Boolean), bestMatch);
            }
        }
        return bestMatch.element;
    };

    return findBestMatch(canvasElements);
};


// Custom Block Item component for dragging with visual preview
const CustomBlockItem: React.FC<{ block: FormElement; onRemove: () => void; onEditCategory: () => void; canvasElements: FormElement[] }> = ({ block, onRemove, onEditCategory, canvasElements }) => {
    const { currentProject } = useStore();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `custom-block-${block.id}`,
        data: { type: 'custom-block', block }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
    } : {};

    // Find current version of this element in the canvas
    const currentElement = findCurrentElement(block, canvasElements);
    const elementToRender = currentElement || block;
    const isShowingCurrentVersion = currentElement !== null;

    // Generate a friendly name for the block
    const blockName = elementToRender.label || `${elementToRender.type.charAt(0).toUpperCase() + elementToRender.type.slice(1)} Block`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all"
            {...listeners}
            {...attributes}
        >
            {/* Header with edit category and remove buttons */}
            <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory();
                    }}
                    className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm text-slate-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="Edit category"
                >
                    <Edit2 size={12} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm text-slate-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Remove block"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            {/* Visual Preview */}
            <div className="p-2">
                <div className="relative" style={{
                    transformOrigin: 'top left',
                    transform: 'scale(0.6)',
                    width: '166.67%', // 1/0.6 to compensate for scale
                    pointerEvents: 'none'
                }}>
                    {getComponentHtml(elementToRender, {
                        isFormProject: currentProject?.type === 'form',
                        showInteractiveElements: false
                    })}
                </div>
            </div>
        </div>
    );
};

export const SidePanel: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingBlock, setEditingBlock] = useState<FormElement | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
    const { selectedElementId, customBlocks, removeCustomBlock, updateBlockCategory, elements } = useStore();

    // When an element is selected, show properties
    const shouldShowElementProperties = selectedElementId !== null;

    // Reset active tab when an element is selected
    React.useEffect(() => {
        if (selectedElementId !== null) {
            setActiveTab(null);
        }
    }, [selectedElementId]);

    const toggleCategoryCollapse = (category: string) => {
        setCollapsedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const renderContent = () => {
        // Context-aware content: 
        // - When tab is active: show tab content (overrides element properties)
        // - When element is selected and no tab active: show element properties
        // - When canvas selected and no tab active: show form properties

        // If a tab is active, always show tab content
        if (activeTab !== null) {
            switch (activeTab) {
                case 'content':
                    return <Sidebar />;
                case 'blocks':
                    return (
                        <div className="p-4 h-full bg-white dark:bg-gray-900">
                            {customBlocks.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bookmark size={20} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">No custom blocks yet</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Save components with children as reusable blocks using the bookmark icon in the toolbar
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 overflow-y-auto">
                                    {(() => {
                                        // Group blocks by category
                                        const groupedBlocks = customBlocks.reduce((acc, block) => {
                                            const category = block.category || 'Uncategorized';
                                            if (!acc[category]) {
                                                acc[category] = [];
                                            }
                                            acc[category].push(block);
                                            return acc;
                                        }, {} as Record<string, FormElement[]>);

                                        return Object.entries(groupedBlocks).map(([category, blocks]) => {
                                            const isCollapsed = collapsedCategories.has(category);
                                            return (
                                                <div key={category} className="space-y-2">
                                                    <button
                                                        onClick={() => toggleCategoryCollapse(category)}
                                                        className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors group"
                                                    >
                                                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-left">
                                                            {category}
                                                        </h4>
                                                        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                            {isCollapsed ? (
                                                                <ChevronDown size={12} className="text-gray-500 dark:text-gray-400" />
                                                            ) : (
                                                                <ChevronUp size={12} className="text-gray-500 dark:text-gray-400" />
                                                            )}
                                                        </div>
                                                    </button>
                                                    {!isCollapsed && (
                                                        <div className="space-y-2">
                                                            {blocks.map((block) => (
                                                                <CustomBlockItem
                                                                    key={block.id}
                                                                    block={block}
                                                                    onRemove={() => removeCustomBlock(block.id)}
                                                                    onEditCategory={() => {
                                                                        setEditingBlock(block);
                                                                        setShowCategoryModal(true);
                                                                    }}
                                                                    canvasElements={elements}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            )}
                        </div>
                    );
                case 'body':
                    return <BodyPropertiesPanel />;
                case 'brand':
                    return <BrandPropertiesPanel />;
                default:
                    return <PropertiesPanel />;
            }
        }

        // No tab active, show properties
        return <PropertiesPanel />;
    };

    if (isCollapsed) {
        return (
            <div className="flex relative">
                {/* Collapsed state - just the expand button */}
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 z-50"
                    title="Expand panel"
                >
                    <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </button>

                {/* Right sidebar menu - always shown even when collapsed */}
                <div className="w-16 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-6">
                    {/* Content tab */}
                    <button
                        onClick={() => {
                            setActiveTab('content');
                            setIsCollapsed(false); // Expand when tab is clicked
                        }}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'content'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        title="Content"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-xs font-medium">Content</span>
                    </button>

                    {/* Blocks tab */}
                    <button
                        onClick={() => {
                            setActiveTab('blocks');
                            setIsCollapsed(false); // Expand when tab is clicked
                        }}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'blocks'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        title="Blocks"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                        </svg>
                        <span className="text-xs font-medium">Blocks</span>
                    </button>

                    {/* Body tab */}
                    <button
                        onClick={() => {
                            setActiveTab('body');
                            setIsCollapsed(false); // Expand when tab is clicked
                        }}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'body'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        title="Body"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 8H16" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 16H12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-xs font-medium">Body</span>
                    </button>

                    {/* Brand tab */}
                    <button
                        onClick={() => {
                            setActiveTab('brand');
                            setIsCollapsed(false); // Expand when tab is clicked
                        }}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'brand'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        title="Brand"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 1V5" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 19V23" stroke="currentColor" strokeWidth="2" />
                            <path d="M4.22 4.22L6.32 6.32" stroke="currentColor" strokeWidth="2" />
                            <path d="M17.68 17.68L19.78 19.78" stroke="currentColor" strokeWidth="2" />
                            <path d="M1 12H5" stroke="currentColor" strokeWidth="2" />
                            <path d="M19 12H23" stroke="currentColor" strokeWidth="2" />
                            <path d="M4.22 19.78L6.32 17.68" stroke="currentColor" strokeWidth="2" />
                            <path d="M17.68 6.32L19.78 4.22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-xs font-medium">Brand</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex relative h-full">
            {/* Collapse button */}
            <button
                onClick={() => setIsCollapsed(true)}
                className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 z-50"
                title="Collapse panel"
            >
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Main content panel */}
            <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col">
                {/* Content area */}
                <div className="flex-1 overflow-auto">
                    {renderContent()}
                </div>
            </div>

            {/* Right sidebar menu - always shown */}
            <div className="w-16 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-6">
                {/* Content tab */}
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'content'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    title="Content"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs font-medium">Content</span>
                </button>

                {/* Blocks tab */}
                <button
                    onClick={() => setActiveTab('blocks')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'blocks'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    title="Blocks"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1" />
                    </svg>
                    <span className="text-xs font-medium">Blocks</span>
                </button>

                {/* Body tab */}
                <button
                    onClick={() => setActiveTab('body')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'body'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    title="Body"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 8H16" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 16H12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs font-medium">Body</span>
                </button>

                {/* Brand tab */}
                <button
                    onClick={() => setActiveTab('brand')}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${activeTab === 'brand'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    title="Brand"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 1V5" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 19V23" stroke="currentColor" strokeWidth="2" />
                        <path d="M4.22 4.22L6.32 6.32" stroke="currentColor" strokeWidth="2" />
                        <path d="M17.68 17.68L19.78 19.78" stroke="currentColor" strokeWidth="2" />
                        <path d="M1 12H5" stroke="currentColor" strokeWidth="2" />
                        <path d="M19 12H23" stroke="currentColor" strokeWidth="2" />
                        <path d="M4.22 19.78L6.32 17.68" stroke="currentColor" strokeWidth="2" />
                        <path d="M17.68 6.32L19.78 4.22" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs font-medium">Brand</span>
                </button>
            </div>

            {/* Category Modal for editing block categories */}
            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => {
                    setShowCategoryModal(false);
                    setEditingBlock(null);
                }}
                onSelectCategory={(category) => {
                    if (editingBlock) {
                        updateBlockCategory(editingBlock.id, category);
                    }
                    setShowCategoryModal(false);
                    setEditingBlock(null);
                }}
                currentCategory={editingBlock?.category}
            />
        </div>
    );
};