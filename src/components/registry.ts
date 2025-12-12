
import type { FormElement, FormElementType } from '../types';
import * as React from 'react';

export interface ComponentConfig {
    type: FormElementType;
    label: string;
    icon?: React.ComponentType<any>;
    category: string;
}

export interface RegisteredComponent {
    Component?: React.ComponentType<{ element: FormElement }>;
    Properties: React.ComponentType<{ element: FormElement; updateElement: (id: string, updates: Partial<FormElement>) => void }>;
    config: ComponentConfig;
    defaultSettings?: any;
}

class Registry {
    private components: Map<string, RegisteredComponent> = new Map();

    register(type: string, component: RegisteredComponent) {
        this.components.set(type, component);
    }

    get(type: string): RegisteredComponent | undefined {
        return this.components.get(type);
    }

    getAll(): RegisteredComponent[] {
        return Array.from(this.components.values());
    }
}

export const registry = new Registry();
