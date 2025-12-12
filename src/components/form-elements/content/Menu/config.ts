
import { Menu } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';
import type { ComponentSettings } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'menu',
    label: 'Menu',
    icon: Menu,
    category: 'Layout'
};

export const defaultSettings: Partial<ComponentSettings> = {
    menuLayout: 'horizontal',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16
};
