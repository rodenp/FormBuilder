import { registry } from '../../../registry';
import { config, defaultSettings } from './config';

import { MenuProperties } from './properties';

registry.register('menu', {
    Properties: MenuProperties,
    config,
    defaultSettings
});
