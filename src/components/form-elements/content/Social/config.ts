

import { Share2 } from 'lucide-react';
import type { ComponentConfig } from '../../../registry';
import { typeDefaults } from '../../../../settings/defaultSettings';

export const config: ComponentConfig = {
    type: 'social',
    label: 'Social Links',
    icon: Share2,
    category: 'content'
};

export const defaultSettings = {
    ...typeDefaults['social'],
    socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
        { platform: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
        { platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
        { platform: 'linkedin', url: 'https://linkedin.com', icon: 'linkedin' }
    ],
    gap: 16,
    justifyContent: 'center',
    buttonStyle: 'text',
    fontSize: 24
};

