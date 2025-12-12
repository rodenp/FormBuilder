
import { registry } from '../../../registry';
import { Component } from './Component';
import { config, defaultSettings } from './config';

// Temporary placeholder for properties if needed, or null if handled generically
const Properties = () => null;

registry.register('button', {
    Component,
    Properties,
    config,
    defaultSettings
});
