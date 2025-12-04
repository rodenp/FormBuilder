
export type ProjectType = 'form' | 'email' | 'website';

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
    | 'text-block'
    | 'star-rating'
    | 'container'
    | 'columns'
    | 'rows'
    | 'grid'
    | 'button'
    // Email-specific components
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'divider'
    | 'spacer'
    // Website-specific components
    | 'navigation'
    | 'hero'
    | 'card'
    | 'footer'
    | 'menu'
    | 'social';

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
    rowGap?: number;
    columnGap?: number;
    columnBackgrounds?: string[]; // Individual background colors for each column cell
    selectedColumnIndex?: number; // For tracking which column cell is selected
    // Spacing settings
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    // Layout settings (for containers)
    display?: 'block' | 'flex' | 'grid';
    flexDirection?: 'row' | 'column';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch';
    gridColumns?: number;
    // Alignment settings (for non-containers)
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    // For Label styling
    labelSize?: 'xs' | 'sm' | 'base' | 'lg';
    labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    labelGap?: number; // Gap between label and content
    // For Label formatting
    labelBold?: boolean;
    labelItalic?: boolean;
    labelUnderline?: boolean;
    labelStrikethrough?: boolean;
    // For Hidden field
    value?: string;
    // For Rich Text
    content?: string;
    // For Button
    buttonText?: string;
    buttonType?: 'button' | 'submit' | 'reset';
    buttonStyle?: 'primary' | 'secondary' | 'outline' | 'text';
    buttonSize?: 'sm' | 'md' | 'lg';
    buttonAction?: 'none' | 'submit' | 'url';
    buttonUrl?: string;
    buttonTarget?: '_blank' | '_self';
    // Background color
    backgroundColor?: string;
    // For Heading
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    // For Image
    imageUrl?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    // For Navigation
    navItems?: { label: string; href: string; }[];
    // For Hero section
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    heroButtonText?: string;
    heroButtonUrl?: string;
    // For Card
    cardTitle?: string;
    cardDescription?: string;
    cardImage?: string;
    cardLink?: string;
    // For Menu
    menuItems?: { label: string; href: string; target?: '_blank' | '_self' }[];
    menuLayout?: 'horizontal' | 'vertical';
    // For Social
    socialLinks?: { platform: string; url: string; icon?: string }[];
    socialLayout?: 'horizontal' | 'vertical';
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

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    createdAt: string;
    updatedAt: string;
    settings: FormSettings;
    elements: FormElement[];
}

export interface FormSchema {
    id: string;
    settings: FormSettings;
    elements: FormElement[];
}
