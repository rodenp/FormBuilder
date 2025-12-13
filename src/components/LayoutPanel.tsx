///Users/osx/Applications/AI/Form Builder/src/components/LayoutPanel.tsx
import React from 'react';
import type { FormElement } from '../types';
import { useStore } from '../store/useStore';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ArrowRight, ArrowDown } from 'lucide-react';

import { defaultSettings } from '../settings/defaultSettings';
import { ComponentRegistry } from './form-elements/index';

interface LayoutPanelProps {
    selectedElement: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    hideHeader?: boolean;
    boxModelOnly?: boolean;
}


export const LayoutPanel: React.FC<LayoutPanelProps> = ({ selectedElement, updateElement, hideHeader, boxModelOnly }) => {
    const { elements } = useStore();
    const isContainer = selectedElement.type === 'container' || selectedElement.type === 'columns' || selectedElement.type === 'rows' || selectedElement.type === 'grid' || selectedElement.type === 'menu' || selectedElement.type === 'social';

    // Calculate effective defaults to show in the UI (instead of 0)
    const globalDefaults = defaultSettings.global;
    const typeDefaults = defaultSettings.types[selectedElement.type] || {};
    const componentDefaults = ComponentRegistry.get(selectedElement.type)?.defaultSettings || {};

    const effectiveDefaults = {
        ...globalDefaults,
        ...typeDefaults,
        ...componentDefaults
    };

    // All padding is now handled through element properties only
    // No built-in padding calculations needed


    // Helper function to check if the selected element is a column cell
    const isColumnCell = () => {
        if (selectedElement.type !== 'container') return false;

        // Check if this container's name suggests it's a column cell
        // Column cells are created with names like "column_1", "column_2", etc.
        if (selectedElement.name && selectedElement.name.startsWith('column_')) {
            return true;
        }

        // Also check by label pattern "Column 1", "Column 2", etc.
        if (selectedElement.label && selectedElement.label.match(/^Column \d+$/)) {
            return true;
        }

        // Also check by finding parent in the elements tree
        const findParent = (elements: FormElement[]): FormElement | null => {
            for (const element of elements) {
                if (element.children) {
                    for (const child of element.children) {
                        if (child && child.id === selectedElement.id) {
                            return element;
                        }
                    }
                    // Recursively search in nested containers
                    const found = findParent(element.children.filter(Boolean));
                    if (found) return found;
                }
            }
            return null;
        };

        const parent = findParent(elements);
        return parent && parent.type === 'columns';
    };

    const isColumnCellContainer = isColumnCell();

    // Debug: temporarily log what we're detecting


    // Set defaults for column cells and fix any existing cells that don't have proper flex properties
    React.useEffect(() => {
        if (isColumnCellContainer) {
            // Always ensure column cells have proper flex properties
            const needsUpdate = selectedElement.display !== 'flex' || !selectedElement.flexDirection;
            if (needsUpdate) {
                updateElement(selectedElement.id, {
                    display: 'flex',
                    flexDirection: selectedElement.flexDirection || 'column'
                });
            }
        }
    }, [isColumnCellContainer, selectedElement.display, selectedElement.flexDirection, selectedElement.id]);




    return (
        <div className="layout-panel">
            <style>
                {`
                .playground-number-input::-webkit-outer-spin-button,
                .playground-number-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                    margin: 0;
                }
                `}
            </style>
            {!hideHeader && (
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Layout {isColumnCellContainer && <span className="text-purple-600">(Column Cell)</span>}
                    </label>
                    {/* Playground button hidden */}
                </div>
            )}

            {isContainer && !boxModelOnly && (
                <>
                    {/* Display Mode - hidden for columns, rows, grid, menu */}
                    {!['columns', 'rows', 'grid', 'menu'].includes(selectedElement.type) && (
                        <div className="mb-4">
                            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                <button
                                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${(selectedElement.display ?? 'flex') === 'flex'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                    onClick={() => updateElement(selectedElement.id, { display: 'flex' })}
                                >
                                    Flex
                                </button>
                                <button
                                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${(selectedElement.display ?? 'flex') === 'grid'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                    onClick={() => updateElement(selectedElement.id, { display: 'grid' })}
                                >
                                    Grid
                                </button>
                            </div>
                        </div>
                    )}

                    {(selectedElement.display ?? 'flex') === 'flex' && !['columns', 'rows', 'grid'].includes(selectedElement.type) && (
                        <>
                            {/* Direction - hidden for columns, rows */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-600 mb-2">Direction</label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 p-2 border rounded-md transition-all ${(selectedElement.flexDirection ?? 'row') === 'row'
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => updateElement(selectedElement.id, { flexDirection: 'row' })}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <button
                                        className={`flex-1 p-2 border rounded-md transition-all ${selectedElement.flexDirection === 'column'
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => updateElement(selectedElement.id, { flexDirection: 'column' })}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            <path d="M12 5v14M5 13l7 7 7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Spacing - for flex and grid (not rows/columns) */}
                    {(selectedElement.display ?? 'flex') !== 'block' && !['rows', 'columns'].includes(selectedElement.type) && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Spacing</label>
                            <div className="flex gap-1">
                                {['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map((value) => (
                                    <button
                                        key={value}
                                        className={`flex-1 p-2 border rounded-md transition-all ${(selectedElement.justifyContent ?? 'flex-start') === value
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'bg-white border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => updateElement(selectedElement.id, { justifyContent: value as any })}
                                        title={value}
                                    >
                                        <div className="flex items-center justify-center h-4">
                                            {value === 'flex-start' && (
                                                <div className="flex gap-0.5 justify-start w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                            {value === 'center' && (
                                                <div className="flex gap-0.5 justify-center w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                            {value === 'flex-end' && (
                                                <div className="flex gap-0.5 justify-end w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                            {value === 'space-between' && (
                                                <div className="flex justify-between w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                            {value === 'space-around' && (
                                                <div className="flex justify-around w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                            {value === 'space-evenly' && (
                                                <div className="flex justify-evenly w-full">
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                                    <div className="w-1 h-3 bg-current rounded-sm"></div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vertical Alignment - for flex and grid (not rows/columns) */}
                    {(selectedElement.display ?? 'flex') !== 'block' && !['rows', 'columns'].includes(selectedElement.type) && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Vertical Alignment</label>
                            <div className="flex gap-1">
                                {['flex-start', 'center', 'flex-end', 'stretch'].map((value) => (
                                    <button
                                        key={value}
                                        className={`flex-1 p-2 border rounded-md transition-all ${(selectedElement.alignItems ?? 'flex-start') === value
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => updateElement(selectedElement.id, { alignItems: value as any })}
                                        title={value === 'flex-start' ? 'Top' : value === 'flex-end' ? 'Bottom' : value === 'center' ? 'Center' : 'Stretch'}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            {value === 'flex-start' && <path d="M12 5v10M8 9l4-4 4 4" />}
                                            {value === 'center' && <path d="M8 12h8M12 8v8" />}
                                            {value === 'flex-end' && <path d="M12 19V9M8 15l4 4 4-4" />}
                                            {value === 'stretch' && <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />}
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gap - for flex and grid (direction-aware, replaces rowGap/columnGap) */}
                    {(selectedElement.display ?? 'flex') !== 'block' && !['columns', 'rows'].includes(selectedElement.type) && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Gap: <span className="font-semibold">{selectedElement.gap ?? 0}px</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={selectedElement.gap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { gap: parseInt(e.target.value) })}
                                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="40"
                                    value={selectedElement.gap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { gap: parseInt(e.target.value) || 0 })}
                                    className="w-12 px-2 py-1 text-xs border border-gray-300 rounded"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Direction-aware spacing between items</p>
                        </div>
                    )}

                    {/* Grid Columns - only for grid */}
                    {selectedElement.display === 'grid' && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Columns</label>
                            <input
                                type="number"
                                min="1"
                                max="6"
                                value={selectedElement.gridColumns ?? 3}
                                onChange={(e) => updateElement(selectedElement.id, { gridColumns: parseInt(e.target.value) || 1 })}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                            />
                        </div>
                    )}
                </>
            )}

            {/* Text Alignment - for heading and text-block components */}
            {(selectedElement.type === 'heading' || selectedElement.type === 'text-block') && (
                <div className="mb-6">
                    <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">Text Alignment</h3>
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${(selectedElement.textAlign ?? 'left') === 'left'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            title="Align Left"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'center'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            title="Align Center"
                        >
                            <AlignCenter size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'right'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            title="Align Right"
                        >
                            <AlignRight size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'justify' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${selectedElement.textAlign === 'justify'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            title="Justify"
                        >
                            <AlignJustify size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Simplified Alignment for Menu, Social, Columns */}
            {['menu', 'social', 'columns'].includes(selectedElement.type) && (
                <div className="mb-6 space-y-6">
                    {/* Orientation - Menu Only */}
                    {selectedElement.type === 'menu' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Orientation</label>
                            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { flexDirection: 'row' })}
                                    className={`flex items-center justify-center gap-2 flex-1 h-8 rounded transition-all ${(selectedElement.flexDirection ?? 'row') === 'row'
                                        ? 'bg-gray-800 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <ArrowRight size={16} />
                                    <span className="text-xs font-medium">Horizontal</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateElement(selectedElement.id, { flexDirection: 'column' })}
                                    className={`flex items-center justify-center gap-2 flex-1 h-8 rounded transition-all ${selectedElement.flexDirection === 'column'
                                        ? 'bg-gray-800 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <ArrowDown size={16} />
                                    <span className="text-xs font-medium">Vertical</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Alignment</label>
                        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
                            <button
                                type="button"
                                onClick={() => updateElement(selectedElement.id, { justifyContent: 'flex-start' })}
                                className={`flex items-center justify-center flex-1 h-8 rounded transition-all ${(selectedElement.justifyContent ?? 'flex-start') === 'flex-start'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title="Align Left"
                            >
                                <AlignLeft size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => updateElement(selectedElement.id, { justifyContent: 'center' })}
                                className={`flex items-center justify-center flex-1 h-8 rounded transition-all ${selectedElement.justifyContent === 'center'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title="Align Center"
                            >
                                <AlignCenter size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => updateElement(selectedElement.id, { justifyContent: 'flex-end' })}
                                className={`flex items-center justify-center flex-1 h-8 rounded transition-all ${selectedElement.justifyContent === 'flex-end'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title="Align Right"
                            >
                                <AlignRight size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => updateElement(selectedElement.id, { justifyContent: 'space-between' })}
                                className={`flex items-center justify-center flex-1 h-8 rounded transition-all ${selectedElement.justifyContent === 'space-between'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title="Space Between"
                            >
                                <AlignJustify size={16} />
                            </button>
                        </div>

                        {/* Gap Control */}
                        <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex justify-between">
                                <span>Gap</span>
                                <span className="text-slate-400 font-normal">{selectedElement.gap ?? 16}px</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="64"
                                step="4"
                                value={selectedElement.gap ?? 16}
                                onChange={(e) => updateElement(selectedElement.id, { gap: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Box Model - Margin and Padding like in mockup */}
            <div className="mt-6" style={{ padding: '20px 0', pointerEvents: 'auto' }}>
                <div className="relative w-full" style={{ padding: '0 28px', pointerEvents: 'auto' }}>
                    {/* Margin Layer */}
                    <div
                        className="relative border-2 border-dashed rounded-lg"
                        style={{
                            borderColor: '#60a5fa',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.02) 100%)',
                            padding: '36px 32px',
                            borderRadius: '10px',
                            pointerEvents: 'auto'
                        }}
                    >
                        <span
                            className="absolute text-xs font-semibold uppercase tracking-wider"
                            style={{
                                top: '8px',
                                left: '12px',
                                color: '#3b82f6',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Margin
                        </span>

                        {/* Margin inputs on edges */}
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={selectedElement.marginTop ?? effectiveDefaults.marginTop ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                const valueToSet = isNaN(newValue) ? 0 : newValue;
                                updateElement(selectedElement.id, { marginTop: valueToSet });
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                            style={{
                                width: '40px',
                                height: '26px',
                                fontSize: '12px',
                                fontWeight: '500',
                                textAlign: 'center',
                                top: '-13px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                zIndex: 9999,
                                pointerEvents: 'auto',
                                position: 'absolute'
                            }}
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={selectedElement.marginRight ?? effectiveDefaults.marginRight ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                const valueToSet = isNaN(newValue) ? 0 : newValue;
                                updateElement(selectedElement.id, { marginRight: valueToSet });
                            }}
                            className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                            style={{
                                width: '40px',
                                height: '26px',
                                fontSize: '12px',
                                fontWeight: '500',
                                textAlign: 'center',
                                right: '-24px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                zIndex: 20,
                                pointerEvents: 'auto'
                            }}
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={selectedElement.marginBottom ?? effectiveDefaults.marginBottom ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                const valueToSet = isNaN(newValue) ? 0 : newValue;
                                updateElement(selectedElement.id, { marginBottom: valueToSet });
                            }}
                            className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                            style={{
                                width: '40px',
                                height: '26px',
                                fontSize: '12px',
                                fontWeight: '500',
                                textAlign: 'center',
                                bottom: '-13px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                zIndex: 20,
                                pointerEvents: 'auto'
                            }}
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={selectedElement.marginLeft ?? effectiveDefaults.marginLeft ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                const valueToSet = isNaN(newValue) ? 0 : newValue;
                                updateElement(selectedElement.id, { marginLeft: valueToSet });
                            }}
                            className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                            style={{
                                width: '40px',
                                height: '26px',
                                fontSize: '12px',
                                fontWeight: '500',
                                textAlign: 'center',
                                left: '-24px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                zIndex: 20,
                                pointerEvents: 'auto'
                            }}
                        />

                        {/* Padding Layer */}
                        <div
                            className="relative border-2 border-dashed rounded-lg"
                            style={{
                                borderColor: '#34d399',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)',
                                padding: '36px 32px',
                                borderRadius: '8px'
                            }}
                        >
                            <span
                                className="absolute text-xs font-semibold uppercase tracking-wider"
                                style={{
                                    top: '8px',
                                    left: '12px',
                                    color: '#10b981',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Padding
                            </span>

                            {/* Padding inputs on edges */}
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={selectedElement.paddingTop ?? effectiveDefaults.paddingTop ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const valueToSet = isNaN(newValue) ? 0 : newValue;
                                    updateElement(selectedElement.id, { paddingTop: valueToSet });
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                                style={{
                                    width: '40px',
                                    height: '26px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    top: '-13px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    zIndex: 9999,
                                    pointerEvents: 'auto',
                                    position: 'absolute'
                                }}
                            />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={selectedElement.paddingRight ?? effectiveDefaults.paddingRight ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const valueToSet = isNaN(newValue) ? 0 : newValue;
                                    updateElement(selectedElement.id, { paddingRight: valueToSet });
                                }}
                                className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                                style={{
                                    width: '40px',
                                    height: '26px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    right: '-24px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    zIndex: 9999,
                                    pointerEvents: 'auto'
                                }}
                            />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={selectedElement.paddingBottom ?? effectiveDefaults.paddingBottom ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const valueToSet = isNaN(newValue) ? 0 : newValue;
                                    updateElement(selectedElement.id, { paddingBottom: valueToSet });
                                }}
                                className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                                style={{
                                    width: '40px',
                                    height: '26px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    bottom: '-13px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    zIndex: 9999,
                                    pointerEvents: 'auto'
                                }}
                            />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={selectedElement.paddingLeft ?? effectiveDefaults.paddingLeft ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const valueToSet = isNaN(newValue) ? 0 : newValue;
                                    updateElement(selectedElement.id, { paddingLeft: valueToSet });
                                }}
                                className="absolute border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md"
                                style={{
                                    width: '40px',
                                    height: '26px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    left: '-24px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    zIndex: 9999,
                                    pointerEvents: 'auto'
                                }}
                            />

                            {/* Content */}
                            <div
                                className="text-center border rounded bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400"
                                style={{
                                    padding: '24px 12px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    borderRadius: '6px'
                                }}
                            >
                                Content
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playground Preview - hidden */}


        </div>
    );
};