
import type { FormElementType } from '../../../../types';
import { AlignLeft } from 'lucide-react'; // Using AlignLeft as icon for TextArea
import type { ComponentConfig } from '../../../registry';
import type { ComponentSettings } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'textarea' as FormElementType,
    label: 'Text Area',
    icon: AlignLeft,
    category: 'Form Elements'
};

export const defaultSettings: Partial<ComponentSettings> = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
