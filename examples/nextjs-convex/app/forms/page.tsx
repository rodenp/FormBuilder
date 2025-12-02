'use client'

import { useQuery, useMutation } from 'convex/react'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function FormsPage() {
  const forms = useQuery(api.forms.listFormsWithSubmissionCounts)
  const deleteForm = useMutation(api.forms.deleteForm)
  
  const handleDelete = async (formId: string, docId: Id<"forms">) => {
    if (confirm('Are you sure you want to delete this form?')) {
      await deleteForm({ id: docId })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <Link
              href="/builder"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Form
            </Link>
          </div>

          {!forms ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-100 rounded w-20"></div>
                    <div className="h-8 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first form</p>
              <Link
                href="/builder"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Form
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => {
                
                return (
                  <div
                    key={form._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {form.config.settings.title}
                    </h3>
                    {form.config.settings.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {form.config.settings.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{form.config.elements.length} fields</span>
                      <span>{form.submissionCount} submissions</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/builder?id=${form.formId}`}
                        className="flex-1 px-3 py-2 text-center text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/forms/${form.formId}`}
                        className="flex-1 px-3 py-2 text-center text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(form.formId, form._id)}
                        className="px-3 py-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        title="Delete form"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}