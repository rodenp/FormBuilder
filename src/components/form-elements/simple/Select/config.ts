import { List } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'select',
    label: 'Dropdown',
    icon: List,
    category: 'Basic Fields'
};

export const defaultSettings = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
