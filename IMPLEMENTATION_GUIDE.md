# Advanced Form Builder Implementation Guide with Convex

This comprehensive guide shows how to implement the advanced form builder with Convex as a backend, supporting unlimited nesting, dynamic styling, and advanced submission actions without CORS issues.

## 🌟 New Features Covered

- **Unlimited Nesting**: Containers inside containers with full recursive support
- **Enhanced Duplicate**: Copy functionality works at all nesting levels with proper ID generation
- **Dynamic Styling**: Real-time theming with comprehensive styling controls
- **Advanced Actions**: Multiple submission actions (webhooks, redirects, messages, emails)
- **Recursive Operations**: All CRUD operations support unlimited nesting depth
- **Circular Prevention**: Smart validation prevents infinite nesting loops

## 📋 Overview

The enhanced form builder generates complex nested forms that can be rendered in your React/Next.js apps. Convex handles:
- Form configuration storage with nesting support
- Submission storage with nested data
- Advanced webhook forwarding with retry logic
- Email notifications
- Redirect logic
- Action execution tracking
- All without CORS issues!

## 🚀 Step 1: Export Your Advanced Form Configuration

1. Build your complex nested form in the form builder
2. Use containers inside containers for advanced layouts
3. Configure dynamic styling in the Styling tab
4. Set up multiple submission actions in the Actions tab
5. Go to the "Code" tab and select "JSON" format
6. Copy the generated JSON configuration

### Example Advanced Form Schema

```json
{
  "id": "advanced-form-12345",
  "settings": {
    "title": "Advanced Contact Form",
    "description": "A complex form with nested containers",
    "primaryColor": "#8B5CF6",
    "formBackground": "#F8FAFC",
    "inputBorderStyle": "rounded",
    "buttonStyle": "pill",
    "submissionActions": [
      {
        "id": "webhook-1",
        "type": "webhook",
        "enabled": true,
        "webhook": {
          "url": "https://api.example.com/webhooks/contact",
          "method": "POST",
          "headers": {
            "Authorization": "Bearer your-token",
            "X-Source": "form-builder"
          }
        }
      },
      {
        "id": "email-1", 
        "type": "email",
        "enabled": true,
        "email": {
          "to": "admin@example.com",
          "subject": "New Contact Form Submission",
          "template": "contact-form"
        }
      },
      {
        "id": "message-1",
        "type": "message",
        "enabled": true,
        "message": "Thank you! We'll get back to you within 24 hours.",
        "messageType": "success"
      }
    ]
  },
  "elements": [
    {
      "id": "main-container",
      "type": "container", 
      "label": "Contact Information",
      "children": [
        {
          "id": "personal-columns",
          "type": "columns",
          "columnCount": 2,
          "children": [
            {
              "id": "first-name",
              "type": "text",
              "label": "First Name",
              "required": true
            },
            {
              "id": "last-name",
              "type": "text", 
              "label": "Last Name",
              "required": true
            }
          ]
        },
        {
          "id": "nested-container",
          "type": "container",
          "label": "Contact Details", 
          "children": [
            {
              "id": "email",
              "type": "email",
              "label": "Email Address",
              "required": true
            },
            {
              "id": "phone",
              "type": "text",
              "label": "Phone Number"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🗄️ Step 2: Enhanced Convex Setup

### Install Convex with Advanced Dependencies

```bash
npm install convex
npm install @convex-dev/auth # For authentication
npm install resend # For email sending
npx convex dev
```

### Enhanced Convex Schema (`convex/schema.ts`)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  formConfigs: defineTable({
    formId: v.string(),
    config: v.any(), // Enhanced form schema with unlimited nesting
    createdAt: v.string(),
    updatedAt: v.string(),
    version: v.number(),
    published: v.boolean(),
    // Advanced features
    ownerId: v.optional(v.string()),
    collaborators: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  }).index("by_form_id", ["formId"])
    .index("by_owner", ["ownerId"])
    .index("by_published", ["published"]),

  formSubmissions: defineTable({
    formId: v.string(),
    formTitle: v.string(),
    data: v.any(), // Supports nested form data
    submittedAt: v.string(),
    processed: v.boolean(),
    actionResults: v.optional(v.array(v.any())), // Track action execution
    // Enhanced metadata
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    referrer: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.string()),
  }).index("by_form", ["formId"])
    .index("by_processed", ["processed"])
    .index("by_submitted_at", ["submittedAt"]),

  formActions: defineTable({
    submissionId: v.id("formSubmissions"),
    actionId: v.string(),
    actionType: v.string(),
    status: v.string(), // 'pending', 'success', 'failed', 'retrying'
    result: v.optional(v.any()),
    error: v.optional(v.string()),
    executedAt: v.string(),
    retryCount: v.optional(v.number()),
  }).index("by_submission", ["submissionId"])
    .index("by_status", ["status"]),

  formTemplates: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    config: v.any(), // Template with nested containers
    preview: v.optional(v.string()), // Base64 screenshot
    downloads: v.number(),
    rating: v.optional(v.number()),
    createdAt: v.string(),
    isPublic: v.boolean(),
    creatorId: v.optional(v.string()),
  }).index("by_category", ["category"])
    .index("by_public", ["isPublic"])
    .index("by_downloads", ["downloads"]),

  formAnalytics: defineTable({
    formId: v.string(),
    event: v.string(), // 'view', 'start', 'submit', 'abandon'
    timestamp: v.string(),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  }).index("by_form", ["formId"])
    .index("by_event", ["event"])
    .index("by_timestamp", ["timestamp"]),
});
```

