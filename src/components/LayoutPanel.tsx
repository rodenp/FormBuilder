import React, { useState } from 'react';
import type { FormElement } from '../types';
import { useStore } from '../store/useStore';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface LayoutPanelProps {
    selectedElement: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
}


export const LayoutPanel: React.FC<LayoutPanelProps> = ({ selectedElement, updateElement }) => {
    const { elements } = useStore();
    const isContainer = selectedElement.type === 'container' || selectedElement.type === 'columns' || selectedElement.type === 'rows' || selectedElement.type === 'grid' || selectedElement.type === 'menu' || selectedElement.type === 'social';
    
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
    
    // Set defaults for column cells
    React.useEffect(() => {
        if (isColumnCellContainer && selectedElement.display !== 'flex') {
            updateElement(selectedElement.id, { 
                display: 'flex',
                flexDirection: 'column'
            });
        }
    }, [isColumnCellContainer, selectedElement.display, selectedElement.id]);
    
    const generatePreviewStyle = () => {
        const p = {
            top: selectedElement.paddingTop ?? 16,
            right: selectedElement.paddingRight ?? 16,
            bottom: selectedElement.paddingBottom ?? 16,
            left: selectedElement.paddingLeft ?? 16
        };
        
        if (isContainer) {
            // Auto-set layout for columns, rows, and grid
            let display, flexDirection;
            if (selectedElement.type === 'columns') {
                display = 'flex';
                flexDirection = 'row';
            } else if (selectedElement.type === 'rows') {
                display = 'flex';
                flexDirection = 'column';
            } else if (selectedElement.type === 'grid') {
                display = 'grid';
                flexDirection = undefined;
            } else {
                display = selectedElement.display ?? 'flex';
                flexDirection = selectedElement.flexDirection ?? 'row';
            }
            
            if (display === 'flex') {
                return {
                    display: 'flex',
                    flexDirection: flexDirection,
                    flexWrap: selectedElement.flexWrap ?? 'wrap',
                    justifyContent: selectedElement.justifyContent ?? 'flex-start',
                    alignItems: selectedElement.alignItems ?? 'flex-start',
                    alignContent: selectedElement.alignContent ?? 'flex-start',
                    rowGap: `${selectedElement.rowGap ?? 0}px`,
                    columnGap: `${selectedElement.columnGap ?? 0}px`,
                    padding: `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
                    minHeight: '200px'
                };
            } else if (display === 'grid') {
                return {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${selectedElement.gridColumns ?? 3}, auto)`,
                    justifyContent: selectedElement.justifyContent ?? 'flex-start',
                    alignItems: selectedElement.alignItems ?? 'flex-start',
                    alignContent: 'start',
                    rowGap: `${selectedElement.rowGap ?? 0}px`,
                    columnGap: `${selectedElement.columnGap ?? 0}px`,
                    padding: `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
                    minHeight: '200px'
                };
            } else {
                return {
                    display: 'block',
                    padding: `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
                    minHeight: '200px'
                };
            }
        }
        return {};
    };
    
    
    const generateCSSOutput = () => {
        const p = {
            top: selectedElement.paddingTop ?? 0,
            right: selectedElement.paddingRight ?? 0,
            bottom: selectedElement.paddingBottom ?? 0,
            left: selectedElement.paddingLeft ?? 0
        };
        
        if (isContainer) {
            const display = selectedElement.display ?? 'flex';
            if (display === 'flex') {
                return `.container {
  display: flex;
  flex-direction: ${selectedElement.flexDirection ?? 'row'};
  justify-content: ${selectedElement.justifyContent ?? 'flex-start'};
  align-items: ${selectedElement.alignItems ?? 'flex-start'};
  gap: ${selectedElement.gap ?? 0}px;
  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;
}`;
            } else if (display === 'grid') {
                return `.container {
  display: grid;
  grid-template-columns: repeat(${selectedElement.gridColumns ?? 3}, auto);
  justify-content: ${selectedElement.justifyContent ?? 'flex-start'};
  align-items: ${selectedElement.alignItems ?? 'flex-start'};
  gap: ${selectedElement.gap ?? 0}px;
  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;
}`;
            } else {
                return `.container {
  display: block;
  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;
}`;
            }
        } else {
            // Non-container elements
            let css = `.element {\n`;
            if (selectedElement.horizontalAlign === 'center') {
                css += `  margin-left: auto;\n  margin-right: auto;\n`;
            } else if (selectedElement.horizontalAlign === 'right') {
                css += `  margin-left: auto;\n`;
            }
            css += `  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;\n}`;
            return css;
        }
    };
    
    return (
        <div className="layout-panel">
            <style>
                {`
                .playground-number-input::-webkit-outer-spin-button,
                .playground-number-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                `}
            </style>
            <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Layout
                </label>
                {/* Playground button hidden */}
            </div>
            
            {isContainer && (
                <>
                    {/* Display Mode - hidden for columns, rows, grid, menu, and column cells */}
                    {!['columns', 'rows', 'grid', 'menu'].includes(selectedElement.type) && !isColumnCellContainer && (
                        <div className="mb-4">
                            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                <button
                                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                                        (selectedElement.display ?? 'flex') === 'flex' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    onClick={() => updateElement(selectedElement.id, { display: 'flex' })}
                                >
                                    Flex
                                </button>
                                <button
                                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                                        (selectedElement.display ?? 'flex') === 'grid' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    onClick={() => updateElement(selectedElement.id, { display: 'grid' })}
                                >
                                    Grid
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {(selectedElement.display ?? 'flex') === 'flex' && !['columns', 'rows', 'grid'].includes(selectedElement.type) && !isColumnCellContainer && (
                        <>
                            {/* Direction - hidden for columns, rows, and column cells */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-600 mb-2">Direction</label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 p-2 border rounded-md transition-all ${
                                            (selectedElement.flexDirection ?? 'row') === 'row'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                        }`}
                                        onClick={() => updateElement(selectedElement.id, { flexDirection: 'row' })}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            <path d="M5 12h14M13 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                    <button
                                        className={`flex-1 p-2 border rounded-md transition-all ${
                                            selectedElement.flexDirection === 'column'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                        }`}
                                        onClick={() => updateElement(selectedElement.id, { flexDirection: 'column' })}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            <path d="M12 5v14M5 13l7 7 7-7"/>
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
                                        className={`flex-1 p-2 border rounded-md transition-all ${
                                            (selectedElement.justifyContent ?? 'flex-start') === value
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-white border-gray-300 hover:border-gray-400'
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
                                        className={`flex-1 p-2 border rounded-md transition-all ${
                                            (selectedElement.alignItems ?? 'flex-start') === value
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                        }`}
                                        onClick={() => updateElement(selectedElement.id, { alignItems: value as any })}
                                        title={value === 'flex-start' ? 'Top' : value === 'flex-end' ? 'Bottom' : value === 'center' ? 'Center' : 'Stretch'}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mx-auto">
                                            {value === 'flex-start' && <path d="M12 5v10M8 9l4-4 4 4"/>}
                                            {value === 'center' && <path d="M8 12h8M12 8v8"/>}
                                            {value === 'flex-end' && <path d="M12 19V9M8 15l4 4 4-4"/>}
                                            {value === 'stretch' && <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>}
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Row Gap - for flex and grid (not columns or menu) */}
                    {(selectedElement.display ?? 'flex') !== 'block' && !['columns', 'menu'].includes(selectedElement.type) && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Row Gap: <span className="font-semibold">{selectedElement.rowGap ?? 0}px</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={selectedElement.rowGap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { rowGap: parseInt(e.target.value) })}
                                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="40"
                                    value={selectedElement.rowGap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { rowGap: parseInt(e.target.value) || 0 })}
                                    className="w-12 px-2 py-1 text-xs border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Column Gap - for flex and grid (not rows, columns, or column cells) */}
                    {(selectedElement.display ?? 'flex') !== 'block' && selectedElement.type !== 'rows' && selectedElement.type !== 'columns' && !isColumnCellContainer && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                Column Gap: <span className="font-semibold">{selectedElement.columnGap ?? 0}px</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={selectedElement.columnGap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { columnGap: parseInt(e.target.value) })}
                                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="40"
                                    value={selectedElement.columnGap ?? 0}
                                    onChange={(e) => updateElement(selectedElement.id, { columnGap: parseInt(e.target.value) || 0 })}
                                    className="w-12 px-2 py-1 text-xs border border-gray-300 rounded"
                                />
                            </div>
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
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                        </div>
                    )}
                </>
            )}
            
            {/* Text Alignment - for heading and text-block components */}
            {(selectedElement.type === 'heading' || selectedElement.type === 'text-block') && (
                <div className="mb-6">
                    <h3 className="text-xs font-medium text-gray-600 mb-3">Text Alignment</h3>
                    <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                (selectedElement.textAlign ?? 'left') === 'left'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Align Left"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                selectedElement.textAlign === 'center'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Align Center"
                        >
                            <AlignCenter size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                selectedElement.textAlign === 'right'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Align Right"
                        >
                            <AlignRight size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'justify' })}
                            className={`flex items-center justify-center w-10 h-8 rounded transition-all ${
                                selectedElement.textAlign === 'justify'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Justify"
                        >
                            <AlignJustify size={16} />
                        </button>
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
                            value={selectedElement.marginTop ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateElement(selectedElement.id, { marginTop: newValue });
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                            value={selectedElement.marginRight ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateElement(selectedElement.id, { marginRight: newValue });
                            }}
                            className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                            value={selectedElement.marginBottom ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateElement(selectedElement.id, { marginBottom: newValue });
                            }}
                            className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                            value={selectedElement.marginLeft ?? 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateElement(selectedElement.id, { marginLeft: newValue });
                            }}
                            className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                                value={selectedElement.paddingTop ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    updateElement(selectedElement.id, { paddingTop: newValue });
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                                value={selectedElement.paddingRight ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    updateElement(selectedElement.id, { paddingRight: newValue });
                                }}
                                className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                                value={selectedElement.paddingBottom ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    updateElement(selectedElement.id, { paddingBottom: newValue });
                                }}
                                className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                                value={selectedElement.paddingLeft ?? 0}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    updateElement(selectedElement.id, { paddingLeft: newValue });
                                }}
                                className="absolute border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:shadow-md"
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
                                className="text-center border rounded"
                                style={{
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderColor: '#e2e8f0',
                                    padding: '24px 12px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#64748b',
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
            {false && isPlayground && (
                <div className="mt-6 border-t pt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-xs font-medium text-gray-600">
                            Live Preview - <span className="font-semibold">{playgroundItems.length}</span> Elements
                        </h4>
                    </div>
                    <div className="border border-dashed border-gray-300 rounded-lg bg-white overflow-hidden min-h-[180px]">
                        <div 
                            style={generatePreviewStyle()} 
                            className="preview-box"
                        >
                            {isContainer && playgroundItems.map(item => {
                                const colors = {
                                    'a': 'linear-gradient(135deg, #f87171, #ef4444)',
                                    'b': 'linear-gradient(135deg, #34d399, #10b981)',
                                    'c': 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                                    'd': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                    'e': 'linear-gradient(135deg, #fb7185, #ec4899)',
                                    'f': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                                    'g': 'linear-gradient(135deg, #34d399, #059669)',
                                    'h': 'linear-gradient(135deg, #a78bfa, #7c3aed)'
                                };
                                
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            width: `${item.w}px`,
                                            ...(selectedElement.alignItems === 'stretch' && selectedElement.display !== 'block' 
                                                ? { minHeight: `${item.h}px` } 
                                                : { height: `${item.h}px` }
                                            ),
                                            background: colors[item.id as keyof typeof colors] || colors.a,
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {item.id.toUpperCase()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Item Controls */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {playgroundItems.map((item, index) => {
                            const dotColors = {
                                'a': '#ef4444',
                                'b': '#10b981',
                                'c': '#8b5cf6',
                                'd': '#f59e0b',
                                'e': '#ec4899',
                                'f': '#3b82f6',
                                'g': '#059669',
                                'h': '#7c3aed'
                            };
                            
                            return (
                                <div key={item.id} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 rounded text-xs">
                                    <div 
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: dotColors[item.id as keyof typeof dotColors] || '#ef4444' }}
                                    />
                                    <span className="font-medium text-xs">{item.id.toUpperCase()}</span>
                                    <input
                                        type="number"
                                        value={Math.round(item.w)}
                                        onChange={(e) => updateItemSize(item.id, 'w', parseInt(e.target.value) || 50)}
                                        className="playground-number-input px-1 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                                        title="Width"
                                        style={{ 
                                            width: '32px',
                                            fontSize: '10px',
                                            MozAppearance: 'textfield'
                                        }}
                                    />
                                    <span className="text-gray-400" style={{ fontSize: '10px' }}>×</span>
                                    <input
                                        type="number"
                                        value={Math.round(item.h)}
                                        onChange={(e) => updateItemSize(item.id, 'h', parseInt(e.target.value) || 50)}
                                        className="playground-number-input px-1 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                                        title="Height"
                                        style={{ 
                                            width: '32px',
                                            fontSize: '10px',
                                            MozAppearance: 'textfield'
                                        }}
                                    />
                                    {playgroundItems.length > 1 && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 font-bold leading-none"
                                            title="Remove"
                                            style={{ fontSize: '12px' }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <button
                            onClick={addItem}
                            className="flex items-center gap-1 px-3 py-2 border border-dashed border-gray-300 rounded-md text-xs text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                </div>
            )}
            
            
        </div>
    );
};