# @form-builder/core

A powerful, drag-and-drop form builder for React applications with TypeScript support.

## Features

- 🎨 **Drag & Drop Interface** - Intuitive form building experience
- 🎯 **TypeScript Support** - Full type safety and IntelliSense
- 🎨 **Customizable Styling** - Tailwind CSS with custom themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔧 **Rich Field Types** - Text, email, select, radio, checkbox, and more
- 📊 **Form Preview** - Real-time preview of your forms
- 💾 **JSON Schema Export** - Export forms as JSON for storage
- ⚡ **Zero Dependencies** - Only peer dependencies on React

## Installation

```bash
npm install @form-builder/core
```

### Peer Dependencies

```bash
npm install react react-dom
```

## Quick Start

### Form Builder

```tsx
import { FormBuilder } from '@form-builder/core';
import type { FormSchema } from '@form-builder/core';

function App() {
  const handleSave = (schema: FormSchema) => {
    console.log('Form saved:', schema);
    // Save to your backend
  };

  return (
    <div className="h-screen">
      <FormBuilder 
        onSave={handleSave}
        showPreview={true}
      />
    </div>
  );
}
```

### Form Renderer

```tsx
import { FormRenderer } from '@form-builder/core';
import type { FormSchema } from '@form-builder/core';

const formSchema: FormSchema = {
  // Your form configuration
};

function ContactForm() {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    // Process form submission
  };

  return (
    <FormRenderer 
      schema={formSchema}
      onSubmit={handleSubmit}
    />
  );
}
```

### Using the Hook

```tsx
import { useFormBuilder } from '@form-builder/core';

function MyFormBuilder() {
  const {
    elements,
    settings,
    addElement,
    updateSettings,
    getFormSchema,
    loadFormSchema
  } = useFormBuilder();

  const handleAddTextField = () => {
    addElement('text');
  };

  const saveForm = () => {
    const schema = getFormSchema();
    // Save to your backend
  };

  return (
    <div>
      <button onClick={handleAddTextField}>
        Add Text Field
      </button>
      <button onClick={saveForm}>
        Save Form
      </button>
    </div>
  );
}
```

## Components

### FormBuilder

The main form builder component with drag-and-drop interface.

**Props:**
- `onSave?: (schema: FormSchema) => void` - Called when form is saved
- `onPreview?: (schema: FormSchema) => void` - Called when previewing
- `initialSchema?: FormSchema` - Initial form to load
- `showPreview?: boolean` - Show preview toggle (default: true)
- `className?: string` - Additional CSS classes

### FormRenderer

Renders a form from a schema for end users to fill out.

**Props:**
- `schema: FormSchema` - The form schema to render
- `onSubmit: (data: any) => void | Promise<void>` - Form submission handler
- `isLoading?: boolean` - Show loading state (default: false)
- `className?: string` - Additional CSS classes

## Supported Field Types

- **Text** - Single line text input
- **Email** - Email input with validation
- **Number** - Numeric input
- **Textarea** - Multi-line text
- **Select** - Dropdown selection
- **Radio** - Radio button groups
- **Checkbox** - Single checkbox
- **Date** - Date picker
- **Time** - Time picker
- **Month** - Month picker
- **Hidden** - Hidden form fields
- **Rich Text** - HTML content (display only)
- **Star Rating** - Star rating input
- **Container** - Group fields together
- **Columns** - Multi-column layout

## Form Schema Structure

```typescript
interface FormSchema {
  id: string;
  settings: FormSettings;
  elements: FormElement[];
}

interface FormSettings {
  title: string;
  description?: string;
  submitButtonText: string;
  gap?: number;
  submissionActions: SubmissionAction[];
  // Styling options
  primaryColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputBorderStyle?: 'rounded' | 'square' | 'pill';
  formBackground?: string;
}

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  width?: number; // 1-12 (grid columns)
  options?: { label: string; value: string }[];
  // ... other field-specific properties
}
```

## Styling

The form builder uses Tailwind CSS classes. Make sure you have Tailwind CSS configured in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@form-builder/core/dist/**/*.{js,ts,jsx,tsx}"
  ],
  // ... rest of your config
}
```

## Advanced Usage

### Custom Form Actions

```tsx
const formSchema: FormSchema = {
  id: 'my-form',
  settings: {
    title: 'Contact Form',
    submitButtonText: 'Send Message',
    submissionActions: [
      {
        id: 'webhook-1',
        type: 'webhook',
        enabled: true,
        webhook: {
          url: 'https://api.example.com/webhook',
          method: 'POST'
        }
      },
      {
        id: 'redirect-1', 
        type: 'redirect',
        enabled: true,
        redirectUrl: 'https://example.com/thank-you',
        openInNewTab: false
      }
    ]
  },
  elements: [
    // ... your form elements
  ]
};
```

### Form Validation

```tsx
import { FormRenderer } from '@form-builder/core';

const schema: FormSchema = {
  // ... other properties
  elements: [
    {
      id: 'email-field',
      type: 'email',
      label: 'Email Address',
      name: 'email',
      required: true,
      validation: {
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }
    }
  ]
};
```

### Custom Styling

```tsx
<FormBuilder
  className="h-full bg-gray-100"
  initialSchema={{
    settings: {
      primaryColor: '#10B981', // Custom green
      buttonStyle: 'pill',
      inputBorderStyle: 'rounded'
    }
  }}
/>
```

## Integration Examples

### With Next.js and Convex

```tsx
'use client'

import { FormBuilder } from '@form-builder/core';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

export default function BuilderPage() {
  const saveForm = useMutation(api.forms.save);

  const handleSave = async (schema: FormSchema) => {
    await saveForm({
      formId: schema.id,
      config: schema
    });
  };

  return (
    <div className="h-screen">
      <FormBuilder onSave={handleSave} />
    </div>
  );
}
```

### With React and Axios

```tsx
import { FormRenderer } from '@form-builder/core';
import axios from 'axios';

function MyForm({ schema }: { schema: FormSchema }) {
  const handleSubmit = async (data: any) => {
    try {
      await axios.post('/api/forms/submit', {
        formId: schema.id,
        data
      });
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <FormRenderer 
      schema={schema}
      onSubmit={handleSubmit}
    />
  );
}
```

## License

MIT