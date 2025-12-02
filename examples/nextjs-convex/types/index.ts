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
  name: string;
  placeholder?: string;
  required: boolean;
  width?: number;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  // Star Rating
  maxStars?: number;
  // Container & Columns
  children?: FormElement[];
  columnCount?: number;
  // Label styling
  labelSize?: 'xs' | 'sm' | 'base' | 'lg';
  labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  labelBold?: boolean;
  labelItalic?: boolean;
  labelUnderline?: boolean;
  labelStrikethrough?: boolean;
  // Hidden field
  value?: string;
  // Rich Text
  content?: string;
}

export interface SubmissionAction {
  id: string;
  type: 'redirect' | 'webhook' | 'message';
  enabled: boolean;
  // For redirect
  redirectUrl?: string;
  openInNewTab?: boolean;
  // For webhook
  webhook?: {
    id: string;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH';
    headers?: { [key: string]: string };
    enabled: boolean;
  };
  // For message
  message?: string;
  messageType?: 'success' | 'info' | 'warning' | 'error';
}

export interface FormSettings {
  title: string;
  description?: string;
  submitButtonText: string;
  gap?: number;
  submissionActions: SubmissionAction[];
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