# Advanced Form Builder Integration Guide

This guide shows how to integrate the advanced form builder with unlimited nesting, dynamic styling, and comprehensive submission actions into your React/Next.js applications using the NPM package approach.

## 🚀 New Features Covered

- **Unlimited Nesting**: Containers inside containers with full functionality
- **Enhanced Duplicate**: Copy functionality works at all nesting levels  
- **Dynamic Styling**: Real-time theming with comprehensive styling controls
- **Advanced Actions**: Multiple submission actions (webhooks, redirects, messages)
- **NPM Package**: Standalone `@form-builder/core` package for easy integration
- **Recursive Operations**: All CRUD operations support unlimited nesting depth

## 📦 Integration Using NPM Package (Recommended)

### Step 1: Install the Package

```bash
npm install @form-builder/core
```

### Step 2: Import and Use Components

```typescript
// Import the form builder and renderer
import { FormBuilder, FormRenderer } from '@form-builder/core';
import '@form-builder/core/dist/style.css';

// Use the Form Builder
function MyFormBuilder() {
  const handleSave = (schema: FormSchema) => {
    console.log('Form saved:', schema);
    // Save to your backend
  };

  return (
    <FormBuilder 
      onSave={handleSave}
      showPreview={true}
      initialSchema={existingFormSchema} // Optional
    />
  );
}

// Use the Form Renderer
function MyForm() {
  const formSchema = {
    settings: { 
      title: 'My Advanced Form',
      primaryColor: '#3B82F6',
      formBackground: '#FFFFFF',
      submissionActions: [
        {
          type: 'webhook',
          enabled: true,
          webhook: {
            url: 'https://api.example.com/webhook',
            method: 'POST',
            headers: { 'Authorization': 'Bearer token' }
          }
        },
        {
          type: 'message',
          enabled: true,
          message: 'Thank you for your submission!',
          messageType: 'success'
        }
      ]
    },
    elements: [
      // Nested container example
      {
        id: 'container1',
        type: 'container',
        label: 'Contact Information',
        children: [
          {
            id: 'columns1',
            type: 'columns',
            columnCount: 2,
            children: [
              {
                id: 'firstName',
                type: 'text',
                label: 'First Name',
                required: true
              },
              {
                id: 'lastName', 
                type: 'text',
                label: 'Last Name',
                required: true
              }
            ]
          },
          {
            id: 'nestedContainer',
            type: 'container',
            label: 'Address Details',
            children: [
              {
                id: 'email',
                type: 'email',
                label: 'Email Address',
                required: true
              }
            ]
          }
        ]
      }
    ]
  };

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <FormRenderer 
      schema={formSchema} 
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}
```

## 🏗️ Integration with Next.js + Convex

### Step 1: Next.js App Setup

```typescript
// app/builder/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FormBuilder } from '@form-builder/core'
import type { FormSchema } from '@form-builder/core'

export default function BuilderPage() {
  const router = useRouter()
  const saveForm = useMutation(api.forms.saveForm)
  const [saving, setSaving] = useState(false)

  const handleSave = async (schema: FormSchema) => {
    setSaving(true)
    try {
      const formId = await saveForm({
        formId: schema.id,
        config: schema,
      })
      
      // Redirect to form view
      router.push(`/forms/${formId}`)
    } catch (error) {
      console.error('Failed to save form:', error)
      alert('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <FormBuilder 
        onSave={handleSave}
        showPreview={true}
      />
      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Saving form...</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Step 2: Form Display Page

```typescript
// app/forms/[id]/page.tsx
'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FormRenderer } from '@form-builder/core'
import Link from 'next/link'

