
import { registry } from '../../../registry';
import { Component } from './Component';
import { config, defaultSettings } from './config';

// Temporary placeholder for properties if needed, or null if handled generically by PropertiesPanel
const Properties = () => null;

registry.register('image', {
    Component,
    Properties,
    config,
    defaultSettings
});