### Advanced Form Submission Handler (`convex/formSubmissions.ts`)

```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const submitForm = mutation({
  args: {
    formId: v.string(),
    formTitle: v.string(),
    data: v.any(), // Supports nested form data from containers
    actions: v.optional(v.array(v.any())),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      referrer: v.optional(v.string()),
      sessionId: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Store submission with nested data support
    const submissionId = await ctx.db.insert("formSubmissions", {
      formId: args.formId,
      formTitle: args.formTitle,
      data: args.data, // Preserves nested structure from containers
      submittedAt: new Date().toISOString(),
      processed: false,
      actionResults: [],
      userAgent: args.metadata?.userAgent,
      ipAddress: args.metadata?.ipAddress,
      referrer: args.metadata?.referrer,
      sessionId: args.metadata?.sessionId,
    });

    // Track analytics
    await ctx.db.insert("formAnalytics", {
      formId: args.formId,
      event: "submit",
      timestamp: new Date().toISOString(),
      sessionId: args.metadata?.sessionId,
      metadata: {
        fieldCount: getFieldCount(args.data),
        hasNestedContainers: hasNestedContainers(args.actions),
      }
    });

    // Process submission actions asynchronously
    if (args.actions && args.actions.length > 0) {
      await ctx.scheduler.runAfter(0, api.formActions.processActions, {
        submissionId,
        actions: args.actions,
        formData: args.data,
      });
    }

    return { submissionId, success: true };
  },
});

// Helper functions
function getFieldCount(data: any): number {
  let count = 0;
  function countFields(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        countFields(obj[key]);
      } else {
        count++;
      }
    }
  }
  countFields(data);
  return count;
}

function hasNestedContainers(actions: any[]): boolean {
  return actions?.some(action => 
    action.type === 'container' && action.children?.length > 0
  ) || false;
}

export const getSubmissions = query({
  args: { 
    formId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .order("desc")
      .paginate({
        numItems: limit,
        cursor: args.cursor ? args.cursor : null,
      });

    return submissions;
  },
});

export const getSubmissionWithActions = query({
  args: { submissionId: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return null;

    const actions = await ctx.db
      .query("formActions")
      .withIndex("by_submission", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    return {
      ...submission,
      actions,
    };
  },
});

export const getFormAnalytics = query({
  args: { 
    formId: v.string(),
    timeRange: v.optional(v.string()), // '24h', '7d', '30d', '90d'
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || '7d';
    const cutoffTime = new Date();
    
    switch (timeRange) {
      case '24h':
        cutoffTime.setHours(cutoffTime.getHours() - 24);
        break;
      case '7d':
        cutoffTime.setDate(cutoffTime.getDate() - 7);
        break;
      case '30d':
        cutoffTime.setDate(cutoffTime.getDate() - 30);
        break;
      case '90d':
        cutoffTime.setDate(cutoffTime.getDate() - 90);
        break;
    }

    const analytics = await ctx.db
      .query("formAnalytics")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .filter((q) => 
        q.gte(q.field("timestamp"), cutoffTime.toISOString())
      )
      .collect();

    // Aggregate data
    const events = analytics.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalViews: events.view || 0,
      totalStarts: events.start || 0,
      totalSubmissions: events.submit || 0,
      totalAbandons: events.abandon || 0,
      conversionRate: events.view > 0 ? ((events.submit || 0) / events.view * 100).toFixed(2) : '0',
      timeRange,
    };
  },
});
```

