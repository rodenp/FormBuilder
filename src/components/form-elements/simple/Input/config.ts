
import type { FormElementType } from '../../../../types';
import { Type } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';
import type { ComponentSettings } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'text' as FormElementType, // We will register this for multiple types
    label: 'Text Input',
    icon: Type,
    category: 'Form Elements'
};

export const defaultSettings: Partial<ComponentSettings> = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
