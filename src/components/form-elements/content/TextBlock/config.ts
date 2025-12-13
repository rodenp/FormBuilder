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
    marginTop: "16px",
    marginBottom: "16px",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    lineHeight: "100%",
    letterSpacing: "0px"
};
