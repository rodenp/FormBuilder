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
        gap: 12,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0,
        width: '100%'
    }
};
