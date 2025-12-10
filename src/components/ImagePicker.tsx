import React, { useState } from 'react';
import { ImageGallery } from './ImageGallery';
import { Image as ImageIcon } from 'lucide-react';
import type { GalleryImage } from '../types';

interface ImagePickerProps {
    selectedImageUrl?: string;
    onImageSelect: (imageUrl: string, image?: GalleryImage) => void;
    className?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
    selectedImageUrl,
    onImageSelect
}) => {
    const [showGallery, setShowGallery] = useState(false);

    const handleImageSelect = (image: GalleryImage) => {
        onImageSelect(image.url, image);
        setShowGallery(false);
    };


    return (
        <>
            <div
                className="w-full rounded-lg p-2 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 cursor-pointer"
                onClick={() => setShowGallery(true)}
                style={{ minHeight: '120px' }}
            >
                {selectedImageUrl ? (
                    <img
                        src={selectedImageUrl}
                        alt="Preview"
                        className="w-full object-contain rounded bg-white dark:bg-gray-900"
                        style={{ maxHeight: '120px' }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 rounded flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700">
                        <ImageIcon size={24} className="mb-2" />
                        <span className="text-xs">Choose Image</span>
                    </div>
                )}
            </div>

            <ImageGallery
                isOpen={showGallery}
                onClose={() => setShowGallery(false)}
                onImageSelect={handleImageSelect}
                mode="picker"
            />
        </>
    );
};