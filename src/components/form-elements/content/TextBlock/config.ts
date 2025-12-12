import { Text } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'text-block',
    label: 'Paragraph',
    icon: Text,
    category: 'Content'
};

export const defaultSettings = {
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
