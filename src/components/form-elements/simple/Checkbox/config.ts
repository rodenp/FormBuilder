import { CheckSquare } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    category: 'Selection & Date'
};

export const defaultSettings = {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
