import { registry } from '../../../registry';
import { Component } from './Component';
import { Properties } from './Properties';
import { config, defaultSettings } from './config';

registry.register(config.type, {
    Component,
    Properties,
    config,
    defaultSettings
});
