
import { registry } from '../../../registry';
import { Component } from './Component';
import { config, defaultSettings } from './config';

// Temporary placeholder for properties
const Properties = () => null;

const typesToRegister = ['text', 'email', 'number', 'date', 'time', 'month', 'url', 'tel', 'password'];

typesToRegister.forEach(type => {
    registry.register(type, {
        Component,
        Properties,
        config: { ...config, type: type as any },
        defaultSettings
    });
});
