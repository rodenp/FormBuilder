

import { registry } from '../../../registry';
import { config, defaultSettings } from './config';
import { SocialComponent } from './Component';
import { SocialProperties } from './properties';

registry.register(config.type, {
    Component: SocialComponent,
    Properties: SocialProperties,
    config,
    defaultSettings
});

export { SocialComponent, config, defaultSettings };

