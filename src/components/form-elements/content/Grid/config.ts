import { Grid } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'grid' as FormElementType,
    label: 'Grid',
    icon: Grid,
    category: 'layout',
    defaultSettings: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignContent: 'flex-start',
        gap: "12px",
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
