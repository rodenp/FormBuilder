import { useState } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { FormSchema } from '@form-builder/core';
import { FormBuilderWrapper } from './components/FormBuilderWrapper';
import { DynamicForm } from './components/DynamicForm';
import { FormSubmissions } from './components/FormSubmissions';
import { TailwindTest } from './TailwindTest';
import './App.css';

// Example form configuration - in real app, this would come from your form builder export
const exampleFormConfig = {
  "id": "form-1234567890",
  "settings": {
    "title": "Contact Us Form",
    "description": "We'd love to hear from you!",
    "submitButtonText": "Send Message",
    "gap": 4,
    "submissionActions": [
      {
        "id": "webhook-1",
        "type": "webhook",
        "enabled": true,
        "webhook": {
          "url": "https://your-webhook-endpoint.com/contact",
          "method": "POST",
          "headers": {}
        }
      },
      {
        "id": "message-1",
        "type": "message",
        "enabled": true,
        "message": "Thank you for contacting us! We'll get back to you soon.",
        "messageType": "success"
      }
    ],
    "primaryColor": "#3B82F6",
    "buttonStyle": "rounded",
    "inputBorderStyle": "rounded"
  },
  "elements": [
    {
      "id": "name-field",
      "type": "text",
      "label": "Full Name",
      "name": "fullName",
      "placeholder": "John Doe",
      "required": true,
      "width": 12
    },
    {
      "id": "email-field",
      "type": "email",
      "label": "Email Address",
      "name": "email",
      "placeholder": "john@example.com",
      "required": true,
      "width": 12
    },
    {
      "id": "subject-field",
      "type": "select",
      "label": "Subject",
      "name": "subject",
      "required": true,
      "width": 12,
      "options": [
        { "label": "General Inquiry", "value": "general" },
        { "label": "Technical Support", "value": "support" },
        { "label": "Billing Question", "value": "billing" },
        { "label": "Other", "value": "other" }
      ]
    },
    {
      "id": "message-field",
      "type": "textarea",
      "label": "Message",
      "name": "message",
      "placeholder": "Tell us more...",
      "required": true,
      "width": 12
    }
  ]
};

// Initialize Convex client - replace with your Convex URL
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "https://your-app.convex.cloud");

function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'form' | 'submissions' | 'test'>('builder');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentFormConfig, setCurrentFormConfig] = useState(exampleFormConfig);

  const handleSuccess = () => {
    setSuccessMessage('Form submitted successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleFormUpdate = (schema: FormSchema) => {
    setCurrentFormConfig(schema);
  };

  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="mb-4 flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'test' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Test Tailwind
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'builder' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Form Builder
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Preview Form
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              View Submissions
            </button>
          </div>

          {successMessage && (
            <div className="max-w-2xl mx-auto mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {activeTab === 'test' && <TailwindTest />}
          
          {activeTab === 'builder' && (
            <div className="h-[800px]">
              <FormBuilderWrapper 
                onSave={handleFormUpdate}
                onPreview={handleFormUpdate}
                initialSchema={currentFormConfig}
              />
            </div>
          )}
          
          {activeTab === 'form' && (
            <DynamicForm 
              formConfig={currentFormConfig}
              onSuccess={handleSuccess}
              onError={(error) => console.error('Form error:', error)}
            />
          )}
          
          {activeTab === 'submissions' && (
            <FormSubmissions formId={currentFormConfig.id} />
          )}
        </div>
      </div>
    </ConvexProvider>
  );
}

export default App;