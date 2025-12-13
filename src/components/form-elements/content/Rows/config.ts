import { Rows } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'rows' as FormElementType,
    label: 'Rows',
    icon: Rows,
    category: 'layout',
    defaultSettings: {
        rowCount: 2, // Default to 2 rows
        gap: "12px", // Vertical gap
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        marginTop: "0px",
        marginBottom: "16px", // Default margin bottom for layout blocks
        marginLeft: "0px",
        marginRight: "0px",
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};
