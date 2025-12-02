# Next.js + Convex Form Builder Example

This example shows how to integrate the form builder directly into a Next.js app with Convex backend.

## Features

- ✅ **Full Form Builder Integration** - Build forms directly in your app
- ✅ **Form Management** - Create, edit, delete, and view forms
- ✅ **Dynamic Form Rendering** - Render saved forms for users to fill
- ✅ **Submission Handling** - Store submissions in Convex
- ✅ **Webhook Processing** - Server-side webhook execution (no CORS!)
- ✅ **Real-time Updates** - Instant updates with Convex

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Convex**
   ```bash
   npx convex dev
   ```

3. **Create `.env.local`**
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

## App Structure

### Pages

- `/` - Home page with example form
- `/builder` - Form builder interface
- `/builder?id=form-123` - Edit existing form
- `/forms` - List all created forms
- `/forms/[id]` - View and fill a specific form
- `/submissions` - View form submissions
- `/admin` - Admin dashboard with stats

### Key Components

- `FormBuilder` - The main form builder component (placeholder)
- `DynamicForm` - Renders forms from JSON configuration
- `FormSubmissions` - Displays form submissions

### Convex Backend

- `forms.ts` - CRUD operations for forms
- `formSubmissions.ts` - Handle form submissions
- `formActions.ts` - Process webhooks and actions

## Integrating the Actual Form Builder

The current implementation includes a placeholder for the form builder. To use the actual form builder:

1. **Copy Form Builder Components**
   ```bash
   # Copy from the main form builder project
   cp -r ../../../src/components/* ./components/FormBuilder/
   cp ../../../src/store/useStore.ts ./store/
   cp ../../../src/types.ts ./types/
   ```

2. **Install Additional Dependencies**
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable
   ```

3. **Update FormBuilder Component**
   Replace the placeholder in `components/FormBuilder/index.tsx` with the actual implementation.

## How It Works

### 1. Building Forms

1. Navigate to `/builder`
2. Use drag-and-drop to add form fields
3. Configure field properties
4. Set form settings (title, actions, styling)
5. Save draft or publish form

### 2. Form Storage

Forms are stored in Convex with:
- Unique form ID
- Complete configuration (settings + elements)
- Timestamps
- Published status

### 3. Form Rendering

1. Load form configuration from Convex
2. `DynamicForm` component renders fields dynamically
3. Handles validation and submission
4. Executes configured actions

### 4. Submission Processing

1. Form data sent to Convex
2. Submission stored in database
3. Webhooks processed server-side
4. Client actions (redirects, messages) executed

## Example Workflows

### Create a Contact Form

1. Go to `/builder`
2. Add fields: Name, Email, Message
3. Configure webhook to your CRM
4. Add success message
5. Save and share form link

### View Submissions

1. Go to `/admin` for overview
2. Click "View Submissions" on any form
3. Export data or integrate with other tools

## Production Deployment

1. **Deploy Convex**
   ```bash
   npx convex deploy
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - `NEXT_PUBLIC_CONVEX_URL`

## Customization

### Add Custom Fields

1. Update types in `types/index.ts`
2. Add rendering logic in `DynamicForm`
3. Add builder UI in form builder components

### Custom Actions

Add new action types in `formActions.ts`:
```typescript
case "email":
  // Send email notification
  break;
case "slack":
  // Post to Slack
  break;
```

### Styling

Forms respect all styling from the builder:
- Primary color
- Button/input styles
- Background color
- Label formatting

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Form Builder Integration Guide](../../FORM_BUILDER_INTEGRATION.md)