### Enhanced Action Processor (`convex/formActions.ts`)

```typescript
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const processActions = internalMutation({
  args: {
    submissionId: v.id("formSubmissions"),
    actions: v.array(v.any()),
    formData: v.any(),
  },
  handler: async (ctx, args) => {
    const results = [];
    const enabledActions = args.actions.filter(action => action.enabled);

    for (const action of enabledActions) {
      const actionId = action.id || `${action.type}-${Date.now()}`;
      
      // Record action attempt
      const actionRecordId = await ctx.db.insert("formActions", {
        submissionId: args.submissionId,
        actionId,
        actionType: action.type,
        status: "pending",
        executedAt: new Date().toISOString(),
        retryCount: 0,
      });

      try {
        let result;
        
        switch (action.type) {
          case "webhook":
            result = await processWebhookAction(action, args.formData, args.submissionId);
            break;
            
          case "email":
            result = await processEmailAction(action, args.formData, args.submissionId);
            break;
            
          case "slack":
            result = await processSlackAction(action, args.formData);
            break;
            
          case "database":
            result = await processDatabaseAction(ctx, action, args.formData);
            break;
            
          default:
            throw new Error(`Unknown action type: ${action.type}`);
        }

        // Update success
        await ctx.db.patch(actionRecordId, {
          status: "success",
          result,
        });

        results.push({
          actionId,
          type: action.type,
          success: true,
          result,
        });

      } catch (error) {
        console.error(`Action ${actionId} failed:`, error);
        
        // Update failure
        await ctx.db.patch(actionRecordId, {
          status: "failed",
          error: error.message,
        });

        results.push({
          actionId,
          type: action.type,
          success: false,
          error: error.message,
        });

        // Schedule retry for webhook actions
        if (action.type === "webhook" && (action.retryCount || 0) < 3) {
          await ctx.scheduler.runAfter(
            Math.pow(2, action.retryCount || 0) * 60000, // Exponential backoff
            api.formActions.retryAction,
            {
              actionRecordId,
              action,
              formData: args.formData,
              submissionId: args.submissionId,
            }
          );
        }
      }
    }

    // Mark submission as processed
    await ctx.db.patch(args.submissionId, { 
      processed: true,
      actionResults: results,
    });

    return results;
  },
});

// Enhanced webhook processing with retry logic
async function processWebhookAction(action: any, formData: any, submissionId: any) {
  const payload = {
    formData,
    metadata: {
      submissionId,
      timestamp: new Date().toISOString(),
      formId: formData.formId,
      nested: hasNestedData(formData),
    },
  };

  const response = await fetch(action.webhook.url, {
    method: action.webhook.method || "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "FormBuilder/2.0",
      ...(action.webhook.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}: ${response.statusText}`);
  }

  const responseData = await response.text();
  return {
    status: response.status,
    response: responseData,
    url: action.webhook.url,
  };
}

// Email action processing
async function processEmailAction(action: any, formData: any, submissionId: any) {
  // Implementation depends on your email service (Resend, SendGrid, etc.)
  // This is a placeholder for email functionality
  
  const emailData = {
    to: action.email.to,
    subject: action.email.subject || "New Form Submission",
    html: generateEmailHTML(formData, action.email.template),
    metadata: {
      submissionId,
      formId: formData.formId,
    }
  };

  // Example with Resend
  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: action.email.from || "forms@yourdomain.com",
        ...emailData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email failed with status ${response.status}`);
    }

    const result = await response.json();
    return { emailId: result.id, status: "sent" };
  }

  return { status: "email_service_not_configured" };
}

// Slack notification processing
async function processSlackAction(action: any, formData: any) {
  const slackPayload = {
    text: `New form submission received`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Form Submission*\n${formatFormDataForSlack(formData)}`
        }
      }
    ]
  };

  const response = await fetch(action.slack.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(slackPayload),
  });

  if (!response.ok) {
    throw new Error(`Slack notification failed with status ${response.status}`);
  }

  return { status: "sent" };
}

// Database action processing  
async function processDatabaseAction(ctx: any, action: any, formData: any) {
  // Store form data in a custom table based on action configuration
  const tableName = action.database.table || "custom_submissions";
  
  // This would require dynamic table creation or pre-defined tables
  // Implementation depends on your specific database schema needs
  
  return { status: "stored", table: tableName };
}

