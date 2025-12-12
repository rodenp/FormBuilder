import { Hash } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'number',
    label: 'Number',
    icon: Hash,
    category: 'Basic Fields'
};

export const defaultSettings = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
