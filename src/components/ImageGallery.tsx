import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Upload, Link as LinkIcon, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { GalleryImage } from '../types';

interface ImageGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect?: (image: GalleryImage) => void;
    mode?: 'picker' | 'manage'; // picker for selecting, manage for full management
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    isOpen,
    onClose,
    onImageSelect,
    mode = 'picker'
}) => {
    const { imageGallery, addImageToGallery, removeImageFromGallery, updateGalleryImage } = useStore();
    const [showUpload, setShowUpload] = useState(false);
    const [showUrlForm, setShowUrlForm] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [altInput, setAltInput] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const url = e.target?.result as string;
                    const newImage = addImageToGallery({
                        name: file.name,
                        url,
                        type: 'upload',
                        alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for alt
                        size: file.size
                    });

                    // Auto-load image dimensions
                    const img = new Image();
                    img.onload = () => {
                        updateGalleryImage(newImage.id, {
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                    };
                    img.src = url;
                };
                reader.readAsDataURL(file);
            }
        });

        setShowUpload(false);
    };

    // Handle URL form submit
    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput.trim()) return;

        const newImage = addImageToGallery({
            name: nameInput || 'URL Image',
            url: urlInput,
            type: 'url',
            alt: altInput || nameInput || 'URL Image'
        });

        // Auto-load image dimensions
        const img = new Image();
        img.onload = () => {
            updateGalleryImage(newImage.id, {
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.src = urlInput;

        setUrlInput('');
        setNameInput('');
        setAltInput('');
        setShowUrlForm(false);
    };

    // Handle image edit
    const handleImageEdit = (image: GalleryImage) => {
        setEditingImage(image);
        setNameInput(image.name);
        setAltInput(image.alt || '');
    };

    // Save image edits
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingImage) return;

        updateGalleryImage(editingImage.id, {
            name: nameInput,
            alt: altInput
        });

        setEditingImage(null);
        setNameInput('');
        setAltInput('');
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col mx-4 dark:border dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="text-slate-600 dark:text-gray-400" size={24} />
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-100">
                            {mode === 'picker' ? 'Choose Image' : 'Image Gallery'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Add Images Section */}
                <div className="p-6 border-b border-slate-200 dark:border-gray-700">
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowUpload(!showUpload);
                                setShowUrlForm(false);
                            }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                                showUpload
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                    : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
                            )}
                        >
                            <Upload size={16} />
                            Upload Images
                        </button>
                        <button
                            onClick={() => {
                                setShowUrlForm(!showUrlForm);
                                setShowUpload(false);
                            }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                                showUrlForm
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                    : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
                            )}
                        >
                            <LinkIcon size={16} />
                            Add URL
                        </button>
                    </div>

                    {/* Upload Area */}
                    {showUpload && (
                        <div className="mt-4">
                            <div
                                className={clsx(
                                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                                    dragOver
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                                        : "border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-800"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={32} className="mx-auto mb-3 text-slate-400 dark:text-gray-500" />
                                <p className="text-slate-600 dark:text-gray-300 font-medium mb-1">
                                    Drop images here or click to browse
                                </p>
                                <p className="text-slate-400 dark:text-gray-500 text-sm">
                                    Supports JPG, PNG, GIF, WebP
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                            </div>
                        </div>
                    )}

                    {/* URL Form */}
                    {showUrlForm && (
                        <form onSubmit={handleUrlSubmit} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="My image"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={altInput}
                                    onChange={(e) => setAltInput(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Description of the image"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUrlForm(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Gallery Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {imageGallery.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon size={48} className="mx-auto mb-3 text-slate-300 dark:text-gray-600" />
                            <p className="text-slate-500 dark:text-gray-400 font-medium mb-1">No images in gallery</p>
                            <p className="text-slate-400 dark:text-gray-500 text-sm">Upload images or add URLs to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageGallery.map((image) => (
                                <div
                                    key={image.id}
                                    className={clsx(
                                        "group relative border rounded-lg overflow-hidden transition-all dark:bg-gray-800",
                                        mode === 'picker'
                                            ? "border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer hover:shadow-md"
                                            : "border-slate-200 dark:border-gray-700"
                                    )}
                                    onClick={() => mode === 'picker' && onImageSelect?.(image)}
                                >
                                    <div className="aspect-square bg-slate-100 dark:bg-gray-900 flex items-center justify-center">
                                        <img
                                            src={image.url}
                                            alt={image.alt || image.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div class="text-slate-400 text-center">
                                                            <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                                            </svg>
                                                            <p class="text-xs">Failed to load</p>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Image Info */}
                                    <div className="p-2 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700">
                                        <p className="text-xs font-medium text-slate-700 dark:text-gray-200 truncate" title={image.name}>
                                            {image.name}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className={clsx(
                                                "text-xs px-1.5 py-0.5 rounded",
                                                image.type === 'upload'
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                            )}>
                                                {image.type === 'upload' ? 'Upload' : 'URL'}
                                            </span>
                                            {image.width && image.height && (
                                                <span className="text-xs text-slate-500">
                                                    {image.width}×{image.height}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {mode === 'manage' && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleImageEdit(image);
                                                }}
                                                className="p-1 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 transition-colors"
                                            >
                                                <Edit2 size={12} className="text-slate-600" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImageFromGallery(image.id);
                                                }}
                                                className="p-1 bg-white border border-slate-200 rounded shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                                            >
                                                <Trash2 size={12} className="text-red-600" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Image</h3>
                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        value={altInput}
                                        onChange={(e) => setAltInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingImage(null)}
                                        className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {mode === 'picker' && (
                    <div className="p-6 border-t border-slate-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Select an image from your gallery
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};