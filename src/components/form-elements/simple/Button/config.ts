
import type { FormElementType } from '../../../../types';
import { Square } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';
import type { ComponentSettings } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'button' as FormElementType,
    label: 'Button',
    icon: Square,
    category: 'Form Elements'
};

export const defaultSettings: Partial<ComponentSettings> = {
    // Default settings are now handled in src/settings/defaultSettings.ts
    // to allow for centralized management and theme/type-based inheritance.
};