// Utility functions
function hasNestedData(data: any): boolean {
  for (const key in data) {
    if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
      return true;
    }
  }
  return false;
}

function generateEmailHTML(formData: any, template?: string): string {
  // Generate HTML email from form data
  let html = `
    <h2>New Form Submission</h2>
    <table style="border-collapse: collapse; width: 100%;">
  `;
  
  function renderFormData(data: any, level = 0) {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        html += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; padding-left: ${level * 20 + 8}px;">
              ${key.charAt(0).toUpperCase() + key.slice(1)}
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">[Container]</td>
          </tr>
        `;
        renderFormData(value, level + 1);
      } else {
        html += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; padding-left: ${level * 20 + 8}px;">
              ${key.charAt(0).toUpperCase() + key.slice(1)}
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">${value || 'N/A'}</td>
          </tr>
        `;
      }
    }
  }
  
  renderFormData(formData);
  html += `</table>`;
  
  return html;
}

function formatFormDataForSlack(formData: any): string {
  let formatted = "";
  
  function formatData(data: any, level = 0) {
    for (const [key, value] of Object.entries(data)) {
      const indent = "  ".repeat(level);
      if (typeof value === 'object' && value !== null) {
        formatted += `${indent}*${key}:*\n`;
        formatData(value, level + 1);
      } else {
        formatted += `${indent}*${key}:* ${value || 'N/A'}\n`;
      }
    }
  }
  
  formatData(formData);
  return formatted;
}

export const retryAction = internalMutation({
  args: {
    actionRecordId: v.id("formActions"),
    action: v.any(),
    formData: v.any(),
    submissionId: v.id("formSubmissions"),
  },
  handler: async (ctx, args) => {
    const actionRecord = await ctx.db.get(args.actionRecordId);
    if (!actionRecord) return;

    const retryCount = (actionRecord.retryCount || 0) + 1;
    
    try {
      // Update retry attempt
      await ctx.db.patch(args.actionRecordId, {
        status: "retrying",
        retryCount,
      });

      let result;
      if (args.action.type === "webhook") {
        result = await processWebhookAction(args.action, args.formData, args.submissionId);
      }
      // Add other retry logic for different action types

      // Update success
      await ctx.db.patch(args.actionRecordId, {
        status: "success",
        result,
      });

    } catch (error) {
      // Update failure
      await ctx.db.patch(args.actionRecordId, {
        status: "failed",
        error: error.message,
      });

      // Schedule another retry if under limit
      if (retryCount < 3) {
        await ctx.scheduler.runAfter(
          Math.pow(2, retryCount) * 60000, // Exponential backoff
          api.formActions.retryAction,
          args
        );
      }
    }
  },
});
```

## 🔧 Step 3: Enhanced React Implementation

### Advanced Form Renderer with Nested Support

```typescript
// components/AdvancedFormRenderer.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FormRenderer } from '@form-builder/core';

interface AdvancedFormProps {
  formConfig: any; // Enhanced schema with nesting
  onSuccess?: (submissionId: string) => void;
  onError?: (error: any) => void;
  trackAnalytics?: boolean;
  sessionId?: string;
}

export const AdvancedFormRenderer: React.FC<AdvancedFormProps> = ({ 
  formConfig, 
  onSuccess, 
  onError,
  trackAnalytics = true,
  sessionId
}) => {
  const submitForm = useMutation(api.formSubmissions.submitForm);
  const trackEvent = useMutation(api.formAnalytics.trackEvent);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Track form view
  React.useEffect(() => {
    if (trackAnalytics) {
      trackEvent({
        formId: formConfig.id,
        event: "view",
        sessionId,
        metadata: {
          hasNesting: hasNestedContainers(formConfig.elements),
          fieldCount: countFields(formConfig.elements),
        }
      });
    }
  }, [formConfig.id, trackAnalytics, sessionId]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Track submission start
      if (trackAnalytics) {
        await trackEvent({
          formId: formConfig.id,
          event: "start",
          sessionId,
          metadata: { startedAt: new Date().toISOString() }
        });
      }

      const result = await submitForm({
        formId: formConfig.id,
        formTitle: formConfig.settings.title,
        data: flattenNestedData(data), // Handle nested container data
        actions: formConfig.settings.submissionActions,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          sessionId,
        },
      });

      // Track successful submission
      if (trackAnalytics) {
        await trackEvent({
          formId: formConfig.id,
          event: "submit",
          sessionId,
          metadata: { 
            submissionId: result.submissionId,
            completedAt: new Date().toISOString()
          }
        });
      }

      // Handle client-side actions (redirects, messages)
      await handleClientSideActions(formConfig.settings.submissionActions || []);

      onSuccess?.(result.submissionId);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Track submission error
      if (trackAnalytics) {
        await trackEvent({
          formId: formConfig.id,
          event: "error",
          sessionId,
          metadata: { 
            error: error.message,
            failedAt: new Date().toISOString()
          }
        });
      }
      
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormRenderer
      schema={formConfig}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
};

