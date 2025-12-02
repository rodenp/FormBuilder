'use client'

import { useState } from 'react'
import Link from 'next/link'
import DynamicForm from '@/components/DynamicForm'
import formConfig from '@/formConfig.json'

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Form Builder + Next.js + Convex
            </h1>
            <p className="text-lg text-gray-600">
              Build and test forms with real-time backend integration
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/builder"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Form Builder
              </Link>
              <Link
                href="/submissions"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                View Submissions
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Sample Form</h2>
            <p className="text-gray-600 text-center mb-6">
              This is a sample form created with the Form Builder. Try the Form Builder above to create your own!
            </p>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              Form submitted successfully! Check the submissions page.
            </div>
          )}

          <DynamicForm 
            formConfig={formConfig}
            onSuccess={() => {
              setShowSuccess(true)
              setTimeout(() => setShowSuccess(false), 5000)
            }}
          />
        </div>
      </div>
    </main>
  )
}