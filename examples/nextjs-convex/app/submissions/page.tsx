'use client'

import FormSubmissions from '@/components/FormSubmissions'
import Link from 'next/link'
import formConfig from '@/formConfig.json'

export default function SubmissionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              ← Back to Form
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Form Submissions
          </h1>
          
          <FormSubmissions formId={formConfig.id} />
        </div>
      </div>
    </main>
  )
}