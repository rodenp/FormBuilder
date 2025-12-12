
import { registry } from '../../../registry';
import { Component } from './Component';
import { config, defaultSettings } from './config';

// Temporary placeholder for properties
const Properties = () => null;

registry.register(config.type, {
    Component,
    Properties,
    config,
    defaultSettings
});
