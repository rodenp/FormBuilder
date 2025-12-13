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
    marginTop: "16px",
    marginBottom: "16px",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    lineHeight: "100%",
    letterSpacing: "0px"
};
