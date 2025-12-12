
import { Image } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';
import type { ComponentSettings } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'image',
    label: 'Image',
    icon: Image,
    category: 'Content'
};

export const defaultSettings: Partial<ComponentSettings> = {
    // Default settings are now handled in src/settings/defaultSettings.ts
    // But we can keep component specific defaults here if needed, 
    // though the pattern is to move them to the central file.
    // For now, consistent with other components, we might leave empty or set minimal defaults not covered globally.
    imageWidthPercent: 100,
    imageAlign: 'left',
    imageUrl: 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image',
    imageAlt: 'Image'
};