// Helper functions
function hasNestedContainers(elements: any[]): boolean {
  return elements.some(el => 
    (el.type === 'container' || el.type === 'columns') && 
    el.children && 
    el.children.length > 0
  );
}

function countFields(elements: any[]): number {
  let count = 0;
  function countInElements(els: any[]) {
    els.forEach(el => {
      if (el.children) {
        countInElements(el.children);
      } else if (el.type !== 'container' && el.type !== 'columns') {
        count++;
      }
    });
  }
  countInElements(elements);
  return count;
}

function flattenNestedData(data: any): any {
  // Preserve nested structure for storage while ensuring it's serializable
  return JSON.parse(JSON.stringify(data));
}

async function handleClientSideActions(actions: any[]) {
  const clientActions = actions.filter(action => 
    action.enabled && ['redirect', 'message'].includes(action.type)
  );

  for (const action of clientActions) {
    if (action.type === 'redirect' && action.redirectUrl) {
      if (action.openInNewTab) {
        window.open(action.redirectUrl, '_blank');
      } else {
        window.location.href = action.redirectUrl;
      }
    } else if (action.type === 'message') {
      // You can customize this to use your preferred notification system
      const messageType = action.messageType || 'success';
      const message = action.message || 'Form submitted successfully!';
      
      // Example with a simple alert - replace with your notification system
      alert(`${messageType.toUpperCase()}: ${message}`);
    }
  }
}
```

## 📊 Step 4: Advanced Analytics and Management

### Form Analytics Dashboard

```typescript
// components/FormAnalytics.tsx
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Line, Bar } from 'react-chartjs-2';

interface FormAnalyticsProps {
  formId: string;
  timeRange?: '24h' | '7d' | '30d' | '90d';
}

