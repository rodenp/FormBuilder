import { Columns } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'columns' as FormElementType,
    label: 'Columns',
    icon: Columns,
    category: 'layout',
    defaultSettings: {
        columnCount: 2, // Default to 2 columns
        gap: 16,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 16, // Default margin bottom for layout blocks
        marginLeft: 0,
        marginRight: 0,
        width: '100%'
    }
};
