import { BoxSelect } from 'lucide-react';
import type { FormElementType } from '../../../../types';

export const config = {
    type: 'container' as FormElementType,
    label: 'Container',
    icon: BoxSelect,
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
        marginBottom: "16px",
        marginLeft: "0px",
        marginRight: "0px",
        width: '100%'
    }
};