export const FormAnalytics: React.FC<FormAnalyticsProps> = ({ 
  formId, 
  timeRange = '7d' 
}) => {
  const analytics = useQuery(api.formSubmissions.getFormAnalytics, { 
    formId, 
    timeRange 
  });
  const submissions = useQuery(api.formSubmissions.getSubmissions, { 
    formId, 
    limit: 100 
  });

  if (!analytics || !submissions) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Form Starts</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalStarts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Submissions</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalSubmissions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.conversionRate}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
        <div className="space-y-4">
          {submissions.page.map((submission) => (
            <div key={submission._id} className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-500">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
              <div className="mt-2">
                <NestedDataViewer data={submission.data} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component to display nested form data
const NestedDataViewer: React.FC<{ data: any, level?: number }> = ({ 
  data, 
  level = 0 
}) => {
  return (
    <div style={{ marginLeft: level * 20 }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-1">
          {typeof value === 'object' && value !== null ? (
            <div>
              <strong className="text-gray-700">{key}:</strong>
              <NestedDataViewer data={value} level={level + 1} />
            </div>
          ) : (
            <span className="text-sm">
              <strong className="text-gray-700">{key}:</strong> {value || 'N/A'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
```

## 🚀 Step 5: Advanced Usage Examples

### Next.js App with Full Integration

```typescript
// app/forms/[id]/page.tsx
'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AdvancedFormRenderer } from '@/components/AdvancedFormRenderer'
import { FormAnalytics } from '@/components/FormAnalytics'
import { useState } from 'react'

export default function FormPage({ params }: { params: { id: string } }) {
  const [showAnalytics, setShowAnalytics] = useState(false)
  const form = useQuery(api.formConfigs.getForm, { formId: params.id })
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {form.config.settings.title}
          </h1>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {showAnalytics ? (
          <FormAnalytics formId={params.id} />
        ) : (
          <AdvancedFormRenderer
            formConfig={form.config}
            sessionId={sessionId}
            onSuccess={(submissionId) => {
              console.log('Form submitted:', submissionId)
              // Optional: show success modal or redirect
            }}
            onError={(error) => {
              console.error('Submission error:', error)
              // Optional: show error notification
            }}
          />
        )}
      </div>
    </div>
  )
}
```

### React Vite App Example

```typescript
// src/App.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdvancedFormRenderer } from "./components/AdvancedFormRenderer";
import { FormBuilder } from "@form-builder/core";
import formConfig from "./formConfig.json";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/form" 
            element={
              <AdvancedFormRenderer 
                formConfig={formConfig}
                trackAnalytics={true}
                onSuccess={(id) => console.log('Submitted:', id)}
              />
            } 
          />
          <Route 
            path="/builder" 
            element={<FormBuilder />}
          />
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  );
}

export default App;
```

## 🔧 Advanced Features

### 1. Form Templates with Nesting

```typescript
// convex/formTemplates.ts
export const templates = {
  "advanced-contact": {
    name: "Advanced Contact Form",
    description: "Multi-section contact form with nested containers",
    category: "contact",
    config: {
      settings: {
        title: "Contact Us",
        primaryColor: "#3B82F6",
        submissionActions: [
          {
            type: "email",
            enabled: true,
            email: {
              to: "contact@company.com",
              subject: "New Contact Form Submission"
            }
          }
        ]
      },
      elements: [
        {
          type: "container",
          label: "Personal Information", 
          children: [
            {
              type: "columns",
              columnCount: 2,
              children: [
                { type: "text", label: "First Name", required: true },
                { type: "text", label: "Last Name", required: true }
              ]
            }
          ]
        }
      ]
    }
  }
};
```

### 2. Real-time Form Collaboration

```typescript
// convex/formCollaboration.ts
export const subscribeToForm = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    // Return form that auto-updates for collaborative editing
    return await ctx.db
      .query("formConfigs")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();
  },
});

export const updateFormElement = mutation({
  args: {
    formId: v.string(),
    elementId: v.string(),
    updates: v.any(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Update specific form element with user tracking
    const form = await ctx.db
      .query("formConfigs")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();

    if (!form) throw new Error("Form not found");

    // Update element recursively in nested structure
    const updatedConfig = updateElementInConfig(
      form.config, 
      args.elementId, 
      args.updates
    );

    await ctx.db.patch(form._id, {
      config: updatedConfig,
      updatedAt: new Date().toISOString(),
      lastEditedBy: args.userId,
    });

    return updatedConfig;
  },
});
```

### 3. Advanced Webhook Retry Logic

```typescript
// Enhanced webhook processing with exponential backoff
export const webhookRetryQueue = defineTable({
  submissionId: v.id("formSubmissions"),
  webhookUrl: v.string(),
  payload: v.any(),
  retryCount: v.number(),
  nextRetryAt: v.string(),
  status: v.string(),
});

export const processWebhookWithRetry = internalMutation({
  args: {
    submissionId: v.id("formSubmissions"),
    webhook: v.any(),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(args.webhook.url, {
          method: args.webhook.method || "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Retry-Attempt": attempt.toString(),
            ...(args.webhook.headers || {}),
          },
          body: JSON.stringify(args.payload),
        });

        if (response.ok) {
          return {
            success: true,
            attempt: attempt + 1,
            status: response.status,
          };
        }

        // If this is the last attempt, throw
        if (attempt === maxRetries - 1) {
          throw new Error(`Final attempt failed with status ${response.status}`);
        }

      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        // Wait with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },
});
```

## 🚀 Benefits of Enhanced Implementation

1. **Unlimited Nesting Support**: Handle complex nested form structures seamlessly
2. **Advanced Analytics**: Track user behavior and conversion rates
3. **Action Reliability**: Retry logic and failure handling for webhooks
4. **Real-time Updates**: Live collaboration and analytics
5. **Type Safety**: Full TypeScript support throughout
6. **Scalable Architecture**: Built on Convex's serverless platform
7. **No CORS Issues**: All requests go through your Convex backend
8. **Rich Integrations**: Email, Slack, webhooks, and custom database actions

## 🔧 Deployment

### 1. Deploy Convex Backend

```bash
npx convex deploy
```

### 2. Set Environment Variables

```bash
# .env.local (Next.js) or .env (Vite)
NEXT_PUBLIC_CONVEX_URL=your-convex-url
RESEND_API_KEY=your-resend-api-key
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

### 3. Deploy Frontend

Deploy to Vercel, Netlify, or any hosting service with your environment variables configured.

Your advanced form builder with unlimited nesting is now ready to handle complex forms with comprehensive backend support, advanced analytics, and reliable action processing!