
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
    marginTop: "16px",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px"
};
