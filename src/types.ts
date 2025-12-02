
export type FormElementType =
    | 'text'
    | 'number'
    | 'email'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'date'
    | 'time'
    | 'month'
    | 'hidden'
    | 'rich-text'
    | 'star-rating'
    | 'container'
    | 'columns';

export interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    name: string; // Unique name for data submission
    placeholder?: string;
    required: boolean;
    width?: number; // 1-12
    options?: { label: string; value: string }[]; // For select inputs
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    // For Star Rating
    maxStars?: number;
    // For Container & Columns
    children?: FormElement[];
    // For Columns
    columnCount?: number;
    gap?: number;
    // Spacing settings
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    // For Label styling
    labelSize?: 'xs' | 'sm' | 'base' | 'lg';
    labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    // For Label formatting
    labelBold?: boolean;
    labelItalic?: boolean;
    labelUnderline?: boolean;
    labelStrikethrough?: boolean;
    // For Hidden field
    value?: string;
    // For Rich Text
    content?: string;
}

export interface WebhookAction {
    id: string;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH';
    headers?: { [key: string]: string };
    enabled: boolean;
}

export interface SubmissionAction {
    id: string;
    type: 'redirect' | 'webhook' | 'message';
    enabled: boolean;
    // For redirect
    redirectUrl?: string;
    openInNewTab?: boolean;
    // For webhook
    webhook?: WebhookAction;
    // For message
    message?: string;
    messageType?: 'success' | 'info' | 'warning' | 'error';
}

export interface FormSettings {
    title: string;
    description?: string;
    submitButtonText: string;
    gap?: number; // Grid gap in pixels (or tailwind class level)
    submissionActions: SubmissionAction[];
    // Legacy webhook support (deprecated)
    webhookUrl?: string;
    // Form action configuration
    formAction?: string;
    formMethod?: 'GET' | 'POST';
    formTarget?: '_blank' | '_self' | '_parent' | '_top' | string;
    // Styling options
    primaryColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
    inputBorderStyle?: 'rounded' | 'square' | 'pill';
    formBackground?: string;
}

export interface FormSchema {
    id: string;
    settings: FormSettings;
    elements: FormElement[];
}
