import React, { useState, useEffect } from 'react';
import { ImageGallery } from './ImageGallery';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import type { GalleryImage } from '../types';

interface ImagePickerProps {
    selectedImageUrl?: string;
    onImageSelect: (imageUrl: string, image?: GalleryImage) => void;
    className?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
    selectedImageUrl,
    onImageSelect,
    className
}) => {
    const [showGallery, setShowGallery] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageSelect = (image: GalleryImage) => {
        onImageSelect(image.url, image);
        setShowGallery(false);
        setImageError(false);
    };

    // Reset error state when URL changes
    useEffect(() => {
        setImageError(false);
    }, [selectedImageUrl]);

    return (
        <>
            <div 
                className="w-full rounded-lg p-2 bg-white cursor-pointer"
                onClick={() => setShowGallery(true)}
                style={{ minHeight: '120px' }}
            >
                {selectedImageUrl ? (
                    <img 
                        src={selectedImageUrl} 
                        alt="Preview"
                        className="w-full object-contain rounded bg-white"
                        style={{ maxHeight: '120px' }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-50 rounded flex flex-col items-center justify-center text-gray-500">
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