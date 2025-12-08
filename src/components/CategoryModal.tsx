import React, { useState, useEffect } from 'react';
import { X, Plus, Folder } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCategory: (category: string) => void;
    currentCategory?: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSelectCategory, currentCategory }) => {
    const { customBlocks } = useStore();
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || '');
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    
    // Extract unique categories from custom blocks
    const existingCategories = Array.from(new Set(
        customBlocks
            .map(block => block.category)
            .filter(cat => cat && cat !== '')
    )).sort();
    
    useEffect(() => {
        setSelectedCategory(currentCategory || '');
    }, [currentCategory]);
    
    if (!isOpen) return null;
    
    const handleSelectCategory = () => {
        if (selectedCategory) {
            onSelectCategory(selectedCategory);
            onClose();
        }
    };
    
    const handleCreateCategory = () => {
        if (newCategory.trim()) {
            setSelectedCategory(newCategory.trim());
            onSelectCategory(newCategory.trim());
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {currentCategory ? 'Edit Category' : 'Select Block Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    {/* Existing Categories */}
                    {existingCategories.length > 0 && !showNewCategoryInput && (
                        <div className="space-y-2 mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select existing category
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {existingCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={clsx(
                                            "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                                            selectedCategory === category
                                                ? "border-brand-500 bg-brand-50 text-brand-700"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <Folder size={16} className={selectedCategory === category ? "text-brand-600" : "text-slate-400"} />
                                        <span className="font-medium">{category}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* New Category Input */}
                    {showNewCategoryInput ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Create new category
                                </label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Enter category name"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateCategory();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setShowNewCategoryInput(false);
                                    setNewCategory('');
                                }}
                                className="text-sm text-slate-500 hover:text-slate-700"
                            >
                                ← Back to existing categories
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowNewCategoryInput(true)}
                            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all"
                        >
                            <Plus size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">Create new category</span>
                        </button>
                    )}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    {showNewCategoryInput ? (
                        <button
                            onClick={handleCreateCategory}
                            disabled={!newCategory.trim()}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                newCategory.trim()
                                    ? "bg-brand-600 text-white hover:bg-brand-700"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            Create & Select
                        </button>
                    ) : (
                        <button
                            onClick={handleSelectCategory}
                            disabled={!selectedCategory}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                selectedCategory
                                    ? "bg-brand-600 text-white hover:bg-brand-700"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            Select Category
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};