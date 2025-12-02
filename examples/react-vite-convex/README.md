# React Vite + Convex Form Builder Example

This example demonstrates how to use the form builder with Convex as a backend, eliminating all CORS issues.

## Features

- ✅ Dynamic form rendering from JSON configuration
- ✅ Form submissions stored in Convex database
- ✅ Webhook forwarding with retry logic
- ✅ No CORS issues - all handled server-side
- ✅ Real-time submission viewing
- ✅ Full TypeScript support

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will:
   - Create a new Convex project (if needed)
   - Generate TypeScript types
   - Start the Convex development server

3. **Create `.env.local` file**
   ```env
   VITE_CONVEX_URL=your_convex_url_here
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

## How It Works

### 1. Form Configuration
Export your form as JSON from the form builder and replace the example in `src/App.tsx`.

### 2. Form Submission Flow
1. User fills out form
2. Form data is sent to Convex
3. Convex stores the submission
4. Convex processes webhooks server-side (no CORS!)
5. Client handles redirects/messages

### 3. Webhook Processing
- Webhooks are processed server-side by Convex
- Automatic retry with exponential backoff
- All attempts are logged
- No CORS issues!

## Project Structure

```
src/
├── App.tsx                 # Main app with form config
├── components/
│   ├── DynamicForm.tsx    # Form renderer
│   └── FormSubmissions.tsx # View submissions
convex/
├── schema.ts              # Database schema
├── formSubmissions.ts     # Submission handlers
└── formActions.ts         # Webhook processing
```

## Customization

### Adding Email Notifications

1. Install an email service (e.g., Resend):
   ```bash
   npm install resend
   ```

2. Add email action to `convex/formActions.ts`:
   ```typescript
   case "email":
     // Send email using Resend/SendGrid/etc
     break;
   ```

### Custom Styling

The form respects all styling from your form builder configuration:
- Primary color
- Button styles
- Input border styles
- Form background

### Adding More Field Types

Add new field types in `DynamicForm.tsx`:
```typescript
case 'your-field-type':
  return (
    // Your custom field component
  );
```

## Production Deployment

1. **Deploy Convex**
   ```bash
   npx convex deploy
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel/Netlify**
   - Set `VITE_CONVEX_URL` environment variable
   - Deploy the `dist` folder

## Example Webhook Payload

When a form is submitted, webhooks receive:
```json
{
  "formData": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  },
  "metadata": {
    "formTitle": "Contact Form",
    "submissionId": "jh7...x9k",
    "timestamp": "2024-01-20T10:30:00Z",
    "attempt": 1
  }
}
```

## Troubleshooting

### Webhooks not working?
- Check the webhook logs in Convex dashboard
- Ensure your webhook endpoint accepts POST requests
- Check for authentication requirements

### Form not submitting?
- Check browser console for errors
- Ensure Convex is running (`npx convex dev`)
- Verify your Convex URL is correct

## Next Steps

1. Add authentication to protect form submissions
2. Implement form analytics
3. Add file upload support
4. Create an admin dashboard
5. Add form validation rules

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Hook Form](https://react-hook-form.com)
- [Form Builder GitHub](https://github.com/your-repo/form-builder)