import { Radio } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'radio',
    label: 'Radio Group',
    icon: Radio,
    category: 'Selection & Date'
};

export const defaultSettings = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
