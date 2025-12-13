import { Columns } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'columns' as FormElementType,
    label: 'Columns',
    icon: Columns,
    category: 'layout',
    defaultSettings: {
        columnCount: 2, // Default to 2 columns
        gap: "16px",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        marginTop: "0px",
        marginBottom: "16px", // Default margin bottom for layout blocks
        marginLeft: "0px",
        marginRight: "0px",
        width: '100%'
    }
};