export default function FormPage({ params }: { params: { id: string } }) {
  const form = useQuery(api.forms.getForm, { formId: params.id })
  const submitForm = useMutation(api.formSubmissions.submitForm)

  const handleSubmit = async (data: any) => {
    if (!form) return;

    try {
      await submitForm({
        formId: form.formId,
        formTitle: form.config.settings.title,
        data,
        actions: form.config.settings.submissionActions,
      });

      // Handle client-side actions (redirects, messages)
      const clientActions = form.config.settings.submissionActions?.filter(
        (action: any) => action.enabled && ['redirect', 'message'].includes(action.type)
      ) || [];

      for (const action of clientActions) {
        if (action.type === 'redirect' && action.redirectUrl) {
          if (action.openInNewTab) {
            window.open(action.redirectUrl, '_blank');
          } else {
            window.location.href = action.redirectUrl;
          }
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/builder" className="text-blue-600">
              ← Edit Form
            </Link>
          </div>
          <FormRenderer 
            schema={form.config} 
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
```

## 🔧 React Vite Integration

### Setup with Vite

```typescript
// src/pages/Builder.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { FormBuilder } from '@form-builder/core'
import type { FormSchema } from '@form-builder/core'

export const BuilderPage = () => {
  const navigate = useNavigate()
  const saveForm = useMutation(api.forms.saveForm)
  const [saving, setSaving] = useState(false)

  const handleSave = async (schema: FormSchema) => {
    setSaving(true)
    try {
      const formId = await saveForm({
        formId: schema.id,
        config: schema,
      })
      
      navigate(`/forms/${formId}`)
    } catch (error) {
      console.error('Failed to save form:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen">
      <FormBuilder onSave={handleSave} />
    </div>
  )
}
```

## 🗄️ Enhanced Convex Schema

### Updated Schema for Advanced Features

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  forms: defineTable({
    formId: v.string(),
    config: v.any(), // Enhanced form schema with nesting support
    createdAt: v.string(),
    updatedAt: v.string(),
    published: v.boolean(),
    version: v.number(),
    // Advanced features
    ownerId: v.optional(v.string()),
    collaborators: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  }).index("by_form_id", ["formId"]),
  
  formSubmissions: defineTable({
    formId: v.string(),
    formTitle: v.string(),
    data: v.any(),
    submittedAt: v.string(),
    processed: v.boolean(),
    actionResults: v.optional(v.array(v.any())), // Store action execution results
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  }).index("by_form", ["formId"]),

  formTemplates: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    config: v.any(), // Template configuration
    createdAt: v.string(),
    isPublic: v.boolean(),
  }).index("by_category", ["category"]),
});
```

### Enhanced Convex Functions

```typescript
// convex/forms.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveForm = mutation({
  args: {
    formId: v.string(),
    config: v.any(),
    ownerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("forms")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();

    const formData = {
      formId: args.formId,
      config: args.config,
      updatedAt: new Date().toISOString(),
      ownerId: args.ownerId,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...formData,
        version: (existing.version || 1) + 1,
      });
      return args.formId;
    } else {
      await ctx.db.insert("forms", {
        ...formData,
        createdAt: new Date().toISOString(),
        published: true,
        version: 1,
        isPublic: true,
      });
      return args.formId;
    }
  },
});

export const getForm = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();
  },
});

export const listForms = query({
  args: { ownerId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("forms");
    
    if (args.ownerId) {
      query = query.filter(q => q.eq(q.field("ownerId"), args.ownerId));
    }
    
    return await query.order("desc").collect();
  },
});

export const duplicateForm = mutation({
  args: { 
    formId: v.string(),
    newTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const original = await ctx.db
      .query("forms")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();

    if (!original) throw new Error("Form not found");

    const newFormId = `form-${Date.now()}`;
    const newConfig = {
      ...original.config,
      id: newFormId,
      settings: {
        ...original.config.settings,
        title: args.newTitle || `${original.config.settings.title} (Copy)`,
      }
    };

    await ctx.db.insert("forms", {
      formId: newFormId,
      config: newConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      version: 1,
      ownerId: original.ownerId,
    });

    return newFormId;
  },
});
```

## 🎨 Advanced Styling Integration

### Using Dynamic Theming

```typescript
// components/ThemedFormRenderer.tsx
import { FormRenderer } from '@form-builder/core';

export const ThemedFormRenderer = ({ schema, onSubmit }) => {
  return (
    <div 
      style={{ 
        '--primary-color': schema.settings.primaryColor || '#3B82F6',
        '--form-background': schema.settings.formBackground || '#FFFFFF',
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px ${schema.settings.primaryColor}33;
          }
          .custom-button {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }
          .form-container {
            background-color: var(--form-background);
          }
        `
      }} />
      <FormRenderer schema={schema} onSubmit={onSubmit} />
    </div>
  );
};
```

## 📊 Form Analytics and Management

### Create a Form Dashboard

```typescript
// components/FormDashboard.tsx
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import Link from 'next/link';

export const FormDashboard = () => {
  const forms = useQuery(api.forms.listForms);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Link href="/builder">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Create New Form
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms?.map(form => (
          <div key={form._id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              {form.config.settings.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {form.config.elements.length} fields • Version {form.version || 1}
            </p>
            <div className="flex gap-2">
              <Link href={`/builder?id=${form.formId}`}>
                <button className="px-3 py-1 text-sm border rounded">
                  Edit
                </button>
              </Link>
              <Link href={`/forms/${form.formId}`}>
                <button className="px-3 py-1 text-sm border rounded">
                  View
                </button>
              </Link>
              <Link href={`/forms/${form.formId}/analytics`}>
                <button className="px-3 py-1 text-sm border rounded">
                  Analytics
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🚀 Key Features Demonstrated

### Unlimited Nesting Support
- ✅ **Containers in Containers**: Nest container components infinitely
- ✅ **Components in Nested Containers**: Form inputs work at any nesting level
- ✅ **Columns in Containers**: Column layouts inside container components
- ✅ **Mixed Nesting**: Any combination of containers and columns

### Advanced Functionality
- ✅ **Recursive Duplication**: Copy functionality works for nested elements
- ✅ **Dynamic Styling**: Real-time theming and preview
- ✅ **Multiple Actions**: Webhooks, redirects, messages with conditional logic
- ✅ **NPM Package**: Easy integration with any React project
- ✅ **TypeScript Support**: Full type safety throughout

## 📚 Package Exports

The `@form-builder/core` package exports:

```typescript
// Main components
export { FormBuilder } from './components/FormBuilder';
export { FormRenderer } from './components/FormRenderer';

// Store and utilities
export { useStore } from './store/useStore';

// Types
export type { 
  FormElement, 
  FormSchema, 
  FormSettings, 
  FormElementType,
  SubmissionAction
} from './types';

// Utility functions
export { generateFormSchema } from './utils/formUtils';
```

## 🔧 Advanced Configuration

### Custom Theme Integration

```typescript
// themes/customTheme.ts
export const customTheme = {
  primaryColor: '#8B5CF6', // Purple
  formBackground: '#F8FAFC',
  inputBorderStyle: 'rounded',
  buttonStyle: 'pill',
  labelFormatting: {
    size: 'sm',
    weight: 'medium',
    bold: false,
    italic: false,
  }
};

// Usage in FormRenderer
<FormRenderer 
  schema={{
    ...formSchema,
    settings: {
      ...formSchema.settings,
      ...customTheme
    }
  }}
  onSubmit={handleSubmit}
/>
```

This integration guide provides everything needed to implement the advanced form builder with all its powerful features including unlimited nesting, dynamic styling, and comprehensive submission actions.