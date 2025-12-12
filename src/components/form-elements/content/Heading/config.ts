import { Heading } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';

export const config: ComponentConfig = {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    category: 'Content'
};

export const defaultSettings = {
    headingLevel: 1,
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
};
