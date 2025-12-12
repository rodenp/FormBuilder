import { Rows } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'rows' as FormElementType,
    label: 'Rows',
    icon: Rows,
    category: 'layout',
    defaultSettings: {
        rowCount: 2, // Default to 2 rows
        gap: 12, // Vertical gap
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 16, // Default margin bottom for layout blocks
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};
